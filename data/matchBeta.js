'use strict';
// Project MATCH mathematical V7 foundation — experimental; V4 styles + V6 roles unchanged.
// A standalone player-driven match generator. Never imports manager/session history.
const {playerOfMatch}=require('./allTimePremSimulation');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const avg=a=>a.length?a.reduce((t,v)=>t+v,0)/a.length:0;
const STYLE={
  balanced:   {label:'Balanced',chanceCount:1.00,chanceQuality:1.00,exposure:1.00},
  possession: {label:'Possession & Control',chanceCount:1.12,chanceQuality:1/1.12,exposure:1.00},
  direct:     {label:'Direct & Counterattack',chanceCount:0.84,chanceQuality:1/0.84,exposure:1.00},
  press:      {label:'High Press',chanceCount:1.25,chanceQuality:1/1.25,exposure:1.00}
};
const SHOOTER={ST:5.3,LW:3.6,RW:3.6,AM:2.3,LM:1.2,RM:1.2,CM:.55,DM:.2,LB:.11,RB:.11,CB:.09};
const CREATOR={ST:.8,LW:2.2,RW:2.2,AM:3,LM:2.1,RM:2.1,CM:1.9,DM:.85,LB:.75,RB:.75,CB:.18};
const DEFENDER=new Set(['CB','LB','RB','DM','CM']);
const seedRandom=seed=>{
  let s=seed>>>0;return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
};
const trait=(d,key)=>Number(d.profile.traits[key])||0;
const qualityFit=d=>d.value; // already includes positional fit from the lineup assessment
const roleScore=(d,role,style='balanced')=>{
  const q=qualityFit(d), p=trait(d,'protection'),g=trait(d,'goalThreat'),c=trait(d,'creativity'),r=trait(d,'progression'),w=trait(d,'width'),dir=trait(d,'directness');
  let score;
  if(role==='scorer'){
    score=style==='direct'?(.46*q+.39*g+.15*dir):style==='press'?(.50*q+.43*g+.07*dir):style==='possession'?(.54*q+.42*g+.04*c):(.56*q+.44*g);
  }else if(role==='creator'){
    score=style==='possession'?(.29*q+.49*c+.17*r+.05*w):style==='direct'?(.40*q+.35*c+.11*r+.10*dir+.04*w):style==='press'?(.40*q+.37*c+.17*r+.04*dir+.02*p):(.33*q+.49*c+.13*r+.05*w);
  }else if(role==='anchor'){
    score=style==='possession'?(.49*q+.41*p+.10*r):style==='press'?(.43*q+.48*p+.09*r):style==='direct'?(.48*q+.47*p+.05*dir):(.52*q+.48*p);
  }else throw Error('Unknown role');
  if(role==='creator'&&style==='direct') score=80+1.35*(score-80);
  if(role==='creator'&&style==='press') score=80+1.18*(score-80);
  return clamp(score,0,100); // no second positional-fit penalty
};
const eligible=(d,role)=>d.slot!=='GK'&&['creator','scorer','anchor'].includes(role);
function weightedAvg(details,positions,key){return avg(details.filter(d=>positions.includes(d.slot)).map(d=>trait(d,key)));}
function styleSuitability(assessment,style){
  if(!STYLE[style])throw Error('Unknown style');
  if(style==='balanced')return 80; // Balanced is the safe neutral baseline, not a hidden power multiplier.
  const d=assessment.details,mid=['DM','CM','AM','LM','RM'],back=['CB','LB','RB'],fw=['ST','LW','RW'];
  const gk=d.find(x=>x.slot==='GK');const keeperDistribution=gk?.profile?.goalkeeper?.distribution||20;
  let score;
  if(style==='possession') {
    // Two midfield creators can sustain attacks around a defensive midfielder.
    const creators=d.filter(x=>mid.includes(x.slot)).map(x=>trait(x,'creativity')).sort((a,b)=>b-a);
    score=.21*weightedAvg(d,mid,'progression')+.32*avg(creators.slice(0,2))+.15*weightedAvg(d,back,'progression')+.12*keeperDistribution+.20*assessment.teamLinks.buildup.score;
  }
  else if(style==='direct') {
    // Counters require an outlet from defence, not only forward pace/goal threat.
    score=.31*weightedAvg(d,fw,'directness')+.18*weightedAvg(d,fw,'goalThreat')+.17*assessment.width+.14*weightedAvg(d,mid,'progression')+.10*weightedAvg(d,back,'progression')+.10*weightedAvg(d,back,'protection');
  }
  else {
    // A pressing midfield needs two competent ball winners, not universal defensive specialists.
    // Allow a creative AM or wide midfielder to coexist with strong ball-winning partners.
    const midProtect=d.filter(x=>mid.includes(x.slot)).map(x=>trait(x,'protection')).sort((a,b)=>b-a);
    const ballWinners=avg(midProtect.slice(0,2));
    // Quick transitions depend on the midfield progressing possession after a recovery;
    // requiring high Progression from every CB/fullback/forward overconstrains the style.
    score=.26*ballWinners+.20*weightedAvg(d,back,'protection')+.26*weightedAvg(d,fw,'directness')+.18*assessment.teamLinks.shielding.score+.10*weightedAvg(d,mid,'progression');
  }
  return clamp(score,45,99);
}
function optionsFor(assessment,style){
  if(!STYLE[style])throw Error('Unknown style');
  return Object.fromEntries(['creator','scorer','anchor'].map(role=>[role,assessment.details.filter(d=>eligible(d,role)).map(d=>({id:d.player.id,name:d.player.name,slot:d.slot,score:Math.round(roleScore(d,role,style)*10)/10}))]));
}
// v16.1: Validate a manager's three EXPLICIT selections before locking a team.
// Internal mathematical previews may still construct hypothetical trios using prepare(),
// but no missing role can be silently assigned to a ready manager.
function validateManualSelections(assessment,selection={}){
  const style=selection.style||'balanced';
  const options=optionsFor(assessment,style),used=new Set();
  for(const role of ['creator','scorer','anchor']){
    const id=selection[role];
    if(id===undefined||id===null||id==='')
      throw Error('Choose a Primary Creator, Primary Scorer and Defensive Anchor before setting your team.');
    const player=options[role].find(item=>String(item.id)===String(id));
    if(!player)throw Error('Your selected '+role+' must be a player in your current outfield XI.');
    if(used.has(String(player.id)))
      throw Error('Choose three different players for the three responsibilities.');
    used.add(String(player.id));
  }
  return true;
}
function prepare(assessment,selection={}){
  const style=selection.style||'balanced',spec=STYLE[style];if(!spec)throw Error('Unknown style');
  const options=optionsFor(assessment,style),chosen=new Set();
  const picks={};
  // Explicit selections remain authoritative, invalid/duplicate entries are rejected.
  for(const role of ['creator','scorer','anchor']){
    const raw=selection[role];
    if(raw!==undefined&&raw!==null&&raw!==''){
      const selected=options[role].find(d=>String(d.id)===String(raw));
      if(!selected)throw Error('Selected '+role+' is not eligible for its deployed position');
      if(chosen.has(selected.id))throw Error('The three responsibilities require different players');
      picks[role]=assessment.details.find(d=>d.player.id===selected.id);chosen.add(selected.id);
    }
  }
  for(const role of ['creator','scorer','anchor'])if(!picks[role]){
    const best=[...options[role]].filter(p=>!chosen.has(p.id)).sort((a,b)=>b.score-a.score||a.id-b.id)[0];
    if(!best)throw Error('Unable to allocate '+role);
    picks[role]=assessment.details.find(d=>d.player.id===best.id);chosen.add(best.id);
  }
  const styleFit=styleSuitability(assessment,style);
  // At synthetic neutral fit 80, styles have identical pre-match xG to Balanced.
  // Different chance volumes and average quality remain as footballing character.
  // Poorly fitting Press and Direct can still expose the defence via the fit penalty.
  const styleMultiplier=style==='balanced'?1:Math.exp(.007*(styleFit-80));
  const ids={creator:picks.creator.player.id,scorer:picks.scorer.player.id,anchor:picks.anchor.player.id};
  const outfield=assessment.details.filter(d=>d.slot!=='GK');
  // One smooth, absolute-reference function shared by all three roles.
  // Scores of 80 are neutral; elite role scores help regardless of teammates.
  const roleLog=(role)=>0.065*Math.tanh((roleScore(picks[role],role,style)-80)/14);
  const attackRoleLog=roleLog('creator')+roleLog('scorer');
  const anchorLog=roleLog('anchor');
  const styleLog=style==='balanced'?0:.007*(styleFit-80);
  const anchorFactor=Math.exp(-anchorLog);
  const result={
    assessment,style,styleLabel:spec.label,styleFit,selection:{style,...ids},picks,
    roleSuitability:Object.fromEntries(Object.keys(ids).map(k=>[k,Math.round(roleScore(picks[k],k,style)*10)/10])),
    chanceCount:spec.chanceCount*Math.pow(styleMultiplier,.58),
    chanceQuality:spec.chanceQuality*Math.pow(styleMultiplier,.42)*Math.exp(attackRoleLog),
    exposure:spec.exposure*Math.pow(styleMultiplier,-.35)*anchorFactor,
    averageScorer:weightedMean(outfield,d=>shootWeight(d),d=>roleScore(d,'scorer',style)),
    averageCreator:weightedMean(outfield,d=>createWeight(d),d=>roleScore(d,'creator',style)),
    roleLogEffects:{creator:roleLog('creator'),scorer:roleLog('scorer'),anchor:anchorLog},
    shotNormalizer:null
  };
  result.shotNormalizer=calculateShotNormalizer(result);
  return result;
}
function weightedMean(d,weight,val){const sum=d.reduce((s,x)=>s+weight(x),0);return sum?d.reduce((s,x)=>s+weight(x)*val(x),0)/sum:0;}
const shootWeight=d=>(SHOOTER[d.slot]||.02)*Math.pow(Math.max(.1,trait(d,'goalThreat')/80),.7);
const createWeight=d=>(CREATOR[d.slot]||.02)*Math.pow(Math.max(.1,trait(d,'creativity')/80),.7);
function baseXG(a,b,home){
  // V7: Overall alone determines pre-tactical competitive strength.
  // Attack-vs-Defence specialisation changes MATCH OPENNESS for both teams,
  // not the ratio of their expected goals. Midfield already contributes to Overall.
  const strength=a.overall-b.overall;
  const openness=.007*((a.attack-a.defence)+(b.attack-b.defence));
  const log=Math.log(1.28)+.075*strength+openness+(home?.18:0);
  const gk=b.details.find(d=>d.slot==='GK');
  return clamp(Math.exp(log)*(gk?.player.positions?.[0]!=='GK'?1.20:1),.10,5.5);
}
function factors(own,opp,home){
  const xg=baseXG(own.assessment,opp.assessment,home);
  const count=10*Math.pow(xg/1.28,.42)*own.chanceCount*opp.exposure;
  const p=clamp(xg/(10*Math.pow(xg/1.28,.42))*own.chanceQuality,.007,.65);
  return {expectedChances:count,baseProbability:p,baseXG:xg};
}
function weightedPick(items,weight,rng){const w=items.map(x=>Math.max(.00001,weight(x))),total=w.reduce((a,b)=>a+b,0);let z=rng()*total;for(let i=0;i<items.length;i++)if((z-=w[i])<=0)return items[i];return items.at(-1);}
function poisson(lambda,rng){let n=0,p=1,L=Math.exp(-lambda);do{n++;p*=rng();}while(p>L&&n<130);return n-1;}
function pickPlayers(team,rng){
  const all=team.assessment.details.filter(d=>d.slot!=='GK');
  const shooter=weightedPick(all,d=>shootWeight(d)*(d.player.id===team.selection.scorer?1.85:1),rng);
  const available=all.filter(d=>d.player.id!==shooter.player.id);
  const creator=rng()<.78?weightedPick(available,d=>createWeight(d)*(d.player.id===team.selection.creator?1.85:1),rng):null;
  return {shooter,creator};
}
// Player-specific involvement changes *who* shoots/creates and the quality
// of their individual chances. Analytic normalization prevents this allocation
// layer from secretly adding/removing extra team xG after direct role effects.
function shotRawMultiplier(team,shooter,creator){
  const a=roleScore(shooter,'scorer',team.style)-team.averageScorer;
  const b=creator?roleScore(creator,'creator',team.style)-team.averageCreator:0;
  return clamp(Math.exp(.015*a+.010*b),.78,1.22);
}
function calculateShotNormalizer(team){
  const d=team.assessment.details.filter(x=>x.slot!=='GK');
  const weights=d.map(x=>shootWeight(x)*(x.player.id===team.selection.scorer?1.85:1));
  const total=weights.reduce((a,b)=>a+b,0);
  let weighted=0;
  for(let i=0;i<d.length;i++){
    const others=d.filter(x=>x.player.id!==d[i].player.id);
    const cw=others.map(x=>createWeight(x)*(x.player.id===team.selection.creator?1.85:1));
    const ct=cw.reduce((a,b)=>a+b,0);
    const withCreator=others.reduce((sum,x,j)=>sum+cw[j]/ct*shotRawMultiplier(team,d[i],x),0);
    weighted+=weights[i]/total*(.78*withCreator+.22*shotRawMultiplier(team,d[i],null));
  }
  return weighted;
}
function shotProbability(base,team,{shooter,creator}){
  return clamp(base*shotRawMultiplier(team,shooter,creator)/team.shotNormalizer,.002,.70);
}
function simulatedHalf(attacker,defender,home,rng,extra=false){
  const cfg=factors(attacker,defender,home);
  const n=poisson(cfg.expectedChances*(extra?1/3:1),rng);
  const events=[];let goals=0,onTarget=0,xg=0;
  for(let k=0;k<n;k++){
    const parts=pickPlayers(attacker,rng),p=shotProbability(cfg.baseProbability,attacker,parts);
    xg+=p;const scored=rng()<p;
    // Every goal is on target; other attempts may go wide or require a save.
    const target=scored||rng()<clamp(.25+.60*p,.28,.70);
    if(scored)goals++;if(target)onTarget++;
    const minute=extra?91+Math.floor(rng()*30):1+Math.floor(rng()*90);
    events.push({shooterId:parts.shooter.player.id,shooter:parts.shooter.player.name,creatorId:parts.creator?.player.id??null,creator:parts.creator?.player.name??null,xg:p,scored,onTarget:target,minute});
  }
  return {goals,onTarget,xg,events,chances:n,baselineXG:cfg.baseXG};
}
function expectedMatchXG(own,opp,home){
  const cfg=factors(own,opp,home),d=own.assessment.details.filter(x=>x.slot!=='GK');
  const weights=d.map(x=>shootWeight(x)*(x.player.id===own.selection.scorer?1.85:1));const total=weights.reduce((a,b)=>a+b,0);
  let probability=0;
  for(let i=0;i<d.length;i++){
    const others=d.filter(x=>x.player.id!==d[i].player.id),cw=others.map(x=>createWeight(x)*(x.player.id===own.selection.creator?1.85:1));const ct=cw.reduce((a,b)=>a+b,0);
    const withCreator=others.reduce((s,x,j)=>s+cw[j]/ct*shotProbability(cfg.baseProbability,own,{shooter:d[i],creator:x}),0);
    probability+=weights[i]/total*(.78*withCreator+.22*shotProbability(cfg.baseProbability,own,{shooter:d[i],creator:null}));
  }
  return {xg:cfg.expectedChances*probability,expectedChances:cfg.expectedChances,baseXG:cfg.baseXG};
}
const round1=n=>Math.round(n*10)/10;
function ratings(team,opp,own,against,saveCount,rng){
  const byPlayer=new Map();
  for(const e of own.events){let r=byPlayer.get(e.shooterId)||{goals:0,shots:0,shotsOnTarget:0,created:0,assists:0};r.shots++;r.shotsOnTarget+=Number(e.onTarget);r.goals+=Number(e.scored);byPlayer.set(e.shooterId,r);
    if(e.creatorId!==null){r=byPlayer.get(e.creatorId)||{goals:0,shots:0,shotsOnTarget:0,created:0,assists:0};r.created++;r.assists+=Number(e.scored);byPlayer.set(e.creatorId,r);}}
  const won=own.goals>against.goals,draw=own.goals===against.goals;const rb=won?.36:draw?.06:-.28;
  const mean=avg(team.assessment.details.map(d=>d.value));
  return team.assessment.details.map(d=>{
    const stat=byPlayer.get(d.player.id)||{goals:0,assists:0,shots:0,shotsOnTarget:0,created:0};
    const keep=d.slot==='GK',defender=['CB','LB','RB','DM'].includes(d.slot);
    const unit=['ST','LW','RW','AM'].includes(d.slot)?team.assessment.attack-opp.assessment.defence:['DM','CM','LM','RM'].includes(d.slot)?team.assessment.midfield-opp.assessment.midfield:team.assessment.defence-opp.assessment.attack;
    let v=6.32+rb+clamp((own.goals-against.goals)*.07,-.25,.25)+clamp(unit*.012,-.22,.22)+clamp((d.value-mean)/32,-.16,.16)+((rng()+rng()+rng())-1.5)*.36;
    v+=stat.goals*.88+stat.assists*.48+Math.min(.20,stat.created*.018)+Math.min(.14,Math.max(0,stat.shotsOnTarget-stat.goals)*.018);
    if(keep){v+=Math.min(.90,saveCount*.12)+(against.goals===0?.58:0)-Math.min(.82,against.goals*.16);if(d.player.positions?.[0]!=='GK')v-=.22;}
    else if(defender){if(against.goals===0)v+=d.slot==='DM'?.20:.40;v-=Math.min(.42,against.goals*(d.slot==='DM'?.05:.075));}
    else if(['CM','LM','RM'].includes(d.slot)&&against.goals===0)v+=.08;
    if(['ST','LW','RW','AM','LM','RM'].includes(d.slot))v+=Math.min(.20,own.goals*.045);
    v+=clamp((own.goals-own.xg)*.045,-.12,.12);
    return {playerId:d.player.id,player:d.player.name,slot:d.slot,rating:round1(clamp(v,4,9.9)),goals:stat.goals,assists:stat.assists,saves:keep?saveCount:0};
  });
}
function simulateMatch(home,away,{neutral=false,knockout=false,seed}={}){
  const matchSeed=Number.isInteger(seed)?seed>>>0:require('crypto').randomBytes(4).readUInt32LE(0);
  const rng=seedRandom(matchSeed);
  const h=simulatedHalf(home.matchProfile,away.matchProfile,!neutral,rng),a=simulatedHalf(away.matchProfile,home.matchProfile,false,rng);
  const wentExtraTime=!!(knockout&&h.goals===a.goals);
  if(wentExtraTime){
    const eh=simulatedHalf(home.matchProfile,away.matchProfile,!neutral,rng,true),ea=simulatedHalf(away.matchProfile,home.matchProfile,false,rng,true);
    for(const [side,extra] of [[h,eh],[a,ea]]){side.goals+=extra.goals;side.onTarget+=extra.onTarget;side.xg+=extra.xg;side.chances+=extra.chances;side.events.push(...extra.events);}
  }
  let penalties=null;
  if(knockout&&h.goals===a.goals){
    penalties={home:0,away:0};const qualityDiff=home.assessment.overall-away.assessment.overall;
    const ph=clamp(.75+qualityDiff*.002,.65,.85),pa=clamp(.75-qualityDiff*.002,.65,.85);
    for(let i=0;i<5;i++){penalties.home+=Number(rng()<ph);penalties.away+=Number(rng()<pa);}
    let rounds=0;while(penalties.home===penalties.away&&rounds++<100){penalties.home+=Number(rng()<ph);penalties.away+=Number(rng()<pa);}
    if(penalties.home===penalties.away)penalties.home++; // Vanishingly rare safety stop.
  }
  const scorerList=events=>events.filter(e=>e.scored).sort((x,y)=>x.minute-y.minute).map(e=>({playerId:e.shooterId,player:e.shooter,minute:e.minute,assistId:e.creatorId,assist:e.creator}));
  const hs=Math.max(0,a.onTarget-a.goals),as=Math.max(0,h.onTarget-h.goals);
  const hr=ratings(home,away,h,a,hs,rng),ar=ratings(away,home,a,h,as,rng);
  const winner=penalties?(penalties.home>penalties.away?home.id:away.id):(h.goals===a.goals?null:(h.goals>a.goals?home.id:away.id));
  return {
    homeId:home.id,awayId:away.id,homeName:home.name,awayName:away.name,
    homeGoals:h.goals,awayGoals:a.goals,homeScorers:scorerList(h.events),awayScorers:scorerList(a.events),
    homeShotsOnTarget:h.onTarget,awayShotsOnTarget:a.onTarget,homeSaves:hs,awaySaves:as,
    homePlayerRatings:hr,awayPlayerRatings:ar,playerOfMatch:playerOfMatch(hr,ar),
    wentExtraTime,penalties,winnerId:winner,matchSeed,
    betaAudit:{homeXG:round1(h.xg*100)/100,awayXG:round1(a.xg*100)/100,homeChances:h.chances,awayChances:a.chances}
  };
}

// Experimental qualitative pre-season guidance. All raw ratings, traits and
// numerical role scores stay server-side. We rank choices by expected points
// against a neutral, identically strong Balanced reference XI. Neither the
// manager identity nor session history enters this calculation.
const poissonProbabilities=(mean)=>{
  const out=[Math.exp(-mean)];
  for(let i=1;i<=32;i++)out.push(out[i-1]*mean/i);
  return out;
};
function expectedPointsFromXG(forXG,againstXG){
  const a=poissonProbabilities(forXG),b=poissonProbabilities(againstXG);
  let lower=0,win=0,draw=0;
  for(let i=0;i<a.length;i++){
    win+=a[i]*lower;
    draw+=a[i]*b[i];
    lower+=b[i];
  }
  return 3*win+draw;
}
function indicatorLabel(delta){
  // Delta is expected points per fixture surrendered against the same neutral
  // opponent. Exact numerical scores are deliberately hidden in the UI.
  if(delta<=1e-10) return 'Best';
  if(delta<=.03) return 'Great';
  if(delta<=.075) return 'Good';
  if(delta<=.15) return 'OK';
  return 'Bad';
}
function roleChoiceLabel(delta,selection={}){
  if(['creator','scorer','anchor'].some(r=>selection[r]===undefined||selection[r]===null||selection[r]===''))
    return 'Choose all 3';
  return indicatorLabel(delta);
}
function tacticalChoiceIndicators(assessment,selection={}){
  const current=prepare(assessment,selection);
  const baseline=prepare(assessment,{style:'balanced'});
  const baselineHome=expectedMatchXG(baseline,baseline,true).xg;
  const baselineAway=expectedMatchXG(baseline,baseline,false).xg;
  const styleResults={};
  let currentPoints=null;
  let highest=-Infinity;
  for(const style of Object.keys(STYLE)){
    const opt=optionsFor(assessment,style);
    const anchors=[...opt.anchor].sort((a,b)=>b.score-a.score||String(a.id).localeCompare(String(b.id)));
    let best={points:-Infinity,selection:null};
    // Each creator/scorer pair has a uniquely strongest eligible defender.
    // This avoids pointlessly repeating the same offensive calculation for
    // all possible anchors and keeps live preview evaluations lightweight.
    for(const creator of opt.creator){
      for(const scorer of opt.scorer){
        if(String(creator.id)===String(scorer.id))continue;
        const anchor=anchors.find(a=>String(a.id)!==String(creator.id)&&String(a.id)!==String(scorer.id));
        if(!anchor)continue;
        const candidate=prepare(assessment,{style,creator:creator.id,scorer:scorer.id,anchor:anchor.id});
        const ownHome=expectedMatchXG(candidate,baseline,true).xg;
        const ownAway=expectedMatchXG(candidate,baseline,false).xg;
        const concedeFactor=candidate.exposure/baseline.exposure;
        const points=(expectedPointsFromXG(ownHome,baselineAway*concedeFactor)
                    +expectedPointsFromXG(ownAway,baselineHome*concedeFactor))/2;
        if(points>best.points){best={points,selection:candidate.selection};}
      }
    }
    styleResults[style]=best;
    if(best.points>highest)highest=best.points;
  }
  const reference=styleResults[current.style];
  const ownHome=expectedMatchXG(current,baseline,true).xg;
  const ownAway=expectedMatchXG(current,baseline,false).xg;
  const concedeFactor=current.exposure/baseline.exposure;
  currentPoints=(expectedPointsFromXG(ownHome,baselineAway*concedeFactor)
                +expectedPointsFromXG(ownAway,baselineHome*concedeFactor))/2;
  return {
    style:indicatorLabel(highest-reference.points),
    roles:roleChoiceLabel(reference.points-currentPoints,selection),
  };
}

module.exports={validateManualSelections,STYLE,styleSuitability,roleScore,optionsFor,prepare,expectedMatchXG,baseXG,simulateMatch,seedRandom,tacticalChoiceIndicators,expectedPointsFromXG,shotProbability};
