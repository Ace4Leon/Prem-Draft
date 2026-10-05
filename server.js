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
const MIN_BID = 1;
const DEFAULT_PACK = 'all_time_prem';
const DEFAULT_MODE = 'freeform';

const MODE_LABELS = {
  hard: 'Hard Mode',
  freeform: 'Freeform Mode'
};

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
function managerPublic(m){
  return {
    id:m.id,
    name:m.name,
    formation:m.formation,
    ready:m.ready,
    budget:m.budget,
    squad:m.squad.map(publicPlayer),
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

function roomPublic(room){
  const ratingsVisible = (room.phase==='reveal' || room.phase==='results');
  const teamRatings = ratingsVisible && room.teamAssessments
    ? Object.fromEntries([...room.teamAssessments.entries()].map(([id,a])=>[id,publicAssessment(a)]))
    : null;
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
    sessionStats: sessionPublic(room),
    managers: [...room.managers.values()].map(managerPublic),
    current: room.current ? {
      player: publicPlayer(room.current.player),
      bid: room.current.bid,
      bidderId: room.current.bidderId,
      timeLeft: room.current.timeLeft,
      mandatoryIds: room.current.mandatoryIds,
      bidPosition: room.current.bidPosition,
      scarcityWarnings: freeformScarcityWarnings(room),
      outIds: [...(room.current.outIds || new Set())],
      eligibleIds: currentContenders(room).map(m=>m.id)
    } : null,
    auctionIndex: room.auctionIndex,
    shownCount: room.shownCount || 0,
    poolSize: room.pool.length
  };
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
  if(room.mode==='freeform'){
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
      finishAuction(room);
      return true;
    }
  } else if(contenders.length===0 || contenders.every(m=>outIds.has(m.id))){
    finishAuction(room);
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

function buildPool(room){ return room.mode==='freeform' ? buildFreeformPool(room) : buildHardPool(room); }

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
    const entries=room.mode==='freeform' ? freeformLineupEntries(m) : hardLineupEntries(m);
    map.set(m.id,assessLineup(entries,room.pack));
  }
  return map;
}
function enterReveal(room){
  room.teamAssessments=buildTeamAssessments(room);
  room.simulation=null;
  room.phase='reveal';
  io.to(room.code).emit('state',roomPublic(room));
}
function enterPostDraft(room){
  clearInterval(room.timer); room.timer=null; room.current=null;
  if(room.mode==='freeform'){
    room.phase='team_build';
    for(const m of room.managers.values()){
      m.finalFormation=null;
      m.lineup=[];
      m.teamReady=false;
    }
    io.to(room.code).emit('state',roomPublic(room));
  } else {
    enterReveal(room);
  }
}

function startNext(room){
  if(allComplete(room)) return enterPostDraft(room);

  let player=null;
  while(room.auctionIndex < room.pool.length){
    const candidate=room.pool[room.auctionIndex++];
    if(room.mode==='freeform'){
      if([...room.managers.values()].some(m=>m.squad.length<11)){ player=candidate; break; }
    } else if([...room.managers.values()].some(m=>playerFitsManagerHard(candidate,m))){
      player=candidate; break;
    }
  }
  if(!player){
    room.phase='finished'; room.current=null; clearInterval(room.timer); room.timer=null;
    io.to(room.code).emit('state', roomPublic(room)); return;
  }

  room.shownCount=(room.shownCount||0)+1;
  room.current={player,bid:0,bidderId:null,bidPosition:null,timeLeft:START_TIMER,mandatoryIds:[],outIds:new Set()};
  room.current.mandatoryIds=room.mode==='freeform' ? computeMandatoryFreeform(room) : computeMandatoryHard(room,player);
  io.to(room.code).emit('state', roomPublic(room));
  clearInterval(room.timer);
  room.timer=setInterval(()=>{
    if(!room.current) return;
    room.current.timeLeft--;
    if(room.current.timeLeft<=0) finishAuction(room);
    else if(!maybeResolveCurrent(room)) io.to(room.code).emit('tick',{timeLeft:room.current.timeLeft});
  },1000);
}

function finishAuction(room){
  clearInterval(room.timer); room.timer=null;
  const c=room.current; if(!c) return;

  if(c.bidderId){
    const m=room.managers.get(c.bidderId);
    if(room.mode==='freeform'){
      if(m && m.squad.length<11){
        m.budget-=c.bid;
        m.squad.push({...c.player,price:c.bid});
      }
    } else if(m && c.bidPosition && positionChoices(c.player,m).includes(c.bidPosition)){
      m.budget-=c.bid;
      m.squad.push({...c.player,assignedPosition:c.bidPosition,price:c.bid});
    }
  } else if(room.mode==='freeform' && !skippingCurrentIsSafeFreeform(room)){
    const pick=chooseForcedManagerFreeform(room);
    if(pick){
      pick.budget-=MIN_BID;
      pick.squad.push({...c.player,price:MIN_BID,forced:true});
    }
  } else if(room.mode==='hard' && !skippingCurrentIsSafeHard(room)){
    const options=forcedManagerOptionsHard(room,c.player);
    if(options.length){
      const pick=randomChoice(options);
      pick.manager.budget-=MIN_BID;
      pick.manager.squad.push({...c.player,assignedPosition:pick.pos,price:MIN_BID,forced:true});
    }
  }

  room.current=null;
  io.to(room.code).emit('state', roomPublic(room));
  setTimeout(()=>startNext(room),1200);
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
    const room={code,hostId:socket.id,phase:'lobby',mode:DEFAULT_MODE,pack:DEFAULT_PACK,managers:new Map([[socket.id,m]]),pool:[],auctionIndex:0,shownCount:0,current:null,timer:null,teamAssessments:null,simulation:null,simulationRevealCount:0,sessionHistory:{drafts:0,matches:[],titles:{}}};
    rooms.set(code,room); socket.join(code); socket.data.room=code; cb?.({ok:true,code,state:roomPublic(room)});
    io.to(code).emit('state',roomPublic(room));
  });

  socket.on('joinRoom', ({code,name},cb)=>{
    code=String(code||'').toUpperCase(); const room=rooms.get(code);
    if(!room || room.phase!=='lobby') return cb?.({ok:false,error:'Room not found or draft already started.'});
    const m={id:socket.id,name:cleanName(name),formation:null,ready:false,budget:STARTING_BUDGET,squad:[],finalFormation:null,lineup:[],teamReady:false};
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

  socket.on('setMode', ({mode})=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='lobby'||socket.id!==room.hostId||!MODE_LABELS[mode]) return;
    room.mode=mode;
    for(const m of room.managers.values()){
      m.ready=false;
      if(mode==='freeform') m.formation=null;
    }
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setFormation', ({formation})=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='lobby'||room.mode!=='hard'||!HARD_FORMATIONS[formation]) return;
    const m=room.managers.get(socket.id);
    if(!m) return;
    m.formation=formation; m.ready=false;
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setReady', ({ready})=>{
    const room=rooms.get(socket.data.room); if(!room||room.phase!=='lobby') return;
    const m=room.managers.get(socket.id); if(!m) return;
    if(room.mode==='hard'&&!m.formation) return;
    m.ready=!!ready;
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('startDraft', (_,cb)=>{
    const room=rooms.get(socket.data.room); if(!room||socket.id!==room.hostId) return;
    if(room.managers.size<2) return cb?.({ok:false,error:'At least 2 managers are required.'});
    if([...room.managers.values()].some(m=>!m.ready)) return cb?.({ok:false,error:'Everyone must be ready.'});
    if(room.mode==='hard' && [...room.managers.values()].some(m=>!m.formation)) return cb?.({ok:false,error:'Everyone must choose a formation and be ready.'});
    for(const m of room.managers.values()) resetManagerForDraft(m);
    room.teamAssessments=null; room.simulation=null; room.simulationRevealCount=0;
    try { room.pool=buildPool(room); } catch(e) { return cb?.({ok:false,error:e.message}); }
    room.auctionIndex=0; room.shownCount=0; room.phase='draft'; cb?.({ok:true}); startNext(room);
  });

  socket.on('bid', ({amount},cb)=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id); const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c) return;

    let cap=0;
    if(room.mode==='freeform'){
      if(m.squad.length>=11) return cb?.({ok:false,error:'Your squad is already complete.'});
      cap=maxBidFreeform(m);
    } else {
      if(!playerFitsManagerHard(c.player,m)) return cb?.({ok:false,error:'This player does not fit an open position in your formation.'});
      const assignPos=bestAssignmentFor(room,c.player,m);
      if(!assignPos) return cb?.({ok:false,error:'Buying this player in your remaining slots would make it impossible for all teams to complete an XI.'});
      c.bidPosition=assignPos;
      cap=maxBidHard(m);
    }

    let bid=Number(amount); const min=c.bid+1; if(!Number.isFinite(bid)) bid=min; bid=Math.floor(bid);
    if(bid<min) return cb?.({ok:false,error:`Minimum bid is £${min}m.`});
    if(bid>cap) return cb?.({ok:false,error:`Your maximum safe bid is £${cap}m.`});
    c.bid=bid; c.bidderId=m.id;
    c.outIds?.delete(m.id);
    if(c.timeLeft<RESET_TIMER) c.timeLeft=RESET_TIMER;
    cb?.({ok:true});
    if(!maybeResolveCurrent(room)) io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setAuctionOut', ({out},cb)=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id); const c=room?.current;
    if(!room||room.phase!=='draft'||!m||!c) return cb?.({ok:false,error:'No active auction.'});
    if(c.bidderId===m.id && out) return cb?.({ok:false,error:'You are currently winning this player.'});
    if(out && !managerCanBidCurrent(room,m)) return cb?.({ok:false,error:'You cannot bid on this player.'});
    if(!c.outIds) c.outIds=new Set();
    if(out) c.outIds.add(m.id); else c.outIds.delete(m.id);
    cb?.({ok:true});
    if(!maybeResolveCurrent(room)) io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setFinalFormation', ({formation})=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||room.mode!=='freeform'||!m||!FREEFORM_FORMATIONS[formation]) return;
    m.finalFormation=formation;
    m.teamReady=false;
    m.lineup=bestFitLineup(m,formation);
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setLineupSlot', ({slotIndex,playerId})=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||room.mode!=='freeform'||!m||!m.finalFormation) return;
    const idx=Number(slotIndex); const pid=Number(playerId);
    if(!Number.isInteger(idx)||idx<0||idx>10||!m.squad.some(p=>p.id===pid)) return;
    if(!Array.isArray(m.lineup)||m.lineup.length!==11) m.lineup=m.squad.map(p=>p.id);
    const oldIndex=m.lineup.indexOf(pid);
    const displaced=m.lineup[idx];
    if(oldIndex>=0 && oldIndex!==idx) m.lineup[oldIndex]=displaced;
    m.lineup[idx]=pid;
    m.teamReady=false;
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('setTeamReady', ({ready},cb)=>{
    const room=rooms.get(socket.data.room); const m=room?.managers.get(socket.id);
    if(!room||room.phase!=='team_build'||room.mode!=='freeform'||!m) return;
    if(ready && !validLineup(m)) return cb?.({ok:false,error:'Choose a formation and place all 11 players before setting your team.'});
    m.teamReady=!!ready;
    cb?.({ok:true});
    if(allTeamsReady(room)){
      enterReveal(room);
    } else {
      io.to(room.code).emit('state',roomPublic(room));
    }
  });

  socket.on('startSimulation', (_,cb)=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='reveal'||socket.id!==room.hostId||!room.teamAssessments) return;
    const teams=[...room.managers.values()].map(m=>({id:m.id,name:m.name,assessment:room.teamAssessments.get(m.id)}));
    room.simulation=simulateCompetition(teams);
    room.simulationRevealCount=0;
    recordSessionCompetition(room,room.simulation);
    room.phase='results';
    cb?.({ok:true});
    io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('revealNextMatch', (_,cb)=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.simulation) return;
    const total=room.simulation.matches?.length||0;
    room.simulationRevealCount=Math.min(total,(room.simulationRevealCount||0)+1);
    cb?.({ok:true});io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('revealAllMatches', (_,cb)=>{
    const room=rooms.get(socket.data.room);
    if(!room||room.phase!=='results'||socket.id!==room.hostId||!room.simulation) return;
    room.simulationRevealCount=room.simulation.matches?.length||0;
    cb?.({ok:true});io.to(room.code).emit('state',roomPublic(room));
  });

  socket.on('playAgain', (_,cb)=>{
    const room=rooms.get(socket.data.room); if(!room||!['finished','reveal','results'].includes(room.phase)||socket.id!==room.hostId) return;
    room.phase='lobby'; room.pool=[]; room.auctionIndex=0; room.shownCount=0; room.current=null; room.teamAssessments=null; room.simulation=null; room.simulationRevealCount=0;
    for(const m of room.managers.values()){
      resetManagerForDraft(m);
      m.ready=false;
      if(room.mode==='freeform') m.formation=null;
    }
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
