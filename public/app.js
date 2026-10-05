const socket=io();
const app=document.querySelector('#app');
const toast=document.querySelector('#toast');
let state=null;
let meId=null;
let tab='draft';
let selectedLineupSlot=null;
let resultsTab='season';
let statsMetric='goals';

const VISUAL_THEME_KEY='premDraftVisualTheme';
let visualTheme='classic';
try{
  visualTheme=localStorage.getItem(VISUAL_THEME_KEY)==='immersive'?'immersive':'classic';
}catch{}
function applyVisualTheme(){
  document.body.dataset.theme=visualTheme;
  document.body.dataset.pack=state?.pack||'home';
}
function themeButtonLabel(){return visualTheme==='immersive'?'✨ Immersive':'◻ Classic'}
function setVisualTheme(next){
  visualTheme=next==='immersive'?'immersive':'classic';
  try{localStorage.setItem(VISUAL_THEME_KEY,visualTheme)}catch{}
  applyVisualTheme();
  const button=document.querySelector('#themeToggle');
  if(button){
    button.textContent=themeButtonLabel();
    button.setAttribute('aria-label',`Visual theme: ${visualTheme}. Tap to switch.`);
  }
}
function wireThemeToggle(){
  const button=document.querySelector('#themeToggle');
  if(button)button.onclick=()=>setVisualTheme(visualTheme==='classic'?'immersive':'classic');
}

const HARD_FORMATIONS=['4-4-2','4-3-3','4-2-3-1','3-5-2','3-4-3','5-3-2'];
const HARD_SLOTS={
  '4-4-2':['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-3-3':['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-2-3-1':['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '3-5-2':['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3':['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '5-3-2':['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST']
};

// Slot arrays use the same order as the server. Rows control how the XI is drawn on screen.
const FF_LAYOUTS={
  '4-3-3':{slots:['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],rows:[[8,9,10],[5,6,7],[1,2,3,4],[0]]},
  '4-4-2':{slots:['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],rows:[[9,10],[5,6,7,8],[1,2,3,4],[0]]},
  '4-2-3-1':{slots:['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],rows:[[10],[7,8,9],[5,6],[1,2,3,4],[0]]},
  '4-1-4-1':{slots:['GK','LB','CB','CB','RB','DM','LM','CM','CM','RM','ST'],rows:[[10],[6,7,8,9],[5],[1,2,3,4],[0]]},
  '4-3-1-2':{slots:['GK','LB','CB','CB','RB','CM','CM','CM','AM','ST','ST'],rows:[[9,10],[8],[5,6,7],[1,2,3,4],[0]]},
  '4-2-2-2':{slots:['GK','LB','CB','CB','RB','DM','DM','AM','AM','ST','ST'],rows:[[9,10],[7,8],[5,6],[1,2,3,4],[0]]},
  '4-1-2-1-2':{slots:['GK','LB','CB','CB','RB','DM','CM','CM','AM','ST','ST'],rows:[[9,10],[8],[6,7],[5],[1,2,3,4],[0]]},
  '4-3-2-1':{slots:['GK','LB','CB','CB','RB','CM','CM','CM','AM','AM','ST'],rows:[[10],[8,9],[5,6,7],[1,2,3,4],[0]]},
  '3-5-2':{slots:['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],rows:[[9,10],[7],[4,5,6,8],[1,2,3],[0]]},
  '3-4-3':{slots:['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],rows:[[8,9,10],[4,5,6,7],[1,2,3],[0]]},
  '3-4-2-1':{slots:['GK','CB','CB','CB','LM','CM','CM','RM','AM','AM','ST'],rows:[[10],[8,9],[4,5,6,7],[1,2,3],[0]]},
  '3-4-1-2':{slots:['GK','CB','CB','CB','LM','CM','CM','RM','AM','ST','ST'],rows:[[9,10],[8],[4,5,6,7],[1,2,3],[0]]},
  '5-3-2':{slots:['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST'],rows:[[9,10],[6,7,8],[1,2,3,4,5],[0]]},
  '5-2-3':{slots:['GK','LB','CB','CB','CB','RB','CM','CM','LW','ST','RW'],rows:[[8,9,10],[6,7],[1,2,3,4,5],[0]]},
  '5-4-1':{slots:['GK','LB','CB','CB','CB','RB','LM','CM','CM','RM','ST'],rows:[[10],[6,7,8,9],[1,2,3,4,5],[0]]},
  '5-2-1-2':{slots:['GK','LB','CB','CB','CB','RB','CM','CM','AM','ST','ST'],rows:[[9,10],[8],[6,7],[1,2,3,4,5],[0]]}
};

function showToast(msg){
  toast.textContent=msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2600);
}
function q(name){return new URLSearchParams(location.search).get(name)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function me(){return state?.managers.find(m=>m.id===meId)}
function managerName(id){return state?.managers.find(m=>m.id===id)?.name||'—'}
function packName(){return state?.packLabels?.[state.pack]||'Player Pack'}
function modeName(){return state?.modeLabels?.[state.mode]||'Game Mode'}
function shell(content){
  applyVisualTheme();
  app.innerHTML=`<div class="wrap"><div class="topbar"><div class="brand">⚽ Prem Draft</div><button class="theme-toggle" id="themeToggle" aria-label="Visual theme: ${visualTheme}. Tap to switch.">${themeButtonLabel()}</button></div>${content}</div>`;
  wireThemeToggle();
}

function assignedSlots(m){
  const slots=(HARD_SLOTS[m.formation]||[]).map((pos,i)=>({pos,i,player:null}));
  for(const p of m.squad){
    const assigned=p.assignedPosition||p.positions?.[0];
    let s=slots.find(x=>!x.player&&x.pos===assigned);
    if(!s)s=slots.find(x=>!x.player&&p.positions.includes(x.pos));
    if(s)s.player=p;
  }
  return slots;
}
function hardSquadHtml(m){
  return assignedSlots(m).map(s=>`<div class="slot"><b>${s.pos}</b><div>${s.player?esc(s.player.name):'—'}</div></div><div class="slot slot-price">${s.player?`£${s.player.price}m`:''}</div>`).join('');
}
function freeformDraftSquadHtml(m){
  return m.squad.length ? m.squad.map((p,i)=>`<div class="simple-player"><div><b>${i+1}. ${esc(p.name)}</b><div class="muted small">${p.positions.join(' / ')}</div></div><b>£${p.price}m</b></div>`).join('') : '<div class="muted">No players yet.</div>';
}

function home(){
  const code=q('room')||'';
  shell(`<div class="card"><h1>Football Auction Draft</h1><p class="muted">Build your XI with a £100m budget.</p><label>Manager name</label><input id="name" maxlength="20" placeholder="Your name"><div class="spacer10"></div>${code?`<div class="row mobile-stack"><input id="code" value="${esc(code)}"><button class="primary" id="join">Join room</button></div>`:`<button class="primary big" id="create">Create game</button><div class="spacer10"></div><div class="row mobile-stack"><input id="code" placeholder="Room code"><button class="secondary" id="join">Join</button></div>`}</div>`);
  const create=document.querySelector('#create');
  if(create) create.onclick=()=>{
    const name=document.querySelector('#name').value;
    socket.emit('createRoom',{name},r=>{
      if(!r.ok)return showToast(r.error);
      meId=socket.id; history.replaceState({},'',`?room=${r.code}`); state=r.state; render();
    });
  };
  document.querySelector('#join').onclick=()=>{
    const name=document.querySelector('#name').value,code=document.querySelector('#code').value;
    socket.emit('joinRoom',{code,name},r=>{
      if(!r.ok)return showToast(r.error);
      meId=socket.id; state=r.state; history.replaceState({},'',`?room=${state.code}`); render();
    });
  };
}

function lobby(){
  const m=me(),host=state.hostId===meId;
  const packOptions=Object.entries(state.packLabels||{}).map(([key,label])=>`<option value="${key}" ${state.pack===key?'selected':''}>${esc(label)} (${state.packCounts?.[key]||0} players)</option>`).join('');
  const modeOptions=Object.entries(state.modeLabels||{}).map(([key,label])=>`<option value="${key}" ${state.mode===key?'selected':''}>${esc(label)}</option>`).join('');
  const modeDescription=state.mode==='freeform'
    ? 'Draft any 11 players. Positions are advice only. Choose and arrange your formation after the auction.'
    : 'Choose your formation now. Every signing must fit an open position and players stay in the slot they are assigned.';

  const formationCard=state.mode==='hard' ? `<div class="card"><h2>Your formation</h2><select id="formation"><option value="">Choose formation</option>${HARD_FORMATIONS.map(f=>`<option ${m.formation===f?'selected':''}>${f}</option>`).join('')}</select><div class="spacer10"></div><button class="${m.ready?'secondary':'primary'} big" id="ready" ${!m.formation?'disabled':''}>${m.ready?'Not ready':'Ready'}</button></div>` : `<div class="card"><h2>Your draft</h2><p class="muted">No formation yet. Draft any 11 players; you will build your XI after the auction.</p><button class="${m.ready?'secondary':'primary'} big" id="ready">${m.ready?'Not ready':'Ready'}</button></div>`;

  shell(`<div class="card"><div class="muted">ROOM CODE</div><div class="row"><div class="code grow">${state.code}</div><button class="secondary" id="copy">Copy link</button></div></div>
  <div class="card"><h2>Game mode</h2>${host?`<select id="mode">${modeOptions}</select>`:`<div class="pack-display"><b>${esc(modeName())}</b></div>`}<p class="muted small">${esc(modeDescription)}</p></div>
  <div class="card"><h2>Player pack</h2>${host?`<select id="pack">${packOptions}</select><p class="muted small">Changing the pack makes everyone ready up again.</p>`:`<div class="pack-display"><b>${esc(packName())}</b><span class="muted">${state.packCounts?.[state.pack]||0} players</span></div>`}</div>
  ${formationCard}
  <div class="card"><h2>Managers</h2>${state.managers.map(x=>`<div class="manager"><div><b>${esc(x.name)}</b><div class="muted">${state.mode==='hard'?(x.formation||'No formation'):'Formation after draft'}</div></div><div class="${x.ready?'ready':'notready'}">${x.ready?'READY':'WAITING'}</div></div>`).join('')}</div>
  ${host?`<button class="primary big" id="start">Start draft</button>`:''}`);

  document.querySelector('#copy').onclick=async()=>{
    try{await navigator.clipboard.writeText(location.href);showToast('Invite link copied')}catch{showToast('Copy the page address from your browser')}
  };
  if(host){
    document.querySelector('#mode').onchange=e=>socket.emit('setMode',{mode:e.target.value});
    document.querySelector('#pack').onchange=e=>socket.emit('setPack',{pack:e.target.value});
  }
  if(state.mode==='hard') document.querySelector('#formation').onchange=e=>socket.emit('setFormation',{formation:e.target.value});
  document.querySelector('#ready').onclick=()=>socket.emit('setReady',{ready:!m.ready});
  if(host) document.querySelector('#start').onclick=()=>socket.emit('startDraft',{},r=>{if(r&&!r.ok)showToast(r.error)});
}

function scarcityHtml(c){
  const warnings=c?.scarcityWarnings||[];
  return warnings.map(w=>{
    const managerText=w.managersLacking===1?'1 manager still has no natural':'Managers still without a natural';
    const lackingText=w.managersLacking===1?`${managerText} ${w.position}.`:`${w.managersLacking} managers still have no natural ${w.position}.`;
    const afterText=w.remainingAfter===1?`If this player is skipped, only 1 eligible ${w.position} will remain.`:`If this player is skipped, only ${w.remainingAfter} eligible ${w.position}s will remain.`;
    return `<div class="scarcity"><b>${w.position} scarcity warning</b><div>${esc(lackingText)} ${esc(afterText)}</div></div>`;
  }).join('');
}

function draft(){
  const m=me(); const c=state.current; const currentBid=c?.bid||0; const next=currentBid+1; const mandatory=c?.mandatoryIds?.includes(meId);
  shell(`<div class="mode-strip">${esc(modeName())} · ${esc(packName())}</div><div class="tabs"><button class="tab ${tab==='draft'?'active':''}" data-tab="draft">Draft</button><button class="tab ${tab==='team'?'active':''}" data-tab="team">My Team</button><button class="tab ${tab==='managers'?'active':''}" data-tab="managers">Managers</button></div><div id="panel"></div>`);
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;draft()});
  const panel=document.querySelector('#panel');

  if(tab==='draft'){
    const complete=m.squad.length>=11;
    const isOut=!!c?.outIds?.includes(meId);
    const leading=c?.bidderId===meId;
    const eligible=!!c?.eligibleIds?.includes(meId);
    let controls='';
    if(complete){
      controls='<button class="secondary big" disabled>Squad complete · automatically out</button>';
    }else if(c){
      const bidControls=(eligible||leading)?`<button class="primary big" id="bid">BID £${next}m</button><div class="spacer9"></div><div class="row"><button class="secondary grow jump" data-jump="2">+£2m</button><button class="secondary grow jump" data-jump="5">+£5m</button><button class="secondary grow" id="custom">Custom</button></div>`:'<button class="secondary big" disabled>Automatically out for this player</button>';
      const outControl=leading
        ? '<button class="secondary out-button" disabled>You are currently leading</button>'
        : eligible
          ? `<button class="${isOut?'out-button active':'out-button'}" id="auctionOut">${isOut?'I’m Out ✓ · tap to re-enter':'I’m Out'}</button>`
          : '';
      controls=`${bidControls}${outControl?`<div class="spacer9"></div>${outControl}`:''}`;
    }
    panel.innerHTML=`<div class="card budget"><div><div class="muted">YOUR BUDGET</div><strong>£${m.budget}m</strong></div><div class="right"><div class="muted">SQUAD</div><strong>${m.squad.length}/11</strong></div></div>${c ? `<div class="card auction"><div class="player-counter">PLAYER ${state.shownCount||1} OF ${state.poolSize||'—'}</div><div id="timer" class="timer ${c.timeLeft<=5?'warn':''}">${c.timeLeft}</div><div class="player">${esc(c.player.name)}</div><div class="positions">${c.player.positions.join(' / ')}</div>${state.mode==='freeform'?scarcityHtml(c):''}${mandatory?`<div class="required">${state.mode==='freeform'?'The draft has reached its compulsory endgame. If nobody bids, this player will go for £1m to an eligible manager with the most open squad slots; exact ties are completely random.':'This player cannot safely be skipped. If nobody bids, they will be randomly assigned for £1m to one eligible manager.'}</div>`:''}<div class="bidvalue">£${currentBid}m</div><div class="leader">${c.bidderId?esc(managerName(c.bidderId))+' leads':'No bids yet'}</div>${isOut?'<div class="out-status">You are out of the bidding for this player. Place a bid or tap again to re-enter.</div>':''}<div class="spacer14"></div>${controls}</div>`:'<div class="card">Loading next player…</div>'}`;
  }
  if(tab==='team'){
    panel.innerHTML=state.mode==='freeform'
      ? `<div class="card"><div class="budget"><h2>Your 11</h2><b>£${m.budget}m left</b></div>${freeformDraftSquadHtml(m)}</div>`
      : `<div class="card"><h2>${m.formation} · £${m.budget}m left</h2><div class="squad">${hardSquadHtml(m)}</div></div>`;
  }
  if(tab==='managers'){
    panel.innerHTML=state.managers.map(x=>`<div class="card"><div class="budget"><h3>${esc(x.name)}</h3><b>£${x.budget}m · ${x.squad.length}/11</b></div><div>${x.squad.map(p=>`<span class="pill">${esc(p.name)} · ${state.mode==='hard'?esc(p.assignedPosition||'—'):esc(p.positions.join('/'))} · £${p.price}m</span>`).join('')||'<span class="muted">No players yet</span>'}</div></div>`).join('');
  }

  if(tab==='draft'&&c&&m.squad.length<11){
    const eligible=!!c.eligibleIds?.includes(meId) || c.bidderId===meId;
    if(eligible){
      const send=amt=>socket.emit('bid',{amount:amt},r=>{if(r&&!r.ok)showToast(r.error)});
      const bidBtn=document.querySelector('#bid'); if(bidBtn)bidBtn.onclick=()=>send(next);
      document.querySelectorAll('.jump').forEach(b=>b.onclick=()=>send(currentBid+Number(b.dataset.jump)));
      const custom=document.querySelector('#custom'); if(custom)custom.onclick=()=>{
        const v=prompt('Bid amount in £m',String(next));
        if(v)send(Number(v));
      };
    }
    const outBtn=document.querySelector('#auctionOut');
    if(outBtn)outBtn.onclick=()=>socket.emit('setAuctionOut',{out:!c.outIds?.includes(meId)},r=>{if(r&&!r.ok)showToast(r.error)});
  }
}

function playerForLineup(m,slotIndex){
  const id=m.lineup?.[slotIndex];
  return m.squad.find(p=>p.id===id)||null;
}
function pitchHtml(m,editable=false){
  const layout=FF_LAYOUTS[m.finalFormation];
  if(!layout) return '<div class="muted">Choose a formation to start arranging your XI.</div>';
  return `<div class="pitch">${layout.rows.map(row=>`<div class="pitch-row cols-${row.length}">${row.map(idx=>{
    const p=playerForLineup(m,idx);
    const cls=editable&&selectedLineupSlot===idx?'pitch-slot selected':'pitch-slot';
    return `<button type="button" class="${cls}" ${editable?`data-slot="${idx}"`: 'disabled'}><span class="slot-label">${layout.slots[idx]}</span><span class="slot-name">${p?esc(p.name):'Empty'}</span></button>`;
  }).join('')}</div>`).join('')}</div>`;
}

function teamBuild(){
  const m=me();
  const formationOptions=(state.freeformFormations||Object.keys(FF_LAYOUTS)).map(f=>`<option value="${f}" ${m.finalFormation===f?'selected':''}>${f}</option>`).join('');
  const readyCount=state.managers.filter(x=>x.teamReady).length;
  shell(`<div class="mode-strip">Freeform team builder · ${esc(packName())}</div>
    <div class="card"><div class="budget"><div><h1>Build your XI</h1><p class="muted no-margin">Positions are completely unrestricted.</p></div><b>${readyCount}/${state.managers.length} set</b></div></div>
    <div class="card"><label>Formation</label><select id="finalFormation"><option value="">Choose formation</option>${formationOptions}</select></div>
    <div class="card"><div class="builder-hint">${m.finalFormation?'The game has suggested the best positional fit for this formation. Tap a position, then a player, to change it. Players swap automatically.':'Choose a formation first.'}</div>${pitchHtml(m,true)}</div>
    <div class="card"><h2>Your players</h2><div class="player-picker">${m.squad.map(p=>{
      const idx=m.lineup?.indexOf(p.id);
      const slotLabel=m.finalFormation&&idx>=0?FF_LAYOUTS[m.finalFormation]?.slots[idx]:'';
      return `<button type="button" class="picker-player" data-player="${p.id}" ${selectedLineupSlot===null?'disabled':''}><span><b>${esc(p.name)}</b><small>${esc(p.positions.join(' / '))}</small></span><span class="picker-position">${slotLabel||'—'}</span></button>`;
    }).join('')}</div></div>
    <div class="card"><h2>Managers</h2>${state.managers.map(x=>`<div class="manager"><b>${esc(x.name)}</b><div class="${x.teamReady?'ready':'notready'}">${x.teamReady?'TEAM SET':'ARRANGING'}</div></div>`).join('')}</div>
    <button class="${m.teamReady?'secondary':'primary'} big" id="teamReady" ${!m.finalFormation?'disabled':''}>${m.teamReady?'Unset team':'Set team'}</button>`);

  document.querySelector('#finalFormation').onchange=e=>{
    selectedLineupSlot=null;
    socket.emit('setFinalFormation',{formation:e.target.value});
  };
  document.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{
    selectedLineupSlot=Number(b.dataset.slot);
    teamBuild();
  });
  document.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>{
    if(selectedLineupSlot===null)return;
    socket.emit('setLineupSlot',{slotIndex:selectedLineupSlot,playerId:Number(b.dataset.player)});
    selectedLineupSlot=null;
  });
  document.querySelector('#teamReady').onclick=()=>socket.emit('setTeamReady',{ready:!m.teamReady},r=>{if(r&&!r.ok)showToast(r.error)});
}


function ratingsHtml(m){
  const r=state.teamRatings?.[m.id];
  if(!r)return '';
  return `<div class="ratings"><div class="overall-rating"><span>OVERALL</span><strong>${r.overall}</strong></div><div class="rating-grid"><div><span>Attack</span><b>${r.attack}</b></div><div><span>Midfield</span><b>${r.midfield}</b></div><div><span>Defence</span><b>${r.defence}</b></div><div><span>Positional Fit</span><b>${r.positionalFit}</b></div><div><span>Team Balance</span><b>${r.teamBalance}</b></div><div><span>Formation Fit</span><b>${r.formationSuitability}</b></div></div></div>`;
}
function revealedTeamHtml(m){
  if(state.mode==='freeform'){
    return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.finalFormation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}${pitchHtml(m,false)}</div>`;
  }
  return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.formation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}<div class="squad">${hardSquadHtml(m)}</div></div>`;
}
function reveal(){
  const host=state.hostId===meId;
  shell(`<div class="card"><h1>Teams revealed</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p><p class="muted small">Individual player ratings remain hidden. These team scores judge the XI as deployed.</p></div>${state.managers.map(revealedTeamHtml).join('')}<div class="card"><h2>Season simulation</h2><p class="muted">Every team gets a balanced home/away schedule. Two managers play 10 matches; three managers play 12; with four or more, every pair plays home and away once. Results are revealed one match at a time.</p></div>${host?'<button class="primary big" id="simulate">Simulate season</button>':'<div class="card muted">Waiting for the host to start the simulation.</div>'}`);
  if(host)document.querySelector('#simulate').onclick=()=>socket.emit('startSimulation',{},r=>{if(r&&!r.ok)showToast(r.error)});
}
function scorerList(goals){
  return (goals||[]).length ? goals.map(g=>`${esc(g.player)} ${g.minute}'${g.assist?` <span class="assist">(assist: ${esc(g.assist)})</span>`:''}`).join(' · ') : '—';
}
function matchHtml(m,label='League match'){
  const pen=m.penalties?` <span class="pens">(${m.penalties.home}–${m.penalties.away} pens)</span>`:'';
  const et=m.wentExtraTime?' · AET':'';
  const pom=m.playerOfMatch?`<div class="potm">⭐ Player of the Match: <b>${esc(m.playerOfMatch.player)}</b> · ${Number(m.playerOfMatch.rating).toFixed(1)}</div>`:'';
  const shotLine=(Number.isFinite(m.homeShotsOnTarget)&&Number.isFinite(m.awayShotsOnTarget))?`<div class="match-meta"><span>Shots on target ${m.homeShotsOnTarget}–${m.awayShotsOnTarget}</span><span>GK saves ${m.homeSaves??0}–${m.awaySaves??0}</span></div>`:'';
  return `<div class="match-card"><div class="match-label">${esc(label)}${et}</div><div class="scoreline"><div><b>${esc(m.homeName)}</b><span>HOME</span></div><strong>${m.homeGoals}–${m.awayGoals}${pen}</strong><div class="right-team"><b>${esc(m.awayName)}</b><span>AWAY</span></div></div><div class="scorers"><div><b>${esc(m.homeName)}:</b> ${scorerList(m.homeScorers)}</div><div><b>${esc(m.awayName)}:</b> ${scorerList(m.awayScorers)}</div></div>${shotLine}${pom}</div>`;
}
function standingsHtml(rows){
  return `<div class="table-wrap"><table class="standings"><thead><tr><th>#</th><th>Manager</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${(rows||[]).map((r,i)=>`<tr><td>${i+1}</td><td><b>${esc(r.name)}</b></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd>0?'+':''}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function resultNav(){
  const tabs=[['season','Season'],['players','Player stats'],['tots','Team of Season'],['session','Session']];
  return `<div class="result-tabs">${tabs.map(([key,label])=>`<button class="result-tab ${resultsTab===key?'active':''}" data-result-tab="${key}">${label}</button>`).join('')}</div>`;
}
function wireResultTabs(){
  document.querySelectorAll('[data-result-tab]').forEach(b=>b.onclick=()=>{resultsTab=b.dataset.resultTab;results()});
}
function leaderboardHtml(metric){
  const rows=state.simulation?.leaderboards?.[metric]||[];
  const labels={goals:'Goals',assists:'Assists',saves:'Saves',rating:'Avg rating'};
  const value=p=>metric==='rating'?Number(p.avgRating||0).toFixed(2):(p[metric]??0);
  return `<div class="stat-switch">${Object.entries(labels).map(([key,label])=>`<button class="stat-chip ${statsMetric===key?'active':''}" data-stat="${key}">${label}</button>`).join('')}</div><div class="table-wrap"><table class="player-stats-table"><thead><tr><th>#</th><th>Player</th><th>Manager</th><th>Pos</th><th>${labels[metric]}</th></tr></thead><tbody>${rows.map((p,i)=>`<tr><td>${i+1}</td><td><b>${esc(p.player)}</b></td><td>${esc(p.managerName)}</td><td>${esc(p.deployedSlot)}</td><td><b>${value(p)}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function wireStatSwitch(){
  document.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{statsMetric=b.dataset.stat;results()});
}
function totsPitchHtml(tots){
  const layout=FF_LAYOUTS[tots?.formation];
  if(!layout||!tots?.players?.length)return '<div class="muted">No valid Team of the Season could be built.</div>';
  return `<div class="pitch tots-pitch">${layout.rows.map(row=>`<div class="pitch-row cols-${row.length}">${row.map(idx=>{
    const p=tots.players[idx];
    return `<div class="pitch-slot tots-slot"><span class="slot-label">${esc(layout.slots[idx])}</span><span class="slot-name">${p?esc(p.player):'—'}</span>${p?`<span class="tots-manager">${esc(p.managerName)} · ${Number(p.avgRating).toFixed(2)}</span>`:''}</div>`;
  }).join('')}</div>`).join('')}</div>`;
}
function sessionHtml(){
  const ss=state.sessionStats||{drafts:0,table:[],headToHead:[]};
  const table=`<div class="table-wrap"><table class="session-table"><thead><tr><th>#</th><th>Manager</th><th>Titles</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${(ss.table||[]).map((r,i)=>`<tr><td>${i+1}</td><td><b>${esc(r.name)}</b></td><td><b>${r.titles}</b></td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd>0?'+':''}${r.gd}</td><td>${r.pts}</td></tr>`).join('')}</tbody></table></div>`;
  const h2h=(ss.headToHead||[]).filter(x=>x.aWins+x.bWins+x.draws>0).map(x=>`<div class="h2h-card"><div><b>${esc(x.managerAName)}</b><strong>${x.aWins}</strong></div><span>${x.draws} draws<br><small>${x.aGoals}–${x.bGoals} goals</small></span><div class="right"><b>${esc(x.managerBName)}</b><strong>${x.bWins}</strong></div></div>`).join('');
  return `<div class="card"><h2>Session rivalry</h2><p class="muted">${ss.drafts||0} completed draft${ss.drafts===1?'':'s'} in this room. League matches accumulate until the room ends.</p>${table}</div>${h2h?`<div class="card"><h2>Head-to-head</h2><div class="h2h-list">${h2h}</div></div>`:''}`;
}
function fullResults(){
  const host=state.hostId===meId,sim=state.simulation;
  const champion=state.managers.find(m=>m.id===sim.championId);
  const playoffs=(sim.playoffs||[]).length?`<div class="card"><h2>Title tiebreak</h2><p class="muted small">The league tiebreakers could not separate the leaders, so the title was decided on the pitch.</p>${sim.playoffs.map(m=>matchHtml(m,'Tiebreak playoff')).join('')}</div>`:'';
  let body='';
  if(resultsTab==='season') body=`<div class="card"><h2>Final table</h2>${standingsHtml(sim.table)}</div>${playoffs}<div class="card"><h2>Match results</h2><div class="matches">${(sim.matches||[]).map((m,i)=>matchHtml(m,`Match ${i+1} of ${sim.matches.length}`)).join('')}</div></div><div class="card"><h2>Team ratings</h2><p class="muted small">The team ratings that drove the simulation. Individual hidden player ratings remain secret.</p>${state.managers.map(m=>`<div class="rating-summary"><div><b>${esc(m.name)}</b><span>${state.mode==='freeform'?esc(m.finalFormation||'XI'):esc(m.formation||'XI')}</span></div><strong>${state.teamRatings?.[m.id]?.overall??'—'}</strong></div>`).join('')}</div>`;
  else if(resultsTab==='players') body=`<div class="card"><h2>League player stats</h2><p class="muted">Top 10 performers across every manager's XI.</p>${leaderboardHtml(statsMetric)}</div>`;
  else if(resultsTab==='tots') body=`<div class="card"><div class="budget"><div><h2>Team of the Season</h2><p class="muted no-margin">Best-performing valid XI by average match rating, using the positions players were actually deployed in with sensible neighbouring roles.</p></div><b>${esc(sim.teamOfSeason?.formation||'XI')}</b></div><div class="spacer14"></div>${totsPitchHtml(sim.teamOfSeason)}</div>`;
  else body=sessionHtml();
  shell(`<div class="card champion"><div class="muted">SEASON CHAMPION</div><h1>🏆 ${esc(champion?.name||'Winner')}</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p></div>${resultNav()}${body}${host?'<button class="primary big" id="again">Play again</button>':'<div class="card muted">Waiting for the host to start another game.</div>'}`);
  wireResultTabs();wireStatSwitch();
  if(host)document.querySelector('#again').onclick=()=>socket.emit('playAgain',{});
}
function results(){
  const host=state.hostId===meId;
  const sim=state.simulation;
  if(!sim)return reveal();
  const total=sim.matches?.length||0;
  const shown=Math.min(state.simulationRevealCount||0,total);
  if(shown>=total)return fullResults();
  const latest=shown>0?sim.matches[shown-1]:null;
  const liveTable=shown>0?sim.progressTables?.[shown-1]:null;
  const controls=host?`<div class="reveal-controls"><button class="primary big" id="revealNext">${shown===0?'Reveal first match':`Reveal match ${shown+1}`}</button><button class="secondary" id="revealAll">Reveal all results</button></div>`:'<div class="card muted">Waiting for the host to reveal the next match.</div>';
  shell(`<div class="card reveal-header"><div class="muted">MATCHDAY REVEAL</div><h1>${shown} / ${total}</h1><p class="muted">Results and the league table are being revealed live to everyone in the room.</p></div>${latest?`<div class="card"><h2>Latest result</h2>${matchHtml(latest,`Match ${shown} of ${total}`)}</div>`:'<div class="card"><h2>Season ready</h2><p class="muted">No results have been shown yet.</p></div>'}${liveTable?`<div class="card"><h2>Live table</h2>${standingsHtml(liveTable)}</div>`:''}${controls}`);
  if(host){
    document.querySelector('#revealNext').onclick=()=>socket.emit('revealNextMatch',{});
    document.querySelector('#revealAll').onclick=()=>socket.emit('revealAllMatches',{});
  }
}

function finished(){
  const host=state.hostId===meId;
  if(state.mode==='freeform'){
    shell(`<div class="card"><h1>Teams revealed</h1><p class="muted">${esc(packName())} · Freeform Mode</p></div>${state.managers.map(m=>`<div class="card"><div class="budget"><h2>${esc(m.name)}</h2><b>${esc(m.finalFormation||'XI')} · £${m.budget}m left</b></div>${pitchHtml(m,false)}</div>`).join('')}${host?'<button class="primary big" id="again">Play again</button>':'<div class="card muted">Waiting for the host to start another game.</div>'}`);
  } else {
    shell(`<div class="card"><h1>Draft complete</h1><p class="muted">${esc(packName())} · Hard Mode</p></div>${state.managers.map(m=>`<div class="card"><div class="budget"><h2>${esc(m.name)}</h2><b>${m.formation} · £${m.budget}m left</b></div><div class="squad">${hardSquadHtml(m)}</div></div>`).join('')}${host?'<button class="primary big" id="again">Play again</button>':'<div class="card muted">Waiting for the host to start another game.</div>'}`);
  }
  if(host)document.querySelector('#again').onclick=()=>socket.emit('playAgain',{});
}

function render(){
  if(!state)return home();
  if(state.phase==='lobby')lobby();
  else if(state.phase==='draft')draft();
  else if(state.phase==='team_build')teamBuild();
  else if(state.phase==='reveal')reveal();
  else if(state.phase==='results')results();
  else finished();
}

socket.on('state',s=>{
  const phaseChanged=state?.phase!==s.phase;
  state=s;
  if(!meId)meId=socket.id;
  if(phaseChanged){
    selectedLineupSlot=null;
    if(s.phase==='results'){resultsTab='season';statsMetric='goals';}
  }
  render();
});
socket.on('tick',({timeLeft})=>{
  if(state?.current){
    state.current.timeLeft=timeLeft;
    const t=document.querySelector('#timer');
    if(t){t.textContent=timeLeft;t.classList.toggle('warn',timeLeft<=5)}
  }
});
applyVisualTheme();
home();
