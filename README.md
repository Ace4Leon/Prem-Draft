# Prem Draft v5D

Prem Draft v5D is the simulation-and-session update. It keeps the v5C auction flow, prioritises Freeform Mode, recalibrates match outcomes, and adds a much richer post-draft season experience.

## Draft changes

- **Freeform Mode is now the default** when a new room is created.
- **Freeform compulsory/endgame allocation is now catch-up based:**
  - the forced £1m player goes to an eligible manager with the most open squad slots;
  - if two or more eligible managers are tied for the most open slots, the choice between those tied managers is pure equal randomness;
  - there is no host, join-order, previous-winner, or history weighting in a tie;
  - Hard Mode keeps its existing position-based forced allocation logic.

## Simulation calibration

- Increased home advantage so equal teams are approximately **44% home win / 24% draw / 31% away win**.
- Rebalanced matchup importance:
  - Attack vs Defence remains important but is less dominant than before;
  - Midfield vs Midfield matters more;
  - Overall vs Overall matters more;
  - meaningful 5–8 point team gaps now have a stronger effect on results.
- A team using a non-goalkeeper in the GK slot now gives the opponent an additional **18% expected-goals boost**, on top of the rating penalties already applied.
- Upsets remain possible; the goal is to make them feel like upsets rather than routine outcomes.

## Matchday reveal

- The host now reveals league results **one match at a time**.
- Reveal progress is shared across the whole room, so every manager sees the same result at the same time.
- The live league table updates after each revealed match.
- The host can use **Reveal all results** to skip the suspense.
- The champion, final tables and season awards/stats remain hidden until every league match has been revealed.

## Player statistics

Every simulated league match now generates public performance statistics without exposing hidden individual player quality:

- goals;
- assists;
- goalkeeper saves;
- per-match player ratings;
- average match rating across the season.

Goal scorers are driven by goal threat, deployed role, positional fit and hidden quality. Assists favour creative/progressive/wide players. Saves come from simulated shots on target. Match ratings use actual goals, assists, saves, clean sheets, the match result, unit performance and a small amount of match-to-match variance.

The final results screen includes Top 10 leaderboards for:

- Goals
- Assists
- Saves (goalkeepers)
- Average Match Rating

## Team of the Season

- The game builds a **Team of the Season** from the best average match ratings across every manager's team.
- Selection is based on how players actually performed in the simulated league, not directly on their hidden player rating.
- Players must fit the Team of the Season roughly according to the position in which they were deployed.
- Sensible neighbouring roles are allowed (for example RB/RWB, LB/LWB, LW/LM, RW/RM, CM/DM/AM where appropriate).
- The game tests several sensible formations and chooses the highest-performing valid XI.
- Each selected player shows the manager who drafted them and their average match rating.

## Session rivalry stats

- Replaying from the same room now keeps a running session record across completed drafts.
- The Session tab tracks:
  - titles won;
  - league W/D/L;
  - goals for and against;
  - goal difference;
  - accumulated league points;
  - manager-vs-manager head-to-head wins, draws and goals.
- Session records reset when the room ends; they do not affect future draft or match probabilities.

## Existing v5C features retained

- I'm Out auction flow and 5-second minimum player viewing window.
- Player X of Y counter.
- Best-positional-fit Freeform lineup suggestion.
- Harsher gradual Team Balance calculation.
- 2-manager seasons: 10 matches total.
- 3-manager seasons: 12 matches total.
- 4+ managers: standard home-and-away league schedule.

## GitHub update from v5C

Replace these files:

- `server.js`
- `public/app.js`
- `public/style.css`
- `data/allTimePremSimulation.js`
- `README.md` (optional, but recommended)

Leave these unchanged:

- `data/players.js`
- `public/index.html`
- `package.json`

Railway should redeploy automatically after the GitHub commits.
