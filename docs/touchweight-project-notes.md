# Touchweight Project — Handoff Notes (v2)

Re-upload this file, plus your current master xlsx and the current touchweight-workbench.jsx,
at the start of a new conversation to restore full context in one message.

## What this project is

A "what-if" analysis system and companion web app built on top of David Love's touchweight
calculation method, using David Stanwood's Equation of Balance as the underlying physics.
Two parallel tracks: an evolving Excel/Google Sheets workbook, and a from-scratch React web
app sketch exploring a nicer, purpose-built interface for the same math.

## The Equation of Balance (core formula, verified from Stanwood's own patent language)

**BW + FW = (KR × WW) + (R × SW)**

- BW = Balance Weight, FW = Front Weight, SW = Strike Weight
- KR = Key Ratio, WW = Wippen Weight → KR×WW = Wippen Balance Weight (WBW)
- R = Action Ratio = Strike (Weight) Ratio — same quantity, Stanwood uses both names
  interchangeably in his own patent documentation. Rearranged for FW (what the spreadsheet
  actually calculates): FW = (SW × R) + WBW − BW

RESOLVED (was previously an open question): whether "true geometric Action Ratio" (~4.9-5.3
typical) and "Strike Weight Ratio" (~5-7 typical) are two distinct numbers, not just two names
for one quantity. Answer, from a full read of Nick Gravagne's 11-part PTJ series
("So, What's the Deal with Action Ratios?" 2018-2020): they ARE distinct, and Gravagne gives
precise definitions for both:
  - **DAR** (Distance Action Ratio) — pure geometry, `(blow−letoff)/(dip−aftertouch)`, or
    equivalently the radial-arms product `K·W·S / k·w·s`. No mass involved. Typically ~5:1.
  - **MAR** (Mechanical/Mass Action Ratio) — uses the *moment arms* (perpendicular lever arms,
    not the radial/diagonal ones), `(Ko·Wo·So)/(Ki·Wi·Si)`. Always numerically higher than the
    DAR for the same action (e.g. DAR 5.0 → MAR ~5.6-5.8). This is what actually governs the
    SW-to-BW leverage relationship and is the correct ratio to use for "maximum allowable SW"
    calculations.
  - **Stanwood's SR** (Strike Ratio / SR in his own equation, `SR = [(BW+FW)-(WW×KR)]/SW`) is
    neither of the above — it's a touchweight ratio that varies note-to-note by design; smoothing
    it out (via BW/FW consistency) is the point of his correction process, not a flaw.
  - Conclusion for this project: the app's "Action Ratio" field is functioning as something
    closer to Gravagne's MAR (a roughly-constant, geometry-derived multiplier used to *predict*
    SW/FW/BW relationships) than to the pure-geometric DAR. Not renamed in the UI yet — flagged
    as a possible future clarity pass (tooltip or relabel).

## Spreadsheet (user's own file, evolved past what was last delivered — always re-check
actual column layout before editing, don't assume)

- FW Modification Sheet: Love's original delta-based worksheet. Has 2 instructional text
  boxes (fragile — see Gotchas). BW target, Orig BW/Friction/Orig FW/Delta/New FW columns,
  plus his own hardcoded quadratic FW-max ceiling curve in columns N-Q (rows 9-96 = notes
  1-88): FW_max(note) = -0.00288*note^2 - 0.145*note + 41.1 (this exact fit also appears,
  legitimately, in the newer "Arlington" file below, because it's a deterministic
  least-squares fit of the same underlying data, not evidence of copying).
- What-if: B1-B4 inputs (Target BW, Action Ratio, FW Max Buffer %, Wippen BW). Row 20
  headers, rows 21-108 = notes 1-88. Core columns: Note, Measured SW, Smoothed SW (live
  quadratic regression via SUMPRODUCT/Cramer's-rule helper block — NOT LINEST, NOT
  SEQUENCE(), for cross-platform compatibility), Target FW (from Smoothed), FW Max Target
  (Buffered %), Target FW (from Measured), FW Max Ceiling (100%, linked live to FW
  Modification Sheet's Q column). User has since added their own columns beyond this
  (DW, UW at minimum) plus conditional-formatting-based outlier highlighting (orange
  0.3-<0.5g / red >=0.5g deviation), self-implemented via walkthroughs rather than built
  directly.
- Charts / Stanwood strike weights: 13 Stanwood curves, all visible, with 1/5/9/13 (the
  zone-boundary curves: Bottom Low/Top Low/Top medium/Top High) highlighted.

## Gotchas for future spreadsheet edits (still apply)

1. Always re-upload the current version first.
2. openpyxl AND LibreOffice's recalc.py both silently drop freeform text boxes on save — fix
   is always the LAST step: zip-inject the original drawing1.xml back in, validate with
   ElementTree, never touch the file again after that.
3. LibreOffice recalc can leave an appended chart series with an EMPTY data cache
   (ptCount val="0") — invisible to Excel/LibreOffice but breaks Google Sheets rendering.
   Patch caches manually if a new series doesn't show up in Sheets.
4. Custom dash styles (e.g. sysDash) can fail to import in Google Sheets — keep lines solid.
5. Google Sheets' xlsx chart import is generally less reliable than Excel/LibreOffice for
   anything hand-built via openpyxl.
6. Hiding columns removes them from charts in every spreadsheet app — narrowing column width
   instead is the safe declutter method that doesn't break chart refs.

## A second, separate David Love document: "The Front Weight Foundation" (Arlington PTG
convention, 2026) — CONFIRMED GENUINE by the user directly

PDF + companion xlsx (Touchweight_Metrology_2026_Excel_Template_-_Arlington.xlsx). Initially
flagged by Claude as possibly fabricated (matching curve-fit coefficients seemed suspicious).
This was a reasoning error — a quadratic least-squares fit of the same data always produces
the same coefficients regardless of who calculates it. User confirmed the file is genuinely
David Love's, posted to the PTG forum. Error acknowledged and corrected.

Reframes the method with FW held constant as the control variable (preset to 75-85%
"Redline") and SW as the revealed/derived variable — same underlying philosophy as Love's
original notes. Contains specific "rule of thumb" mm-to-gram capstan/knuckle conversion
factors that should be treated with the same skepticism as any such claim, since action
ratio is geometry-specific per-piano (no universal conversion verified) — not a claim about
the document's authenticity, just ordinary first-principles caution.

Spreadsheet mechanics (genuinely different from what we built — two-pass, MANUAL, not
live-updating): Sheets are Data Calculation Sheet, Reference Zones, Ref Zone Charts. Real
input table is at H29:I45 (16 sparse sample notes) — NOT auto-linked to the smooth-curve
columns B/C, which are static hardcoded values. Workflow: enter samples in H:I, build a
native Excel scatter chart, Add Trendline, Polynomial order 2, Display Equation, manually
retype that equation into column B (phase 1, SW) — then physically hang hammers, re-measure
BW, get FW correction samples, repeat the same process into column C (phase 2, FW).
Reference Zones / Ref Zone Charts are a fixed backdrop only (12-zone SW family, FW ceiling
at 90/85/80/75%) — a decision aid, not something to solve.

User was offered, not yet accepted or declined, the option of porting the live
auto-regression + outlier-flagging engine into this Arlington file's structure.

## New source material — reviewed this session

A ~90-page PDF by the late Nick Gravagne ("So, What's the Deal with Action Ratios?", 11
installments, PTG Journal Nov 2018 – Aug 2020) has now been fully read. Resolved the DAR/MAR/SR
question above. Also contains useful secondary material not yet incorporated: reflected-inertia
math (installments 10-11), the "Magic Line" capstan/wippen-heel geometry check (installment 9),
and an alternate maximum-FW-ceiling table cross-checkable against Stanwood's. None of these are
built into the app yet — flagged as candidates if the project wants a diagnostics/inertia layer
later.

## Web app — session update (continuing from Draft v3 "Unified")

Working directly in-conversation on `touchweight-workbench.jsx` via the artifact panel (paste
current file in each new conversation to keep editing it live). Changes made this session,
on top of the v3 architecture described below:

- **Strike Weight Design chart, simplified.** Removed the 13-item legend row (was showing all
  Stanwood curve names/numbers as chips above the chart — user feedback: too cluttered, and the
  bold colored highlight curves (1/5/9/13) read as too similar in weight to the brass smoothed-SW
  line). Replaced with: (1) all 13 reference curves now rendered uniformly thin and muted gray,
  with the four zone-boundary curves (1/5/9/13) only marginally darker/heavier for structure —
  no more color-coded gradient; (2) HIGH/MEDIUM/LOW text labels moved from a separate left-side
  "zone strip" column to *inside* the plot itself, near the left edge (pinned to note 3), rendered
  via a Recharts `<Customized>` overlay component so the label height tracks the actual curve data
  (not hardcoded pixel positions). Matches the reference chart style the user shared (a real
  Stanwood "Late Model Steinway D" strike-weight design graph) more closely. The old `ZoneStrip`
  component and `curveColor()` gradient function were removed as dead code.

- **Action Ratio calculator added** (What-If/Stanwood mode panel). Implements David Love's
  empirical method, found verbatim in the FW Modification Sheet's instructional text box
  (drawing1.xml in the xlsx): measure BW, clip 5g onto the hammer (adding to strike weight),
  remeasure BW, and ΔBW ÷ 5 = Action Ratio at that note. UI: 3 sample-note rows (Note #, BW,
  BW+5g SW), computed per-row ΔBW and AR, averaged across whichever rows are filled in, "Apply to
  Action Ratio" button pushes the average into the main Action Ratio field. Collapsible,
  **collapsed by default** (treated as a supplementary one-off tool) — click header to expand;
  shows a live summary tag (e.g. "avg 4.85:1") when collapsed. Standalone scratchpad, not tied to
  per-note `notesData`.

- **"Determine SW Curve — Landmark Samples" added** (FW Modification/Love mode panel, below the
  existing DW/UW/BW/Friction/OrigFW/Delta/NewFW table). Implements Love's *other* documented
  method (same instructional text box, "How to use to determine SW Curve" section): preset
  landmark keys' front weight to the buffered FW Max target, then mix-and-match hammers/shanks
  until BW matches Target BW, record the resulting SW. Landmark notes = all Cs + all Gs + note 1
  (16 notes total on 88-key: A0, C1-C8, G1-G7) — matches what the user described as Love's
  standard practice. Table columns: Note | Preset FW Target (read-only, = fwMaxBuffered for that
  note, updates live with the FW Max % field) | SW Sample (editable — writes directly into the
  same `notesData[i].sw` field that drives the main quadratic fit, so the Strike Weight chart
  refits live as samples are entered) | Smoothed SW (for comparison). Includes its own FW Max %
  input (bound to the same `fwBuffer` state as the What-If panel, so both stay in sync without
  tab-switching). Collapsible, **open by default** (treated as core to Love's workflow, unlike
  the AR calculator) — shows "n/16 recorded" progress when collapsed.

- **Key Ratio field added — fixed a latent equation bug.** The app previously had a single
  "Wippen BW" input (default 9g) that was silently doing the job of `KR × WW` (the full Wippen
  Balance Weight term) as one lumped, non-editable-separately number — Key Ratio had no field of
  its own anywhere in the app despite being essential to the Equation of Balance. Split into two
  real inputs: **Wippen Weight** (WW, raw wippen-on-capstan weight, default 18g) and **Key Ratio**
  (KR, default 0.5) — effective wippen weight (KR×WW) is computed live and shown in a small
  read-out badge next to the two fields. Defaults chosen so 18 × 0.5 = 9, preserving the old
  numeric behavior for continuity. This only affects the Stanwood/What-If equation
  (`fwSmoothed`/`fwMeasured`, computed once and shared by both mode panels' charts) — confirmed
  Key Ratio correctly does NOT affect Love's delta-method panel or the Action Ratio calculator,
  since KR cancels out of both (they're differential/delta calculations, not absolute balance
  calculations). Formula text in the What-If panel updated to read
  `FW = (SW × Action Ratio) + (Key Ratio × Wippen Weight) − Target BW`.
  **Note: KR default of 0.5 is a generic placeholder, not a measured value** — user needs to type
  in the real measured key ratio (rear key segment ÷ front key segment) per Gravagne's measurement
  method (real-world range ~0.44-0.52+ depending on knuckle location/capstan position).

## Web app — architecture (Draft v3 "Unified", as of last full description)

File: touchweight-workbench.jsx. Single-file React artifact using recharts, Fraunces/IBM
Plex Sans/Mono fonts, piano-case-ebony + brass/copper/felt/plum design language.

Architecture, v3:
- Single unified per-note data model: {sw, dw, uw, origFW} for all 88 notes, not split by
  page/mode. BW and Friction are derived live from DW/UW ((DW+UW)/2 and (DW-UW)/2), matching
  what the user tracks in their own sheet, rather than entering BW directly.
- Global inputs (always visible, above the charts): Target BW, shared by both methods.
  Action Ratio / FW Buffer% / Wippen Weight / Key Ratio live inside the "What-If" mode panel
  specifically (Wippen Weight and Key Ratio added this session — see above).
- Charts are persistent and mode-independent — never move or reset when switching modes.
  Strike Weight chart: all 13 Stanwood curves (1/5/9/13 highlighted, all now muted/thin per
  this session's simplification) + in-plot HIGH/MEDIUM/LOW labels (replaced the old side
  zone-strip) + live quadratic-fit Smoothed SW + raw SW scatter. Front Weight chart merges
  both methods' outputs on one chart: Target FW (Smoothed), Target FW (from measured SW),
  New FW (Love's delta method, plum color), FW Max Buffered, FW Max Ceiling.
- Mode toggle ("FW Modification (Love)" / "What-If (Stanwood)") only swaps the panel below
  the charts.
- Sticky, isolated keyboard box at the bottom of the viewport containing: multi-select
  display-field toggle chips (SW/DW/UW/Orig FW) + a separate Input Mode on/off switch
  (read-only when off, to prevent accidental edits while browsing) + an editor bar (selected
  note, per-field inputs, derived BW/Friction, prev/next nav) + the piano keyboard strip
  (correct natural/sharp shapes and spacing, octave dividers at each C, tap to select).
- Regression math (quadFit) is the same SUMPRODUCT/Cramer's-rule closed-form quadratic fit
  used in the spreadsheet, verified against numpy.polyfit.

Design decision, confirmed with user: continuing to build this as a claude.ai artifact rather
than moving to Claude Code — Claude Code would make sense if this becomes something
distributed to other technicians or needs to run as a standalone installed app, but for a
single-user tool actively iterated on in conversation, the artifact workflow was judged the
better fit for now.

Open items:
- Whether the FW Modification table should show all 88 notes with blanks, or only notes with
  data (currently: only notes with data). Still open — not addressed this session.
- Whether "16 landmark notes" (all Cs + all Gs + note 1) matches Love's actual practice, or
  whether he skips some in the extreme bass/treble where hammer-swapping is harder — asked,
  not yet answered.
- Whether the Action Ratio calculator (collapsed by default) and Landmark SW Samples section
  (open by default) should have matching default-open states, or whether the current split
  (supplementary tool vs. core workflow) is the right distinction — asked, not yet answered.
- Web app is still a sketch/wireframe-level pass — not yet wired to read/write actual
  spreadsheet files, still using seeded demo SW data for the initial chart view.
- Possible future addition: Gravagne's reflected-inertia math and/or Magic Line geometry check
  as a diagnostics layer (see "New source material — reviewed this session" above) — not
  requested yet, just flagged as available if wanted.

## Session log addendum (late Oct – Nov 2026) — added when moving the project to Claude Code

Changes made after the Key Ratio fix above, all already in `src/App.jsx`:
- Keyboard: white keys now numbered just below the black keys (black keys unnumbered); note 1 and all Cs and Gs in copper bold.
- SW deviation colouring (green / orange ≥0.3 g / red ≥0.5 g off the smoothed curve) on chart dots, tooltip (signed diff) and keyboard SW dots.
- App now starts EMPTY; "Load demo SW curve" and "Clear all data" buttons added to the top bar (the silent demo seed was confusing).
- Smoothed SW / Target FW show "—" until at least 3 SW values exist (quadratic fit needs 3 points).
- Fixed invisible table text (missing dark text colour on light panels) in `.tw-table` and `.tw-arcalc-table`.
- Piano Library panel: save/load/delete named pianos via `window.storage`, plus JSON export/import (works with no cloud storage).
- Standalone build: Vite project with relative paths, PWA manifest, icons, iOS meta tags, and a localStorage-backed
  `window.storage` polyfill in `src/main.jsx`. Reason: home-screen icons for published Claude artifacts demanded a Claude login.
  Deployed via Netlify Drop; live-device test result still unconfirmed.
- Decision update: the earlier "stay in artifacts, not Claude Code" decision is superseded — Stephen is moving to Claude Code.

The "Web app — now on Draft v3" section above is partly stale (mentions seeded demo SW and a zone strip). `CLAUDE.md` in the
project root is the current, authoritative description of the app.
