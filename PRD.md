# Fraction Isles — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Fraction Isles — a standalone, gamified Fractions module |
| **Platform family** | Intellia SG interactive math modules (Singapore MOE aligned) |
| **Version** | 1.0 (draft for review) |
| **Date** | 1 Oct 2026 |
| **Companion docs** | `TRD.md` (technical design) · `IMAGE_PROMPTS.md` (art generation prompts) |
| **Reference module** | `G7-General-and-Missing-Terms` (ScrollQuest) — used for flow, phase structure, scoring and audio conventions only. UI, theme and styling are intentionally new. |

> **How to read this document.** Sections 1–5 explain *why* and *for whom*. Sections 6–11 specify *what* is built, phase by phase. Sections 12–16 cover design system, accessibility, audio, analytics and delivery. Every learning objective has an ID (`LO-E1`…) that the TRD, question bank and station specs refer back to.

---

## 1. Product Overview

### 1.1 One-line pitch
*A storm has scattered the Fraction Isles. Share fairly, measure carefully, and rebuild three islands — one fraction at a time.*

### 1.2 What it is
Fraction Isles is a browser-based learning module that takes a student from "what is a fraction?" to "solve a multi-step fraction word problem with a bar model". It is split into **three levels — Easy, Medium, Hard — presented as three islands** (Sunrise Shore, Tidepool Reef, Summit Peak). It follows the platform's five-phase learning framework:

**Wonder → Story → Simulate → Play (Practice) → Reflect**

Like the reference module it combines a narrative, hands-on simulation stations, a large procedurally generated practice bank with boss challenges, and a reflective close-out. Unlike the reference, it is a *three-level course* rather than a single-topic lesson, so Story, Simulate and Play run once per level (the "level loop", §6).

### 1.3 Problem statement
Fractions are the point where many students first stop "seeing" maths. Common failures are well documented: believing a bigger denominator means a bigger fraction, adding numerators and denominators separately, treating "of" as a mystery word, and memorising "flip and multiply" without knowing why. Worksheets reinforce procedures but rarely let a student *see and manipulate* equal parts. A guided, concrete → pictorial → abstract (CPA) experience with immediate feedback and misconception-aware practice addresses this directly.

### 1.4 Vision
After finishing Fraction Isles, a student should be able to:
1. Explain what a fraction means using equal parts of a whole, a set, and a number line.
2. Choose and apply the right representation (bar, line, set, area, bar model) for the problem in front of them.
3. Carry out operations on fractions *and explain why they work*.
4. Catch their own mistakes by asking **Otto's Three Questions** (§5.3).

---

## 2. Goals, Non-Goals and Success Metrics

### 2.1 Goals
| ID | Goal |
|---|---|
| G1 | Teach fractions from first principles to multi-step word problems in one coherent module with three clear difficulty levels. |
| G2 | Mirror the platform's five-phase flow so it feels like part of the same course family. |
| G3 | Make every new idea *manipulable* before it is *symbolic* (CPA progression in every level). |
| G4 | Diagnose misconceptions, not just wrong answers; surface them in Reflect. |
| G5 | Be a visually distinctive, joyful product suitable for an education market (not a re-skin of the reference). |
| G6 | Run smoothly on school tablets/Chromebooks and phones, work with audio off, and be accessible. |
| G7 | Be fully data-driven (levels, worlds, stories, question templates in config) so content can be extended without touching engine code. |

### 2.2 Non-goals (v1)
- Decimals, percentages, ratio, negative fractions, algebraic fractions.
- User accounts, backend, multiplayer, teacher dashboards, LMS integration (a clean event hook is provided so these can be added later — see TRD §16).
- Handwriting recognition.
- Languages other than English (copy is localisation-ready; see §13.4).

### 2.3 Success metrics (pilot of 20–30 students, ~3 sessions)
| Metric | Target |
|---|---|
| Level completion (Easy / Medium / Hard) | ≥ 85% / ≥ 75% / ≥ 60% of students who start each level |
| Median time per level | 30–40 min (Easy), 35–45 (Medium), 40–50 (Hard) |
| First-attempt accuracy in Practice (all worlds) | ≥ 65% overall; no world below 50% (flags a content problem) |
| Reflect misconception items correct | ≥ 80% (items 1–5, §11.1) |
| Oops Desk detection rate (finds the seeded error) | ≥ 70% on first attempt |
| Self-reported enjoyment (1–5 emoji scale at end) | ≥ 4.0 average |
| Crash / blocking bug rate | 0 blocking defects in pilot |

---

## 3. Audience and Context of Use

### 3.1 Primary learners
Learners in **Grades 4–8 (roughly ages 9–14)**, spanning upper primary and lower secondary. The experience is scaffolded so younger learners can build concrete meaning while older learners can tackle multi-step reasoning and error analysis. Level mapping:

| Level | Island | Typical grade |
|---|---|---|
| Easy | Sunrise Shore | Grades 4–5 |
| Medium | Tidepool Reef | Grades 5–7 |
| Hard | Summit Peak | Grades 7–8 |

> ⚠️ **Open item OQ-1:** confirm exact grade bands and syllabus scope against the current MOE primary mathematics syllabus before content freeze. The table in §4 is drawn from general knowledge of the syllabus and must be verified.

### 3.2 Secondary users
- **Teachers / facilitators** presenting the module in class (large-screen friendly; every screen readable from the back of a room).
- **Intellia reviewers** doing internal demos (a "demo mode" jumps to any level — see TRD §5.4).

### 3.3 Personas
| Persona | Needs | Design response |
|---|---|---|
| **Aisyah, 9, Grade 4, new to fractions** | Concrete things to manipulate; short text; reassurance | Easy island, audio on, hints free, no timers |
| **Ryan, 11, Grade 6, procedure-driven** | Reasons *why* "make same denominator" works | Common Ground station, Otto's Question 2 |
| **Priya, 14, Grade 8, fast but careless** | Catch slips; avoid rushing; explain reasoning | Oops Desk, Otto's Three Questions, echo questions |
| **Mr. Tan, teacher** | Projectable, 30–40 min per level, clear misconception report | Level loop, Reflect summary |

### 3.4 Devices and environment
- Primary: school tablets (1024×768, 1280×800), Chromebooks (1366×768 — a *short* viewport), phones in portrait (≥360×640).
- Touch, mouse and keyboard must all work. Audio may be off or unavailable.

---

## 4. Curriculum Alignment and Learning Objectives

> Verify against the current MOE syllabus (OQ-1). Denominators are capped at **12** throughout Easy and Medium, matching typical primary scope.

### 4.1 Learning objectives

**Easy — Sunrise Shore**
| ID | Objective |
|---|---|
| LO-E1 | Recognise that fractions require **equal** parts of a whole; identify and create equal parts. |
| LO-E2 | Name and read unit and non-unit fractions (numerator / denominator meaning). |
| LO-E3 | Place and read fractions on a 0–1 number line (extended to 0–2 for stretch items). |
| LO-E4 | Recognise equivalent fractions with the help of a fraction wall (halves↔fourths↔sixths…). |
| LO-E5 | Compare fractions with like denominators, like numerators, and against ½. |
| LO-E6 | Add and subtract fractions with like denominators within one whole. |

**Medium — Tidepool Reef**
| ID | Objective |
|---|---|
| LO-M1 | Convert between improper fractions and mixed numbers. |
| LO-M2 | Express fractions in simplest form (using common factors). |
| LO-M3 | Compare and order fractions with unlike denominators (related first, then unrelated). |
| LO-M4 | Add and subtract fractions with related denominators, incl. mixed numbers. |
| LO-M5 | Find a fraction of a set; express part of a set as a fraction. |

**Hard — Summit Peak**
| ID | Objective |
|---|---|
| LO-H1 | Multiply a fraction by a whole number, and a fraction by a fraction (area model → rule). |
| LO-H2 | Divide a fraction by a whole number; divide a whole number by a fraction (counting "how many fit"). |
| LO-H3 | Divide a fraction by a fraction in unit-based cases; understand why "multiply by the reciprocal" works. |
| LO-H4 | Solve multi-step fraction word problems using bar models (remainder, before/after, "of the remainder"). |
| LO-H5 | Detect, explain and correct common fraction errors. |

### 4.2 Skill coverage map (where each LO is taught and tested)
| LO | Story | Simulate station | Play world |
|---|---|---|---|
| LO-E1, E2 | Ch.1 P2–P3 | E-A Plank Splitter | E-W1 |
| LO-E3 | Ch.1 P3 | E-A (extension) | E-W2 |
| LO-E4, E5 | Ch.1 P3 | E-B Fraction Wall | E-W3 |
| LO-E6 | Ch.1 P3 | E-C Supply Boat | E-W4 |
| LO-M1, M2 | Ch.2 P3 | M-A Jug Filler | M-W1 |
| LO-M3 | Ch.2 P1–P2 | M-B Common Ground | M-W2 |
| LO-M4 | Ch.2 P1–P2 | M-B Common Ground | M-W3 |
| LO-M5 | Ch.2 P3 | M-C Crew Split | M-W4 |
| LO-H1 | Ch.3 P1 | H-A Slice of a Slice | H-W1 |
| LO-H2, H3 | Ch.3 P2 | H-B Share the Bridge | H-W2 |
| LO-H4 | Ch.3 P3 | H-C Bar Model Workshop | H-W3 |
| LO-E*/M*/H5 | — | Oops Desk (E-D, M-D, H-D) | H-W4 + bosses |

---

## 5. Pedagogical Approach

### 5.1 Principles
1. **CPA progression** — every level starts with something to drag/cut/pour, then pictures, then symbols only.
2. **Equal parts first** — the single most important idea; Easy station A will not let a student "name" a share until the parts are equal.
3. **Misconception-aware design** — every wrong option in practice is tied to a named misconception tag (TRD §8.4). Tags drive feedback copy, Oops Desk cases, echo questions and the Reflect summary.
4. **Productive struggle with a safety net** — two hints per question, kind feedback, no punishment for wrong answers beyond reduced XP.
5. **Mastery gating** — the next island unlocks after demonstrated competence, not time spent (§9.4).
6. **Reasons before rules** — "flip and multiply" is shown only *after* a student has counted how many pieces fit.
7. **Low pressure** — timers are optional replay modes only; never in Story, Simulate or first-time Practice.

### 5.2 Central throughline (parallel to the reference's "choose the right tool")
> *"Before you answer, check the pieces."* — Students learn to pause and run a three-question check before committing to an answer.

### 5.3 Otto's Three Questions (the recurring habit)
| # | Question | Where it matters |
|---|---|---|
| **1** | **Are the pieces equal?** | Naming fractions, number lines, models |
| **2** | **Are the pieces the same size?** *(when combining/comparing)* | Adding, subtracting, comparing, ordering |
| **3** | **Is it in simplest form — and does the answer make sense?** | Final answers, estimates, "should it be bigger or smaller?" |

Otto asks these in Story (introduced one per chapter), prompts them in Simulate, offers them as hints in Play, and tests them in Reflect.

### 5.4 Feedback philosophy
- Correct: brief celebration + one-line reason ("Yes — 3 equal parts, 2 taken").
- Incorrect: *name the misconception gently* using the distractor's tag ("Looks like you added the bottom numbers — pieces of different sizes can't be counted together yet").
- Hint 1 = nudge to the right representation. Hint 2 = a worked partial step. Never the answer.

---

## 6. Experience Flow

### 6.1 Level loop (key design decision D-01)
The reference runs its phases once. Fraction Isles has three levels, so:

- **Intro** and **Wonder** run once at the start.
- **Story → Simulate → Play** run **once per level** (Ch.1/Easy, then Ch.2/Medium, then Ch.3/Hard).
- **Reflect** runs once at the end and covers all three levels.

The header keeps the five phase pills (platform consistency) and adds a **level chip** (Easy / Medium / Hard). Finishing Play for a level triggers a short "sail to the next island" transition into the next level's Story. Any unlocked level/phase can be revisited from the header or hub map.

> *Config switch:* `features.flow = 'levelLoop' | 'linear'` (TRD §5.3). `linear` runs all Stories → all Simulations → all Practice, if reviewers prefer a literal five-phase pass. Content is identical either way.

### 6.2 Journey diagram
```
INTRO ─▶ WONDER ─▶ ┌──────────────── LEVEL LOOP (×3) ────────────────┐ ─▶ REFLECT
 (hub)   (once)    │  STORY ch.N ─▶ SIMULATE (4 stations) ─▶ PLAY     │    (once)
                   │   3 panels      A · B · C · D(Oops)    4 worlds  │
                   │                                         + Boss   │
                   └──────────── gate → next island ──────────────────┘
                                                             Grand Storm Challenge (optional) ─▶ Certificate
```

### 6.3 Screen inventory
| # | Screen | Notes |
|---|---|---|
| S1 | Intro / Title | Key art, Play / Continue, nickname (local only), audio toggle |
| S2 | Archipelago Hub | Three islands with restoration state, level chips, "Continue" button |
| S3 | Wonder | Storm Map hook (3 gut-feel taps) + optional Placement Check |
| S4 | Story | Full-bleed panel art + caption card, tap-to-predict moment, 3 panels per chapter |
| S5 | Simulate | 4 stations (A–D) with Otto side panel and step tracker |
| S6 | Play – World Board | Island map with 4 landmark worlds + boss gate |
| S7 | Play – Question | Question card + interaction area + hints + feedback overlay |
| S8 | Boss / Storm Challenge | 3 lives, 5 questions |
| S9 | Level Complete | Stars, XP, badges, island restoration animation |
| S10 | Reflect | 5 misconception questions, learner log, scorecard |
| S11 | Certificate | Island Architect certificate (printable via browser print) |

---

## 7. Narrative and Characters

### 7.1 Premise
A big storm has torn through the Fraction Isles. Bridges are snapped, supplies scattered, and nothing fits where it used to. Two young **Island Architects** arrive to help the villagers rebuild — by sharing fairly and measuring carefully.

### 7.2 Characters (names are placeholders — OQ-3)
| Character | Role | Habit (learning contrast) | Colour |
|---|---|---|---|
| **Mei** (10) | Picture-thinker, always sketching | Draws a model first; sometimes slow to commit to numbers | Coral |
| **Danish** (11) | Quick, confident, jumps to numbers | Rushes and makes classic slips (adds denominators) | Sun yellow |
| **Otto the Otter** | Island guide & mascot | Calmly asks the Three Questions; never gives the answer | Lagoon teal |

Mei and Danish mirror the reference's contrasting-apprentices device (picture vs number) without copying its characters or tools.

### 7.3 Voice and tone
Warm, short sentences, active verbs, Singapore English spelling (colour, metre). Otto speaks in questions. No sarcasm, no shaming. Reading level ≈ P3–P4 for Easy, slightly higher for Hard.

---

## 8. Phase Specifications

### 8.1 Intro / Hub (S1, S2)
- Title card "Fraction Isles", key art (`IMG-00`), buttons **Start** / **Continue** (if saved progress).
- Optional **nickname** (max 12 chars, stored locally only, no PII).
- Hub shows three islands; each has a *restoration meter* (0–100%) and three phase badges (Story ✓, Sim ✓, Play ✓).
- Audio toggle fixed **top-left on every screen** (platform spec).

### 8.2 Wonder (S3)
**Purpose:** spark curiosity; surface gut-feel misconceptions *without scoring*.

**Title:** "The Storm Scattered the Isles!"

**Flow (all unscored):**
| Beat | Prompt | Visual | Reveal |
|---|---|---|---|
| W1 | "Two friends share the same pizza. Mei gets **⅓**, Danish gets **¼**. Who gets more?" | Two identical circles, one cut in 3, one in 4 (shaded 1 piece each) | Overlay shows ⅓ covering more; "More pieces → *smaller* pieces." |
| W2 | "Which plank is longer — **½** of a plank or **⅔** of the same plank?" | Two bars | Slide one over the other to compare |
| W3 | "Is **⅝** closer to **0**, **½** or **1**?" | 0–1 number line | Marker snaps to ≈ ⅝ just above ½ |

Otto closes: *"Today you'll learn to tell fractions apart, add them, share them — and always check the pieces."* CTA: **Set Sail ⛵**.

**Optional Placement Check (Fast Pass):** after W3, a "Skip ahead?" button offers 3 quick questions (one from each level). Getting 3/3 unlocks **Medium** immediately (Easy stays available). Otherwise, play begins at Easy. Never mandatory.

**Narration:** full script pre-generated (TRD §12).

### 8.3 Story (S4) — 3 chapters × 3 panels

**Layout:** full-bleed 16:9 panel image; caption card across the lower third (≈28% height — art is composed with calm space there); title chip top-left; narration plays automatically (toggle off supported). Each panel ends with a **Core Idea** strip. Panels 1 and 3 of each chapter contain one **tap-to-predict** moment (a 2–3 option question, unscored, revealed on next panel).

Navigation: ← → buttons, swipe, keyboard arrows. Finishing panel 3 enters Simulate for that level.

#### Chapter 1 — *The Uneven Plank* (Sunrise Shore · Easy)

**Panel 1 — "Storm on Sunrise Shore" 🌊** (`IMG-C1P1`)
> The storm had passed, but Sunrise Shore was a mess. Mei and Danish found the old village bridge snapped in two, with one long plank left on the sand. "The four families need a piece each to mend their boats," said Mei. "I can cut it in four right now!" Danish grinned, already holding his measuring tape. Chop, chop, chop — and the plank fell into four pieces. Otto the Otter waddled over and tilted his head.

*Core Idea:* 🪵 One whole plank · four families · Is it fair?
*Predict:* "Will every family get the same amount of plank?" (Yes / No / Not sure)

**Panel 2 — "Not Fair!" 😮** (`IMG-C1P2`)
> Four pieces lay on the sand — one was long, one was tiny, and two were somewhere in between. "Oh no," said the smallest family. "Our piece is hardly a piece at all!" Otto held up his little ruler. "Before we name a share, we ask my first question: are the pieces equal?" Danish scratched his head. "Equal… as in exactly the same size?" "Exactly," said Otto. "Fair shares are equal shares."

*Core Idea:* ⚖️ Fair share = EQUAL parts · **Otto's Question 1: Are the pieces equal?**

**Panel 3 — "Naming the Share" 🏷️** (`IMG-C1P3`)
> This time Mei drew the cut lines first, and they measured twice. Now the plank made four equal parts. "One family's piece is one out of four equal parts," said Mei. "We write it as one quarter." Danish pointed to the bottom number: "That's how many equal parts make the whole." Mei tapped the top number: "And that's how many parts we take." Three pieces for the boat builders? That's three quarters!

*Core Idea:* 🏷️ Bottom number = equal parts in the whole · Top number = parts we take
*Predict:* "If a plank is cut into 8 equal parts and you take 5, what do we write?" (⁵⁄₈ / ⁸⁄₅ / ⁵⁄₃)

#### Chapter 2 — *The Mismatched Pieces* (Tidepool Reef · Medium)

**Panel 1 — "Two Halves That Don't Match" 🌉** (`IMG-C2P1`)
> The friends sailed to Tidepool Reef, where the bridge between two rock pools needed mending. Danish carried half a plank. Mei carried a quarter of a plank. "Let's add them!" said Danish. "One half plus one quarter is… two out of six?" He had added the top numbers and the bottom numbers. Otto shook his head so hard his life vest bounced. "That would make your plank *smaller* than half. Something is wrong!"

*Core Idea:* 🌉 ½ + ¼ ≠ ²⁄₆ · Pieces can only be added when they are the SAME size
*Predict:* "Is ²⁄₆ more or less than ½?" (More / Less / Same)

**Panel 2 — "Re-slice to Match" 🔪** (`IMG-C2P2`)
> Otto laid the half-plank and the quarter-plank side by side. "Pieces can only be counted together when they are the same size," he explained. "Ask my second question: are the pieces the same size?" Mei re-sliced the half into two quarters. Now every piece was a quarter: two quarters and one quarter made three quarters. "The size of the pieces stays the same — only the counting changes," Mei smiled. "We found a common denominator!"

*Core Idea:* 🧩 **Otto's Question 2: Same-size pieces?** Re-slice to a common denominator, then add

**Panel 3 — "Jugs Full and Not Quite Full" 🫙** (`IMG-C2P3`)
> At the reef's freshwater spring, villagers brought jugs to fill. Seven quarters of water poured out — more than one jug can hold! Danish filled one jug to the top and had three quarters left over. "One whole jug and three quarters," Mei said. "Seven quarters and one and three quarters are the very same amount." Otto nodded and added a third question for tidy answers: "Can the fraction be made simpler?" Six eighths became three quarters when the friends grouped the slices.

*Core Idea:* 🫙 Improper ⇄ mixed number · **Otto's Question 3: Is it in simplest form?**

#### Chapter 3 — *The Shrinking Share* (Summit Peak · Hard)

**Panel 1 — "Half of a Half" ⛰️** (`IMG-C3P1`)
> At the top of Summit Peak, the friends found half a loaf of mountain bread left in the beacon keeper's hut. "Can we take half of that?" asked Danish. Mei drew a bar: half shaded, then split it in two. "Half of a half is one quarter," she said. "The word OF is telling us to multiply: one half times one half equals one quarter." Danish checked: a share of a share is always smaller.

*Core Idea:* ⛰️ A fraction OF a fraction → multiply · ½ × ½ = ¼
*Predict:* "Will ⅔ of ¾ be bigger or smaller than ¾?" (Bigger / Smaller)

**Panel 2 — "How Many Pieces Fit?" 🪢** (`IMG-C3P2`)
> The last rope bridge needed three long ropes cut into quarter-length pieces. "How many quarter-length pieces will we get?" Danish asked. Mei laid a rope along the ground and marked four pieces. "One rope gives four. Three ropes give twelve!" "So three divided by one quarter is twelve," said Otto. "Dividing by a fraction asks: how many of these pieces fit inside?"

*Core Idea:* 🪢 3 ÷ ¼ = 12 · Dividing by a fraction counts how many pieces fit

**Panel 3 — "The Bar Model Blueprint" 📐** (`IMG-C3P3`)
> Now the Summit Peak beacon needed a plan. The friends spread a big blueprint over the rocks. "A third of the beams will go to the platform, and half of what's left to the stairs. Eight beams remain. How many did we start with?" Mei drew a bar, split it into thirds and shaded the platform. Danish split the leftover in half. "Three equal boxes, and the last one is 8 beams," he said. "So the whole bar is 3 × 8 = 24!" Otto beamed. "Draw first, calculate second. That's how great architects solve big problems."

*Core Idea:* 📐 Draw the bar model first · Same-size boxes make hard problems easy

> The Story's sums were checked: ½+¼ = ¾ ✔; 7/4 = 1¾ ✔; 6/8 = 3/4 ✔; ½×½ = ¼ ✔; 3÷¼ = 12 ✔; platform T/3, stairs ½ of 2T/3 = T/3, left T/3 = 8 ⇒ T = 24 ✔.

### 8.4 Simulate (S5) — 4 stations per level

**Shared station rules** (parallel to the reference's Simulate phase)
- Tabs A–D; a tab unlocks when the previous station is complete; Previous/Next footer.
- Each station opens with an **Otto briefing** (1–2 sentences, narrated) → **guided steps** → **free try** → **confirmation gate** ("Show me you've got it" mini-check, 2–3 items) → **station complete**.
- Wrong moves produce *visible physical feedback* first (pieces wobble, boat tilts, wall gaps glow) and text second.
- No time pressure. Hints are free and unlimited in Simulate.
- **Oops Desk** (station D) is a single reusable engine with a different case set per level.

#### Easy — Sunrise Shore
| Station | Name | LO | Interaction | Gate |
|---|---|---|---|---|
| **E-A** | **Plank Splitter** | E1, E2, (E3) | A plank (the whole) with a **cut tool**. Student chooses/drag-places cut lines to match a target *n* (n = 4, then 6, then free choice of 2–8). A live **Equal Meter** compares segment lengths: unequal → pieces wobble, red "≠" tags; all within ±3% → pieces glow green and "snap" to exact. Student then drags to **shade k pieces**; the fraction builds on screen with the numerator and denominator colour-coded and captioned ("parts taken", "equal parts in whole"). Final round drops the plank onto a 0–1 number line to link the ideas. | 3 rounds complete + 3-item check ("name this shaded fraction" ×2, "is this split fair?" ×1) |
| **E-B** | **Fraction Wall** | E4, E5 | A colour/pattern-coded wall (rows for 1, ½, ⅓, ¼, ⅕, ⅙, ⅛, ⅒, ⅟₁₂). A slidable **ruler line** lets the student find matching rows (½ = ²⁄₄ = ³⁄₆ = ⁴⁄₈…). Guided discovery: "What do you notice about the top and bottom numbers when ½ becomes ³⁄₆?" (select: *both multiplied by 3*). A **comparison scale** lets the student drop two pieces to see <, >, =. | Find 3 equivalent sets + compare 3 pairs |
| **E-C** | **Supply Boat** | E6 | A boat whose capacity is **1 whole** (shown as a bar). Crates carry like-denominator fractions (e.g. ³⁄₈, ²⁄₈). Drag crates aboard to fill exactly; over-fill makes the boat tilt/shake; **subtraction mode** unloads crates. An equation strip updates live (³⁄₈ + ²⁄₈ = ⁵⁄₈). | 3 trips: add to full, add partial, unload |
| **E-D** | **Oops Desk (Easy)** | E1–E6 | Four "Student Work" cards, each with a seeded error. Student reads it, taps **Right / Needs fixing**, picks *why* from 3 explanation cards, then **fixes it** with the relevant manipulable. See §8.5. | Find & fix all 4 |

#### Medium — Tidepool Reef
| Station | Name | LO | Interaction | Gate |
|---|---|---|---|---|
| **M-A** | **Jug Filler** | M1, M2 | Jugs hold exactly **1**. Student pours slices (¼, ⅕ …) from a tap: ⁷⁄₄ fills 1 jug + ¾ of a second; the mixed number label builds automatically. Reverse mode: given 2 ⅓ jugs, how many thirds? **Shrink Ray** for simplification: groups equal slices into bigger ones (⁶⁄₈ → groups of 2 → ³⁄₄); the ray stops when no larger group size works ("simplest form"). | 3 improper↔mixed + 3 simplify tasks |
| **M-B** | **Common Ground** | M3, M4 | Two bars with different partitions (½ and ¼, then ⅓ and ½, then mixed numbers). Student uses a **re-slice slider** until both bars share the same piece size; a "Common Ground" meter lights up. Then add/subtract by counting pieces. Comparison and ordering mode: re-slice three bars and drag them in order. Unrelated denominators (⅓ + ½) reveal the LCM idea (sixths). | 2 related, 1 unrelated, 1 mixed-number task |
| **M-C** | **Crew Split** | M5 | A set of items (crabs, boats, baskets) in a grid. To find **¾ of 24**: drag items into **4 equal groups** (denominator), highlight **3 groups** (numerator), count. Reverse mode: 15 of 20 highlighted → what fraction → group by common factor → ¾. | 3 forward + 2 reverse |
| **M-D** | **Oops Desk (Medium)** | M1–M5 | See §8.5. | Find & fix all 4 |

#### Hard — Summit Peak
| Station | Name | LO | Interaction | Gate |
|---|---|---|---|---|
| **H-A** | **Slice of a Slice** | H1 | An area model (grid). Step 1: shade **½** of the region vertically. Step 2: take **⅔ of that part** horizontally. The overlap lights up; student counts overlap cells ÷ total cells → ²⁄₈ → ¼. Then reveals "multiply tops, multiply bottoms". **Whole × fraction** as repeated addition: 3 × ⅔ = ⅔ + ⅔ + ⅔. Simplify-before-multiplying shown as cancelling cells. | 3 fraction×fraction + 2 whole×fraction |
| **H-B** | **Share the Bridge** | H2, H3 | **Whole ÷ fraction:** a bridge 3 units long; slide ¼-unit rope pieces along it, a counter ticks to 12. **Fraction ÷ whole:** ½ a plank shared among 3 → each gets ⅙ (partition model). **Fraction ÷ fraction:** ¾ ÷ ¼ = 3 by fitting. After three examples, a **"Why flip?"** reveal connects counting to × reciprocal. | 2 whole÷fraction, 1 fraction÷whole, 2 fraction÷fraction |
| **H-C** | **Bar Model Workshop** | H4 | Build a bar model from a word problem. Stage 1: pre-drawn bar, student labels and finds the unknown. Stage 2: student draws the bar (drag/split/shade tools), marks `?`, then solves. Problem types: *remainder* (⅓ spent, ½ of the rest), *before/after*, *comparison* ("A is ⅔ of B"). | 3 problems (1 per type) |
| **H-D** | **Oops Desk (Hard)** | H1–H5 | See §8.5. | Find & fix all 4 |

### 8.5 Oops Desk (error-detective engine)
Parallel to the reference's "Forger's Fake Restoration" station.

**Case flow:** 1) Student work shown → 2) **Right / Needs fixing?** → 3) pick the *reason* from 3 cards (1 correct, 2 plausible) → 4) **Fix it** using the station's manipulable → 5) Otto confirms and relates it to a Three-Question.

| Level | Case | Seeded error (misconception tag) |
|---|---|---|
| Easy | 1 | A plank cut into 4 unequal pieces is labelled ¼ each (`UNEQUAL_PARTS_OK`) |
| Easy | 2 | "⅓ > ½ because 3 > 2" (`BIG_DENOM_BIG_FRACTION`) |
| Easy | 3 | "²⁄₈ + ³⁄₈ = ⁵⁄₁₆" (`ADD_DENOMINATORS`) |
| Easy | 4 | Number line cut into 5 intervals (0 to 1): student places ⅗ at the *third tick mark counting 0 as the first*, i.e. at ²⁄₅ (`NUMLINE_COUNT_MARKS`) |
| Medium | 1 | "½ + ⅓ = ²⁄₅" (`ADD_DENOMINATORS`) |
| Medium | 2 | "2 ¾ = ⁵⁄₄" (adds 2+3) (`MIXED_TO_IMPROPER_ADD`) |
| Medium | 3 | "Simplify ⁶⁄₈ → ³⁄₈" (`SIMPLIFY_PARTIAL`) |
| Medium | 4 | "⅗ of 20 = 4" (took one part only) (`OF_MEANS_ONE_PART`) |
| Hard | 1 | "¼ × ½ = ¼" or "= ²⁄₆" (`MULT_ADD_CONFUSION`) |
| Hard | 2 | "3 ÷ ¼ = ¾" (`DIV_WHOLE_BY_FRACTION_SHRINKS`) |
| Hard | 3 | "½ ÷ 3 = ³⁄₂" (`FLIP_WRONG`) |
| Hard | 4 | Bar-model: remainder treated as a fraction of the *original* (`BAR_WRONG_WHOLE`) |

### 8.6 Play / Practice (S6, S7, S8)

**Structure:** per level, **4 worlds × 10 questions = 40 questions**, plus **1 boss challenge (5 questions, 3 lives)**. Optional **Grand Storm Challenge** (8 mixed questions across all levels, 3 lives) after Hard.

Totals: 120 world questions + 15 boss questions + 8 grand = **143 procedurally generated questions**.

**World Board:** island map with four **landmark nodes** (Dock, Boardwalk, Market, Supply Hut for Easy, etc.) plus a **Storm Gate** (boss) that opens after all four worlds have ≥1 star. Each completed world "rebuilds" its landmark on the island art (§9.3).

**Per-question flow:** question card (category tag, prompt, optional visual) → interaction → **Check** → feedback overlay (≈2.2 s, auto-advance on correct; wrong answers show the misconception message and then advance, as in the reference) → next. Navigation: previous within a world allowed, as in the reference. Hints: 2 per question with XP penalty.

**Modes** (adapted from the reference's `PLAY_MODES`):
| Mode | Description | Availability |
|---|---|---|
| **Adventure** (default) | 10 Qs, 2 hints each, no timer | First pass of every world |
| **Independent** | 10 Qs, no hints; counts toward 3-star mastery | Replay (unlocked after Adventure) |
| **Timed Sprint** | 8 Qs / 60 s, pausable, never required | Replay (opt-in) |
| **Storm Challenge (boss)** | 5 hard-tier Qs, 3 lives | After a level's worlds |

#### 8.6.1 World catalogue
Each world is 10 questions in a difficulty ramp (Q1–3 scaffolded with a visual, Q4–7 core, Q8–10 stretch/word problem). 2 "echo" slots (Q9–10 of worlds 2–4 per level) replay the previous world's most-missed misconception tag.

##### EASY — Sunrise Shore
| World | Name | LO | Game mechanic | Question types | Key constraints |
|---|---|---|---|---|---|
| **E-W1** | **Equal Parts & Names** 🪵 *(Dock)* | E1, E2 | **Slice Right:** cut the shape so it matches the fraction asked; or tap whether a split is fair | mcq, slice-cut, shade-tap, entry (n/d) | Denominators ∈ {2,3,4,5,6,8,10,12}; unit & non-unit; shapes: bar, circle, rectangle |
| **E-W2** | **Fractions on a Line** 🧭 *(Boardwalk)* | E3 | **Number Line Dash:** drag the flag to the exact spot / read the flag | number-line-place, mcq, entry | Line 0–1 (d ≤ 12); last 2 Qs on 0–2; tick marks vs intervals tested |
| **E-W3** | **Equivalent & Compare** 🧱 *(Market)* | E4, E5 | **Catch the Equal** (tap equivalent fractions as they drift by) + **Balance Scale** (<, >, =) | tap-select, scale-compare, mcq | Equivalents among {½,⅓,¼,⅕} multiples up to /12; same-denominator, same-numerator, vs ½ |
| **E-W4** | **Add & Subtract Like** 📦 *(Supply Hut)* | E6 | **Crate Stack:** drag crates to match a total | crate-stack, entry (n/d), mcq, word | Like denominators; sum ≤ 1 (may equal 1); d ≤ 12 |
| **Boss** | **The Lopsided Crab** 🦀 | E1–E6 | Crab's claws "cut unequal planks"; calm it by answering | mixed | Rewards **Calm Badge** |

##### MEDIUM — Tidepool Reef
| World | Name | LO | Game mechanic | Question types | Key constraints |
|---|---|---|---|---|---|
| **M-W1** | **Improper, Mixed & Simplest** 🫙 *(Jug Fountain)* | M1, M2 | **Jug Match** (drag improper ↔ mixed) + **Shrink Ray** | jug-match, entry (mixed / n/d), shrink-chain | d ≤ 12; improper up to 4 wholes; gcd chains of 1–2 steps |
| **M-W2** | **Order Unlike** 🌊 *(Tide Steps)* | M3 | **Order the Tide:** drag 3–4 fractions into ascending/descending order | drag-order, scale-compare | Related denominators first; unrelated (⅔, ¾, ⁵⁄₆) from Q6; benchmarks ½ and 1 |
| **M-W3** | **Add & Subtract Unlike** 🌉 *(Stilt Bridge)* | M4 | **Common Ground Challenge:** re-slice then add/subtract | entry, mcq, bar-reslice | One denominator a multiple of the other; mixed numbers without regrouping then with regrouping (Q8–10) |
| **M-W4** | **Fraction of a Set** 🦀 *(Crab Nursery)* | M5 | **Crew Split:** group & count | set-group, entry, word | Set size multiple of denominator; reverse "what fraction?" with simplest-form |
| **Boss** | **The Tangle Kraken** 🐙 | M1–M5 | Tentacles with mismatched pieces; calm it with correct answers | mixed | Includes 1–2 unrelated-denominator stretch items |

##### HARD — Summit Peak
| World | Name | LO | Game mechanic | Question types | Key constraints |
|---|---|---|---|---|---|
| **H-W1** | **Multiply** ⛰️ *(Terraces)* | H1 | **Slice of a Slice challenge** (area grid) | area-shade, entry, mcq | whole×frac, frac×whole, frac×frac, simplify-before-multiply; mixed × whole stretch |
| **H-W2** | **Divide** 🪢 *(Rope Bridges)* | H2, H3 | **Fit-the-Pieces:** count how many fit | fit-count, entry, mcq | Unit-fraction divisors first; ¾ ÷ ¼ style; "why flip" explanation Qs |
| **H-W3** | **Bar Model Problems** 📐 *(Blueprint Tower)* | H4 | **Build the bar, then answer** | bar-model-build, entry | 2-step; remainder, before/after, comparison; whole-number answers only |
| **H-W4** | **Mixed & Spot the Slip** 🔍 *(Summit Beacon)* | H1–H5 | Mixed review incl. **Spot the Slip** (find the error in a worked solution) | error-spot, mixed | Draws on echo tags from all Hard worlds |
| **Boss** | **The Storm Colossus** ⛈️ | H1–H5 | Final stand of the storm; 3 lives | mixed | Rewards **Beacon Badge** |
| **Grand** | **The Great Storm** 🌪️ *(optional)* | all | 8 mixed Qs across all levels, 3 lives | mixed | Awards **Island Architect Trophy** |

> **Boss framing:** bosses are "storm creatures" the learner *calms* with correct answers. No violence; defeat = "storm calms and the creature swims/floats away".

#### 8.6.2 Question quality requirements
1. Every question has: category tag, prompt (structured, speakable), 2 hints, explanation, correct answer, tagged distractors (mcq) or diagnostics (entry/interactive), difficulty 1–3.
2. **No two options may be equivalent fractions** unless the question is about equivalence/simplest form (TRD §8.5).
3. All answers are exact (integer arithmetic, no floating point).
4. No repeat of the same question signature within a world or within a session replay.
5. Word problems use Singapore-relevant contexts (kaya toast, MRT, school fair, hawker centre, beach, gardens by the bay-style parks) mixed with island-story contexts; avoid brand names.
6. A generated question must satisfy the world's constraints table; failures are bugs caught by the stress test.

### 8.7 Reflect (S10, S11)

#### 8.7.1 Misconception Check (5 questions, unscored for stars; shown with explanations)
| # | Question | Correct | Tag covered |
|---|---|---|---|
| R1 | "Mei says ¼ is bigger than ⅓ because 4 is bigger than 3. What's the mistake?" | The more equal parts a whole is cut into, the smaller each part is — so ⅓ is bigger than ¼. | `BIG_DENOM_BIG_FRACTION` |
| R2 | "Danish says ⅓ + ¼ = ²⁄₇. What should he do first?" | Re-slice both into same-size pieces (twelfths) before adding. | `ADD_DENOMINATORS` |
| R3 | "Which shows ¹⁷⁄₅ as a mixed number?" | 3 ²⁄₅ *(distractors: 2 ³⁄₅, 3 ⁵⁄₂)* | `IMPROPER_REMAINDER_MISUSE` |
| R4 | "What does the word *of* mean in '¾ of 24'?" | Multiply: find 1 part (24 ÷ 4), then take 3 parts. | `OF_MEANS_ONE_PART` |
| R5 | "Why does 3 ÷ ¼ give 12, a bigger number?" | Each whole holds 4 quarter-pieces, so 3 wholes hold 12 pieces. | `DIV_WHOLE_BY_FRACTION_SHRINKS` |

#### 8.7.2 Learner's Log
Prompt: *"Explain to Otto why ⅓ is bigger than ¼. Use words, or pick a picture sticker."* Free text (max 300 chars) + optional picture-sticker chooser (bar, circle, number line). Stored locally; no network. *(Stretch: simple drawing pad.)*

#### 8.7.3 Scorecard & Misconception Summary
- Per-level stars, XP, accuracy, best streak, bosses calmed.
- **"Watch-list"**: the top 2–3 misconception tags the learner triggered most (friendly wording, e.g. *"You sometimes add the bottom numbers. Remember: same-size pieces first!"*) — derived from the tag log (TRD §8.4).

#### 8.7.4 Certificate
Printable (browser print stylesheet) **Island Architect** certificate with nickname, date, level medals (Bronze/Silver/Gold by average stars), and Otto's sign-off.

---

## 9. Gamification and Progression

### 9.1 XP (aligned with the reference formula)
```
base      = 12 if attempts==1; 8 if 2; 5 otherwise
penalty   = 2 × hintsUsed
streakBonus = 10 if streak ≥ 5; 5 if streak ≥ 3; else 0
xp = max(2, base − penalty + streakBonus)
```
Simulate stations award a flat completion XP (25) — not question-based.

### 9.2 Stars (per world, 10 questions)
≥ 9 correct → ⭐⭐⭐ · ≥ 7 → ⭐⭐ · ≥ 5 → ⭐ · otherwise 0. Level medal: Bronze (avg ≥ 1), Silver (≥ 2), Gold (≥ 2.7).

### 9.3 Island restoration (replaces a generic progress bar)
Each world cleared (≥1 star) restores a **landmark** on that island; boss victory lights the **lighthouse/beacon**; island art cross-fades from *storm-damaged* to *restored* by percentage. Landmarks: 

| Island | W1 | W2 | W3 | W4 | Boss |
|---|---|---|---|---|---|
| Sunrise Shore | Dock | Boardwalk | Market stalls | Supply hut | Lighthouse |
| Tidepool Reef | Jug fountain | Tide steps | Stilt bridge | Crab nursery | Reef lantern |
| Summit Peak | Terraces | Rope bridges | Blueprint tower | Summit beacon | Storm gate opens |

### 9.4 Gates
| Gate | Rule |
|---|---|
| Medium unlocked | Easy: all 4 stations complete **and** ≥ 2 stars in ≥ 3 of 4 worlds **and** boss attempted. *(Fast Pass from Wonder unlocks Medium immediately.)* |
| Hard unlocked | Same on Medium |
| Grand Challenge | All 3 bosses calmed |
| Reflect | Hard Play started (not required to finish) — encourages closure; certificate requires all 3 levels |
A "Need more practice?" Otto message suggests replaying a world if the gate isn't met (never a hard block for > 1 retry — "Skip with help" option appears after 3 failed attempts to avoid frustration).

### 9.5 Badges
| ID | Icon | Name | Trigger |
|---|---|---|---|
| first_cut | ✂️ | First Cut | First correct answer in Play |
| equal_eye | 👁️ | Equal Eye | Complete E-A without an unequal-submit |
| wall_builder | 🧱 | Wall Builder | Complete E-B |
| bridge_builder | 🌉 | Bridge Builder | Complete all Medium stations |
| oops_spotter | 🔍 | Oops Spotter | Find all 12 seeded errors (across levels) |
| steady_tide | 🌊 | Steady Tide | Streak of 5 |
| storm_streak | ⚡ | Storm Streak | Streak of 10 |
| island_restored | 🏝️ | Island Restored | 3 stars in any world |
| storm_calmer | ⛈️ | Storm Calmer | Calm any boss |
| island_architect | 🏆 | Island Architect | Complete the full journey |

---

## 10. UX Requirements

### 10.1 Global shell
- **Top-left:** audio toggle (platform requirement; present on *every* screen incl. Intro).
- **Top-centre:** five phase pills + level chip.
- **Top-right:** XP, streak flame, stars.
- **Home** returns to the hub (not a hard reset). Progress persists (§TRD 5.6).
- Content scrolls inside cards on short viewports; no body overflow-hidden that clips content.

### 10.2 Layout per phase
| Phase | Layout |
|---|---|
| Wonder | Centred hero card, big tappable choices, Otto bottom-left |
| Story | Full-bleed art, caption card (bottom third), dots + arrows, narration progress |
| Simulate | Two-column on ≥ 900 px: *Stage* (left, ≈ 65%) + *Otto Panel / step tracker* (right). Single column on phones (Otto becomes a collapsible bar). |
| Play | Question card on top, interaction canvas below, hint/check bar fixed at bottom |
| Reflect | Single-column cards; scorecard as a "postcard" |

### 10.3 Interaction principles
- Drag interactions always have a **tap/keyboard alternative** (e.g., tap piece → tap target; arrow keys to nudge).
- Tap targets ≥ 48×48 px; spacing ≥ 8 px.
- Immediate, *physical* feedback (wobble, glow, snap) within 100 ms; text feedback second.
- Never rely on colour alone — each denominator has a **colour + pattern** (see §12.2).
- Fractions are always rendered **stacked** (numerator over bar over denominator) via a `<Frac>` component — never as "1/2" text — except in screen-reader labels.
- Reduce motion: honour `prefers-reduced-motion`; replace wobble/slide with fades.

---

## 11. Content Detail Reference

### 11.1 Content volumes
| Item | Count |
|---|---|
| Story panels | 9 (3 chapters × 3) + Wonder + Intro art |
| Simulate stations | 12 (3 levels × 4) |
| Oops Desk cases | 12 |
| Play worlds | 12 × 10 = 120 questions |
| Boss sets | 3 × 5 = 15 |
| Grand challenge | 8 |
| Reflect questions | 5 |
| Narration clips (static) | ≈ 220 + atomic fraction clip library (TRD §12.5) |

### 11.2 Question example catalogue (illustrative — generators produce many variants)
| World | Example | Correct | Notable distractors (tag) |
|---|---|---|---|
| E-W1 | "A bar is cut into 6 equal parts and 5 are shaded. What fraction is shaded?" | ⁵⁄₆ | ⁶⁄₅ (`SWAP_NUM_DEN`), ⁵⁄₁₁ (`ADD_DENOMINATORS`), ¹⁄₆ |
| E-W3 | "Which is greater, ³⁄₈ or ³⁄₅?" | ³⁄₅ | ³⁄₈ (`BIG_DENOM_BIG_FRACTION`) |
| E-W4 | "²⁄₇ + ³⁄₇ = ?" | ⁵⁄₇ | ⁵⁄₁₄ (`ADD_DENOMINATORS`), ⁶⁄₇ |
| M-W1 | "Write ¹⁷⁄₅ as a mixed number." | 3 ²⁄₅ | 2 ³⁄₅ & 3 ⁵⁄₂ (`IMPROPER_REMAINDER_MISUSE`) |
| M-W3 | "⁵⁄₆ − ½ = ?" | ⅓ | ²⁄₆ left unsimplified (`SIMPLIFY_PARTIAL`), ⁴⁄₆ (`ADD_NUM_KEEP_DEN_UNLIKE`-style slip) |
| M-W4 | "¾ of 24 crabs are in the reef. How many?" | 18 | 6 (`OF_MEANS_ONE_PART`), 8 |
| H-W1 | "⅔ × ¾ = ?" | ½ (simplest) | ⁶⁄₇ (`MULT_ADD_CONFUSION`), ⁶⁄₁₂ if simplest required |
| H-W2 | "3 ÷ ¼ = ?" | 12 | ¾ (`DIV_WHOLE_BY_FRACTION_SHRINKS`) |
| H-W3 | "Ali spent ⅓ of his money on a book and ½ of the remainder on lunch. He had $12 left. How much did he have at first?" | $36 | $24, $18 (`BAR_WRONG_WHOLE`) |

(Check: spent ⅓; remainder ⅔; lunch = ½·⅔ = ⅓; left = ⅓ = $12 ⇒ $36 ✔.)

---

## 12. Design System (new — not derived from the reference)

### 12.1 Visual identity
**Daylight tropical-paper-cut.** Bright, optimistic, tactile. Layered paper shapes with soft shadows, gentle grain, rounded forms. A light-theme product (the reference is a dark glass theme) — chosen for classroom projector legibility and to feel clearly distinct.

### 12.2 Colour tokens
| Token | Hex | Use |
|---|---|---|
| `--sand-50` | `#FFF8EA` | App background |
| `--sand-100` | `#FFF1D6` | Card background |
| `--ink-900` | `#12344D` | Primary text (AA on sand) |
| `--ink-600` | `#3D5C73` | Secondary text |
| `--lagoon-500` | `#1F9CC9` | Primary / links / Otto |
| `--teal-500` | `#14B8A6` | Success accents |
| `--coral-500` | `#FF6B5B` | Primary CTA / Mei |
| `--sun-400` | `#FFC93C` | Rewards / Danish / XP |
| `--leaf-500` | `#3FBF7F` | Correct |
| `--berry-500` | `#8E5CD9` | Hard-level accent |
| `--storm-500` | `#5B6B84` | Storm elements / disabled |
| `--error-500` | `#E5484D` | Incorrect (paired with icon + text) |

**Level accents:** Easy = sun/coral · Medium = teal/lagoon · Hard = berry/navy.

**Denominator colour + pattern system** (always applied together; shared by bars, pies, wall, number-line ticks):
| Denom | Colour | Pattern |
|---|---|---|
| 2 | Coral `#FF6B5B` | Solid |
| 3 | Sun `#FFC93C` | Diagonal stripes |
| 4 | Teal `#14B8A6` | Dots |
| 5 | Berry `#8E5CD9` | Cross-hatch |
| 6 | Lagoon `#1F9CC9` | Waves |
| 8 | Leaf `#3FBF7F` | Chevrons |
| 10 | Pink `#F06FA8` | Small squares |
| 12 | Navy `#2B4F7A` | Diamonds |
| 7, 9, 11 | Neutral `#8A97A8` | Unique line pattern |

### 12.3 Typography
| Role | Font | Notes |
|---|---|---|
| Display / headings | **Baloo 2** (700/800) | Rounded, friendly |
| Body | **Atkinson Hyperlegible** (400/700) | Designed for legibility; helps early readers |
| Math numerals in `<Frac>` | Baloo 2 tabular figures | Consistent width |
Fonts are **self-hosted** (no external requests — works on locked-down school networks). Body ≥ 18 px; fraction numerals ≥ 28 px in questions.

### 12.4 Shape, depth, motion
- Radii: 12 / 20 / 28 px. Paper-cut shadows (`0 6px 0 rgba(18,52,77,.12)`) instead of glassmorphism.
- Motion: spring-in (≤ 300 ms) for cards, wobble (400 ms) for unequal pieces, snap (150 ms) on equal. **No exit animations between missions/screens** (known framer-motion ghost-card issue in the platform — TRD §14).

### 12.5 Core component library (design level)
`Frac`, `FractionBar`, `Pie`, `NumberLine`, `SetGrid`, `FractionWall`, `AreaModel`, `BarModel`, `Scale` (balance), `Jug`, `Boat`, `OttoPanel`, `CaptionCard`, `PhasePill`, `LevelChip`, `AudioToggle`, `XPChip`, `StarRow`, `BadgeToast`, `FeedbackOverlay`, `HintBubble`, `BossLives`, `IslandMap`, `Certificate`. Full prop specs: TRD §7.

### 12.6 Image placeholders
All illustrations load through an `<Art id="IMG-C1P1" />` component that renders a **tinted placeholder with the alt text** if the image file is missing — so developers can build before final art exists and art can be dropped in with no code change (platform convention).

---

## 13. Accessibility, Inclusion and Localisation

### 13.1 Accessibility (target WCAG 2.2 AA)
- Colour contrast ≥ 4.5:1 for text, ≥ 3:1 for UI/graphics; **colour + pattern** for all denominators.
- Every interactive visual has a **keyboard path** and an `aria-label` generated from the fraction data ("three quarters shaded").
- Focus order follows the visual flow; visible focus ring (3 px lagoon).
- `prefers-reduced-motion` and a manual "Calm motion" toggle.
- Captions/on-screen text always equal the narration (1:1 parity — platform rule).
- No time limits in learning flows; Timed Sprint is opt-in and pausable.
- Text scales to 200% without loss; layout reflows.

### 13.2 Inclusion
Diverse names and skin tones in art; avoid gendered assumptions in word problems; food contexts avoid religious conflicts (no pork/alcohol references).

### 13.3 Safety and privacy
No accounts, no PII (nickname only, local), no third-party trackers, no ads. Aligns with PDPA principles for minors' data.

### 13.4 Localisation readiness
All copy lives in content files keyed by ID; no hard-coded strings in components. Number/fraction formatting through `format.js`. (Chinese/Malay/Tamil are future work.)

---

## 14. Audio and Narration

- **Provider/voice:** ElevenLabs, voice "Alice", model `eleven_multilingual_v2` (same as the platform reference). Style presets: `statement`, `instruction`, `question`, `encouragement`, `emphasis`, `thinking`, `celebration`.
- **No browser TTS fallback.** If a clip is missing, narration is skipped silently.
- **1:1 parity** between narration and on-screen text.
- **Fractions are spoken as words** ("three quarters", "one and three quarters") via a speech serialiser; never read digits or "slash".
- Static clips for all Wonder, Story, Station briefings, feedback lines, Reflect text. Dynamic question narration uses an **atomic clip library + stitched templates**, or an optional serverless TTS proxy (TRD §12) — *the API key must not ship in the client bundle.*
- Audio toggle: top-left on every screen; state persisted. Music: optional ambient loop (low volume, off by default on first launch — OQ-5).

---

## 15. Analytics and Teacher Insight (light)

v1 ships with an **event hook** (`track(event, payload)`, no-op by default) and an **on-device misconception log**. Events: `phase_enter`, `story_panel`, `station_start/complete`, `question_answer {world, tag, correct, attempts, hints}`, `boss_result`, `reflect_answer`, `level_complete`. This enables a later teacher dashboard or LMS bridge without schema changes. Teacher-facing output in v1 = Reflect **Watch-list** screenshot/print.

---

## 16. Delivery Plan, Risks and Open Questions

### 16.1 Milestones (single-developer estimate; see TRD §17 for acceptance criteria)
| M | Scope | Est. |
|---|---|---|
| M0 | Project scaffold, tokens, fraction core + tests, configs | ~3 d |
| M1 | App shell, Intro, Hub, Wonder, Story (9 panels, placeholders) | ~4 d |
| M2 | **Easy vertical slice** — 4 stations, 4 worlds, boss, level complete | ~10 d |
| M3 | Medium level | ~8 d |
| M4 | Hard level (reuses Oops engine, bar-model builder is the heavy item) | ~9 d |
| M5 | Reflect, certificate, audio generation, art integration, a11y pass, stress tests, polish | ~7 d |
| | **Total** | **~41 dev-days** *(estimate — adjust after M2 velocity is known)* |

### 16.2 Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Drag-and-drop on touch is fiddly | High | Pointer-events hook, large targets, tap alternatives, early device testing in M2 |
| Math errors in generated questions | High | Integer-only core, independent solver cross-check, 50k-question stress test |
| Story art inconsistency across 9+ images | Medium | Character sheets first, reference-image workflow, `IMAGE_PROMPTS.md` style bible |
| AI image generators cannot draw exact equal parts | Medium | Draw *wholes* in art; overlay divisions in SVG code |
| Scope creep (12 stations + 13 mechanics) | High | Strict vertical slice (Easy) first; reuse engines (Oops, BarModel, Wall) |
| Audio cost/latency for dynamic questions | Medium | Atomic clip library; optional proxy; silent fallback |
| Syllabus misalignment | Medium | OQ-1 review before content freeze |
| Low-end devices (Chromebooks) | Medium | SVG not canvas, image budgets, lazy loading |

### 16.3 Open questions
| ID | Question | Owner |
|---|---|---|
| OQ-1 | Confirm grade bands and exact MOE scope per level | Content lead |
| OQ-2 | Level loop (recommended) vs strictly linear five-phase pass? | Product |
| OQ-3 | Final character names (Mei / Danish / Otto are placeholders) | Product / Art |
| OQ-4 | Is the Grand Storm Challenge in v1 or v1.1? | Product |
| OQ-5 | Ambient music — include? default on/off? | Product |
| OQ-6 | Is a drawing pad in the Learner's Log worth the effort for v1? | Product |
| OQ-7 | Hosting & analytics destination for pilot (Vercel assumed) | Eng |

### 16.4 Release acceptance criteria (summary)
1. All three levels playable end-to-end with no blocking defects at 360×640, 768×1024, 1366×768, 1920×1080.
2. Stress test: 0 invariant violations over ≥ 50,000 generated questions.
3. Narration/on-screen text parity validated by script for all static content.
4. Keyboard-only run-through of one full level succeeds.
5. Works with audio off and with `prefers-reduced-motion`.
6. Lighthouse (mobile, throttled): Performance ≥ 80, Accessibility ≥ 95.

---

## Appendix A — Glossary
| Term | Meaning |
|---|---|
| CPA | Concrete–Pictorial–Abstract progression |
| Equal Meter | Live indicator comparing cut segment lengths |
| Misconception tag | Named error pattern attached to a distractor / diagnostic |
| Echo question | A replayed question targeting a previously missed tag |
| Oops Desk | Error-detective station engine |
| Storm Challenge | Boss battle (3 lives) |
| Fast Pass | Optional Wonder check that unlocks Medium early |

## Appendix B — Traceability to the reference module
| Reference (ScrollQuest) | Fraction Isles |
|---|---|
| Wonder: damaged scroll hook | Wonder: Storm Map gut-feel taps |
| Story: 4 panels, two apprentices + mentor | Story: 3 chapters × 3 panels, two architects + Otto |
| Simulate: 4 stations (A–D, last = error detective) | 4 stations per level, D = Oops Desk |
| Play: 10 worlds × 10 Qs, bosses, 4 modes | 12 worlds × 10 Qs, 3 bosses + grand, 4 modes |
| Reflect: 3 Qs + field log + scorecard | 5 Qs + learner log + scorecard + watch-list + certificate |
| XP/stars/badge engine | Same formulas, new badges |
| ElevenLabs, no browser TTS | Same, with atomic-clip approach + key-safe proxy |
| Dark glass UI | New light paper-cut UI |
