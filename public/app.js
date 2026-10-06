const socket=io();
const app=document.querySelector('#app');
const toast=document.querySelector('#toast');
let state=null;
let meId=null;
let tab='draft';
let selectedLineupSlot=null;
let resultsTab='season';
let statsMetric='goals';
let nominationSearch='';
let nominationPosition='ALL';
let blindEndgameAnnounced=false;
let viewingRecords=false;
let recordsSection='rivalry';
let recordsSummaryData=null;
let recordsGroupData=null;
let selectedRivalryKey='';
let selectedRecordModes=new Set();
let selectedRecordPacks=new Set();

const SESSION_KEY='premDraftReconnectSessionV1';

const PROFILE_KEY='premDraftPermanentProfileV1';
function readSavedProfile(){
  try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{return null}
}
function saveProfile(profile){
  if(!profile)return;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))}catch{}
}
function savedProfile(){return readSavedProfile()}
function recoverProfileFlow(after){
  const code=prompt('Enter your Prem Draft profile code (for example ZAK-482):','');
  if(code===null)return;
  socket.emit('profileRecover',{code},r=>{
    if(!r?.ok)return showToast(r?.error||'Profile not found');
    saveProfile(r.profile);showToast(`Profile recovered: ${r.profile.defaultName}`);
    if(after)after(r.profile);else if(!state)home();
  });
}
function editDefaultProfileName(){
  const p=savedProfile();if(!p?.recoveryCode)return;
  const name=prompt('Default manager name:',p.defaultName||'Manager');if(name===null)return;
  socket.emit('profileRename',{code:p.recoveryCode,name},r=>{
    if(!r?.ok)return showToast(r?.error||'Could not update profile');
    saveProfile(r.profile);showToast('Default manager name updated');if(!state)home();
  });
}
function ensurePermanentProfile(name,cb){
  const p=savedProfile();if(p?.recoveryCode)return cb(p);
  socket.emit('profileCreate',{name},r=>{
    if(r?.ok&&r.profile){saveProfile(r.profile);showToast(`Profile created · code ${r.profile.recoveryCode}`);return cb(r.profile);}
    // Permanent history must never block the core game if the database is temporarily unavailable.
    showToast('Permanent Records unavailable · continuing as guest');cb(null);
  });
}
let resumeInFlight=false;
function readSavedSession(){
  try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}
}
function saveSession(room,reconnectToken,managerId){
  try{localStorage.setItem(SESSION_KEY,JSON.stringify({room,reconnectToken,managerId}))}catch{}
}
function clearSavedSession(){try{localStorage.removeItem(SESSION_KEY)}catch{}}
function attemptResume(){
  if(!socket.connected||resumeInFlight)return;
  const saved=readSavedSession();if(!saved?.room||!saved?.reconnectToken)return;
  const requested=q('room');if(requested&&requested.toUpperCase()!==String(saved.room).toUpperCase())return;
  resumeInFlight=true;
  socket.emit('resumeSession',{code:saved.room,token:saved.reconnectToken},r=>{
    resumeInFlight=false;
    if(!r?.ok){if(!state){clearSavedSession();home()}return;}
    meId=r.managerId||r.state?.viewerId||saved.managerId;state=r.state;
    history.replaceState({},'',`?room=${state.code}`);render();
  });
}

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
function isFreeformLike(){return ['freeform','nomination','blind'].includes(state?.mode)}
function commissionerMarkup(){
  const host=state?.hostId===meId;
  const show=host&&['draft','team_build'].includes(state?.phase);
  if(!show)return '';
  const canAuction=state.phase==='draft'&&!!state.current;
  return `<div class="commission-modal" id="commissionModal" hidden><div class="commission-sheet"><div class="budget"><div><h2>Commissioner controls</h2><p class="muted no-margin">Failsafe controls for the host.</p></div><button class="icon-button" id="closeCommission">×</button></div>${state.phase==='draft'?`<button class="secondary big" id="pauseDraft">${state.paused?'Resume draft':'Pause draft'}</button><div class="spacer9"></div><button class="secondary big" id="restartAuction" ${canAuction?'':'disabled'}>Restart current auction</button><div class="spacer9"></div><button class="secondary big danger-soft" id="skipCurrent" ${canAuction?'':'disabled'}>Skip current player</button><div class="spacer14"></div>`:''}<button class="danger big" id="abandonDraft">Abandon draft & return to lobby</button></div></div>`;
}
function wireCommissioner(){
  const open=document.querySelector('#commissionerBtn'),modal=document.querySelector('#commissionModal');
  if(!open||!modal)return;
  open.onclick=()=>{modal.hidden=false};
  const close=document.querySelector('#closeCommission');if(close)close.onclick=()=>{modal.hidden=true};
  modal.onclick=e=>{if(e.target===modal)modal.hidden=true};
  const pause=document.querySelector('#pauseDraft');if(pause)pause.onclick=()=>socket.emit('commissionPause',{paused:!state.paused},r=>{if(r&&!r.ok)showToast(r.error)});
  const restart=document.querySelector('#restartAuction');if(restart)restart.onclick=()=>{if(confirm('Restart this auction from the beginning?'))socket.emit('commissionRestartAuction',{},r=>{if(r&&!r.ok)showToast(r.error)});};
  const skip=document.querySelector('#skipCurrent');if(skip)skip.onclick=()=>{if(confirm('Skip this player? This cannot be undone.'))socket.emit('commissionSkipCurrent',{},r=>{if(r&&!r.ok)showToast(r.error)});};
  const abandon=document.querySelector('#abandonDraft');if(abandon)abandon.onclick=()=>{if(confirm('Abandon this draft and return everyone to the lobby?'))socket.emit('commissionAbandonDraft',{},r=>{if(r&&!r.ok)showToast(r.error)});};
}
function shell(content){
  applyVisualTheme();
  const commissioner=(state?.hostId===meId&&['draft','team_build'].includes(state?.phase))?'<button class="theme-toggle commissioner-button" id="commissionerBtn" aria-label="Commissioner controls">⚙</button>':'';
  app.innerHTML=`<div class="wrap"><div class="topbar"><div class="brand">⚽ Prem Draft</div><div class="top-actions">${commissioner}<button class="theme-toggle" id="themeToggle" aria-label="Visual theme: ${visualTheme}. Tap to switch.">${themeButtonLabel()}</button></div></div>${content}${commissionerMarkup()}</div>`;
  wireThemeToggle();wireCommissioner();
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
  viewingRecords=false;
  const code=q('room')||'';
  const profile=savedProfile();
  const profileCard=profile?.recoveryCode
    ? `<div class="profile-strip"><div><div class="muted small">PERMANENT MANAGER</div><b>${esc(profile.defaultName)}</b><div class="muted small">Recovery code: <strong>${esc(profile.recoveryCode)}</strong></div></div><div class="profile-actions"><button class="secondary small-button" id="editProfile">Edit default</button><button class="secondary small-button" id="recoverProfile">Switch / recover</button></div></div>`
    : `<div class="profile-strip"><div><b>Permanent records</b><div class="muted small">Your first room will create a short recovery code so your all-time stats follow you across rooms and days.</div></div><button class="secondary small-button" id="recoverProfile">I have a code</button></div>`;
  shell(`<div class="card"><h1>Football Auction Draft</h1><p class="muted">Build your XI with a £100m budget.</p>${profileCard}<div class="spacer14"></div><label>Name for this room</label><input id="name" maxlength="20" value="${esc(profile?.defaultName||'')}" placeholder="Your name"><p class="muted small">Changing this only changes how you appear in this room; it does not create a new all-time identity.</p><div class="spacer10"></div>${code?`<div class="row mobile-stack"><input id="code" value="${esc(code)}"><button class="primary" id="join">Join room</button></div>`:`<button class="primary big" id="create">Create game</button><div class="spacer10"></div><div class="row mobile-stack"><input id="code" placeholder="Room code"><button class="secondary" id="join">Join</button></div>`}<div class="spacer14"></div><button class="secondary big" id="records">🏆 All-Time Records</button></div>`);
  const recover=document.querySelector('#recoverProfile');if(recover)recover.onclick=()=>recoverProfileFlow();
  const edit=document.querySelector('#editProfile');if(edit)edit.onclick=editDefaultProfileName;
  document.querySelector('#records').onclick=openRecords;
  const launch=(kind)=>{
    const name=document.querySelector('#name').value;
    ensurePermanentProfile(name||'Manager',profileNow=>{
      const payload={name,profileCode:profileNow?.recoveryCode||null};
      if(kind==='create')socket.emit('createRoom',payload,r=>{
        if(!r?.ok)return showToast(r?.error||'Could not create room');
        meId=r.managerId||r.state?.viewerId;saveSession(r.code,r.reconnectToken,meId);history.replaceState({},'',`?room=${r.code}`);state=r.state;render();
      });
      else{
        payload.code=document.querySelector('#code').value;
        socket.emit('joinRoom',payload,r=>{
          if(!r?.ok)return showToast(r?.error||'Could not join room');
          meId=r.managerId||r.state?.viewerId;saveSession(r.state.code,r.reconnectToken,meId);state=r.state;history.replaceState({},'',`?room=${state.code}`);render();
        });
      }
    });
  };
  const create=document.querySelector('#create');if(create)create.onclick=()=>launch('create');
  document.querySelector('#join').onclick=()=>launch('join');
}

function historyTableHtml(rows){
  return `<div class="table-wrap"><table class="history-table"><thead><tr><th>#</th><th>Manager</th><th>Drafts</th><th>Titles</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${(rows||[]).map((r,i)=>`<tr><td>${i+1}</td><td><b>${esc(r.name)}</b></td><td>${r.drafts}</td><td><b>${r.titles}</b></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd>0?'+':''}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function openRecords(){
  viewingRecords=true;recordsSummaryData=null;recordsGroupData=null;
  shell('<div class="card"><h1>All-Time Records</h1><p class="muted">Loading permanent history…</p></div>');
  socket.emit('recordsSummary',{},r=>{
    if(!r?.ok){shell(`<div class="card"><h1>All-Time Records</h1><p class="muted">${esc(r?.error||'Could not load records.')}</p><button class="secondary big" id="recordsBack">Back</button></div>`);document.querySelector('#recordsBack').onclick=closeRecords;return;}
    recordsSummaryData=r;
    const profile=savedProfile();
    const preferred=(r.groups||[]).find(g=>profile?.profileId&&g.profileIds?.includes(profile.profileId))||(r.groups||[])[0];
    selectedRivalryKey=preferred?.key||'';
    selectedRecordModes=new Set(Object.keys(r.modeLabels||{}));
    selectedRecordPacks=new Set(Object.keys(r.packLabels||{}));
    if(selectedRivalryKey)loadRivalryGroup();else recordsScreen();
  });
}
function closeRecords(){viewingRecords=false;recordsSummaryData=null;recordsGroupData=null;if(state)render();else home();}
function loadRivalryGroup(){
  if(!selectedRivalryKey){recordsGroupData=null;return recordsScreen();}
  recordsGroupData=null;recordsScreen();
  socket.emit('recordsGroup',{key:selectedRivalryKey,modes:[...selectedRecordModes],packs:[...selectedRecordPacks]},r=>{
    if(!r?.ok){showToast(r?.error||'Could not load rivalry group');return;}
    recordsGroupData=r;if(viewingRecords)recordsScreen();
  });
}
function recordsFiltersHtml(){
  const modes=recordsSummaryData?.modeLabels||{},packs=recordsSummaryData?.packLabels||{};
  return `<div class="records-filter-panel" id="recordsFilterPanel" hidden><div class="filter-columns"><div><b>Draft modes</b>${Object.entries(modes).map(([k,v])=>`<label class="filter-check"><input type="checkbox" data-filter-mode="${esc(k)}" ${selectedRecordModes.has(k)?'checked':''}> ${esc(v)}</label>`).join('')}</div><div><b>Player packs</b>${Object.entries(packs).map(([k,v])=>`<label class="filter-check"><input type="checkbox" data-filter-pack="${esc(k)}" ${selectedRecordPacks.has(k)?'checked':''}> ${esc(v)}</label>`).join('')}</div></div><div class="row"><button class="secondary grow" id="recordsAllFilters">Select all</button><button class="primary grow" id="recordsApplyFilters">Apply</button></div></div>`;
}
function recordsScreen(){
  if(!viewingRecords)return;
  if(!recordsSummaryData)return;
  const groups=recordsSummaryData.groups||[];
  const nav=`<div class="record-tabs"><button class="result-tab ${recordsSection==='rivalry'?'active':''}" data-record-section="rivalry">Rivalry Groups</button><button class="result-tab ${recordsSection==='all'?'active':''}" data-record-section="all">All Managers</button></div>`;
  let body='';
  if(recordsSection==='all'){
    body=`<div class="card"><h2>All-Time leaderboard</h2><p class="muted">Every completed official season stored across every room and rivalry group.</p>${historyTableHtml(recordsSummaryData.allTime||[])}</div>`;
  }else if(!groups.length){
    body='<div class="card"><h2>Rivalry Groups</h2><p class="muted">No completed official seasons have been saved yet.</p></div>';
  }else{
    const options=groups.map(g=>`<option value="${esc(g.key)}" ${g.key===selectedRivalryKey?'selected':''}>${esc(g.names.join(' / '))} · ${g.drafts} draft${g.drafts===1?'':'s'}</option>`).join('');
    const meta=recordsGroupData?`${recordsGroupData.matchingDrafts} matching draft${recordsGroupData.matchingDrafts===1?'':'s'} · ${recordsGroupData.matchingMatches} matches`:'Loading filtered table…';
    body=`<div class="card"><div class="budget"><div><h2>Rivalry Group</h2><p class="muted no-margin">Only drafts containing exactly this combination of managers count.</p></div></div><div class="spacer10"></div><select id="rivalryGroupSelect">${options}</select><div class="spacer10"></div><button class="secondary" id="recordsFilterButton">Filters ⚙</button>${recordsFiltersHtml()}<p class="muted small records-match-count">${esc(meta)}</p>${recordsGroupData?historyTableHtml(recordsGroupData.table||[]):'<div class="muted">Loading…</div>'}</div>`;
  }
  shell(`<div class="card records-header"><div><div class="muted small">PERMANENT HISTORY</div><h1>🏆 All-Time Records</h1></div><button class="secondary" id="recordsBack">Back</button></div>${nav}${body}`);
  document.querySelector('#recordsBack').onclick=closeRecords;
  document.querySelectorAll('[data-record-section]').forEach(b=>b.onclick=()=>{recordsSection=b.dataset.recordSection;recordsScreen();});
  const sel=document.querySelector('#rivalryGroupSelect');if(sel)sel.onchange=e=>{selectedRivalryKey=e.target.value;loadRivalryGroup();};
  const filterBtn=document.querySelector('#recordsFilterButton'),panel=document.querySelector('#recordsFilterPanel');if(filterBtn&&panel)filterBtn.onclick=()=>{panel.hidden=!panel.hidden};
  const all=document.querySelector('#recordsAllFilters');if(all)all.onclick=()=>{document.querySelectorAll('[data-filter-mode],[data-filter-pack]').forEach(x=>{x.checked=true});};
  const apply=document.querySelector('#recordsApplyFilters');if(apply)apply.onclick=()=>{
    selectedRecordModes=new Set([...document.querySelectorAll('[data-filter-mode]:checked')].map(x=>x.dataset.filterMode));
    selectedRecordPacks=new Set([...document.querySelectorAll('[data-filter-pack]:checked')].map(x=>x.dataset.filterPack));
    loadRivalryGroup();
  };
}

function lobby(){
  const m=me(),host=state.hostId===meId;
  const packOptions=Object.entries(state.packLabels||{}).map(([key,label])=>`<option value="${key}" ${state.pack===key?'selected':''}>${esc(label)} (${state.packCounts?.[key]||0} players)</option>`).join('');
  const modeOptions=Object.entries(state.modeLabels||{}).map(([key,label])=>`<option value="${key}" ${state.mode===key?'selected':''}>${esc(label)}</option>`).join('');
  const descriptions={
    freeform:'Draft any 11 players in the normal open auction. Choose and arrange your formation after the draft.',
    nomination:'Managers take turns choosing who enters the auction. The pool is larger (18 per manager), and every nomination starts with a real £1m+ opening bid.',
    blind:'Every player is a sealed bid. Opponent budgets, squads, bids and winners stay secret until all teams are set.',
    hard:'Choose your formation now. Every signing must fit an open position and players stay in the slot they are assigned.'
  };
  const formationCard=state.mode==='hard'
    ? `<div class="card"><h2>Your formation</h2><select id="formation"><option value="">Choose formation</option>${HARD_FORMATIONS.map(f=>`<option ${m.formation===f?'selected':''}>${f}</option>`).join('')}</select><div class="spacer10"></div><button class="${m.ready?'secondary':'primary'} big" id="ready" ${!m.formation?'disabled':''}>${m.ready?'Not ready':'Ready'}</button></div>`
    : `<div class="card"><h2>Your draft</h2><p class="muted">No formation yet. Draft any 11 players; you will build your XI afterwards.</p><button class="${m.ready?'secondary':'primary'} big" id="ready">${m.ready?'Not ready':'Ready'}</button></div>`;
  shell(`<div class="card"><div class="muted">ROOM CODE</div><div class="row"><div class="code grow">${state.code}</div><button class="secondary" id="copy">Copy link</button></div></div>
  <div class="card"><h2>Game mode</h2>${host?`<select id="mode">${modeOptions}</select>`:`<div class="pack-display"><b>${esc(modeName())}</b></div>`}<p class="muted small">${esc(descriptions[state.mode]||'')}</p></div>
  <div class="card"><h2>Player pack</h2>${host?`<select id="pack">${packOptions}</select><p class="muted small">Changing the pack makes everyone ready up again.</p>`:`<div class="pack-display"><b>${esc(packName())}</b><span class="muted">${state.packCounts?.[state.pack]||0} players</span></div>`}</div>
  ${formationCard}
  <div class="card"><h2>Managers</h2>${state.managers.map(x=>`<div class="manager"><div><b>${esc(x.name)}</b><div class="muted">${state.mode==='hard'?(x.formation||'No formation'):'Formation after draft'}</div></div><div class="${x.ready?'ready':'notready'}">${x.ready?'READY':'WAITING'}</div></div>`).join('')}</div>
  ${host?`<button class="primary big" id="start">Start draft</button>`:''}`);
  document.querySelector('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);showToast('Invite link copied')}catch{showToast('Copy the page address from your browser')}};
  if(host){document.querySelector('#mode').onchange=e=>socket.emit('setMode',{mode:e.target.value});document.querySelector('#pack').onchange=e=>socket.emit('setPack',{pack:e.target.value});}
  if(state.mode==='hard')document.querySelector('#formation').onchange=e=>socket.emit('setFormation',{formation:e.target.value});
  document.querySelector('#ready').onclick=()=>socket.emit('setReady',{ready:!m.ready});
  if(host)document.querySelector('#start').onclick=()=>socket.emit('startDraft',{},r=>{if(r&&!r.ok)showToast(r.error)});
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

const NOMINATION_POSITION_ORDER=['GK','LB','CB','RB','DM','CM','AM','LM','RM','LW','RW','ST'];
function nominationPlayersHtml(selectMode=null){
  const players=state.nomination?.availablePlayers||[];
  const term=nominationSearch.trim().toLowerCase();
  const searched=players.filter(p=>!term||p.name.toLowerCase().includes(term));
  const row=p=>`<div class="nomination-player"><div><b>${esc(p.name)}</b><div class="muted small">${esc(p.positions.join(' / '))}</div></div>${selectMode?`<button class="${selectMode==='final'?'primary':'secondary'} nominate-player" data-player="${p.id}" data-action="${selectMode}">${selectMode==='final'?'Pick £1m':'Nominate'}</button>`:''}</div>`;
  if(nominationPosition!=='ALL'){
    const matching=searched.filter(p=>p.positions?.includes(nominationPosition));
    if(!matching.length)return '<div class="muted">No available players match that search.</div>';
    const primary=matching.filter(p=>p.positions?.[0]===nominationPosition).sort((a,b)=>a.name.localeCompare(b.name));
    const alternate=matching.filter(p=>p.positions?.[0]!==nominationPosition).sort((a,b)=>a.name.localeCompare(b.name));
    return `${primary.length?`<div class="nomination-group"><div class="nomination-heading">${nominationPosition} · PRIMARY</div>${primary.map(row).join('')}</div>`:''}${alternate.length?`<div class="nomination-group"><div class="nomination-heading">${nominationPosition} · ALTERNATE</div>${alternate.map(row).join('')}</div>`:''}`;
  }
  if(!searched.length)return '<div class="muted">No available players match that search.</div>';
  return NOMINATION_POSITION_ORDER.map(pos=>{
    const group=searched.filter(p=>p.positions?.[0]===pos);if(!group.length)return '';
    return `<div class="nomination-group"><div class="nomination-heading">${pos}</div>${group.map(row).join('')}</div>`;
  }).join('');
}
function nominationPoolCard(selectMode=null){
  return `<div class="card"><div class="budget"><div><h2>${selectMode==='final'?'Final picks':'Nomination pool'}</h2><p class="muted no-margin">Main list: primary position then alphabetical. Position filters also include alternate positions, with primary matches first. No quality or rating order is used.</p></div><b>${state.nomination?.availablePlayers?.length||0} available</b></div><div class="nomination-filters"><input id="nomSearch" value="${esc(nominationSearch)}" placeholder="Search players"><select id="nomPos"><option value="ALL">All positions</option>${NOMINATION_POSITION_ORDER.map(pos=>`<option value="${pos}" ${nominationPosition===pos?'selected':''}>${pos}</option>`).join('')}</select></div><div id="nominationList">${nominationPlayersHtml(selectMode)}</div></div>`;
}
function wireNominationPool(selectMode=null){
  const search=document.querySelector('#nomSearch'),pos=document.querySelector('#nomPos'),list=document.querySelector('#nominationList');
  const redraw=()=>{if(list){list.innerHTML=nominationPlayersHtml(selectMode);wireNominationButtons(selectMode)}};
  if(search)search.oninput=e=>{nominationSearch=e.target.value;redraw()};
  if(pos)pos.onchange=e=>{nominationPosition=e.target.value;redraw()};
  wireNominationButtons(selectMode);
}
function wireNominationButtons(selectMode){
  if(!selectMode)return;
  document.querySelectorAll('.nominate-player').forEach(b=>b.onclick=()=>{
    const playerId=Number(b.dataset.player);
    if(selectMode==='final')socket.emit('nominationFinalPick',{playerId},r=>{if(r&&!r.ok)showToast(r.error)});
    else{
      const v=prompt('Opening bid in £m (minimum £1m)','1');if(v===null)return;
      socket.emit('nominatePlayer',{playerId,openingBid:Number(v)},r=>{if(r&&!r.ok)showToast(r.error)});
    }
  });
}
function managerTabHtml(){
  if(state.mode==='blind')return state.managers.map(x=>x.id===meId
    ? `<div class="card"><div class="budget"><h3>${esc(x.name)} (you)</h3><b>£${x.budget}m · ${x.squad.length}/11</b></div></div>`
    : `<div class="card blind-hidden"><h3>${esc(x.name)}</h3><p class="muted">Squad and budget hidden until the team reveal.</p></div>`).join('');
  return state.managers.map(x=>`<div class="card"><div class="budget"><h3>${esc(x.name)}</h3><b>£${x.budget}m · ${x.squad.length}/11</b></div><div>${x.squad.map(p=>`<span class="pill">${esc(p.name)} · ${state.mode==='hard'?esc(p.assignedPosition||'—'):esc(p.positions.join('/'))} · £${p.price}m</span>`).join('')||'<span class="muted">No players yet</span>'}</div></div>`).join('');
}
function blindDraftPanel(m,c){
  if(!c)return '<div class="card">Loading next player…</div>';
  const complete=m.squad.length>=11;
  const tieStage=c.blindStage===2;
  const eligible=!tieStage||c.blindTiebreakEligible;
  const locked=!!c.myBlindLocked;
  const min=Number(c.blindMinBid||0);
  const max=Math.max(0,m.budget-Math.max(0,11-m.squad.length-1));
  const bid=Number(c.myBlindBid||0);
  let controls='';
  if(complete)controls='<button class="secondary big" disabled>Squad complete · no decision needed</button>';
  else if(tieStage&&!eligible)controls='<div class="blind-wait"><b>Tiebreak in progress</b><div class="muted small">You are no longer involved in this auction.</div></div>';
  else{
    controls=`<div class="blind-controls"><label>${tieStage?'Tiebreak bid':'Your sealed bid'}</label><div class="blind-bid-row"><span>£</span><input id="blindBidInput" type="number" min="${min}" max="${max}" step="1" value="${bid}" ${locked||state.paused?'disabled':''}><span>m</span></div><div class="row"><button class="secondary grow blind-add" data-add="1" ${locked||state.paused?'disabled':''}>+£1m</button><button class="secondary grow blind-add" data-add="2" ${locked||state.paused?'disabled':''}>+£2m</button><button class="secondary grow blind-add" data-add="5" ${locked||state.paused?'disabled':''}>+£5m</button></div>${!tieStage?`<div class="spacer9"></div><button class="secondary big" id="blindNoBid" ${locked||state.paused?'disabled':''}>No bid (£0)</button>`:''}<div class="blind-decision">${bid>0?`Current decision: <b>£${bid}m bid</b>`:'Current decision: <b>No bid</b>'}${locked?' · LOCKED':''}</div><button class="${locked?'secondary':'primary'} big" id="blindLock" ${state.paused?'disabled':''}>${locked?'Unlock Decision':'Lock Decision'}</button></div>`;
  }
  const counter=tieStage?'TIEBREAK · 10 SECOND ROUND':`PLAYER ${state.shownCount||1} OF ${state.poolSize||'—'}`;
  return `<div class="card budget"><div><div class="muted">YOUR BUDGET</div><strong>£${m.budget}m</strong></div><div class="right"><div class="muted">YOUR SQUAD</div><strong>${m.squad.length}/11</strong></div></div><div class="card auction blind-auction"><div class="player-counter">${counter}</div><div id="timer" class="timer ${c.timeLeft<=5?'warn':''}">${c.timeLeft}</div><div class="player">${esc(c.player.name)}</div><div class="positions">${esc(c.player.positions.join(' / '))}</div>${c.blindEndgame?'<div class="required blind-endgame"><b>ENDGAME</b><div>Remaining players are compulsory. If nobody bids, this player will be assigned for £1m to an eligible manager with the most open squad slots; exact ties are completely random.</div></div>':''}${tieStage?'<div class="required">Only managers tied for the highest first-round bid can bid in this round. The original tied bid is your minimum.</div>':'<div class="blind-note">Nobody can see your bid, lock status, squad or remaining budget.</div>'}${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}<div class="spacer14"></div>${controls}</div>`;
}
function wireBlindControls(){
  const c=state.current;if(!c||state.mode!=='blind')return;
  const input=document.querySelector('#blindBidInput');
  const submit=value=>{let v=Math.floor(Number(value));if(!Number.isFinite(v))v=0;socket.emit('setBlindBid',{amount:v},r=>{if(r&&!r.ok)showToast(r.error);else if(state.current)state.current.myBlindBid=v})};
  if(input)input.oninput=e=>submit(e.target.value);
  document.querySelectorAll('.blind-add').forEach(b=>b.onclick=()=>{const base=Number(document.querySelector('#blindBidInput')?.value||0);const next=base+Number(b.dataset.add);if(input)input.value=next;submit(next)});
  const zero=document.querySelector('#blindNoBid');if(zero)zero.onclick=()=>{if(input)input.value=0;submit(0)};
  const lock=document.querySelector('#blindLock');if(lock)lock.onclick=()=>socket.emit('setBlindLock',{locked:!c.myBlindLocked},r=>{if(r&&!r.ok)showToast(r.error)});
}
function openAuctionPanel(m,c){
  const currentBid=c?.bid||0,next=currentBid+1,mandatory=c?.mandatoryIds?.includes(meId),complete=m.squad.length>=11;
  const isOut=!!c?.outIds?.includes(meId),leading=c?.bidderId===meId,eligible=!!c?.eligibleIds?.includes(meId);
  let controls='';
  if(complete)controls='<button class="secondary big" disabled>Squad complete · automatically out</button>';
  else if(c){
    const bidControls=(eligible||leading)?`<button class="primary big" id="bid">BID £${next}m</button><div class="spacer9"></div><div class="row"><button class="secondary grow jump" data-jump="2">+£2m</button><button class="secondary grow jump" data-jump="5">+£5m</button><button class="secondary grow" id="custom">Custom</button></div>`:'<button class="secondary big" disabled>Automatically out for this player</button>';
    const outControl=leading?'<button class="secondary out-button" disabled>You are currently leading</button>':eligible?`<button class="${isOut?'out-button active':'out-button'}" id="auctionOut">${isOut?'I’m Out ✓ · tap to re-enter':'I’m Out'}</button>`:'';
    controls=`${bidControls}${outControl?`<div class="spacer9"></div>${outControl}`:''}`;
  }
  const counter=state.mode==='nomination'?`AUCTION ${state.shownCount||1} · ${state.nomination?.availablePlayers?.length||0} STILL AVAILABLE`:`PLAYER ${state.shownCount||1} OF ${state.poolSize||'—'}`;
  const compulsory=mandatory?`<div class="required">${state.mode==='freeform'?'The draft has reached its compulsory endgame. If nobody bids, this player will go for £1m to an eligible manager with the most open squad slots; exact ties are completely random.':'This player cannot safely be skipped. If nobody bids, they will be randomly assigned for £1m to one eligible manager.'}</div>`:'';
  return `<div class="card budget"><div><div class="muted">YOUR BUDGET</div><strong>£${m.budget}m</strong></div><div class="right"><div class="muted">SQUAD</div><strong>${m.squad.length}/11</strong></div></div>${c?`<div class="card auction"><div class="player-counter">${counter}</div><div id="timer" class="timer ${c.timeLeft<=5?'warn':''}">${c.timeLeft}</div><div class="player">${esc(c.player.name)}</div><div class="positions">${c.player.positions.join(' / ')}</div>${state.mode==='freeform'?scarcityHtml(c):''}${compulsory}<div class="bidvalue">£${currentBid}m</div><div class="leader">${c.bidderId?esc(managerName(c.bidderId))+' leads':'No bids yet'}</div>${isOut?'<div class="out-status">You are out of the bidding for this player. Place a bid or tap again to re-enter.</div>':''}${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}<div class="spacer14"></div>${controls}</div>`:'<div class="card">Loading next player…</div>'}`;
}
function wireOpenAuction(c){
  const m=me();if(!c||m.squad.length>=11)return;
  const currentBid=c.bid||0,next=currentBid+1,eligible=!!c.eligibleIds?.includes(meId)||c.bidderId===meId;
  if(eligible){
    const send=amt=>socket.emit('bid',{amount:amt},r=>{if(r&&!r.ok)showToast(r.error)});
    const bidBtn=document.querySelector('#bid');if(bidBtn)bidBtn.onclick=()=>send(next);
    document.querySelectorAll('.jump').forEach(b=>b.onclick=()=>send(currentBid+Number(b.dataset.jump)));
    const custom=document.querySelector('#custom');if(custom)custom.onclick=()=>{const v=prompt('Bid amount in £m',String(next));if(v)send(Number(v))};
  }
  const outBtn=document.querySelector('#auctionOut');if(outBtn)outBtn.onclick=()=>socket.emit('setAuctionOut',{out:!c.outIds?.includes(meId)},r=>{if(r&&!r.ok)showToast(r.error)});
}
function nominationTurnPanel(){
  const nom=state.nomination||{},mine=nom.nominatorId===meId,finalMine=nom.finalPickManagerId===meId;
  if(nom.finalPickManagerId){
    const who=managerName(nom.finalPickManagerId);
    return `${finalMine?`<div class="card nomination-turn"><div class="muted">FINAL PICKS</div><h1>Your remaining players</h1><p class="muted">Everyone else is complete. Choose your remaining players from the pool for £1m each.</p></div>${nominationPoolCard('final')}`:`<div class="card nomination-turn"><div class="muted">FINAL PICKS</div><h2>${esc(who)} is completing their squad</h2><p class="muted">Remaining selections cost £1m each.</p></div>${nominationPoolCard(null)}`}`;
  }
  const who=managerName(nom.nominatorId);
  return `<div class="card nomination-turn"><div class="player-counter">NOMINATION TURN</div><div id="nominationTimer" class="timer ${Number(nom.timeLeft)<=5?'warn':''}">${nom.timeLeft??20}</div><h2>${mine?'Your turn to nominate':`${esc(who)} is choosing a player`}</h2><p class="muted">${mine?'Choose anyone from the available pool and set a real opening bid of at least £1m.':'You can browse the pool while you wait.'}</p>${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}</div>${nominationPoolCard(mine?'nominate':null)}`;
}
function draft(){
  const m=me(),c=state.current;
  const tabs=[['draft','Draft'],...(state.mode==='nomination'?[['pool','Pool']]:[]),['team','My Team'],['managers','Managers']];
  shell(`<div class="mode-strip">${esc(modeName())} · ${esc(packName())}</div><div class="tabs">${tabs.map(([key,label])=>`<button class="tab ${tab===key?'active':''}" data-tab="${key}">${label}</button>`).join('')}</div><div id="panel"></div>`);
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;draft()});
  const panel=document.querySelector('#panel');
  if(tab==='draft'){
    if(state.mode==='blind')panel.innerHTML=blindDraftPanel(m,c);
    else if(state.mode==='nomination'&&!c)panel.innerHTML=nominationTurnPanel();
    else panel.innerHTML=openAuctionPanel(m,c);
  }else if(tab==='pool'&&state.mode==='nomination')panel.innerHTML=nominationPoolCard(null);
  else if(tab==='team')panel.innerHTML=state.mode==='hard'?`<div class="card"><h2>${m.formation} · £${m.budget}m left</h2><div class="squad">${hardSquadHtml(m)}</div></div>`:`<div class="card"><div class="budget"><h2>Your 11</h2><b>£${m.budget}m left</b></div>${freeformDraftSquadHtml(m)}</div>`;
  else if(tab==='managers')panel.innerHTML=managerTabHtml();
  if(state.mode==='blind'&&tab==='draft')wireBlindControls();
  if(state.mode!=='blind'&&tab==='draft'&&c)wireOpenAuction(c);
  if(state.mode==='nomination'&&((tab==='draft'&&!c)||tab==='pool'))wireNominationPool(tab==='draft'&&!c?(state.nomination?.finalPickManagerId===meId?'final':state.nomination?.nominatorId===meId?'nominate':null):null);
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
  shell(`<div class="mode-strip">${esc(modeName())} team builder · ${esc(packName())}</div>
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
  if(isFreeformLike()){
    return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.finalFormation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}${pitchHtml(m,false)}</div>`;
  }
  return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.formation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}<div class="squad">${hardSquadHtml(m)}</div></div>`;
}

function draftHistoryHtml(){
  if(state.mode!=='blind'||!state.draftHistory?.length)return '';
  return `<div class="card"><h2>Blind auction reveal</h2><p class="muted">Now that every team is locked, the hidden winners and prices are revealed.</p><div class="table-wrap"><table class="draft-history-table"><thead><tr><th>#</th><th>Player</th><th>Manager</th><th>Price</th></tr></thead><tbody>${state.draftHistory.map((h,i)=>`<tr><td>${i+1}</td><td><b>${esc(h.player?.name||'—')}</b></td><td>${h.noSale?'No sale':esc(h.winnerName||'—')}${h.forced?' <span class="forced-tag">forced</span>':''}</td><td>${h.noSale?'—':`£${h.price}m`}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function reveal(){
  const host=state.hostId===meId;
  shell(`<div class="card"><h1>Teams revealed</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p><p class="muted small">Individual player ratings remain hidden. These team scores judge the XI as deployed.</p></div>${state.managers.map(revealedTeamHtml).join('')}${draftHistoryHtml()}<div class="card"><h2>Season simulation</h2><p class="muted">Every team gets a balanced home/away schedule. Two managers play 10 matches; three managers play 12; with four or more, every pair plays home and away once. Results are revealed one match at a time.</p></div>${host?'<button class="primary big" id="simulate">Simulate season</button>':'<div class="card muted">Waiting for the host to start the simulation.</div>'}`);
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
function permanentHistoryStatusHtml(){
  if(!state?.historySaveStatus)return '';
  const cls=state.historySaveStatus==='saved'?'history-saved':(state.historySaveStatus==='saving'?'history-saving':'history-warning');
  return `<div class="card ${cls}"><b>${state.historySaveStatus==='saved'?'✓ Saved to All-Time Records':state.historySaveStatus==='saving'?'Saving to All-Time Records…':'Permanent history notice'}</b><div class="muted small">${esc(state.historySaveMessage||'')}</div></div>`;
}
function fullResults(){
  const host=state.hostId===meId,sim=state.simulation;
  const champion=state.managers.find(m=>m.id===sim.championId);
  const exhibition=state.simulationKind==='exhibition';
  const playoffs=(sim.playoffs||[]).length?`<div class="card"><h2>Title tiebreak</h2><p class="muted small">The league tiebreakers could not separate the leaders, so the title was decided on the pitch.</p>${sim.playoffs.map(m=>matchHtml(m,'Tiebreak playoff')).join('')}</div>`:'';
  let body='';
  if(resultsTab==='season') body=`<div class="card"><h2>Final table</h2>${standingsHtml(sim.table)}</div>${playoffs}<div class="card"><h2>Match results</h2><div class="matches">${(sim.matches||[]).map((m,i)=>matchHtml(m,`Match ${i+1} of ${sim.matches.length}`)).join('')}</div></div><div class="card"><h2>Team ratings</h2><p class="muted small">The team ratings that drove the simulation. Individual hidden player ratings remain secret.</p>${state.managers.map(m=>`<div class="rating-summary"><div><b>${esc(m.name)}</b><span>${isFreeformLike()?esc(m.finalFormation||'XI'):esc(m.formation||'XI')}</span></div><strong>${state.teamRatings?.[m.id]?.overall??'—'}</strong></div>`).join('')}</div>${state.mode==='blind'?draftHistoryHtml():''}`;
  else if(resultsTab==='players') body=`<div class="card"><h2>League player stats</h2><p class="muted">Top 10 performers across every manager's XI.</p>${leaderboardHtml(statsMetric)}</div>`;
  else if(resultsTab==='tots') body=`<div class="card"><div class="budget"><div><h2>Team of the Season</h2><p class="muted no-margin">Best-performing valid XI by average match rating, using the positions players were actually deployed in with sensible neighbouring roles.</p></div><b>${esc(sim.teamOfSeason?.formation||'XI')}</b></div><div class="spacer14"></div>${totsPitchHtml(sim.teamOfSeason)}</div>`;
  else body=sessionHtml();
  const simNote=exhibition?`<div class="card exhibition-banner"><b>Exhibition re-simulation #${state.exhibitionNumber||1}</b><div>This result is just for fun and does not change titles, head-to-heads or session history.</div></div>`:'';
  const controls=host?`<div class="post-sim-controls"><button class="secondary big" id="resimulate">${exhibition?'Re-simulate again':'Re-simulate season'}</button>${exhibition?'<button class="secondary big" id="officialResult">View official result</button>':''}<button class="primary big" id="again">Play again</button></div>`:'<div class="card muted">Waiting for the host to choose what happens next.</div>';
  shell(`${simNote}<div class="card champion"><div class="muted">${exhibition?'EXHIBITION WINNER':'SEASON CHAMPION'}</div><h1>🏆 ${esc(champion?.name||'Winner')}</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p></div>${!exhibition?permanentHistoryStatusHtml():''}${resultNav()}${body}<button class="secondary big" id="viewRecords">View All-Time Records</button><div class="spacer10"></div>${controls}`);
  wireResultTabs();wireStatSwitch();
  const recordsButton=document.querySelector('#viewRecords');if(recordsButton)recordsButton.onclick=openRecords;
  if(host){
    document.querySelector('#again').onclick=()=>socket.emit('playAgain',{});
    document.querySelector('#resimulate').onclick=()=>socket.emit('resimulateSeason',{},r=>{if(r&&!r.ok)showToast(r.error)});
    const official=document.querySelector('#officialResult');if(official)official.onclick=()=>socket.emit('viewOfficialSimulation',{},r=>{if(r&&!r.ok)showToast(r.error)});
  }
}
function results(){
  const host=state.hostId===meId,sim=state.simulation;if(!sim)return reveal();
  const total=sim.matches?.length||0,shown=Math.min(state.simulationRevealCount||0,total),exhibition=state.simulationKind==='exhibition';
  if(shown>=total)return fullResults();
  const latest=shown>0?sim.matches[shown-1]:null,liveTable=shown>0?sim.progressTables?.[shown-1]:null;
  const controls=host?`<div class="reveal-controls"><button class="primary big" id="revealNext">${shown===0?'Reveal first match':`Reveal match ${shown+1}`}</button><button class="secondary" id="revealAll">Reveal all results</button></div>`:'<div class="card muted">Waiting for the host to reveal the next match.</div>';
  shell(`${exhibition?`<div class="card exhibition-banner"><b>Exhibition re-simulation #${state.exhibitionNumber||1}</b><div>Does not affect official session history.</div></div>`:''}<div class="card reveal-header"><div class="muted">${exhibition?'EXHIBITION MATCHDAY REVEAL':'MATCHDAY REVEAL'}</div><h1>${shown} / ${total}</h1><p class="muted">Results and the league table are being revealed live to everyone in the room.</p></div>${latest?`<div class="card"><h2>Latest result</h2>${matchHtml(latest,`Match ${shown} of ${total}`)}</div>`:'<div class="card"><h2>Season ready</h2><p class="muted">No results have been shown yet.</p></div>'}${liveTable?`<div class="card"><h2>Live table</h2>${standingsHtml(liveTable)}</div>`:''}${controls}`);
  if(host){document.querySelector('#revealNext').onclick=()=>socket.emit('revealNextMatch',{});document.querySelector('#revealAll').onclick=()=>socket.emit('revealAllMatches',{});}
}

function finished(){
  const host=state.hostId===meId;
  if(isFreeformLike()){
    shell(`<div class="card"><h1>Teams revealed</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p></div>${state.managers.map(m=>`<div class="card"><div class="budget"><h2>${esc(m.name)}</h2><b>${esc(m.finalFormation||'XI')} · £${m.budget}m left</b></div>${pitchHtml(m,false)}</div>`).join('')}${host?'<button class="primary big" id="again">Play again</button>':'<div class="card muted">Waiting for the host to start another game.</div>'}`);
  } else {
    shell(`<div class="card"><h1>Draft complete</h1><p class="muted">${esc(packName())} · Hard Mode</p></div>${state.managers.map(m=>`<div class="card"><div class="budget"><h2>${esc(m.name)}</h2><b>${m.formation} · £${m.budget}m left</b></div><div class="squad">${hardSquadHtml(m)}</div></div>`).join('')}${host?'<button class="primary big" id="again">Play again</button>':'<div class="card muted">Waiting for the host to start another game.</div>'}`);
  }
  if(host)document.querySelector('#again').onclick=()=>socket.emit('playAgain',{});
}

function render(){
  if(viewingRecords)return recordsScreen();
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
  const endgameJustBegan=s.mode==='blind'&&s.phase==='draft'&&!!s.current?.blindEndgame&&!blindEndgameAnnounced;
  state=s;
  if(s.viewerId)meId=s.viewerId;
  if(s.mode!=='blind'||s.phase!=='draft')blindEndgameAnnounced=false;
  if(phaseChanged){
    selectedLineupSlot=null;
    if(s.phase==='draft'){tab='draft';nominationSearch='';nominationPosition='ALL';}
    if(s.phase==='results'){resultsTab='season';statsMetric='goals';}
  }
  render();
  if(endgameJustBegan){blindEndgameAnnounced=true;showToast('Endgame has begun · remaining players are compulsory');}
});
socket.on('tick',({timeLeft})=>{
  if(state?.current){
    state.current.timeLeft=timeLeft;
    const t=document.querySelector('#timer');
    if(t){t.textContent=timeLeft;t.classList.toggle('warn',timeLeft<=5)}
  }
});
socket.on('nominationTick',({timeLeft})=>{
  if(state?.nomination){state.nomination.timeLeft=timeLeft;const t=document.querySelector('#nominationTimer');if(t){t.textContent=timeLeft;t.classList.toggle('warn',timeLeft<=5)}}
});
socket.on('auctionNotice',({message})=>{if(message)showToast(message)});
socket.on('connect',attemptResume);
applyVisualTheme();
home();
