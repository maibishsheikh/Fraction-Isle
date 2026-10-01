# Fraction Isles

Fraction Isles is a browser-based fractions learning module built from `PRD.md` and `TRD.md` for students in Grades 4–8. It uses a concrete → visual → symbolic progression so learners can experiment before they calculate.

## Start locally

```bash
npm install
npm run dev
```

The current vertical slice covers the full phase journey with a visual-first learning arc: Beginner (see a fraction), Builder (use fractions in models and situations), and Advanced (solve and explain multi-step problems). It includes placeholder art, a deterministic starter practice set, and four playable simulation missions per island. Core fraction arithmetic is integer-only and lives in `src/core/fraction/`.

## Project direction

- `src/app/` owns persisted reducer state and navigation.
- `src/core/` owns exact arithmetic, speech, nodes, and seeded utilities.
- `src/content/` owns story and question content.
- `src/styles/` owns the tropical paper-cut design tokens and responsive layout.

Next implementation slice: expand the visual mission bank with richer motion and move the starter practice questions into data-driven generators with stress validation.
