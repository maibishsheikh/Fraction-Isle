# Fraction Isles — Technical Requirements Document (TRD)

| | |
|---|---|
| **Product** | Fraction Isles (standalone fractions module) |
| **Version** | 1.0 (draft for review) |
| **Date** | 1 Oct 2026 |
| **Companion docs** | `PRD.md` (requirements) · `IMAGE_PROMPTS.md` (art) |
| **Reference architecture** | `G7-General-and-Missing-Terms` (React 19 + Vite + vanilla CSS, `useReducer` app state, phase components, config-driven worlds, ElevenLabs static audio) |

> **Reading guide.** §1–4 set principles and structure. §5–6 cover application state and flow. §7 lists components. §8 is the heart of the system: the exact-fraction core, question generation, distractors, validation. §9–11 cover interactions, content data and scoring. §12 is audio. §13–17 are quality, performance, security, build and delivery. Section numbers are referenced from the PRD.

---

## 1. Technical Goals and Principles

| # | Principle | Consequence |
|---|---|---|
| P1 | **Exact arithmetic only** | All fraction maths on integer `{n, d}` pairs; no floats anywhere in question logic. |
| P2 | **Data-driven content** | Levels, worlds, stories, stations, Oops cases and question templates live in config/content files; engine code has no hard-coded content. |
| P3 | **Single source of truth for text** | Prompts are *structured nodes*; on-screen text, ARIA labels and narration are all derived from the same nodes → guaranteed parity. |
| P4 | **Deterministic & testable generation** | Seeded RNG; every question reproducible from `(sessionSeed, worldId, attempt, index)`. |
| P5 | **Reusable engines, not one-off screens** | `OopsDesk`, `BarModel`, `FractionWall`, `InteractionHost` are shared across levels. |
| P6 | **Offline-friendly, no external requests at runtime** | Fonts, images, audio self-hosted; no CDNs, trackers or third-party calls. |
| P7 | **Accessible by construction** | Every draggable has a keyboard/tap alternative; ARIA derived from data. |
| P8 | **Fail soft** | Missing audio/art never blocks learning; generator failure falls back to a static question. |

---

## 2. Technology Stack

| Area | Choice | Notes |
|---|---|---|
| Framework | **React 19** | Matches reference |
| Build | **Vite 8** | Matches reference |
| Styling | **Vanilla CSS** with CSS custom properties (design tokens), one CSS file per component/phase | Platform standard (no Tailwind in this module) |
| Animation | **CSS transitions/keyframes first; `framer-motion` only for mount-in effects** | See §14.3 (exit-animation bug) |
| Icons | `lucide-react` (UI icons only); emoji for story/landmark flavour | |
| Drag & drop | **Custom Pointer Events hook** (`usePointerDrag`) | No DnD library; unified mouse/touch/pen; small bundle |
| Fonts | `@fontsource/baloo-2`, `@fontsource/atkinson-hyperlegible` | Self-hosted via npm |
| Unit tests | **Vitest** | Core maths, generators, reducers |
| Lint | **oxlint** | Matches reference |
| Image pipeline | `sharp` (dev script) → WebP | §13.4 |
| Audio generation | Node script → ElevenLabs API (offline, build-time) | §12 |
| Hosting | **Vercel** (static) + optional single serverless function for dynamic TTS | §12.6 |
| Language | **JavaScript (ESM) + JSDoc typedefs** (optional gradual TS migration) | Matches reference; JSDoc gives editor type-checking via `// @ts-check` on core files |

### 2.1 `package.json` (target)
```json
{
  "name": "fraction-isles",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    "test": "vitest run",
    "test:watch": "vitest",
    "stress": "node scripts/stress_test.js",
    "validate": "node scripts/validate_content.js",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "optimize-images": "node scripts/optimize_images.js"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "framer-motion": "^12.42.0",
    "lucide-react": "^1.22.0",
    "@fontsource/baloo-2": "^5.0.0",
    "@fontsource/atkinson-hyperlegible": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.2",
    "vite": "^8.1.0",
    "vitest": "^3.0.0",
    "oxlint": "^1.69.0",
    "sharp": "^0.33.0",
    "dotenv": "^17.4.2",
    "node-fetch": "^3.3.2"
  }
}
```
> Pin exact versions at scaffold time; the ranges above mirror the reference where known.

---

## 3. Repository Layout

```
fraction-isles/
├─ index.html
├─ package.json
├─ vite.config.js
├─ vitest.config.js
├─ .env.local.example              # ELEVENLABS key for build-time scripts only
├─ README.md
├─ api/
│  └─ tts.js                       # OPTIONAL Vercel function (dynamic TTS proxy)
├─ public/
│  ├─ favicon.svg
│  └─ assets/
│     ├─ audio/                    # static narration + atomic clip library
│     │  ├─ narration/
│     │  └─ atoms/
│     └─ images/
│        ├─ story/                 # c1p1.webp … c3p3.webp (+ -800w variants)
│        ├─ islands/               # shore-damaged.webp, shore-restored.webp …
│        ├─ characters/            # mei.webp, danish.webp, otto.webp (+ mood poses)
│        └─ ui/                    # key-art.webp, wonder.webp, certificate-bg.webp
├─ scripts/
│  ├─ generate_audio.js            # builds clips + src/audio/audioMap.js
│  ├─ clean_audio.js               # removes unreferenced mp3s
│  ├─ stress_test.js               # N-session generator invariants
│  ├─ validate_content.js          # content/narration/art checks
│  └─ optimize_images.js           # png/jpg → webp (2 sizes)
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ app/
   │  ├─ initialState.js
   │  ├─ reducer.js                # root reducer composing slices
   │  ├─ actions.js                # action creators + type constants
   │  ├─ selectors.js
   │  ├─ persistence.js            # localStorage load/save + migrations
   │  └─ AppContext.jsx            # state/dispatch providers
   ├─ config/
   │  ├─ features.config.js        # flow mode, demo mode, dynamicTTS flag…
   │  ├─ levels.config.js
   │  ├─ worlds.config.js
   │  ├─ characters.config.js
   │  ├─ badges.config.js
   │  ├─ audio.config.js           # voice id/model/style presets
   │  └─ theme.config.js           # denominator colours/patterns
   ├─ core/
   │  ├─ fraction/
   │  │  ├─ fraction.js            # exact arithmetic
   │  │  ├─ mixed.js               # mixed numbers
   │  │  ├─ format.js              # plain/aria/unicode renderers
   │  │  ├─ speech.js              # fraction → spoken words
   │  │  └─ index.js
   │  ├─ rng.js                    # seeded RNG (mulberry32) + helpers
   │  ├─ nodes.js                  # structured text nodes + serialisers
   │  └─ hooks/
   │     ├─ usePointerDrag.js
   │     ├─ useViewport.js
   │     ├─ useReducedMotion.js
   │     └─ useAudio.js
   ├─ content/
   │  ├─ story/chapters.js         # 9 panels + predict prompts
   │  ├─ narration/                # per-phase narration builders
   │  ├─ stations/                 # station scripts per level
   │  ├─ oops/{easy,medium,hard}.js
   │  ├─ reflect.js
   │  └─ questions/
   │     ├─ index.js               # buildWorldQuestions(), buildBoss(), buildGrand()
   │     ├─ generators/{e1,e2,e3,e4,m1,m2,m3,m4,h1,h2,h3,h4}.js
   │     ├─ boss.js
   │     ├─ distractors.js
   │     ├─ misconceptions.js      # tag registry + feedback copy
   │     ├─ constraints.js         # per-world numeric limits
   │     ├─ wordProblems.js        # templates & contexts
   │     └─ validate.js            # answer validation + diagnostics
   ├─ audio/
   │  ├─ audioMap.js               # AUTO-GENERATED
   │  └─ engine.js                 # play/preload/stop
   ├─ components/
   │  ├─ shell/                    # TopBar, AudioToggle, PhasePills, LevelChip, XPChip
   │  ├─ screens/                  # Intro, Hub, Wonder, Story, Simulate, Play, Reflect, Certificate
   │  ├─ fraction/                 # Frac, FractionBar, Pie, NumberLine, SetGrid, FractionWall, AreaModel, BarModel, Scale, Jug, Boat
   │  ├─ interactions/             # InteractionHost + one component per question type
   │  ├─ stations/                 # PlankSplitter, FractionWallLab, SupplyBoat, JugFiller, CommonGround, CrewSplit, SliceOfASlice, ShareTheBridge, BarModelWorkshop, OopsDesk
   │  ├─ play/                     # WorldBoard, QuestionCard, BossBattle, FeedbackOverlay, HintBubble, BossLives
   │  ├─ art/                      # Art (placeholder-aware), Otto, IslandMap
   │  └─ common/                   # Button, Card, Modal, Toast, StarRow
   ├─ styles/
   │  ├─ tokens.css                # design tokens
   │  ├─ base.css                  # reset, typography, layout primitives
   │  └─ patterns.svg.jsx          # <PatternDefs/> for denominator patterns
   └─ utils/
      ├─ scoring.js                # xp, stars, medals
      ├─ badges.js                 # unlock engine
      └─ events.js                 # track() hook
```

---

## 4. Architecture Overview

```
                ┌─────────────────────────── App ───────────────────────────┐
                │  AppContext (state, dispatch)   persistence (localStorage) │
                └───────┬───────────────────────────────────────────────────┘
                        │
   ┌────────────────────┼──────────────────────────────────────────────────┐
   │ Shell (TopBar, AudioToggle, PhasePills, LevelChip)                    │
   └────────────────────┼──────────────────────────────────────────────────┘
                        ▼
   Screen router (state.phase × state.level)
     ├─ Intro / Hub / Wonder / Reflect / Certificate
     ├─ Story (Caption + Art + Predict)           ◀── content/story
     ├─ Simulate ─ StationTabs ─ Station components ◀── content/stations, oops
     └─ Play ─ WorldBoard ─ QuestionCard ─ InteractionHost
                                   ▲              ▲
                      content/questions (generators + distractors + validate)
                                   ▲
                       core/fraction  (exact maths, speech, format)
```

- **Presentation** (components) never performs fraction arithmetic directly — it calls `core/fraction`.
- **Content** (generators) depends on `core` only; it does not import React.
- **App state** is a plain reducer; side effects (audio, persistence, events) live in hooks/effects.

---

## 5. Application State and Flow

### 5.1 State shape
```js
/** @typedef {'intro'|'hub'|'wonder'|'story'|'simulate'|'play'|'reflect'|'certificate'} Phase */
/** @typedef {'easy'|'medium'|'hard'} LevelId */

const initialState = {
  version: 1,                               // persistence schema version
  nickname: '',
  sessionSeed: 123456789,                   // uint32; regenerated on New Game
  phase: 'intro',
  level: 'easy',                            // current level chip
  audioEnabled: true,
  calmMotion: false,

  wonder: { done: false, fastPass: false },

  story: {                                  // per level
    easy:   { panel: 0, done: false },
    medium: { panel: 0, done: false },
    hard:   { panel: 0, done: false },
  },

  sim: {                                    // per level
    easy:   { station: 0, complete: [false,false,false,false], oopsFound: [false,false,false,false] },
    medium: { station: 0, complete: [false,false,false,false], oopsFound: [false,false,false,false] },
    hard:   { station: 0, complete: [false,false,false,false], oopsFound: [false,false,false,false] },
  },

  play: {                                   // per level
    easy: {
      worlds: [ // 4 worlds
        { attempt: 0, qIndex: 0, correct: 0, stars: 0, done: false, mode: 'adventure',
          answers: [] /* {qid, correct, attempts, hints, tag?} */ },
        /* ×4 */
      ],
      boss: { attempt: 0, lives: 3, qIndex: 0, correct: 0, defeated: false },
    },
    medium: { /* same */ },
    hard:   { /* same, plus */ },
    grand:  { attempt: 0, lives: 3, qIndex: 0, correct: 0, defeated: false },
    current: { world: 0, hintsShown: 0, attemptCount: 0, showFeedback: null, feedbackMsg: '' },
  },

  scoring: { xp: 0, streak: 0, maxStreak: 0, totalStars: 0 },
  badges: [],                               // badge ids
  misconceptions: {},                       // { [tag]: count }  (the Watch-list source)

  reflect: { answers: {}, journal: '', submitted: false },

  unlocked: { easy: true, medium: false, hard: false, grand: false },
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
};
```
**Not persisted:** `play.current` (transient UI), generated question arrays (regenerated deterministically from seed).

### 5.2 Actions (representative, not exhaustive)
| Group | Action | Payload | Effect |
|---|---|---|---|
| Nav | `SET_PHASE` | `phase` | Switch screen (guarded by unlock rules) |
| Nav | `SET_LEVEL` | `level` | Change level chip if unlocked |
| Wonder | `WONDER_COMPLETE` | `{fastPass}` | Mark done; if `fastPass` unlock Medium |
| Story | `STORY_NEXT` / `STORY_PREV` | `level` | Move panel; on last → `story.done = true`, phase → `simulate` |
| Sim | `SIM_GOTO` | `{level, station}` | Only if previous station complete |
| Sim | `SIM_COMPLETE` | `{level, station}` | Mark complete; award 25 XP; if all four → `phaseComplete.simulate` for level |
| Sim | `OOPS_FOUND` | `{level, caseIdx}` | For Oops Spotter badge |
| Play | `WORLD_START` | `{level, world, mode}` | New `attempt`, reset indices |
| Play | `ANSWER_SUBMIT` | `{correct, tag?, attempts, hints}` | XP, streak, misconception log, answer record |
| Play | `HINT_USED` | — | `hintsShown += 1` |
| Play | `NEXT_QUESTION` / `PREV_QUESTION` | — | Index move within world (no cross-world back) |
| Play | `WORLD_COMPLETE` | `{level, world}` | Compute stars; restore landmark |
| Boss | `BOSS_START` / `BOSS_ANSWER` / `BOSS_END` | | Lives logic; `defeated` flag |
| Scoring | `UNLOCK_BADGE` | `id` | Idempotent |
| Gates | `RECOMPUTE_UNLOCKS` | — | Applies §11.3 |
| Reflect | `REFLECT_ANSWER`, `REFLECT_JOURNAL`, `REFLECT_SUBMIT` | | |
| Meta | `TOGGLE_AUDIO`, `SET_NICKNAME`, `NEW_GAME`, `LOAD_SAVED` | | |

### 5.3 Flow controller
`features.config.js`:
```js
export const features = {
  flow: 'levelLoop',        // 'levelLoop' | 'linear'
  demoMode: false,          // ?demo=1 unlocks everything & shows level jumper
  dynamicTTS: false,        // true only when /api/tts proxy is deployed
  timedSprint: true,
  grandChallenge: true,
};
```
`nextDestination(state)` is a pure selector returning the next `{phase, level}`:
- `levelLoop`: Wonder → (Story L → Sim L → Play L) × levels → Reflect.
- `linear`: Wonder → Story(E,M,H) → Sim(E,M,H) → Play(E,M,H) → Reflect.
Same content; only the order differs. Unit-tested (§13.1).

### 5.4 Demo mode
`?demo=1` (or `features.demoMode`) shows a floating **Level/Phase jumper** and unlocks all gates — for internal presentations. Never enabled in production builds by default.

### 5.5 Gating logic (selector `computeUnlocks(state)`)
```js
medium  = fastPass || (easy.sim.allComplete && easy.worlds.filter(w => w.stars >= 2).length >= 3 && easy.boss.attempted)
hard    = fastPass3 || (medium conditions…)
grand   = all three bosses defeated
skipWithHelp(level) = state.failedGateAttempts[level] >= 3   // PRD §9.4
```

### 5.6 Persistence
- `localStorage` key `fractionIsles:v1`, JSON of the persisted subset (see §5.1), debounced 400 ms.
- **Every read/write wrapped in try/catch** (storage can be unavailable); the app runs normally with in-memory state if it fails.
- `schemaVersion` + `migrate(oldState)`; unknown versions → ignore saved data, start fresh.
- Persist **seed + indices**, not generated questions. On load, `buildWorldQuestions(seed, world, attempt)` regenerates the identical set.
- "New Game" clears the key and re-seeds.

---

## 6. Phase Components (behavioural contracts)

| Component | Responsibilities | Key hooks/state |
|---|---|---|
| `Intro` | Title, key art, Start/Continue, nickname, audio toggle | `persistence.hasSave()` |
| `Hub` | Island map, level chips, restoration meters, continue CTA | `selectors.islandProgress(level)` |
| `Wonder` | 3 unscored beats, optional Fast Pass check (3 Qs), narration | local state for beat index |
| `Story` | Panel viewer, caption, predict moment, narration, swipe/arrows/keys; preload next image | `state.story[level]` |
| `Simulate` | Station tabs (A–D), gating, footer nav, Otto panel; mounts the station for `(level, station)` | `state.sim[level]` |
| `Play` | WorldBoard ↔ QuestionCard flow; modes; hints; feedback overlay timer; boss; level complete | `state.play[level]` |
| `Reflect` | 5 questions, log, scorecard, watch-list, certificate button | `state.reflect` |

**Feedback overlay timing:** correct → auto-advance after 2.2 s (tap to skip); incorrect → show misconception message, then advance after 2.2 s (same behaviour as the reference). Timers cleared on unmount (explicit `useEffect` cleanup).

---

## 7. Component Library Specification

### 7.1 `<Frac>` — the single way to display a fraction
```jsx
<Frac n={3} d={4} size="md|lg|xl" variant="stacked|inline" tone="ink|denom|muted" showChip={false} />
<Mixed w={2} n={3} d={4} />
```
- Stacked layout via CSS grid (numerator / rule / denominator); rule width = max(len(n), len(d)) ch.
- `tone="denom"` tints with the denominator colour (from `theme.config.js`) and adds the pattern chip.
- `aria-label` generated from `toAria({n,d})` ("three quarters"). Visual glyph content is `aria-hidden`.
- Handles `d=1` (renders whole number) only when `allowWhole`; **throws in dev if `d===0`**.

### 7.2 Visual primitives (all inline SVG, **explicit `width`/`height` + `viewBox`**, `flex-shrink:0`)
| Component | Props (key) | Notes |
|---|---|---|
| `FractionBar` | `parts`, `shaded`, `labels`, `orientation`, `interactive?` | Equal partition; optional unequal mode for E-A/Oops (`cuts: number[]` in [0,1]) |
| `Pie` | `parts`, `shaded` | Circular sectors via arc paths |
| `NumberLine` | `min`, `max`, `intervals`, `markers`, `onPlace`, `labelEvery` | Draggable flag with snapping; keyboard nudge |
| `SetGrid` | `total`, `groups`, `highlighted`, `icon` | For Crew Split |
| `FractionWall` | `rows[]`, `rulerAt`, `onRuler` | Row per denominator |
| `AreaModel` | `rows`, `cols`, `shadeA`, `shadeB`, `showOverlap` | Slice of a Slice |
| `BarModel` | `units`, `segments[]`, `labels`, `unknown`, `mode: view|build` | Hard-level engine; see §9.5 |
| `Scale` | `left`, `right`, `onChoose` | <, >, = balance |
| `Jug`, `Boat` | `capacity`, `contents[]` | Station visuals |
| `PatternDefs` | — | Mounted once; defines `<pattern id="p-den-3">` etc. |

### 7.3 Interaction components (one per question `type`)
`McqQuestion`, `EntryQuestion` (n/d or mixed boxes), `SliceCutQuestion`, `ShadeTapQuestion`, `NumberLinePlaceQuestion`, `TapSelectQuestion`, `ScaleCompareQuestion`, `CrateStackQuestion`, `JugMatchQuestion`, `ShrinkChainQuestion`, `DragOrderQuestion`, `BarReSliceQuestion`, `SetGroupQuestion`, `AreaShadeQuestion`, `FitCountQuestion`, `BarModelBuildQuestion`, `ErrorSpotQuestion`.

All implement the contract:
```js
/**
 * @typedef {Object} InteractionProps
 * @property {Question} question
 * @property {(payload:any)=>void} onSubmit   // payload shape per type (see §8.6)
 * @property {boolean} locked                  // true while feedback is showing
 * @property {number} hintsShown
 */
```
`InteractionHost` maps `question.type` → component via a registry (`interactions/registry.js`), so adding a type = one file + one registry line.

### 7.4 Art & shared
- `<Art id="IMG-C1P1" alt="…" />` — resolves from an art manifest; if the file 404s, renders a tinted gradient with the alt text and a dev-only "missing art" label. **No code change needed when art lands.**
- `<OttoPanel mood="curious|cheer|think|oops" message={nodes} />` — mascot with speech bubble; messages are node arrays (so they can be voiced).
- `<AudioToggle />` — `position: fixed; top: 12px; left: 12px; z-index` above shell; present on all screens (platform spec).

---

## 8. Fraction Core and Question Engine (critical)

### 8.1 Fraction representation and API (`core/fraction/fraction.js`)
```js
/** @typedef {{n:number, d:number}} Frac */   // integers, d > 0, n >= 0 (v1 non-negative)

export const frac = (n, d = 1) => { assertInt(n); assertInt(d); if (d === 0) throw new RangeError('d=0'); return { n, d }; };
export const gcd  = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
export const lcm  = (a, b) => Math.abs(a / gcd(a, b) * b);
export const simplify   = ({n,d}) => { const g = gcd(n, d) || 1; return { n: n/g, d: d/g }; };
export const isSimplest = (f) => gcd(f.n, f.d) === 1;
export const equals  = (a, b) => a.n * b.d === b.n * a.d;
export const cmp     = (a, b) => Math.sign(a.n * b.d - b.n * a.d);   // -1,0,1
export const add     = (a, b) => simplifyOpt(frac(a.n*b.d + b.n*a.d, a.d*b.d));
export const sub     = (a, b) => { /* require a>=b in v1 */ };
export const mul     = (a, b) => frac(a.n*b.n, a.d*b.d);
export const div     = (a, b) => { if (b.n === 0) throw new RangeError('÷0'); return frac(a.n*b.d, a.d*b.n); };
export const ofSet   = (f, total) => { /* assert total % f.d === 0 */ return (total / f.d) * f.n; };
export const toMixed = ({n,d}) => ({ w: Math.floor(n/d), n: n % d, d });
export const fromMixed = ({w,n,d}) => frac(w*d + n, d);
export const isProper = (f) => f.n < f.d;
export const toNumber = ({n,d}) => n/d;   // ONLY for rendering positions on a line; never for logic
```
Rules:
- **Overflow guard:** all inputs ≤ 1,000; `Number.isSafeInteger` asserted on every product.
- **Unsimplified results are allowed** from `mul/div/add` constructors that explicitly return *raw* results (`addRaw`, `mulRaw`) — needed to test `requireSimplest`. Public `add/sub/mul/div` return **simplified** by default; raw variants exported for validators.
- `core/fraction/index.js` re-exports; **only** this module is allowed to do cross-multiplication.

### 8.2 Formatting & speech
| Function | Output examples |
|---|---|
| `toPlain({n:3,d:4})` | `"3/4"` (logs, tests) |
| `toAria(f)` / `toSpeech(f)` | `"three quarters"` |
| `toAria(mixed)` | `"one and three quarters"` |
| `toUnicode(f)` | `"¾"` where a glyph exists, else `"7⁄8"` (rarely used) |

**Speech rules (`speech.js`)**
```
denominator words: 2 half/halves · 3 third(s) · 4 quarter(s) · 5 fifth(s) · 6 sixth(s) · 7 seventh(s) · 8 eighth(s) · 9 ninth(s) · 10 tenth(s) · 11 eleventh(s) · 12 twelfth(s)
pluralise when n > 1.   n=1 → "one half", "one quarter", "one third"
n/d where d>12 → "n over d" (not expected in v1)
mixed: "<w> and <fraction>" · improper: "seven quarters" (not "one and…") unless asked
operators: + "plus" · − "minus" · × "times" · ÷ "divided by" · = "equals" · < "is less than" · > "is greater than" · "of" stays "of"
whole numbers 0–999 spelled via a small number-to-words util
```
Tests assert exact strings for ≥ 60 cases (all d ≤ 12, n ≤ d·4 sample + mixed + operators).

### 8.3 Structured text nodes (`core/nodes.js`)
```js
/** @typedef {string | {frac:Frac} | {mixed:{w:number,n:number,d:number}} | {num:number} | {em:string} | {op:'+'|'-'|'×'|'÷'|'='|'<'|'>'} | {br:true}} Node */

const prompt = [ 'A bar is cut into ', {num:6}, ' equal parts and ', {num:5}, ' are shaded. What fraction is shaded?' ];

renderNodes(nodes)  // → React elements (uses <Frac/>)
toPlainText(nodes)  // → "A bar is cut into 6 equal parts…"
toAriaText(nodes)   // → "…What fraction is shaded?"  (fractions voiced as words)
toSpeechText(nodes) // → TTS string (digits & fractions as words)
```
> **Parity guarantee:** narration is *always* `toSpeechText(nodes)` of the same node array rendered on screen. `validate_content.js` fails the build if any narrated string is hand-typed rather than derived.

### 8.4 Misconception registry (`misconceptions.js`)
Each tag has: `id`, `label` (teacher-facing), `message` (learner-facing, kind), `appliesTo` (worlds), `makeDistractor(ctx) → value | null`.

| Tag | Description | Example distractor generation |
|---|---|---|
| `UNEQUAL_PARTS_OK` | Names unequal parts as fractions | n/a (interaction) |
| `SWAP_NUM_DEN` | Inverts numerator/denominator | `{n:d, d:n}` |
| `BIG_DENOM_BIG_FRACTION` | Larger denominator = larger fraction | pick the fraction with the larger denominator |
| `COMPARE_NUMERATORS_ONLY` | Ignores denominators | pick larger numerator |
| `NUMLINE_COUNT_MARKS` | Counts tick marks, not intervals (off-by-one) | `pos ± 1/d` |
| `ADD_DENOMINATORS` | `(a+c)/(b+d)` | `frac(a.n+b.n, a.d+b.d)` |
| `ADD_NUM_KEEP_DEN_UNLIKE` | Adds numerators, keeps first denominator | `frac(a.n+b.n, a.d)` |
| `EQUIV_ADD_NOT_MULT` | Adds k to both | `frac(n+k, d+k)` |
| `MIXED_TO_IMPROPER_ADD` | `w n/d → (w+n)/d` | `frac(w+n, d)` |
| `IMPROPER_REMAINDER_MISUSE` | Quotient/remainder swapped | `{w:rem, n:quot, d}` |
| `SIMPLIFY_PARTIAL` | Not fully simplified / divides only top | `{n:n/g, d}` or partial gcd |
| `OF_MEANS_ONE_PART` | Takes 1 part instead of n parts | `total / d` |
| `OF_MEANS_DIVIDE` | Divides by numerator | `total / n` |
| `MULT_ADD_CONFUSION` | Adds instead of multiplies | `add(a,b)` raw |
| `MULT_KEEP_COMMON_DEN` | Multiplies numerators, keeps denominator | `frac(a.n*b.n, a.d)` |
| `DIV_NO_FLIP` | Multiplies instead of dividing | `mul(a,b)` |
| `FLIP_WRONG` | Inverts the wrong fraction | `div(inv(a), b)` |
| `DIV_WHOLE_BY_FRACTION_SHRINKS` | Expects a smaller result | `mul(whole, frac)` |
| `BAR_WRONG_WHOLE` | Treats remainder as fraction of original | recompute with wrong whole |
| `OFF_BY_ONE_COUNT` | Miscounts pieces | `answer ± 1` |
| `RANDOM_NEAR` | Fallback plausible neighbour | `answer ± small` (last resort) |

`logMisconception(tag)` increments `state.misconceptions[tag]`. The Reflect **Watch-list** shows the top 3 by count with the tag's `message`.

### 8.5 Distractor engine (`distractors.js`)
```js
makeOptions({ correct, candidates /* [{value, tag}] */, count = 4, allowEquivalent = false, rng })
```
Algorithm:
1. Start with `correct`.
2. Iterate `candidates` in priority order; reject a candidate if:
   - it **equals the correct answer by value** (`equals(c, correct)`), **or**
   - when `allowEquivalent === false`: it is **equivalent to any already-chosen option** (`equals`), **or**
   - it fails domain constraints (d=0, negative, d>limit).
3. If fewer than `count`, fill with `RANDOM_NEAR` neighbours (also filtered).
4. Shuffle with `rng`. Return `{ options: [{id, value, tag?}], correctId }`.
> The bug class discovered in the platform's earlier module (a helper that returns `[correct, ...distractors]` being wrapped again, producing duplicated correct options) is prevented by design: **`makeOptions` is the only place that assembles option lists**, and it always filters the correct value out of candidates. `stress_test.js` asserts it (I1–I3 below).

`allowEquivalent` is `true` only for questions whose *point* is equivalence/simplest form (E-W3 "catch the equal", M-W1 `shrink-chain` where unsimplified forms are the wrong answers). Those questions carry `answerSpec.requireSimplest`.

### 8.6 Question schema (JSDoc)
```js
/**
 * @typedef {Object} Question
 * @property {string}  id               // `${world}-${attempt}-${index}` e.g. "E3-0-07"
 * @property {LevelId} level
 * @property {string}  worldId          // "E1".."H4", "EB","MB","HB","GRAND"
 * @property {string}  type             // registry key (see §7.3)
 * @property {string}  category         // category tag shown on card, e.g. "EQUAL PARTS"
 * @property {string[]} lo              // ["LO-E1","LO-E2"]
 * @property {1|2|3}   difficulty
 * @property {Node[]}  prompt           // structured text
 * @property {Visual}  [visual]         // {type:'bar'|'pie'|'numberline'|'set'|'wall'|'area'|'barmodel', data:{…}}
 * @property {Option[]} [options]       // for mcq-like types
 * @property {AnswerSpec} answer
 * @property {Node[]}  hint1
 * @property {Node[]}  hint2
 * @property {Node[]}  explanation
 * @property {string}  signature        // canonical string for de-duplication
 * @property {Object}  [meta]           // generator params (for debugging)
 */

/**
 * @typedef {Object} AnswerSpec
 * @property {'frac'|'mixed'|'int'|'choice'|'order'|'position'|'set'|'cuts'|'bar'|'boolean'} kind
 * @property {*} value                       // canonical correct value
 * @property {boolean} [requireSimplest]
 * @property {boolean} [acceptEquivalent]    // if true, any equal-valued fraction is accepted
 * @property {number}  [tolerance]           // positional tolerance for drag types (fraction of line length)
 * @property {Record<string,string>} [diagnose] // map of wrong-value signature → misconception tag
 */
```

#### Answer payloads per type
| Type | Submit payload | Validation |
|---|---|---|
| `mcq` | `optionId` | `optionId === correctId`; tag = option.tag |
| `entry` (frac) | `{n, d}` | `equals` (+ `requireSimplest`); diagnose via signatures |
| `entry` (mixed) | `{w, n, d}` | Normalise to improper, compare; `requireSimplest` on fractional part |
| `entry` (int) | `number` | Strict equality |
| `slice-cut` | `{cuts:number[]}` | n−1 cuts, each within `tolerance` (default 0.03) of i/n |
| `shade-tap` | `{shaded:number[]}` | Set equality of part indices |
| `number-line-place` | `{x:number}` | `abs(x − target) ≤ tolerance` (default 0.5/d·0.8) after snap |
| `tap-select` | `{ids:string[]}` | Set equality (all & only equivalents) |
| `scale-compare` | `'<'|'>'|'='` | `cmp` |
| `crate-stack` | `{crates:Frac[]}` | Sum equals target; partial-credit diagnosis if numerators added only |
| `jug-match` | `{pairs:[id,id][]}` | All pairs equal-valued |
| `shrink-chain` | `{steps:number[]}` (divisors) | Product of divisors = gcd; final form = simplest |
| `drag-order` | `{order:string[]}` | Sorted by exact `cmp` (ties allowed) |
| `bar-reslice` | `{parts:number}` | `parts` is a common multiple (LCM preferred; any common multiple accepted for add, LCM required if `requireLCM`) |
| `set-group` | `{groups:number, highlighted:number}` | `groups===d`, `highlighted===n` |
| `area-shade` | `{aCells:number[], bCells:number[]}` | Overlap = product region |
| `fit-count` | `number` | Equality with `whole ÷ unit` |
| `bar-model-build` | `{segments:Segment[], unknownId, value}` | §9.5 |
| `error-spot` | `{lineIndex, reasonId}` | Matches seeded error line & reason |

### 8.7 Validation entry point (`validate.js`)
```js
/** @returns {{correct:boolean, tag?:string, partial?:'not_simplest'|'right_value_wrong_form', feedbackKey:string}} */
export function validate(question, payload) { /* switch(question.type) … */ }
```
- Returns `partial: 'not_simplest'` when value is right but `requireSimplest` unmet → UI says "Right value — can you make it simpler?" and allows **one free retry** (not counted as a miss).
- `diagnose` consults `question.answer.diagnose` first, then runs **generic detectors** on the payload (e.g. did the learner enter `(a.n+b.n)/(a.d+b.d)`?).

### 8.8 Seeded RNG (`rng.js`)
```js
export function mulberry32(seed) { /* standard */ }
export const makeRng = (seed) => { const r = mulberry32(seed); return { next: r, int:(a,b)=>…, pick:(arr)=>…, shuffle:(arr)=>…, weighted:(pairs)=>… }; };
export const hash = (...parts) => /* FNV-1a over String(parts) → uint32 */;
// per-world seed:
const seed = hash(state.sessionSeed, worldId, attempt);
```
Same `(sessionSeed, worldId, attempt)` ⇒ identical question set (reload-safe). `attempt` increments on replay so replays are fresh.

### 8.9 Generators (`generators/*.js`)
Each exports `generate(rng, difficulty, ctx) → Question | null` and `slots: [...]` describing the 10-question ramp.
```js
// worldBuilder
export function buildWorld(worldId, seed, opts = { echoTags: [] }) {
  const rng = makeRng(seed); const out = []; const seen = new Set();
  for (let i = 0; i < 10; i++) {
    const slot = WORLD_SLOTS[worldId][i];           // {difficulty, typeHint, echo?}
    let q, tries = 0;
    do { q = GENERATORS[worldId].generate(rng, slot, { echoTags: opts.echoTags }); tries++; }
    while ((!q || seen.has(q.signature)) && tries < 200);
    if (!q) q = FALLBACKS[worldId][i];              // static, hand-verified question
    seen.add(q.signature); out.push({ ...q, id: `${worldId}-${seed}-${String(i).padStart(2,'0')}` });
  }
  return out;
}
```
**Per-world constraints** (`constraints.js`) — excerpt:
```js
E1: { dens:[2,3,4,5,6,8,10,12], shapes:['bar','circle','rect'], numMax:'d-1' },
E2: { dens:[2,3,4,5,6,8,10,12], lines:[[0,1],[0,2]], extendedFromQ:8 },
E3: { equivFamilies:[[2,4,6,8,10,12],[3,6,12],[4,8,12],[5,10]], cmpModes:['likeDen','likeNum','vsHalf'] },
E4: { dens:[3,4,5,6,7,8,9,10,12], sumMax:1 /* inclusive */, mode:['add','sub'] },
M1: { dens:[2,3,4,5,6,8,10,12], wholesMax:4, gcdChains:[1,2] },
M2: { relatedFirst:true, unrelatedFromQ:6, count:[3,4], benchmarks:[1/2,1] /* display only */ },
M3: { related:true, mixedFromQ:6, regroupFromQ:9, denMax:12 },
M4: { setSizes:'multiple of d', totalMax:60, reverse:true },
H1: { cases:['wholeXfrac','fracXwhole','fracXfrac','simplifyFirst'], denMax:10, mixedStretchQ:10 },
H2: { cases:['wholeDivUnit','fracDivWhole','fracDivFrac','whyFlip'], unitDivisorsFirst:true, denMax:8 },
H3: { problemTypes:['remainder','beforeAfter','comparison'], wholeAnswersOnly:true, valueMax:240 },
H4: { mix:['H1','H2','H3','errorSpot'], echoFromAll:true }
```
**Word problems** (`wordProblems.js`): templates with slots (`{person}`, `{item}`, `{unit}`) drawn from context banks (island contexts + SG contexts); generator picks numbers *first* (so answers are integer), then fills text.

### 8.10 Boss & Grand builders
`buildBoss(level, seed)` → 5 hard-tier (difficulty 3) questions drawn across the level's worlds (≥ 1 per world; echo tags prioritised). `buildGrand(seed)` → 8 questions: 3 Easy-tier, 2 Medium, 3 Hard.

### 8.11 Echo questions
`state.misconceptions` + last-world answers → `echoTags` for the *next* world in the same level; slots 8–9 (0-indexed) request a question whose distractors include that tag. If a tag is not applicable to the world, skip.

---

## 9. Interaction Engines

### 9.1 `usePointerDrag`
```js
const { bind, dragging, pos } = usePointerDrag({
  onStart, onMove, onEnd,
  axis: 'x'|'y'|'both', bounds: ref, snap: (p)=>p
});
```
- Uses `pointerdown/move/up/cancel` with `setPointerCapture`; `touch-action: none` on the draggable only (page still scrolls elsewhere).
- Throttled with `requestAnimationFrame`.
- **Keyboard & tap alternative contract:** each draggable exposes `role="slider"` or `role="button"` with `aria-valuetext` (e.g. "cut at two fifths"), arrow keys nudge by one *snap unit*, Enter/Space confirm; "tap piece, then tap target" mode toggled by a visible **"Move with taps"** control.

### 9.2 Plank Splitter (E-A) — Equal Meter
```
state: cuts:number[] (sorted, in (0,1)), targetN
segments = diff([0, ...cuts, 1])
equal    = segments.length === targetN && segments.every(s => Math.abs(s - 1/targetN) <= EQ_TOL)   // EQ_TOL = 0.03 (3%)
on drag: update cuts live; compute `equal` each frame
UI: unequal → pieces get wobble class (CSS), red '≠' tags; equal → green glow, after 300ms animate to exact i/n (snap)
```
Free-choice round: any `n ∈ [2,8]`; the same logic with `targetN = chosen`.

### 9.3 Fraction Wall ruler (E-B)
Wall rows are rendered from `rows=[1,2,3,4,5,6,8,10,12]`. The ruler is a vertical line at `x ∈ [0,1]`; `matchesAt(x)` returns the set of row boundaries within ε (1e-6 on exact rational positions: compare via `equals(frac(k,d), xFrac)` where `xFrac` is chosen from the snap lattice of lcm(rows)=120). Snapping to a 1/120 lattice keeps all positions exact.

### 9.4 Jug Filler, Common Ground, Crew Split, Slice of a Slice, Share the Bridge
Each station is a small state machine (`briefing → guided(i) → free → gate(j) → complete`) built on a shared `useStation(script)` hook:
```js
const st = useStation(stationScript); // { step, next(), fail(tag), complete(), progress }
```
`stationScript` (in `content/stations/*.js`) lists steps with Otto lines (nodes), required actions, and gate items. This keeps stations consistent and the narration derivable.

### 9.5 Bar Model engine (`BarModel` + `BarModelBuildQuestion`)
```js
/** Segment: {id, start, len, shaded?, label?, unknown?} in "units" (integers on a common partition) */
const model = {
  units: 3,                         // total equal boxes the whole is partitioned into
  segments: [
    { id:'platform', start:0, len:1, label:'platform' },
    { id:'stairs',   start:1, len:1, label:'stairs' },
    { id:'left',     start:2, len:1, label:'8 left', known:8 },
  ],
  total: { unknown:true }           // answer = known value × units
};
```
**Build mode steps:** (1) choose partition (drag a splitter → `units`), (2) assign segments by shading/labelling, (3) mark `?`, (4) enter value. Validation compares to the generator's canonical model: same `units`, same relationships, correct final value. Because there are many valid pictures, validation checks **mathematical equivalence** (unit value × boxes), not pixel structure. Generator ensures a unique minimal partition via `lcm` of denominators involved.

### 9.6 Timer (Timed Sprint)
`useCountdown(seconds, {paused})` using `performance.now()` deltas (not `setInterval` drift); pause button; visible numeric + bar countdown. When `calmMotion` or `prefers-reduced-motion` is on, the animated bar is replaced by a static numeric countdown.

---

## 10. Content Data Structures

### 10.1 `levels.config.js`
```js
export const LEVELS = {
  easy:   { id:'easy',   name:'Easy',   island:'Sunrise Shore', chapter:1, accent:'var(--lvl-easy)',   worlds:['E1','E2','E3','E4'], boss:'EB' },
  medium: { id:'medium', name:'Medium', island:'Tidepool Reef', chapter:2, accent:'var(--lvl-medium)', worlds:['M1','M2','M3','M4'], boss:'MB' },
  hard:   { id:'hard',   name:'Hard',   island:'Summit Peak',   chapter:3, accent:'var(--lvl-hard)',   worlds:['H1','H2','H3','H4'], boss:'HB' },
};
```

### 10.2 `worlds.config.js` (excerpt)
```js
export const WORLDS = {
  E1: { id:'E1', level:'easy', name:'Equal Parts & Names', emoji:'🪵', landmark:'dock',
        lo:['LO-E1','LO-E2'], conceptFocus:'equal-parts-and-names',
        description:'Cut and name fair shares', accent:'var(--world-e1)' },
  /* … E2–E4, M1–M4, H1–H4 */
};
export const BOSSES = {
  EB: { id:'EB', name:'The Lopsided Crab', emoji:'🦀', reward:'Calm Badge' },
  MB: { id:'MB', name:'The Tangle Kraken', emoji:'🐙', reward:'Reef Badge' },
  HB: { id:'HB', name:'The Storm Colossus', emoji:'⛈️', reward:'Beacon Badge' },
  GRAND: { id:'GRAND', name:'The Great Storm', emoji:'🌪️', reward:'Island Architect Trophy' },
};
export const PLAY_MODES = [ /* adventure, independent, timedSprint */ ];
```

### 10.3 Story content (`content/story/chapters.js`)
```js
export const CHAPTERS = [
  { id:1, level:'easy', title:'The Uneven Plank', panels:[
    { id:'C1P1', art:'IMG-C1P1', title:'Storm on Sunrise Shore', text:[ /* nodes */ ],
      coreIdea:[ /* nodes */ ], predict:{ q:[…], options:[…], revealOnNext:true },
      alt:'…' }, /* … */
  ]},
  /* chapters 2 & 3 */
];
```
All text from PRD §8.3 is transcribed here as nodes (fractions as `{frac}` nodes so they speak correctly).

### 10.4 Oops Desk data
```js
{ id:'E-O2', tag:'BIG_DENOM_BIG_FRACTION',
  work:[ 'Danish says: ', {frac:{n:1,d:3}}, ' is bigger than ', {frac:{n:1,d:2}}, ' because 3 is bigger than 2.' ],
  verdict:'wrong',
  reasons:[ {id:'a', text:[…], correct:true}, {id:'b', …}, {id:'c', …} ],
  fixTool:{ type:'scale-compare', data:{ left:{n:1,d:3}, right:{n:1,d:2} } },
  otto:[…] }
```

### 10.5 Reflect (`reflect.js`)
Five questions (PRD §8.7.1) as nodes + options + tag; journal prompt; watch-list copy per tag.

---

## 11. Scoring, Gates and Badges (`utils/scoring.js`, `utils/badges.js`)

### 11.1 Scoring
```js
export function calcXP(attempts = 1, hints = 0, streak = 0) {
  const base = attempts === 1 ? 12 : attempts === 2 ? 8 : 5;
  const streakBonus = streak >= 5 ? 10 : streak >= 3 ? 5 : 0;
  return Math.max(2, base - hints * 2 + streakBonus);
}
export const calcStars = (c) => c >= 9 ? 3 : c >= 7 ? 2 : c >= 5 ? 1 : 0;
export const levelMedal = (avgStars) => avgStars >= 2.7 ? 'gold' : avgStars >= 2 ? 'silver' : avgStars >= 1 ? 'bronze' : null;
```
- A `partial: 'not_simplest'` free retry does **not** increment `attempts`.
- Independent mode: `hints` fixed at 0, hint button hidden; stars only count from Independent *or* Adventure best (whichever is higher).
- Boss: XP flat 15 per correct; lives lost on incorrect; defeated when all 5 answered with ≥ 1 life remaining; **retry allowed** after a short Otto recap.

### 11.2 Badge engine
Pure `checkBadges(state) → string[]`; `useEffect` on relevant slices dispatches `UNLOCK_BADGE` (idempotent). Conditions per PRD §9.5.

### 11.3 Gate selector
`computeUnlocks(state)` per §5.5; recomputed on `WORLD_COMPLETE`, `BOSS_END`, `SIM_COMPLETE`, `WONDER_COMPLETE`.

---

## 12. Audio and Narration

### 12.1 Pipeline (follows the platform pipeline; deltas noted)
1. `content/narration/*` builds **segments**: `{ text, style }` from node arrays via `toSpeechText`.
2. `scripts/generate_audio.js` (Node, reads `.env.local`) collects all static segments, **hashes `text+style+voiceId+model`** → `sha1`, calls ElevenLabs for any hash not already on disk, saves `public/assets/audio/narration/<phase>_<idx>_<hash8>.mp3`, and writes `src/audio/audioMap.js`:
   ```js
   export const audioMap = { "<sha1>": "/assets/audio/narration/story_c1p1_3f9a12bc.mp3", … };
   ```
   *(Delta from the reference: keyed by content hash — not by raw text slug — so filenames stay short and edits invalidate cleanly.)*
3. `scripts/clean_audio.js` removes mp3s not referenced in `audioMap`.
4. Voice/model/styles from `config/audio.config.js` (voice `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`, settings per style as in the reference).
5. `engine.js`: `narrate(segments)` plays sequentially with **eager preload of the next segment**; `stopAll()` on unmount/navigation; global enabled flag from state.

### 12.2 No browser TTS fallback
If a hash is missing in `audioMap` (and dynamic TTS is disabled), `narrate` resolves immediately with no sound. No Web Speech API is ever called.

### 12.3 What is pre-generated
Wonder script, story panels (9) + predict prompts + reveals, station briefings/step lines/gates, Otto feedback lines (correct/wrong/hint/streak/level-up/boss), Oops Desk case text and fixes, Reflect text, certificate sign-off. Target ≈ 220 clips; est. total < 12 MB mp3.

### 12.4 Dynamic question narration — options
| Option | Description | Verdict |
|---|---|---|
| **A. Atomic clip stitching (recommended default)** | Pre-generate a library of short clips: all fractions with d ≤ 12 and n ≤ 2d (≈ 150 clips), numbers 0–120, operators, connectors ("of", "equals", "is greater than"…), and sentence-stem fragments. Stems are composed from templates: `[stem clip][fraction clip][connector clip]…` with 40 ms crossfades. | Zero runtime API calls; consistent voice; choppy prosody risk → keep stems short, use `emphasis` style for numbers |
| **B. Serverless TTS proxy** | `api/tts.js` holds the key server-side; client POSTs `{text, style}` and caches by hash in memory/Cache Storage. Enabled by `features.dynamicTTS`. | Best prosody; needs hosting + cost control (rate-limit, max 200 chars, allow-list of styles) |
| **C. Silent for dynamic questions** | Read-aloud button hidden; static narration only | Fallback; acceptable for v1 if A/B slip |

> ⚠️ **Security delta from the reference:** the reference documents a `VITE_ELEVENLABS_API_KEY` used both by the offline script and by the client for dynamic generation. **Any `VITE_`-prefixed variable is inlined into the public bundle.** In Fraction Isles the key is a **build-script-only secret** (`ELEVENLABS_API_KEY`, no `VITE_` prefix) and is never imported by `src/`. Dynamic TTS, if used, goes through `api/tts.js`.

### 12.5 Atomic clip manifest
`scripts/generate_audio.js --atoms` builds `atoms/` + `src/audio/atomMap.js` from `core/fraction/speech.js` word generators so every clip's text equals the speech serialiser's output (parity by construction).

### 12.6 Optional `api/tts.js` (sketch)
```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text, style } = req.body || {};
  if (typeof text !== 'string' || text.length > 200 || !STYLES.includes(style)) return res.status(400).end();
  // rate-limit by IP (e.g. 30/min), call ElevenLabs with process.env.ELEVENLABS_API_KEY, stream mp3
}
```

### 12.7 Audio toggle
Fixed **top-left**, every screen, `aria-pressed`, persists in state; mute stops current playback immediately.

---

## 13. Quality Engineering

### 13.1 Unit tests (Vitest)
| Suite | Cases |
|---|---|
| `fraction.test.js` | gcd/lcm; simplify idempotence; `add` commutativity/associativity (property-style over random pairs d ≤ 12); `mul/div` inverse; `cmp` transitivity; `toMixed/fromMixed` round trip; `ofSet`; overflow guard |
| `speech.test.js` | ≥ 60 exact string expectations (all d 2–12, plural rules, mixed, operators) |
| `nodes.test.js` | `toPlainText` / `toAriaText` / `toSpeechText` agree structurally |
| `rng.test.js` | Determinism; distribution sanity |
| `distractors.test.js` | No dupes; no equivalents (unless allowed); correct present exactly once |
| `validate.test.js` | Each question type: correct, each tagged-wrong, partial |
| `reducer.test.js` | Gates, stars, streaks, `NEW_GAME`, persistence round-trip |
| `flow.test.js` | `nextDestination` for `levelLoop` and `linear` |

Coverage targets: `core/` 100% lines; `content/questions/` ≥ 90%.

### 13.2 Generator stress test (`scripts/stress_test.js`)
Run **N = 50,000+ questions** (e.g. 500 sessions × 100) across seeds. Assert invariants:

| ID | Invariant |
|---|---|
| I1 | `correct` appears in `options` **exactly once** |
| I2 | Option strings are unique |
| I3 | No two options are equivalent (unless `allowEquivalent`) |
| I4 | Every number obeys the world's `constraints` |
| I5 | An **independent solver** (second implementation using BigInt rationals) reproduces `answer.value` for every question |
| I6 | No distractor equals the correct value |
| I7 | `hint1`, `hint2`, `explanation` non-empty; `prompt` non-empty |
| I8 | No duplicate `signature` within a world build |
| I9 | Generator fallback rate < 0.5% (else constraints too tight) |
| I10 | Difficulty ramp: mean difficulty of slots 1–3 < slots 8–10 |
| I11 | Every `diagnose` tag exists in the registry |
| I12 | Word-problem answers are positive integers where `wholeAnswersOnly` |
| I13 | Reproducibility: same seed → byte-identical question JSON |

Exit code ≠ 0 on any violation; runs in CI before build.

### 13.3 Content validation (`scripts/validate_content.js`)
- Every narrated segment is produced via `toSpeechText` (no hand-typed duplicates).
- Every segment hash exists in `audioMap` (warning in dev, error in release builds).
- Every `Art` id has an image file in each required size (warning if missing).
- Every story panel has `alt`, `coreIdea`, text length ≤ 600 chars.
- Every Oops case has exactly one correct reason.
- No `TODO`/placeholder strings in content.

### 13.4 Manual QA matrix
| Dimension | Values |
|---|---|
| Viewports | 360×640, 390×844, 768×1024, 1024×768, **1366×768 (short)**, 1920×1080 |
| Input | Touch, mouse, keyboard-only, stylus |
| Browsers | Chrome/Edge (Win, ChromeOS, Android), Safari (iPadOS/iOS 15+), Firefox |
| Modes | Audio on/off, reduced-motion, 200% text zoom, slow 3G throttle |
| Flows | Full run Easy→Reflect (`levelLoop`); `linear` flow; Fast Pass; reload mid-world; New Game; demo mode |

### 13.5 Accessibility checks
- Automated: axe-core in dev (console warnings) + Lighthouse a11y ≥ 95.
- Manual: keyboard-only completion of one full level; screen-reader spot checks (VoiceOver/NVDA) of `Frac`, NumberLine, Scale, BarModel.
- Contrast audit of all token pairs (script in `scripts/` optional).

---

## 14. Known Pitfalls and Required Mitigations

These come from issues already encountered in sibling modules; they are **requirements** here.

### 14.1 Flex-shrink crush on replaced/overflow elements
In flex-column cards that scroll (`overflow-y:auto`), inline `<svg>` or `<img>` children can be compressed to near-zero height because replaced elements lose the automatic min-content floor, and **any flex child that sets its own `overflow` ≠ `visible` loses it too**.
- All visual primitives set **explicit `width`/`height` attributes + `viewBox`** and CSS `flex-shrink: 0`.
- Rule (lint-enforced via a CSS convention check in `validate_content.js`): *any flex-column child that sets its own `overflow` must also set `flex-shrink: 0`.*
- Station/mission cards: `display:flex; flex-direction:column; overflow-y:auto; min-height:0`.
- Story image container: `flex-shrink:0` (as in the reference's `.story-image-full`).

### 14.2 Do not hide overflow globally
The reference sets `overflow:hidden` on `html/body/#root` and hides scrollbars. Fraction Isles instead lets **cards scroll** (`overflow-y:auto`, thin visible scrollbar on desktop) so nothing is unreachable on short viewports (1366×768).

### 14.3 framer-motion `AnimatePresence` ghost cards
In a sibling module, `AnimatePresence` (both `mode="wait"` and `popLayout`) never fired its exit-complete callback between missions, leaving an invisible click-intercepting card. **Rule:** no `AnimatePresence`/exit animations between stations, missions, questions or screens. Use mount-in fades only (key-based remount). Transitions between questions use a CSS class toggle with `animationend` guarded by a timeout fallback.

### 14.4 Option assembly bug class
See §8.5 — one assembler (`makeOptions`) only; I1–I3 enforced in stress test.

### 14.5 Audio toggle placement
Top-left on every screen (explicit current platform spec). If the reference module code differs, **the spec wins**; do not copy the reference's position.

### 14.6 localStorage availability
Wrap in try/catch; never assume availability (private mode, embedded webviews).

### 14.7 Pointer/touch gotchas
- Prevent page scroll only on the dragged element (`touch-action:none` scoped).
- iOS Safari: avoid `position:fixed` + virtual keyboard overlap for entry boxes (use `visualViewport` resize handler to keep the Check button visible).
- Numeric entry uses `inputmode="numeric"` and `pattern="[0-9]*"`; prevents decimal keypads.

---

## 15. Performance, Security and Privacy

### 15.1 Performance budgets
| Budget | Target |
|---|---|
| JS (gzip) initial route | ≤ 180 KB (code-split screens with `React.lazy`; stations lazy per level) |
| CSS (gzip) | ≤ 40 KB |
| Story/hero images | WebP ≤ 220 KB at 1600w, ≤ 90 KB at 800w (`srcset`) |
| Fonts | ≤ 120 KB total (subset Latin, 3 weights) |
| First interactive (Chromebook, throttled 4× CPU, fast 3G) | ≤ 3.5 s to Intro |
| Interaction latency (drag) | ≥ 55 fps on 2019 mid-range tablet |
| Memory | No leaks across 100 questions (check via DevTools heap) |

Tactics: SVG (not canvas) for visuals; avoid per-frame React state for drags (use refs + `transform`, commit on end); `content-visibility:auto` for off-screen panels; preload next story image and next audio segment only; lazy-load island art per level; `loading="lazy"` for non-critical art.

### 15.2 Security and privacy
- No analytics/trackers/third-party requests at runtime.
- Only user-entered data: nickname (≤ 12 chars, sanitised, rendered as text) and learner's log (≤ 300 chars) — stored locally.
- Strict CSP in `vercel.json`: `default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`.
- `dangerouslySetInnerHTML` is **forbidden** (lint rule); all rich text via `renderNodes`.
- Secrets: `ELEVENLABS_API_KEY` only in `.env.local` (git-ignored) and Vercel serverless env — never `VITE_`.
- Dependencies pinned; `npm audit` in CI.

### 15.3 Browser support
Last 2 versions of Chrome/Edge/Firefox/Safari; iOS/iPadOS ≥ 15; Chrome on ChromeOS and Android 10+. Uses Pointer Events, CSS custom properties, CSS grid; no `:has()` dependency for critical layout.

---

## 16. Telemetry Hook (future-proofing)

```js
// utils/events.js
let sink = null;
export const setEventSink = (fn) => { sink = fn; };
export const track = (name, payload = {}) => { try { sink && sink({ name, t: Date.now(), ...payload }); } catch {} };
```
Default sink = none. In `?debug=1` mode, events log to console. Event catalogue: `phase_enter`, `story_panel`, `predict_answer`, `station_start`, `station_complete`, `oops_case`, `question_answer {worldId, qid, correct, attempts, hints, tag}`, `world_complete {stars}`, `boss_result`, `reflect_answer`, `level_complete`, `fast_pass`. No PII ever included.

---

## 17. Build, Deploy and Delivery

### 17.1 Environment
`.env.local.example`
```
# build-time scripts only — never prefixed with VITE_
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=Xb7hH8MSUJpSbSDYk0k2
```
`vite.config.js`: React plugin; `build.target:'es2020'`; manual chunks (`react`, `framer`, `stations-easy|medium|hard`).

### 17.2 CI (suggested)
1. `npm ci` → 2. `npm run lint` → 3. `npm test` → 4. `npm run stress` → 5. `npm run validate` → 6. `npm run build` → 7. deploy preview (Vercel).

### 17.3 Milestones and acceptance criteria
| M | Deliverables | Acceptance criteria |
|---|---|---|
| **M0 Foundation** (~3 d) | Scaffold, tokens, fonts, `core/fraction`, `speech`, `nodes`, `rng`, configs, Vitest suites, `PatternDefs`, `Frac` | All core tests green; `Frac`/`Mixed` render & read correctly in a kitchen-sink page; ARIA strings verified |
| **M1 Shell + Story** (~4 d) | App shell, reducer + persistence, Intro, Hub, Wonder, Story (9 panels, placeholders), AudioToggle top-left | Navigate Intro→Wonder→Story; reload restores; missing art shows placeholders; keyboard nav works |
| **M2 Easy slice** (~10 d) | E-A…E-D, Oops engine, E1–E4 generators, distractor engine, validate, Play shell, boss, level complete, badges | Full Easy run at 4 viewports; stress test green for E-worlds; drag has tap/keyboard alternatives; gate logic works |
| **M3 Medium** (~8 d) | M-A…M-D, M1–M4 generators, Jug/Common Ground/Crew Split, drag-order | Stress green for M-worlds; unrelated-denominator stretch items verified by independent solver |
| **M4 Hard** (~9 d) | H-A…H-D, H1–H4 generators, BarModel engine/build, Grand challenge | Bar-model validation accepts all equivalent valid builds in test corpus; H-worlds green |
| **M5 Finish** (~7 d) | Reflect, watch-list, certificate (print CSS), audio generation + atoms, art integration, a11y pass, perf pass | Release criteria in PRD §16.4 all met |

### 17.4 Definition of Done (per feature)
Unit tests added/updated · stress invariants hold · keyboard path works · reduced-motion honoured · narration parity validated · no new lint errors · checked at 1366×768 and 360×640.

### 17.5 Developer onboarding
`README.md` must document: scripts, how to add a world, how to add a question type (generator + interaction + registry + validate + stress coverage), how to add story art (drop file + manifest line), how to regenerate audio, and the **Pitfalls** from §14.

---

## Appendix A — Reducer pseudo-code (selected)
```js
case 'ANSWER_SUBMIT': {
  const { correct, tag, attempts, hints } = action.payload;
  const { level, world } = state.play.current;
  const w = state.play[level].worlds[world];
  const streak = correct ? state.scoring.streak + 1 : 0;
  const xp = correct ? calcXP(attempts, hints, streak) : 0;
  return {
    ...state,
    scoring: { ...state.scoring, xp: state.scoring.xp + xp, streak, maxStreak: Math.max(state.scoring.maxStreak, streak) },
    misconceptions: (!correct && tag) ? { ...state.misconceptions, [tag]: (state.misconceptions[tag]||0)+1 } : state.misconceptions,
    play: updateWorld(state.play, level, world, { correct: w.correct + (correct ? 1 : 0), answers: [...w.answers, { qid: action.payload.qid, correct, attempts, hints, tag }] }),
  };
}
```

## Appendix B — Station script format
```js
export const E_A = {
  id:'E-A', level:'easy', title:'Plank Splitter',
  steps:[
    { id:'brief', otto:[ 'Welcome to the shore! Every fair share starts with equal parts.' ], action:'none' },
    { id:'cut4',  otto:[ 'Cut the plank into ', {num:4}, ' equal parts.' ], action:{ type:'cut', targetN:4 } },
    { id:'shade', otto:[ 'Now shade ', {frac:{n:3,d:4}}, ' of the plank.' ], action:{ type:'shade', targetN:4, k:3 } },
    /* … */
  ],
  gate:[ { type:'name-shaded', frac:{n:2,d:6} }, { type:'name-shaded', frac:{n:5,d:8} }, { type:'fair-or-not', cuts:[0.1,0.5,0.8] } ]
};
```

## Appendix C — Open technical questions
| ID | Question |
|---|---|
| TQ-1 | Adopt TypeScript from M0 (recommended if more than one dev) or JSDoc + `ts-check`? |
| TQ-2 | Dynamic narration: Option A (atoms), B (proxy) or C (silent) for v1? |
| TQ-3 | Should progress sync anywhere (LMS/cloud) in v1.1? If yes, design the event sink contract now. |
| TQ-4 | Hosting: Vercel assumed; confirm CSP header support and function limits. |
| TQ-5 | Include a Storybook/kitchen-sink route for components (recommended: `/#/kitchen-sink` dev-only). |
