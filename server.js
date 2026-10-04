const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { PACKS, PLAYER_DB } = require('./data/players');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const STARTING_BUDGET = 100;
const START_TIMER = 15;
const RESET_TIMER = 10;
const MIN_BID = 1;
const DEFAULT_PACK = 'all_time_prem';

const FORMATIONS = {
  '4-4-2': ['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-3-3': ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-2-3-1': ['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '3-5-2': ['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3': ['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '5-3-2': ['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST']
};

const rooms = new Map();

function roomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  do { out = Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); } while (rooms.has(out));
  return out;
}
function cleanName(s){ return String(s||'').trim().slice(0,20) || 'Manager'; }
function shuffle(a){
  const out=[...a];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}
function packPlayers(pack){ return pack === 'chaos' ? PLAYER_DB : PLAYER_DB.filter(p=>p.packs.includes(pack)); }
function packCounts(){
  const counts={chaos:PLAYER_DB.length};
  for(const key of Object.keys(PACKS)) counts[key]=packPlayers(key).length;
  return counts;
}
function managerPublic(m){ return {id:m.id,name:m.name,formation:m.formation,ready:m.ready,budget:m.budget,squad:m.squad}; }
function roomPublic(room){
  return {
    code: room.code, hostId: room.hostId, phase: room.phase,
    pack: room.pack,
    packLabels: {...PACKS, chaos:'Chaos Mode'},
    packCounts: packCounts(),
    managers: [...room.managers.values()].map(managerPublic),
    current: room.current ? {player: room.current.player, bid: room.current.bid, bidderId: room.current.bidderId, timeLeft: room.current.timeLeft, mandatoryIds: room.current.mandatoryIds, bidPosition: room.current.bidPosition} : null,
    auctionIndex: room.auctionIndex, poolSize: room.pool.length
  };
}
function openSlots(m){
  if(!m.formation) return [];
  const remaining = [...FORMATIONS[m.formation]];
  for(const p of m.squad){
    const assigned = p.assignedPosition || p.positions?.[0];
    const idx = remaining.indexOf(assigned);
    if(idx >= 0) remaining.splice(idx, 1);
  }
  return remaining;
}
function positionChoices(player,m){
  const open = openSlots(m);
  return player.positions.filter(pos => open.includes(pos));
}
function playerFitsManager(player,m){ return positionChoices(player,m).length > 0; }
function maxBid(m){
  const slots = openSlots(m).length;
  return Math.max(0, m.budget - Math.max(0, slots-1)*MIN_BID);
}
function slotEntries(room){
  const out=[];
  for(const m of room.managers.values()) openSlots(m).forEach((pos,i)=>out.push({key:`${m.id}:${pos}:${i}`,managerId:m.id,pos}));
  return out;
}
function canMatchPlayersToSlots(players, slots){
  if(slots.length===0) return true;
  if(players.length < slots.length) return false;
  const match = new Map();
  function dfs(slotIndex, seen){
    const slot=slots[slotIndex];
    for(const p of players){
      if(seen.has(p.id) || !p.positions.includes(slot.pos)) continue;
      seen.add(p.id);
      if(!match.has(p.id) || dfs(match.get(p.id), seen)){
        match.set(p.id, slotIndex);
        return true;
      }
    }
    return false;
  }
  for(let i=0;i<slots.length;i++) if(!dfs(i,new Set())) return false;
  return true;
}
function slotsAfterAssignment(room, managerId, pos){
  const slots=slotEntries(room);
  const idx=slots.findIndex(s=>s.managerId===managerId && s.pos===pos);
  if(idx<0) return null;
  slots.splice(idx,1);
  return slots;
}
function futurePlayers(room){ return room.pool.slice(room.auctionIndex); }
function feasibleAssignment(room, managerId, pos){
  const slots=slotsAfterAssignment(room,managerId,pos);
  return !!slots && canMatchPlayersToSlots(futurePlayers(room),slots);
}
function bestAssignmentFor(room, player, m){
  for(const pos of positionChoices(player,m)) if(feasibleAssignment(room,m.id,pos)) return pos;
  return null;
}
function skippingCurrentIsSafe(room){ return canMatchPlayersToSlots(futurePlayers(room),slotEntries(room)); }
function forcedManagerOptions(room, player){
  const options=[];
  for(const m of room.managers.values()){
    if(maxBid(m)<MIN_BID) continue;
    const pos=bestAssignmentFor(room,player,m);
    if(pos) options.push({manager:m,pos});
  }
  return options;
}
function computeMandatory(room, player){
  if(skippingCurrentIsSafe(room)) return [];
  return forcedManagerOptions(room,player).map(x=>x.manager.id);
}
function allComplete(room){ return [...room.managers.values()].every(m=>m.squad.length===11); }

function tierAwareShuffle(candidates){
  // Keep randomness, but avoid every draft accidentally being all superstars or all depth players.
  const buckets=new Map();
  for(const p of candidates){ if(!buckets.has(p.tier)) buckets.set(p.tier,[]); buckets.get(p.tier).push(p); }
  const ordered=[];
  const tiers=[...buckets.keys()].sort((a,b)=>a-b);
  while(ordered.length<candidates.length){
    for(const t of tiers){
      const b=buckets.get(t);
      if(b.length){ const i=Math.floor(Math.random()*b.length); ordered.push(b.splice(i,1)[0]); }
    }
  }
  // add a final shuffle so tier isn't visible as an auction-order pattern
  return shuffle(ordered);
}

function buildPool(room){
  const db=packPlayers(room.pack);
  const needs={};
  for(const m of room.managers.values()) for(const p of FORMATIONS[m.formation]) needs[p]=(needs[p]||0)+1;
  const positions=Object.keys(needs).sort((a,b)=>{
    const ca=db.filter(p=>p.positions.includes(a)).length;
    const cb=db.filter(p=>p.positions.includes(b)).length;
    return ca-cb;
  });

  for(let attempt=0; attempt<300; attempt++){
    const selected=[]; const selectedIds=new Set();
    let failed=false;
    for(const pos of positions){
      const want=needs[pos]+1;
      const candidates=tierAwareShuffle(db.filter(p=>p.positions.includes(pos) && !selectedIds.has(p.id)));
      if(candidates.length < want){ failed=true; break; }
      for(const p of candidates.slice(0,want)){ selected.push(p); selectedIds.add(p.id); }
    }
    if(failed) continue;
    const slots=[];
    for(const m of room.managers.values()) FORMATIONS[m.formation].forEach((pos,i)=>slots.push({key:`${m.id}:${pos}:${i}`,managerId:m.id,pos}));
    if(canMatchPlayersToSlots(selected,slots)) return shuffle(selected);
  }
  throw new Error('Could not build a balanced player pool for these formations and this pack.');
}

function startNext(room){
  if(allComplete(room)){
    room.phase='finished'; room.current=null; clearInterval(room.timer); room.timer=null; io.to(room.code).emit('state', roomPublic(room)); return;
  }

  let player=null;
  while(room.auctionIndex < room.pool.length){
    const candidate=room.pool[room.auctionIndex++];
    if([...room.managers.values()].some(m=>playerFitsManager(candidate,m))){ player=candidate; break; }
  }
  if(!player){
    room.phase='finished'; room.current=null; clearInterval(room.timer); room.timer=null; io.to(room.code).emit('state', roomPublic(room)); return;
  }

  room.current={player,bid:0,bidderId:null,bidPosition:null,timeLeft:START_TIMER,mandatoryIds:[]};
  room.current.mandatoryIds=computeMandatory(room,player);
  io.to(room.code).emit('state', roomPublic(room));
  clearInterval(room.timer);
  room.timer=setInterval(()=>{
    if(!room.current) return;
    room.current.timeLeft--;
    if(room.current.timeLeft<=0) finishAuction(room);
    else io.to(room.code).emit('tick',{timeLeft:room.current.timeLeft});
  },1000);
}
function finishAuction(room){
  clearInterval(room.timer); room.timer=null;
  const c=room.current; if(!c) return;
  if(c.bidderId){
    const m=room.managers.get(c.bidderId);
    if(m && c.bidPosition && positionChoices(c.player,m).includes(c.bidPosition)) {
      m.budget-=c.bid;
      m.squad.push({...c.player, assignedPosition:c.bidPosition, price:c.bid});
    }
  } else if(!skippingCurrentIsSafe(room)){
    // Agreed rule: if the player cannot safely be skipped and nobody bids,
    // choose randomly among eligible MANAGERS (not position-options), for £1m.
    const options=forcedManagerOptions(room,c.player);
    if(options.length){
      const pick=options[Math.floor(Math.random()*options.length)];
      pick.manager.budget-=MIN_BID;
      pick.manager.squad.push({...c.player, assignedPosition:pick.pos, price:MIN_BID, forced:true});
    }
  }
  room.current=null;
  io.to(room.code).emit('state', roomPublic(room));
  setTimeout(()=>startNext(room),1200);
}

io.on('connection', socket=>{
  socket.on('createRoom', ({name},cb)=>{
    const code=roomCode();
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[]};
    const room={code,hostId:socket.id,phase:'lobby',pack:DEFAULT_PACK,managers:new Map([[socket.id,m]]),pool:[],auctionIndex:0,current:null,timer:null};
    rooms.set(code,room); socket.join(code); socket.data.room=code; cb?.({ok:true,code,state:roomPublic(room)});
    io.to(code).emit('state',roomPublic(room));
  });
  socket.on('joinRoom', ({code,name},cb)=>{
    code=String(code||'').toUpperCase(); const room=rooms.get(code);
    if(!room || room.phase!=='lobby') return cb?.({ok:false,error:'Room not found or draft already started.'});
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[]};
    room.managers.set(socket.id,m); socket.join(code); socket.data.room=code; cb?.({ok:true,state:roomPublic(room)}); io.to(code).emit('state',roomPublic(room));
  });
  socket.on('setPack', ({pack})=>{
    const room=rooms.get(socket.data.room);
    const valid=pack==='chaos'||Object.prototype.hasOwnProperty.call(PACKS,pack);
    if(!room||room.phase!=='lobby'||socket.id!==room.hostId||!valid) return;
    room.pack=pack;
    for(const m of room.managers.values()) m.ready=false;
    io.to(room.code).emit('state',roomPublic(room));
  });
  socket.on('setFormation', ({formation})=>{
    const room=rooms.get(socket.data.room); if(!room||room.phase!=='lobby'||!FORMATIONS[formation]) return;
    const m=room.managers.get(socket.id); if(!m) return; m.formation=formation; m.ready=false; io.to(room.code).emit('state',roomPublic(room));
  });
  socket.on('setReady', ({ready})=>{
    const room=rooms.get(socket.data.room); if(!room||room.phase!=='lobby') return;
    const m=room.managers.get(socket.id); if(!m||!m.formation) return; m.ready=!!ready; io.to(room.code).emit('state',roomPublic(room));
  });
  socket.on('startDraft', (_,cb)=>{
    const room=rooms.get(socket.data.room); if(!room||socket.id!==room.hostId) return;
    if(room.managers.size<2) return cb?.({ok:false,error:'At least 2 managers are required.'});
    if([...room.managers.values()].some(m=>!m.formation||!m.ready)) return cb?.({ok:false,error:'Everyone must choose a formation and be ready.'});
    for(const m of room.managers.values()){m.budget=STARTING_BUDGET;m.squad=[];}
    try { room.pool=buildPool(room); } catch(e) { return cb?.({ok:false,error:e.message}); }
    room.auctionIndex=0; room.phase='draft'; cb?.({ok:true}); startNext(room);
  });
  socket.on('bid', ({amount},cb)=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id); const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c) return;
    if(!playerFitsManager(c.player,m)) return cb?.({ok:false,error:'This player does not fit an open position in your formation.'});
    const assignPos=bestAssignmentFor(room,c.player,m);
    if(!assignPos) return cb?.({ok:false,error:'Buying this player in your remaining slots would make it impossible for all teams to complete an XI.'});
    let bid=Number(amount); const min=c.bid+1; if(!Number.isFinite(bid)) bid=min; bid=Math.floor(bid);
    if(bid<min) return cb?.({ok:false,error:`Minimum bid is £${min}m.`});
    const cap=maxBid(m); if(bid>cap) return cb?.({ok:false,error:`Your maximum safe bid is £${cap}m.`});
    c.bid=bid;c.bidderId=m.id;c.bidPosition=assignPos;
    if(c.timeLeft<RESET_TIMER) c.timeLeft=RESET_TIMER;
    cb?.({ok:true}); io.to(room.code).emit('state',roomPublic(room));
  });
  socket.on('playAgain', (_,cb)=>{
    const room=rooms.get(socket.data.room); if(!room||room.phase!=='finished'||socket.id!==room.hostId) return;
    room.phase='lobby'; room.pool=[]; room.auctionIndex=0; room.current=null;
    for(const m of room.managers.values()){m.budget=STARTING_BUDGET;m.squad=[];m.ready=false;}
    cb?.({ok:true}); io.to(room.code).emit('state',roomPublic(room));
  });
  socket.on('disconnect',()=>{
    const code=socket.data.room; const room=rooms.get(code); if(!room) return;
    room.managers.delete(socket.id);
    if(room.managers.size===0){clearInterval(room.timer);rooms.delete(code);return;}
    if(room.hostId===socket.id) room.hostId=[...room.managers.keys()][0];
    io.to(code).emit('state',roomPublic(room));
  });
});

server.listen(PORT,()=>console.log(`Prem Draft running on http://localhost:${PORT}`));
