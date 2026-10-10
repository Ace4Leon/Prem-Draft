const socket=io();
const app=document.querySelector('#app');
const toast=document.querySelector('#toast');
let state=null;
let meId=null;
let tab='draft';
let selectedLineupSlot=null;
let resultsTab='season';
let statsMetric='goals';
let postSimView='results';
let reviewManagerId=null;
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
let recordsConnectionStatus=null;
let recordsAdminConfigured=false;
let recordsAdminUnlocked=false;
let recordsAdminMode=false;
let recordsAdminData=null;
let recordsAdminProfilesData=null;
let recordsAdminSection='games';
let historicalCompetition=null;
let historicalView='results';
let historicalResultTab='season';
let historicalStatsMetric='goals';
let historicalTeamId=null;

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
function resumeSavedRoom(manual=false){
  if(!socket.connected||resumeInFlight)return;
  const saved=readSavedSession();if(!saved?.room||!saved?.reconnectToken)return;
  const requested=q('room');
  // v8: simply opening the homepage must never drag someone back into an old room.
  // Auto-resume only when the URL itself is asking for that same room. A homepage
  // visitor can still choose the explicit Resume button below.
  if(!manual){
    if(!requested)return;
    if(requested.toUpperCase()!==String(saved.room).toUpperCase())return;
  }
  resumeInFlight=true;
  socket.emit('resumeSession',{code:saved.room,token:saved.reconnectToken},r=>{
    resumeInFlight=false;
    if(!r?.ok){
      clearSavedSession();
      if(manual)showToast('That previous room is no longer available.');
      if(!state)home();
      return;
    }
    meId=r.managerId||r.state?.viewerId||saved.managerId;state=r.state;
    history.replaceState({},'',`?room=${state.code}`);render();
  });
}
function attemptResume(){resumeSavedRoom(false)}

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
function isFreeformLike(){return ['freeform','nomination','blind','priority'].includes(state?.mode)}
function commissionerMarkup(){
  const host=state?.hostId===meId;
  const show=host&&['draft','team_build'].includes(state?.phase);
  if(!show)return '';
  const priority=state?.mode==='priority';
  const canAuction=state.phase==='draft'&&!!state.current&&state.current?.priorityStage!=='result';
  return `<div class="commission-modal" id="commissionModal" hidden><div class="commission-sheet"><div class="budget"><div><h2>Commissioner controls</h2><p class="muted no-margin">Failsafe controls for the host.</p></div><button class="icon-button" id="closeCommission">×</button></div>${state.phase==='draft'?`<button class="secondary big" id="pauseDraft">${state.paused?'Resume draft':'Pause draft'}</button><div class="spacer9"></div><button class="secondary big" id="restartAuction" ${canAuction?'':'disabled'}>Restart current ${priority?'round':'auction'}</button>${priority?'':`<div class="spacer9"></div><button class="secondary big danger-soft" id="skipCurrent" ${canAuction?'':'disabled'}>Skip current player</button>`}<div class="spacer14"></div>`:''}<button class="danger big" id="abandonDraft">Abandon draft & return to lobby</button></div></div>`;
}
function wireCommissioner(){
  const open=document.querySelector('#commissionerBtn'),modal=document.querySelector('#commissionModal');
  if(!open||!modal)return;
  open.onclick=()=>{modal.hidden=false};
  const close=document.querySelector('#closeCommission');if(close)close.onclick=()=>{modal.hidden=true};
  modal.onclick=e=>{if(e.target===modal)modal.hidden=true};
  const pause=document.querySelector('#pauseDraft');if(pause)pause.onclick=()=>socket.emit('commissionPause',{paused:!state.paused},r=>{if(r&&!r.ok)showToast(r.error)});
  const restart=document.querySelector('#restartAuction');if(restart)restart.onclick=()=>{if(confirm(state?.mode==='priority'?'Restart this Priority Bid round from the beginning?':'Restart this auction from the beginning?'))socket.emit('commissionRestartAuction',{},r=>{if(r&&!r.ok)showToast(r.error)});};
  const skip=document.querySelector('#skipCurrent');if(skip)skip.onclick=()=>{if(confirm('Skip this player? This cannot be undone.'))socket.emit('commissionSkipCurrent',{},r=>{if(r&&!r.ok)showToast(r.error)});};
  const abandon=document.querySelector('#abandonDraft');if(abandon)abandon.onclick=()=>{if(confirm('Abandon this draft and return everyone to the lobby?'))socket.emit('commissionAbandonDraft',{},r=>{if(r&&!r.ok)showToast(r.error)});};
}
function shell(content){
  applyVisualTheme();
  const commissioner=(state?.hostId===meId&&['draft','team_build'].includes(state?.phase))?'<button class="theme-toggle commissioner-button" id="commissionerBtn" aria-label="Commissioner controls">⚙</button>':'';
  const practice=(state&&state.phase!=='lobby'&&state.saveToHistory===false)?'<span class="practice-badge">PRACTICE</span>':'';
  app.innerHTML=`<div class="wrap"><div class="topbar"><div class="brand">⚽ Prem Draft ${practice}</div><div class="top-actions">${commissioner}<button class="theme-toggle" id="themeToggle" aria-label="Visual theme: ${visualTheme}. Tap to switch.">${themeButtonLabel()}</button></div></div>${content}${commissionerMarkup()}</div>`;
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

function recordsConnectionHtml(){
  const connected=recordsConnectionStatus===true,unavailable=recordsConnectionStatus===false;
  const label=connected?'Records connected':unavailable?'Records unavailable':'Checking records…';
  const cls=connected?'connected':unavailable?'unavailable':'checking';
  return `<div class="records-connection ${cls}" id="recordsConnectionStatus"><span>●</span> ${label}</div>`;
}
function updateRecordsConnectionIndicator(){
  const el=document.querySelector('#recordsConnectionStatus');if(!el)return;
  const connected=recordsConnectionStatus===true,unavailable=recordsConnectionStatus===false;
  el.className=`records-connection ${connected?'connected':unavailable?'unavailable':'checking'}`;
  el.innerHTML=`<span>●</span> ${connected?'Records connected':unavailable?'Records unavailable':'Checking records…'}`;
}
function refreshRecordsStatus(){
  socket.emit('recordsStatus',{},r=>{
    recordsConnectionStatus=!!r?.connected;
    recordsAdminConfigured=!!r?.adminConfigured;
    updateRecordsConnectionIndicator();
  });
}

function home(){
  viewingRecords=false;
  const code=q('room')||'';
  const profile=savedProfile();
  const savedRoom=readSavedSession();
  const resumeCard=!code&&savedRoom?.room?`<div class="resume-room-card"><div><b>Previous room ${esc(savedRoom.room)}</b><div class="muted small">Resume it only if you want to return to that still-active room.</div></div><button class="secondary small-button" id="resumePreviousRoom">Resume</button></div><div class="spacer10"></div>`:'';
  const profileCard=profile?.recoveryCode
    ? `<div class="profile-strip"><div><div class="muted small">PERMANENT MANAGER</div><b>${esc(profile.defaultName)}</b><div class="muted small">Recovery code: <strong>${esc(profile.recoveryCode)}</strong></div></div><div class="profile-actions"><button class="secondary small-button" id="editProfile">Edit default</button><button class="secondary small-button" id="recoverProfile">Switch / recover</button></div></div>`
    : `<div class="profile-strip"><div><b>Permanent records</b><div class="muted small">Your first room will create a short recovery code so your all-time stats follow you across rooms and days.</div></div><button class="secondary small-button" id="recoverProfile">I have a code</button></div>`;
  shell(`<div class="card"><h1>Football Auction Draft</h1><p class="muted">Build your XI with a £100m budget.</p>${profileCard}${recordsConnectionHtml()}<div class="spacer14"></div><label>Name for this room</label><input id="name" maxlength="20" value="${esc(profile?.defaultName||'')}" placeholder="Your name"><p class="muted small">Changing this only changes how you appear in this room; it does not create a new all-time identity.</p><div class="spacer10"></div>${code?`<div class="row mobile-stack"><input id="code" value="${esc(code)}"><button class="primary" id="join">Join room</button></div>`:`<button class="primary big" id="create">Create game</button><div class="spacer10"></div><div class="row mobile-stack"><input id="code" placeholder="Room code"><button class="secondary" id="join">Join</button></div>`}<div class="spacer14"></div>${resumeCard}<button class="secondary big" id="records">🏆 All-Time Records</button></div>`);
  refreshRecordsStatus();
  const recover=document.querySelector('#recoverProfile');if(recover)recover.onclick=()=>recoverProfileFlow();
  const edit=document.querySelector('#editProfile');if(edit)edit.onclick=editDefaultProfileName;
  document.querySelector('#records').onclick=openRecords;
  const resumeButton=document.querySelector('#resumePreviousRoom');if(resumeButton)resumeButton.onclick=()=>resumeSavedRoom(true);
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
  return `<div class="table-wrap"><table class="history-table"><thead><tr><th>#</th><th>Manager</th><th>Drafts</th><th>Titles</th><th>PPG</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${(rows||[]).map((r,i)=>`<tr><td>${i+1}</td><td><b>${esc(r.name)}</b></td><td>${r.drafts}</td><td><b>${r.titles}</b></td><td><b>${Number(r.ppg||0).toFixed(2)}</b></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd>0?'+':''}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function openRecords(){
  viewingRecords=true;recordsSummaryData=null;recordsGroupData=null;recordsAdminMode=false;recordsAdminData=null;recordsAdminProfilesData=null;historicalCompetition=null;
  shell('<div class="card"><h1>All-Time Records</h1><p class="muted">Loading permanent history…</p></div>');
  socket.emit('recordsSummary',{},r=>{
    if(!r?.ok){shell(`<div class="card"><h1>All-Time Records</h1><p class="muted">${esc(r?.error||'Could not load records.')}</p><button class="secondary big" id="recordsBack">Back</button></div>`);document.querySelector('#recordsBack').onclick=closeRecords;return;}
    recordsSummaryData=r;recordsConnectionStatus=r.recordsConnected!==false;recordsAdminConfigured=!!r.adminConfigured;
    const profile=savedProfile();
    const preferred=(r.groups||[]).find(g=>profile?.profileId&&g.profileIds?.includes(profile.profileId))||(r.groups||[])[0];
    selectedRivalryKey=preferred?.key||'';
    selectedRecordModes=new Set(Object.keys(r.modeLabels||{}));
    selectedRecordPacks=new Set(Object.keys(r.packLabels||{}));
    if(selectedRivalryKey)loadRivalryGroup();else recordsScreen();
  });
}
function closeRecords(){
  viewingRecords=false;recordsSummaryData=null;recordsGroupData=null;recordsAdminMode=false;recordsAdminData=null;recordsAdminProfilesData=null;historicalCompetition=null;
  if(state)render();else home();
}
function loadRivalryGroup(){
  if(!selectedRivalryKey){recordsGroupData=null;return recordsScreen();}
  recordsGroupData=null;recordsScreen();
  socket.emit('recordsGroup',{key:selectedRivalryKey,modes:[...selectedRecordModes],packs:[...selectedRecordPacks]},r=>{
    if(!r?.ok){showToast(r?.error||'Could not load rivalry group');return;}
    recordsGroupData=r;if(viewingRecords&&!historicalCompetition)recordsScreen();
  });
}
function recordsFiltersHtml(){
  const modes=recordsSummaryData?.modeLabels||{},packs=recordsSummaryData?.packLabels||{};
  return `<div class="records-filter-panel" id="recordsFilterPanel" hidden><div class="filter-columns"><div><b>Draft modes</b>${Object.entries(modes).map(([k,v])=>`<label class="filter-check"><input type="checkbox" data-filter-mode="${esc(k)}" ${selectedRecordModes.has(k)?'checked':''}> ${esc(v)}</label>`).join('')}</div><div><b>Player packs</b>${Object.entries(packs).map(([k,v])=>`<label class="filter-check"><input type="checkbox" data-filter-pack="${esc(k)}" ${selectedRecordPacks.has(k)?'checked':''}> ${esc(v)}</label>`).join('')}</div></div><div class="row"><button class="secondary grow" id="recordsAllFilters">Select all</button><button class="primary grow" id="recordsApplyFilters">Apply</button></div></div>`;
}
function adminDate(v){
  try{return new Date(v).toLocaleString()}catch{return String(v||'')}
}
function draftHistoryCardsHtml(drafts){
  if(!drafts?.length)return '<div class="muted">No drafts match the current filters.</div>';
  return `<div class="saved-draft-list">${drafts.map(d=>{
    const places=(d.participants||[]).filter(p=>p.rank).sort((a,b)=>a.rank-b.rank).map(p=>`${p.rank}. ${esc(p.name)}`).join(' · ');
    return `<div class="saved-draft-card"><div class="saved-draft-main"><b>${esc(adminDate(d.completedAt))}</b><div class="muted small">${esc(recordsSummaryData?.modeLabels?.[d.mode]||d.mode)} · ${esc(recordsSummaryData?.packLabels?.[d.pack]||d.pack)}</div><div class="small"><strong>Champion: ${esc(d.champion||'—')}</strong>${places?`<span class="draft-places">${places}</span>`:''}</div></div><button class="secondary saved-draft-open" data-historical-comp="${esc(d.competitionId)}">View draft ›</button></div>`;
  }).join('')}</div>`;
}
function openHistoricalCompetition(competitionId){
  historicalCompetition={loading:true,competitionId};historicalView='results';historicalResultTab='season';historicalStatsMetric='goals';historicalTeamId=null;recordsScreen();
  socket.emit('recordsCompetition',{competitionId},r=>{
    if(!r?.ok){historicalCompetition=null;showToast(r?.error||'Could not load saved draft');return recordsScreen();}
    historicalCompetition=r.competition;
    const profile=savedProfile(),participants=r.competition?.data?.participants||[];
    const preferred=participants.find(p=>profile?.profileId&&p.profileId===profile.profileId)||[...participants].sort((a,b)=>(a.rank||999)-(b.rank||999))[0];
    historicalTeamId=preferred?.profileId||preferred?.managerId||null;
    recordsScreen();
  });
}
function priorityBidHistoryHtml(rows,title='Priority Bid history'){
  if(!rows?.length)return '';
  return `<div class="card"><h2>${esc(title)}</h2><p class="muted">Full bid sheets are revealed only after the teams are complete.</p><div class="priority-history-list">${rows.map(r=>{
    const board=r.board||[],allocs=r.allocations||[];
    const summary=allocs.map(a=>`<span class="pill"><b>${esc(a.player?.name||board.find(p=>p.id===a.playerId)?.name||'Player')}</b> → ${esc(a.managerName||'Manager')} · £${a.price}m</span>`).join('');
    const matrix=`<div class="table-wrap"><table class="priority-matrix"><thead><tr><th>Manager</th>${board.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${(r.bids||[]).map(row=>`<tr><td><b>${esc(row.managerName||'Manager')}</b></td>${board.map(p=>{const b=(row.bids||[]).find(x=>Number(x.playerId)===Number(p.id));return `<td>£${b?.amount??1}m</td>`}).join('')}</tr>`).join('')}</tbody></table></div>`;
    const ties=(r.tiebreaks||[]).length?`<div class="priority-tie-history"><b>Tiebreaks</b>${r.tiebreaks.map(t=>{const p=board.find(x=>Number(x.id)===Number(t.playerId));return `<div>${esc(p?.name||'Player')}: ${(t.bids||[]).map(b=>`${esc((r.bids||[]).find(x=>x.managerId===b.managerId)?.managerName||'Manager')} £${b.amount}m`).join(' · ')}${t.randomSecondTie?' · second tie decided randomly':''}</div>`}).join('')}</div>`:'';
    return `<details class="priority-history-round"><summary>Round ${r.round||'—'} <span>${allocs.length} signings</span></summary><div class="priority-history-summary">${summary}</div>${matrix}${ties}</details>`;
  }).join('')}</div></div>`;
}
function simpleDraftHistoryHtml(rows,title='Draft / auction history'){
  if(!rows?.length)return '';
  return `<div class="card"><h2>${esc(title)}</h2><div class="table-wrap"><table class="draft-history-table"><thead><tr><th>#</th><th>Player</th><th>Manager</th><th>Price</th></tr></thead><tbody>${rows.map((h,i)=>`<tr><td>${i+1}</td><td><b>${esc(h.player?.name||'—')}</b></td><td>${h.noSale?'No sale':esc(h.winnerName||'—')}${h.forced?' <span class="forced-tag">forced</span>':''}</td><td>${h.noSale?'—':`£${h.price}m`}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function historicalDraftHistoryHtml(data){
  const rows=data?.draftHistory||[];if(!rows.length)return '';
  return rows.some(r=>r.type==='priorityRound')?priorityBidHistoryHtml(rows.filter(r=>r.type==='priorityRound'),'Priority Bid history'):simpleDraftHistoryHtml(rows);
}
function historicalCompetitionScreen(){
  if(historicalCompetition?.loading){shell('<div class="card"><h1>Saved Draft</h1><p class="muted">Loading the completed season…</p></div>');return;}
  const c=historicalCompetition,d=c?.data||{},participants=[...(d.participants||[])].sort((a,b)=>(a.rank||999)-(b.rank||999));
  const champion=participants.find(p=>p.profileId===d.championProfileId)||participants.find(p=>p.rank===1);
  const mode=recordsSummaryData?.modeLabels?.[c.mode]||c.mode,pack=recordsSummaryData?.packLabels?.[c.pack]||c.pack;
  const viewToggle=`<div class="post-view-toggle"><button class="result-tab ${historicalView==='results'?'active':''}" data-historical-view="results">Results</button><button class="result-tab ${historicalView==='teams'?'active':''}" data-historical-view="teams">Teams</button></div>`;
  let body='';
  if(historicalView==='teams'){
    body=teamReviewHtml(participants,d.playerStats||[],historicalTeamId,true,d.matches||[]);
  }else{
    const nav=`<div class="result-tabs"><button class="result-tab ${historicalResultTab==='season'?'active':''}" data-historical-tab="season">Season</button><button class="result-tab ${historicalResultTab==='players'?'active':''}" data-historical-tab="players">Player stats</button><button class="result-tab ${historicalResultTab==='tots'?'active':''}" data-historical-tab="tots">Team of Season</button></div>`;
    if(historicalResultTab==='season'){
      const playoffs=(d.playoffs||[]).length?`<div class="card"><h2>Title tiebreak</h2>${d.playoffs.map(m=>matchHtml(m,'Tiebreak playoff')).join('')}</div>`:'';
      body=`${nav}<div class="card"><h2>Final table</h2>${standingsHtml(d.finalTable||[])}</div>${playoffs}<div class="card"><h2>Match results</h2><div class="matches">${(d.matches||[]).map((m,i)=>matchHtml(m,`Match ${i+1} of ${d.matches.length}`)).join('')}</div></div>${historicalDraftHistoryHtml(d)}`;
    }else if(historicalResultTab==='players'){
      body=`${nav}<div class="card"><h2>League player stats</h2><p class="muted">Top 10 performers from this saved season.</p>${historicalLeaderboardHtml(d.playerStats||[],historicalStatsMetric)}</div>`;
    }else{
      body=`${nav}<div class="card"><div class="budget"><div><h2>Team of the Season</h2><p class="muted no-margin">The Team of the Season generated when this draft was played.</p></div><b>${esc(d.teamOfSeason?.formation||'XI')}</b></div><div class="spacer14"></div>${totsPitchHtml(d.teamOfSeason)}</div>`;
    }
  }
  shell(`<div class="card records-header"><div><div class="muted small">SAVED OFFICIAL DRAFT · ${esc(adminDate(c.completedAt))}</div><h1>🏆 ${esc(champion?.displayName||'Completed draft')}</h1><p class="muted no-margin">${esc(pack)} · ${esc(mode)}</p></div><button class="secondary" id="historicalBack">Back to rivalry</button></div>${viewToggle}${body}`);
  document.querySelector('#historicalBack').onclick=()=>{historicalCompetition=null;recordsScreen();};
  document.querySelectorAll('[data-historical-view]').forEach(b=>b.onclick=()=>{historicalView=b.dataset.historicalView;recordsScreen();});
  document.querySelectorAll('[data-historical-tab]').forEach(b=>b.onclick=()=>{historicalResultTab=b.dataset.historicalTab;recordsScreen();});
  document.querySelectorAll('[data-historical-stat]').forEach(b=>b.onclick=()=>{historicalStatsMetric=b.dataset.historicalStat;recordsScreen();});
  document.querySelectorAll('[data-team-review]').forEach(b=>b.onclick=()=>{historicalTeamId=b.dataset.teamReview;recordsScreen();});
}
function adminGamesHtml(){
  if(!recordsAdminData)return '<div class="card"><h2>Saved games</h2><p class="muted">Loading saved games…</p></div>';
  const rows=recordsAdminData.competitions||[];
  return `<div class="card"><h2>Saved games</h2><p class="muted">Excluded games stay in the database but do not count toward any leaderboard or Rivalry Group.</p>${rows.length?`<div class="admin-record-list">${rows.map(c=>`<div class="admin-record ${c.excluded?'excluded':''}"><div class="admin-record-main"><b>${esc((c.managers||[]).join(' / ')||'Unknown managers')}</b><div class="muted small">${esc(adminDate(c.completedAt))} · ${esc(recordsAdminData.modeLabels?.[c.mode]||c.mode)} · ${esc(recordsAdminData.packLabels?.[c.pack]||c.pack)}</div><div class="muted small">Champion: ${esc(c.champion||'—')} · ${c.excluded?'EXCLUDED':'Counting in records'}</div></div><button class="${c.excluded?'secondary':'danger-soft'} admin-record-toggle" data-comp="${esc(c.competitionId)}" data-excluded="${c.excluded?'1':'0'}">${c.excluded?'Restore':'Exclude'}</button></div>`).join('')}</div>`:'<p class="muted">No saved official games yet.</p>'}</div>`;
}
function adminProfilesHtml(){
  if(!recordsAdminProfilesData)return '<div class="card"><h2>Manage Profiles</h2><p class="muted">Loading permanent manager profiles…</p></div>';
  const profiles=recordsAdminProfilesData.profiles||[];
  const options=profiles.map(p=>`<option value="${esc(p.profileId)}">${esc(p.defaultName)} · ${esc(p.recoveryCode)}</option>`).join('');
  return `<div class="card"><h2>Manage Profiles</h2><p class="muted">Recovery codes are private admin information. Renaming keeps the same identity and all history.</p>${profiles.length?`<div class="admin-profile-list">${profiles.map(p=>`<div class="admin-profile"><div><b>${esc(p.defaultName)}</b><div class="profile-code">${esc(p.recoveryCode)}</div><div class="muted small">${p.drafts} saved draft${p.drafts===1?'':'s'}${p.aliases?.length?` · old code${p.aliases.length===1?'':'s'}: ${esc(p.aliases.join(', '))}`:''}</div></div><button class="secondary small-button admin-profile-rename" data-profile="${esc(p.profileId)}" data-name="${esc(p.defaultName)}">Rename</button></div>`).join('')}</div><div class="profile-merge-box"><h3>Merge duplicate profiles</h3><p class="muted small">Choose the real profile to keep, then the accidental duplicate. The duplicate's old recovery code will continue to recover the surviving profile.</p><label>Keep this profile</label><select id="mergeSurvivor"><option value="">Choose profile</option>${options}</select><label>Merge this duplicate into it</label><select id="mergeDuplicate"><option value="">Choose duplicate</option>${options}</select><button class="danger-soft big" id="mergeProfiles">Merge duplicate profiles</button><p class="muted small">Safety rule: if both profiles appeared in the same completed official draft, Prem Draft will refuse the merge so standings cannot be corrupted.</p></div>`:'<p class="muted">No permanent profiles yet.</p>'}</div>`;
}
function adminRecordsHtml(){
  const nav=`<div class="record-tabs"><button class="result-tab ${recordsAdminSection==='games'?'active':''}" data-admin-section="games">Saved Games</button><button class="result-tab ${recordsAdminSection==='profiles'?'active':''}" data-admin-section="profiles">Manage Profiles</button></div>`;
  return `<div class="card"><div class="budget"><div><h2>Records Admin</h2><p class="muted no-margin">Private controls for correcting permanent history.</p></div><button class="secondary" id="adminBack">Back to records</button></div></div>${nav}${recordsAdminSection==='profiles'?adminProfilesHtml():adminGamesHtml()}`;
}
function loadAdminSection(section='games'){
  recordsAdminMode=true;recordsAdminSection=section;recordsScreen();
  if(section==='profiles'){
    recordsAdminProfilesData=null;recordsScreen();
    socket.emit('recordsAdminProfiles',{},r=>{if(!r?.ok){if(String(r?.error||'').includes('Admin access'))recordsAdminUnlocked=false;showToast(r?.error||'Could not load profiles');return;}recordsAdminProfilesData=r;if(viewingRecords)recordsScreen();});
  }else{
    recordsAdminData=null;recordsScreen();
    socket.emit('recordsAdminList',{},r=>{if(!r?.ok){if(String(r?.error||'').includes('Admin access'))recordsAdminUnlocked=false;showToast(r?.error||'Could not load admin records');return;}recordsAdminData=r;if(viewingRecords)recordsScreen();});
  }
}
function openAdminRecords(){
  if(recordsAdminUnlocked)return loadAdminSection(recordsAdminSection||'games');
  const code=prompt('Enter admin code:','');if(code===null)return;
  socket.emit('recordsAdminLogin',{code},r=>{
    if(!r?.ok)return showToast(r?.error||'Admin access denied');
    recordsAdminUnlocked=true;loadAdminSection('games');
  });
}
function wireAdminControls(){
  const back=document.querySelector('#adminBack');if(back)back.onclick=()=>openRecords();
  document.querySelectorAll('[data-admin-section]').forEach(b=>b.onclick=()=>loadAdminSection(b.dataset.adminSection));
  document.querySelectorAll('.admin-record-toggle').forEach(b=>b.onclick=()=>{
    const excluded=b.dataset.excluded==='1',competitionId=b.dataset.comp;
    if(!excluded&&!confirm('Exclude this completed game from all permanent leaderboards? You can restore it later.'))return;
    socket.emit('recordsAdminSetExcluded',{competitionId,excluded:!excluded},r=>{if(!r?.ok)return showToast(r?.error||'Could not update saved game');showToast(excluded?'Game restored':'Game excluded');loadAdminSection('games');});
  });
  document.querySelectorAll('.admin-profile-rename').forEach(b=>b.onclick=()=>{
    const name=prompt('Permanent manager name:',b.dataset.name||'Manager');if(name===null)return;
    socket.emit('recordsAdminRenameProfile',{profileId:b.dataset.profile,name},r=>{if(!r?.ok)return showToast(r?.error||'Could not rename profile');showToast('Permanent manager renamed');loadAdminSection('profiles');});
  });
  const merge=document.querySelector('#mergeProfiles');if(merge)merge.onclick=()=>{
    const survivorId=document.querySelector('#mergeSurvivor')?.value,duplicateId=document.querySelector('#mergeDuplicate')?.value;
    if(!survivorId||!duplicateId)return showToast('Choose both profiles first.');
    if(survivorId===duplicateId)return showToast('Choose two different profiles.');
    const profiles=recordsAdminProfilesData?.profiles||[],keep=profiles.find(p=>p.profileId===survivorId),dup=profiles.find(p=>p.profileId===duplicateId);
    if(!confirm(`Merge ${dup?.defaultName||'duplicate'} (${dup?.recoveryCode||''}) into ${keep?.defaultName||'surviving profile'} (${keep?.recoveryCode||''})?\n\nThis moves the duplicate's historical drafts to the surviving identity. The old recovery code will become an alias.`))return;
    socket.emit('recordsAdminMergeProfiles',{survivorId,duplicateId},r=>{
      if(!r?.ok){
        if(r?.conflict){const dates=(r.conflicts||[]).map(x=>adminDate(x.completedAt)).join('\n');alert(`${r.error}\n\nConflicting saved draft${(r.conflicts||[]).length===1?'':'s'}:\n${dates}`);return;}
        return showToast(r?.error||'Could not merge profiles');
      }
      showToast(`Profiles merged · ${r.affectedDrafts||0} draft${r.affectedDrafts===1?'':'s'} moved`);loadAdminSection('profiles');
    });
  };
}
function recordsScreen(){
  if(!viewingRecords)return;
  if(historicalCompetition)return historicalCompetitionScreen();
  if(!recordsSummaryData)return;
  if(recordsAdminMode){
    shell(`<div class="card records-header"><div><div class="muted small">PERMANENT HISTORY</div><h1>🏆 All-Time Records</h1></div><button class="secondary" id="recordsBack">Close</button></div>${adminRecordsHtml()}`);
    document.querySelector('#recordsBack').onclick=closeRecords;wireAdminControls();return;
  }
  const groups=recordsSummaryData.groups||[];
  const nav=`<div class="record-tabs"><button class="result-tab ${recordsSection==='rivalry'?'active':''}" data-record-section="rivalry">Rivalry Groups</button><button class="result-tab ${recordsSection==='all'?'active':''}" data-record-section="all">All Managers</button></div>`;
  let body='';
  if(recordsSection==='all'){
    body=`<div class="card"><h2>All-Time leaderboard</h2><p class="muted">Every completed official season stored across every room and rivalry group. Ranked by PPG, with Titles as the first tiebreak.</p>${historyTableHtml(recordsSummaryData.allTime||[])}</div>`;
  }else if(!groups.length){
    body='<div class="card"><h2>Rivalry Groups</h2><p class="muted">No completed official seasons have been saved yet.</p></div>';
  }else{
    const options=groups.map(g=>`<option value="${esc(g.key)}" ${g.key===selectedRivalryKey?'selected':''}>${esc(g.names.join(' / '))} · ${g.drafts} draft${g.drafts===1?'':'s'}</option>`).join('');
    const meta=recordsGroupData?`${recordsGroupData.matchingDrafts} matching draft${recordsGroupData.matchingDrafts===1?'':'s'} · ${recordsGroupData.matchingMatches} matches`:'Loading filtered table…';
    body=`<div class="card"><div class="budget"><div><h2>Rivalry Group</h2><p class="muted no-margin">Only drafts containing exactly this combination of managers count.</p></div></div><div class="spacer10"></div><select id="rivalryGroupSelect">${options}</select><div class="spacer10"></div><button class="secondary" id="recordsFilterButton">Filters ⚙</button>${recordsFiltersHtml()}<p class="muted small records-match-count">${esc(meta)}</p>${recordsGroupData?historyTableHtml(recordsGroupData.table||[]):'<div class="muted">Loading…</div>'}</div>${recordsGroupData?`<div class="card"><h2>Draft History</h2><p class="muted">Open any saved official draft and revisit its final results and teams.</p>${draftHistoryCardsHtml(recordsGroupData.drafts||[])}</div>`:''}`;
  }
  shell(`<div class="card records-header"><div><div class="muted small">PERMANENT HISTORY</div><h1>🏆 All-Time Records</h1>${recordsConnectionHtml()}</div><div class="profile-actions">${recordsAdminConfigured?'<button class="secondary small-button" id="recordsAdmin">Admin</button>':''}<button class="secondary" id="recordsBack">Back</button></div></div>${nav}${body}`);
  document.querySelector('#recordsBack').onclick=closeRecords;
  const adminButton=document.querySelector('#recordsAdmin');if(adminButton)adminButton.onclick=openAdminRecords;
  document.querySelectorAll('[data-record-section]').forEach(b=>b.onclick=()=>{recordsSection=b.dataset.recordSection;recordsScreen();});
  document.querySelectorAll('[data-historical-comp]').forEach(b=>b.onclick=()=>openHistoricalCompetition(b.dataset.historicalComp));
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
  const mainModeEntries=Object.entries(state.modeLabels||{}).filter(([key])=>key!=='hard');
  const modeOptions=`${state.mode==='hard'?'<option value="hard" selected disabled>Hard Mode (Legacy)</option>':''}${mainModeEntries.map(([key,label])=>`<option value="${key}" ${state.mode===key?'selected':''}>${esc(label)}</option>`).join('')}`;
  const descriptions={
    freeform:'Draft any 11 players in the normal open auction. Choose and arrange your formation after the draft.',
    nomination:'Managers take turns choosing who enters the auction. The pool is larger (18 per manager), and every nomination starts with a real £1m+ opening bid.',
    blind:'Every player is a sealed bid. Opponent budgets, squads, bids and winners stay secret until all teams are set.',
    priority:'Every round shows one player per manager. Bid blindly on all of them; the highest remaining bids resolve first until everyone gets one player.',
    hard:'Legacy mode. Choose your formation now; every signing must fit an open position and stays in its assigned slot.'
  };
  const legacyControl=host?`<details class="legacy-mode-box"><summary>Legacy modes</summary><p class="muted small">Hard Mode is retired from the main mode list while we decide whether to redesign it.</p><button class="secondary big" id="legacyHard">Use Hard Mode (Legacy)</button></details>`:(state.mode==='hard'?'<div class="legacy-badge">Legacy mode</div>':'');
  const prioritySettings=state.mode==='priority'?`<div class="card"><h2>Priority Bid visibility</h2><p class="muted small">The rules are identical; this only changes what managers can see during the draft.</p><div class="priority-visibility-row"><button class="${state.priorityVisibility==='visible'?'primary':'secondary'} grow priority-visibility" data-visibility="visible" ${host?'':'disabled'}>Visible</button><button class="${state.priorityVisibility==='hidden'?'primary':'secondary'} grow priority-visibility" data-visibility="hidden" ${host?'':'disabled'}>Hidden</button></div><p class="muted small">${state.priorityVisibility==='hidden'?'Hidden: opponent squads, budgets, winners, prices and remaining-position counts stay secret until the final team reveal.':'Visible: opponent squads/budgets stay visible; each round reveals only winning allocations and prices, plus remaining positional supply.'}</p></div>`:'';
  const formationCard=state.mode==='hard'
    ? `<div class="card"><h2>Your formation</h2><select id="formation"><option value="">Choose formation</option>${HARD_FORMATIONS.map(f=>`<option ${m.formation===f?'selected':''}>${f}</option>`).join('')}</select><div class="spacer10"></div><button class="${m.ready?'secondary':'primary'} big" id="ready" ${!m.formation?'disabled':''}>${m.ready?'Not ready':'Ready'}</button></div>`
    : `<div class="card"><h2>Your draft</h2><p class="muted">No formation yet. Draft any 11 players; you will build your XI afterwards.</p><button class="${m.ready?'secondary':'primary'} big" id="ready">${m.ready?'Not ready':'Ready'}</button></div>`;
  shell(`<div class="card"><div class="muted">ROOM CODE</div><div class="row"><div class="code grow">${state.code}</div><button class="secondary" id="copy">Copy link</button></div></div>
  <div class="card"><h2>Game mode</h2>${host?`<select id="mode">${modeOptions}</select>`:`<div class="pack-display"><b>${esc(modeName())}</b></div>`}<p class="muted small">${esc(descriptions[state.mode]||'')}</p>${legacyControl}</div>
  ${prioritySettings}
  <div class="card"><h2>Player pack</h2>${host?`<select id="pack">${packOptions}</select><p class="muted small">Changing the pack makes everyone ready up again.</p>`:`<div class="pack-display"><b>${esc(packName())}</b><span class="muted">${state.packCounts?.[state.pack]||0} players</span></div>`}</div>
  <div class="card record-save-card"><label class="record-save-toggle"><input id="saveToHistory" type="checkbox" ${state.saveToHistory!==false?'checked':''} ${host?'':'disabled'}><span><b>Save this game to All-Time Records</b><small>${state.saveToHistory!==false?'Official game · completed simulation will count permanently.':'Practice / unranked · permanent leaderboards will not change.'}</small></span></label>${host?'':'<div class="muted small">Only the host can change this before the draft starts.</div>'}</div>
  ${formationCard}
  <div class="card"><h2>Managers</h2>${state.managers.map(x=>`<div class="manager"><div><b>${esc(x.name)}</b><div class="muted">${state.mode==='hard'?(x.formation||'No formation'):'Formation after draft'}</div></div><div class="${x.ready?'ready':'notready'}">${x.ready?'READY':'WAITING'}</div></div>`).join('')}</div>
  ${host?`<button class="primary big" id="start">Start draft</button>`:''}`);
  document.querySelector('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);showToast('Invite link copied')}catch{showToast('Copy the page address from your browser')}};
  if(host){
    document.querySelector('#mode').onchange=e=>socket.emit('setMode',{mode:e.target.value});
    document.querySelector('#pack').onchange=e=>socket.emit('setPack',{pack:e.target.value});
    const save=document.querySelector('#saveToHistory');if(save)save.onchange=e=>socket.emit('setSaveToHistory',{save:e.target.checked},r=>{if(r&&!r.ok)showToast(r.error)});
    const legacy=document.querySelector('#legacyHard');if(legacy)legacy.onclick=()=>socket.emit('setMode',{mode:'hard'});
    document.querySelectorAll('.priority-visibility').forEach(b=>b.onclick=()=>socket.emit('setPriorityVisibility',{visibility:b.dataset.visibility},r=>{if(r&&!r.ok)showToast(r.error)}));
  }
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
  if(state.managers.some(x=>x.hidden))return state.managers.map(x=>x.id===meId
    ? `<div class="card"><div class="budget"><h3>${esc(x.name)} (you)</h3><b>£${x.budget}m · ${x.squad.length}/11</b></div><div>${x.squad.map(p=>`<span class="pill">${esc(p.name)} · ${esc(p.positions.join('/'))} · £${p.price}m</span>`).join('')||'<span class="muted">No players yet</span>'}</div></div>`
    : `<div class="card blind-hidden"><h3>${esc(x.name)}</h3><p class="muted">Squad and budget hidden until the team reveal.</p></div>`).join('');
  return state.managers.map(x=>`<div class="card"><div class="budget"><h3>${esc(x.name)}</h3><b>£${x.budget}m · ${x.squad.length}/11</b></div><div>${x.squad.map(p=>`<span class="pill">${esc(p.name)} · ${state.mode==='hard'?esc(p.assignedPosition||'—'):esc(p.positions.join('/'))} · £${p.price}m</span>`).join('')||'<span class="muted">No players yet</span>'}</div></div>`).join('');
}

function priorityPositionCounterHtml(counts){
  if(!counts)return '';
  const labels={GK:'GK',CB:'CB',FB:'FB',MID:'MID',WING:'WING',ST:'ST'};
  return `<div class="priority-position-counter"><div class="muted small">ELIGIBLE PLAYERS REMAINING AFTER THIS ROUND</div><div class="priority-position-grid">${Object.entries(labels).map(([k,label])=>`<div><span>${label}</span><b>${counts[k]??0}</b></div>`).join('')}</div><div class="muted tiny">Players can count in more than one category through alternate positions.</div></div>`;
}
function priorityDraftPanel(m,c){
  if(!c)return '<div class="card">Loading next Priority Bid board…</div>';
  if(c.priorityStage==='result'){
    const rows=c.priorityAllocations||[];
    const hidden=c.priorityVisibility==='hidden';
    return `<div class="card priority-resolution"><div class="player-counter">ROUND ${c.priorityRound} OF 11</div><h2>${hidden?'Your result':'Round resolved'}</h2>${rows.length?rows.map(a=>`<div class="priority-result-row"><div><b>${esc(a.player?.name||'Player')}</b><div class="muted small">${esc(a.player?.positions?.join(' / ')||'')}</div></div><div class="right"><b>${hidden?'You':esc(a.managerName||'Manager')}</b><div>£${a.price}m</div></div></div>`).join(''):'<p class="muted">Other allocations remain hidden until the final team reveal.</p>'}<p class="muted small">Next board loading…</p></div>`;
  }
  if(c.priorityStage==='tiebreak'){
    const eligible=!!c.priorityTiebreakEligible,locked=!!c.myPriorityLocked,min=Number(c.priorityTieMin||1),max=Number(c.priorityMaxBid||min),bid=Number(c.myPriorityTieBid||min);
    if(!eligible)return `<div class="card"><div class="player-counter">ROUND ${c.priorityRound} OF 11 · TIEBREAK</div><div id="timer" class="timer ${Number(c.timeLeft)<=5?'warn':''}">${c.timeLeft}</div><h2>Tiebreak in progress</h2><p class="muted">The round will continue as soon as the tied managers settle it.</p>${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}</div>`;
    return `<div class="card priority-tiebreak"><div class="player-counter">ROUND ${c.priorityRound} OF 11 · TIEBREAK</div><div id="timer" class="timer ${Number(c.timeLeft)<=5?'warn':''}">${c.timeLeft}</div><h2>${esc(c.priorityTiePlayer?.name||'Tied player')}</h2><p class="muted">Your original £${min}m bid carries forward. Keep it or increase it; you cannot lower it.</p><div class="priority-tie-control"><button class="secondary priority-tie-step" data-step="-1" ${locked||state.paused?'disabled':''}>−</button><input id="priorityTieInput" inputmode="numeric" type="number" min="${min}" max="${max}" value="${bid}" ${locked||state.paused?'disabled':''}><span>m</span><button class="secondary priority-tie-step" data-step="1" ${locked||state.paused?'disabled':''}>+</button></div><button class="${locked?'secondary':'primary'} big" id="priorityLock" ${state.paused?'disabled':''}>${locked?'Unlock Decision':'Lock Decision'}</button>${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}</div>`;
  }
  const locked=!!c.myPriorityLocked,bids=c.myPriorityBids||{},max=Number(c.priorityMaxBid||1);
  const rows=(c.priorityBoard||[]).map(p=>{
    const bid=Number(bids[p.id]||1);
    return `<div class="priority-bid-row" data-priority-player="${p.id}"><div class="priority-player-info"><b>${esc(p.name)}</b><span>${esc(p.positions.join(' / '))}</span></div><div class="priority-bid-control"><button class="secondary priority-step" data-player="${p.id}" data-step="-1" ${locked||state.paused?'disabled':''}>−</button><div class="priority-bid-input-wrap"><span>£</span><input class="priority-bid-input" data-player="${p.id}" inputmode="numeric" type="number" min="1" max="${max}" value="${bid}" ${locked||state.paused?'disabled':''}><span>m</span></div><button class="secondary priority-step" data-player="${p.id}" data-step="1" ${locked||state.paused?'disabled':''}>+</button></div></div>`;
  }).join('');
  return `<div class="card priority-board"><div class="priority-board-head"><div><div class="player-counter">ROUND ${c.priorityRound} OF 11</div><h2>Bid on every player</h2><p class="muted no-margin">Bids above £1m must be unique. £1m can be repeated.</p></div><div id="timer" class="timer ${Number(c.timeLeft)<=5?'warn':''}">${c.timeLeft}</div></div>${priorityPositionCounterHtml(c.priorityRemainingPositions)}<div class="priority-bid-list">${rows}</div><div class="priority-sticky"><div><span class="muted small">BUDGET</span><b>£${m.budget}m</b><span class="muted small">MAX SAFE BID £${max}m</span></div><button class="${locked?'secondary':'primary'}" id="priorityLock" ${state.paused?'disabled':''}>${locked?'Unlock Decision':'Lock Decision'}</button></div>${state.paused?'<div class="required">Draft paused by commissioner.</div>':''}</div>`;
}
function priorityUsedAmounts(c,exceptPlayerId){
  const used=new Set();for(const [pid,v] of Object.entries(c.myPriorityBids||{})){if(Number(pid)!==Number(exceptPlayerId)&&Number(v)>1)used.add(Number(v));}return used;
}
function nextPriorityAmount(c,playerId,current,step){
  const used=priorityUsedAmounts(c,playerId),max=Number(c.priorityMaxBid||1);let next=Math.max(1,Math.min(max,Number(current)+Number(step)));
  if(step>0){while(next<=max&&next>1&&used.has(next))next++;if(next>max)return Number(current);}
  else{while(next>1&&used.has(next))next--;}
  return Math.max(1,Math.min(max,next));
}
function wirePriorityControls(){
  const c=state.current;if(!c||state.mode!=='priority')return;
  const lock=document.querySelector('#priorityLock');if(lock)lock.onclick=()=>socket.emit('setPriorityLock',{locked:!c.myPriorityLocked},r=>{if(r&&!r.ok)showToast(r.error)});
  if(c.priorityStage==='tiebreak'){
    const input=document.querySelector('#priorityTieInput');
    const submit=v=>socket.emit('setPriorityTieBid',{amount:Number(v)},r=>{if(!r?.ok){showToast(r?.error||'Could not set tiebreak bid');if(input)input.value=String(c.myPriorityTieBid||c.priorityTieMin||1);return;}c.myPriorityTieBid=Number(r.amount);if(input)input.value=String(r.amount)});
    document.querySelectorAll('.priority-tie-step').forEach(b=>b.onclick=()=>{const min=Number(c.priorityTieMin||1),max=Number(c.priorityMaxBid||min),cur=Number(input?.value||min);submit(Math.max(min,Math.min(max,cur+Number(b.dataset.step))))});
    if(input)input.onchange=()=>submit(input.value);
    return;
  }
  if(c.priorityStage!=='bidding')return;
  const submit=(playerId,amount,input)=>socket.emit('setPriorityBid',{playerId:Number(playerId),amount:Number(amount)},r=>{
    if(!r?.ok){showToast(r?.error||'Could not set bid');if(input)input.value=String(c.myPriorityBids?.[playerId]||1);return;}
    c.myPriorityBids[playerId]=Number(r.amount);if(input)input.value=String(r.amount);
  });
  document.querySelectorAll('.priority-step').forEach(b=>b.onclick=()=>{
    const playerId=b.dataset.player,input=document.querySelector(`.priority-bid-input[data-player="${playerId}"]`),cur=Number(c.myPriorityBids?.[playerId]||1);
    const next=nextPriorityAmount(c,playerId,cur,Number(b.dataset.step));if(next!==cur)submit(playerId,next,input);
  });
  document.querySelectorAll('.priority-bid-input').forEach(input=>input.onchange=()=>{
    const playerId=input.dataset.player,amount=Math.floor(Number(input.value));
    if(amount>1&&priorityUsedAmounts(c,playerId).has(amount)){showToast(`£${amount}m is already used`);input.value=String(c.myPriorityBids?.[playerId]||1);return;}
    submit(playerId,amount,input);
  });
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
    if(state.mode==='priority')panel.innerHTML=priorityDraftPanel(m,c);
    else if(state.mode==='blind')panel.innerHTML=blindDraftPanel(m,c);
    else if(state.mode==='nomination'&&!c)panel.innerHTML=nominationTurnPanel();
    else panel.innerHTML=openAuctionPanel(m,c);
  }else if(tab==='pool'&&state.mode==='nomination')panel.innerHTML=nominationPoolCard(null);
  else if(tab==='team')panel.innerHTML=state.mode==='hard'?`<div class="card"><h2>${m.formation} · £${m.budget}m left</h2><div class="squad">${hardSquadHtml(m)}</div></div>`:`<div class="card"><div class="budget"><h2>Your 11</h2><b>£${m.budget}m left</b></div>${freeformDraftSquadHtml(m)}</div>`;
  else if(tab==='managers')panel.innerHTML=managerTabHtml();
  if(state.mode==='priority'&&tab==='draft')wirePriorityControls();
  if(state.mode==='blind'&&tab==='draft')wireBlindControls();
  if(!['blind','priority'].includes(state.mode)&&tab==='draft'&&c)wireOpenAuction(c);
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


function ratingPanelHtml(r){
  if(!r)return '<div class="muted small">Pre-simulation team ratings unavailable for this saved team.</div>';
  return `<div class="ratings"><div class="overall-rating"><span>OVERALL</span><strong>${r.overall}</strong></div><div class="rating-grid"><div><span>Attack</span><b>${r.attack}</b></div><div><span>Midfield</span><b>${r.midfield}</b></div><div><span>Defence</span><b>${r.defence}</b></div><div><span>Positional Fit</span><b>${r.positionalFit}</b></div><div><span>Team Balance</span><b>${r.teamBalance}</b></div><div><span>Formation Fit</span><b>${r.formationSuitability}</b></div></div></div>`;
}
function ratingsHtml(m){return ratingPanelHtml(state.teamRatings?.[m.id]);}
function reviewManagerKey(m){return String(m.profileId||m.id||m.managerId||'')}
function reviewManagerName(m){return m.displayName||m.name||'Manager'}
function reviewFormation(m){return m.finalFormation||m.formation||'XI'}
function reviewTeamStats(m,playerStats){
  return (playerStats||[]).filter(p=>{
    if(m.profileId&&p.profileId)return p.profileId===m.profileId;
    const id=m.id||m.managerId;return id&&p.managerId===id;
  });
}
function reviewSlotPlayers(m){
  const formation=reviewFormation(m),layout=FF_LAYOUTS[formation];if(!layout)return [];
  if(Array.isArray(m.lineup)&&m.lineup.length===11)return layout.slots.map((slot,i)=>({slot,player:(m.squad||[]).find(p=>p.id===m.lineup[i])||null}));
  const remaining=[...(m.squad||[])];
  return layout.slots.map(slot=>{
    let idx=remaining.findIndex(p=>(p.assignedPosition||p.positions?.[0])===slot);
    if(idx<0)idx=remaining.findIndex(p=>p.positions?.includes(slot));
    const player=idx>=0?remaining.splice(idx,1)[0]:null;return {slot,player};
  });
}
function playerPotmCount(playerId,matches){return (matches||[]).filter(m=>m.playerOfMatch?.playerId===playerId).length}
function performancePitchHtml(m,playerStats){
  const formation=reviewFormation(m),layout=FF_LAYOUTS[formation];if(!layout)return '<div class="muted">No pitch layout is available for this formation.</div>';
  const byId=new Map(reviewTeamStats(m,playerStats).map(x=>[x.playerId,x]));
  const slotPlayers=reviewSlotPlayers(m);
  return `<div class="pitch performance-pitch">${layout.rows.map(row=>`<div class="pitch-row cols-${row.length}">${row.map(idx=>{
    const entry=slotPlayers[idx],p=entry?.player,st=p?byId.get(p.id):null;
    const output=entry?.slot==='GK'?`${st?.saves||0} saves · ${st?.cleanSheets||0} CS`:`${st?.goals||0}G · ${st?.assists||0}A`;
    return `<div class="pitch-slot performance-slot"><span class="slot-label">${esc(entry?.slot||layout.slots[idx])}</span><span class="slot-name">${p?esc(p.name):'—'}</span>${p&&st?`<span class="performance-output">${output}</span><span class="performance-rating">${Number(st.avgRating||0).toFixed(2)} avg</span>`:''}</div>`;
  }).join('')}</div>`).join('')}</div>`;
}
function teamPerformanceTableHtml(m,playerStats,matches){
  const rows=reviewTeamStats(m,playerStats);if(!rows.length)return '<p class="muted small">No individual player stats are available.</p>';
  const ordered=reviewSlotPlayers(m).map(x=>rows.find(r=>r.playerId===x.player?.id)).filter(Boolean);
  const rest=rows.filter(r=>!ordered.includes(r));
  return `<div class="table-wrap"><table class="player-stats-table full-team-stats"><thead><tr><th>Player</th><th>Pos</th><th>Apps</th><th>G</th><th>A</th><th>Saves</th><th>CS</th><th>POTM</th><th>Avg</th></tr></thead><tbody>${[...ordered,...rest].map(p=>`<tr><td><b>${esc(p.player)}</b></td><td>${esc(p.deployedSlot||'—')}</td><td>${p.apps??0}</td><td>${p.goals??0}</td><td>${p.assists??0}</td><td>${p.saves??0}</td><td>${p.cleanSheets??0}</td><td>${playerPotmCount(p.playerId,matches)}</td><td><b>${Number(p.avgRating||0).toFixed(2)}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function teamReviewHtml(managers,playerStats,selectedId,historical=false,matches=[]){
  if(!managers?.length)return '<div class="card muted">No saved teams available.</div>';
  const chosen=managers.find(m=>reviewManagerKey(m)===String(selectedId||''))||managers[0];
  const rating=historical?chosen.teamRating:state.teamRatings?.[chosen.id];
  return `<div class="team-review-switch">${managers.map(m=>`<button class="result-tab ${reviewManagerKey(m)===reviewManagerKey(chosen)?'active':''}" data-team-review="${esc(reviewManagerKey(m))}">${esc(reviewManagerName(m))}</button>`).join('')}</div><div class="card team-performance-card"><div class="budget"><div><h2>${esc(reviewManagerName(chosen))}</h2><div class="muted">${esc(reviewFormation(chosen))}</div></div><b>£${chosen.budget??'—'}m left</b></div>${ratingPanelHtml(rating)}<div class="spacer14"></div>${performancePitchHtml(chosen,playerStats)}<div class="spacer14"></div><h3>Full XI performance</h3>${teamPerformanceTableHtml(chosen,playerStats,matches)}</div>`;
}
function historicalLeaderboardHtml(stats,metric){
  const labels={goals:'Goals',assists:'Assists',saves:'Saves',rating:'Avg rating'};
  let rows=[...(stats||[])];
  if(metric==='goals')rows.sort((a,b)=>b.goals-a.goals||b.assists-a.assists||b.avgRating-a.avgRating||a.player.localeCompare(b.player));
  else if(metric==='assists')rows.sort((a,b)=>b.assists-a.assists||b.goals-a.goals||b.avgRating-a.avgRating||a.player.localeCompare(b.player));
  else if(metric==='saves')rows=rows.filter(p=>p.deployedSlot==='GK').sort((a,b)=>b.saves-a.saves||b.avgRating-a.avgRating||a.player.localeCompare(b.player));
  else rows.sort((a,b)=>b.avgRating-a.avgRating||(b.goals+b.assists)-(a.goals+a.assists)||a.player.localeCompare(b.player));
  rows=rows.slice(0,10);const value=p=>metric==='rating'?Number(p.avgRating||0).toFixed(2):(p[metric]??0);
  return `<div class="stat-switch">${Object.entries(labels).map(([key,label])=>`<button class="stat-chip ${historicalStatsMetric===key?'active':''}" data-historical-stat="${key}">${label}</button>`).join('')}</div><div class="table-wrap"><table class="player-stats-table"><thead><tr><th>#</th><th>Player</th><th>Manager</th><th>Pos</th><th>${labels[metric]}</th></tr></thead><tbody>${rows.map((p,i)=>`<tr><td>${i+1}</td><td><b>${esc(p.player)}</b></td><td>${esc(p.managerName||'—')}</td><td>${esc(p.deployedSlot||'—')}</td><td><b>${value(p)}</b></td></tr>`).join('')}</tbody></table></div>`;
}
function revealedTeamHtml(m){
  if(isFreeformLike()){
    return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.finalFormation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}${pitchHtml(m,false)}</div>`;
  }
  return `<div class="card team-reveal"><div class="budget"><div><h2>${esc(m.name)}</h2><div class="muted">${esc(m.formation||'XI')}</div></div><b>£${m.budget}m left</b></div>${ratingsHtml(m)}<div class="squad">${hardSquadHtml(m)}</div></div>`;
}

function draftHistoryHtml(){
  if(!state.draftHistory?.length)return '';
  if(state.mode==='priority')return priorityBidHistoryHtml(state.draftHistory.filter(r=>r.type==='priorityRound'),'Priority Bid reveal');
  if(state.mode==='blind')return simpleDraftHistoryHtml(state.draftHistory,'Blind auction reveal');
  return '';
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
  const title=state.historySaveStatus==='saved'?'✓ Saved to All-Time Records':state.historySaveStatus==='saving'?'Saving to All-Time Records…':state.historySaveStatus==='practice'?'Practice game · not saved':'Permanent history notice';
  return `<div class="card ${cls}"><b>${title}</b><div class="muted small">${esc(state.historySaveMessage||'')}</div></div>`;
}
function fullResults(){
  const host=state.hostId===meId,sim=state.simulation;
  const champion=state.managers.find(m=>m.id===sim.championId);
  const exhibition=state.simulationKind==='exhibition';
  if(!reviewManagerId||!state.managers.some(m=>m.id===reviewManagerId))reviewManagerId=state.managers.some(m=>m.id===meId)?meId:state.managers[0]?.id;
  const viewToggle=`<div class="post-view-toggle"><button class="result-tab ${postSimView==='results'?'active':''}" data-post-view="results">Results</button><button class="result-tab ${postSimView==='teams'?'active':''}" data-post-view="teams">Teams</button></div>`;
  const playoffs=(sim.playoffs||[]).length?`<div class="card"><h2>Title tiebreak</h2><p class="muted small">The league tiebreakers could not separate the leaders, so the title was decided on the pitch.</p>${sim.playoffs.map(m=>matchHtml(m,'Tiebreak playoff')).join('')}</div>`:'';
  let body='';
  if(postSimView==='teams'){
    body=teamReviewHtml(state.managers,sim.playerStats||[],reviewManagerId,false,sim.matches||[]);
  }else{
    if(resultsTab==='season') body=`<div class="card"><h2>Final table</h2>${standingsHtml(sim.table)}</div>${playoffs}<div class="card"><h2>Match results</h2><div class="matches">${(sim.matches||[]).map((m,i)=>matchHtml(m,`Match ${i+1} of ${sim.matches.length}`)).join('')}</div></div><div class="card"><h2>Team ratings</h2><p class="muted small">The team ratings that drove the simulation. Individual hidden player ratings remain secret.</p>${state.managers.map(m=>`<div class="rating-summary"><div><b>${esc(m.name)}</b><span>${isFreeformLike()?esc(m.finalFormation||'XI'):esc(m.formation||'XI')}</span></div><strong>${state.teamRatings?.[m.id]?.overall??'—'}</strong></div>`).join('')}</div>${['blind','priority'].includes(state.mode)?draftHistoryHtml():''}`;
    else if(resultsTab==='players') body=`<div class="card"><h2>League player stats</h2><p class="muted">Top 10 performers across every manager's XI.</p>${leaderboardHtml(statsMetric)}</div>`;
    else if(resultsTab==='tots') body=`<div class="card"><div class="budget"><div><h2>Team of the Season</h2><p class="muted no-margin">Best-performing valid XI by average match rating, using the positions players were actually deployed in with sensible neighbouring roles.</p></div><b>${esc(sim.teamOfSeason?.formation||'XI')}</b></div><div class="spacer14"></div>${totsPitchHtml(sim.teamOfSeason)}</div>`;
    else body=sessionHtml();
    body=`${resultNav()}${body}`;
  }
  const simNote=exhibition?`<div class="card exhibition-banner"><b>Exhibition re-simulation #${state.exhibitionNumber||1}</b><div>This result is just for fun and does not change titles, head-to-heads or session history.</div></div>`:'';
  const controls=host?`<div class="post-sim-controls"><button class="secondary big" id="resimulate">${exhibition?'Re-simulate again':'Re-simulate season'}</button>${exhibition?'<button class="secondary big" id="officialResult">View official result</button>':''}<button class="primary big" id="again">Play again</button></div>`:'<div class="card muted">Waiting for the host to choose what happens next.</div>';
  shell(`${simNote}<div class="card champion"><div class="muted">${exhibition?'EXHIBITION WINNER':'SEASON CHAMPION'}</div><h1>🏆 ${esc(champion?.name||'Winner')}</h1><p class="muted">${esc(packName())} · ${esc(modeName())}</p></div>${!exhibition?permanentHistoryStatusHtml():''}${viewToggle}${body}<button class="secondary big" id="viewRecords">View All-Time Records</button><div class="spacer10"></div>${controls}`);
  if(postSimView==='results'){wireResultTabs();wireStatSwitch();}
  document.querySelectorAll('[data-post-view]').forEach(b=>b.onclick=()=>{postSimView=b.dataset.postView;fullResults();});
  document.querySelectorAll('[data-team-review]').forEach(b=>b.onclick=()=>{reviewManagerId=b.dataset.teamReview;fullResults();});
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
    if(s.phase==='results'){resultsTab='season';statsMetric='goals';postSimView='results';reviewManagerId=meId||null;}
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
socket.on('connect',()=>{attemptResume();refreshRecordsStatus();});
applyVisualTheme();
home();
