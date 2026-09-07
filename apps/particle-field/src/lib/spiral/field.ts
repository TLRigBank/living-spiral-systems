import {
  HEX,
  RGB,
  TRAIL,
  type HoneyStamp,
  type InspectState,
  type SpeciesId,
} from "./species";
import {
  TAU,
  clamp,
  distToEllipse,
  ellipsePoint,
  lemniscate,
  mulberry32,
  rgba,
} from "./math";

export type Insets = { top: number; bottom: number; left: number; right: number };

export type Layout = {
  w: number;
  h: number;
  cx: number;
  cy: number;
  wellSep: number;
  hermesX: number;
  grokX: number;
  wellY: number;
  shellRx: number;
  shellRy: number;
  a: number;
};

type Particle = {
  species: SpeciesId;
  stamp: HoneyStamp | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  phase: number;
  speed: number;
  size: number;
  seed: number;
  trail: Float32Array;
  trailCap: number;
  trailI: number;
  trailN: number;
};

type Stir = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

const STEP = 1 / 60;
const MAX_STEPS = 4;

function trailCapFor(species: SpeciesId, stamp: HoneyStamp | null) {
  if (species === "honey") {
    return stamp === "returned" ? TRAIL.honeyReturned : TRAIL.honeyExploring;
  }
  if (species === "spine") return TRAIL.spine;
  if (species === "hermes") return TRAIL.hermes;
  if (species === "grok") return TRAIL.grok;
  return TRAIL.shell;
}

function countsFor(area: number) {
  const m = clamp(area / (1100 * 620), 0.58, 1.15);
  return {
    spine: Math.round(40 * m),
    hermes: Math.round(88 * m),
    grok: Math.round(162 * m),
    honeyExploring: Math.max(8, Math.round(12 * m)),
    honeyReturned: Math.max(7, Math.round(10 * m)),
    shell: Math.round(50 * m),
  };
}

export function computeLayout(w: number, h: number, insets: Insets): Layout {
  const fw = Math.max(120, w - insets.left - insets.right);
  const fh = Math.max(120, h - insets.top - insets.bottom);
  const cx = insets.left + fw / 2;
  const cy = insets.top + fh / 2;
  const wellSep = Math.min(fw * 0.26, fh * 0.34, 240);
  const shellRx = Math.min(fw * 0.46, wellSep * 2.22);
  const shellRy = Math.min(fh * 0.42, wellSep * 1.28);
  return {
    w,
    h,
    cx,
    cy,
    wellSep,
    hermesX: cx - wellSep,
    grokX: cx + wellSep,
    wellY: cy,
    shellRx,
    shellRy,
    a: wellSep,
  };
}

function spawnParticle(
  species: SpeciesId,
  stamp: HoneyStamp | null,
  layout: Layout,
  rand: () => number,
  index: number,
  total: number,
): Particle {
  const cap = trailCapFor(species, stamp);
  const p: Particle = {
    species,
    stamp,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    homeX: 0,
    homeY: 0,
    phase: 0,
    speed: 0,
    size: 1.8,
    seed: rand() * 1000,
    trail: new Float32Array(Math.max(1, cap) * 2),
    trailCap: cap,
    trailI: 0,
    trailN: 0,
  };
  place(p, layout, rand, index, total);
  p.x = p.homeX;
  p.y = p.homeY;
  return p;
}

function place(
  p: Particle,
  layout: Layout,
  rand: () => number,
  index: number,
  total: number,
) {
  const { cx, cy, hermesX, grokX, wellY, shellRx, shellRy, a } = layout;
  if (p.species === "spine") {
    const ang = TAU * rand();
    const r = Math.sqrt(rand()) * 22;
    p.homeX = cx + Math.cos(ang) * r;
    p.homeY = cy + Math.sin(ang) * r * 0.92;
    p.size = 2.3 + rand() * 0.9;
    p.speed = 0;
    p.phase = rand() * TAU;
  } else if (p.species === "hermes") {
    const ang = TAU * rand();
    const r = Math.sqrt(rand()) * 36;
    p.homeX = hermesX + Math.cos(ang) * r;
    p.homeY = wellY + Math.sin(ang) * r * 0.88;
    p.size = 1.7 + rand() * 0.7;
    p.speed = 0.55 + rand() * 0.25;
    p.phase = rand() * TAU;
  } else if (p.species === "grok") {
    const ang = TAU * rand();
    const r = Math.sqrt(rand()) * 108;
    p.homeX = grokX + Math.cos(ang) * r;
    p.homeY = wellY + Math.sin(ang) * r * 0.78;
    p.size = 1.35 + rand() * 0.7;
    p.speed = 0.9 + rand() * 0.55;
    p.phase = rand() * TAU;
  } else if (p.species === "honey") {
    p.phase = ((index + (p.stamp === "returned" ? 0.5 : 0)) / total) * TAU;
    const pt = lemniscate(p.phase, a);
    p.homeX = cx + pt.x;
    p.homeY = cy + pt.y;
    if (p.stamp === "returned") {
      p.size = 2.55;
      p.speed = 0.36 + rand() * 0.06;
    } else {
      p.size = 1.55;
      p.speed = 0.52 + rand() * 0.12;
    }
  } else {
    p.phase = (index / Math.max(1, total)) * TAU + rand() * 0.04;
    const pt = ellipsePoint(p.phase, shellRx, shellRy);
    p.homeX = cx + pt.x;
    p.homeY = cy + pt.y;
    p.size = 1.65 + rand() * 0.5;
    p.speed = 0.055 + rand() * 0.02;
  }
}

export class SpiralSim {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layout: Layout;
  insets: Insets = { top: 28, bottom: 56, left: 16, right: 16 };
  particles: Particle[] = [];
  paused = false;
  inspect: InspectState | null = null;
  reducedMotion = false;
  time = 0;
  private acc = 0;
  private last = 0;
  private raf = 0;
  private lemniscatePath: { x: number; y: number }[] = [];
  private shellPath: { x: number; y: number }[] = [];
  stir: Stir = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 };
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.layout = computeLayout(300, 300, this.insets);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setInsets(insets: Insets) {
    this.insets = insets;
    this.resize();
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  setInspect(inspect: InspectState | null) {
    this.inspect = inspect;
  }

  setReducedMotion(v: boolean) {
    this.reducedMotion = v;
  }

  setStir(active: boolean, x: number, y: number, vx: number, vy: number) {
    this.stir.active = active;
    this.stir.x = x;
    this.stir.y = y;
    this.stir.vx = vx;
    this.stir.vy = vy;
    if (active) this.stir.life = 1;
  }

  resize() {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth ?? window.innerWidth;
    const h = parent?.clientHeight ?? window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const prev = this.layout;
    this.layout = computeLayout(w, h, this.insets);
    this.cacheCurves();
    if (this.particles.length === 0) {
      this.rebuild(w * h);
      return;
    }
    const nextCounts = countsFor(w * h);
    const honey = this.particles.filter((p) => p.species === "honey").length;
    const expectedHoney = nextCounts.honeyExploring + nextCounts.honeyReturned;
    if (Math.abs(honey - expectedHoney) > 6) {
      this.rebuild(w * h);
      return;
    }
    this.remap(prev);
  }

  private remap(prev: Layout) {
    const { cx, cy, a, shellRy } = this.layout;
    const sx = a / (prev.a || a);
    const sy = shellRy / (prev.shellRy || shellRy);
    for (const p of this.particles) {
      p.x = cx + (p.x - prev.cx) * sx;
      p.y = cy + (p.y - prev.cy) * sy;
      p.homeX = cx + (p.homeX - prev.cx) * sx;
      p.homeY = cy + (p.homeY - prev.cy) * sy;
      p.trailN = 0;
      p.trailI = 0;
    }
  }

  hitTest(x: number, y: number): InspectState | null {
    const { cx, cy, hermesX, grokX, wellY, shellRx, shellRy } = this.layout;
    let honeyHit: Particle | null = null;
    let honeyD = 22;
    for (const p of this.particles) {
      if (p.species !== "honey") continue;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < honeyD) {
        honeyD = d;
        honeyHit = p;
      }
    }
    if (honeyHit && honeyHit.stamp) {
      return { species: "honey", stamp: honeyHit.stamp };
    }

    const dSpine = Math.hypot(x - cx, y - cy);
    const dHermes = Math.hypot(x - hermesX, y - wellY);
    const dGrok = Math.hypot(x - grokX, y - wellY);
    if (dSpine < 52) return { species: "spine" };
    if (dHermes < 70) return { species: "hermes" };
    if (dGrok < 92) return { species: "grok" };

    const ex = x - cx;
    const ey = y - cy;
    if (distToEllipse(ex, ey, shellRx, shellRy) < 22) {
      return { species: "shell" };
    }
    return null;
  }

  snapshot() {
    const c = { spine: 0, hermes: 0, grok: 0, honey: 0, shell: 0 };
    let exploring = 0;
    let returned = 0;
    let spineMax = 0;
    const { cx, cy } = this.layout;
    for (const p of this.particles) {
      c[p.species] += 1;
      if (p.species === "honey" && p.stamp === "exploring") exploring += 1;
      if (p.species === "honey" && p.stamp === "returned") returned += 1;
      if (p.species === "spine") {
        spineMax = Math.max(spineMax, Math.hypot(p.x - p.homeX, p.y - p.homeY));
      }
    }
    return {
      counts: c,
      honey: { exploring, returned },
      spineDrift: spineMax,
      paused: this.paused,
      inspect: this.inspect,
      center: { x: cx, y: cy },
      wells: {
        hermes: { x: this.layout.hermesX, y: this.layout.wellY },
        grok: { x: this.layout.grokX, y: this.layout.wellY },
      },
    };
  }

  private rebuild(area: number) {
    const counts = countsFor(area);
    const rand = mulberry32(20260907);
    const next: Particle[] = [];
    for (let i = 0; i < counts.spine; i++) {
      next.push(spawnParticle("spine", null, this.layout, rand, i, counts.spine));
    }
    for (let i = 0; i < counts.hermes; i++) {
      next.push(spawnParticle("hermes", null, this.layout, rand, i, counts.hermes));
    }
    for (let i = 0; i < counts.grok; i++) {
      next.push(spawnParticle("grok", null, this.layout, rand, i, counts.grok));
    }
    for (let i = 0; i < counts.honeyExploring; i++) {
      next.push(
        spawnParticle(
          "honey",
          "exploring",
          this.layout,
          rand,
          i,
          counts.honeyExploring,
        ),
      );
    }
    for (let i = 0; i < counts.honeyReturned; i++) {
      next.push(
        spawnParticle(
          "honey",
          "returned",
          this.layout,
          rand,
          i,
          counts.honeyReturned,
        ),
      );
    }
    for (let i = 0; i < counts.shell; i++) {
      next.push(spawnParticle("shell", null, this.layout, rand, i, counts.shell));
    }
    this.particles = next;
  }

  private cacheCurves() {
    const { a, shellRx, shellRy } = this.layout;
    const lem: { x: number; y: number }[] = [];
    const shell: { x: number; y: number }[] = [];
    for (let i = 0; i <= 160; i++) {
      lem.push(lemniscate((i / 160) * TAU, a));
    }
    for (let i = 0; i <= 96; i++) {
      shell.push(ellipsePoint((i / 96) * TAU, shellRx, shellRy));
    }
    this.lemniscatePath = lem;
    this.shellPath = shell;
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.1) dt = 0.1;
    if (!this.paused) {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= STEP && steps < MAX_STEPS) {
        this.step(STEP);
        this.acc -= STEP;
        steps += 1;
      }
      if (this.acc >= STEP) this.acc = 0;
    }
    this.draw();
  };

  private step(dt: number) {
    const motion = this.reducedMotion ? 0.22 : 1;
    const dtm = dt * motion;
    this.time += dtm;
    if (!this.stir.active) {
      this.stir.life = Math.max(0, this.stir.life - dt * 2.4);
    }

    const { cx, cy, hermesX, grokX, wellY, a, shellRx, shellRy } = this.layout;
    const stirOn = this.stir.active && !this.paused;

    for (const p of this.particles) {
      if (p.species === "spine") {
        // Tight home spring, heavy damping. Immune to stir.
        p.vx += (p.homeX - p.x) * 28 * dt;
        p.vy += (p.homeY - p.y) * 28 * dt;
        const n = this.time * 0.35 + p.seed;
        p.vx += Math.cos(n) * 1.6 * dtm;
        p.vy += Math.sin(n * 1.07) * 1.6 * dtm;
        p.vx *= Math.exp(-14 * dt);
        p.vy *= Math.exp(-14 * dt);
      } else if (p.species === "hermes") {
        // Stronger well, shorter paths, quieter noise, denser cluster.
        const dx = hermesX - p.x;
        const dy = wellY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        p.vx += dx * 3.6 * dt;
        p.vy += dy * 3.6 * dt;
        p.vx += (-dy / dist) * 18 * dtm;
        p.vy += (dx / dist) * 18 * dtm;
        const n = this.time * 0.42 + p.seed;
        p.vx += Math.cos(n) * 10 * dtm;
        p.vy += Math.sin(n * 1.2) * 10 * dtm;
        if (dist > 48) {
          p.vx += (dx / dist) * (dist - 48) * 4.2 * dt;
          p.vy += (dy / dist) * (dist - 48) * 4.2 * dt;
        }
        p.vx *= Math.exp(-3.8 * dt);
        p.vy *= Math.exp(-3.8 * dt);
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 70) {
          p.vx = (p.vx / sp) * 70;
          p.vy = (p.vy / sp) * 70;
        }
      } else if (p.species === "grok") {
        // Weaker pull, longer paths, more particles, faster noise.
        const dx = grokX - p.x;
        const dy = wellY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        p.vx += dx * 1.15 * dt;
        p.vy += dy * 1.15 * dt;
        p.vx += (-dy / dist) * 7 * dtm;
        p.vy += (dx / dist) * 7 * dtm;
        const n1 = this.time * 1.18 + p.seed;
        const n2 = this.time * 0.77 + p.seed * 0.3;
        p.vx += (Math.cos(n1) + Math.sin(n2)) * 26 * dtm;
        p.vy += (Math.sin(n1 * 1.4) + Math.cos(n2 * 0.8)) * 26 * dtm;
        if (dist > 128) {
          p.vx += (dx / dist) * (dist - 128) * 1.4 * dt;
          p.vy += (dy / dist) * (dist - 128) * 1.4 * dt;
        }
        p.vx *= Math.exp(-2.1 * dt);
        p.vy *= Math.exp(-2.1 * dt);
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 110) {
          p.vx = (p.vx / sp) * 110;
          p.vy = (p.vy / sp) * 110;
        }
      } else if (p.species === "honey") {
        // Locked to the lemniscate. Exploring jitters; Returned stays spine-grade.
        p.phase += p.speed * dtm;
        const target = lemniscate(p.phase, a);
        const tx = cx + target.x;
        const ty = cy + target.y;
        const returned = p.stamp === "returned";
        const spring = returned ? 18 : 9;
        p.vx += (tx - p.x) * spring * dt;
        p.vy += (ty - p.y) * spring * dt;
        if (!returned) {
          const nx = -Math.sin(p.phase);
          const ny = Math.cos(p.phase);
          const wobble = Math.sin(this.time * 2.1 + p.seed) * 14;
          p.vx += nx * wobble * dtm;
          p.vy += ny * wobble * dtm;
        }
        p.vx *= Math.exp(-(returned ? 8 : 4.2) * dt);
        p.vy *= Math.exp(-(returned ? 8 : 4.2) * dt);
      } else {
        // Slow outer ellipse. Marks the edge. Does not rewrite the core.
        p.phase += p.speed * dtm;
        const breath = 1 + Math.sin(this.time * 0.35 + p.seed) * 0.012;
        const target = ellipsePoint(p.phase, shellRx * breath, shellRy * breath);
        const tx = cx + target.x;
        const ty = cy + target.y;
        p.vx += (tx - p.x) * 6.5 * dt;
        p.vy += (ty - p.y) * 6.5 * dt;
        p.vx *= Math.exp(-4.4 * dt);
        p.vy *= Math.exp(-4.4 * dt);
      }

      if (stirOn && p.species !== "spine") {
        const sdx = p.x - this.stir.x;
        const sdy = p.y - this.stir.y;
        const sd = Math.hypot(sdx, sdy);
        const radius = p.species === "honey" ? 90 : p.species === "shell" ? 110 : 150;
        if (sd < radius && sd > 1) {
          const fall = 1 - sd / radius;
          const amp = fall * fall;
          p.vx += (-sdy / sd) * amp * 420 * dt;
          p.vy += (sdx / sd) * amp * 420 * dt;
          p.vx += this.stir.vx * amp * 0.55;
          p.vy += this.stir.vy * amp * 0.55;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.trailCap > 0) {
        p.trail[p.trailI * 2] = p.x;
        p.trail[p.trailI * 2 + 1] = p.y;
        p.trailI = (p.trailI + 1) % p.trailCap;
        if (p.trailN < p.trailCap) p.trailN += 1;
      }
    }
  }

  private alphaFor(species: SpeciesId, stamp: HoneyStamp | null) {
    const focus = this.inspect;
    let base = 1;
    if (species === "honey" && stamp === "exploring") base = 0.45;
    if (!focus) return base;
    if (focus.species !== species) return base * 0.22;
    if (focus.species === "honey" && stamp && focus.stamp !== stamp) {
      return base * 0.4;
    }
    return base;
  }

  private draw() {
    const { ctx, layout } = this;
    const { w, h } = layout;
    ctx.fillStyle = HEX.void;
    ctx.fillRect(0, 0, w, h);

    this.drawVignette();
    this.drawWells();
    this.drawGuides();
    this.drawStir();

    this.drawSpecies("shell");
    this.drawSpecies("grok");
    this.drawSpecies("hermes");
    this.drawHoney();
    this.drawSpecies("spine");
    this.drawNuclei();
  }

  private drawVignette() {
    const { ctx, layout } = this;
    const { w, h, cx, cy } = layout;
    const g = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.18, cx, cy, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(11,14,18,0)");
    g.addColorStop(1, "rgba(4,6,9,0.72)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  private drawWells() {
    const { ctx, layout, inspect } = this;
    const { cx, cy, hermesX, grokX, wellY } = layout;
    const pulse = this.reducedMotion ? 1 : 0.88 + Math.sin(this.time * 0.55) * 0.12;

    const well = (
      x: number,
      y: number,
      r: number,
      rgb: readonly [number, number, number],
      inner: number,
      focused: boolean,
    ) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const a = (focused ? 0.34 : 0.16) * pulse;
      g.addColorStop(0, rgba(rgb, a));
      g.addColorStop(0.45, rgba(rgb, a * 0.35));
      g.addColorStop(1, rgba(rgb, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      if (focused) {
        ctx.strokeStyle = rgba(rgb, 0.55);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.42, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = rgba(rgb, 0.22);
        ctx.beginPath();
        ctx.arc(x, y, r * 0.62, 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = rgba(rgb, inner);
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, TAU);
      ctx.fill();
    };

    well(hermesX, wellY, 78, RGB.hermes, 0.9, inspect?.species === "hermes");
    well(grokX, wellY, 118, RGB.grok, 0.85, inspect?.species === "grok");
    well(cx, cy, 52, RGB.spine, 1, inspect?.species === "spine");
  }

  private drawGuides() {
    const { ctx, layout, inspect } = this;
    const { cx, cy } = layout;
    const honeyFocus = inspect?.species === "honey";
    const shellFocus = inspect?.species === "shell";

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = rgba(RGB.honey, honeyFocus ? 0.28 : 0.09);
    ctx.lineWidth = honeyFocus ? 1.4 : 1;
    ctx.beginPath();
    const lem = this.lemniscatePath;
    for (let i = 0; i < lem.length; i++) {
      if (i === 0) ctx.moveTo(lem[i].x, lem[i].y);
      else ctx.lineTo(lem[i].x, lem[i].y);
    }
    ctx.stroke();

    ctx.strokeStyle = rgba(RGB.shell, shellFocus ? 0.34 : 0.08);
    ctx.lineWidth = shellFocus ? 1.3 : 1;
    ctx.beginPath();
    const sh = this.shellPath;
    for (let i = 0; i < sh.length; i++) {
      if (i === 0) ctx.moveTo(sh[i].x, sh[i].y);
      else ctx.lineTo(sh[i].x, sh[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  private drawStir() {
    if (this.stir.life <= 0) return;
    const { ctx } = this;
    const a = this.stir.life * 0.22;
    ctx.strokeStyle = rgba(RGB.spine, a);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.stir.x, this.stir.y, 36, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = rgba(RGB.spine, a * 0.5);
    ctx.beginPath();
    ctx.arc(this.stir.x, this.stir.y, 58, 0, TAU);
    ctx.stroke();
  }

  private drawNuclei() {
    const { ctx, layout } = this;
    const { cx, cy } = layout;
    ctx.fillStyle = rgba(RGB.spine, 1);
    ctx.beginPath();
    ctx.arc(cx, cy, 4.4, 0, TAU);
    ctx.fill();
    ctx.fillStyle = rgba(RGB.spine, 0.28);
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, TAU);
    ctx.fill();
  }

  private drawSpecies(species: SpeciesId) {
    const { ctx } = this;
    const rgb = RGB[species];
    const glow = species === "spine" ? 5.5 : species === "hermes" ? 4.2 : 3.4;
    for (const p of this.particles) {
      if (p.species !== species) continue;
      const a = this.alphaFor(species, p.stamp);
      this.strokeTrail(p, rgb, a * (species === "grok" ? 0.28 : 0.34), false);
      ctx.fillStyle = rgba(rgb, a * 0.22);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + glow, 0, TAU);
      ctx.fill();
      ctx.fillStyle = rgba(rgb, a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TAU);
      ctx.fill();
    }
  }

  private drawHoney() {
    const { ctx } = this;
    const rgb = RGB.honey;
    for (const p of this.particles) {
      if (p.species !== "honey") continue;
      const a = this.alphaFor("honey", p.stamp);
      const returned = p.stamp === "returned";
      this.strokeTrail(p, rgb, a * (returned ? 0.7 : 0.4), !returned);

      const nearSpine = Math.hypot(p.x - this.layout.cx, p.y - this.layout.cy) < 14;
      const bump = returned && nearSpine ? 1.18 : 1;

      ctx.fillStyle = rgba(rgb, a * 0.25);
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.size + (returned ? 5 : 3.2)) * bump, 0, TAU);
      ctx.fill();
      ctx.fillStyle = rgba(rgb, a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * bump, 0, TAU);
      ctx.fill();
    }
  }

  private strokeTrail(
    p: Particle,
    rgb: readonly [number, number, number],
    alpha: number,
    dashed: boolean,
  ) {
    if (p.trailN < 2 || alpha < 0.02) return;
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = rgba(rgb, alpha);
    ctx.lineWidth = dashed ? 0.9 : p.species === "honey" && p.stamp === "returned" ? 1.7 : 1.1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (dashed) ctx.setLineDash([2.5, 5]);
    ctx.beginPath();
    const n = p.trailN;
    const cap = p.trailCap;
    for (let k = 0; k < n; k++) {
      const idx = (p.trailI - n + k + cap * 4) % cap;
      const x = p.trail[idx * 2];
      const y = p.trail[idx * 2 + 1];
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export function toggleHoneyInspect(current: InspectState | null): InspectState {
  if (current?.species === "honey") {
    return {
      species: "honey",
      stamp: current.stamp === "exploring" ? "returned" : "exploring",
    };
  }
  return { species: "honey", stamp: "exploring" };
}
