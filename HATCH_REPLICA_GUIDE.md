# Rebuilding "LeetCode Second Pass" in Your Own Hatch

This guide lets any Muse user get this app 1-to-1 (functionally) as a
**private** artifact inside their own Hatch account. Nothing here shares data
between accounts — you get your own empty copy and wire up your own LeetCode
cookie.

**What the app is:** a private spaced-repetition tracker for LeetCode
interview prep. Add problems by number, take notes, paste your solutions, and
get reminded what to review each day on an FSRS schedule.

---

## Path A: clone and adapt (recommended)

This repo already contains the complete, working app — no need to rebuild it
from a description. Another Muse user can turn it into a private Hatch
artifact with one message:

> Clone https://github.com/SSR-dev-hub/leetcode-second-pass and build it as
> a private full-stack artifact in my Hatch Library. It's a React + TypeScript
> server codebase already; adapt the standalone server shims back to the
> Hatch platform (the seam map is in `server/src/sdk-shim.ts`), keep every
> feature and behavior, seed no demo data and no pre-made profiles, and hand
> it over as my own private artifact.

**What their Muse needs to do (the adaptation):** the standalone server
replaced four Hatch platform primitives, all documented in
`server/src/sdk-shim.ts` — that file is the porting map, just reverse it:

- `db.ts` (better-sqlite3 + drizzle, migrations `0001`–`0015` run on boot)
  → the platform database; the `schema.ts` tables carry over as-is.
- `blobs.ts` (`data/blobs/` filesystem store for note images) → the
  platform blob store.
- `ctx.agent.spawnTask` (stubbed to `{ok: false}`) → the real hosted agent
  task — this restores automatic YouTube channel-catalog fetching natively
  (see "YouTube video discovery" below).
- `ctx.invalidateQueries()` (no-op) → the platform query invalidation.
- Client: `client/src/App.tsx` and `theme.css` carry over unchanged;
  `client/src/sdk-shim.ts` goes back to the real action client; the client
  already talks to same-origin `POST /actions`.
- The personal Notion-import action was deliberately excluded from this
  repo — nothing to port there.

Everything else — FSRS scheduling, profiles, pages, cookie sync, per-profile
video channels — works exactly as in the original, because it *is* the
original code.

---

## Path B: rebuild from the spec

If you'd rather have your Muse build it fresh (e.g. you want to reshape it
as it goes), paste the message below. Expect a few polish rounds — the
original was refined over hours of visual feedback.

---

> Build me a private full-stack web app called **LeetCode Second Pass**.
>
> **Purpose:** LeetCode spaced-repetition review tracker with multiple
> profiles (e.g. one per person preparing for interviews).
>
> **Scheduling:** Use FSRS-6 server-side with ~90% target retention, no user
> tuning knobs. Include a help dialog that briefly explains how FSRS
> scheduling works. Ratings per review: Again, Hard, Good, Easy, Off.
> - Problems with no rating yet stay out of the Today queue and Calendar
>   until first rated.
> - Rating Off removes the problem from rotation entirely (status "done").
> - A per-problem "spaced learning" toggle moves it back into rotation.
> - Overdue problems stay queued — nothing changes (no rating/history
>   mutation) until the user actually reviews them.
> - The `Next review: <date>` display is clickable: it lets the user override
>   only the due date, without touching rating, review history, difficulty,
>   stability, repetitions, or last-reviewed state.
>
> **Pages:** Today, Library, Calendar, Add dialog, Settings.
> - **Today:** compact list rows (same style as Library), split into
>   **Past due** and **Due today** sections with counts; hide a section when
>   empty. Rating a problem advances to the next due problem; after the last
>   one the queue closes.
> - **Library:** compact dense rows showing short due dates (e.g. `Aug 30`).
>   Default sort ascending by problem number; also offer Title A–Z and Review
>   date (soonest first, unscheduled last). Search + filters (difficulty,
>   company tags, lists) narrow the visible set.
> - **Calendar:** dates open the full due list for that date; same-day
>   navigation is ascending problem number.
> - **Problem details:** chevron navigation `‹ PROBLEM 121 ›` that follows the
>   current Library visible ordering.
> - **Mobile:** hide intuition previews and the Company filter.
>
> **Notes/editors:** per-problem fields are Intuition, Learnings, Optimal
> solution, Brute force solution, edge cases, and time/space complexity.
> - Rich, indefinitely-expanding editors only for "Notes: Optimal solution"
>   and "Notes: Brute force solution".
> - All other multiline fields keep a ~4-line cap with internal scrolling.
> - Note images can be attached inside the two rich editors.
> - Auto-save is debounced and flushes on blur/navigation.
>
> **Profiles & settings:**
> - Profile and Settings are merged into one screen: profile switching,
>   appearance (light/dark theme toggle), default-profile controls.
> - On launch with no profiles, ask the user to name their first profile
>   (no pre-seeded profiles).
> - Profile names are editable; deleting a profile deletes all its data after
>   a confirmation.
> - Per-device default profile: the profile picked at launch becomes this
>   device's default; later launches go straight in; Settings can change the
>   default or restore "Ask me every time".
> - The old top profile/theme row on mobile is removed; profile navigation
>   sits at the bottom.
>
> **Lists & metadata:**
> - Progress lists: Blind 75, NeetCode 150, Grind 169.
> - Company tags are read-only metadata, searchable/filterable in Library.
>
> **Problem sources:**
> - "Add by number" autofills title, difficulty, topics/tags from LeetCode's
>   public endpoints (no login needed).
> - Optional per-profile `LEETCODE_SESSION` cookie enables accepted-submission
>   sync: one-way, merge-only, profile-scoped. Insert-only for new
>   submissions; never touch the user's notes, ratings, schedules, FSRS
>   state, review history, preferred submission, or video URLs. Dedupe
>   accepted submissions and display as `#1`, `#2`, etc. The cookie is stored
>   server-side, shown masked, with replace/clear controls.
> - Notion CSV export import with this field mapping: Intuition→Intuition,
>   "At Every Step"→Learnings, Solution 1/2→accepted submissions #1/#2,
>   Video→custom video URL; status "Spaced Learning" maps My Level
>   Easy/ok→Easy, Medium→Good, Hard→Hard (review dates start at import day +
>   "Repeat After (Days)", default 10); status "Done"→Off.
> - In the Add dialog, warn if the session cookie is missing or invalid, so
>   the user knows the add will come without their submission history.
> - In Settings, the LeetCode session section explains in plain language
>   what the session powers (submission sync only) and what works without it
>   (everything else).
>
> **Explainer video discovery:**
> - Each profile has a "video channel" setting (YouTube channel URL),
>   defaulting to `https://www.youtube.com/@NeetCode/videos`.
> - New problems that arrive without a video link are queued for lookup
>   against that profile's channel catalog; show the lookup status
>   (pending/found/failed) and always offer a "paste your own YouTube URL"
>   fallback. Video links open canonical playable YouTube watch URLs, never
>   `/embed/`. User-entered (custom/manual) video URLs are protected from
>   automatic replacement.
> - Changing the channel preference must NEVER alter existing data — no
>   re-matching or reconciling of old videos, ever. Forward-only.
> - Implementation: compile each channel's full uploaded-video catalog once
>   (channel Videos tab, exhaustively), cache it per (profile, channel), and
>   match new problems by normalized title plus "LeetCode #N" number hints in
>   video titles; only fill the video when the problem has none. See the
>   repo's HATCH_REPLICA_GUIDE.md "YouTube video discovery — how it works"
>   for the exact state machine.
>
> **Data model:** profiles; problems (slug, number, title, difficulty,
> topics, lists, company tags); per-profile notes (intuition, learnings,
> optimal/brute-force solutions, images); accepted submissions; review
> history; per-profile FSRS state; per-profile video-channel preference and
> channel catalog cache; user video URLs.
>
> Build it, verify the action layer (add-by-number, review rating flow,
> profile CRUD), and hand it over as a private artifact.

---

## After it builds: verify with this checklist

1. Add problem #1 by number → title "Two Sum" autofills, no submissions
   without a cookie.
2. Open it → Intuition / Learnings / Optimal / Brute-force notes save and
   persist across reloads.
3. Rate it Good → it leaves Today and gets a future next-review date.
4. Rate another problem Off → it disappears from rotation.
5. Library sorts: Number ascending is default; try Title A–Z.
6. Today shows Past due / Due today sections with counts.
7. Add a second profile → data is fully separate per profile.
8. Rename a profile; delete a test profile (confirm data is gone).
9. Paste a LeetCode session cookie in Settings → sync pulls accepted
   submissions as `#1`, `#2` without touching your notes.
10. Remove all profiles → relaunch asks you to name a new profile.
11. Add a problem without a video → it gets queued, matched from the channel
    catalog, and shows the video; problems where no match exists show a
    manual-paste fallback.

## YouTube video discovery — how it works

This is the one subsystem with a real implementation seam, so here is exactly
how the Hatch version does it and how to make it work outside Hatch. (On
**Path A** above, the agent-based fetch works natively — nothing manual
needed.)

### Behavior contract (both versions)

- Only problems that arrive **without** a video link enter the lookup queue
  (`video_lookup_queue`, status `pending`). Problems that already have a
  video — auto-matched or user-entered — are never touched again.
- Each profile has its own `video_channel_url` (default
  `https://www.youtube.com/@NeetCode/videos`). Catalogs are cached per
  **(profile, channel)** in `profile_video_catalog`, with a state row in
  `profile_video_catalog_state`: `pending` → `ready` / `failed`.
- Matching (`matchCatalogVideo`): normalize the problem title; a catalog
  video matches if its normalized title contains the problem title AND any
  "leetcode #N" / "lc N" number in the video title equals the problem number
  (a wrong number vetoes the match). Scoring prefers exact title matches,
  then title-prefix matches, with a bonus when the number matches.
- The match only fills `neetCodeVideoUrl` when it is currently NULL —
  custom/manual URLs are never overwritten. Matched rows set
  `videoSource = 'catalog'`, `videoLookupStatus = 'found'`.
- If the catalog fetch can't run, state goes to `failed` (never stuck on
  `pending`) and the UI shows "Automatic lookup did not finish. You can paste
  a YouTube URL here."
- Switching a profile's channel preference never re-matches anything —
  forward-only by design.

### In Hatch (for the rebuilding assistant)

The catalog fetch and the per-problem fallback search are performed by a
hosted agent task (`ctx.agent.spawnTask`):

1. `requestVideoResolution` queues the problems, then claims the
   (profile, channel) state row as `pending` and spawns **one** task with the
   `catalogFetchMessage`: "Fetch the complete uploaded-video catalog from
   the exact YouTube channel URL … Use the channel's Videos tab and continue
   through every page/batch until exhausted … Call `saveNeetcodeVideoCatalog`
   exactly once with `{profileId, channelUrl, videos: [{title, url}]}`.
   Preserve each exact title and exact YouTube watch URL; do not construct
   or guess URLs."
2. `saveNeetcodeVideoCatalog` validates/normalizes every URL to a canonical
   `https://www.youtube.com/watch?v=…`, wipes the old catalog for that
   (profile, channel), inserts the new rows (chunks of 200), marks state
   `ready`, then immediately runs `applyCatalogMatches` against everything
   still in the queue.
3. Anything still unmatched goes to fallback tasks in batches of 25
   (`fallbackVideoLookupMessage`): an individual search *within that exact
   channel on YouTube only*, accepting only a real returned URL that clearly
   matches, else `null`. Results go through `saveNeetcodeVideos`, which again
   only fills NULL video fields and marks `found`/`not_found`.

### Outside Hatch (this repo's standalone server)

`ctx.agent.spawnTask` has no standalone equivalent — the shim returns
`{ok: false}`, so the catalog goes to `failed` and matching never runs. To
restore it, populate the catalog yourself; everything downstream (matching,
queue draining, UI states) already works unchanged:

**Option A — YouTube Data API v3 (recommended, free quota):**

1. Create an API key at console.cloud.google.com → enable *YouTube Data
   API v3*.
2. Resolve the channel handle to its uploads playlist:
   `GET https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=NeetCode&key=KEY`
   → `contentDetails.relatedPlaylists.uploads`.
3. Page through
   `playlistItems?part=snippet&playlistId=<uploads>&maxResults=50&key=KEY`
   collecting `snippet.title` and
   `https://www.youtube.com/watch?v=<snippet.resourceId.videoId>` for each
   item (up to ~5000 videos; the action accepts max 5000).
4. Save to `videos.json` as `[{"title": "...", "url": "..."}, …]`, find your
   profile id (it's `1` on a fresh DB — check the `profiles` table), then:

```bash
curl -s http://localhost:3000/actions \
  -H 'Content-Type: application/json' \
  -d @- <<'EOF' | head -c 300
{
  "action": "saveNeetcodeVideoCatalog",
  "args": {
    "profileId": 1,
    "channelUrl": "https://www.youtube.com/@NeetCode/videos",
    "videos": []
  }
}
EOF
```

   (Build the real payload with a small script — e.g. python/jq merging
   `videos.json` into `args.videos`.) The response
   `{"data": {"cached": N, "matched": M, "fallbackQueued": K}}` confirms it;
   state flips to `ready` and every queued problem is matched immediately.
   From then on, new problems without videos are matched automatically by
   the built-in scorer — no agent needed. Repeat per profile/channel.

**Option B — manual list:** hand-compile `[{title, url}]` for the videos you
care about and POST the same action. The matcher only needs the videos your
problems will actually hit.

Unmatched problems in standalone show the manual-paste fallback (the
per-problem agent search has no equivalent) — paste the URL once and it's
protected forever.

## Notes & caveats

- **Expect a few polish rounds on Path B.** The from-scratch rebuild was
  refined over hours of visual feedback ("move that, shrink this"). Path A
  (clone + adapt) skips this entirely — it's the same code.
- **LeetCode's APIs are unofficial.** Cookie sync and metadata autofill can
  break if LeetCode changes things — the app degrades to a manual tracker.
- **Your data is yours alone.** This repo's standalone server has no auth;
  run it on localhost or behind your own access control.
- Automatic YouTube catalog fetching is the one degraded feature in the
  standalone build — see "YouTube video discovery — how it works" above to
  restore it.
