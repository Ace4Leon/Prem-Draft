// Hidden multi-pack simulation profiles. The legacy filename is retained so upgrading from v5A only requires replacing the file.
// These values never leave the server. Individual player ratings/traits are deliberately not sent to clients.
// All-Time Prem: best 2-3 season Premier League peak + small sustained-excellence bonus.
// Current packs: 2026/27 current ability. All-Time World: career peak + small sustained-excellence lift. Chaos: strongest available pack version.

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


// Pack-specific hidden quality versions. Current packs represent 2026/27 level only.
// All-Time World represents career peak plus a small sustained-excellence lift, following the same philosophy as All-Time Prem.
const CURRENT_PREM_QUALITY = {
  "Alisson": 92,
  "Emiliano Martinez": 91,
  "Jordan Pickford": 89,
  "David Raya": 90,
  "Bart Verbruggen": 87,
  "Andrew Robertson": 84,
  "Reece James": 88,
  "Virgil van Dijk": 91,
  "Ruben Dias": 92,
  "Gabriel Magalhaes": 92,
  "William Saliba": 94,
  "Lisandro Martinez": 86,
  "Jurrien Timber": 89,
  "Ben White": 87,
  "Riccardo Calafiori": 87,
  "Piero Hincapie": 87,
  "Ezri Konsa": 88,
  "Ian Maatsen": 87,
  "Antonee Robinson": 88,
  "Jarrad Branthwaite": 87,
  "Declan Rice": 94,
  "Bruno Fernandes": 92,
  "Martin Odegaard": 91,
  "Moises Caicedo": 92,
  "Enzo Fernandez": 91,
  "Martin Zubimendi": 91,
  "Bruno Guimaraes": 92,
  "Mikel Merino": 87,
  "Eberechi Eze": 91,
  "Morgan Rogers": 91,
  "Adam Wharton": 87,
  "Quinten Timber": 87,
  "Gustavo Hamer": 86,
  "Hugo Larsson": 86,
  "Emile Smith Rowe": 85,
  "Alex Iwobi": 84,
  "Bukayo Saka": 95,
  "Cole Palmer": 95,
  "Estevao": 93,
  "Noni Madueke": 87,
  "Pedro Neto": 88,
  "Jamie Bynoe-Gittens": 87,
  "Kaoru Mitoma": 87,
  "Alejandro Garnacho": 86,
  "Brennan Johnson": 86,
  "Jack Grealish": 85,
  "Christos Tzolis": 86,
  "Erling Haaland": 97,
  "Alexander Isak": 93,
  "Viktor Gyokeres": 92,
  "Joao Pedro": 91,
  "Kai Havertz": 87,
  "Jean-Philippe Mateta": 87,
  "Jorgen Strand Larsen": 86,
  "Evanilson": 86,
  "Nicolas Jackson": 85,
  "Tammy Abraham": 85,
  "Pascal Gross": 85,
  "Georginio Rutter": 86,
  "Evan Ferguson": 82,
  "Malo Gusto": 86,
  "Wesley Fofana": 85,
  "Levi Colwill": 86,
  "Jorrel Hato": 87,
  "Romeo Lavia": 86
};
const CURRENT_WORLD_QUALITY = {
  "Gianluigi Donnarumma": 94,
  "Thibaut Courtois": 94,
  "Alisson": 92,
  "Ederson": 90,
  "Mike Maignan": 91,
  "Jan Oblak": 90,
  "Manuel Neuer": 90,
  "Emiliano Martinez": 91,
  "Virgil van Dijk": 91,
  "William Saliba": 94,
  "Ruben Dias": 92,
  "Gabriel Magalhaes": 92,
  "Alessandro Bastoni": 93,
  "Antonio Rudiger": 91,
  "Pau Cubarsi": 91,
  "Ronald Araujo": 90,
  "Eder Militao": 91,
  "Cristian Romero": 91,
  "Jules Kounde": 92,
  "Achraf Hakimi": 95,
  "Nuno Mendes": 94,
  "Theo Hernandez": 91,
  "Alphonso Davies": 92,
  "Trent Alexander-Arnold": 91,
  "Alejandro Grimaldo": 90,
  "Rodri": 97,
  "Jude Bellingham": 96,
  "Pedri": 95,
  "Vitinha": 95,
  "Declan Rice": 94,
  "Federico Valverde": 94,
  "Joshua Kimmich": 93,
  "Frenkie de Jong": 93,
  "Joao Neves": 93,
  "Nicolò Barella": 93,
  "Aurelien Tchouameni": 92,
  "Eduardo Camavinga": 91,
  "Martin Zubimendi": 91,
  "Bruno Guimaraes": 92,
  "Moises Caicedo": 92,
  "Kevin De Bruyne": 90,
  "Bruno Fernandes": 92,
  "Martin Odegaard": 91,
  "Hakan Calhanoglu": 91,
  "Bernardo Silva": 91,
  "Warren Zaire-Emery": 91,
  "Kylian Mbappe": 98,
  "Lamine Yamal": 97,
  "Erling Haaland": 97,
  "Harry Kane": 96,
  "Ousmane Dembele": 96,
  "Vinicius Junior": 95,
  "Jamal Musiala": 95,
  "Raphinha": 94,
  "Cole Palmer": 95,
  "Bukayo Saka": 95,
  "Michael Olise": 93,
  "Khvicha Kvaratskhelia": 93,
  "Desire Doue": 93,
  "Rafael Leao": 92,
  "Nico Williams": 92,
  "Lautaro Martinez": 94,
  "Julian Alvarez": 94,
  "Victor Osimhen": 93,
  "Alexander Isak": 93,
  "Viktor Gyokeres": 92,
  "Karim Benzema": 89,
  "Antoine Griezmann": 89,
  "Lionel Messi": 94,
  "Cristiano Ronaldo": 84,
  "Mohamed Salah": 90,
  "Sadio Mane": 86,
  "Son Heung-min": 86,
  "Riyad Mahrez": 85,
  "Luis Suarez": 82,
  "Neymar": 82,
  "Robert Lewandowski": 88,
  "Estevao": 93,
  "Morgan Rogers": 91,
  "Eberechi Eze": 91,
  "Kenan Yildiz": 92,
  "Arda Guler": 92,
  "Joao Pedro": 91,
  "Florian Wirtz": 94
};
const ALL_TIME_WORLD_QUALITY = {
  "Lionel Messi": 99,
  "Cristiano Ronaldo": 99,
  "Pele": 99,
  "Diego Maradona": 99,
  "Johan Cruyff": 98.5,
  "Ronaldo Nazario": 98.5,
  "Alfredo Di Stefano": 98,
  "Franz Beckenbauer": 98,
  "Zinedine Zidane": 98,
  "Ferenc Puskas": 98,
  "Eusebio": 97.5,
  "Gerd Muller": 97.5,
  "Michel Platini": 97,
  "Ronaldinho": 97.5,
  "Marco van Basten": 97,
  "George Best": 97,
  "Garrincha": 97,
  "Zico": 96.5,
  "Bobby Charlton": 96.5,
  "Ruud Gullit": 96.5,
  "Romario": 96.5,
  "Lev Yashin": 98,
  "Gianluigi Buffon": 97,
  "Iker Casillas": 96,
  "Manuel Neuer": 97,
  "Dino Zoff": 96,
  "Peter Schmeichel": 96.5,
  "Petr Cech": 96,
  "Oliver Kahn": 96,
  "Gordon Banks": 96,
  "Edwin van der Sar": 95,
  "Paolo Maldini": 98,
  "Franco Baresi": 97.5,
  "Bobby Moore": 97,
  "Alessandro Nesta": 96.5,
  "Fabio Cannavaro": 96.5,
  "Sergio Ramos": 97,
  "Cafu": 96.5,
  "Dani Alves": 96.5,
  "Philipp Lahm": 96.5,
  "Roberto Carlos": 96.5,
  "Carlos Alberto": 96,
  "Javier Zanetti": 95.5,
  "Lilian Thuram": 95.5,
  "Carles Puyol": 95.5,
  "Gaetano Scirea": 96,
  "Ronald Koeman": 95.5,
  "Marcel Desailly": 95,
  "Ashley Cole": 95.5,
  "Virgil van Dijk": 96.5,
  "John Terry": 96,
  "Rio Ferdinand": 96,
  "Nemanja Vidic": 95.5,
  "Lothar Matthaus": 97,
  "Xavi": 97.5,
  "Andres Iniesta": 97.5,
  "Andrea Pirlo": 96,
  "Toni Kroos": 96,
  "Frank Rijkaard": 96,
  "Clarence Seedorf": 95,
  "Pavel Nedved": 95,
  "Kaka": 96,
  "Luis Figo": 96,
  "Rivaldo": 96,
  "Michael Laudrup": 96,
  "Socrates": 95,
  "Didi": 95,
  "Rivelino": 95,
  "Gerson": 94.5,
  "Falcao (Brazil)": 95,
  "Fernando Redondo": 94.5,
  "Juan Roman Riquelme": 94.5,
  "Bastian Schweinsteiger": 95,
  "Michael Ballack": 94.5,
  "Johan Neeskens": 95,
  "Patrick Vieira": 96,
  "Steven Gerrard": 97,
  "Frank Lampard": 96.5,
  "Paul Scholes": 96,
  "Kevin De Bruyne": 96.5,
  "Rodri": 96.5,
  "Luka Modric": 97,
  "Thierry Henry": 98,
  "Luis Suarez": 97.5,
  "Wayne Rooney": 97,
  "Mohamed Salah": 98,
  "Sergio Aguero": 96.5,
  "Harry Kane": 96.5,
  "Alan Shearer": 96,
  "Didier Drogba": 95,
  "Eric Cantona": 95,
  "Dennis Bergkamp": 95.5,
  "Gareth Bale": 96.5,
  "Eden Hazard": 96.5,
  "Ryan Giggs": 95,
  "Sadio Mane": 95,
  "Neymar": 97,
  "Kylian Mbappe": 98,
  "Robert Lewandowski": 97,
  "Karim Benzema": 97,
  "Zlatan Ibrahimovic": 96,
  "Samuel Eto'o": 96,
  "Andriy Shevchenko": 96,
  "Gabriel Batistuta": 95.5,
  "Raul": 95.5,
  "David Villa": 95,
  "Francesco Totti": 96,
  "Alessandro Del Piero": 95.5,
  "Roberto Baggio": 97,
  "George Weah": 96,
  "Hugo Sanchez": 95,
  "Diego Forlan": 94,
  "Edinson Cavani": 94,
  "Angel Di Maria": 94.5,
  "Thomas Muller": 95,
  "Miroslav Klose": 94,
  "Karl-Heinz Rummenigge": 96,
  "Giuseppe Meazza": 97,
  "Kenny Dalglish": 96,
  "Denis Law": 95.5,
  "Jimmy Greaves": 95.5,
  "Ian Rush": 95,
  "Oleg Blokhin": 95,
  "Hristo Stoichkov": 95.5,
  "Henrik Larsson": 93.5,
  "Lamine Yamal": 96,
  "Jude Bellingham": 95.5,
  "Pedri": 95,
  "Vinicius Junior": 95,
  "Erling Haaland": 96,
  "Ousmane Dembele": 94.5,
  "Luka Modric": 97,
  "Casemiro": 95.5,
  "Raphael Varane": 95,
  "Thibaut Courtois": 95,
  "Arjen Robben": 96,
  "Javier Mascherano": 94.5,
  "Xabi Alonso": 95,
  "Thiago Alcantara": 94.5,
  "Mesut Ozil": 94.5,
  "Gerard Pique": 95.5,
  "Pepe": 94.5,
  "Angel Di Maria": 94.5,
  "Cesc Fabregas": 94.5,
  "Alexis Sanchez": 94,
  "Joao Cancelo": 92.5,
  "Ederson": 94,
  "Alisson": 95.5,
  "N'Golo Kante": 95,
  "Yaya Toure": 95.5,
  "David Silva": 94.5,
  "Bernardo Silva": 94,
  "Ilkay Gundogan": 93.5,
  "Michael Essien": 93.5
};

const PACK_TIER_DEFAULTS = {
  all_time_prem: {1:[91.5,0.5],2:[87.0,0.5],3:[82.0,0.25],4:[77.0,0.25]},
  current_prem: {1:[90.5,0],2:[84.5,0],3:[77.5,0],4:[70.5,0]},
  current_world: {1:[91.5,0],2:[85.0,0],3:[78.5,0],4:[72.0,0]},
  all_time_world: {1:[93.0,0.75],2:[87.0,0.5],3:[81.0,0.25],4:[76.0,0.25]}
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


const GLOBAL_ARCHETYPE_EXTRA = {
  "Lionel Messi": "wide_creator",
  "Kylian Mbappe": "inside_forward",
  "Lamine Yamal": "wide_creator",
  "Ousmane Dembele": "wide_creator",
  "Vinicius Junior": "inside_forward",
  "Neymar": "wide_creator",
  "Ronaldinho": "wide_creator",
  "Luis Figo": "wide_creator",
  "Rivaldo": "inside_forward",
  "George Best": "inside_forward",
  "Garrincha": "touchline_winger",
  "Pele": "complete_forward",
  "Ronaldo Nazario": "complete_forward",
  "Ferenc Puskas": "inside_forward",
  "Alfredo Di Stefano": "second_striker",
  "Gerd Muller": "poacher",
  "Eusebio": "complete_forward",
  "Marco van Basten": "complete_forward",
  "Romario": "poacher",
  "Robert Lewandowski": "complete_forward",
  "Karim Benzema": "complete_forward",
  "Zlatan Ibrahimovic": "complete_forward",
  "Samuel Eto'o": "complete_forward",
  "Andriy Shevchenko": "complete_forward",
  "Gabriel Batistuta": "complete_forward",
  "Raul": "second_striker",
  "Francesco Totti": "creator_10",
  "Roberto Baggio": "creator_10",
  "George Weah": "complete_forward",
  "Johan Cruyff": "creator_10",
  "Diego Maradona": "creator_10",
  "Zinedine Zidane": "creator_10",
  "Michel Platini": "scorer_10",
  "Zico": "scorer_10",
  "Kaka": "scorer_10",
  "Michael Laudrup": "creator_10",
  "Juan Roman Riquelme": "creator_10",
  "Bobby Charlton": "attacking_8",
  "Lothar Matthaus": "box_to_box",
  "Xavi": "controller_cm",
  "Andres Iniesta": "controller_cm",
  "Andrea Pirlo": "deep_playmaker",
  "Toni Kroos": "controller_cm",
  "Clarence Seedorf": "box_to_box",
  "Frank Rijkaard": "anchor_dm",
  "Ruud Gullit": "box_to_box",
  "Bastian Schweinsteiger": "box_to_box",
  "Michael Ballack": "attacking_8",
  "Sergio Busquets": "anchor_dm",
  "Pedri": "controller_cm",
  "Jude Bellingham": "box_to_box",
  "Federico Valverde": "box_to_box",
  "Frenkie de Jong": "controller_cm",
  "Vitinha": "controller_cm",
  "Joshua Kimmich": "deep_playmaker",
  "Aurelien Tchouameni": "anchor_dm",
  "Joao Neves": "box_to_box",
  "Paolo Maldini": "covering_cb",
  "Franco Baresi": "ball_playing_cb",
  "Bobby Moore": "ball_playing_cb",
  "Alessandro Nesta": "covering_cb",
  "Fabio Cannavaro": "covering_cb",
  "Carles Puyol": "stopper_cb",
  "Gaetano Scirea": "ball_playing_cb",
  "Franz Beckenbauer": "ball_playing_cb",
  "Sergio Ramos": "stopper_cb",
  "Gerard Pique": "ball_playing_cb",
  "Alessandro Bastoni": "ball_playing_cb",
  "Antonio Rudiger": "covering_cb",
  "Achraf Hakimi": "attacking_fb",
  "Nuno Mendes": "attacking_fb",
  "Theo Hernandez": "attacking_fb",
  "Alphonso Davies": "attacking_fb",
  "Philipp Lahm": "balanced_fb",
  "Cafu": "attacking_fb",
  "Dani Alves": "creative_fullback",
  "Roberto Carlos": "attacking_fb",
  "Javier Zanetti": "balanced_fb"
};
const PACK_ARCHETYPE_OVERRIDE = {
  "current_world": {
    "Cristiano Ronaldo": "poacher",
    "Lionel Messi": "creator_10",
    "Sadio Mane": "inside_forward",
    "Son Heung-min": "inside_forward",
    "Mohamed Salah": "inside_forward",
    "Karim Benzema": "complete_forward",
    "Neymar": "creator_10"
  },
  "all_time_world": {
    "Cristiano Ronaldo": "inside_forward",
    "Lionel Messi": "wide_creator"
  },
  "chaos": {}
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

function qualityFor(player,pack='all_time_prem'){
  if(pack==='chaos'){
    const candidates=(player.packs||[]).map(p=>({pack:p,...qualityFor(player,p)}));
    if(!candidates.length) candidates.push({pack:'all_time_world',...qualityFor(player,'all_time_world')});
    return candidates.sort((a,b)=>b.quality-a.quality)[0];
  }
  let pair;
  if(pack==='all_time_prem') pair=QUALITY[player.name];
  else if(pack==='current_prem' && CURRENT_PREM_QUALITY[player.name]!=null) pair=[CURRENT_PREM_QUALITY[player.name],0];
  else if(pack==='current_world' && CURRENT_WORLD_QUALITY[player.name]!=null) pair=[CURRENT_WORLD_QUALITY[player.name],0];
  else if(pack==='current_world' && CURRENT_PREM_QUALITY[player.name]!=null) pair=[CURRENT_PREM_QUALITY[player.name],0];
  else if(pack==='all_time_world' && ALL_TIME_WORLD_QUALITY[player.name]!=null) pair=[ALL_TIME_WORLD_QUALITY[player.name],0];
  else if(pack==='all_time_world' && player.packs?.includes('all_time_prem')) pair=QUALITY[player.name] || PACK_TIER_DEFAULTS.all_time_prem[player.tier];
  pair = pair || PACK_TIER_DEFAULTS[pack]?.[player.tier] || PACK_TIER_DEFAULTS.all_time_world[player.tier] || [81,0.25];
  const [peak,bonus]=pair;
  return {pack,peak,bonus,quality:round1(clamp(peak+bonus,60,99))};
}

const GLOBAL_GK_OVERRIDE_EXTRA = {
  "Gianluigi Buffon": "traditional",
  "Iker Casillas": "shot_stopper",
  "Manuel Neuer": "sweeper",
  "Lev Yashin": "traditional",
  "Dino Zoff": "traditional",
  "Oliver Kahn": "traditional",
  "Gordon Banks": "traditional",
  "Gianluigi Donnarumma": "shot_stopper",
  "Mike Maignan": "sweeper",
  "Jan Oblak": "shot_stopper"
};

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

function goalkeeperSkills(player,quality,pack){
  if(player.positions[0]!=='GK'){
    // Outfielders in goal are intentionally disastrous. Better ball players may distribute a little better,
    // but shot-stopping and command remain extremely poor.
    const profile=outfieldProfile(player,quality,pack);
    return {shotStopping:18,command:16,distribution:clamp(18+profile.traits.progression*0.25,18,42)};
  }
  const style=GK_OVERRIDE[player.name]||GLOBAL_GK_OVERRIDE_EXTRA[player.name]||'balanced';
  const mod=GK_STYLE[style];
  return {
    shotStopping:round1(clamp(quality+mod.shot,55,99)),
    command:round1(clamp(quality+mod.command,55,99)),
    distribution:round1(clamp(quality+mod.distribution,45,99))
  };
}

function outfieldProfile(player,quality,pack){
  if(player.positions[0]==='GK'){
    const t=ARCHETYPES.goalkeeper_outfield;
    const traits=Object.fromEntries(TRAIT_NAMES.map((n,i)=>[n,t.traits[i]]));
    return {archetype:'goalkeeper_outfield',role:{defence:t.role[0],midfield:t.role[1],attack:t.role[2]},traits};
  }
  const archetype=PACK_ARCHETYPE_OVERRIDE[pack]?.[player.name] || ARCHETYPE_OVERRIDE[player.name] || GLOBAL_ARCHETYPE_EXTRA[player.name] || defaultArchetype(player);
  const tpl=ARCHETYPES[archetype]||ARCHETYPES.controller_cm;
  const traits={}; TRAIT_NAMES.forEach((n,i)=>traits[n]=tpl.traits[i]);
  return {archetype,role:{defence:tpl.role[0],midfield:tpl.role[1],attack:tpl.role[2]},traits};
}

function getProfile(player,pack='all_time_prem'){
  const q=qualityFor(player,pack);
  const effectivePack=pack==='chaos' ? q.pack : pack;
  const out=outfieldProfile(player,q.quality,effectivePack);
  return {
    sourcePack:effectivePack, peak:q.peak, sustainedBonus:q.bonus, quality:q.quality,
    archetype:out.archetype, role:out.role, traits:out.traits,
    goalkeeper:goalkeeperSkills(player,q.quality,effectivePack)
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

function assessLineup(entries,pack='all_time_prem'){
  if(!Array.isArray(entries)||entries.length!==11) throw new Error('Simulation needs exactly 11 lineup entries.');
  const details=entries.map(({player,slot})=>{
    const profile=getProfile(player,pack);
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

  // Team Balance v2: elite balance is difficult to reach. Instead of awarding 100 as soon as
  // a minimum threshold is crossed, every unit climbs gradually toward an elite benchmark.
  const benchmarkScore=(value,target)=>clamp(value/target*100,20,100);
  const idealRoleScore=(value,target)=>clamp(100-Math.abs(value-target)*20,25,100);

  // Generic squad role distribution, independent of the chosen formation. The targets sum to 10
  // outfield-player equivalents and allow attacking/defensive shapes without rewarding extremes.
  const outfield=details.filter(d=>d.slot!=='GK');
  const roleTotals=outfield.reduce((a,d)=>{
    a.d+=d.profile.role.defence; a.m+=d.profile.role.midfield; a.a+=d.profile.role.attack; return a;
  },{d:0,m:0,a:0});
  const roleBalance=avg([
    idealRoleScore(roleTotals.d,3.4),
    idealRoleScore(roleTotals.m,3.4),
    idealRoleScore(roleTotals.a,3.2)
  ]);

  // Midfield complementarity: protection, progression, creativity and goal threat all matter.
  // The weakest area still matters, but midfield no longer dominates the whole Team Balance rating.
  const mids=details.filter(d=>['DM','CM','AM','LM','RM'].includes(d.slot));
  const midTrait={};
  for(const t of ['protection','progression','creativity','goalThreat']) midTrait[t]=avg(mids.map(d=>d.profile.traits[t]*d.fit));
  const midParts=[
    benchmarkScore(midTrait.protection,70), benchmarkScore(midTrait.progression,85),
    benchmarkScore(midTrait.creativity,85), benchmarkScore(midTrait.goalThreat,60)
  ];
  const midfieldBalance=mids.length ? 0.55*avg(midParts)+0.45*Math.min(...midParts) : 30;

  // Attack balance now includes width as well as creation, finishing and directness.
  const attackers=details.filter(d=>['AM','LM','RM','LW','RW','ST'].includes(d.slot));
  const attackCreat=avg(attackers.map(d=>d.profile.traits.creativity*d.fit));
  const attackGoal=avg(attackers.map(d=>d.profile.traits.goalThreat*d.fit));
  const attackDirect=avg(attackers.map(d=>d.profile.traits.directness*d.fit));
  const attackWidth=avg(attackers.map(d=>d.profile.traits.width*d.fit));
  const attackBalance=attackers.length ? avg([
    benchmarkScore(attackCreat,75), benchmarkScore(attackGoal,94),
    benchmarkScore(attackDirect,90), benchmarkScore(attackWidth,60)
  ]) : 30;

  // A genuinely balanced defensive unit needs both protection and the ability to move the ball.
  const defenders=details.filter(d=>['GK','LB','RB','CB','DM'].includes(d.slot));
  const defOutfield=defenders.filter(d=>d.slot!=='GK');
  const defProtection=avg(defOutfield.map(d=>d.profile.traits.protection*d.fit));
  const defProgression=avg(defOutfield.map(d=>d.profile.traits.progression*d.fit));
  const defenceBalance=avg([benchmarkScore(defProtection,82),benchmarkScore(defProgression,60)]);

  let teamBalance=0.25*roleBalance+0.25*midfieldBalance+0.20*attackBalance+0.30*defenceBalance;
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
  do{k++;p*=Math.random();}while(p>L&&k<18);
  return k-1;
}
function scorerSlotMultiplier(slot){
  if(slot==='ST')return 1.45;if(slot==='LW'||slot==='RW')return 1.28;if(slot==='AM')return 1.10;
  if(slot==='LM'||slot==='RM')return 0.72;if(slot==='CM')return 0.60;if(slot==='DM')return 0.34;
  if(slot==='LB'||slot==='RB')return 0.26;if(slot==='CB')return 0.22;return 0.01;
}
function assisterSlotMultiplier(slot){
  if(slot==='AM')return 1.35;if(slot==='LW'||slot==='RW')return 1.25;if(slot==='LM'||slot==='RM')return 1.18;
  if(slot==='CM')return 1.12;if(slot==='ST')return 0.92;if(slot==='DM')return 0.78;
  if(slot==='LB'||slot==='RB')return 0.86;if(slot==='CB')return 0.42;return 0.01;
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
function chooseAssister(assessment,scorer){
  const candidates=assessment.details.filter(d=>d.player.id!==scorer.player.id && d.slot!=='GK');
  if(!candidates.length) return null;
  return chooseWeighted(candidates,d=>{
    const t=d.profile.traits;
    const creation=(0.48*t.creativity+0.32*t.progression+0.20*t.width)/100;
    return Math.pow(Math.max(0.08,creation),1.45)*Math.pow(d.profile.quality/90,0.7)*d.fit*assisterSlotMultiplier(d.slot);
  });
}
function goalMinute(extra=false){
  if(extra) return 91+Math.floor(Math.pow(Math.random(),0.88)*30);
  return 1+Math.floor(Math.pow(Math.random(),0.82)*90);
}
function makeGoals(count,assessment,extra=false){
  const goals=[];
  for(let i=0;i<count;i++){
    const scorer=chooseScorer(assessment);
    const assisted=Math.random()<0.78;
    const assister=assisted?chooseAssister(assessment,scorer):null;
    goals.push({
      player:scorer.player.name,playerId:scorer.player.id,minute:goalMinute(extra),
      assist:assister?.player?.name||null,assistId:assister?.player?.id??null
    });
  }
  return goals.sort((a,b)=>a.minute-b.minute);
}
function hasNaturalKeeper(assessment){
  const keeper=assessment.details.find(d=>d.slot==='GK');
  return !!keeper && keeper.player.positions?.[0]==='GK';
}
function expectedGoals(a,b,homeAdvantage){
  const attackEdge=a.attack-b.defence;
  const midfieldEdge=a.midfield-b.midfield;
  const overallEdge=a.overall-b.overall;
  // v5D calibration: matchups are more balanced, meaningful rating gaps matter more,
  // and equal teams receive a modern-football-sized home advantage (~44/24/31 H/D/A).
  let log=Math.log(1.32)+0.021*attackEdge+0.016*midfieldEdge+0.023*overallEdge+(homeAdvantage?0.20:0);
  // A non-goalkeeper in goal is already punished in the ratings, but remains an exceptional match-day weakness.
  if(!hasNaturalKeeper(b)) log+=Math.log(1.18);
  return clamp(Math.exp(log),0.10,5.5);
}
function simulateShotsOnTarget(goals,xg){
  const extra=poisson(clamp(0.9+xg*1.45,0.8,7.0));
  return goals+extra;
}
function ratingNoise(){
  return ((Math.random()+Math.random()+Math.random())-1.5)*0.36;
}
function performanceRatings(team,opponent,{goalsFor,goalsAgainst,goalEvents,saves,xgFor}){
  const scorerCounts=new Map(),assistCounts=new Map();
  for(const g of goalEvents){
    scorerCounts.set(g.playerId,(scorerCounts.get(g.playerId)||0)+1);
    if(g.assistId!==null&&g.assistId!==undefined) assistCounts.set(g.assistId,(assistCounts.get(g.assistId)||0)+1);
  }
  const won=goalsFor>goalsAgainst,draw=goalsFor===goalsAgainst;
  const resultBase=won?0.36:(draw?0.06:-0.28);
  const margin=clamp((goalsFor-goalsAgainst)*0.07,-0.25,0.25);
  const avgValue=avg(team.assessment.details.map(d=>d.value));
  const keeper=team.assessment.details.find(d=>d.slot==='GK');
  return team.assessment.details.map(d=>{
    const goals=scorerCounts.get(d.player.id)||0;
    const assists=assistCounts.get(d.player.id)||0;
    let unitEdge=0;
    if(['ST','LW','RW','AM'].includes(d.slot)) unitEdge=team.assessment.attack-opponent.assessment.defence;
    else if(['DM','CM','LM','RM'].includes(d.slot)) unitEdge=team.assessment.midfield-opponent.assessment.midfield;
    else unitEdge=team.assessment.defence-opponent.assessment.attack;
    unitEdge=clamp(unitEdge*0.012,-0.22,0.22);
    const underlying=clamp((d.value-avgValue)/32,-0.16,0.16);
    let rating=6.32+resultBase+margin+unitEdge+underlying+ratingNoise();
    rating+=goals*0.88+assists*0.48;
    if(d.slot==='GK'){
      rating+=Math.min(0.90,saves*0.12);
      if(goalsAgainst===0) rating+=0.58;
      rating-=Math.min(0.82,goalsAgainst*0.16);
      if(d.player.positions?.[0]!=='GK') rating-=0.22;
    } else if(['CB','LB','RB','DM'].includes(d.slot)){
      if(goalsAgainst===0) rating+=d.slot==='DM'?0.20:0.40;
      rating-=Math.min(0.42,goalsAgainst*(d.slot==='DM'?0.05:0.075));
    } else if(['CM','LM','RM'].includes(d.slot) && goalsAgainst===0){
      rating+=0.08;
    }
    if(['ST','LW','RW','AM','LM','RM'].includes(d.slot)) rating+=Math.min(0.20,goalsFor*0.045);
    // Slightly reward producing more than the team's xG expectation, without dominating event stats.
    rating+=clamp((goalsFor-xgFor)*0.045,-0.12,0.12);
    return {playerId:d.player.id,player:d.player.name,slot:d.slot,rating:round1(clamp(rating,4.0,9.9)),goals,assists,saves:d.player.id===keeper?.player?.id?saves:0};
  });
}
function playerOfMatch(homeRatings,awayRatings){
  const all=[...homeRatings,...awayRatings];
  all.sort((a,b)=>b.rating-a.rating||b.goals-a.goals||b.assists-a.assists||b.saves-a.saves||a.player.localeCompare(b.player));
  return all[0]?{playerId:all[0].playerId,player:all[0].player,rating:all[0].rating}:null;
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
  const homeSot=simulateShotsOnTarget(hg,homeXg),awaySot=simulateShotsOnTarget(ag,awayXg);
  const homeSaves=Math.max(0,awaySot-ag),awaySaves=Math.max(0,homeSot-hg);
  const homeRatings=performanceRatings(home,away,{goalsFor:hg,goalsAgainst:ag,goalEvents:homeGoals,saves:homeSaves,xgFor:homeXg});
  const awayRatings=performanceRatings(away,home,{goalsFor:ag,goalsAgainst:hg,goalEvents:awayGoals,saves:awaySaves,xgFor:awayXg});
  const pom=playerOfMatch(homeRatings,awayRatings);
  return {
    homeId:home.id,awayId:away.id,homeName:home.name,awayName:away.name,
    homeGoals:hg,awayGoals:ag,homeScorers:homeGoals,awayScorers:awayGoals,
    homeShotsOnTarget:homeSot,awayShotsOnTarget:awaySot,homeSaves,awaySaves,
    homePlayerRatings:homeRatings,awayPlayerRatings:awayRatings,playerOfMatch:pom,
    wentExtraTime,penalties,
    winnerId: penalties ? (penalties.home>penalties.away?home.id:away.id) : (hg===ag?null:(hg>ag?home.id:away.id))
  };
}

function scheduleFor(teams){
  const games=[];
  if(teams.length===2){
    const [a,b]=teams;
    for(let i=0;i<5;i++) games.push([a,b],[b,a]);
    return games;
  }
  const repeats=teams.length===3 ? 2 : 1;
  for(let i=0;i<teams.length;i++) for(let j=i+1;j<teams.length;j++){
    for(let r=0;r<repeats;r++) games.push([teams[i],teams[j]],[teams[j],teams[i]]);
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

function aggregatePlayerStats(teams,matches){
  const stats=new Map();
  for(const t of teams){
    for(const d of t.assessment.details){
      const key=`${t.id}:${d.player.id}`;
      stats.set(key,{playerId:d.player.id,player:d.player.name,managerId:t.id,managerName:t.name,deployedSlot:d.slot,apps:0,goals:0,assists:0,saves:0,cleanSheets:0,totalRating:0});
    }
  }
  for(const m of matches){
    const process=(teamId,ratings,events,saves,conceded)=>{
      for(const r of ratings||[]){
        const st=stats.get(`${teamId}:${r.playerId}`); if(!st)continue;
        st.apps++;st.totalRating+=r.rating;st.saves+=r.saves||0;
        if(conceded===0 && ['GK','CB','LB','RB','DM'].includes(st.deployedSlot)) st.cleanSheets++;
      }
      for(const g of events||[]){
        const scorer=stats.get(`${teamId}:${g.playerId}`);if(scorer)scorer.goals++;
        if(g.assistId!==null&&g.assistId!==undefined){const assister=stats.get(`${teamId}:${g.assistId}`);if(assister)assister.assists++;}
      }
    };
    process(m.homeId,m.homePlayerRatings,m.homeScorers,m.homeSaves,m.awayGoals);
    process(m.awayId,m.awayPlayerRatings,m.awayScorers,m.awaySaves,m.homeGoals);
  }
  return [...stats.values()].map(s=>({
    playerId:s.playerId,player:s.player,managerId:s.managerId,managerName:s.managerName,deployedSlot:s.deployedSlot,
    apps:s.apps,goals:s.goals,assists:s.assists,saves:s.saves,cleanSheets:s.cleanSheets,
    avgRating:s.apps?Math.round((s.totalRating/s.apps)*100)/100:0
  }));
}

const TOTS_FORMATIONS={
  '4-3-3':['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'],
  '4-4-2':['GK','LB','CB','CB','RB','LM','CM','CM','RM','ST','ST'],
  '4-2-3-1':['GK','LB','CB','CB','RB','DM','DM','LW','AM','RW','ST'],
  '4-1-4-1':['GK','LB','CB','CB','RB','DM','LM','CM','CM','RM','ST'],
  '3-5-2':['GK','CB','CB','CB','LM','CM','CM','AM','RM','ST','ST'],
  '3-4-3':['GK','CB','CB','CB','LM','CM','CM','RM','LW','ST','RW'],
  '5-3-2':['GK','LB','CB','CB','CB','RB','CM','CM','CM','ST','ST']
};
function totsEligible(deployed,target){
  if(target==='GK') return deployed==='GK';
  if(target==='CB') return deployed==='CB';
  if(target==='LB') return ['LB','LWB'].includes(deployed);
  if(target==='RB') return ['RB','RWB'].includes(deployed);
  if(target==='DM') return ['DM','CM'].includes(deployed);
  if(target==='CM') return ['DM','CM','AM'].includes(deployed);
  if(target==='AM') return ['AM','CM'].includes(deployed);
  if(target==='LM') return ['LM','LW','LWB'].includes(deployed);
  if(target==='RM') return ['RM','RW','RWB'].includes(deployed);
  if(target==='LW') return ['LW','LM'].includes(deployed);
  if(target==='RW') return ['RW','RM'].includes(deployed);
  if(target==='ST') return ['ST','CF'].includes(deployed);
  return deployed===target;
}
// Hungarian assignment: 11 formation slots to unique players, maximizing average match rating.
function bestTotsForFormation(playerStats,formation,slots){
  const players=playerStats;
  const n=slots.length,m=players.length;
  if(m<n)return null;
  const cost=Array.from({length:n},(_,i)=>players.map(p=>{
    if(!totsEligible(p.deployedSlot,slots[i])) return 1e6;
    const tie=(p.goals*3+p.assists*2+p.cleanSheets*0.35+p.saves*0.08)/1000;
    return -(p.avgRating+tie);
  }));
  const u=new Array(n+1).fill(0),v=new Array(m+1).fill(0),p=new Array(m+1).fill(0),way=new Array(m+1).fill(0);
  for(let i=1;i<=n;i++){
    p[0]=i;let j0=0;const minv=new Array(m+1).fill(Infinity),used=new Array(m+1).fill(false);
    do{
      used[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;
      for(let j=1;j<=m;j++)if(!used[j]){
        const cur=cost[i0-1][j-1]-u[i0]-v[j];
        if(cur<minv[j]){minv[j]=cur;way[j]=j0;}
        if(minv[j]<delta){delta=minv[j];j1=j;}
      }
      for(let j=0;j<=m;j++)if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else minv[j]-=delta;
      j0=j1;
    }while(p[j0]!==0);
    do{const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0!==0);
  }
  const assignment=new Array(n).fill(-1);
  for(let j=1;j<=m;j++)if(p[j]>0&&p[j]<=n)assignment[p[j]-1]=j-1;
  if(assignment.some((pi,si)=>pi<0||cost[si][pi]>=1e5))return null;
  const selected=assignment.map((pi,i)=>({...players[pi],slot:slots[i]}));
  const score=selected.reduce((sum,x)=>sum+x.avgRating,0);
  return {formation,score,players:selected};
}
function teamOfSeason(playerStats){
  let best=null;
  for(const [formation,slots] of Object.entries(TOTS_FORMATIONS)){
    const candidate=bestTotsForFormation(playerStats,formation,slots);
    if(candidate&&(!best||candidate.score>best.score+1e-9))best=candidate;
  }
  if(!best)return {formation:'XI',players:[]};
  return {formation:best.formation,players:best.players.map(({slot,playerId,player,managerId,managerName,deployedSlot,avgRating,goals,assists,saves})=>({slot,playerId,player,managerId,managerName,deployedSlot,avgRating,goals,assists,saves}))};
}
function leaderboards(playerStats){
  const take=fn=>[...playerStats].sort(fn).slice(0,10);
  return {
    goals:take((a,b)=>b.goals-a.goals||b.assists-a.assists||b.avgRating-a.avgRating||a.player.localeCompare(b.player)),
    assists:take((a,b)=>b.assists-a.assists||b.goals-a.goals||b.avgRating-a.avgRating||a.player.localeCompare(b.player)),
    saves:[...playerStats].filter(p=>p.deployedSlot==='GK').sort((a,b)=>b.saves-a.saves||b.avgRating-a.avgRating||a.player.localeCompare(b.player)).slice(0,10),
    rating:take((a,b)=>b.avgRating-a.avgRating||b.goals+b.assists-(a.goals+a.assists)||a.player.localeCompare(b.player))
  };
}

function simulateCompetition(teamInputs){
  const teams=teamInputs.map(t=>({...t,assessment:t.assessment}));
  const fixtures=scheduleFor(teams);
  const matches=fixtures.map(([h,a],i)=>({...simulateMatch(h,a),matchNumber:i+1}));
  const progressTables=matches.map((_,i)=>tableFromResults(teams,matches.slice(0,i+1)));
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
  const playerStats=aggregatePlayerStats(teams,matches);
  return {matches,progressTables,table,playoffs,championId,playerStats,leaderboards:leaderboards(playerStats),teamOfSeason:teamOfSeason(playerStats)};
}

module.exports={qualityFor,getProfile,positionalFit,assessLineup,publicAssessment,simulateCompetition};
