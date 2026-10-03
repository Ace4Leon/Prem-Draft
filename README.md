# Prem Draft

A simple real-time multiplayer Premier League all-time auction draft.

## Features
- Room code + shareable invite link
- 2+ managers
- £100m starting budget
- Formation selection before the draft
- Position-aware player pool with one extra player per required position
- 15-second auction timer
- Any bid under 10 seconds resets timer to 10
- Default bid is current bid + £1m, with +£2m, +£5m and custom options
- Budget protection reserves £1m for each remaining squad slot
- Mandatory-position logic when remaining supply equals remaining demand
- Live team/budget views
- Play again flow
- Mobile-first layout

## Run locally
1. Install Node.js 18+.
2. In this folder run:
   npm install
   npm start
3. Open http://localhost:3000

To test multiplayer locally, open the site in two browser windows and join the same room.

## Put it online
Deploy this folder to any Node hosting service that supports WebSockets (for example Render, Railway, Fly.io, or a small VPS). The app uses Socket.IO, so both players must connect to the same running server.

## Notes on forced bidding
If a manager still needs a position and the number of remaining eligible players for that position is no greater than the remaining demand, that manager is marked as required. If nobody bids before time expires, the server assigns the player for £1m to a required manager so the draft cannot deadlock.

The included player database is deliberately a first-pass functional set and can be expanded later without changing the core game logic.
