# Particle Field (app stub)

Living Spiral Ecosystem visualization.

**Live demo:** https://yarrow-quartz-moss-tango.grok.me  
**Architecture:** [../../docs/particle-field.md](../../docs/particle-field.md)

## Current state

This folder is a stub. The working build is still hosted on grok.me.

Do not reconstruct source from the hosted page. Recover it with **Remix** on the live app, then place the project files here.

## Intended layout after export

```
apps/particle-field/
  README.md          # this file
  index.html         # or framework entry
  src/               # field runtime, species, wells
```

Exact filenames follow the Remix export. Keep the species names stable:

- Spine — still core
- Hermes — local runtime
- Grok — cloud · generative
- Honey — exchange
- Shell — outer orbit

## Interaction contract

**Spine stays · Wells pull · Honey crosses · Shell bounds.**

Controls:

- Drag to stir (Spine excluded)
- Space to pause
- Tap a well

Meaning, inspect copy, hexes, and public frame live in `docs/particle-field.md`. Do not invent a sixth species.

## Dual-write

Any durable change to meaning (not just motion or color) also updates `docs/particle-field.md` and a row in `docs/STATE-LEDGER.md`.
