import { MISCONCEPTIONS } from '../content/misconceptions.js';

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
export const validateQuestion = (q, where) => {
  const err = [];
  if (q.options.filter((o) => o.id === q.correct).length !== 1) err.push(`${where}: needs exactly one correct option`);
  if (new Set(q.options.map((o) => o.text)).size !== q.options.length) err.push(`${where}: duplicate option text`);
  if (new Set(q.options.map((o) => o.id)).size !== q.options.length) err.push(`${where}: duplicate option id`);
  q.options.forEach((o) => { if (o.id !== q.correct && !MISCONCEPTIONS[o.tag]) err.push(`${where}: unknown tag ${o.tag}`); });
  if (typeof q.visual === 'string') err.push(`${where}: visual must not be a bare string`);
  if (!q.narration) err.push(`${where}: missing narration`);
  return err;
};
export const validateContent = (content) => {
  const err = [];
  for (const [lvl, c] of Object.entries(content)) {
    c.story.forEach((s, i) => { if (words(s[1]) > 40) err.push(`${lvl} story ${i}: over 40 words`); });
    c.labs.forEach((lab, i) => {
      const w = `${lvl} lab ${i}`;
      if (lab.explore.checklist.filter((x) => x.required).length < 4) err.push(`${w}: needs >= 4 required checklist items`);
      if (lab.guided.length < 3) err.push(`${w}: needs >= 3 guided tasks`);
      if (lab.checkin.length !== 2) err.push(`${w}: needs exactly 2 check-ins`);
      lab.guided.forEach((g) => { if (!g.narration) err.push(`${w}: guided task missing narration`); });
      lab.checkin.forEach((q, j) => err.push(...validateQuestion(q, `${w} checkin ${j}`)));
    });
    c.games.forEach((g, i) => !g.kind && g.rounds.forEach((q, j) => err.push(...validateQuestion(q, `${lvl} game ${i} round ${j}`))));
    c.boss.forEach((q, j) => err.push(...validateQuestion(q, `${lvl} boss ${j}`)));
  }
  return err;
};
