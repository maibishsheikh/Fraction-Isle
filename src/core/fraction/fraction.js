// @ts-check

const assertInt = (value) => {
  if (!Number.isInteger(value)) throw new TypeError(`Expected an integer, got ${value}`);
  if (!Number.isSafeInteger(value)) throw new RangeError('Fraction value is outside the safe integer range');
};

const assertProduct = (value) => {
  if (!Number.isSafeInteger(value)) throw new RangeError('Fraction operation overflow');
  return value;
};

export const frac = (n, d = 1) => {
  assertInt(n); assertInt(d);
  if (d === 0) throw new RangeError('A fraction cannot have a zero denominator');
  if (d < 0) return { n: -n, d: -d };
  if (n < 0) throw new RangeError('Negative fractions are not supported in v1');
  return { n, d };
};

export const gcd = (a, b) => {
  assertInt(a); assertInt(b);
  let x = Math.abs(a); let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
};

export const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return assertProduct(Math.abs((a / gcd(a, b)) * b));
};

export const simplify = ({ n, d }) => {
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};

export const isSimplest = ({ n, d }) => gcd(n, d) === 1;
export const equals = (a, b) => a.n * b.d === b.n * a.d;
export const cmp = (a, b) => Math.sign(a.n * b.d - b.n * a.d);

export const addRaw = (a, b) => frac(assertProduct(a.n * b.d + b.n * a.d), assertProduct(a.d * b.d));
export const subRaw = (a, b) => {
  if (cmp(a, b) < 0) throw new RangeError('v1 subtraction does not produce negative fractions');
  return frac(assertProduct(a.n * b.d - b.n * a.d), assertProduct(a.d * b.d));
};
export const mulRaw = (a, b) => frac(assertProduct(a.n * b.n), assertProduct(a.d * b.d));
export const divRaw = (a, b) => {
  if (b.n === 0) throw new RangeError('Cannot divide by zero');
  return frac(assertProduct(a.n * b.d), assertProduct(a.d * b.n));
};

export const add = (a, b) => simplify(addRaw(a, b));
export const sub = (a, b) => simplify(subRaw(a, b));
export const mul = (a, b) => simplify(mulRaw(a, b));
export const div = (a, b) => simplify(divRaw(a, b));
export const ofSet = (f, total) => {
  assertInt(total);
  if (total % f.d !== 0) throw new RangeError('Set total must be divisible by the denominator');
  return (total / f.d) * f.n;
};
export const toMixed = ({ n, d }) => ({ w: Math.floor(n / d), n: n % d, d });
export const fromMixed = ({ w, n, d }) => frac(w * d + n, d);
export const isProper = ({ n, d }) => n < d;
export const toNumber = ({ n, d }) => n / d;
