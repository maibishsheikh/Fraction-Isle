// Usage: ELEVENLABS_API_KEY=… ELEVENLABS_VOICE_ID=… npm run audio:generate  (skips clips that already exist)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const key = process.env.ELEVENLABS_API_KEY; const voice = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) { console.error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.'); process.exit(1); }
const manifest = JSON.parse(readFileSync('public/audio/manifest.json', 'utf8'));
for (const [id, text] of Object.entries(manifest)) {
  const file = `public/audio/${id}.mp3`;
  if (existsSync(file)) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }) });
  if (!res.ok) { console.error(`Failed ${id}: ${res.status}`); continue; }
  writeFileSync(file, Buffer.from(await res.arrayBuffer())); console.log(`wrote ${file}`);
}
