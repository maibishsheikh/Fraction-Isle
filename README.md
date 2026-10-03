# Fraction Isles

Fraction Isles is a browser-based fractions learning module built from `PRD.md` and `TRD.md` for students in Grades 4–8. It uses a concrete → visual → symbolic progression so learners can experiment before they calculate.

## Start locally

```bash
npm install
npm run dev
```

The current redesign follows the v2 flow: Home level map → 9-stop level trail → Learn (See, Try, Check) → Play mini-game → Boss → Level Complete → Certificate. Beginner teaches what fractions are, Builder uses fractions in real life, and Advanced focuses on multi-step reasoning. Content is data-driven in `src/content/lessons`, `src/content/games`, and `src/content/boss`.

## Project direction

- `src/app/` owns v2 persisted reducer state, selectors, trail gating, and navigation.
- `src/config/levels.js` defines the Beginner / Builder / Advanced progression.
- `src/core/` owns exact arithmetic, speech, nodes, and seeded utilities.
- `src/content/` owns lesson, game, and boss content.
- `src/styles/` owns the tropical paper-cut design tokens and responsive layout.

Next implementation slice: replace the generic game-choice rounds with the named touch interactions from the spec—Pizza Slicer, Fraction Fishing, Reef Café, Bridge Builder, Bar-Model Detective, and the remaining mini-games.

## Audio
`npm run audio:manifest` lists every narration line; `ELEVENLABS_API_KEY=… ELEVENLABS_VOICE_ID=… npm run audio:generate` renders missing clips to `public/audio/`. `useAudio().say(text)` plays a clip by id; `utils/sfx.js` has the WebAudio effects.

## Choices where the spec was ambiguous
Pizza Slicer and Wall/Ribbon labs use a 12-notch bar instead of the 24-notch pizza; Fraction Fishing is a still row of fish (no drift).
