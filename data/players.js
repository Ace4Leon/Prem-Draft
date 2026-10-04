// Prem Draft master player database
// Primary position is always first; secondary positions follow in priority order.

const PACKS = {
  "all_time_prem": "All-Time Premier League",
  "current_prem": "Current Premier League (2026/27)",
  "current_world": "Current World",
  "all_time_world": "All-Time World"
};

const PLAYER_DB = [
  {
    "name": "Peter Schmeichel",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 1
  },
  {
    "name": "Petr Cech",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 2
  },
  {
    "name": "Edwin van der Sar",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 3
  },
  {
    "name": "David de Gea",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 4
  },
  {
    "name": "Alisson",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 5
  },
  {
    "name": "Pepe Reina",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 6
  },
  {
    "name": "Shay Given",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 7
  },
  {
    "name": "Joe Hart",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 8
  },
  {
    "name": "Brad Friedel",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 9
  },
  {
    "name": "Hugo Lloris",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 10
  },
  {
    "name": "Jens Lehmann",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 11
  },
  {
    "name": "Tim Howard",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 12
  },
  {
    "name": "Emiliano Martinez",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 13
  },
  {
    "name": "David Seaman",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 14
  },
  {
    "name": "Nigel Martyn",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 15
  },
  {
    "name": "David James",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 16
  },
  {
    "name": "Mark Schwarzer",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 17
  },
  {
    "name": "Ederson",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 18
  },
  {
    "name": "Thibaut Courtois",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 19
  },
  {
    "name": "Jerzy Dudek",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 20
  },
  {
    "name": "Sander Westerveld",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 21
  },
  {
    "name": "Fabianski",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 22
  },
  {
    "name": "Ben Foster",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 23
  },
  {
    "name": "Nick Pope",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 24
  },
  {
    "name": "Jordan Pickford",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 25
  },
  {
    "name": "Aaron Ramsdale",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 26
  },
  {
    "name": "Dean Henderson",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 27
  },
  {
    "name": "Wojciech Szczesny",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 28
  },
  {
    "name": "Jussi Jaaskelainen",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 29
  },
  {
    "name": "Thomas Sorensen",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 30
  },
  {
    "name": "Ashley Cole",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 31
  },
  {
    "name": "Patrice Evra",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 32
  },
  {
    "name": "Andrew Robertson",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 33
  },
  {
    "name": "Leighton Baines",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 34
  },
  {
    "name": "Gael Clichy",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 35
  },
  {
    "name": "John Arne Riise",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 36
  },
  {
    "name": "Cesar Azpilicueta",
    "positions": [
      "LB",
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 37
  },
  {
    "name": "Luke Shaw",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 38
  },
  {
    "name": "Denis Irwin",
    "positions": [
      "LB",
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 39
  },
  {
    "name": "Graeme Le Saux",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 40
  },
  {
    "name": "Wayne Bridge",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 41
  },
  {
    "name": "Kieran Gibbs",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 42
  },
  {
    "name": "Aleksandar Kolarov",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 43
  },
  {
    "name": "Lucas Digne",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 44
  },
  {
    "name": "Ben Chilwell",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 45
  },
  {
    "name": "Marcos Alonso",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 46
  },
  {
    "name": "Oleksandr Zinchenko",
    "positions": [
      "LB",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 47
  },
  {
    "name": "Nacho Monreal",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 48
  },
  {
    "name": "Stephen Warnock",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 49
  },
  {
    "name": "Aaron Cresswell",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 50
  },
  {
    "name": "Dan Burn",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 51
  },
  {
    "name": "Tyrick Mitchell",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 52
  },
  {
    "name": "Kyle Walker",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 53
  },
  {
    "name": "Gary Neville",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 54
  },
  {
    "name": "Branislav Ivanovic",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 55
  },
  {
    "name": "Trent Alexander-Arnold",
    "positions": [
      "RB",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 56
  },
  {
    "name": "Pablo Zabaleta",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 57
  },
  {
    "name": "Bacary Sagna",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 58
  },
  {
    "name": "Kieran Trippier",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 59
  },
  {
    "name": "Lauren",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 60
  },
  {
    "name": "Lee Dixon",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 61
  },
  {
    "name": "Steve Finnan",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 62
  },
  {
    "name": "Micah Richards",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 63
  },
  {
    "name": "Glen Johnson",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 64
  },
  {
    "name": "Seamus Coleman",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 65
  },
  {
    "name": "Aaron Wan-Bissaka",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 66
  },
  {
    "name": "Reece James",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 67
  },
  {
    "name": "Joao Cancelo",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 68
  },
  {
    "name": "Kyle Naughton",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 69
  },
  {
    "name": "Matt Lowton",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 70
  },
  {
    "name": "Antonio Valencia",
    "positions": [
      "RM",
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 71
  },
  {
    "name": "John Terry",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 72
  },
  {
    "name": "Rio Ferdinand",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 73
  },
  {
    "name": "Nemanja Vidic",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 74
  },
  {
    "name": "Virgil van Dijk",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 75
  },
  {
    "name": "Vincent Kompany",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 76
  },
  {
    "name": "Sol Campbell",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 77
  },
  {
    "name": "Jamie Carragher",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 78
  },
  {
    "name": "Ricardo Carvalho",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 79
  },
  {
    "name": "Ledley King",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 80
  },
  {
    "name": "Kolo Toure",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 81
  },
  {
    "name": "Jaap Stam",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 82
  },
  {
    "name": "William Gallas",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 83
  },
  {
    "name": "Sami Hyypia",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 84
  },
  {
    "name": "Martin Keown",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 85
  },
  {
    "name": "Wes Morgan",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 86
  },
  {
    "name": "Toby Alderweireld",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 87
  },
  {
    "name": "Jan Vertonghen",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 88
  },
  {
    "name": "Ruben Dias",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 89
  },
  {
    "name": "Gary Cahill",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 90
  },
  {
    "name": "Joleon Lescott",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 91
  },
  {
    "name": "Tony Adams",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 92
  },
  {
    "name": "Steve Bruce",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 93
  },
  {
    "name": "Gary Pallister",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 94
  },
  {
    "name": "Martin Laursen",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 95
  },
  {
    "name": "Jonathan Woodgate",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 96
  },
  {
    "name": "Richard Dunne",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 97
  },
  {
    "name": "Brede Hangeland",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 98
  },
  {
    "name": "Phil Jagielka",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 99
  },
  {
    "name": "Sylvain Distin",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 100
  },
  {
    "name": "Laurent Koscielny",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 101
  },
  {
    "name": "Per Mertesacker",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 102
  },
  {
    "name": "Thomas Vermaelen",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 103
  },
  {
    "name": "Robert Huth",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 104
  },
  {
    "name": "Gary Mabbutt",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 105
  },
  {
    "name": "Colin Hendry",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 106
  },
  {
    "name": "Ronny Johnsen",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 107
  },
  {
    "name": "Daniel Agger",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 108
  },
  {
    "name": "Martin Skrtel",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 109
  },
  {
    "name": "Matip",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 110
  },
  {
    "name": "Aymeric Laporte",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 111
  },
  {
    "name": "John Stones",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 112
  },
  {
    "name": "Gabriel Magalhaes",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 113
  },
  {
    "name": "William Saliba",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 114
  },
  {
    "name": "Lisandro Martinez",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 115
  },
  {
    "name": "Harry Maguire",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 116
  },
  {
    "name": "Rafael Varane",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 117
  },
  {
    "name": "Steve Bould",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 118
  },
  {
    "name": "Ugo Ehiogu",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 119
  },
  {
    "name": "Gareth Southgate",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 120
  },
  {
    "name": "Claude Makelele",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 121
  },
  {
    "name": "N'Golo Kante",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 122
  },
  {
    "name": "Rodri",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 123
  },
  {
    "name": "Michael Carrick",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 124
  },
  {
    "name": "Gilberto Silva",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 125
  },
  {
    "name": "Javier Mascherano",
    "positions": [
      "DM",
      "CM",
      "CB"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 126
  },
  {
    "name": "Fernandinho",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 127
  },
  {
    "name": "Declan Rice",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 128
  },
  {
    "name": "Steven Gerrard",
    "positions": [
      "CM",
      "AM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 129
  },
  {
    "name": "Frank Lampard",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 130
  },
  {
    "name": "Paul Scholes",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 131
  },
  {
    "name": "Patrick Vieira",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 132
  },
  {
    "name": "Yaya Toure",
    "positions": [
      "CM",
      "AM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 133
  },
  {
    "name": "Cesc Fabregas",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 134
  },
  {
    "name": "David Silva",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 135
  },
  {
    "name": "Kevin De Bruyne",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 136
  },
  {
    "name": "Roy Keane",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 137
  },
  {
    "name": "Xabi Alonso",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 138
  },
  {
    "name": "Luka Modric",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 139
  },
  {
    "name": "Mousa Dembele",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 140
  },
  {
    "name": "Gareth Barry",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 141
  },
  {
    "name": "Mikel Arteta",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 142
  },
  {
    "name": "James Milner",
    "positions": [
      "CM",
      "LM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 143
  },
  {
    "name": "Tim Cahill",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 144
  },
  {
    "name": "Michael Essien",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 145
  },
  {
    "name": "Jordan Henderson",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 146
  },
  {
    "name": "Bruno Fernandes",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 147
  },
  {
    "name": "Martin Odegaard",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 148
  },
  {
    "name": "Juan Mata",
    "positions": [
      "AM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 149
  },
  {
    "name": "Mesut Ozil",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 150
  },
  {
    "name": "David Batty",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 151
  },
  {
    "name": "Paul Ince",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 152
  },
  {
    "name": "Emmanuel Petit",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 153
  },
  {
    "name": "Ray Parlour",
    "positions": [
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 154
  },
  {
    "name": "Nicky Butt",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 155
  },
  {
    "name": "Darren Fletcher",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 156
  },
  {
    "name": "Owen Hargreaves",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 157
  },
  {
    "name": "Scott Parker",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 158
  },
  {
    "name": "Danny Murphy",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 159
  },
  {
    "name": "Kevin Nolan",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 160
  },
  {
    "name": "Leon Osman",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 161
  },
  {
    "name": "Lee Carsley",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 162
  },
  {
    "name": "Mark Noble",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 163
  },
  {
    "name": "Morten Gamst Pedersen",
    "positions": [
      "LM",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 164
  },
  {
    "name": "Charlie Adam",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 165
  },
  {
    "name": "Adam Lallana",
    "positions": [
      "AM",
      "CM",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 166
  },
  {
    "name": "Santi Cazorla",
    "positions": [
      "AM",
      "CM",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 167
  },
  {
    "name": "Jack Wilshere",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 168
  },
  {
    "name": "Aaron Ramsey",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 169
  },
  {
    "name": "Tomas Rosicky",
    "positions": [
      "AM",
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 170
  },
  {
    "name": "Samir Nasri",
    "positions": [
      "AM",
      "LM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 171
  },
  {
    "name": "Georginio Wijnaldum",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 172
  },
  {
    "name": "Lucas Leiva",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 173
  },
  {
    "name": "Mikel John Obi",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 174
  },
  {
    "name": "Ramires",
    "positions": [
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 175
  },
  {
    "name": "Nemanja Matic",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 176
  },
  {
    "name": "Jorginho",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 177
  },
  {
    "name": "Ilkay Gundogan",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 178
  },
  {
    "name": "Bernardo Silva",
    "positions": [
      "RW",
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 179
  },
  {
    "name": "Fabinho",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 180
  },
  {
    "name": "Thiago Alcantara",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 181
  },
  {
    "name": "Casemiro",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 182
  },
  {
    "name": "Christian Eriksen",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 183
  },
  {
    "name": "Dele Alli",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 184
  },
  {
    "name": "James Maddison",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 185
  },
  {
    "name": "Joey Barton",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 186
  },
  {
    "name": "Gary Speed",
    "positions": [
      "CM",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 187
  },
  {
    "name": "Rob Lee",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 188
  },
  {
    "name": "Matt Le Tissier",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 189
  },
  {
    "name": "Juninho Paulista",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 190
  },
  {
    "name": "Jay-Jay Okocha",
    "positions": [
      "AM",
      "RM",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 191
  },
  {
    "name": "Muzzy Izzet",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 192
  },
  {
    "name": "Youri Tielemans",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 193
  },
  {
    "name": "Douglas Luiz",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 194
  },
  {
    "name": "Moises Caicedo",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 195
  },
  {
    "name": "Enzo Fernandez",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 196
  },
  {
    "name": "Ryan Giggs",
    "positions": [
      "LM",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 197
  },
  {
    "name": "Gareth Bale",
    "positions": [
      "LW",
      "LM",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 198
  },
  {
    "name": "Eden Hazard",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 199
  },
  {
    "name": "Robert Pires",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 200
  },
  {
    "name": "Sadio Mane",
    "positions": [
      "LW",
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 201
  },
  {
    "name": "Son Heung-min",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 202
  },
  {
    "name": "Raheem Sterling",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 203
  },
  {
    "name": "Damien Duff",
    "positions": [
      "LM",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 204
  },
  {
    "name": "Nani",
    "positions": [
      "RW",
      "LW",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 205
  },
  {
    "name": "Marc Overmars",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 206
  },
  {
    "name": "David Ginola",
    "positions": [
      "LW",
      "LM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 207
  },
  {
    "name": "Steve McManaman",
    "positions": [
      "LM",
      "RM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 208
  },
  {
    "name": "Ashley Young",
    "positions": [
      "LM",
      "LW",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 209
  },
  {
    "name": "Florent Malouda",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 210
  },
  {
    "name": "Joe Cole",
    "positions": [
      "AM",
      "LM",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 211
  },
  {
    "name": "Arjen Robben",
    "positions": [
      "RW",
      "RM",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 212
  },
  {
    "name": "Alexis Sanchez",
    "positions": [
      "LW",
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 213
  },
  {
    "name": "Leroy Sane",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 214
  },
  {
    "name": "Raphinha",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 215
  },
  {
    "name": "Jack Grealish",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 216
  },
  {
    "name": "Luis Diaz",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 217
  },
  {
    "name": "Kaoru Mitoma",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 218
  },
  {
    "name": "Mohamed Salah",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 219
  },
  {
    "name": "Cristiano Ronaldo",
    "positions": [
      "LW",
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 220
  },
  {
    "name": "David Beckham",
    "positions": [
      "RM",
      "CM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 221
  },
  {
    "name": "Riyad Mahrez",
    "positions": [
      "RW",
      "RM",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 222
  },
  {
    "name": "Freddie Ljungberg",
    "positions": [
      "RM",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 223
  },
  {
    "name": "Bukayo Saka",
    "positions": [
      "RW",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 224
  },
  {
    "name": "Robert Snodgrass",
    "positions": [
      "RM",
      "RW",
      "CM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 225
  },
  {
    "name": "Theo Walcott",
    "positions": [
      "RW",
      "RM",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 226
  },
  {
    "name": "Aaron Lennon",
    "positions": [
      "RW",
      "RM"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 227
  },
  {
    "name": "Andrei Kanchelskis",
    "positions": [
      "RM",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 228
  },
  {
    "name": "Willian",
    "positions": [
      "RW",
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 229
  },
  {
    "name": "Pedro",
    "positions": [
      "RW",
      "LW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 230
  },
  {
    "name": "Mason Greenwood",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 231
  },
  {
    "name": "Jarrod Bowen",
    "positions": [
      "RW",
      "ST",
      "RM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 232
  },
  {
    "name": "Cole Palmer",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 233
  },
  {
    "name": "Thierry Henry",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 234
  },
  {
    "name": "Sergio Aguero",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 235
  },
  {
    "name": "Wayne Rooney",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 236
  },
  {
    "name": "Harry Kane",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 237
  },
  {
    "name": "Didier Drogba",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 238
  },
  {
    "name": "Alan Shearer",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 239
  },
  {
    "name": "Ruud van Nistelrooy",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 240
  },
  {
    "name": "Robin van Persie",
    "positions": [
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 241
  },
  {
    "name": "Luis Suarez",
    "positions": [
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 242
  },
  {
    "name": "Erling Haaland",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 243
  },
  {
    "name": "Fernando Torres",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 244
  },
  {
    "name": "Andy Cole",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 245
  },
  {
    "name": "Dwight Yorke",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 246
  },
  {
    "name": "Teddy Sheringham",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 247
  },
  {
    "name": "Dimitar Berbatov",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 248
  },
  {
    "name": "Jermain Defoe",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 249
  },
  {
    "name": "Peter Crouch",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 250
  },
  {
    "name": "Jamie Vardy",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 251
  },
  {
    "name": "Carlos Tevez",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 252
  },
  {
    "name": "Nicolas Anelka",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 253
  },
  {
    "name": "Jimmy Floyd Hasselbaink",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 254
  },
  {
    "name": "Olivier Giroud",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 255
  },
  {
    "name": "Romelu Lukaku",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 256
  },
  {
    "name": "Emmanuel Adebayor",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 257
  },
  {
    "name": "Robbie Keane",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 258
  },
  {
    "name": "Eric Cantona",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 259
  },
  {
    "name": "Dennis Bergkamp",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 260
  },
  {
    "name": "Ian Wright",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 261
  },
  {
    "name": "Les Ferdinand",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 262
  },
  {
    "name": "Fabrizio Ravanelli",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 263
  },
  {
    "name": "Gianfranco Zola",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 264
  },
  {
    "name": "Chris Sutton",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 265
  },
  {
    "name": "Kevin Phillips",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 266
  },
  {
    "name": "Michael Owen",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 267
  },
  {
    "name": "Emile Heskey",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 268
  },
  {
    "name": "Robbie Fowler",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 269
  },
  {
    "name": "Dion Dublin",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 270
  },
  {
    "name": "Paolo Di Canio",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 271
  },
  {
    "name": "Yakubu",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 272
  },
  {
    "name": "Louis Saha",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 273
  },
  {
    "name": "Benni McCarthy",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 274
  },
  {
    "name": "Roque Santa Cruz",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 275
  },
  {
    "name": "Darren Bent",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 276
  },
  {
    "name": "Gabriel Agbonlahor",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 277
  },
  {
    "name": "Jermaine Beckford",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 4,
    "id": 278
  },
  {
    "name": "Demba Ba",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 279
  },
  {
    "name": "Papiss Cisse",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 280
  },
  {
    "name": "Christian Benteke",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 281
  },
  {
    "name": "Wilfried Bony",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 282
  },
  {
    "name": "Diego Costa",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 283
  },
  {
    "name": "Pierre-Emerick Aubameyang",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 1,
    "id": 284
  },
  {
    "name": "Edin Dzeko",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 285
  },
  {
    "name": "Mario Balotelli",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 286
  },
  {
    "name": "Javier Hernandez",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world"
    ],
    "tier": 2,
    "id": 287
  },
  {
    "name": "Marcus Rashford",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 288
  },
  {
    "name": "Anthony Martial",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_prem"
    ],
    "tier": 3,
    "id": 289
  },
  {
    "name": "Danny Welbeck",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 290
  },
  {
    "name": "Callum Wilson",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 291
  },
  {
    "name": "Dominic Calvert-Lewin",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "current_prem"
    ],
    "tier": 3,
    "id": 292
  },
  {
    "name": "Ivan Toney",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 293
  },
  {
    "name": "Alexander Isak",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_prem",
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 294
  },
  {
    "name": "David Raya",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 295
  },
  {
    "name": "Kepa Arrizabalaga",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 296
  },
  {
    "name": "Riccardo Calafiori",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 297
  },
  {
    "name": "Piero Hincapie",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 298
  },
  {
    "name": "Ezri Konsa",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 299
  },
  {
    "name": "Cristhian Mosquera",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 300
  },
  {
    "name": "Jurrien Timber",
    "positions": [
      "RB",
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 301
  },
  {
    "name": "Ben White",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 302
  },
  {
    "name": "Martin Zubimendi",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 303
  },
  {
    "name": "Bruno Guimaraes",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 304
  },
  {
    "name": "Mikel Merino",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 305
  },
  {
    "name": "Eberechi Eze",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 306
  },
  {
    "name": "Noni Madueke",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 307
  },
  {
    "name": "Christos Tzolis",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 308
  },
  {
    "name": "Kai Havertz",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 309
  },
  {
    "name": "Viktor Gyokeres",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 310
  },
  {
    "name": "Myles Lewis-Skelly",
    "positions": [
      "LB",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 311
  },
  {
    "name": "Marco Bizot",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 312
  },
  {
    "name": "Zion Suzuki",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 313
  },
  {
    "name": "Matty Cash",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 314
  },
  {
    "name": "Pau Torres",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 315
  },
  {
    "name": "Taylor Harwood-Bellis",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 316
  },
  {
    "name": "Tyrone Mings",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 317
  },
  {
    "name": "Victor Lindelof",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 318
  },
  {
    "name": "Ian Maatsen",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 319
  },
  {
    "name": "Matteo Ruggeri",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 320
  },
  {
    "name": "Boubacar Kamara",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 321
  },
  {
    "name": "Amadou Onana",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 322
  },
  {
    "name": "Leon Goretzka",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 323
  },
  {
    "name": "John McGinn",
    "positions": [
      "CM",
      "RM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 324
  },
  {
    "name": "Ross Barkley",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 325
  },
  {
    "name": "Emiliano Buendia",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 326
  },
  {
    "name": "Alejandro Garnacho",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 327
  },
  {
    "name": "Tammy Abraham",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 328
  },
  {
    "name": "Nicolas Jackson",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 329
  },
  {
    "name": "Michele Di Gregorio",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 330
  },
  {
    "name": "Djordje Petrovic",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 331
  },
  {
    "name": "Max Aarons",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 332
  },
  {
    "name": "Bafode Diakite",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 333
  },
  {
    "name": "James Hill",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 334
  },
  {
    "name": "Adam Smith",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 335
  },
  {
    "name": "Adrien Truffert",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 336
  },
  {
    "name": "Lewis Cook",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 337
  },
  {
    "name": "Tyler Adams",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 338
  },
  {
    "name": "Alex Scott",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 339
  },
  {
    "name": "Ryan Christie",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 340
  },
  {
    "name": "Amine Adli",
    "positions": [
      "LW",
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 341
  },
  {
    "name": "David Brooks",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 342
  },
  {
    "name": "Justin Kluivert",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 343
  },
  {
    "name": "Marcus Tavernier",
    "positions": [
      "LM",
      "RM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 344
  },
  {
    "name": "Evanilson",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 345
  },
  {
    "name": "Caoimhin Kelleher",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 346
  },
  {
    "name": "Kristoffer Ajer",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 347
  },
  {
    "name": "Nathan Collins",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 348
  },
  {
    "name": "Rico Henry",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 349
  },
  {
    "name": "Aaron Hickey",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 350
  },
  {
    "name": "Michael Kayode",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 351
  },
  {
    "name": "Sepp van den Berg",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 352
  },
  {
    "name": "Vitaly Janelt",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 353
  },
  {
    "name": "Mathias Jensen",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 354
  },
  {
    "name": "Mikkel Damsgaard",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 355
  },
  {
    "name": "Fabio Carvalho",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 356
  },
  {
    "name": "Dango Ouattara",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 357
  },
  {
    "name": "Kevin Schade",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 358
  },
  {
    "name": "Keane Lewis-Potter",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 359
  },
  {
    "name": "Igor Thiago",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 360
  },
  {
    "name": "Bart Verbruggen",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 361
  },
  {
    "name": "Jason Steele",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 362
  },
  {
    "name": "Lewis Dunk",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 363
  },
  {
    "name": "Olivier Boscagli",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 364
  },
  {
    "name": "Pascal Struijk",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 365
  },
  {
    "name": "Jan Paul van Hecke",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 366
  },
  {
    "name": "Maxim De Cuyper",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 367
  },
  {
    "name": "Ferdi Kadioglu",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 368
  },
  {
    "name": "Yasin Ayari",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 369
  },
  {
    "name": "Diego Gomez",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 370
  },
  {
    "name": "Pascal Gross",
    "positions": [
      "CM",
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 371
  },
  {
    "name": "Mats Wieffer",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 3,
    "id": 372
  },
  {
    "name": "Matt O'Riley",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 373
  },
  {
    "name": "Yankuba Minteh",
    "positions": [
      "RW",
      "RM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 3,
    "id": 374
  },
  {
    "name": "Georginio Rutter",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 375
  },
  {
    "name": "Evan Ferguson",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 3,
    "id": 376
  },
  {
    "name": "Charalampos Kostoulas",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 377
  },
  {
    "name": "Stefanos Tzimas",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 378
  },
  {
    "name": "Mike Penders",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 379
  },
  {
    "name": "Malo Gusto",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 3,
    "id": 380
  },
  {
    "name": "Wesley Fofana",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 381
  },
  {
    "name": "Levi Colwill",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 382
  },
  {
    "name": "Maxence Lacroix",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 383
  },
  {
    "name": "Jorrel Hato",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 384
  },
  {
    "name": "Valentin Barco",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 385
  },
  {
    "name": "Romeo Lavia",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 386
  },
  {
    "name": "Morgan Rogers",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 387
  },
  {
    "name": "Pedro Neto",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 388
  },
  {
    "name": "Jamie Bynoe-Gittens",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 389
  },
  {
    "name": "Estevao",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 390
  },
  {
    "name": "Joao Pedro",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 391
  },
  {
    "name": "Emmanuel Emegha",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 392
  },
  {
    "name": "Carl Rushworth",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 393
  },
  {
    "name": "Dan Bentley",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 394
  },
  {
    "name": "Ethan Pinnock",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 395
  },
  {
    "name": "Bobby Thomas",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 396
  },
  {
    "name": "Luke Woolfenden",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 397
  },
  {
    "name": "Jay Dasilva",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 398
  },
  {
    "name": "Milan van Ewijk",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 399
  },
  {
    "name": "Matt Grimes",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 400
  },
  {
    "name": "Gustavo Hamer",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 401
  },
  {
    "name": "Frank Onyeka",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 402
  },
  {
    "name": "Victor Torp",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 403
  },
  {
    "name": "Jack Rudoni",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 404
  },
  {
    "name": "Tatsuhiro Sakamoto",
    "positions": [
      "RW",
      "RM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 405
  },
  {
    "name": "Loum Tchaouna",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 406
  },
  {
    "name": "Haji Wright",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 407
  },
  {
    "name": "Ellis Simms",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 408
  },
  {
    "name": "Taiwo Awoniyi",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 409
  },
  {
    "name": "Walter Benitez",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 410
  },
  {
    "name": "Axel Disasi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 411
  },
  {
    "name": "Chris Richards",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 412
  },
  {
    "name": "Takehiro Tomiyasu",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 413
  },
  {
    "name": "Oscar Mingueza",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 414
  },
  {
    "name": "Cheick Doucoure",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 415
  },
  {
    "name": "Jefferson Lerma",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 416
  },
  {
    "name": "Adam Wharton",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 417
  },
  {
    "name": "Quinten Timber",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 418
  },
  {
    "name": "Daichi Kamada",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 419
  },
  {
    "name": "Yeremy Pino",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 420
  },
  {
    "name": "Ismaila Sarr",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 421
  },
  {
    "name": "Dwight McNeil",
    "positions": [
      "LM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 422
  },
  {
    "name": "Jean-Philippe Mateta",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 423
  },
  {
    "name": "Jorgen Strand Larsen",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 424
  },
  {
    "name": "Eddie Nketiah",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 425
  },
  {
    "name": "Jarrad Branthwaite",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 426
  },
  {
    "name": "James Tarkowski",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 427
  },
  {
    "name": "Michael Keane",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 428
  },
  {
    "name": "Jake O'Brien",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 429
  },
  {
    "name": "Vitalii Mykolenko",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 430
  },
  {
    "name": "Ainsley Maitland-Niles",
    "positions": [
      "RB",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 431
  },
  {
    "name": "James Garner",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 432
  },
  {
    "name": "Kiernan Dewsbury-Hall",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 433
  },
  {
    "name": "Hayden Hackney",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 434
  },
  {
    "name": "Merlin Rohl",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 435
  },
  {
    "name": "Brennan Johnson",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 436
  },
  {
    "name": "Carlos Alcaraz",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 437
  },
  {
    "name": "Thierno Barry",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 438
  },
  {
    "name": "Bernd Leno",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 439
  },
  {
    "name": "Joachim Andersen",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 440
  },
  {
    "name": "Calvin Bassey",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 441
  },
  {
    "name": "David Affengruber",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 442
  },
  {
    "name": "Kenny Tete",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 443
  },
  {
    "name": "Antonee Robinson",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 444
  },
  {
    "name": "Timothy Castagne",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 445
  },
  {
    "name": "Sander Berge",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 446
  },
  {
    "name": "Hugo Larsson",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 447
  },
  {
    "name": "Tom Cairney",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 448
  },
  {
    "name": "Emile Smith Rowe",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 449
  },
  {
    "name": "Alex Iwobi",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 450
  },
  {
    "name": "Oscar Bobb",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 451
  },
  {
    "name": "Kevin",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 452
  },
  {
    "name": "Rodrigo Muniz",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 453
  },
  {
    "name": "Konstantinos Tzolakis",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 454
  },
  {
    "name": "Jack Butland",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 455
  },
  {
    "name": "John Egan",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 456
  },
  {
    "name": "Paddy McNair",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 457
  },
  {
    "name": "Ryan Giles",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 458
  },
  {
    "name": "Brooke Norton-Cuffy",
    "positions": [
      "RB",
      "RM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 459
  },
  {
    "name": "Matt Targett",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 460
  },
  {
    "name": "Tim Iroegbunam",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 461
  },
  {
    "name": "Lucas Gourna-Douath",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 462
  },
  {
    "name": "Hidemasa Morita",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 463
  },
  {
    "name": "Abdulkadir Omur",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 464
  },
  {
    "name": "Mohamed-Ali Cho",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 465
  },
  {
    "name": "Mohamed Belloumi",
    "positions": [
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 466
  },
  {
    "name": "Joe Gelhardt",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 467
  },
  {
    "name": "Oliver McBurnie",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 468
  },
  {
    "name": "Christian Walton",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 469
  },
  {
    "name": "Alex Palmer",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 470
  },
  {
    "name": "Issa Diop",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 471
  },
  {
    "name": "Jacob Greaves",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 472
  },
  {
    "name": "Dara O'Shea",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 473
  },
  {
    "name": "Cedric Kipre",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 474
  },
  {
    "name": "Leif Davis",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 475
  },
  {
    "name": "Darnell Furlong",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 476
  },
  {
    "name": "Sasa Lukic",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 477
  },
  {
    "name": "Florentino Luis",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 478
  },
  {
    "name": "Azor Matusiwa",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 479
  },
  {
    "name": "Exequiel Palacios",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 480
  },
  {
    "name": "Julio Enciso",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 481
  },
  {
    "name": "Jaden Philogene",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 482
  },
  {
    "name": "Abdul Fatawu",
    "positions": [
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 483
  },
  {
    "name": "Daizen Maeda",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 484
  },
  {
    "name": "Chuba Akpom",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 485
  },
  {
    "name": "Jack Clarke",
    "positions": [
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 486
  },
  {
    "name": "James Trafford",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 487
  },
  {
    "name": "Michael Zetterer",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 488
  },
  {
    "name": "Joe Rodon",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 489
  },
  {
    "name": "Jaka Bijol",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 490
  },
  {
    "name": "Nico Elvedi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 491
  },
  {
    "name": "Jayden Bogle",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 492
  },
  {
    "name": "James Justin",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 493
  },
  {
    "name": "Gabriel Gudmundsson",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 494
  },
  {
    "name": "Ethan Ampadu",
    "positions": [
      "DM",
      "CM",
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 495
  },
  {
    "name": "Ilia Gruev",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 496
  },
  {
    "name": "Anton Stach",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 497
  },
  {
    "name": "Ao Tanaka",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 498
  },
  {
    "name": "Sean Longstaff",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 499
  },
  {
    "name": "Brenden Aaronson",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 500
  },
  {
    "name": "Harry Wilson",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 501
  },
  {
    "name": "Daniel James",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 502
  },
  {
    "name": "Noah Okafor",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 503
  },
  {
    "name": "Lukas Nmecha",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 504
  },
  {
    "name": "Giorgi Mamardashvili",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 505
  },
  {
    "name": "Joe Gomez",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 506
  },
  {
    "name": "Giovanni Leoni",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 507
  },
  {
    "name": "Milos Kerkez",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 508
  },
  {
    "name": "Jeremie Frimpong",
    "positions": [
      "RB",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 509
  },
  {
    "name": "Conor Bradley",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 510
  },
  {
    "name": "Ryan Gravenberch",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 511
  },
  {
    "name": "Alexis Mac Allister",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 512
  },
  {
    "name": "Dominik Szoboszlai",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 513
  },
  {
    "name": "Wataru Endo",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 514
  },
  {
    "name": "Florian Wirtz",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "all_time_world",
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 515
  },
  {
    "name": "Bradley Barcola",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 516
  },
  {
    "name": "Federico Chiesa",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 517
  },
  {
    "name": "Cody Gakpo",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 518
  },
  {
    "name": "Hugo Ekitike",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 519
  },
  {
    "name": "Gianluigi Donnarumma",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 520
  },
  {
    "name": "Geronimo Rulli",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 521
  },
  {
    "name": "Marc Guehi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 522
  },
  {
    "name": "Josko Gvardiol",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 523
  },
  {
    "name": "Abdukodir Khusanov",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 524
  },
  {
    "name": "Rayan Ait-Nouri",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 525
  },
  {
    "name": "Rico Lewis",
    "positions": [
      "RB",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 526
  },
  {
    "name": "Elliot Anderson",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 527
  },
  {
    "name": "Mateo Kovacic",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 528
  },
  {
    "name": "Matheus Nunes",
    "positions": [
      "CM",
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 529
  },
  {
    "name": "Phil Foden",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 530
  },
  {
    "name": "Rayan Cherki",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 531
  },
  {
    "name": "Jeremy Doku",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 532
  },
  {
    "name": "Antoine Semenyo",
    "positions": [
      "RW",
      "LW",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 533
  },
  {
    "name": "Iliman Ndiaye",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 534
  },
  {
    "name": "Senne Lammens",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 535
  },
  {
    "name": "Matthijs de Ligt",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 536
  },
  {
    "name": "Leny Yoro",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 537
  },
  {
    "name": "Diogo Dalot",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 538
  },
  {
    "name": "Noussair Mazraoui",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 539
  },
  {
    "name": "Patrick Dorgu",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 540
  },
  {
    "name": "Carlos Baleba",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 541
  },
  {
    "name": "Andrey Santos",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 542
  },
  {
    "name": "Manuel Ugarte",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 543
  },
  {
    "name": "Kobbie Mainoo",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 544
  },
  {
    "name": "Mason Mount",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 545
  },
  {
    "name": "Amad Diallo",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 546
  },
  {
    "name": "Bryan Mbeumo",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 547
  },
  {
    "name": "Matheus Cunha",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 548
  },
  {
    "name": "Benjamin Sesko",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 549
  },
  {
    "name": "Joshua Zirkzee",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 550
  },
  {
    "name": "Sven Botman",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 551
  },
  {
    "name": "Fabian Schar",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 552
  },
  {
    "name": "Malick Thiaw",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 553
  },
  {
    "name": "Tino Livramento",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 554
  },
  {
    "name": "Lewis Hall",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 555
  },
  {
    "name": "Amar Dedic",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 556
  },
  {
    "name": "Joelinton",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 557
  },
  {
    "name": "Sandro Tonali",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 558
  },
  {
    "name": "Jacob Ramsey",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 559
  },
  {
    "name": "Joe Willock",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 560
  },
  {
    "name": "Nicolas Gonzalez",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 561
  },
  {
    "name": "Anthony Elanga",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 562
  },
  {
    "name": "Harvey Barnes",
    "positions": [
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 563
  },
  {
    "name": "Jacob Murphy",
    "positions": [
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 564
  },
  {
    "name": "Yoane Wissa",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 565
  },
  {
    "name": "William Osula",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 566
  },
  {
    "name": "Matz Sels",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 567
  },
  {
    "name": "Murillo",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 568
  },
  {
    "name": "Nikola Milenkovic",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 569
  },
  {
    "name": "Ousmane Diomande",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 570
  },
  {
    "name": "Ola Aina",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 571
  },
  {
    "name": "Neco Williams",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 572
  },
  {
    "name": "Daniel Munoz",
    "positions": [
      "RB",
      "RM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 573
  },
  {
    "name": "Luca Netz",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 574
  },
  {
    "name": "Ibrahim Sangare",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 575
  },
  {
    "name": "Xaver Schlager",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 576
  },
  {
    "name": "Nicolas Dominguez",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 577
  },
  {
    "name": "Morgan Gibbs-White",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 578
  },
  {
    "name": "James McAtee",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 579
  },
  {
    "name": "Callum Hudson-Odoi",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 580
  },
  {
    "name": "Dan Ndoye",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 581
  },
  {
    "name": "Liam Delap",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 582
  },
  {
    "name": "Arnaud Kalimuendo",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 583
  },
  {
    "name": "Chris Wood",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 584
  },
  {
    "name": "Igor Jesus",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 585
  },
  {
    "name": "Robin Roefs",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 586
  },
  {
    "name": "Omar Alderete",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 587
  },
  {
    "name": "Dan Ballard",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 588
  },
  {
    "name": "Kevin Danso",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 589
  },
  {
    "name": "Nordi Mukiele",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 590
  },
  {
    "name": "Trai Hume",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 591
  },
  {
    "name": "Reinildo",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 592
  },
  {
    "name": "Granit Xhaka",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 593
  },
  {
    "name": "Habib Diarra",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 594
  },
  {
    "name": "Enzo Le Fee",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 595
  },
  {
    "name": "Noah Sadiki",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 596
  },
  {
    "name": "Chris Rigg",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 597
  },
  {
    "name": "Chemsdine Talbi",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 598
  },
  {
    "name": "Romaine Mundle",
    "positions": [
      "LW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 4,
    "id": 599
  },
  {
    "name": "Wilson Isidor",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 600
  },
  {
    "name": "Brian Brobbey",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 601
  },
  {
    "name": "Antonin Kinsky",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 602
  },
  {
    "name": "Micky van de Ven",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 603
  },
  {
    "name": "Tosin Adarabioyo",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 604
  },
  {
    "name": "Marcos Senesi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 605
  },
  {
    "name": "Ben Davies",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 606
  },
  {
    "name": "Pedro Porro",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 607
  },
  {
    "name": "Destiny Udogie",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 608
  },
  {
    "name": "Rodrigo Bentancur",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 609
  },
  {
    "name": "Conor Gallagher",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 610
  },
  {
    "name": "Lucas Bergvall",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 611
  },
  {
    "name": "Xavi Simons",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 612
  },
  {
    "name": "Mohammed Kudus",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 613
  },
  {
    "name": "Dejan Kulusevski",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 614
  },
  {
    "name": "Savio",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 615
  },
  {
    "name": "Mykhailo Mudryk",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_prem"
    ],
    "tier": 3,
    "id": 616
  },
  {
    "name": "Omar Marmoush",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 1,
    "id": 617
  },
  {
    "name": "Dominic Solanke",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_prem",
      "current_world"
    ],
    "tier": 2,
    "id": 618
  },
  {
    "name": "Mike Maignan",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 619
  },
  {
    "name": "Jan Oblak",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 620
  },
  {
    "name": "Diogo Costa",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 621
  },
  {
    "name": "Gregor Kobel",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 622
  },
  {
    "name": "Manuel Neuer",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 623
  },
  {
    "name": "Yann Sommer",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 624
  },
  {
    "name": "Marc-Andre ter Stegen",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 625
  },
  {
    "name": "Unai Simon",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 626
  },
  {
    "name": "Lucas Chevalier",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 627
  },
  {
    "name": "Antonio Rudiger",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 628
  },
  {
    "name": "Alessandro Bastoni",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 629
  },
  {
    "name": "Pau Cubarsi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 630
  },
  {
    "name": "Ronald Araujo",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 631
  },
  {
    "name": "Marquinhos",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 632
  },
  {
    "name": "Eder Militao",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 633
  },
  {
    "name": "Dayot Upamecano",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 634
  },
  {
    "name": "Jonathan Tah",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 635
  },
  {
    "name": "Kim Min-jae",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 636
  },
  {
    "name": "Ibrahima Konate",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 637
  },
  {
    "name": "Jules Kounde",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 638
  },
  {
    "name": "Dean Huijsen",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 639
  },
  {
    "name": "Cristian Romero",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 640
  },
  {
    "name": "Gleison Bremer",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 641
  },
  {
    "name": "Nico Schlotterbeck",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 642
  },
  {
    "name": "Achraf Hakimi",
    "positions": [
      "RB",
      "RM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 643
  },
  {
    "name": "Denzel Dumfries",
    "positions": [
      "RB",
      "RM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 644
  },
  {
    "name": "Dani Carvajal",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 645
  },
  {
    "name": "Theo Hernandez",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 646
  },
  {
    "name": "Alphonso Davies",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 647
  },
  {
    "name": "Nuno Mendes",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 648
  },
  {
    "name": "Alejandro Balde",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 649
  },
  {
    "name": "Federico Dimarco",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 650
  },
  {
    "name": "Miguel Gutierrez",
    "positions": [
      "LB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 651
  },
  {
    "name": "Aurelien Tchouameni",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 652
  },
  {
    "name": "Joshua Kimmich",
    "positions": [
      "DM",
      "CM",
      "RB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 653
  },
  {
    "name": "Vitinha",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 654
  },
  {
    "name": "Pedri",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 655
  },
  {
    "name": "Jude Bellingham",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 656
  },
  {
    "name": "Federico Valverde",
    "positions": [
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 657
  },
  {
    "name": "Frenkie de Jong",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 658
  },
  {
    "name": "Joao Neves",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 659
  },
  {
    "name": "Nicolò Barella",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 660
  },
  {
    "name": "Eduardo Camavinga",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 661
  },
  {
    "name": "Gavi",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 662
  },
  {
    "name": "Dani Olmo",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 663
  },
  {
    "name": "Jamal Musiala",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 664
  },
  {
    "name": "Arda Guler",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 665
  },
  {
    "name": "Paulo Dybala",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 666
  },
  {
    "name": "Lamine Yamal",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 667
  },
  {
    "name": "Ousmane Dembele",
    "positions": [
      "RW",
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 668
  },
  {
    "name": "Michael Olise",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 669
  },
  {
    "name": "Rodrygo",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 670
  },
  {
    "name": "Khvicha Kvaratskhelia",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 671
  },
  {
    "name": "Vinicius Junior",
    "positions": [
      "LW"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 672
  },
  {
    "name": "Kylian Mbappe",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 673
  },
  {
    "name": "Lautaro Martinez",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 674
  },
  {
    "name": "Julian Alvarez",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 675
  },
  {
    "name": "Victor Osimhen",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 676
  },
  {
    "name": "Serhou Guirassy",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 677
  },
  {
    "name": "Dusan Vlahovic",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 678
  },
  {
    "name": "Jonathan David",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 679
  },
  {
    "name": "Marcus Thuram",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 680
  },
  {
    "name": "Mateo Retegui",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 681
  },
  {
    "name": "Darwin Nunez",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 682
  },
  {
    "name": "Karim Benzema",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 683
  },
  {
    "name": "Sergej Milinkovic-Savic",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 684
  },
  {
    "name": "Ruben Neves",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 685
  },
  {
    "name": "Aleksandar Mitrovic",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 686
  },
  {
    "name": "Moussa Diaby",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 687
  },
  {
    "name": "Kingsley Coman",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 688
  },
  {
    "name": "Antoine Griezmann",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 689
  },
  {
    "name": "Desire Doue",
    "positions": [
      "LW",
      "AM",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 690
  },
  {
    "name": "Rafael Leao",
    "positions": [
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 691
  },
  {
    "name": "Christian Pulisic",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 692
  },
  {
    "name": "Ademola Lookman",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 693
  },
  {
    "name": "Nico Williams",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 694
  },
  {
    "name": "Takefusa Kubo",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 695
  },
  {
    "name": "Savinho",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 696
  },
  {
    "name": "Lionel Messi",
    "positions": [
      "RW",
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 697
  },
  {
    "name": "Jordi Alba",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 2,
    "id": 698
  },
  {
    "name": "Sergio Busquets",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 699
  },
  {
    "name": "Thiago Silva",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 700
  },
  {
    "name": "Neymar",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 701
  },
  {
    "name": "Memphis Depay",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 702
  },
  {
    "name": "Hulk",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 703
  },
  {
    "name": "Oscar",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 704
  },
  {
    "name": "Gabriel Barbosa",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 705
  },
  {
    "name": "Giorgian de Arrascaeta",
    "positions": [
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 706
  },
  {
    "name": "German Cano",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 707
  },
  {
    "name": "Paulinho",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 708
  },
  {
    "name": "Miguel Almiron",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 709
  },
  {
    "name": "Riqui Puig",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 710
  },
  {
    "name": "Denis Bouanga",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 711
  },
  {
    "name": "Evander",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 712
  },
  {
    "name": "Hirving Lozano",
    "positions": [
      "LW",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 713
  },
  {
    "name": "Sergio Ramos",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 714
  },
  {
    "name": "Kalidou Koulibaly",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 715
  },
  {
    "name": "Yassine Bounou",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 716
  },
  {
    "name": "Edouard Mendy",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 717
  },
  {
    "name": "Franck Kessie",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 718
  },
  {
    "name": "Malcom",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 719
  },
  {
    "name": "Joao Felix",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 720
  },
  {
    "name": "Gabri Veiga",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 721
  },
  {
    "name": "Alex Meret",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 722
  },
  {
    "name": "Anatoliy Trubin",
    "positions": [
      "GK"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 723
  },
  {
    "name": "David Hancko",
    "positions": [
      "CB",
      "LB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 724
  },
  {
    "name": "Goncalo Inacio",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 725
  },
  {
    "name": "Castello Lukeba",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 726
  },
  {
    "name": "Willi Orban",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 727
  },
  {
    "name": "Benjamin Pavard",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 728
  },
  {
    "name": "Francesco Acerbi",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 729
  },
  {
    "name": "Alessandro Buongiorno",
    "positions": [
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 730
  },
  {
    "name": "Giovanni Di Lorenzo",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 731
  },
  {
    "name": "Nahuel Molina",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 732
  },
  {
    "name": "Vanderson",
    "positions": [
      "RB"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 733
  },
  {
    "name": "Alejandro Grimaldo",
    "positions": [
      "LB",
      "LM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 734
  },
  {
    "name": "Angelo Stiller",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 735
  },
  {
    "name": "Hakan Calhanoglu",
    "positions": [
      "CM",
      "DM",
      "AM"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 736
  },
  {
    "name": "Henrikh Mkhitaryan",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 737
  },
  {
    "name": "Teun Koopmeiners",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 738
  },
  {
    "name": "Manuel Locatelli",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 739
  },
  {
    "name": "Khephren Thuram",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 740
  },
  {
    "name": "Tijjani Reijnders",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 741
  },
  {
    "name": "Warren Zaire-Emery",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 742
  },
  {
    "name": "Fabian Ruiz",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 743
  },
  {
    "name": "Ederson dos Santos",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 744
  },
  {
    "name": "Ismael Bennacer",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 745
  },
  {
    "name": "Dani Parejo",
    "positions": [
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 746
  },
  {
    "name": "Alex Baena",
    "positions": [
      "AM",
      "LM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 747
  },
  {
    "name": "Isco",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 748
  },
  {
    "name": "Brahim Diaz",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 749
  },
  {
    "name": "Christopher Nkunku",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 750
  },
  {
    "name": "Nico Paz",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 751
  },
  {
    "name": "Kenan Yildiz",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 1,
    "id": 752
  },
  {
    "name": "Matias Soule",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 753
  },
  {
    "name": "Francisco Conceicao",
    "positions": [
      "RW"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 754
  },
  {
    "name": "Robert Lewandowski",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world",
      "current_world"
    ],
    "tier": 1,
    "id": 755
  },
  {
    "name": "Alvaro Morata",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 756
  },
  {
    "name": "Alexander Sorloth",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 757
  },
  {
    "name": "Santiago Gimenez",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 758
  },
  {
    "name": "Rasmus Hojlund",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 759
  },
  {
    "name": "Jonathan Burkardt",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 3,
    "id": 760
  },
  {
    "name": "Patrik Schick",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 761
  },
  {
    "name": "Victor Boniface",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 762
  },
  {
    "name": "Lois Openda",
    "positions": [
      "ST"
    ],
    "packs": [
      "current_world"
    ],
    "tier": 2,
    "id": 763
  },
  {
    "name": "Lev Yashin",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 764
  },
  {
    "name": "Gianluigi Buffon",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 765
  },
  {
    "name": "Iker Casillas",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 766
  },
  {
    "name": "Dino Zoff",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 767
  },
  {
    "name": "Oliver Kahn",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 768
  },
  {
    "name": "Sepp Maier",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 769
  },
  {
    "name": "Gordon Banks",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 770
  },
  {
    "name": "Dida",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 771
  },
  {
    "name": "Claudio Taffarel",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 772
  },
  {
    "name": "Walter Zenga",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 773
  },
  {
    "name": "Julio Cesar",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 774
  },
  {
    "name": "Fabien Barthez",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 775
  },
  {
    "name": "Victor Valdes",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 776
  },
  {
    "name": "Cafu",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 777
  },
  {
    "name": "Dani Alves",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 778
  },
  {
    "name": "Philipp Lahm",
    "positions": [
      "RB",
      "LB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 779
  },
  {
    "name": "Carlos Alberto",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 780
  },
  {
    "name": "Javier Zanetti",
    "positions": [
      "RB",
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 781
  },
  {
    "name": "Lilian Thuram",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 782
  },
  {
    "name": "Giuseppe Bergomi",
    "positions": [
      "RB",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 783
  },
  {
    "name": "Maicon",
    "positions": [
      "RB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 784
  },
  {
    "name": "Marcelo",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 785
  },
  {
    "name": "Roberto Carlos",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 786
  },
  {
    "name": "Paolo Maldini",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 787
  },
  {
    "name": "Giacinto Facchetti",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 788
  },
  {
    "name": "Andreas Brehme",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 789
  },
  {
    "name": "Nilton Santos",
    "positions": [
      "LB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 790
  },
  {
    "name": "Franz Beckenbauer",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 791
  },
  {
    "name": "Franco Baresi",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 792
  },
  {
    "name": "Bobby Moore",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 793
  },
  {
    "name": "Alessandro Nesta",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 794
  },
  {
    "name": "Fabio Cannavaro",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 795
  },
  {
    "name": "Carles Puyol",
    "positions": [
      "CB",
      "RB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 796
  },
  {
    "name": "Gaetano Scirea",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 797
  },
  {
    "name": "Daniel Passarella",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 798
  },
  {
    "name": "Ronald Koeman",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 799
  },
  {
    "name": "Marcel Desailly",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 800
  },
  {
    "name": "Lucio",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 801
  },
  {
    "name": "Walter Samuel",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 802
  },
  {
    "name": "Diego Godin",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 803
  },
  {
    "name": "Giorgio Chiellini",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 804
  },
  {
    "name": "Leonardo Bonucci",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 805
  },
  {
    "name": "Gerard Pique",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 806
  },
  {
    "name": "Raphael Varane",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 807
  },
  {
    "name": "Pepe",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 808
  },
  {
    "name": "Lothar Matthaus",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 809
  },
  {
    "name": "Xavi",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 810
  },
  {
    "name": "Andres Iniesta",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 811
  },
  {
    "name": "Zinedine Zidane",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 812
  },
  {
    "name": "Michel Platini",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 813
  },
  {
    "name": "Johan Cruyff",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 814
  },
  {
    "name": "Diego Maradona",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 815
  },
  {
    "name": "Zico",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 816
  },
  {
    "name": "Socrates",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 817
  },
  {
    "name": "Andrea Pirlo",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 818
  },
  {
    "name": "Toni Kroos",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 819
  },
  {
    "name": "Clarence Seedorf",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 820
  },
  {
    "name": "Edgar Davids",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 821
  },
  {
    "name": "Frank Rijkaard",
    "positions": [
      "DM",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 822
  },
  {
    "name": "Ruud Gullit",
    "positions": [
      "AM",
      "CM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 823
  },
  {
    "name": "Johan Neeskens",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 824
  },
  {
    "name": "Didi",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 825
  },
  {
    "name": "Rivelino",
    "positions": [
      "AM",
      "LM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 826
  },
  {
    "name": "Gerson",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 827
  },
  {
    "name": "Falcao (Brazil)",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 828
  },
  {
    "name": "Fernando Redondo",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 829
  },
  {
    "name": "Juan Roman Riquelme",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 830
  },
  {
    "name": "Pavel Nedved",
    "positions": [
      "LM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 831
  },
  {
    "name": "Kaka",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 832
  },
  {
    "name": "Ronaldinho",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 833
  },
  {
    "name": "Rivaldo",
    "positions": [
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 834
  },
  {
    "name": "Luis Figo",
    "positions": [
      "RW",
      "RM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 835
  },
  {
    "name": "Franck Ribery",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 836
  },
  {
    "name": "Wesley Sneijder",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 837
  },
  {
    "name": "Michael Ballack",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 838
  },
  {
    "name": "Bastian Schweinsteiger",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 839
  },
  {
    "name": "Pele",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 840
  },
  {
    "name": "Ronaldo Nazario",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 841
  },
  {
    "name": "Ferenc Puskas",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 842
  },
  {
    "name": "Alfredo Di Stefano",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 843
  },
  {
    "name": "Gerd Muller",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 844
  },
  {
    "name": "Eusebio",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 845
  },
  {
    "name": "Marco van Basten",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 846
  },
  {
    "name": "Romario",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 847
  },
  {
    "name": "George Best",
    "positions": [
      "RW",
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 848
  },
  {
    "name": "Garrincha",
    "positions": [
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 849
  },
  {
    "name": "Stanley Matthews",
    "positions": [
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 850
  },
  {
    "name": "Raymond Kopa",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 851
  },
  {
    "name": "Bobby Charlton",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 852
  },
  {
    "name": "Zlatan Ibrahimovic",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 853
  },
  {
    "name": "Samuel Eto'o",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 854
  },
  {
    "name": "Andriy Shevchenko",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 855
  },
  {
    "name": "Gabriel Batistuta",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 856
  },
  {
    "name": "Hernan Crespo",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 857
  },
  {
    "name": "Raul",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 858
  },
  {
    "name": "David Villa",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 859
  },
  {
    "name": "David Trezeguet",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 860
  },
  {
    "name": "Filippo Inzaghi",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 861
  },
  {
    "name": "Christian Vieri",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 862
  },
  {
    "name": "Francesco Totti",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 863
  },
  {
    "name": "Alessandro Del Piero",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 864
  },
  {
    "name": "Roberto Baggio",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 865
  },
  {
    "name": "Paolo Rossi",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 866
  },
  {
    "name": "Mario Kempes",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 867
  },
  {
    "name": "Michael Laudrup",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 868
  },
  {
    "name": "Brian Laudrup",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 869
  },
  {
    "name": "Dragan Dzajic",
    "positions": [
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 870
  },
  {
    "name": "Hristo Stoichkov",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 871
  },
  {
    "name": "Dejan Savicevic",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 872
  },
  {
    "name": "Predrag Mijatovic",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 873
  },
  {
    "name": "Davor Suker",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 874
  },
  {
    "name": "George Weah",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 875
  },
  {
    "name": "Roger Milla",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 876
  },
  {
    "name": "Abedi Pele",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 877
  },
  {
    "name": "Mohamed Aboutrika",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 878
  },
  {
    "name": "Rabah Madjer",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 879
  },
  {
    "name": "Ali Daei",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 880
  },
  {
    "name": "Cha Bum-kun",
    "positions": [
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 881
  },
  {
    "name": "Park Ji-sung",
    "positions": [
      "LM",
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 882
  },
  {
    "name": "Hidetoshi Nakata",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 883
  },
  {
    "name": "Keisuke Honda",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 884
  },
  {
    "name": "Shunsuke Nakamura",
    "positions": [
      "AM",
      "RM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 885
  },
  {
    "name": "Harry Kewell",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 886
  },
  {
    "name": "Mark Viduka",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 887
  },
  {
    "name": "Landon Donovan",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 888
  },
  {
    "name": "Clint Dempsey",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 889
  },
  {
    "name": "Hugo Sanchez",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 890
  },
  {
    "name": "Rafael Marquez",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 891
  },
  {
    "name": "Cuauhtemoc Blanco",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 892
  },
  {
    "name": "Carlos Valderrama",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 893
  },
  {
    "name": "Radamel Falcao",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 894
  },
  {
    "name": "James Rodriguez",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 895
  },
  {
    "name": "Carlos Bacca",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 3,
    "id": 896
  },
  {
    "name": "Arturo Vidal",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 897
  },
  {
    "name": "Ivan Zamorano",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 898
  },
  {
    "name": "Marcelo Salas",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 899
  },
  {
    "name": "Diego Forlan",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 900
  },
  {
    "name": "Enzo Francescoli",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 901
  },
  {
    "name": "Edinson Cavani",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 902
  },
  {
    "name": "Juan Sebastian Veron",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 903
  },
  {
    "name": "Angel Di Maria",
    "positions": [
      "RW",
      "LW",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 904
  },
  {
    "name": "Gabriel Heinze",
    "positions": [
      "LB",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 905
  },
  {
    "name": "Diego Simeone",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 906
  },
  {
    "name": "Ariel Ortega",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 907
  },
  {
    "name": "Claudio Caniggia",
    "positions": [
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 908
  },
  {
    "name": "Mario Götze",
    "positions": [
      "AM",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 909
  },
  {
    "name": "Thomas Muller",
    "positions": [
      "AM",
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 910
  },
  {
    "name": "Miroslav Klose",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 911
  },
  {
    "name": "Jurgen Klinsmann",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 912
  },
  {
    "name": "Rudi Voller",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 913
  },
  {
    "name": "Karl-Heinz Rummenigge",
    "positions": [
      "ST",
      "RW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 914
  },
  {
    "name": "Uwe Seeler",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 915
  },
  {
    "name": "Gunter Netzer",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 916
  },
  {
    "name": "Matthias Sammer",
    "positions": [
      "DM",
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 917
  },
  {
    "name": "Fernando Hierro",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 918
  },
  {
    "name": "Emilio Butragueno",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 919
  },
  {
    "name": "Paco Gento",
    "positions": [
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 920
  },
  {
    "name": "Luis Suarez Miramontes",
    "positions": [
      "CM",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 921
  },
  {
    "name": "Ricardo Zamora",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 922
  },
  {
    "name": "Michel",
    "positions": [
      "RM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 923
  },
  {
    "name": "Pep Guardiola",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 924
  },
  {
    "name": "Luis Enrique",
    "positions": [
      "CM",
      "RM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 925
  },
  {
    "name": "Giuseppe Meazza",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 926
  },
  {
    "name": "Gianni Rivera",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 927
  },
  {
    "name": "Sandro Mazzola",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 928
  },
  {
    "name": "Marco Tardelli",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 929
  },
  {
    "name": "Daniele De Rossi",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 930
  },
  {
    "name": "Gennaro Gattuso",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 931
  },
  {
    "name": "Patrick Kluivert",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 932
  },
  {
    "name": "Didier Deschamps",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 933
  },
  {
    "name": "Laurent Blanc",
    "positions": [
      "CB"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 934
  },
  {
    "name": "Jean-Pierre Papin",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 935
  },
  {
    "name": "Just Fontaine",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 936
  },
  {
    "name": "Paul Gascoigne",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 937
  },
  {
    "name": "Kenny Dalglish",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 938
  },
  {
    "name": "Denis Law",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 939
  },
  {
    "name": "Jimmy Greaves",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 940
  },
  {
    "name": "Kevin Keegan",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 941
  },
  {
    "name": "Graeme Souness",
    "positions": [
      "CM",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 942
  },
  {
    "name": "Peter Shilton",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 943
  },
  {
    "name": "Chris Waddle",
    "positions": [
      "RW",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 944
  },
  {
    "name": "Glenn Hoddle",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 945
  },
  {
    "name": "John Barnes",
    "positions": [
      "LW",
      "LM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 946
  },
  {
    "name": "Ian Rush",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 947
  },
  {
    "name": "Gary Lineker",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 948
  },
  {
    "name": "Peter Beardsley",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 949
  },
  {
    "name": "Rui Costa",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 950
  },
  {
    "name": "Deco",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 951
  },
  {
    "name": "Joao Moutinho",
    "positions": [
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 952
  },
  {
    "name": "Jan Koller",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 953
  },
  {
    "name": "Robert Prosinecki",
    "positions": [
      "AM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 954
  },
  {
    "name": "Dragan Stojkovic",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 955
  },
  {
    "name": "Oleg Blokhin",
    "positions": [
      "LW",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 956
  },
  {
    "name": "Anatoliy Tymoshchuk",
    "positions": [
      "DM",
      "CM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 957
  },
  {
    "name": "Zbigniew Boniek",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 958
  },
  {
    "name": "Grzegorz Lato",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 959
  },
  {
    "name": "Sandor Kocsis",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 960
  },
  {
    "name": "Hristo Bonev",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 961
  },
  {
    "name": "Gheorghe Hagi",
    "positions": [
      "AM",
      "LM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 962
  },
  {
    "name": "Adrian Mutu",
    "positions": [
      "ST",
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 963
  },
  {
    "name": "Gheorghe Popescu",
    "positions": [
      "CB",
      "DM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 964
  },
  {
    "name": "Hakan Sukur",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 965
  },
  {
    "name": "Arda Turan",
    "positions": [
      "AM",
      "LW"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 966
  },
  {
    "name": "Yildiray Basturk",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 3,
    "id": 967
  },
  {
    "name": "Henrik Larsson",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 968
  },
  {
    "name": "Jari Litmanen",
    "positions": [
      "AM",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 1,
    "id": 969
  },
  {
    "name": "Ole Gunnar Solskjaer",
    "positions": [
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 970
  },
  {
    "name": "Nwankwo Kanu",
    "positions": [
      "ST",
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 971
  },
  {
    "name": "Lakhdar Belloumi",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 972
  },
  {
    "name": "Mustapha Hadji",
    "positions": [
      "AM"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 3,
    "id": 973
  },
  {
    "name": "El Hadji Diouf",
    "positions": [
      "RW",
      "ST"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 3,
    "id": 974
  },
  {
    "name": "Essam El-Hadary",
    "positions": [
      "GK"
    ],
    "packs": [
      "all_time_world"
    ],
    "tier": 2,
    "id": 975
  }
];

module.exports = { PACKS, PLAYER_DB };
