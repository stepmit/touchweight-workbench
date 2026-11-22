# Touchweight Workbench — project briefing for Claude Code

Read this first. Deeper history is in `docs/touchweight-project-notes.md`; source material is in `reference/`.

## Who you're working with
Stephen is a professional piano technician (15 years tuning, hands-on grand regulation). He knows touchweight
theory deeply (David Stanwood, David Love, Coen van Dongen) but has **no coding experience**. So:
- Explain in plain language, not code jargon. Do the git, npm, build and deploy steps yourself and say what you did.
- Make small changes, then tell him exactly what to look at on screen to check them.
- Ask him about piano-domain questions; never guess physics or regulation practice.
- Always run `npm run build` after changes and report whether it succeeded.

## What this is
A single-page React app (Vite + Recharts) for piano touchweight analysis. It combines two methods on one
unified per-note data model (88 notes):
- **Love's method**: measure downweight (DW) and upweight (UW) per key, record the key's original front weight (lead in the front of the key)
  (Orig FW), and correct by delta. BW = (DW+UW)/2, Friction = (DW−UW)/2, Delta = BW − Target BW, New FW = Orig FW + Delta.
- **Stanwood's Equation of Balance** (What-If tab): `FW = (SW × Action Ratio) + (Key Ratio × Wippen Weight) − Target BW`.
  Key Ratio and Wippen Weight are separate inputs (they were once a single lumped "Wippen BW"; that was a bug).

Companion spreadsheet (`reference/Touchweight_calculator_template_final_master.xlsx`) is Stephen's own evolving
Excel/Sheets workbook built on David Love's template. The app is meant to mirror its logic. If app and sheet
disagree, ask Stephen which is right.

## Files
- `src/App.jsx` — the whole app (~950 lines, single file by design). Data constants at top, then geometry, tokens,
  math, global CSS (`GlobalStyle`), small components, `TouchweightWorkbench` main component at the bottom.
- `src/main.jsx` — entry point. Also installs a **`window.storage` polyfill backed by localStorage**. The app was
  first written as a Claude.ai artifact, whose storage API is `window.storage.get/set`; the polyfill keeps the
  Piano Library working standalone. Keep `App.jsx` calling `window.storage`, don't rewrite it.
- `public/` — PWA manifest and icons (180/192/512 px PNG, brass piano-key icon on dark ebony).
- `index.html` — iOS "Add to Home Screen" meta tags. `vite.config.js` sets `base: './'` (relative paths so it works at any URL).
- `reference/` — Stephen's xlsx, the Gravagne PDF, and the Stanwood strike-weight graph he wants the chart to resemble.

## How to run
```
npm install
npm run dev      # local preview, auto-reloads
npm run build    # production build into dist/
```
**Current deployment (since 2026-11-22): GitHub Pages** at https://stepmit.github.io/touchweight-workbench/ (public repo
`stepmit/touchweight-workbench`; `reference/` is gitignored so his xlsx and the Gravagne PDF are never published).
To publish an update: commit/push source to `main`, then run `./publish.sh` (builds and pushes `dist/` to the `gh-pages`
branch). The `gh` CLI lives at `.tools/gh` (gitignored, not on PATH); it is logged in as `stepmit`.
Earlier history: Stephen dragged the built `dist/` contents onto **Netlify Drop** (app.netlify.com/drop) and added
it to his iPhone/iPad home screen. **Live-device testing of that deployment has not been confirmed yet** — ask him
whether it worked. Why standalone: published Claude artifacts demanded a Claude login when launched from a home-screen
icon, so a Claude-independent copy was the fix. Better long-term hosting (own Netlify account, or GitHub Pages) is an option.

## Architecture details worth knowing
- State lives in the main component: `notesData` = 88 × `{sw, dw, uw, origFW}`; plus `targetBW`, `actionRatio`,
  `fwBuffer` (FW Max %), `wippenWeight`, `keyRatio`. Everything else is derived in the `rows` useMemo.
- **The app starts empty on purpose.** Demo data (`DEFAULT_SW`) is loaded only by the "Load demo SW curve" button.
  Silently seeding it earlier confused Stephen (looked like his own data).
- `quadFit` is a closed-form quadratic least-squares fit (Cramer's rule), same as the spreadsheet. It needs ≥3 points,
  so `rows` returns `null` for smoothed values until `fit.n >= 3`. Don't remove that guard (it produced fake zeros).
- Charts: Strike Weight Design (13 Stanwood reference curves, muted gray; HIGH/MEDIUM/LOW labels drawn *inside* the
  plot via a Recharts `<Customized>` overlay pinned at note 3; brass smoothed curve; measured-SW dots) and a Front Weight
  chart merging both methods. Charts never move when switching modes; only the panel below swaps.
- **Deviation colouring** (mirrors his spreadsheet's conditional formatting): |measured SW − smoothed| < 0.3 g green,
  0.3 to <0.5 g orange, ≥ 0.5 g red. Applied to chart dots, the tooltip (signed diff), and keyboard SW dots. Helper: `deviationColor`.
- Panels: **What-If (Stanwood)** has Action Ratio, FW Max Buffer, Wippen Weight, Key Ratio, an Effective Wippen Weight
  read-out, and a collapsible *Action Ratio calculator* (Love's method: BW, add 5 g to SW, remeasure, ΔBW ÷ 5, average
  3 notes, "Apply" button). **FW Modification (Love)** has the DW/UW/Orig FW/Delta/New FW table and a collapsible
  *Landmark SW Samples* section (note 1 + all Cs + all Gs = 16 notes; preset FW target = FW Max ceiling × FW Max %;
  entered SW writes into the same `notesData` that drives the curve fit).
- **Piano Library** (collapsed panel under the top bar): save named snapshots (all notes + settings) to storage,
  load/delete, export/import `.json` files. JSON export is the safe long-term backup.
- Sticky keyboard at the bottom: white keys numbered just below the black keys; note 1 and all Cs and Gs in copper
  (landmark notes); display-field toggles (SW/DW/UW/Orig FW); an Input Mode switch (read-only when off); editor bar.

## Gotchas that already bit us
1. The root `.tw-shell` sets light cream text for the dark theme. Any light "paper" panel or table **must set its own
   dark text colour** (`C.ink`), otherwise text is invisible. This hid whole table columns once.
2. Design tokens are in the `C` object near the top (ebony shell, paper, brass, copper, felt, plum, warnOrange, warnRed).
   Fonts: Fraunces (display), IBM Plex Sans/Mono, loaded via a Google Fonts `@import` — **needs internet; not offline-safe yet**.
3. Keep numbers short and legible on the keyboard; Stephen found numbering every key too busy.

## Open questions for Stephen (don't decide these alone)
- Should the FW Modification table list all 88 notes with blanks, or only notes with data (currently only notes with data)?
- Is "16 landmark notes" (note 1, all Cs, all Gs) exactly Love's practice, or does he skip some extreme bass/treble notes?
- Should the Action Ratio calculator and Landmark section have matching open/closed defaults?
- Rename the "Action Ratio" field? From Gravagne's PDF it behaves more like his *Mass Action Ratio* than the pure geometric
  *Distance Action Ratio*; a tooltip or relabel was flagged but not done.
- Stephen said he has "more ideas" for the app; ask what they are.

## Possible future work (flagged, not requested)
Offline support (service worker, self-hosted fonts); Gravagne's inertia math / "Magic Line" geometry check as a
diagnostics layer; reading/writing his actual spreadsheet files; sharing with colleagues on a private forum
(a shared-library idea was floated; he hasn't decided).
