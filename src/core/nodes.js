import { toAria, toPlain, toSpeech } from './fraction/index.js';

export const toPlainText = (nodes) => nodes.map((node) => typeof node === 'string' ? node : node.frac ? toPlain(node.frac) : node.num !== undefined ? String(node.num) : node.em ?? node.op ?? '').join('');
export const toAriaText = (nodes) => nodes.map((node) => typeof node === 'string' ? node : node.frac ? toAria(node.frac) : node.num !== undefined ? String(node.num) : node.em ?? node.op ?? '').join('');
export const toSpeechText = (nodes) => nodes.map((node) => typeof node === 'string' ? node : node.frac ? toSpeech(node.frac) : node.num !== undefined ? String(node.num) : node.op === '+' ? 'plus' : node.op === '-' ? 'minus' : node.op === '=' ? 'equals' : node.em ?? '').join(' ');
