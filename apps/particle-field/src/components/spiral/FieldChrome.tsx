import { Pause, Play, X } from "lucide-react";
import { COPY, type HoneyStamp, type InspectState, type SpeciesId } from "@/lib/spiral/species";
import { cn } from "@/lib/utils";

const STRIP: { id: SpeciesId; label: string; short: string; dot: string; ink: string }[] = [
  { id: "spine", label: COPY.strip.spine, short: "Spine", dot: "bg-spine", ink: "text-spine" },
  { id: "hermes", label: COPY.strip.hermes, short: "Hermes", dot: "bg-hermes", ink: "text-hermes" },
  { id: "grok", label: COPY.strip.grok, short: "Grok", dot: "bg-grok", ink: "text-grok" },
  { id: "honey", label: COPY.strip.honey, short: "Honey", dot: "bg-honey", ink: "text-honey" },
  { id: "shell", label: COPY.strip.shell, short: "Shell", dot: "bg-shell", ink: "text-shell" },
];

const BAR: Record<SpeciesId, string> = {
  spine: "border-spine",
  hermes: "border-hermes",
  grok: "border-grok",
  honey: "border-honey",
  shell: "border-shell",
};

type Props = {
  paused: boolean;
  inspect: InspectState | null;
  onTogglePause: () => void;
  onInspect: (next: InspectState | null) => void;
  onToggleHoney: () => void;
};

export function FieldChrome({
  paused,
  inspect,
  onTogglePause,
  onInspect,
  onToggleHoney,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <header className="absolute inset-x-0 top-0 bg-gradient-to-b from-void/80 to-transparent px-4 pt-4 pb-8 sm:px-6 sm:pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display hud-copy text-balance text-2xl leading-tight text-fg sm:text-3xl">
              {COPY.title}
            </h1>
            <p className="font-body hud-copy mt-1 max-w-xl text-pretty text-sm leading-snug text-muted">
              {COPY.subtitle}
            </p>
          </div>
          <PauseButton paused={paused} onToggle={onTogglePause} />
        </div>
      </header>

      {inspect ? (
        <InspectNote inspect={inspect} onClose={() => onInspect(null)} />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/85 via-void/40 to-transparent pt-10 pb-[max(0.7rem,env(safe-area-inset-bottom))]">
        {inspect ? <MobileCaption inspect={inspect} /> : null}
        <SpeciesStrip
          inspect={inspect}
          onInspect={onInspect}
          onToggleHoney={onToggleHoney}
        />
        <p
          className={cn(
            "font-body hud-copy mt-0.5 px-4 text-center text-xs leading-relaxed text-muted",
            inspect && "hidden sm:block",
          )}
        >
          {inspect
            ? inspect.species === "honey"
              ? COPY.honeyCaption
              : COPY.contract
            : COPY.footer}
        </p>
      </div>
    </div>
  );
}

function PauseButton({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? "Resume field" : "Pause field"}
      className="pointer-events-auto inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line bg-void/40 px-2.5 text-fg transition-[background-color,border-color,scale] duration-150 ease-out hover:border-line-strong hover:bg-elevated/70 active:scale-[0.96]"
    >
      <span className="relative size-4">
        <Play
          className={cn(
            "absolute inset-0 size-4 translate-x-px transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            paused ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
          )}
          strokeWidth={1.75}
        />
        <Pause
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            paused ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
          )}
          strokeWidth={1.75}
        />
      </span>
      {paused ? (
        <span className="font-body hud-copy pr-1 text-xs font-medium tracking-wide">Paused</span>
      ) : null}
    </button>
  );
}

function SpeciesStrip({
  inspect,
  onInspect,
  onToggleHoney,
}: {
  inspect: InspectState | null;
  onInspect: (next: InspectState | null) => void;
  onToggleHoney: () => void;
}) {
  return (
    <ul className="no-scrollbar flex flex-nowrap items-center justify-center gap-0 overflow-x-auto px-2">
      {STRIP.map((item, i) => {
        const active = inspect?.species === item.id;
        return (
          <li key={item.id} className="flex items-center">
            {i > 0 ? (
              <span className="hud-copy mx-0.5 text-muted/50 sm:mx-1" aria-hidden>
                ·
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (item.id === "honey") {
                  onToggleHoney();
                  return;
                }
                if (active) onInspect(null);
                else onInspect({ species: item.id } as InspectState);
              }}
              className={cn(
                "pointer-events-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 sm:px-2.5",
                "font-body hud-copy text-xs font-medium tracking-wide sm:text-sm",
                "transition-[color,opacity,background-color] duration-150 ease-out",
                active ? item.ink : "text-muted hover:text-fg",
              )}
              aria-pressed={active}
              aria-label={item.label}
            >
              {item.id === "honey" ? (
                <HoneySwatch activeStamp={inspect?.species === "honey" ? inspect.stamp : null} />
              ) : (
                <span className={cn("size-2 rounded-full", item.dot)} aria-hidden />
              )}
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function HoneySwatch({ activeStamp }: { activeStamp: HoneyStamp | null }) {
  return (
    <span className="relative flex items-center" aria-hidden>
      <span className="size-2 rounded-full bg-honey/45" />
      <span
        className={cn(
          "ml-0.5 size-2 rounded-full bg-honey",
          activeStamp === "exploring" && "opacity-50",
        )}
      />
    </span>
  );
}

function inspectTitle(inspect: InspectState) {
  if (inspect.species === "honey") {
    return `Honey · ${inspect.stamp === "returned" ? "Returned" : "Exploring"}`;
  }
  return COPY.strip[inspect.species];
}

function MobileCaption({ inspect }: { inspect: InspectState }) {
  const species = inspect.species;
  return (
    <p
      className="font-body hud-copy mx-auto mb-1 max-w-md px-4 text-center text-sm leading-snug text-fg/90 sm:hidden"
      aria-live="polite"
    >
      <span className="font-medium text-fg">{inspectTitle(inspect)}</span>
      {" — "}
      {COPY.inspect[species]}
    </p>
  );
}

function InspectNote({
  inspect,
  onClose,
}: {
  inspect: InspectState;
  onClose: () => void;
}) {
  const species = inspect.species;
  const title = inspectTitle(inspect);

  return (
    <aside
      className={cn(
        "pointer-events-auto absolute top-24 left-6 z-20 hidden max-w-xs sm:block",
        "rounded-r-xl border-l-2 bg-void/55 py-2.5 pr-1.5 pl-3.5",
        "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        BAR[species],
      )}
      role="region"
      aria-label={`${title} inspect`}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-body hud-copy text-xs font-medium tracking-wide text-muted">
            {COPY.role[species]}
            <span className="mx-1.5 text-muted/50">·</span>
            {COPY.murmurTag[species]}
          </p>
          <h2 className="font-display hud-copy text-lg leading-tight text-fg">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspect"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-[color,background-color,scale] duration-150 ease-out hover:bg-elevated/70 hover:text-fg active:scale-[0.96]"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <p className="font-body hud-copy mt-1 max-w-prose text-pretty text-sm leading-snug text-fg/90">
        {COPY.inspect[species]}
      </p>
      {species === "honey" ? (
        <p className="font-body hud-copy mt-1 text-xs leading-snug text-muted">
          {COPY.honeyStamp[inspect.stamp]}
        </p>
      ) : null}
    </aside>
  );
}