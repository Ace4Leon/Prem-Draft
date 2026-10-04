// Hidden All-Time Premier League simulation profiles.
// These values never leave the server. Individual player ratings/traits are deliberately not sent to clients.
// Quality philosophy: best 2-3 season Premier League peak, plus a small positive sustained-excellence bonus.

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const round1=n=>Math.round(n*10)/10;

// [peak-window quality, sustained-excellence bonus]
// Unlisted players use tier-based defaults; notable players are curated here so the model reflects their PL version.
const QUALITY = {
  // Goalkeepers
  'Peter Schmeichel':[95.5,1.0], 'Petr Cech':[95,1.5], 'Edwin van der Sar':[94.5,1.0],
  'David de Gea':[94,1.0], 'Alisson':[95,1.0], 'Pepe Reina':[89.5,1.0], 'Shay Given':[89,1.0],
  'Joe Hart':[89.5,1.0], 'Brad Friedel':[88.5,1.25], 'Hugo Lloris':[90,1.0], 'Jens Lehmann':[89.5,0.5],
  'Tim Howard':[87.5,0.75], 'Emiliano Martinez':[91,0.25], 'David Seaman':[94,1.0], 'Nigel Martyn':[89.5,0.75],
  'David James':[87.5,0.75], 'Mark Schwarzer':[87.5,1.0], 'Ederson':[93.5,1.0], 'Thibaut Courtois':[93.5,0.5],
  'Jordan Pickford':[89.5,0.75], 'Wojciech Szczesny':[88.5,0.5],

  // Full-backs / wing-backs
  'Ashley Cole':[95,1.0], 'Patrice Evra':[92.5,1.0], 'Andrew Robertson':[93.5,1.0], 'Leighton Baines':[90.5,1.0],
  'Gael Clichy':[88.5,0.75], 'John Arne Riise':[89,0.75], 'Cesar Azpilicueta':[90.5,1.25], 'Luke Shaw':[88.5,0.5],
  'Denis Irwin':[92.5,1.0], 'Graeme Le Saux':[88.5,0.5], 'Aleksandar Kolarov':[88,0.5], 'Marcos Alonso':[88.5,0.5],
  'Oleksandr Zinchenko':[88.5,0.5], 'Kyle Walker':[93.5,1.0], 'Gary Neville':[90.5,1.0],
  'Branislav Ivanovic':[90.5,0.75], 'Trent Alexander-Arnold':[93.5,0.75], 'Pablo Zabaleta':[89.5,0.75],
  'Bacary Sagna':[89,0.75], 'Kieran Trippier':[89,0.5], 'Lauren':[89.5,0.5], 'Lee Dixon':[90,1.0],
  'Steve Finnan':[88,0.5], 'Glen Johnson':[88.5,0.5], 'Seamus Coleman':[88.5,0.75], 'Antonio Valencia':[89.5,0.75],
  'Reece James':[91.5,0.25], 'Joao Cancelo':[92,0.25],

  // Centre-backs
  'John Terry':[95,1.5], 'Rio Ferdinand':[95,1.5], 'Nemanja Vidic':[94.5,1.0], 'Virgil van Dijk':[96,0.5],
  'Vincent Kompany':[94,1.0], 'Sol Campbell':[93.5,1.0], 'Jamie Carragher':[90,1.25], 'Ricardo Carvalho':[92.5,0.75],
  'Ledley King':[91,0.25], 'Kolo Toure':[89.5,0.75], 'Jaap Stam':[94,0.5], 'William Gallas':[90,0.75],
  'Sami Hyypia':[90.5,1.0], 'Martin Keown':[90,0.75], 'Toby Alderweireld':[91,0.75], 'Jan Vertonghen':[90.5,0.75],
  'Ruben Dias':[93,0.5], 'Gary Cahill':[89.5,0.75], 'Tony Adams':[94.5,1.0], 'Steve Bruce':[89.5,0.75],
  'Gary Pallister':[90.5,0.75], 'Laurent Koscielny':[90.5,0.5], 'Per Mertesacker':[89,0.5], 'Daniel Agger':[89.5,0.25],
  'Aymeric Laporte':[90.5,0.5], 'John Stones':[91.5,0.75], 'Gabriel Magalhaes':[92,0.5], 'William Saliba':[93,0.5],
  'Lisandro Martinez':[88.5,0.25], 'Rafael Varane':[89,0.25], 'Steve Bould':[90,0.75],

  // Defensive / central midfielders
  'Claude Makelele':[93.5,0.5], "N'Golo Kante":[94.5,0.5], 'Rodri':[95.5,0.5], 'Michael Carrick':[91.5,1.0],
  'Gilberto Silva':[90.5,0.75], 'Javier Mascherano':[91.5,0.5], 'Fernandinho':[91.5,1.0], 'Declan Rice':[92.5,0.5],
  'Steven Gerrard':[96,1.0], 'Frank Lampard':[95,1.5], 'Paul Scholes':[94.5,1.5], 'Patrick Vieira':[95,1.0],
  'Yaya Toure':[95,0.5], 'Cesc Fabregas':[93.5,1.0], 'David Silva':[93.5,1.0], 'Kevin De Bruyne':[95,1.5],
  'Roy Keane':[94.5,1.0], 'Xabi Alonso':[92.5,0.5], 'Luka Modric':[90,0.5], 'Mousa Dembele':[89.5,0.5],
  'Gareth Barry':[88.5,1.25], 'Mikel Arteta':[89,0.5], 'James Milner':[88.5,1.25], 'Tim Cahill':[89,0.75],
  'Michael Essien':[92.5,0.5], 'Jordan Henderson':[89,1.0], 'Bruno Fernandes':[92.5,0.75], 'Martin Odegaard':[92.5,0.5],
  'Juan Mata':[91.5,0.5], 'Mesut Ozil':[91.5,0.5], 'Paul Ince':[90.5,0.75], 'Emmanuel Petit':[90,0.5],
  'Ray Parlour':[88.5,0.75], 'Owen Hargreaves':[88.5,0.25], 'Scott Parker':[88.5,0.5], 'Adam Lallana':[88.5,0.5],
  'Santi Cazorla':[91.5,0.5], 'Jack Wilshere':[88.5,0.25], 'Aaron Ramsey':[90,0.5], 'Tomas Rosicky':[88.5,0.25],
  'Samir Nasri':[89.5,0.5], 'Georginio Wijnaldum':[89,0.75], 'Ramires':[88.5,0.5], 'Nemanja Matic':[89.5,0.75],
  'Jorginho':[89.5,0.5], 'Ilkay Gundogan':[92.5,1.0], 'Bernardo Silva':[93.5,1.0], 'Fabinho':[90.5,0.5],
  'Thiago Alcantara':[89.5,0.25], 'Casemiro':[87.5,0.25], 'Christian Eriksen':[91.5,0.75], 'Dele Alli':[89.5,0.25],
  'James Maddison':[89.5,0.5], 'Gary Speed':[89.5,1.0], 'Matt Le Tissier':[92.5,0.75], 'Juninho Paulista':[89.5,0.25],
  'Jay-Jay Okocha':[89.5,0.25], 'Youri Tielemans':[88.5,0.5], 'Douglas Luiz':[88.5,0.25], 'Moises Caicedo':[91.5,0.25],
  'Enzo Fernandez':[90,0.25],

  // Wide players / attacking mids
  'Ryan Giggs':[93,2.0], 'Gareth Bale':[96,0.5], 'Eden Hazard':[96,0.5], 'Robert Pires':[91,1.0],
  'Sadio Mane':[94,1.0], 'Son Heung-min':[93.5,1.0], 'Raheem Sterling':[92,1.0], 'Damien Duff':[89.5,0.5],
  'Nani':[89.5,0.5], 'Marc Overmars':[91,0.5], 'David Ginola':[90.5,0.5], 'Steve McManaman':[90,0.75],
  'Ashley Young':[88.5,0.75], 'Florent Malouda':[88.5,0.5], 'Joe Cole':[89.5,0.5], 'Arjen Robben':[90,0.25],
  'Alexis Sanchez':[93.5,0.5], 'Leroy Sane':[90.5,0.25], 'Raphinha':[88.5,0.25], 'Jack Grealish':[89,0.25],
  'Luis Diaz':[90,0.5], 'Mohamed Salah':[97,1.5], 'Cristiano Ronaldo':[98,0.5], 'David Beckham':[93,1.0],
  'Riyad Mahrez':[93,1.0], 'Freddie Ljungberg':[89.5,0.75], 'Bukayo Saka':[93.5,0.75], 'Theo Walcott':[88,0.5],
  'Andrei Kanchelskis':[89,0.5], 'Willian':[88.5,0.75], 'Pedro':[88.5,0.5], 'Jarrod Bowen':[89.5,0.5],
  'Cole Palmer':[93,0.5],

  // Forwards
  'Thierry Henry':[98,1.5], 'Sergio Aguero':[95,1.5], 'Wayne Rooney':[96,1.5], 'Harry Kane':[96,1.0],
  'Didier Drogba':[94,1.0], 'Alan Shearer':[95,1.5], 'Ruud van Nistelrooy':[94,0.5], 'Robin van Persie':[94.5,0.5],
  'Luis Suarez':[97,0.5], 'Erling Haaland':[95.5,0.5], 'Fernando Torres':[94,0.5], 'Andy Cole':[92.5,1.0],
  'Dwight Yorke':[91.5,0.5], 'Teddy Sheringham':[90.5,1.0], 'Dimitar Berbatov':[91,0.5], 'Jermain Defoe':[89.5,1.0],
  'Peter Crouch':[87.5,1.0], 'Jamie Vardy':[91.5,1.0], 'Carlos Tevez':[92,0.5], 'Nicolas Anelka':[90,0.75],
  'Jimmy Floyd Hasselbaink':[90.5,0.5], 'Olivier Giroud':[89,0.75], 'Romelu Lukaku':[90,0.5], 'Emmanuel Adebayor':[89.5,0.5],
  'Robbie Keane':[90,1.0], 'Eric Cantona':[94,0.75], 'Dennis Bergkamp':[93.5,1.0], 'Ian Wright':[93,1.0],
  'Les Ferdinand':[90.5,0.75], 'Gianfranco Zola':[92.5,0.5], 'Kevin Phillips':[89.5,0.25], 'Michael Owen':[93.5,0.5],
  'Robbie Fowler':[92.5,0.75], 'Paolo Di Canio':[89.5,0.5], 'Louis Saha':[88.5,0.25], 'Edin Dzeko':[89,0.5],
  'Mario Balotelli':[88.5,0.25], 'Javier Hernandez':[88.5,0.5], 'Diego Costa':[91,0.5], 'Pierre-Emerick Aubameyang':[90,0.25],
  'Marcus Rashford':[89.5,0.5], 'Ivan Toney':[89,0.25], 'Alexander Isak':[92,0.5]
};

const TIER_DEFAULT = {
  1:[91.5,0.5],
  2:[87.0,0.5],
  3:[82.0,0.25],
  4:[77.0,0.25]
};

const ARCHETYPES = {
  stopper_cb:{role:[0.80,0.18,0.02], traits:[94,45,20,18,8,38]},
  ball_playing_cb:{role:[0.72,0.26,0.02], traits:[87,82,46,20,10,42]},
  covering_cb:{role:[0.76,0.22,0.02], traits:[90,65,30,18,12,66]},
  defensive_fb:{role:[0.68,0.26,0.06], traits:[88,58,32,22,68,58]},
  balanced_fb:{role:[0.58,0.30,0.12], traits:[80,70,48,30,84,72]},
  attacking_fb:{role:[0.46,0.34,0.20], traits:[68,78,62,42,94,84]},
  creative_fullback:{role:[0.40,0.40,0.20], traits:[62,88,88,40,94,72]},
  destroyer_dm:{role:[0.58,0.39,0.03], traits:[97,58,28,20,15,48]},
  anchor_dm:{role:[0.54,0.43,0.03], traits:[94,70,38,22,14,40]},
  deep_playmaker:{role:[0.34,0.61,0.05], traits:[72,95,66,30,20,42]},
  box_to_box:{role:[0.28,0.55,0.17], traits:[72,82,68,62,38,76]},
  controller_cm:{role:[0.20,0.68,0.12], traits:[56,94,84,44,35,50]},
  attacking_8:{role:[0.13,0.55,0.32], traits:[42,84,82,82,42,72]},
  creator_10:{role:[0.06,0.44,0.50], traits:[24,78,98,66,50,58]},
  scorer_10:{role:[0.07,0.40,0.53], traits:[28,76,82,92,42,72]},
  wide_mid:{role:[0.18,0.49,0.33], traits:[50,72,72,52,94,70]},
  touchline_winger:{role:[0.07,0.30,0.63], traits:[22,68,76,66,99,86]},
  inside_forward:{role:[0.06,0.24,0.70], traits:[20,66,72,94,66,92]},
  wide_creator:{role:[0.07,0.36,0.57], traits:[22,76,96,70,88,68]},
  poacher:{role:[0.02,0.08,0.90], traits:[12,38,32,99,16,88]},
  complete_forward:{role:[0.05,0.18,0.77], traits:[24,68,78,94,42,84]},
  target_forward:{role:[0.09,0.15,0.76], traits:[36,48,58,90,20,66]},
  second_striker:{role:[0.04,0.29,0.67], traits:[20,70,88,86,42,70]},
  pressing_forward:{role:[0.10,0.20,0.70], traits:[42,58,58,88,38,94]},
  goalkeeper_outfield:{role:[0.25,0.40,0.35], traits:[34,22,18,15,10,20]}
};

// protection, progression, creativity, goalThreat, width, directness
const TRAIT_NAMES=['protection','progression','creativity','goalThreat','width','directness'];

const ARCHETYPE_OVERRIDE = {
  // Keepers are handled separately below.
  'Ashley Cole':'balanced_fb','Patrice Evra':'attacking_fb','Andrew Robertson':'attacking_fb','Leighton Baines':'attacking_fb',
  'Denis Irwin':'balanced_fb','Kyle Walker':'balanced_fb','Gary Neville':'defensive_fb','Trent Alexander-Arnold':'creative_fullback',
  'Reece James':'attacking_fb','Joao Cancelo':'creative_fullback','Branislav Ivanovic':'defensive_fb','Antonio Valencia':'attacking_fb',
  'John Terry':'stopper_cb','Rio Ferdinand':'ball_playing_cb','Nemanja Vidic':'stopper_cb','Virgil van Dijk':'ball_playing_cb',
  'Vincent Kompany':'ball_playing_cb','Sol Campbell':'covering_cb','Ricardo Carvalho':'covering_cb','Jaap Stam':'covering_cb',
  'Tony Adams':'stopper_cb','Ruben Dias':'stopper_cb','John Stones':'ball_playing_cb','William Saliba':'ball_playing_cb',
  'Aymeric Laporte':'ball_playing_cb','Daniel Agger':'ball_playing_cb','Ledley King':'ball_playing_cb',
  'Claude Makelele':'destroyer_dm',"N'Golo Kante":'destroyer_dm','Rodri':'deep_playmaker','Michael Carrick':'deep_playmaker',
  'Gilberto Silva':'anchor_dm','Javier Mascherano':'destroyer_dm','Fernandinho':'anchor_dm','Declan Rice':'box_to_box',
  'Steven Gerrard':'box_to_box','Frank Lampard':'attacking_8','Paul Scholes':'controller_cm','Patrick Vieira':'box_to_box',
  'Yaya Toure':'attacking_8','Cesc Fabregas':'controller_cm','David Silva':'creator_10','Kevin De Bruyne':'attacking_8',
  'Roy Keane':'box_to_box','Xabi Alonso':'deep_playmaker','Luka Modric':'controller_cm','Mousa Dembele':'controller_cm',
  'Michael Essien':'box_to_box','Bruno Fernandes':'scorer_10','Martin Odegaard':'creator_10','Juan Mata':'creator_10',
  'Mesut Ozil':'creator_10','Santi Cazorla':'controller_cm','Ilkay Gundogan':'attacking_8','Bernardo Silva':'controller_cm',
  'Thiago Alcantara':'controller_cm','Casemiro':'destroyer_dm','Christian Eriksen':'creator_10','Dele Alli':'scorer_10',
  'Matt Le Tissier':'scorer_10','Jay-Jay Okocha':'creator_10','Moises Caicedo':'destroyer_dm','Enzo Fernandez':'controller_cm',
  'Fabinho':'anchor_dm','Nemanja Matic':'anchor_dm','Jorginho':'deep_playmaker','James Milner':'box_to_box',
  'Ryan Giggs':'touchline_winger','Gareth Bale':'inside_forward','Eden Hazard':'wide_creator','Robert Pires':'inside_forward',
  'Sadio Mane':'inside_forward','Son Heung-min':'inside_forward','Raheem Sterling':'inside_forward','Marc Overmars':'touchline_winger',
  'Arjen Robben':'inside_forward','Alexis Sanchez':'inside_forward','Leroy Sane':'touchline_winger','Raphinha':'touchline_winger',
  'Luis Diaz':'inside_forward','Mohamed Salah':'inside_forward','Cristiano Ronaldo':'inside_forward','David Beckham':'wide_creator',
  'Riyad Mahrez':'wide_creator','Bukayo Saka':'wide_creator','Cole Palmer':'creator_10','Nani':'touchline_winger',
  'Thierry Henry':'complete_forward','Sergio Aguero':'complete_forward','Wayne Rooney':'complete_forward','Harry Kane':'complete_forward',
  'Didier Drogba':'target_forward','Alan Shearer':'complete_forward','Ruud van Nistelrooy':'poacher','Robin van Persie':'complete_forward',
  'Luis Suarez':'complete_forward','Erling Haaland':'poacher','Fernando Torres':'poacher','Andy Cole':'poacher',
  'Dimitar Berbatov':'second_striker','Jamie Vardy':'poacher','Carlos Tevez':'pressing_forward','Eric Cantona':'second_striker',
  'Dennis Bergkamp':'second_striker','Ian Wright':'poacher','Gianfranco Zola':'second_striker','Michael Owen':'poacher',
  'Robbie Fowler':'poacher','Diego Costa':'target_forward','Pierre-Emerick Aubameyang':'poacher','Peter Crouch':'target_forward'
};

const GK_STYLE = {
  traditional:{shot:4,command:4,distribution:-10},
  shot_stopper:{shot:6,command:-1,distribution:-9},
  balanced:{shot:3,command:2,distribution:0},
  sweeper:{shot:1,command:1,distribution:7},
  distributor:{shot:0,command:-1,distribution:10}
};
const GK_OVERRIDE = {
  'Peter Schmeichel':'traditional','Petr Cech':'traditional','Edwin van der Sar':'balanced','David de Gea':'shot_stopper',
  'Alisson':'sweeper','Pepe Reina':'sweeper','Shay Given':'shot_stopper','Joe Hart':'traditional','Brad Friedel':'shot_stopper',
  'Hugo Lloris':'sweeper','Jens Lehmann':'sweeper','Tim Howard':'shot_stopper','Emiliano Martinez':'traditional','David Seaman':'traditional',
  'Nigel Martyn':'traditional','Ederson':'distributor','Thibaut Courtois':'shot_stopper','Jordan Pickford':'distributor','Nick Pope':'traditional'
};

function qualityFor(player){
  const [peak,bonus]=QUALITY[player.name] || TIER_DEFAULT[player.tier] || [82,0.25];
  return {peak,bonus,quality:round1(clamp(peak+bonus,60,99))};
}

function defaultArchetype(player){
  const p=player.positions[0];
  if(p==='CB') return 'stopper_cb';
  if(p==='LB'||p==='RB') return 'balanced_fb';
  if(p==='DM') return 'anchor_dm';
  if(p==='CM') return 'controller_cm';
  if(p==='AM') return 'creator_10';
  if(p==='LM'||p==='RM') return 'wide_mid';
  if(p==='LW'||p==='RW') return 'inside_forward';
  if(p==='ST') return 'complete_forward';
  return 'controller_cm';
}

function goalkeeperSkills(player,quality){
  if(player.positions[0]!=='GK'){
    // Outfielders in goal are intentionally disastrous. Better ball players may distribute a little better,
    // but shot-stopping and command remain extremely poor.
    const profile=outfieldProfile(player,quality);
    return {shotStopping:18,command:16,distribution:clamp(18+profile.traits.progression*0.25,18,42)};
  }
  const style=GK_OVERRIDE[player.name]||'balanced';
  const mod=GK_STYLE[style];
  return {
    shotStopping:round1(clamp(quality+mod.shot,55,99)),
    command:round1(clamp(quality+mod.command,55,99)),
    distribution:round1(clamp(quality+mod.distribution,45,99))
  };
}

function outfieldProfile(player,quality){
  if(player.positions[0]==='GK'){
    const t=ARCHETYPES.goalkeeper_outfield;
    const traits=Object.fromEntries(TRAIT_NAMES.map((n,i)=>[n,t.traits[i]]));
    return {archetype:'goalkeeper_outfield',role:{defence:t.role[0],midfield:t.role[1],attack:t.role[2]},traits};
  }
  const archetype=ARCHETYPE_OVERRIDE[player.name] || defaultArchetype(player);
  const tpl=ARCHETYPES[archetype]||ARCHETYPES.controller_cm;
  const traits={}; TRAIT_NAMES.forEach((n,i)=>traits[n]=tpl.traits[i]);
  return {archetype,role:{defence:tpl.role[0],midfield:tpl.role[1],attack:tpl.role[2]},traits};
}

function getProfile(player){
  const q=qualityFor(player);
  const out=outfieldProfile(player,q.quality);
  return {
    peak:q.peak, sustainedBonus:q.bonus, quality:q.quality,
    archetype:out.archetype, role:out.role, traits:out.traits,
    goalkeeper:goalkeeperSkills(player,q.quality)
  };
}

// Generic positional relationship fallback. Listed secondary positions are handled before this table at 97%.
const FIT = {
  'RB>LB':0.82,'LB>RB':0.82,
  'RB>CB':0.84,'LB>CB':0.84,'CB>RB':0.80,'CB>LB':0.80,
  'DM>CB':0.90,'CB>DM':0.87,
  'CM>DM':0.91,'DM>CM':0.91,'CM>AM':0.91,'AM>CM':0.87,
  'DM>AM':0.78,'AM>DM':0.74,
  'RW>LW':0.90,'LW>RW':0.90,
  'RW>RM':0.94,'RM>RW':0.94,'LW>LM':0.94,'LM>LW':0.94,
  'RM>LM':0.88,'LM>RM':0.88,
  'ST>RW':0.84,'ST>LW':0.84,'RW>ST':0.87,'LW>ST':0.87,
  'AM>RW':0.88,'AM>LW':0.88,'RW>AM':0.86,'LW>AM':0.86,
  'CM>RM':0.85,'CM>LM':0.85,'RM>CM':0.84,'LM>CM':0.84,
  'RB>RM':0.80,'LB>LM':0.80,'RM>RB':0.73,'LM>LB':0.73,
  'DM>RB':0.78,'DM>LB':0.78,'RB>DM':0.80,'LB>DM':0.80,
  'CB>CM':0.73,'CM>CB':0.79,
  'ST>AM':0.82,'AM>ST':0.86,
  'ST>CM':0.69,'RW>CM':0.72,'LW>CM':0.72,'CM>RW':0.78,'CM>LW':0.78,
  'RW>RM':0.94,'LW>LM':0.94,'RM>LW':0.82,'LM>RW':0.82,
  'RB>RW':0.68,'LB>LW':0.68,'RW>RB':0.64,'LW>LB':0.64,
  'CB>ST':0.56,'CB>RW':0.55,'CB>LW':0.55,
  'ST>CB':0.54,'RW>CB':0.55,'LW>CB':0.55,
  'ST>LB':0.58,'ST>RB':0.58,'LW>RB':0.60,'RW>LB':0.60,
  'LB>ST':0.58,'RB>ST':0.58,
  'DM>ST':0.66,'ST>DM':0.60,'AM>CB':0.58,'CB>AM':0.60
};

function broadFallback(from,to){
  if(from==='GK'||to==='GK') return 0.25;
  const def=new Set(['LB','RB','CB','DM']);
  const mid=new Set(['DM','CM','AM','LM','RM']);
  const att=new Set(['AM','LM','RM','LW','RW','ST']);
  if(def.has(from)&&def.has(to)) return 0.74;
  if(mid.has(from)&&mid.has(to)) return 0.78;
  if(att.has(from)&&att.has(to)) return 0.76;
  if((def.has(from)&&mid.has(to))||(mid.has(from)&&def.has(to))) return 0.66;
  if((mid.has(from)&&att.has(to))||(att.has(from)&&mid.has(to))) return 0.70;
  return 0.56;
}

function positionalFit(player,slot){
  if(player.positions[0]===slot) return 1.0;
  if(player.positions.slice(1).includes(slot)) return 0.97;
  let best=0;
  for(const natural of player.positions){
    best=Math.max(best,FIT[`${natural}>${slot}`] ?? broadFallback(natural,slot));
  }
  return clamp(best,0.25,0.94);
}

const SLOT_REQUIREMENTS={
  GK:{gk:{shotStopping:0.48,command:0.30,distribution:0.22}},
  CB:{protection:0.58,progression:0.25,directness:0.07,creativity:0.10},
  LB:{protection:0.38,progression:0.20,width:0.27,directness:0.15},
  RB:{protection:0.38,progression:0.20,width:0.27,directness:0.15},
  DM:{protection:0.42,progression:0.32,creativity:0.18,directness:0.08},
  CM:{protection:0.18,progression:0.34,creativity:0.30,goalThreat:0.10,directness:0.08},
  AM:{progression:0.16,creativity:0.42,goalThreat:0.30,directness:0.12},
  LM:{progression:0.16,creativity:0.22,goalThreat:0.14,width:0.30,directness:0.18},
  RM:{progression:0.16,creativity:0.22,goalThreat:0.14,width:0.30,directness:0.18},
  LW:{creativity:0.20,goalThreat:0.32,width:0.22,directness:0.26},
  RW:{creativity:0.20,goalThreat:0.32,width:0.22,directness:0.26},
  ST:{creativity:0.14,goalThreat:0.58,directness:0.28}
};

function traitSuitability(profile,slot){
  const req=SLOT_REQUIREMENTS[slot]||SLOT_REQUIREMENTS.CM;
  if(req.gk){
    const g=profile.goalkeeper;
    return Object.entries(req.gk).reduce((s,[k,w])=>s+(g[k]||0)*w,0);
  }
  return Object.entries(req).reduce((s,[k,w])=>s+(profile.traits[k]||0)*w,0);
}

function slotUnitWeights(slot){
  if(slot==='GK'||slot==='CB') return {defence:1,midfield:0,attack:0};
  if(slot==='LB'||slot==='RB') return {defence:0.85,midfield:0.15,attack:0};
  if(slot==='DM') return {defence:0.20,midfield:0.80,attack:0};
  if(slot==='CM') return {defence:0,midfield:1,attack:0};
  if(slot==='LM'||slot==='RM') return {defence:0,midfield:0.75,attack:0.25};
  if(slot==='AM') return {defence:0,midfield:0.65,attack:0.35};
  return {defence:0,midfield:0,attack:1};
}

function playerUnitValue(player,slot,profile,fit){
  if(slot==='GK'){
    const g=profile.goalkeeper;
    const gkComposite=g.shotStopping*0.52+g.command*0.30+g.distribution*0.18;
    const qualityFactor=player.positions[0]==='GK' ? (0.80*fit+0.20*gkComposite/100) : (0.55*fit+0.45*gkComposite/100);
    return profile.quality*qualityFactor;
  }
  const trait=traitSuitability(profile,slot)/100;
  return profile.quality*(0.82*fit+0.18*trait);
}

function avg(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;}
function shortageScore(value,target){return clamp(value/target*100,0,100);}
function rangeScore(value,min,max){
  if(value>=min&&value<=max) return 100;
  const dist=value<min?min-value:value-max;
  return clamp(100-dist*18,25,100);
}

function assessLineup(entries){
  if(!Array.isArray(entries)||entries.length!==11) throw new Error('Simulation needs exactly 11 lineup entries.');
  const details=entries.map(({player,slot})=>{
    const profile=getProfile(player);
    const fit=positionalFit(player,slot);
    const value=playerUnitValue(player,slot,profile,fit);
    return {player,slot,profile,fit,value,unit:slotUnitWeights(slot)};
  });

  const unit={attack:{sum:0,w:0},midfield:{sum:0,w:0},defence:{sum:0,w:0}};
  for(const d of details){
    for(const k of ['attack','midfield','defence']){
      const w=d.unit[k]; if(!w) continue;
      unit[k].sum += d.value*w; unit[k].w += w;
    }
  }
  const attack=unit.attack.w?unit.attack.sum/unit.attack.w:60;
  const midfield=unit.midfield.w?unit.midfield.sum/unit.midfield.w:60;
  const defence=unit.defence.w?unit.defence.sum/unit.defence.w:60;
  const fitScore=avg(details.map(d=>d.fit))*100;
  const rawFormationSuitability=avg(details.map(d=>traitSuitability(d.profile,d.slot)));
  const formationSuitability=clamp(0.70*(50+0.55*rawFormationSuitability)+0.30*fitScore,30,99);

  // Generic squad role balance, independent of where the manager placed each player.
  const outfield=details.filter(d=>d.slot!=='GK');
  const roleTotals=outfield.reduce((a,d)=>{
    a.d+=d.profile.role.defence; a.m+=d.profile.role.midfield; a.a+=d.profile.role.attack; return a;
  },{d:0,m:0,a:0});
  const roleBalance=avg([
    rangeScore(roleTotals.d,2.5,4.8),
    rangeScore(roleTotals.m,2.4,4.8),
    rangeScore(roleTotals.a,2.0,4.3)
  ]);

  // Midfield complementarity is deliberately important: three elite holding midfielders should not score like a balanced trio.
  const mids=details.filter(d=>['DM','CM','AM','LM','RM'].includes(d.slot));
  const midTrait={};
  for(const t of ['protection','progression','creativity','goalThreat']) midTrait[t]=avg(mids.map(d=>d.profile.traits[t]*d.fit));
  const midParts=[
    shortageScore(midTrait.protection,42), shortageScore(midTrait.progression,62),
    shortageScore(midTrait.creativity,56), shortageScore(midTrait.goalThreat,34)
  ];
  const midfieldBalance=mids.length ? 0.45*avg(midParts)+0.55*Math.min(...midParts) : 35;

  const attackers=details.filter(d=>['AM','LM','RM','LW','RW','ST'].includes(d.slot));
  const attackCreat=avg(attackers.map(d=>d.profile.traits.creativity*d.fit));
  const attackGoal=avg(attackers.map(d=>d.profile.traits.goalThreat*d.fit));
  const attackDirect=avg(attackers.map(d=>d.profile.traits.directness*d.fit));
  const attackBalance=attackers.length ? avg([
    shortageScore(attackCreat,48),shortageScore(attackGoal,68),shortageScore(attackDirect,58)
  ]) : 35;

  const defenders=details.filter(d=>['GK','LB','RB','CB','DM'].includes(d.slot));
  const defProtection=avg(defenders.filter(d=>d.slot!=='GK').map(d=>d.profile.traits.protection*d.fit));
  const defProgression=avg(defenders.filter(d=>d.slot!=='GK').map(d=>d.profile.traits.progression*d.fit));
  const defenceBalance=avg([shortageScore(defProtection,67),shortageScore(defProgression,42)]);

  let teamBalance=0.30*roleBalance+0.40*midfieldBalance+0.15*attackBalance+0.15*defenceBalance;
  const keeper=details.find(d=>d.slot==='GK');
  if(!keeper || keeper.player.positions[0]!=='GK') teamBalance=Math.min(teamBalance,55);

  const base=attack*0.34+midfield*0.33+defence*0.33;
  const efficiency=0.58+0.18*(fitScore/100)+0.12*(teamBalance/100)+0.12*(formationSuitability/100);
  const overall=clamp(base*efficiency,35,99);

  return {
    overall,attack,midfield,defence,
    positionalFit:fitScore,teamBalance,formationSuitability,
    details
  };
}

function publicAssessment(a){
  const r=n=>Math.round(clamp(n,0,99));
  return {
    overall:r(a.overall), attack:r(a.attack), midfield:r(a.midfield), defence:r(a.defence),
    positionalFit:r(a.positionalFit), teamBalance:r(a.teamBalance), formationSuitability:r(a.formationSuitability)
  };
}

function poisson(lambda){
  const L=Math.exp(-lambda); let k=0,p=1;
  do{k++;p*=Math.random();}while(p>L&&k<15);
  return k-1;
}
function scorerSlotMultiplier(slot){
  if(slot==='ST')return 1.45;if(slot==='LW'||slot==='RW')return 1.28;if(slot==='AM')return 1.10;
  if(slot==='LM'||slot==='RM')return 0.72;if(slot==='CM')return 0.60;if(slot==='DM')return 0.34;
  if(slot==='LB'||slot==='RB')return 0.26;if(slot==='CB')return 0.22;return 0.01;
}
function chooseWeighted(items,weightFn){
  const weighted=items.map(x=>({x,w:Math.max(0.001,weightFn(x))}));
  const total=weighted.reduce((s,v)=>s+v.w,0); let roll=Math.random()*total;
  for(const v of weighted){roll-=v.w;if(roll<=0)return v.x;} return weighted[weighted.length-1].x;
}
function chooseScorer(assessment){
  return chooseWeighted(assessment.details,d=>{
    const threat=d.profile.traits.goalThreat/100;
    return Math.pow(threat,1.7)*Math.pow(d.profile.quality/90,1.5)*d.fit*scorerSlotMultiplier(d.slot);
  });
}
function goalMinute(extra=false){
  if(extra) return 91+Math.floor(Math.pow(Math.random(),0.88)*30);
  return 1+Math.floor(Math.pow(Math.random(),0.82)*90);
}
function makeGoals(count,assessment,extra=false){
  const goals=[];
  for(let i=0;i<count;i++){
    const d=chooseScorer(assessment);
    goals.push({player:d.player.name,minute:goalMinute(extra)});
  }
  return goals.sort((a,b)=>a.minute-b.minute);
}
function expectedGoals(a,b,homeAdvantage){
  const attackEdge=a.attack-b.defence;
  const midfieldEdge=a.midfield-b.midfield;
  const overallEdge=a.overall-b.overall;
  const log=Math.log(1.32)+0.026*attackEdge+0.009*midfieldEdge+0.012*overallEdge+(homeAdvantage?0.09:0);
  return clamp(Math.exp(log),0.12,5.2);
}

function simulateMatch(home,away,{neutral=false,knockout=false}={}){
  const homeXg=expectedGoals(home.assessment,away.assessment,!neutral);
  const awayXg=expectedGoals(away.assessment,home.assessment,false);
  let hg=poisson(homeXg), ag=poisson(awayXg);
  let homeGoals=makeGoals(hg,home.assessment,false), awayGoals=makeGoals(ag,away.assessment,false);
  let wentExtraTime=false, penalties=null;
  if(knockout&&hg===ag){
    wentExtraTime=true;
    const eh=poisson(homeXg/3.1), ea=poisson(awayXg/3.1);
    hg+=eh;ag+=ea;
    homeGoals=homeGoals.concat(makeGoals(eh,home.assessment,true)).sort((a,b)=>a.minute-b.minute);
    awayGoals=awayGoals.concat(makeGoals(ea,away.assessment,true)).sort((a,b)=>a.minute-b.minute);
    if(hg===ag){
      let hp=0,ap=0;
      const homeChance=clamp(0.75+(home.assessment.overall-away.assessment.overall)*0.002,0.65,0.85);
      const awayChance=clamp(0.75+(away.assessment.overall-home.assessment.overall)*0.002,0.65,0.85);
      for(let i=0;i<5;i++){if(Math.random()<homeChance)hp++;if(Math.random()<awayChance)ap++;}
      while(hp===ap){if(Math.random()<homeChance)hp++;if(Math.random()<awayChance)ap++;}
      penalties={home:hp,away:ap};
    }
  }
  return {
    homeId:home.id,awayId:away.id,homeName:home.name,awayName:away.name,
    homeGoals:hg,awayGoals:ag,homeScorers:homeGoals,awayScorers:awayGoals,
    wentExtraTime,penalties,
    winnerId: penalties ? (penalties.home>penalties.away?home.id:away.id) : (hg===ag?null:(hg>ag?home.id:away.id))
  };
}

function scheduleFor(teams){
  const games=[];
  if(teams.length===2){
    const [a,b]=teams;
    games.push([a,b],[b,a],[a,b],[b,a]);
    return games;
  }
  for(let i=0;i<teams.length;i++) for(let j=i+1;j<teams.length;j++){
    games.push([teams[i],teams[j]],[teams[j],teams[i]]);
  }
  // Shuffle fixture order without changing home/away counts.
  for(let i=games.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[games[i],games[j]]=[games[j],games[i]];}
  return games;
}

function blankRow(t){return {id:t.id,name:t.name,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0};}
function tableFromResults(teams,matches){
  const map=new Map(teams.map(t=>[t.id,blankRow(t)]));
  for(const m of matches){
    const h=map.get(m.homeId),a=map.get(m.awayId); if(!h||!a)continue;
    h.p++;a.p++;h.gf+=m.homeGoals;h.ga+=m.awayGoals;a.gf+=m.awayGoals;a.ga+=m.homeGoals;
    if(m.homeGoals>m.awayGoals){h.w++;a.l++;h.pts+=3;}else if(m.homeGoals<m.awayGoals){a.w++;h.l++;a.pts+=3;}else{h.d++;a.d++;h.pts++;a.pts++;}
  }
  for(const r of map.values()) r.gd=r.gf-r.ga;
  const rows=[...map.values()];
  rows.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name));

  // Apply head-to-head mini-table only to groups still tied on points, GD and GF.
  let i=0;
  while(i<rows.length){
    let j=i+1;while(j<rows.length&&rows[j].pts===rows[i].pts&&rows[j].gd===rows[i].gd&&rows[j].gf===rows[i].gf)j++;
    if(j-i>1){
      const ids=new Set(rows.slice(i,j).map(r=>r.id));
      const mini=tableFromResultsNoH2H(rows.slice(i,j).map(r=>({id:r.id,name:r.name})),matches.filter(m=>ids.has(m.homeId)&&ids.has(m.awayId)));
      const order=new Map(mini.map((r,k)=>[r.id,k]));
      const part=rows.slice(i,j).sort((a,b)=>(order.get(a.id)??99)-(order.get(b.id)??99));
      rows.splice(i,j-i,...part);
    }
    i=j;
  }
  return rows;
}
function tableFromResultsNoH2H(teams,matches){
  const map=new Map(teams.map(t=>[t.id,blankRow(t)]));
  for(const m of matches){
    const h=map.get(m.homeId),a=map.get(m.awayId);if(!h||!a)continue;
    h.p++;a.p++;h.gf+=m.homeGoals;h.ga+=m.awayGoals;a.gf+=m.awayGoals;a.ga+=m.homeGoals;
    if(m.homeGoals>m.awayGoals){h.w++;a.l++;h.pts+=3;}else if(m.homeGoals<m.awayGoals){a.w++;h.l++;a.pts+=3;}else{h.d++;a.d++;h.pts++;a.pts++;}
  }
  for(const r of map.values())r.gd=r.gf-r.ga;
  return [...map.values()].sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name));
}

function tiedAtTopAfterAllCriteria(table,matches){
  if(table.length<2)return [table[0]?.id].filter(Boolean);
  const top=table[0];
  const candidates=table.filter(r=>r.pts===top.pts&&r.gd===top.gd&&r.gf===top.gf);
  if(candidates.length<=1)return [top.id];
  const ids=new Set(candidates.map(x=>x.id));
  const mini=tableFromResultsNoH2H(candidates.map(r=>({id:r.id,name:r.name})),matches.filter(m=>ids.has(m.homeId)&&ids.has(m.awayId)));
  const mtop=mini[0];
  return mini.filter(r=>r.pts===mtop.pts&&r.gd===mtop.gd&&r.gf===mtop.gf).map(r=>r.id);
}

function simulateCompetition(teamInputs){
  const teams=teamInputs.map(t=>({...t,assessment:t.assessment}));
  const fixtures=scheduleFor(teams);
  const matches=fixtures.map(([h,a])=>simulateMatch(h,a));
  const table=tableFromResults(teams,matches);
  let tied=tiedAtTopAfterAllCriteria(table,matches);
  const playoffs=[];
  let championId=table[0]?.id||null;
  if(tied.length>1){
    // Rare final tiebreak: neutral knockout. If 3+ somehow remain identical, a small playoff bracket decides it on the pitch.
    let pool=tied.map(id=>teams.find(t=>t.id===id)).filter(Boolean);
    while(pool.length>1){
      const next=[];
      for(let i=0;i<pool.length;i+=2){
        if(i===pool.length-1){next.push(pool[i]);continue;}
        const match=simulateMatch(pool[i],pool[i+1],{neutral:true,knockout:true});
        match.tiebreak=true;playoffs.push(match);
        next.push(teams.find(t=>t.id===match.winnerId));
      }
      pool=next;
    }
    championId=pool[0]?.id||championId;
  }
  return {matches,table,playoffs,championId};
}

module.exports={getProfile,positionalFit,assessLineup,publicAssessment,simulateCompetition};
