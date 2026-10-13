# Particle Field

Living Spiral Ecosystem visualization. Canvas 2D. Five species.

**Live demo:** https://bolt-cinder-urban-cobalt.grok.me  
**Architecture:** [../../docs/particle-field.md](../../docs/particle-field.md)  
**Honey protocol:** [../../docs/honey-crossing.md](../../docs/honey-crossing.md)

## Source (landed 2026-09-07)

This folder is the field runtime recovered from the Grok Build Remix. It is the canonical source for motion, hexes, inspect copy, and chrome.

```
apps/particle-field/
  README.md
  public/favicon.svg
  src/
    styles.css                 # void + species tokens, HUD type
    lib/spiral/field.ts        # Canvas 2D sim
    lib/spiral/species.ts      # names, hexes, inspect copy
    lib/spiral/math.ts         # lemniscate, ellipse
    components/spiral/         # canvas wrapper + HUD chrome
    routes/index.tsx           # TanStack Start mount
```

The hosted app still runs on grok.me. Host scaffolding (auth, PWA, preview bridge) stays in the Build workspace; it is not part of this organism.

## Species (do not rename)

- Spine — still core
- Hermes — local runtime
- Grok — cloud · generative
- Honey — exchange (Returned or Exploring stamp)
- Shell — outer orbit

## Interaction contract

**Spine stays · Wells pull · Honey crosses · Shell bounds.**

Murmuration rules:

- Align = Spine
- Cohere = Honey crossings
- Separate = well physics + Shell bound

Controls:

- Drag to stir (Spine excluded)
- Space to pause
- Tap a well
- Tap Honey to inspect Returned vs Exploring

Meaning, inspect copy, hexes, and public frame live in `docs/particle-field.md`. Do not invent a sixth species. Do not render First Root, Eden Weaver, or RAF as particles.

## Grok Build notes (2026-10-13)

Shell agents (Grok Bot fleet) may be visualized as temporary tracers inside the Shell zone only:

- Spine Coordinator, Signal Desk, Content Mycelium, Knowledge Weaver, Opportunity Scout.
- They are not a sixth species and must use Shell physics.
- Brighten tracers during handoff packets (Signal → Content → Knowledge).
- Fade them when Knowledge Weaver seals a result.
- Returned seals from the bot fleet (after human approval) are allowed Honey Returned crossings. See `docs/honey-crossing.md`.

Do not add a manager particle or new well. Species count remains exactly five.

## Chrome (sealed 2026-09-07)

The particle field is the product. Species information is complementary, not a cover.

- Header: title + pause, gradient scrim only
- Bottom HUD: species strip + one-line caption, gradient scrim only
- Inspect (desktop): slim note in the upper-left void — does not cover wells or figure-8
- Inspect (mobile): caption sits in the bottom HUD, no covering card

## Dual-write

Any durable change to meaning (not just motion or color) also updates `docs/particle-field.md`, `docs/honey-crossing.md` if the crossing rule changes, and a row in `docs/STATE-LEDGER.md`.
