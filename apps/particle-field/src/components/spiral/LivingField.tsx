import { useCallback, useEffect, useRef, useState } from "react";
import { FieldChrome } from "./FieldChrome";
import { SpiralSim, toggleHoneyInspect } from "@/lib/spiral/field";
import type { InspectState } from "@/lib/spiral/species";

const DRAG_THRESHOLD = 8;

type Probe = {
  pause: () => void;
  resume: () => void;
  inspect: (next: InspectState | null) => void;
  snapshot: () => ReturnType<SpiralSim["snapshot"]>;
};

declare global {
  interface Window {
    __spiral?: Probe;
  }
}

export function LivingField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SpiralSim | null>(null);
  const pointerRef = useRef({
    down: false,
    dragging: false,
    id: -1,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
  });

  const [paused, setPaused] = useState(false);
  const [inspect, setInspect] = useState<InspectState | null>(null);

  const applyPause = useCallback((next: boolean) => {
    setPaused(next);
    simRef.current?.setPaused(next);
  }, []);

  const applyInspect = useCallback((next: InspectState | null) => {
    setInspect(next);
    simRef.current?.setInspect(next);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sim = new SpiralSim(canvas);
    simRef.current = sim;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => sim.setReducedMotion(motion.matches);
    applyMotion();
    motion.addEventListener("change", applyMotion);

    const ro = new ResizeObserver(() => sim.resize());
    if (rootRef.current) ro.observe(rootRef.current);

    sim.start();

    const probe: Probe = {
      pause: () => applyPause(true),
      resume: () => applyPause(false),
      inspect: (next) => applyInspect(next),
      snapshot: () => sim.snapshot(),
    };
    window.__spiral = probe;

    return () => {
      motion.removeEventListener("change", applyMotion);
      ro.disconnect();
      sim.destroy();
      if (window.__spiral === probe) delete window.__spiral;
      simRef.current = null;
    };
  }, [applyInspect, applyPause]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        applyPause(!paused);
      } else if (e.code === "Escape") {
        applyInspect(null);
      } else if (e.code === "Digit1") {
        applyInspect({ species: "spine" });
      } else if (e.code === "Digit2") {
        applyInspect({ species: "hermes" });
      } else if (e.code === "Digit3") {
        applyInspect({ species: "grok" });
      } else if (e.code === "Digit4") {
        applyInspect(toggleHoneyInspect(inspect));
      } else if (e.code === "Digit5") {
        applyInspect({ species: "shell" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyInspect, applyPause, inspect, paused]);

  const localPoint = (e: PointerEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = localPoint(e);
    const p = pointerRef.current;
    p.down = true;
    p.dragging = false;
    p.id = e.pointerId;
    p.x = pt.x;
    p.y = pt.y;
    p.px = pt.x;
    p.py = pt.y;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerRef.current;
    if (!p.down || p.id !== e.pointerId) return;
    const pt = localPoint(e);
    const dx = pt.x - p.x;
    const dy = pt.y - p.y;
    if (!p.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      p.dragging = true;
    }
    const vx = pt.x - p.px;
    const vy = pt.y - p.py;
    p.px = pt.x;
    p.py = pt.y;
    if (p.dragging) {
      simRef.current?.setStir(true, pt.x, pt.y, vx, vy);
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerRef.current;
    if (!p.down || p.id !== e.pointerId) return;
    const pt = localPoint(e);
    simRef.current?.setStir(false, pt.x, pt.y, 0, 0);
    if (!p.dragging) {
      const hit = simRef.current?.hitTest(pt.x, pt.y) ?? null;
      if (hit?.species === "honey") {
        applyInspect(
          inspect?.species === "honey" ? toggleHoneyInspect(inspect) : hit,
        );
      } else {
        applyInspect(hit);
      }
    }
    p.down = false;
    p.dragging = false;
    p.id = -1;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative h-dvh w-full select-none overflow-hidden bg-void text-fg"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Living Spiral Ecosystem particle field. Drag to stir, tap a well to inspect."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      />
      <FieldChrome
        paused={paused}
        inspect={inspect}
        onTogglePause={() => applyPause(!paused)}
        onInspect={applyInspect}
        onToggleHoney={() => applyInspect(toggleHoneyInspect(inspect))}
      />
    </div>
  );
}
