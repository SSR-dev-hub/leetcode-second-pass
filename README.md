# LeetCode Second Pass

A spaced-repetition study app for LeetCode interview prep. Add problems by
number, write notes (intuition, learnings, optimal / brute-force solutions,
edge cases, complexity), rate each review (Again / Hard / Good / Easy / Off),
and the app schedules the next review with **FSRS** targeting about **90%
retention**.

This is a fully standalone build: a React + TypeScript client and a Node
server that serves the client and a same-origin `POST /actions` API, backed
by a local SQLite database. No platform, account, or cloud service required.

## Features

- **Spaced learning with FSRS** — every Again/Hard/Good/Easy rating updates
  a per-problem memory model (stability, difficulty, retrievability); target
  retention ≈ 0.9. "Off" stops scheduling; any recall rating restarts it.
- **Today queue** — Past due + Due today sections; click a next-review date
  to override it without changing the rating or history.
- **Library** — sort by Number (default), Title A–Z, or Review date; filter
  by difficulty and rating state; company tags per problem.
- **LeetCode autofill** — title, difficulty, topics, and Blind 75 / NeetCode
  150 / Grind 169 membership are filled in from public LeetCode data. No
  cookie needed for this.
- **Cookie sync** — optionally save a per-profile `LEETCODE_SESSION` cookie
  to import your accepted problems and accepted submissions; the best
  (fastest runtime) submission is picked automatically and you can choose a
  preferred one. The cookie is validated and its status is shown in the UI.
- **Per-profile YouTube channel** — each profile configures a preferred
  explainer channel (default `https://www.youtube.com/@NeetCode/videos`);
  the channel applies only to newly added problems that have no video yet.
  You can always paste a video URL manually.
- **Image notes** — paste images into the Optimal / Brute-force editors;
  images are stored locally and served by the app.
- **Profiles** — multiple study profiles with separate libraries, cookies,
  and channels; names are editable, deletion removes all associated data.
  First launch creates an empty **"Profile 1"**.
- **Light / dark / system theme**, collapsible sidebar, mobile layout.

## Requirements

- **Node.js 20+** (Node 22+ recommended)

## Install and run

```bash
npm install
npm run build
npm start
```

Then open **http://localhost:3000**.

- `npm start` runs migrations and seeds an empty "Profile 1" on first run.
  Data lives in `./data` (`app.db` + uploaded note images); it is created
  automatically and is git-ignored.
- `PORT=8080 npm start` to listen on another port.
- `DATA_DIR=/path/to/data npm start` to keep the database elsewhere.

## Development

```bash
npm run dev            # server (tsx watch) + client (vite) together
npm run dev:server     # API only, http://localhost:3000
npm run dev:client     # Vite dev server, http://localhost:5173 (proxies /actions and /blobs to the API)
npm run typecheck      # tsc for server and client
npm run build          # compile server + bundle client into client/dist
```

## Architecture

```
client/          React 19 + Vite + Tailwind CSS 4 + TanStack Query
  src/api.ts     Typed RPC client: api.<action>(args) -> POST ./actions
server/          Node + Express, TypeScript compiled to server/dist
  src/index.ts   HTTP server: POST /actions, /blobs/*, static client
  src/actions.ts Action implementations (drizzle-orm queries, FSRS, LeetCode API)
  src/db.ts      SQLite open + drizzle migrations + "Profile 1" seed
  src/blobs.ts   Filesystem blob store for note images
  src/sdk-shim.ts Local stand-ins for the platform SDK surface the code was written against
drizzle/         SQLite migrations applied in order on every boot
data/            Runtime database + uploads (git-ignored)
```

The client and server share action type definitions (`client/src/api.ts`
imports the type of `server/src/actions.ts`), so action names and
request/response shapes stay in sync at compile time.

## Known limitations

- **Automatic YouTube video discovery is unavailable in this build.** The
  original implementation asked a hosted agent to compile a channel's video
  catalog; there is no equivalent in a plain Node server, so catalog lookups
  are marked failed instead of hanging, and the UI invites you to paste a
  video URL manually. Channel preference, manual URLs, and per-profile
  channels all work normally. (`server/src/sdk-shim.ts` documents the seam.)
- The personal Notion-import action from the original app was removed; it
  was hard-coded to one user's private dataset.

## Security note

This app has **no authentication**: anyone who can reach the server over the
network can read and change everything in it (problems, notes, cookies,
profiles). Run it on `localhost`, or host it on a private network / behind a
reverse proxy with access control if you need remote access. The LeetCode
session cookie is stored in the local SQLite database in plaintext — treat
`data/app.db` like a credential store.
