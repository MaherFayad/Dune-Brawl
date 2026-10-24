# Hosting Dune Brawl for online play

The game is a static site: no server of ours runs during a match. Players connect peer to peer over WebRTC with rollback netcode (`game/net.js`); PeerJS's free public server only introduces the two browsers. Hosting is free on Cloudflare Pages.

## Put it online (Cloudflare Pages, free)

1. In the Cloudflare dashboard open **Workers & Pages**, then **Create**, **Pages**, **Connect to Git**.
2. Authorize GitHub if asked and pick `MaherFayad/Dune-Brawl`.
3. Project name: `dune-brawl` (it becomes `dune-brawl.pages.dev`; it cannot be renamed later).
4. Production branch: `claude/stoic-fermi-2kmq0z` (or `main` once this branch is merged).
5. Framework preset **None**, build command **empty**, build output directory **`/`**.
6. **Save and Deploy.** Every push to that branch redeploys in about a minute.

Without Git, from a terminal in the repo: `npx wrangler pages deploy . --project-name dune-brawl`.

### If Cloudflare shows the Workers form instead (Build command / Deploy command)

Cloudflare now often routes new Git projects to Workers. The repo has a `wrangler.jsonc` for that, so use:

| Field | Value |
|---|---|
| Build command | leave empty |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command (preview) | `npx wrangler versions upload` |
| Root directory | `/` |

`.assetsignore` keeps `.git`, `tests`, `tools` and the config out of the site (checked: they return 404). The game is served at `/game/`, and invite links keep their `?join=` code through the redirect.

### Preview on your own computer

From the repo folder, either `python3 -m http.server 8000` and open `http://localhost:8000/`, or `npx wrangler dev` and open `http://localhost:8787/`. To test online play locally, open the game in two browser windows: host in one, paste the link in the other.

Free plan limits that matter: 20,000 files and 25 MiB per file (the repo is about 650 files, largest 3 MB).

## Play with a friend

1. Open the site, pick your fighter in the **Player 1** row, press **Online**, then **Host a room**.
2. Press **Copy link** and send it. Your friend opens it, picks a fighter in their Player 1 row and presses **Join**. (Or they press Online and type the 5 letter code.)
3. The match starts on both screens. The host plays on the left. Bottom left shows the ping. Esc leaves.
4. After a match, either player presses jump or light to rematch.

Controls: WASD or arrows to move and aim, Space to jump, J light, K heavy (hold to charge, Up + K recovers), L or Shift dodge (with a direction on the ground: dash). A gamepad works too.

## If it does not connect

- **"No room"**: check the code; the host must keep their tab open.
- **Stuck on "Connecting" or "Loading the match"**: one of you is on a strict network (some mobile hotspots and carrier NATs block direct connections). Try home Wi-Fi, or add a TURN relay in `game/net-config.js` (free tiers exist, for example Cloudflare Realtime TURN or Metered).
- **"Different version"**: one of you has an old copy cached. Both refresh.
- **"OUT OF SYNC"** in red bottom left: report it with the frame number; the two games diverged, which the netcode tests are meant to prevent.

## How the netcode works

Each side plays its own input 2 frames late and predicts the friend's input (their last one). When the real input arrives and differs, the game rewinds to that frame and replays up to now, invisibly. Inputs are sent 8 at a time so a lost packet costs nothing, the sides slow down slightly if one runs ahead, and every second both compare a hash of the game state. `node tests/netcode.js` runs two peers over simulated lag (up to 170 ms) and 10 to 20 percent packet loss and checks they end identical to an offline replay.
