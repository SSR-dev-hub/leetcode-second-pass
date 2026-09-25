# Rebuilding "LeetCode Second Pass" in Your Own Hatch

This guide lets any Muse user recreate this app 1-to-1 (functionally) as a
**private** artifact inside their own Hatch account. Nothing here shares data
between accounts — you get your own empty copy and wire up your own LeetCode
cookie.

**What the app is:** a private spaced-repetition tracker for LeetCode
interview prep. Add problems by number, take notes, paste your solutions, and
get reminded what to review each day on an FSRS schedule.

---

## The fast path: paste this into your Muse

Copy everything between the lines and send it as one message to your own
Muse. It will build the app for you as a private artifact in your Library.

---

> Build me a private full-stack web app called **LeetCode Second Pass**.
>
> **Purpose:** LeetCode spaced-repetition review tracker with multiple
> profiles (e.g. one per person preparing for interviews).
>
> **Scheduling:** Use FSRS-6 server-side with ~90% target retention, no user
> tuning knobs. Ratings per review: Again, Hard, Good, Easy, Off.
> - Problems with no rating yet stay out of the Today queue and Calendar
>   until first rated.
> - Rating Off removes the problem from rotation entirely.
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
> **Notes/editors:**
> - Rich, indefinitely-expanding editors only for "Notes: Optimal solution"
>   and "Notes: Brute force solution".
> - All other multiline fields keep a ~4-line cap with internal scrolling.
> - Auto-save is debounced and flushes on blur/navigation.
>
> **Profiles & settings:**
> - Profile and Settings are merged into one screen: profile switching,
>   appearance, default-profile controls.
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
> **LeetCode integration (unofficial):**
> - "Add by number" autofills title, difficulty, topics/tags from LeetCode's
>   public endpoints (no login needed).
> - Optional per-profile `LEETCODE_SESSION` cookie enables accepted-submission
>   sync: one-way, merge-only, profile-scoped. Insert-only for new
>   submissions; never touch the user's notes, ratings, schedules, FSRS
>   state, review history, preferred submission, or video URLs. Dedupe
>   accepted submissions and display as `#1`, `#2`, etc.
> - In the Add dialog, warn if the session cookie is missing or invalid, so
>   the user knows the add will come without their submission history.
> - In Settings, the LeetCode session section explains in plain language
>   what the session powers (submission sync only) and what works without it
>   (everything else).
> - Video links open canonical playable YouTube watch URLs, never `/embed/`.
>   User-entered (custom/manual) video URLs are protected from automatic
>   replacement.
>
> **Explainer video discovery:**
> - Each profile has a "video channel" setting (YouTube channel URL),
>   defaulting to `https://www.youtube.com/@NeetCode/videos`.
> - New problems that arrive without a video link are looked up against that
>   profile's channel catalog (fetch and cache each channel's catalog
>   separately).
> - Changing the channel preference must NEVER alter existing data — no
>   re-matching or reconciling of old videos, ever. Forward-only.
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

## Notes & caveats

- **Expect a few polish rounds.** The original was refined over hours of
  visual feedback ("move that, shrink this"). The spec above reproduces all
  behavior; exact spacing/densities may need your eye.
- **LeetCode's APIs are unofficial.** Cookie sync and metadata autofill can
  break if LeetCode changes things — the app degrades to a manual tracker.
- **Your data is yours alone.** This repo's standalone server has no auth;
  run it on localhost or behind your own access control.
- The standalone server build here degrades automatic YouTube catalog
  fetching (it originally used a hosted AI task); inside Hatch the full
  behavior works.
