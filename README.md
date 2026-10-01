# Fraction Isles

Fraction Isles is a browser-based fractions learning module built from `PRD.md` and `TRD.md`.

## Start locally

```bash
npm install
npm run dev
```

The current vertical slice covers the full phase journey with placeholder art and a deterministic starter practice set. Core fraction arithmetic is integer-only and lives in `src/core/fraction/`.

## Project direction

- `src/app/` owns persisted reducer state and navigation.
- `src/core/` owns exact arithmetic, speech, nodes, and seeded utilities.
- `src/content/` owns story and question content.
- `src/styles/` owns the tropical paper-cut design tokens and responsive layout.

Next implementation slice: replace the station completion cards with concrete keyboard/touch interactions, then move the starter practice questions into data-driven generators and add stress validation.
