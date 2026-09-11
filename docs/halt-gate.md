# Halt-Gate field contract

Sealed 2026-09-11. Shell contract. Spine principle stays in Grok skill `living-spiral-spine-shell` and this repo.

**Anchor:** A check that cannot halt the next node is an eval. Return the failed unit, not the batch.

One ledger only: `docs/STATE-LEDGER.md`. Drive Doc is a human mirror. Do not create a second ledger.

## Required first line

Every Night, Dawn, Weekly, and Email Crossing row starts with:

```
GATE: JOB=<id> STATUS=<token> NEXT=<RUN|SKIP> SKIP=<nodes-or-NONE>
```

- JOB: `NIGHT` | `DAWN` | `WEEKLY` | `EMAILX` | `MONTHLY` | `OPP`
- STATUS: `PASS` | `FAIL` | `RETIRE` | `QUIET` | `STEER`
- SKIP targets: `DRAFT` | `5LEVER` | `PACK` | `THEME` | `POST` or `NONE`

## Verdict map

| Existing verdict | STATUS | NEXT | SKIP |
|---|---|---|---|
| SHIP-DRAFT | PASS | RUN | POST |
| TIGHTEN-10 | PASS | RUN | NONE (Dawn only) |
| RETIRE | RETIRE | SKIP | DRAFT,5LEVER,PACK,THEME,POST |
| QUIET | QUIET | SKIP | DRAFT,5LEVER,PACK,THEME,POST |
| bad write / clone / invented theme | FAIL | SKIP | DRAFT,PACK,THEME |
| human must decide | STEER | SKIP | POST |

Quiet and RETIRE are valid green halts. Do not invent a next node to stay busy.

## Night extra fields

```
Clone: Y|N
PriorDawn: SHIP-DRAFT|TIGHTEN-10|RETIRE|QUIET|NONE
SameTitleStreak: 0-9
Write: SHA <hex>|FAIL
ThemeNew: Y|N
```

- PriorDawn RETIRE or QUIET → STATUS=QUIET. No pack.
- Clone=Y or ThemeNew=Y → STATUS=FAIL. Return this unit only.
- Write=FAIL → STATUS=FAIL. Weekly must not use the night as a seed.

## Weekly extra fields

```
UptakeEmailX: Y|N
WeekRollup: SHIP|MIX|RETIRE|QUIET
FiveLever: RUN|SKIP
AutoDiff: NONE|<named diff>
ConstraintSealed: Y|N
Fork: NONE|<chosen> // <skipped>
```

- UptakeEmailX=N → FAIL uptake unit only. FiveLever=SKIP.
- WeekRollup RETIRE or QUIET → FiveLever=SKIP. Valid green.
- 5-Lever runs only when WeekRollup is SHIP or MIX and UptakeEmailX=Y.
- Fork=NONE on quiet weeks. No ghost paths.

## Skip map

| Night STATUS | Dawn may | Weekly 5-Lever | Weekly pack |
|---|---|---|---|
| PASS | score + excerpt | allowed if week rollup allows | draft only |
| QUIET | score only; no rebuild | SKIP | SKIP |
| RETIRE | confirm RETIRE; no rebuild | SKIP | SKIP |
| FAIL | score the failure; no rebuild | must not use Night as seed | SKIP |
| STEER | wait | wait | SKIP POST |

Email Crossing does not run 5-Lever. FAIL only if its write fails.

## Dual-write

Any Spine or live-job contract change must land in this repo the same session as the Grok honeycomb / automation patch. Honeycombs alone are not complete.
