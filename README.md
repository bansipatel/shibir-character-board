# Shibir Character Board

Jeopardy-style admin/viewer dashboard for the character-reveal segment. Admin
taps a tile → viewer highlights/zooms into it. Admin taps again → the
quote/fact reveals on the viewer (LED panels).

## How it works

- `index.html` — landing page, set a room code, links to Admin/Viewer.
- `admin.html` — control screen (host-facing). Tap a name once to focus it
  (others dim), tap it again to open the full reveal card with its quote,
  tap the dark backdrop to reset the whole board.
- `viewer.html` — display screen for the LED panels. Mirrors whatever the
  admin selects in real time. Not clickable — display only.
- `assets/data.js` — the character list, grouped by category, with each
  name's quote.
- `assets/board.js` — shared renderer for the fixed 1920x1080 "stage" (scales
  to fit any screen size) used by both Admin and Viewer.
- `assets/style.css` — the visual theme (fonts, colors, reveal card) shared
  by every page.

### Adding portrait photos

The reveal card has a portrait slot next to the name/quote. It looks for an
image at `assets/portraits/<name-slug>.<ext>` — lowercase, spaces → hyphens
(e.g. `Bhagwan Krishna` → `bhagwan-krishna`), trying `.jpg`, `.jpeg`, `.png`,
then `.webp` in that order, so whatever format you save the photo in just
works. If none of those exist, it falls back to the person's initials in
the color already assigned to their name on the board — no code changes
needed, just drop matching image files into `assets/portraits/`.

## Two ways it syncs

You told me Admin and Viewer will run on **two separate devices on the same
network**, so this is built around that — but it also works with zero setup
on one machine, which is the fastest way to rehearse the flow:

1. **Local demo mode (default, zero setup)** — if `assets/firebase-config.js`
   is left with its placeholder values, Admin and Viewer sync via
   `BroadcastChannel`/`localStorage`. This only works between tabs/windows
   on the **same computer**, but it's perfect for building and rehearsing
   the show flow right now.

2. **Network mode (for the actual two-device setup)** — fill in a free
   Firebase Realtime Database config (below) and both devices sync over
   wifi/internet automatically. No code changes needed — the app detects
   the config and switches over.

## Setting up Firebase (~5 minutes, free)

1. Go to https://console.firebase.google.com → **Add project** → give it any
   name → you can skip Google Analytics.
2. In the left sidebar: **Build → Realtime Database → Create Database** →
   pick any region → start in **test mode** (fine for a short-lived event;
   see note below).
3. In the left sidebar: **Project settings** (gear icon) → scroll to
   **Your apps** → click the **</>** (web) icon → register an app (no
   hosting needed) → copy the `firebaseConfig` object it shows you.
4. Paste those values into `assets/firebase-config.js` in this project,
   replacing the placeholders (`apiKey`, `authDomain`, `databaseURL`,
   `projectId`).
5. Reload Admin and Viewer — the connection badge in the top-right should
   switch from "local" to "network".

**Test-mode note:** Realtime Database test mode leaves the database open to
anyone with the URL for 30 days, which is fine for a short rehearsal-to-event
window with low-stakes data (just character IDs and a stage flag). If you
want it locked down, switch the rule to only allow read/write on the
`rooms/<your-room-code>` path.

## Running it locally (for rehearsal)

From this folder:

```bash
python -m http.server 8420
```

Then open `http://localhost:8420/admin.html` and
`http://localhost:8420/viewer.html` in two windows.

(Opening the HTML files directly via `file://` mostly works too, but some
browsers restrict `BroadcastChannel`/storage events on `file://` — running a
tiny local server avoids that.)

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Shibir character board"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Then in the GitHub repo: **Settings → Pages → Deploy from branch → main /
root**. Your site will be live at `https://<you>.github.io/<repo>/`.

Open `.../admin.html?room=shibir` and `.../viewer.html?room=shibir` on the
two devices (use the same room code on both — set it once from the landing
page and it's remembered in each browser).

## Recommendations for the live event

- **Don't rely on venue wifi.** Bring a small travel router or use a phone
  hotspot dedicated to just these two devices — the data transferred is
  tiny (a character id + a word), so even a weak connection is enough, but
  you want a connection *you* control.
- **Rehearse the exact flow** you described: click once (focus/zoom), let
  the hosts talk, click again (reveal). The connection badge (top-right on
  both screens) tells you at a glance if something's desynced.
- **Fullscreen the viewer** on the LED-panel device — press `F` on that page,
  or use your OS/browser's fullscreen (F11 in most browsers) so there's no
  browser chrome visible on the panels.
- **Resetting** — tap the dark backdrop behind the reveal card (or press
  `Esc` on the admin device) to clear the board between characters. Picking
  a different name while one is just focused (not yet revealed) switches
  straight to it, no reset needed.
- Have the admin device's screen mirrored/duplicated to a laptop-only view
  (not the LED feed) so the operator can watch the board while the audience
  only ever sees `viewer.html`.
