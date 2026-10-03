const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const STARTING_BUDGET = 100;
const START_TIMER = 15;
const RESET_TIMER = 10;
const MIN_BID = 1;

const FORMATIONS = {
  '4-4-2': ['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-3-3': ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-2-3-1': ['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '3-5-2': ['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3': ['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '5-3-2': ['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST']
};

const PLAYER_DB = [
  ['Petr Cech',['GK']],['Edwin van der Sar',['GK']],['David de Gea',['GK']],['Alisson',['GK']],['Pepe Reina',['GK']],['Shay Given',['GK']],['Joe Hart',['GK']],['Brad Friedel',['GK']],['Hugo Lloris',['GK']],['Jens Lehmann',['GK']],['Tim Howard',['GK']],['Emiliano Martinez',['GK']],
  ['Ashley Cole',['LB']],['Patrice Evra',['LB']],['Andrew Robertson',['LB']],['Leighton Baines',['LB']],['Gael Clichy',['LB']],['John Arne Riise',['LB']],['Cesar Azpilicueta',['LB','RB','CB']],['Luke Shaw',['LB']],
  ['Kyle Walker',['RB']],['Gary Neville',['RB']],['Branislav Ivanovic',['RB','CB']],['Trent Alexander-Arnold',['RB']],['Pablo Zabaleta',['RB']],['Bacary Sagna',['RB']],['Kieran Trippier',['RB']],['Lauren',['RB']],
  ['John Terry',['CB']],['Rio Ferdinand',['CB']],['Nemanja Vidic',['CB']],['Virgil van Dijk',['CB']],['Vincent Kompany',['CB']],['Sol Campbell',['CB']],['Jamie Carragher',['CB']],['Ricardo Carvalho',['CB']],['Ledley King',['CB']],['Kolo Toure',['CB']],['Jaap Stam',['CB']],['William Gallas',['CB']],['Sami Hyypia',['CB']],['Martin Keown',['CB']],['Wes Morgan',['CB']],['Toby Alderweireld',['CB']],['Jan Vertonghen',['CB']],['Ruben Dias',['CB']],['Gary Cahill',['CB']],['Joleon Lescott',['CB']],
  ['Claude Makelele',['DM','CM']],['N’Golo Kante',['DM','CM']],['Rodri',['DM','CM']],['Michael Carrick',['DM','CM']],['Gilberto Silva',['DM','CM']],['Javier Mascherano',['DM','CM']],['Fernandinho',['DM','CM']],['Declan Rice',['DM','CM']],
  ['Steven Gerrard',['CM','AM']],['Frank Lampard',['CM','AM']],['Paul Scholes',['CM']],['Patrick Vieira',['CM','DM']],['Yaya Toure',['CM','AM','DM']],['Cesc Fabregas',['CM','AM']],['David Silva',['CM','AM']],['Kevin De Bruyne',['CM','AM']],['Roy Keane',['CM','DM']],['Xabi Alonso',['CM','DM']],['Luka Modric',['CM']],['Mousa Dembele',['CM']],['Gareth Barry',['CM','DM']],['Mikel Arteta',['CM','AM']],['James Milner',['CM','LM','RM']],['Tim Cahill',['CM','AM']],['Michael Essien',['CM','DM']],['Jordan Henderson',['CM','DM']],['Bruno Fernandes',['AM','CM']],['Martin Odegaard',['AM','CM']],['Juan Mata',['AM','RM']],['Mesut Ozil',['AM']],
  ['Ryan Giggs',['LM','LW']],['Gareth Bale',['LW','LM','RW']],['Eden Hazard',['LW','AM']],['Robert Pires',['LW','LM']],['Sadio Mane',['LW','RW','ST']],['Son Heung-min',['LW','ST']],['Raheem Sterling',['LW','RW']],['Damien Duff',['LM','LW']],['Nani',['LW','RW']],
  ['Mohamed Salah',['RW','ST']],['Cristiano Ronaldo',['LW','RW','ST']],['David Beckham',['RM']],['Riyad Mahrez',['RW','RM']],['Freddie Ljungberg',['RM','RW']],['Antonio Valencia',['RM','RW']],['Bukayo Saka',['RW']],['Bernardo Silva',['RW','AM','CM']],
  ['Thierry Henry',['ST','LW']],['Sergio Aguero',['ST']],['Wayne Rooney',['ST','AM']],['Harry Kane',['ST']],['Didier Drogba',['ST']],['Alan Shearer',['ST']],['Ruud van Nistelrooy',['ST']],['Robin van Persie',['ST']],['Luis Suarez',['ST']],['Erling Haaland',['ST']],['Fernando Torres',['ST']],['Andy Cole',['ST']],['Dwight Yorke',['ST']],['Teddy Sheringham',['ST']],['Dimitar Berbatov',['ST']],['Jermain Defoe',['ST']],['Peter Crouch',['ST']],['Jamie Vardy',['ST']],['Carlos Tevez',['ST']],['Nicolas Anelka',['ST']],['Jimmy Floyd Hasselbaink',['ST']],['Olivier Giroud',['ST']],['Romelu Lukaku',['ST']],['Emmanuel Adebayor',['ST']],['Robbie Keane',['ST']]
].map(([name, positions], i) => ({ id: i+1, name, positions }));

const rooms = new Map();

function roomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  do { out = Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); } while (rooms.has(out));
  return out;
}
function cleanName(s){ return String(s||'').trim().slice(0,20) || 'Manager'; }
function shuffle(a){ return [...a].sort(()=>Math.random()-0.5); }
function managerPublic(m){ return {id:m.id,name:m.name,formation:m.formation,ready:m.ready,budget:m.budget,squad:m.squad}; }
function roomPublic(room){
  return {
    code: room.code, hostId: room.hostId, phase: room.phase,
    managers: [...room.managers.values()].map(managerPublic),
    current: room.current ? {player: room.current.player, bid: room.current.bid, bidderId: room.current.bidderId, timeLeft: room.current.timeLeft, mandatoryIds: room.current.mandatoryIds} : null,
    auctionIndex: room.auctionIndex, poolSize: room.pool.length,
    winner: room.winner || null
  };
}
function openSlots(m){
  if(!m.formation) return [];
  const required = [...FORMATIONS[m.formation]];
  const used = Array(required.length).fill(false);
  for(const p of m.squad){
    const idx = required.findIndex((slot,i)=>!used[i] && p.positions.includes(slot));
    if(idx>=0) used[idx]=true;
  }
  return required.filter((_,i)=>!used[i]);
}
function playerFitsManager(player,m){ return openSlots(m).some(slot=>player.positions.includes(slot)); }
function maxBid(m){
  const slots = openSlots(m).length;
  return Math.max(0, m.budget - Math.max(0, slots-1)*MIN_BID);
}
function totalDemandForPosition(room, pos){
  let n=0;
  for(const m of room.managers.values()) n += openSlots(m).filter(s=>s===pos).length;
  return n;
}
function remainingEligible(room,pos){
  const rest = room.pool.slice(room.auctionIndex);
  return rest.filter(p=>p.positions.includes(pos)).length + (room.current && room.current.player.positions.includes(pos) ? 1 : 0);
}
function computeMandatory(room, player){
  const ids=[];
  for(const m of room.managers.values()){
    const slots=openSlots(m);
    let must=false;
    for(const pos of player.positions){
      if(slots.includes(pos)){
        const demand=totalDemandForPosition(room,pos);
        const supply=remainingEligible(room,pos);
        if(supply<=demand) must=true;
      }
    }
    if(must && maxBid(m)>=MIN_BID) ids.push(m.id);
  }
  return ids;
}
function allComplete(room){ return [...room.managers.values()].every(m=>m.squad.length===11); }
function buildPool(room){
  const needs={};
  for(const m of room.managers.values()) for(const p of FORMATIONS[m.formation]) needs[p]=(needs[p]||0)+1;
  const selected=[]; const selectedIds=new Set();
  const positions=Object.keys(needs);
  for(const pos of positions){
    const want=needs[pos]+1;
    const candidates=shuffle(PLAYER_DB.filter(p=>p.positions.includes(pos) && !selectedIds.has(p.id)));
    for(const p of candidates.slice(0,want)){ selected.push(p); selectedIds.add(p.id); }
  }
  return shuffle(selected);
}
function startNext(room){
  if(allComplete(room) || room.auctionIndex>=room.pool.length){
    room.phase='finished'; room.current=null; clearInterval(room.timer); room.timer=null; io.to(room.code).emit('state', roomPublic(room)); return;
  }
  const player=room.pool[room.auctionIndex++];
  room.current={player,bid:0,bidderId:null,timeLeft:START_TIMER,mandatoryIds:[]};
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
    if(m && playerFitsManager(c.player,m)) { m.budget-=c.bid; m.squad.push({...c.player, price:c.bid}); }
  } else if(c.mandatoryIds.length){
    // Forced fallback: if nobody clicks, one mandatory manager receives the player for £1m.
    // Prefer the manager with fewest compatible alternatives left, then lower remaining budget.
    const eligible=c.mandatoryIds.map(id=>room.managers.get(id)).filter(Boolean).sort((a,b)=>maxBid(a)-maxBid(b));
    const m=eligible[0];
    if(m && playerFitsManager(c.player,m) && maxBid(m)>=1){ m.budget-=1; m.squad.push({...c.player, price:1, forced:true}); }
  }
  room.current=null;
  io.to(room.code).emit('state', roomPublic(room));
  setTimeout(()=>startNext(room),1200);
}

io.on('connection', socket=>{
  socket.on('createRoom', ({name},cb)=>{
    const code=roomCode();
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[]};
    const room={code,hostId:socket.id,phase:'lobby',managers:new Map([[socket.id,m]]),pool:[],auctionIndex:0,current:null,timer:null};
    rooms.set(code,room); socket.join(code); socket.data.room=code; cb?.({ok:true,code,state:roomPublic(room)});
    io.to(code).emit('state',roomPublic(room));
  });
  socket.on('joinRoom', ({code,name},cb)=>{
    code=String(code||'').toUpperCase(); const room=rooms.get(code);
    if(!room || room.phase!=='lobby') return cb?.({ok:false,error:'Room not found or draft already started.'});
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[]};
    room.managers.set(socket.id,m); socket.join(code); socket.data.room=code; cb?.({ok:true,state:roomPublic(room)}); io.to(code).emit('state',roomPublic(room));
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
    room.pool=buildPool(room); room.auctionIndex=0; room.phase='draft'; cb?.({ok:true}); startNext(room);
  });
  socket.on('bid', ({amount},cb)=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id); const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c) return;
    if(!playerFitsManager(c.player,m)) return cb?.({ok:false,error:'This player does not fit an open position in your formation.'});
    let bid=Number(amount); const min=c.bid+1; if(!Number.isFinite(bid)) bid=min; bid=Math.floor(bid);
    if(bid<min) return cb?.({ok:false,error:`Minimum bid is £${min}m.`});
    const cap=maxBid(m); if(bid>cap) return cb?.({ok:false,error:`Your maximum safe bid is £${cap}m.`});
    c.bid=bid;c.bidderId=m.id;
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
