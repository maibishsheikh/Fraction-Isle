import { useEffect, useRef } from 'react';
import { clipId } from '../../scripts/clipId.mjs';
import { audioOn } from '../utils/sfx.js';

// Plays /audio/<id>.mp3 for a narration line (ids from scripts/build-audio-manifest.mjs). Respects the audio toggle; stops on unmount.
export default function useAudio() {
  const ref = useRef(null);
  const stop = () => { ref.current?.pause(); ref.current = null; };
  useEffect(() => stop, []);
  return {
    say: (text) => { stop(); if (!audioOn() || !text) return; const a = new Audio(`/audio/${clipId(text)}.mp3`); ref.current = a; a.play().catch(() => {}); },
    stop,
  };
}
