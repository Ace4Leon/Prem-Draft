const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { PACKS, PLAYER_DB } = require('./data/players');
const { assessLineup, publicAssessment, simulateCompetition, positionalFit } = require('./data/allTimePremSimulation');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const STARTING_BUDGET = 100;
const START_TIMER = 15;
const RESET_TIMER = 10;
const NOMINATION_TIMER = 20;
const BLIND_TIE_TIMER = 10;
const MIN_BID = 1;
const DEFAULT_PACK = 'all_time_prem';
const DEFAULT_MODE = 'freeform';

const MODE_LABELS = {
  freeform: 'Freeform Mode',
  nomination: 'Nomination Draft',
  blind: 'Blind Bid Draft',
  hard: 'Hard Mode'
};

const POSITION_ORDER = ['GK','LB','CB','RB','DM','CM','AM','LM','RM','LW','RW','ST'];
const FREEFORM_LIKE_MODES = new Set(['freeform','nomination','blind']);
function isFreeformLike(mode){ return FREEFORM_LIKE_MODES.has(mode); }

// Hard Mode is intentionally unchanged from v3.
const HARD_FORMATIONS = {
  '4-4-2': ['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-3-3': ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-2-3-1': ['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '3-5-2': ['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3': ['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '5-3-2': ['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST']
};

// Freeform formations are only used AFTER the auction. Position eligibility is ignored.
const FREEFORM_FORMATIONS = {
  '4-3-3': ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-4-2': ['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-2-3-1': ['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '4-1-4-1': ['GK','LB','CB','CB','RB','DM','LM','CM','CM','RM','ST'],
  '4-3-1-2': ['GK','LB','CB','CB','RB','CM','CM','CM','AM','ST','ST'],
  '4-2-2-2': ['GK','LB','CB','CB','RB','DM','DM','AM','AM','ST','ST'],
  '4-1-2-1-2': ['GK','LB','CB','CB','RB','DM','CM','CM','AM','ST','ST'],
  '4-3-2-1': ['GK','LB','CB','CB','RB','CM','CM','CM','AM','AM','ST'],
  '3-5-2': ['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3': ['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '3-4-2-1': ['GK','CB','CB','CB','LM','CM','CM','RM','AM','AM','ST'],
  '3-4-1-2': ['GK','CB','CB','CB','LM','CM','CM','RM','AM','ST','ST'],
  '5-3-2': ['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST'],
  '5-2-3': ['GK','LB','CB','CB','CB','RB','CM','CM','LW','ST','RW'],
  '5-4-1': ['GK','LB','CB','CB','CB','RB','LM','CM','CM','RM','ST'],
  '5-2-1-2': ['GK','LB','CB','CB','CB','RB','CM','CM','AM','ST','ST']
};

const FREEFORM_BASE_433 = ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'];
const FREEFORM_CORE_POSITIONS = ['GK','LB','CB','RB','CM','LW','RW','ST'];
const FREEFORM_RANDOM_POSITIONS = ['LB','CB','RB','DM','CM','AM','LM','RM','LW','RW','ST'];

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
function randomChoice(a){ return a[Math.floor(Math.random()*a.length)]; }
function packPlayers(pack){ return pack === 'chaos' ? PLAYER_DB : PLAYER_DB.filter(p=>p.packs.includes(pack)); }
function packCounts(){
  const counts={chaos:PLAYER_DB.length};
  for(const key of Object.keys(PACKS)) counts[key]=packPlayers(key).length;
  return counts;
}
function publicPlayer(p){
  if(!p) return null;
  return {id:p.id,name:p.name,positions:p.positions,assignedPosition:p.assignedPosition,price:p.price,forced:!!p.forced};
}
function managerPublic(m,room,viewerId){
  const blindSecret=room?.mode==='blind' && ['draft','team_build'].includes(room.phase) && m.id!==viewerId;
  if(blindSecret){
    return {
      id:m.id,
      name:m.name,
      formation:null,
      ready:m.ready,
      budget:null,
      squad:[],
      squadCount:null,
      hidden:true,
      finalFormation:null,
      lineup:[],
      teamReady:m.teamReady
    };
  }
  return {
    id:m.id,
    name:m.name,
    formation:m.formation,
    ready:m.ready,
    budget:m.budget,
    squad:m.squad.map(publicPlayer),
    squadCount:m.squad.length,
    hidden:false,
    finalFormation:m.finalFormation,
    lineup:m.lineup,
    teamReady:m.teamReady
  };
}
function freeformScarcityWarnings(room){
  if(room.mode!=='freeform' || room.phase!=='draft' || !room.current) return [];
  const warnings=[];
  const current=room.current.player;
  const future=futurePlayers(room);
  for(const pos of [...new Set(current.positions)]){
    const lacking=[...room.managers.values()].filter(m=>m.squad.length<11 && !m.squad.some(p=>p.positions.includes(pos)));
    if(!lacking.length) continue;
    const remainingAfter=future.filter(p=>p.positions.includes(pos)).length;
    const remainingIncludingCurrent=remainingAfter+1;
    if(remainingIncludingCurrent<=lacking.length){
      warnings.push({
        position:pos,
        managersLacking:lacking.length,
        remainingIncludingCurrent,
        remainingAfter
      });
    }
  }
  return warnings;
}
function sessionPublic(room){
  const history=room.sessionHistory||{drafts:0,matches:[],titles:{}};
  const managers=[...room.managers.values()];
  const rows=new Map(managers.map(m=>[m.id,{id:m.id,name:m.name,drafts:history.drafts,titles:history.titles?.[m.id]||0,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}]));
  for(const match of history.matches||[]){
    const h=rows.get(match.homeId),a=rows.get(match.awayId);if(!h||!a)continue;
    h.p++;a.p++;h.gf+=match.homeGoals;h.ga+=match.awayGoals;a.gf+=match.awayGoals;a.ga+=match.homeGoals;
    if(match.homeGoals>match.awayGoals){h.w++;a.l++;h.pts+=3;}else if(match.homeGoals<match.awayGoals){a.w++;h.l++;a.pts+=3;}else{h.d++;a.d++;h.pts++;a.pts++;}
  }
  for(const r of rows.values())r.gd=r.gf-r.ga;
  const table=[...rows.values()].sort((a,b)=>b.titles-a.titles||b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name));
  const headToHead=[];
  for(let i=0;i<managers.length;i++)for(let j=i+1;j<managers.length;j++){
    const a=managers[i],b=managers[j];let aWins=0,bWins=0,draws=0,aGoals=0,bGoals=0;
    for(const m of history.matches||[]){
      if(m.homeId===a.id&&m.awayId===b.id){aGoals+=m.homeGoals;bGoals+=m.awayGoals;if(m.homeGoals>m.awayGoals)aWins++;else if(m.homeGoals<m.awayGoals)bWins++;else draws++;}
      else if(m.homeId===b.id&&m.awayId===a.id){aGoals+=m.awayGoals;bGoals+=m.homeGoals;if(m.awayGoals>m.homeGoals)aWins++;else if(m.awayGoals<m.homeGoals)bWins++;else draws++;}
    }
    headToHead.push({managerAId:a.id,managerAName:a.name,managerBId:b.id,managerBName:b.name,aWins,bWins,draws,aGoals,bGoals});
  }
  return {drafts:history.drafts||0,table,headToHead};
}
function recordSessionCompetition(room,simulation){
  if(!room.sessionHistory)room.sessionHistory={drafts:0,matches:[],titles:{}};
  room.sessionHistory.drafts++;
  for(const m of simulation.matches||[]){
    room.sessionHistory.matches.push({homeId:m.homeId,awayId:m.awayId,homeGoals:m.homeGoals,awayGoals:m.awayGoals});
  }
  if(simulation.championId)room.sessionHistory.titles[simulation.championId]=(room.sessionHistory.titles[simulation.championId]||0)+1;
}

function nominationAvailablePlayers(room){
  if(room.mode!=='nomination') return [];
  const ids=room.nominationAvailableIds || new Set();
  return room.pool.filter(p=>ids.has(p.id)).map(publicPlayer);
}
function roomPublic(room,viewerId){
  const ratingsVisible = (room.phase==='reveal' || room.phase==='results');
  const teamRatings = ratingsVisible && room.teamAssessments
    ? Object.fromEntries([...room.teamAssessments.entries()].map(([id,a])=>[id,publicAssessment(a)]))
    : null;
  let current=null;
  if(room.current){
    if(room.mode==='blind'){
      const myBid=room.current.blindBids?.get(viewerId) ?? 0;
      const myLocked=room.current.blindLockedIds?.has(viewerId) || false;
      const tieIds=room.current.blindTieEligibleIds || [];
      current={
        player:publicPlayer(room.current.player),
        timeLeft:room.current.timeLeft,
        blindStage:room.current.blindStage||1,
        myBlindBid:myBid,
        myBlindLocked:myLocked,
        blindTiebreakEligible:tieIds.length ? tieIds.includes(viewerId) : true,
        blindMinBid:tieIds.length && tieIds.includes(viewerId) ? (room.current.blindCarryMin?.get(viewerId)||0) : 0,
        paused:!!room.paused
      };
    } else {
      current={
        player: publicPlayer(room.current.player),
        bid: room.current.bid,
        bidderId: room.current.bidderId,
        timeLeft: room.current.timeLeft,
        mandatoryIds: room.current.mandatoryIds,
        bidPosition: room.current.bidPosition,
        scarcityWarnings: freeformScarcityWarnings(room),
        outIds: [...(room.current.outIds || new Set())],
        eligibleIds: currentContenders(room).map(m=>m.id),
        paused:!!room.paused
      };
    }
  }
  const nomination=room.mode==='nomination' ? {
    availablePlayers:nominationAvailablePlayers(room),
    nominatorId:room.nominationNominatorId||null,
    timeLeft:room.current?null:(room.nominationTimeLeft??null),
    finalPickManagerId:room.nominationFinalPickManagerId||null,
    order:(room.nominationOrder||[]).map(id=>({id,name:room.managers.get(id)?.name||'Manager'}))
  } : null;
  const showDraftHistory=['reveal','results','finished'].includes(room.phase);
  return {
    code: room.code,
    hostId: room.hostId,
    phase: room.phase,
    mode: room.mode,
    modeLabels: MODE_LABELS,
    pack: room.pack,
    packLabels: {...PACKS, chaos:'Chaos Mode'},
    packCounts: packCounts(),
    freeformFormations: Object.keys(FREEFORM_FORMATIONS),
    simulationAvailable: true,
    teamRatings,
    simulation: room.phase==='results' ? room.simulation : null,
    simulationRevealCount: room.phase==='results' ? (room.simulationRevealCount||0) : 0,
    simulationKind:room.simulationKind||'official',
    exhibitionNumber:room.exhibitionNumber||0,
    sessionStats: sessionPublic(room),
    managers: [...room.managers.values()].map(m=>managerPublic(m,room,viewerId)),
    current,
    nomination,
    paused:!!room.paused,
    draftHistory:showDraftHistory ? (room.draftHistory||[]) : null,
    auctionIndex: room.auctionIndex,
    shownCount: room.shownCount || 0,
    poolSize: room.initialPoolSize || room.pool.length
  };
}
function emitState(room){
  for(const id of room.managers.keys()) io.to(id).emit('state',roomPublic(room,id));
}

// ---------------- Hard Mode position logic (v3 behaviour) ----------------
function openSlots(m){
  if(!m.formation) return [];
  const remaining = [...HARD_FORMATIONS[m.formation]];
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
function playerFitsManagerHard(player,m){ return positionChoices(player,m).length > 0; }
function maxBidHard(m){
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
function skippingCurrentIsSafeHard(room){ return canMatchPlayersToSlots(futurePlayers(room),slotEntries(room)); }
function forcedManagerOptionsHard(room, player){
  const options=[];
  for(const m of room.managers.values()){
    if(maxBidHard(m)<MIN_BID) continue;
    const pos=bestAssignmentFor(room,player,m);
    if(pos) options.push({manager:m,pos});
  }
  return options;
}
function computeMandatoryHard(room, player){
  if(skippingCurrentIsSafeHard(room)) return [];
  return forcedManagerOptionsHard(room,player).map(x=>x.manager.id);
}

// ---------------- Freeform Mode logic ----------------
function freeformEmptySpots(room){
  let total=0;
  for(const m of room.managers.values()) total += Math.max(0,11-m.squad.length);
  return total;
}
function maxBidFreeform(m){
  const slots=Math.max(0,11-m.squad.length);
  return Math.max(0,m.budget-Math.max(0,slots-1)*MIN_BID);
}
function skippingCurrentIsSafeFreeform(room){
  return futurePlayers(room).length >= freeformEmptySpots(room);
}
function forcedManagerOptionsFreeform(room){
  return [...room.managers.values()].filter(m=>m.squad.length<11 && maxBidFreeform(m)>=MIN_BID);
}
function chooseForcedManagerFreeform(room){
  const options=forcedManagerOptionsFreeform(room);
  if(!options.length)return null;
  const mostOpen=Math.max(...options.map(m=>11-m.squad.length));
  const tied=options.filter(m=>11-m.squad.length===mostOpen);
  // When managers are level this is deliberately pure, equal randomness: no host/order/history weighting.
  return randomChoice(tied);
}
function computeMandatoryFreeform(room){
  if(skippingCurrentIsSafeFreeform(room)) return [];
  return forcedManagerOptionsFreeform(room).map(m=>m.id);
}

function allComplete(room){ return [...room.managers.values()].every(m=>m.squad.length===11); }
function allTeamsReady(room){ return [...room.managers.values()].every(m=>m.teamReady); }


// Auction participation / early resolution. A player is always visible for at least
// five seconds (15 -> 10) before an auction can resolve early.
function managerCanBidCurrent(room,m){
  const c=room.current;
  if(!c || !m) return false;
  const nextBid=c.bid+1;
  if(room.mode==='freeform'||room.mode==='nomination'){
    return m.squad.length<11 && maxBidFreeform(m)>=nextBid;
  }
  if(!playerFitsManagerHard(c.player,m)) return false;
  if(maxBidHard(m)<nextBid) return false;
  return !!bestAssignmentFor(room,c.player,m);
}
function currentContenders(room){
  return [...room.managers.values()].filter(m=>managerCanBidCurrent(room,m));
}
function maybeResolveCurrent(room){
  const c=room.current;
  if(!c || c.timeLeft>RESET_TIMER) return false;
  const contenders=currentContenders(room);
  const outIds=c.outIds || new Set();
  if(c.bidderId){
    const rivals=contenders.filter(m=>m.id!==c.bidderId);
    if(rivals.every(m=>outIds.has(m.id))){
      finishOpenAuction(room);
      return true;
    }
  } else if(contenders.length===0 || contenders.every(m=>outIds.has(m.id))){
    finishOpenAuction(room);
    return true;
  }
  return false;
}

function tierAwareShuffle(candidates){
  // Keep randomness while mixing quality tiers so generated pools are not accidentally all stars/depth.
  const buckets=new Map();
  for(const p of candidates){
    if(!buckets.has(p.tier)) buckets.set(p.tier,[]);
    buckets.get(p.tier).push(p);
  }
  const ordered=[];
  const tiers=[...buckets.keys()].sort((a,b)=>a-b);
  while(ordered.length<candidates.length){
    for(const t of tiers){
      const b=buckets.get(t);
      if(b.length){
        const i=Math.floor(Math.random()*b.length);
        ordered.push(b.splice(i,1)[0]);
      }
    }
  }
  return shuffle(ordered);
}

function buildHardPool(room){
  const db=packPlayers(room.pack);
  const needs={};
  for(const m of room.managers.values()) for(const p of HARD_FORMATIONS[m.formation]) needs[p]=(needs[p]||0)+1;
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
    for(const m of room.managers.values()) HARD_FORMATIONS[m.formation].forEach((pos,i)=>slots.push({key:`${m.id}:${pos}:${i}`,managerId:m.id,pos}));
    if(canMatchPlayersToSlots(selected,slots)) return shuffle(selected);
  }
  throw new Error('Could not build a balanced player pool for these formations and this pack.');
}

function weightedRandomFreeformPosition(gkTarget, managerCount){
  // GK has its own restrained rule: always at least N+1, with only a small chance of N+2.
  if(gkTarget < managerCount+2 && Math.random()<0.08) return 'GK';
  const weighted=[
    'LB','LB','CB','CB','CB','RB','RB',
    'DM','CM','CM','CM','AM','LM','RM',
    'LW','LW','RW','RW','ST','ST','ST'
  ];
  return randomChoice(weighted);
}

function makeFreeformTargets(managerCount){
  const targets=[];
  for(let i=0;i<managerCount;i++) targets.push(...FREEFORM_BASE_433);

  // Each manager adds four depth slots. Odd-numbered managers (1st, 3rd, 5th...)
  // deliberately add one CB and one ST; even-numbered managers add four random slots.
  let randomSlots=0;
  for(let i=0;i<managerCount;i++){
    if(i%2===0){
      targets.push('CB','ST');
      randomSlots+=2;
    } else {
      randomSlots+=4;
    }
  }

  // Guarantee at least one skippable option above the 4-3-3 baseline for each core position.
  const baseCounts={};
  for(const p of FREEFORM_BASE_433) baseCounts[p]=(baseCounts[p]||0)+managerCount;
  const currentCounts={};
  for(const p of targets) currentCounts[p]=(currentCounts[p]||0)+1;
  const missingExtra=shuffle(FREEFORM_CORE_POSITIONS.filter(p=>(currentCounts[p]||0)<(baseCounts[p]||0)+1));
  for(const pos of missingExtra){
    if(randomSlots<=0) break;
    targets.push(pos);
    currentCounts[pos]=(currentCounts[pos]||0)+1;
    randomSlots--;
  }

  while(randomSlots>0){
    const pos=weightedRandomFreeformPosition(currentCounts.GK||0,managerCount);
    if(pos==='GK' && (currentCounts.GK||0)>=managerCount+2) continue;
    targets.push(pos);
    currentCounts[pos]=(currentCounts[pos]||0)+1;
    randomSlots--;
  }

  if(targets.length!==managerCount*15) throw new Error('Freeform pool target generation failed.');
  return targets;
}

function selectUniquePlayersForTargets(db,targets){
  const indexed=targets.map((pos,i)=>({pos,i}));
  indexed.sort((a,b)=>{
    const ca=db.filter(p=>p.positions.includes(a.pos)).length;
    const cb=db.filter(p=>p.positions.includes(b.pos)).length;
    return ca-cb || a.i-b.i;
  });
  const selected=[];
  const selectedIds=new Set();
  for(const t of indexed){
    const candidates=tierAwareShuffle(db.filter(p=>p.positions.includes(t.pos) && !selectedIds.has(p.id)));
    if(!candidates.length) return null;
    const pick=candidates[0];
    selected.push(pick);
    selectedIds.add(pick.id);
  }
  return selected;
}

function hasFreeformCoverage(pool,managerCount){
  if(pool.length!==managerCount*15) return false;
  // Distinct-player matching proves everyone could theoretically build a normal 4-3-3.
  const baselineSlots=[];
  for(let i=0;i<managerCount;i++) FREEFORM_BASE_433.forEach((pos,j)=>baselineSlots.push({key:`${i}:${pos}:${j}`,pos}));
  if(!canMatchPlayersToSlots(pool,baselineSlots)) return false;
  // And each core position has at least one more eligible player than the strict 4-3-3 minimum.
  const baseNeed={GK:managerCount,LB:managerCount,CB:2*managerCount,RB:managerCount,CM:3*managerCount,LW:managerCount,RW:managerCount,ST:managerCount};
  return FREEFORM_CORE_POSITIONS.every(pos=>pool.filter(p=>p.positions.includes(pos)).length>=baseNeed[pos]+1);
}

function buildFreeformPool(room){
  const db=packPlayers(room.pack);
  const managerCount=room.managers.size;
  for(let attempt=0;attempt<500;attempt++){
    const targets=makeFreeformTargets(managerCount);
    const selected=selectUniquePlayersForTargets(db,targets);
    if(selected && hasFreeformCoverage(selected,managerCount)) return shuffle(selected);
  }
  throw new Error('Could not build a balanced Freeform pool for this pack. Try another player pack.');
}

function buildNominationPool(room){
  const base=buildFreeformPool(room);
  const db=packPlayers(room.pack);
  const selectedIds=new Set(base.map(p=>p.id));
  const extraCount=room.managers.size*3;
  const extras=[];
  const weighted=['GK','LB','CB','CB','RB','DM','CM','CM','AM','LM','RM','LW','RW','ST','ST'];
  for(let i=0;i<extraCount;i++){
    const pos=randomChoice(weighted);
    let candidates=db.filter(p=>!selectedIds.has(p.id) && p.positions.includes(pos) && Number(p.tier||4)>=2);
    if(!candidates.length) candidates=db.filter(p=>!selectedIds.has(p.id) && p.positions.includes(pos));
    if(!candidates.length) candidates=db.filter(p=>!selectedIds.has(p.id) && Number(p.tier||4)>=2);
    if(!candidates.length) candidates=db.filter(p=>!selectedIds.has(p.id));
    if(!candidates.length) throw new Error('Could not build a large enough Nomination player pool for this pack.');
    const pick=randomChoice(candidates);
    extras.push(pick);selectedIds.add(pick.id);
  }
  const orderIndex=pos=>{const i=POSITION_ORDER.indexOf(pos);return i<0?999:i;};
  return [...base,...extras].sort((a,b)=>orderIndex(a.positions?.[0])-orderIndex(b.positions?.[0]) || a.name.localeCompare(b.name));
}
function buildPool(room){
  if(room.mode==='hard') return buildHardPool(room);
  if(room.mode==='nomination') return buildNominationPool(room);
  return buildFreeformPool(room);
}

function hardLineupEntries(m){
  const slots=HARD_FORMATIONS[m.formation]||[];
  const used=new Set();
  return slots.map(slot=>{
    let idx=m.squad.findIndex((p,i)=>!used.has(i)&&(p.assignedPosition||p.positions?.[0])===slot);
    if(idx<0) idx=m.squad.findIndex((p,i)=>!used.has(i)&&p.positions?.includes(slot));
    if(idx<0) throw new Error(`Could not build ${m.name}'s Hard Mode XI for simulation.`);
    used.add(idx);
    return {player:m.squad[idx],slot};
  });
}

function bestFitLineup(m,formation){
  const slots=FREEFORM_FORMATIONS[formation]||[];
  const players=m.squad||[];
  if(slots.length!==11||players.length!==11) return players.map(p=>p.id);
  const size=1<<players.length;
  const dp=new Array(size).fill(-Infinity);
  const parent=new Array(size).fill(null);
  dp[0]=0;
  const bitCount=mask=>{let n=0;while(mask){mask&=mask-1;n++;}return n;};
  for(let mask=0;mask<size;mask++){
    if(!Number.isFinite(dp[mask])) continue;
    const slotIndex=bitCount(mask);
    if(slotIndex>=slots.length) continue;
    for(let i=0;i<players.length;i++){
      if(mask&(1<<i)) continue;
      const next=mask|(1<<i);
      const score=dp[mask]+positionalFit(players[i],slots[slotIndex]);
      if(score>dp[next]+1e-9){
        dp[next]=score;
        parent[next]={prev:mask,playerIndex:i};
      }
    }
  }
  const lineup=new Array(11);
  let mask=size-1;
  for(let slotIndex=10;slotIndex>=0;slotIndex--){
    const step=parent[mask];
    if(!step) return players.map(p=>p.id);
    lineup[slotIndex]=players[step.playerIndex].id;
    mask=step.prev;
  }
  return lineup;
}

function freeformLineupEntries(m){
  const slots=FREEFORM_FORMATIONS[m.finalFormation]||[];
  if(slots.length!==11||!Array.isArray(m.lineup)||m.lineup.length!==11) throw new Error(`Could not build ${m.name}'s Freeform XI for simulation.`);
  return slots.map((slot,i)=>{
    const player=m.squad.find(p=>p.id===m.lineup[i]);
    if(!player) throw new Error(`Could not find a selected player in ${m.name}'s XI.`);
    return {player,slot};
  });
}
function buildTeamAssessments(room){
  const map=new Map();
  for(const m of room.managers.values()){
    const entries=isFreeformLike(room.mode) ? freeformLineupEntries(m) : hardLineupEntries(m);
    map.set(m.id,assessLineup(entries,room.pack));
  }
  return map;
}
function enterReveal(room){
  room.teamAssessments=buildTeamAssessments(room);
  room.simulation=null;
  room.phase='reveal';
  emitState(room);
}
function enterPostDraft(room){
  clearInterval(room.timer); room.timer=null; room.current=null;
  if(isFreeformLike(room.mode)){
    room.phase='team_build';
    for(const m of room.managers.values()){
      m.finalFormation=null;
      m.lineup=[];
      m.teamReady=false;
    }
    emitState(room);
  } else {
    enterReveal(room);
  }
}

function recordDraftHistory(room,c,winnerId=null,price=0,forced=false){
  if(!room.draftHistory) room.draftHistory=[];
  room.draftHistory.push({
    player:publicPlayer(c.player),
    winnerId,
    winnerName:winnerId ? (room.managers.get(winnerId)?.name||'Manager') : null,
    price:Number(price)||0,
    forced:!!forced,
    noSale:!winnerId
  });
}
function sendAuctionNotice(room,id,message,type='info'){
  io.to(id).emit('auctionNotice',{message,type});
}
function startOpenAuctionTimer(room){
  clearInterval(room.timer);
  room.timer=setInterval(()=>{
    if(!room.current) return;
    if(room.paused) return;
    room.current.timeLeft--;
    if(room.current.timeLeft<=0) finishOpenAuction(room);
    else if(!maybeResolveCurrent(room)) io.to(room.code).emit('tick',{timeLeft:room.current.timeLeft});
  },1000);
}
function startSequentialNext(room){
  if(allComplete(room)) return enterPostDraft(room);
  let player=null;
  while(room.auctionIndex < room.pool.length){
    const candidate=room.pool[room.auctionIndex++];
    if(room.mode==='hard'){
      if([...room.managers.values()].some(m=>playerFitsManagerHard(candidate,m))){player=candidate;break;}
    }else{
      if([...room.managers.values()].some(m=>m.squad.length<11)){player=candidate;break;}
    }
  }
  if(!player){
    room.phase='finished';room.current=null;clearInterval(room.timer);room.timer=null;emitState(room);return;
  }
  room.shownCount=(room.shownCount||0)+1;
  if(room.mode==='blind'){
    room.current={
      player,timeLeft:START_TIMER,blindStage:1,
      blindBids:new Map([...room.managers.values()].filter(m=>m.squad.length<11).map(m=>[m.id,0])),
      blindLockedIds:new Set(),blindTieEligibleIds:[],blindCarryMin:new Map()
    };
    emitState(room);startBlindTimer(room);return;
  }
  room.current={player,bid:0,bidderId:null,bidPosition:null,timeLeft:START_TIMER,mandatoryIds:[],outIds:new Set(),openingBid:0,openingBidderId:null};
  room.current.mandatoryIds=room.mode==='freeform' ? computeMandatoryFreeform(room) : computeMandatoryHard(room,player);
  emitState(room);startOpenAuctionTimer(room);
}
function nominationIncomplete(room){return [...room.managers.values()].filter(m=>m.squad.length<11);}
function startNominationTurn(room){
  clearInterval(room.timer);room.timer=null;room.current=null;room.nominationFinalPickManagerId=null;
  if(allComplete(room)) return enterPostDraft(room);
  const incomplete=nominationIncomplete(room);
  if(incomplete.length===1){
    room.nominationNominatorId=null;room.nominationTimeLeft=null;room.nominationFinalPickManagerId=incomplete[0].id;emitState(room);return;
  }
  const order=room.nominationOrder||[];
  if(!order.length){room.phase='finished';emitState(room);return;}
  let found=null;
  for(let step=1;step<=order.length;step++){
    const idx=(room.nominationCursor+step+order.length)%order.length;
    const m=room.managers.get(order[idx]);
    if(m&&m.squad.length<11){found={id:m.id,idx};break;}
  }
  if(!found){return enterPostDraft(room);}
  room.nominationCursor=found.idx;room.nominationNominatorId=found.id;room.nominationTimeLeft=NOMINATION_TIMER;
  emitState(room);
  room.timer=setInterval(()=>{
    if(room.paused)return;
    if(room.current){clearInterval(room.timer);room.timer=null;return;}
    room.nominationTimeLeft--;
    if(room.nominationTimeLeft<=0){
      clearInterval(room.timer);room.timer=null;
      const available=room.pool.filter(p=>room.nominationAvailableIds?.has(p.id));
      if(!available.length){room.phase='finished';emitState(room);return;}
      const player=randomChoice(available);
      const m=room.managers.get(room.nominationNominatorId);
      if(!m)return startNominationTurn(room);
      startNominationAuction(room,m,player,MIN_BID);
    }else io.to(room.code).emit('nominationTick',{timeLeft:room.nominationTimeLeft});
  },1000);
}
function startNominationAuction(room,m,player,openingBid){
  clearInterval(room.timer);room.timer=null;room.nominationTimeLeft=null;room.nominationNominatorId=null;
  room.nominationAvailableIds?.delete(player.id);
  room.shownCount=(room.shownCount||0)+1;
  room.current={player,bid:openingBid,bidderId:m.id,bidPosition:null,timeLeft:START_TIMER,mandatoryIds:[],outIds:new Set(),openingBid,openingBidderId:m.id};
  emitState(room);startOpenAuctionTimer(room);
}
function advanceAfterAuction(room){
  if(room.mode==='nomination') setTimeout(()=>startNominationTurn(room),1200);
  else setTimeout(()=>startSequentialNext(room),1200);
}
function finishOpenAuction(room){
  clearInterval(room.timer);room.timer=null;
  const c=room.current;if(!c)return;
  let winnerId=null,price=0,forced=false;
  if(c.bidderId){
    const m=room.managers.get(c.bidderId);
    if(isFreeformLike(room.mode)){
      if(m&&m.squad.length<11){m.budget-=c.bid;m.squad.push({...c.player,price:c.bid});winnerId=m.id;price=c.bid;}
    }else if(m&&c.bidPosition&&positionChoices(c.player,m).includes(c.bidPosition)){
      m.budget-=c.bid;m.squad.push({...c.player,assignedPosition:c.bidPosition,price:c.bid});winnerId=m.id;price=c.bid;
    }
  }else if(room.mode==='freeform'&&!skippingCurrentIsSafeFreeform(room)){
    const pick=chooseForcedManagerFreeform(room);
    if(pick){pick.budget-=MIN_BID;pick.squad.push({...c.player,price:MIN_BID,forced:true});winnerId=pick.id;price=MIN_BID;forced=true;}
  }else if(room.mode==='hard'&&!skippingCurrentIsSafeHard(room)){
    const options=forcedManagerOptionsHard(room,c.player);
    if(options.length){const pick=randomChoice(options);pick.manager.budget-=MIN_BID;pick.manager.squad.push({...c.player,assignedPosition:pick.pos,price:MIN_BID,forced:true});winnerId=pick.manager.id;price=MIN_BID;forced=true;}
  }
  recordDraftHistory(room,c,winnerId,price,forced);
  room.current=null;emitState(room);advanceAfterAuction(room);
}
function blindParticipants(room,c=room.current){
  if(!c)return[];
  if((c.blindStage||1)===2) return (c.blindTieEligibleIds||[]).map(id=>room.managers.get(id)).filter(Boolean);
  return [...room.managers.values()].filter(m=>m.squad.length<11);
}
function allBlindLocked(room){
  const c=room.current;if(!c)return false;
  const ps=blindParticipants(room,c);return ps.length>0&&ps.every(m=>c.blindLockedIds?.has(m.id));
}
function maybeResolveBlind(room){
  const c=room.current;if(!c||room.mode!=='blind')return false;
  if((c.blindStage||1)===1&&c.timeLeft>RESET_TIMER)return false;
  if(allBlindLocked(room)){resolveBlindRound(room);return true;}
  return false;
}
function startBlindTimer(room){
  clearInterval(room.timer);
  room.timer=setInterval(()=>{
    if(!room.current)return;
    if(room.paused)return;
    room.current.timeLeft--;
    if(room.current.timeLeft<=0) resolveBlindRound(room);
    else if(!maybeResolveBlind(room)) io.to(room.code).emit('tick',{timeLeft:room.current.timeLeft});
  },1000);
}
function resolveBlindRound(room){
  clearInterval(room.timer);room.timer=null;
  const c=room.current;if(!c)return;
  const participants=blindParticipants(room,c);
  const values=participants.map(m=>({m,bid:Number(c.blindBids?.get(m.id)||0)}));
  const max=Math.max(0,...values.map(x=>x.bid));
  const top=values.filter(x=>x.bid===max&&max>0);
  if((c.blindStage||1)===1&&top.length>1){
    c.blindStage=2;c.blindTieEligibleIds=top.map(x=>x.m.id);c.blindCarryMin=new Map(top.map(x=>[x.m.id,x.bid]));
    c.blindLockedIds=new Set();c.timeLeft=BLIND_TIE_TIMER;
    c.blindSettledNoticeIds=new Set(values.filter(x=>!c.blindTieEligibleIds.includes(x.m.id)).map(x=>x.m.id));
    for(const x of values){
      if(c.blindTieEligibleIds.includes(x.m.id)) sendAuctionNotice(room,x.m.id,`Highest bid tied for ${c.player.name} — tiebreak.`,`tie`);
      else if(x.bid>0) sendAuctionNotice(room,x.m.id,`You didn’t win ${c.player.name}.`,`lost`);
      else sendAuctionNotice(room,x.m.id,`Auction closed for ${c.player.name}.`,`closed`);
    }
    emitState(room);startBlindTimer(room);return;
  }
  let winner=null,price=0,forced=false;
  if(top.length===1){winner=top[0].m;price=max;}
  else if(top.length>1){winner=randomChoice(top).m;price=max;}
  else if(!skippingCurrentIsSafeFreeform(room)){
    winner=chooseForcedManagerFreeform(room);price=winner?MIN_BID:0;forced=!!winner;
  }
  if(winner){winner.budget-=price;winner.squad.push({...c.player,price,forced});}
  for(const m of room.managers.values()){
    if(c.blindSettledNoticeIds?.has(m.id))continue;
    const bid=Number(c.blindBids?.get(m.id)||0);
    if(winner&&m.id===winner.id) sendAuctionNotice(room,m.id,forced?`You were assigned ${c.player.name} for £1m.`:`You won ${c.player.name} for £${price}m.`,`won`);
    else if(bid>0) sendAuctionNotice(room,m.id,`You didn’t win ${c.player.name}.`,`lost`);
    else sendAuctionNotice(room,m.id,`Auction closed for ${c.player.name}.`,`closed`);
  }
  recordDraftHistory(room,c,winner?.id||null,price,forced);
  room.current=null;emitState(room);setTimeout(()=>startSequentialNext(room),1200);
}

function resetManagerForDraft(m){
  m.budget=STARTING_BUDGET;
  m.squad=[];
  m.finalFormation=null;
  m.lineup=[];
  m.teamReady=false;
}
function validLineup(m){
  if(!m.finalFormation || !FREEFORM_FORMATIONS[m.finalFormation]) return false;
  if(!Array.isArray(m.lineup) || m.lineup.length!==11) return false;
  const squadIds=m.squad.map(p=>p.id);
  const ids=m.lineup.filter(x=>x!==null && x!==undefined);
  return ids.length===11 && new Set(ids).size===11 && ids.every(id=>squadIds.includes(id));
}

io.on('connection', socket=>{
  socket.on('createRoom', ({name},cb)=>{
    const code=roomCode();
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[],finalFormation:null,lineup:[],teamReady:false};
    const room={
      code,hostId:socket.id,phase:'lobby',mode:DEFAULT_MODE,pack:DEFAULT_PACK,managers:new Map([[socket.id,m]]),
      pool:[],initialPoolSize:0,auctionIndex:0,shownCount:0,current:null,timer:null,paused:false,
      teamAssessments:null,simulation:null,officialSimulation:null,simulationKind:'official',exhibitionNumber:0,simulationRevealCount:0,
      draftHistory:[],sessionHistory:{drafts:0,matches:[],titles:{}},
      nominationAvailableIds:new Set(),nominationOrder:[],nominationCursor:-1,nominationNominatorId:null,nominationTimeLeft:null,nominationFinalPickManagerId:null
    };
    rooms.set(code,room);socket.join(code);socket.data.room=code;
    cb?.({ok:true,code,state:roomPublic(room,socket.id)});emitState(room);
  });

  socket.on('joinRoom', ({code,name},cb)=>{
    code=String(code||'').toUpperCase();const room=rooms.get(code);
    if(!room||room.phase!=='lobby')return cb?.({ok:false,error:'Room not found or draft already started.'});
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[],finalFormation:null,lineup:[],teamReady:false};
    room.managers.set(socket.id,m);socket.join(code);socket.data.room=code;
    cb?.({ok:true,state:roomPublic(room,socket.id)});emitState(room);
  });

  socket.on('setPack', ({pack})=>{
    const room=rooms.get(socket.data.room);const valid=pack==='chaos'||Object.prototype.hasOwnProperty.call(PACKS,pack);
    if(!room||room.phase!=='lobby'||socket.id!==room.hostId||!valid)return;
    room.pack=pack;for(const m of room.managers.values())m.ready=false;emitState(room);
  });

  socket.on('setMode', ({mode})=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='lobby'||socket.id!==room.hostId||!MODE_LABELS[mode])return;
    room.mode=mode;
    for(const m of room.managers.values()){m.ready=false;if(mode!=='hard')m.formation=null;}
    emitState(room);
  });

  socket.on('setFormation', ({formation})=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='lobby'||room.mode!=='hard'||!HARD_FORMATIONS[formation])return;
    const m=room.managers.get(socket.id);if(!m)return;
    m.formation=formation;m.ready=false;emitState(room);
  });

  socket.on('setReady', ({ready})=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='lobby')return;
    const m=room.managers.get(socket.id);if(!m)return;
    if(room.mode==='hard'&&!m.formation)return;
    m.ready=!!ready;emitState(room);
  });

  socket.on('startDraft', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||socket.id!==room.hostId)return;
    if(room.managers.size<2)return cb?.({ok:false,error:'At least 2 managers are required.'});
    if([...room.managers.values()].some(m=>!m.ready))return cb?.({ok:false,error:'Everyone must be ready.'});
    if(room.mode==='hard'&&[...room.managers.values()].some(m=>!m.formation))return cb?.({ok:false,error:'Everyone must choose a formation and be ready.'});
    for(const m of room.managers.values())resetManagerForDraft(m);
    room.teamAssessments=null;room.simulation=null;room.officialSimulation=null;room.simulationKind='official';room.exhibitionNumber=0;room.simulationRevealCount=0;
    room.draftHistory=[];room.paused=false;room.current=null;clearInterval(room.timer);room.timer=null;
    try{room.pool=buildPool(room);}catch(e){return cb?.({ok:false,error:e.message});}
    room.initialPoolSize=room.pool.length;room.auctionIndex=0;room.shownCount=0;room.phase='draft';
    if(room.mode==='nomination'){
      room.nominationAvailableIds=new Set(room.pool.map(p=>p.id));room.nominationOrder=shuffle([...room.managers.keys()]);room.nominationCursor=-1;
      room.nominationNominatorId=null;room.nominationTimeLeft=null;room.nominationFinalPickManagerId=null;
    }
    cb?.({ok:true});
    if(room.mode==='nomination')startNominationTurn(room);else startSequentialNext(room);
  });

  socket.on('bid', ({amount},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c||room.mode==='blind')return;
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    let cap=0;
    if(room.mode==='freeform'||room.mode==='nomination'){
      if(m.squad.length>=11)return cb?.({ok:false,error:'Your squad is already complete.'});
      cap=maxBidFreeform(m);
    }else{
      if(!playerFitsManagerHard(c.player,m))return cb?.({ok:false,error:'This player does not fit an open position in your formation.'});
      const assignPos=bestAssignmentFor(room,c.player,m);
      if(!assignPos)return cb?.({ok:false,error:'Buying this player in your remaining slots would make it impossible for all teams to complete an XI.'});
      c.bidPosition=assignPos;cap=maxBidHard(m);
    }
    let bid=Number(amount);const min=c.bid+1;if(!Number.isFinite(bid))bid=min;bid=Math.floor(bid);
    if(bid<min)return cb?.({ok:false,error:`Minimum bid is £${min}m.`});
    if(bid>cap)return cb?.({ok:false,error:`Your maximum safe bid is £${cap}m.`});
    c.bid=bid;c.bidderId=m.id;c.outIds?.delete(m.id);if(c.timeLeft<RESET_TIMER)c.timeLeft=RESET_TIMER;
    cb?.({ok:true});if(!maybeResolveCurrent(room))emitState(room);
  });

  socket.on('setAuctionOut', ({out},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c||room.mode==='blind')return cb?.({ok:false,error:'No active open auction.'});
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    if(c.bidderId===m.id&&out)return cb?.({ok:false,error:'You are currently winning this player.'});
    if(out&&!managerCanBidCurrent(room,m))return cb?.({ok:false,error:'You cannot bid on this player.'});
    if(!c.outIds)c.outIds=new Set();if(out)c.outIds.add(m.id);else c.outIds.delete(m.id);
    cb?.({ok:true});if(!maybeResolveCurrent(room))emitState(room);
  });

  socket.on('nominatePlayer', ({playerId,openingBid},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='draft'||room.mode!=='nomination'||room.current||room.nominationFinalPickManagerId)return cb?.({ok:false,error:'It is not a nomination turn.'});
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    if(room.nominationNominatorId!==socket.id)return cb?.({ok:false,error:'It is not your turn to nominate.'});
    const pid=Number(playerId);const player=room.pool.find(p=>p.id===pid&&room.nominationAvailableIds?.has(p.id));
    if(!player)return cb?.({ok:false,error:'That player is no longer available.'});
    let bid=Math.floor(Number(openingBid));if(!Number.isFinite(bid)||bid<MIN_BID)return cb?.({ok:false,error:'Opening bid must be at least £1m.'});
    const cap=maxBidFreeform(m);if(bid>cap)return cb?.({ok:false,error:`Your maximum safe opening bid is £${cap}m.`});
    cb?.({ok:true});startNominationAuction(room,m,player,bid);
  });

  socket.on('nominationFinalPick', ({playerId},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='draft'||room.mode!=='nomination'||room.nominationFinalPickManagerId!==socket.id||!m)return;
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    if(m.squad.length>=11)return cb?.({ok:false,error:'Your squad is complete.'});
    const pid=Number(playerId);const player=room.pool.find(p=>p.id===pid&&room.nominationAvailableIds?.has(p.id));
    if(!player)return cb?.({ok:false,error:'That player is no longer available.'});
    if(m.budget<MIN_BID)return cb?.({ok:false,error:'You do not have £1m available.'});
    room.nominationAvailableIds.delete(player.id);m.budget-=MIN_BID;m.squad.push({...player,price:MIN_BID});
    recordDraftHistory(room,{player},m.id,MIN_BID,false);cb?.({ok:true});
    if(m.squad.length===11)enterPostDraft(room);else emitState(room);
  });

  socket.on('setBlindBid', ({amount},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);const c=room?.current;
    if(!room||room.phase!=='draft'||room.mode!=='blind'||!m||!c)return;
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    if(c.blindLockedIds?.has(m.id))return cb?.({ok:false,error:'Unlock your decision before changing it.'});
    const participants=blindParticipants(room,c);if(!participants.some(x=>x.id===m.id))return cb?.({ok:false,error:'You are not part of this bidding round.'});
    let bid=Math.floor(Number(amount));if(!Number.isFinite(bid)||bid<0)bid=0;
    const min=(c.blindStage||1)===2?(c.blindCarryMin?.get(m.id)||0):0;
    if(bid<min)return cb?.({ok:false,error:`Your tiebreak bid cannot be lower than £${min}m.`});
    const cap=maxBidFreeform(m);if(bid>cap)return cb?.({ok:false,error:`Your maximum safe bid is £${cap}m.`});
    c.blindBids.set(m.id,bid);cb?.({ok:true});
  });

  socket.on('setBlindLock', ({locked},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);const c=room?.current;
    if(!room||room.phase!=='draft'||room.mode!=='blind'||!m||!c)return;
    if(room.paused)return cb?.({ok:false,error:'The draft is paused.'});
    const participants=blindParticipants(room,c);if(!participants.some(x=>x.id===m.id))return cb?.({ok:false,error:'You are not part of this bidding round.'});
    if(!c.blindLockedIds)c.blindLockedIds=new Set();if(locked)c.blindLockedIds.add(m.id);else c.blindLockedIds.delete(m.id);
    cb?.({ok:true});emitState(room);maybeResolveBlind(room);
  });

  socket.on('setFinalFormation', ({formation})=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||!isFreeformLike(room.mode)||!m||!FREEFORM_FORMATIONS[formation])return;
    m.finalFormation=formation;m.teamReady=false;m.lineup=bestFitLineup(m,formation);emitState(room);
  });

  socket.on('setLineupSlot', ({slotIndex,playerId})=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||!isFreeformLike(room.mode)||!m||!m.finalFormation)return;
    const idx=Number(slotIndex),pid=Number(playerId);if(!Number.isInteger(idx)||idx<0||idx>10||!m.squad.some(p=>p.id===pid))return;
    if(!Array.isArray(m.lineup)||m.lineup.length!==11)m.lineup=m.squad.map(p=>p.id);
    const oldIndex=m.lineup.indexOf(pid),displaced=m.lineup[idx];if(oldIndex>=0&&oldIndex!==idx)m.lineup[oldIndex]=displaced;
    m.lineup[idx]=pid;m.teamReady=false;emitState(room);
  });

  socket.on('setTeamReady', ({ready},cb)=>{
    const room=rooms.get(socket.data.room);const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||!isFreeformLike(room.mode)||!m)return;
    if(ready&&!validLineup(m))return cb?.({ok:false,error:'Choose a formation and place all 11 players before setting your team.'});
    m.teamReady=!!ready;cb?.({ok:true});if(allTeamsReady(room))enterReveal(room);else emitState(room);
  });

  socket.on('commissionPause', ({paused},cb)=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='draft'||socket.id!==room.hostId)return;
    room.paused=!!paused;cb?.({ok:true});emitState(room);
  });

  socket.on('commissionRestartAuction', (_,cb)=>{
    const room=rooms.get(socket.data.room);const c=room?.current;
    if(!room||room.phase!=='draft'||socket.id!==room.hostId||!c)return cb?.({ok:false,error:'There is no active auction to restart.'});
    clearInterval(room.timer);room.timer=null;
    if(room.mode==='blind'){
      c.timeLeft=START_TIMER;c.blindStage=1;c.blindTieEligibleIds=[];c.blindCarryMin=new Map();c.blindLockedIds=new Set();c.blindSettledNoticeIds=new Set();
      c.blindBids=new Map([...room.managers.values()].filter(m=>m.squad.length<11).map(m=>[m.id,0]));emitState(room);startBlindTimer(room);
    }else{
      c.timeLeft=START_TIMER;c.outIds=new Set();c.bidPosition=null;c.bid=c.openingBid||0;c.bidderId=c.openingBidderId||null;
      c.mandatoryIds=room.mode==='freeform'?computeMandatoryFreeform(room):(room.mode==='hard'?computeMandatoryHard(room,c.player):[]);
      emitState(room);startOpenAuctionTimer(room);
    }
    cb?.({ok:true});
  });

  socket.on('commissionSkipCurrent', (_,cb)=>{
    const room=rooms.get(socket.data.room);const c=room?.current;
    if(!room||room.phase!=='draft'||socket.id!==room.hostId||!c)return cb?.({ok:false,error:'There is no active player to skip.'});
    if((room.mode==='freeform'||room.mode==='blind')&&!skippingCurrentIsSafeFreeform(room))return cb?.({ok:false,error:'This player cannot be skipped because the remaining pool is needed to complete the squads.'});
    if(room.mode==='hard'&&!skippingCurrentIsSafeHard(room))return cb?.({ok:false,error:'This player cannot be skipped because Hard Mode needs them to complete the formations.'});
    clearInterval(room.timer);room.timer=null;recordDraftHistory(room,c,null,0,false);
    if(room.mode==='blind')for(const m of room.managers.values())sendAuctionNotice(room,m.id,`Commissioner skipped ${c.player.name}.`,`closed`);
    room.current=null;emitState(room);cb?.({ok:true});advanceAfterAuction(room);
  });

  socket.on('commissionAbandonDraft', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||!['draft','team_build'].includes(room.phase)||socket.id!==room.hostId)return;
    clearInterval(room.timer);room.timer=null;room.phase='lobby';room.pool=[];room.initialPoolSize=0;room.auctionIndex=0;room.shownCount=0;room.current=null;room.paused=false;
    room.teamAssessments=null;room.simulation=null;room.officialSimulation=null;room.simulationRevealCount=0;room.draftHistory=[];
    room.nominationAvailableIds=new Set();room.nominationOrder=[];room.nominationNominatorId=null;room.nominationTimeLeft=null;room.nominationFinalPickManagerId=null;
    for(const m of room.managers.values()){resetManagerForDraft(m);m.ready=false;if(room.mode!=='hard')m.formation=null;}
    cb?.({ok:true});emitState(room);
  });

  socket.on('startSimulation', (_,cb)=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='reveal'||socket.id!==room.hostId||!room.teamAssessments)return;
    const teams=[...room.managers.values()].map(m=>({id:m.id,name:m.name,assessment:room.teamAssessments.get(m.id)}));
    room.simulation=simulateCompetition(teams);room.officialSimulation=room.simulation;room.simulationKind='official';room.exhibitionNumber=0;room.simulationRevealCount=0;
    recordSessionCompetition(room,room.simulation);room.phase='results';cb?.({ok:true});emitState(room);
  });

  socket.on('resimulateSeason', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.teamAssessments||!room.officialSimulation)return;
    const total=room.simulation?.matches?.length||0;if((room.simulationRevealCount||0)<total)return cb?.({ok:false,error:'Finish revealing the current simulation first.'});
    const teams=[...room.managers.values()].map(m=>({id:m.id,name:m.name,assessment:room.teamAssessments.get(m.id)}));
    room.simulation=simulateCompetition(teams);room.simulationKind='exhibition';room.exhibitionNumber=(room.exhibitionNumber||0)+1;room.simulationRevealCount=0;
    cb?.({ok:true});emitState(room);
  });

  socket.on('viewOfficialSimulation', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.officialSimulation)return;
    room.simulation=room.officialSimulation;room.simulationKind='official';room.simulationRevealCount=room.simulation.matches?.length||0;cb?.({ok:true});emitState(room);
  });

  socket.on('revealNextMatch', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.simulation)return;
    const total=room.simulation.matches?.length||0;room.simulationRevealCount=Math.min(total,(room.simulationRevealCount||0)+1);cb?.({ok:true});emitState(room);
  });

  socket.on('revealAllMatches', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.simulation)return;
    room.simulationRevealCount=room.simulation.matches?.length||0;cb?.({ok:true});emitState(room);
  });

  socket.on('playAgain', (_,cb)=>{
    const room=rooms.get(socket.data.room);if(!room||!['finished','reveal','results'].includes(room.phase)||socket.id!==room.hostId)return;
    clearInterval(room.timer);room.timer=null;room.phase='lobby';room.pool=[];room.initialPoolSize=0;room.auctionIndex=0;room.shownCount=0;room.current=null;room.paused=false;
    room.teamAssessments=null;room.simulation=null;room.officialSimulation=null;room.simulationKind='official';room.exhibitionNumber=0;room.simulationRevealCount=0;room.draftHistory=[];
    room.nominationAvailableIds=new Set();room.nominationOrder=[];room.nominationCursor=-1;room.nominationNominatorId=null;room.nominationTimeLeft=null;room.nominationFinalPickManagerId=null;
    for(const m of room.managers.values()){resetManagerForDraft(m);m.ready=false;if(room.mode!=='hard')m.formation=null;}
    cb?.({ok:true});emitState(room);
  });

  socket.on('disconnect',()=>{
    const code=socket.data.room;const room=rooms.get(code);if(!room)return;
    room.managers.delete(socket.id);
    if(room.managers.size===0){clearInterval(room.timer);rooms.delete(code);return;}
    if(room.hostId===socket.id)room.hostId=[...room.managers.keys()][0];
    if(room.mode==='nomination')room.nominationOrder=(room.nominationOrder||[]).filter(id=>id!==socket.id);
    emitState(room);
  });
});

server.listen(PORT,()=>console.log(`Prem Draft running on http://localhost:${PORT}`));
