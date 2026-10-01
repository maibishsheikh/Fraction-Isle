const small = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const numberWords = (n) => {
  if (n < 20) return small[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? `-${small[n % 10]}` : '');
  if (n < 1000) return `${small[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberWords(n % 100)}` : ''}`;
  return String(n);
};
const denominators = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 11: ['eleventh', 'elevenths'], 12: ['twelfth', 'twelfths'] };
export const toSpeech = ({ n, d }) => {
  if (d === 1) return numberWords(n);
  const name = denominators[d];
  return name ? `${numberWords(n)} ${name[n === 1 ? 0 : 1]}` : `${numberWords(n)} over ${numberWords(d)}`;
};
export const toAria = toSpeech;
export const numberToWords = numberWords;
