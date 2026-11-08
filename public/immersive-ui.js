/* Approved Prem Draft Phase 1 / Phase 2 templates, integrated for Immersive mode only. */
const PHASE12_HOME_TEMPLATE = `<div class="phased-ui phased-home"><div class="site" id="site">
<div aria-hidden="true" class="stadium-wash"></div>
<header class="app-header">
<div aria-label="Prem Draft" class="brand"><span class="crest"><svg fill="none" viewbox="0 0 32 32"><path d="M3 16h26M16 2v28M8 2v28M24 2v28M3 8h26M3 24h26" opacity=".6" stroke="#162419" stroke-width="1.25"></path><circle cx="16" cy="16" r="6" stroke="#162419" stroke-width="2"></circle></svg></span><div><div class="brand-title">PREM<em>DRAFT</em></div><div class="brand-sub">THE FOOTBALL AUCTION GAME</div></div></div>
<div class="header-right"><button aria-label="Switch to Regular mode" class="phased-mode-toggle" id="themeToggle" type="button">◐ Immersive · Switch to Regular</button><span class="header-label">Your game starts here</span><button aria-label="Open manager profile" class="header-profile" id="topProfile" type="button"><span class="profile-mark"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2c0-3.5 3-5.5 8-5.5s8 2 8 5.5v2"></path></svg></span><span id="topProfileName">Manager profile</span><svg class="icon mini" viewbox="0 0 24 24"><path d="m8 10 4 4 4-4"></path></svg></button></div>
</header>
<main class="site-inner">
<section aria-labelledby="heroTitle" class="intro">
<div><h1 id="heroTitle">Build your XI.<br/><span>Beat your mates.</span></h1></div>
<div class="game-rules" aria-label="Game essentials"><span>£100m budget</span><i aria-hidden="true">·</i><span>11 players</span><i aria-hidden="true">·</i><span>1 winner</span></div>
</section>
<div class="invite-banner" hidden="" id="inviteBanner"><svg class="icon mini" viewbox="0 0 24 24"><path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Zm8 0v16"></path></svg><span>You've been invited to room <b class="invite-code" id="inviteCode">KQ7R2N</b>. Select <b>Join game</b> to continue.</span></div>
<div class="dashboard">
<section aria-labelledby="menuTitle" class="menu-area"><div class="section-label" id="menuTitle"><span class="index">01</span> CHOOSE YOUR NEXT MOVE</div>
<div class="action-grid">
<button aria-label="Create a new game" class="action-card" id="createTile" type="button"><span aria-hidden="true" class="field-watermark"></span><span class="card-top"><span class="card-icon"><svg class="icon big" viewbox="0 0 24 24"><rect height="18" rx="5" width="18" x="3" y="3"></rect><path d="M12 7v10M7 12h10"></path></svg></span><span class="card-meta">HOST A ROOM</span></span><h2>Create game</h2><p></p><span class="action-bottom"><span class="action-verb">NEW GAME <svg class="icon mini" viewbox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"></path></svg></span><span class="arrow-circle"><svg class="icon" viewbox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"></path></svg></span></span></button>
<button aria-label="Join an existing game" class="action-card join-card" id="joinTile" type="button"><span aria-hidden="true" class="field-watermark"></span><span class="card-top"><span class="card-icon"><svg class="icon big" viewbox="0 0 24 24"><path d="M16 20v-2c0-2.2-2-4-4.5-4h-5C4 14 2 15.8 2 18v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M21 20v-2c0-2.1-1.2-3.5-3.2-4M16.5 3.3a4 4 0 0 1 0 7.4"></path></svg></span><span class="card-meta">ENTER A ROOM</span></span><h2>Join game</h2><p></p><span class="action-bottom"><span class="action-verb">JOIN ROOM <svg class="icon mini" viewbox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"></path></svg></span><span class="arrow-circle"><svg class="icon" viewbox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"></path></svg></span></span></button>
</div>
<p class="journey-caption"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v5m0-9h.01"></path></svg> Game mode and player pack are chosen inside the lobby.</p>
<button class="records-tile" id="recordsTile" type="button"><span class="trophy-plate"><svg class="icon big" viewbox="0 0 24 24"><path d="M6 4h12v6a6 6 0 0 1-12 0V4ZM6 6H3v3a4 4 0 0 0 4 4M18 6h3v3a4 4 0 0 1-4 4M12 16v4M8 21h8"></path></svg></span><span><h3>All-Time Records</h3><p></p></span><svg class="icon records-arrow" viewbox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"></path></svg></button>
</section>
<aside aria-label="Manager profile and getting started" class="sidebar">
<section aria-label="Permanent manager profile" class="profile-card"><div class="side-eyebrow">YOUR MANAGER IDENTITY</div><div class="manager-id"><span class="manager-avatar guest" id="managerAvatar"><svg class="icon" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2c0-3.5 3-5.5 8-5.5s8 2 8 5.5v2"></path></svg></span><div><b id="managerName">No profile yet</b><span id="managerTag">First-time visitor</span></div></div><p class="profile-desc" id="managerDescription">Your permanent manager profile is created when you enter your first room, so your Records follow you across games.</p><button class="side-button" id="profileAction" type="button"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="8" cy="15" r="5"></circle><path d="m12 11 9-9m-4 0h4v4m-7 0 4 4"></path></svg><span id="profileActionText">Recover existing profile</span></button><button class="subbutton" hidden="" id="profileSecondary" type="button"><svg class="icon mini" viewbox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>Show recovery code</button><div class="manager-code" hidden="" id="managerCode"><span id="codeValue">ALEX-482</span><button id="hideCode" type="button">Hide</button></div><div class="profile-foot"><span class="status-led"></span> <span id="profileFooterText">Permanent Records supported</span></div></section>
<section class="resume-card" hidden="" id="resumeCard"><div class="resume-top"><span>CONTINUE PLAYING</span><svg class="icon mini" viewbox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-7m-3-2v6h6"></path></svg></div><h3>Room QN8T4L</h3><p>Your previous room may still be active.</p><button id="resumeButton" type="button">Resume previous room <svg class="icon mini" viewbox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"></path></svg></button></section>
<details class="how-card" id="howCard"><summary>How to play <span>⌄</span></summary><div class="steps"><div class="step"><span class="step-number">01</span><div><b>Win your players</b><span>Compete in the auction.</span></div></div><div class="step"><span class="step-number">02</span><div><b>Build your best XI</b><span>Choose your formation and roles.</span></div></div><div class="step"><span class="step-number">03</span><div><b>Settle it on the pitch</b><span>Simulate a season against your mates.</span></div></div></div></details>
</aside>
</div>
</main>
<footer class="footer"><span><strong>PREM DRAFT</strong> / Phase 1 · Pre-Lobby</span><span class="small-print">Classic and Immersive · same game rules</span></footer>
<div class="overlay" hidden="" id="phase12Overlay"><div aria-labelledby="dialogTitle" aria-modal="true" class="dialog" role="dialog"><div class="dialog-head"><div><div class="dialog-kicker" id="phase12DialogKicker">SET UP YOUR ROOM</div><h2 id="phase12DialogTitle">Create game</h2></div><button aria-label="Close" class="close" id="phase12DialogClose" type="button">×</button></div><div class="dialog-body" id="phase12DialogBody"></div></div></div>

</div></div>`;
const PHASE12_LOBBY_TEMPLATE = `<div class="phased-ui phased-lobby"><div class="site" id="site"><div aria-hidden="true" class="stadium-wash"></div>
<header class="app-header">
<div aria-label="Prem Draft" class="brand"><span class="crest"><svg fill="none" viewbox="0 0 32 32"><path d="M3 16h26M16 2v28M8 2v28M24 2v28M3 8h26M3 24h26" opacity=".6" stroke="#162419" stroke-width="1.25"></path><circle cx="16" cy="16" r="6" stroke="#162419" stroke-width="2"></circle></svg></span><div><div class="brand-title">PREM <em>DRAFT</em></div><div class="brand-sub">THE FOOTBALL AUCTION GAME</div></div></div>
<div class="header-right"><button aria-label="Switch to Regular mode" class="phased-mode-toggle" id="themeToggle" type="button">◐ Immersive · Switch to Regular</button><span class="header-label">YOUR DRAFT ROOM</span><button class="header-profile" id="identityButton" type="button"><span class="profile-mark"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2c0-3.5 3-5.5 8-5.5s8 2 8 5.5v2"></path></svg></span><span id="identityText">Alex Morgan</span></button></div>
</header>
<main class="lobby-content">
<section class="lobby-intro"><div class="lobby-title"><h1>Draft <span>lobby.</span></h1></div><div class="lobby-top-meta"><span class="phase-chip"><span class="live-dot"></span> LOBBY OPEN</span></div></section>
<section aria-label="Room invitation" class="room-banner"><div class="room-code-box"><span class="room-code-icon"><svg class="icon big" viewbox="0 0 24 24"><path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Zm8 0v16"></path></svg></span><div class="room-code-info"><div class="micro-label">ROOM CODE</div><strong id="codeDisplay">K7XP2M</strong><p></p></div></div><div class="room-actions"><button class="small-cta" id="copyCode" aria-label="Copy room code" title="Copy room code"><svg class="icon mini" viewbox="0 0 24 24"><rect height="13" rx="2" width="13" x="8" y="8"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg> Copy code</button><button class="small-cta" id="copyLink" aria-label="Copy invitation link" title="Copy invitation link"><svg class="icon mini" viewbox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 .3l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.3l-3 3a5 5 0 0 0 7 7l2-2"></path></svg> Invite link</button></div></section>
<div class="notice-strip" hidden="" id="readyResetNotice"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v5m0-9h.01"></path></svg><span id="noticeText">Settings changed. Everyone needs to ready up again.</span></div>
<div class="lobby-grid" id="lobbyGrid">
<div class="lobby-main">
<section aria-label="Managers in lobby" class="lobby-panel roster-card"><div class="panel-header"><div class="section-id"><span class="section-num">01</span> MANAGERS IN THE ROOM</div><span class="section-caption">LIVE ROOM STATUS</span></div>
<h2 class="manager-title" id="managerCount">2 of 3 ready</h2><p class="manager-subtitle" id="managerSummary">One manager still needs to ready up.</p><div class="roster-meter" id="rosterMeter"></div><div class="manager-list" id="managerList"></div><div class="roster-bottom"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v5m0-9h.01"></path></svg><span id="rosterBottom">At least two managers are needed to start.</span></div>
</section>
<section aria-label="Your readiness" class="lobby-panel your-zone"><div class="panel-header"><div class="section-id"><span class="section-num">02</span> YOUR STATUS</div><span class="section-caption" id="viewRoleCaption">HOST VIEW</span></div>
<div class="zone-top"><span class="zone-icon"><svg class="icon big" id="zoneIcon" viewbox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"></path></svg></span><div><div class="zone-title" id="zoneTitle">Are you ready to draft?</div><div class="zone-summary" id="zoneSummary">You're marked as ready.</div></div></div>
<div id="hardFormationSlot"></div><button class="ready-btn" id="readyButton"><svg class="icon" viewbox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"></path></svg><span>Mark yourself ready</span></button><div class="ready-note"><svg class="icon mini" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v5m0-9h.01"></path></svg><span id="readyNote">You can change your status until the host starts the auction.</span></div>
</section>
</div>
<aside aria-label="Game setup and launch" class="lobby-side">
<section class="lobby-panel" id="setupPanel"><details id="setupDisclosure" class="setup-disclosure"><summary><span id="setupHeading">Game settings</span><span id="setupCaption" class="setup-role">Host controls</span><span class="setup-chevron" aria-hidden="true">⌄</span></summary><div id="setupContent"></div></details></section>
<section aria-live="polite" class="launch-card" id="launchArea"></section>
</aside>
</div>
<div class="foot-links"><div class="foot-note"></div><div class="foot-actions"><button class="text-link" id="recordsButton">All-Time Records ↗</button><button class="text-link" id="leaveButton">← Back to home</button></div></div>
</main>
<footer class="footer phase-footer"><span><strong>PREM DRAFT</strong> / Phase 2 · Lobby</span><span class="small-print">Classic and Immersive · same game rules</span></footer>
</div></div>`;
const PHASE12_ICONS = `<svg aria-hidden="true" height="0" style="position:absolute;overflow:hidden" width="0" xmlns="http://www.w3.org/2000/svg"><defs>
<symbol id="i-user" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2c0-3.5 3-5.5 8-5.5s8 2 8 5.5v2"></path></symbol>
<symbol id="i-chevron" viewbox="0 0 24 24"><path d="m8 10 4 4 4-4"></path></symbol>
<symbol id="i-plus" viewbox="0 0 24 24"><rect height="18" rx="5" width="18" x="3" y="3"></rect><path d="M12 7v10M7 12h10"></path></symbol>
<symbol id="i-users" viewbox="0 0 24 24"><path d="M16 20v-2c0-2.2-2-4-4.5-4h-5C4 14 2 15.8 2 18v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M21 20v-2c0-2.1-1.2-3.5-3.2-4M16.5 3.3a4 4 0 0 1 0 7.4"></path></symbol>
<symbol id="i-arrow" viewbox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"></path></symbol>
<symbol id="i-arrup" viewbox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"></path></symbol>
<symbol id="i-trophy" viewbox="0 0 24 24"><path d="M6 4h12v6a6 6 0 0 1-12 0V4ZM6 6H3v3a4 4 0 0 0 4 4M18 6h3v3a4 4 0 0 1-4 4M12 16v4M8 21h8"></path></symbol>
<symbol id="i-info" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v5m0-9h.01"></path></symbol>
<symbol id="i-key" viewbox="0 0 24 24"><circle cx="8" cy="15" r="5"></circle><path d="m12 11 9-9m-4 0h4v4m-7 0 4 4"></path></symbol>
<symbol id="i-eye" viewbox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></symbol>
<symbol id="i-rotate" viewbox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-7m-3-2v6h6"></path></symbol>
<symbol id="i-ticket" viewbox="0 0 24 24"><path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Zm8 0v16"></path></symbol>
</defs></svg>`;
