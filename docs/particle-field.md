# Particle Field — Living Spiral Ecosystem

**Status:** Shell visualization (Grok-hosted Build)  
**Live:** https://yarrow-quartz-moss-tango.grok.me  
**Date sealed here:** 2026-09-06  
**Interaction contract sealed:** 2026-09-06  
**Honey crossing + organism map sealed:** 2026-09-07  
**Source of truth for code:** pending Remix export into `apps/particle-field/`  
**Grok Build project id (recovery only):** `01a06fd3-a3e6-75d0-9424-51ec01ede7f8`

## What it is

An interactive particle field that makes the dual-runtime architecture visible:

- a still core (Spine)
- a local well (Hermes)
- a cloud well (Grok)
- exchange particles (Honey) traveling a figure-eight between the wells
- an outer orbit (Shell)

The field is not a new doctrine. It is a felt map of the existing Spine / Shell / Polarity model.

Anchor sentence: **The spine does not spin. The field shows the life that does.**

One-line contract: **Spine stays · Wells pull · Honey crosses · Shell bounds.**

## Species behavior

Five species. Not five colors. Physics differs; paint follows.

| Species | Role | Inspect copy (live field) | How it treats the others |
|---|---|---|---|
| Spine | Still core | Holds still. Identity of the system — not a swirl. | Tight home spring, heavy damping. Immune to stir. Everything else may move around it. |
| Hermes | Local runtime | Mac mini. Dense, short travel. Work that stays close. | Stronger well pull, shorter paths, quieter noise. Keeps work near the machine. |
| Grok | Cloud · generative | Faster, farther. Cloud well — more particles, longer paths. | Weaker pull, longer paths, more particles, faster noise. Lets generation range. |
| Honey | Exchange | Work moving between wells along the living spiral. | Walks the figure-eight (lemniscate) between wells. The only species whose job is the relationship. |
| Shell | Outer orbit | Membrane. May orbit. The spine inside it does not spin. | Slow ellipse around the whole field. Marks the edge. Does not rewrite the core. |

## Murmuration rules (sealed 2026-09-07)

Coordination in the field is local, not conducted.

- **Align** — Spine (shared direction / identity)
- **Cohere** — Honey crossings (`docs/honey-crossing.md`)
- **Separate** — Hermes short-path, Grok long-path, Shell bound

Honey crossings carry one of two stamps:

- **Returned** — Spine-grade. May land in the ledger and honeycombs.
- **Exploring** — candidate only. May move. May not update current truth.

Do not invent a sixth species. Do not add a manager particle.

## Organism map (sealed 2026-09-07)

The field has five species. Sibling *organisms* are not species.

| Kind | What | Home |
|---|---|---|
| Ecosystem / field physics | Living Spiral Systems | this repo |
| Field species (exactly 5) | Spine, Hermes, Grok, Honey, Shell | this document |
| Sibling organisms | Eden Weaver, RAF, First Root, Hermes Interface, Biomimicry Strategy | their own repos |

First Root is its own organism, like Eden Weaver. It uses Living Spiral rhythm. It does not inhabit the particle field as a sixth species and is not nested inside Shell.

## Visual contract

| Species | Hex |
|---|---|
| Spine | `#f4e6c3` |
| Hermes | `#c4a574` |
| Grok | `#7ec8e3` |
| Honey | `#e0b25a` |
| Honey Exploring | `#e0b25a` at ~0.45 opacity or shorter dashes |
| Honey Returned | `#e0b25a` full opacity, slightly larger |
| Shell | `#8aa4b0` |
| Void | `#0b0e12` |

Type in the hosted field: Fraunces (display) + Atkinson Hyperlegible (body).

## Controls

- Drag to stir the field (Spine excluded)
- Space to pause
- Tap a well (Hermes, Spine, or Grok) to focus / inspect
- Tap Honey to inspect Returned vs Exploring (do not add a new well)

## Public frame

Lead with architecture and species interaction. Do not lead with renderer experiments or a 3D pass.

- Hook: **Five species. Not five colors.**
- Anchor: **The spine does not spin. The field shows the life that does.**
- CTA shape: which species is missing — Spine, Honey, or Shell?
- Do not pitch First Root, Eden Weaver, or RAF as particles in this field.

Content drafts that follow this frame are Shell. They are not auto-posted. Hook 5 / Overnight Agents remains retired.

## Implementation notes (Shell)

- Live build is Canvas 2D. No WebGL in the hosted field.
- Honey path is a Bernoulli lemniscate between the two wells.
- Stir is a pointer vortex. Spine is exempt.
- Inspect copy above is the meaning layer. Do not invent a sixth species.
- Do not scrape or reconstruct grok.me JS as canonical source. Recover with Remix, then export into `apps/particle-field/`.
- Honey visual may distinguish Returned vs Exploring. Physics stay five species.

## Memory analogue (optional Shell pattern)

Use only when designing retrieval. Not a product recommendation.

| Field species | Memory analogue |
|---|---|
| Spine | Verified, human-readable rules (honeycombs, this ledger) |
| Hermes | Local private index |
| Grok | Cloud / shared corpus retrieval |
| Honey | Embed → retrieve → hand across the bridge |
| Shell | Metadata filters and permissions |

Do not dump the Spine into vectors and hope. Embeddings are “related.” The ledger is “current.”

## What this note includes

- Live URL and architecture note (this file)
- Species behavior + inspect copy + visual contract
- Murmuration rules + Honey stamps
- Sibling-organism map
- Public-frame lock
- App stub at `apps/particle-field/`
- Evolution log and State Ledger rows

## What this note does not include

- Original Grok Build project source
- A scraped or reconstructed runtime copied from grok.me
- A Spine rewrite
- A public 3D claim
- First Root, Eden Weaver, or RAF as field species

The hosted app remains the working demo until a clean Remix export lands in `apps/particle-field/`.

## Recovery path

1. Open the live field.
2. Use **Remix** on the Grok chrome to recover the project.
3. Export or paste the project files into this repo under `apps/particle-field/`.
4. Keep this document as the architecture note; update the live URL if the grok.me slug changes.

## Placement in the ecosystem

- **Spine:** dual-runtime persistence, weekly return, regenerative orientation — unchanged.
- **Shell:** this visualization, interaction model, hosted URL, public frame, Honey protocol — fully mutable.
- **Polarity:** Hermes well ↔ Grok well, regulated by the still Spine. Honey is the visible exchange.

## Ledger rule

Progress on the field is recorded in `docs/STATE-LEDGER.md`. Do not create a second ledger.
Honey protocol detail lives in `docs/honey-crossing.md`.
