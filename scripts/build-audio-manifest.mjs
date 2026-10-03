// Usage: npm run audio:manifest  -> public/audio/manifest.json  (id -> narration text)
import { mkdirSync, writeFileSync } from 'node:fs';
import { CONTENT } from '../src/content/v3.js';
import { clipId } from './clipId.mjs';

const out = {};
const walk = (o) => {
  if (Array.isArray(o)) return o.forEach(walk);
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === 'story' && Array.isArray(v)) v.forEach((x) => { if (typeof x[1] === 'string') out[clipId(x[1])] = x[1]; });
    else if ((k === 'narration' || k === 'explainNarration') && typeof v === 'string') out[clipId(v)] = v; else walk(v); }
};
walk(CONTENT);
mkdirSync('public/audio', { recursive: true });
writeFileSync('public/audio/manifest.json', JSON.stringify(out, null, 2));
console.log(`${Object.keys(out).length} narration clips -> public/audio/manifest.json`);
