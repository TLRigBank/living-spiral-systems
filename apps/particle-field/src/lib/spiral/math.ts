export const TAU = Math.PI * 2;

export function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Frame-rate-correct exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function rgba(rgb: readonly [number, number, number], a: number) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

/** Bernoulli lemniscate, lobes along X. t=0 at (+a,0), t=π at (−a,0), origin at the crossing. */
export function lemniscate(t: number, a: number) {
  const s = Math.sin(t);
  const c = Math.cos(t);
  const d = 1 + s * s;
  return { x: (a * c) / d, y: (a * s * c) / d };
}

export function ellipsePoint(theta: number, rx: number, ry: number) {
  return { x: Math.cos(theta) * rx, y: Math.sin(theta) * ry };
}

/** Distance from point to axis-aligned ellipse; 0 on the curve. */
export function distToEllipse(x: number, y: number, rx: number, ry: number) {
  const ang = Math.atan2(y / ry, x / rx);
  const px = Math.cos(ang) * rx;
  const py = Math.sin(ang) * ry;
  return Math.hypot(x - px, y - py);
}

export function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashNoise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453;
  return n - Math.floor(n);
}
