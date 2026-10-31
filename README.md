# Concrete Mixer — site batching calculator

Offline, single-page web app for hand-mixed (drum mixer) concrete in Indonesia.
Doses aggregate by **level-full buckets**, holds the **w/c ceiling**, trims water by
**slump test**, logs every batch, and compares recipe cost with/without plasticizer.

No build step, no dependencies, no server logic. Three files + a manifest + icons.

## Files

| file | purpose |
|---|---|
| `index.html` | shell |
| `app.js` | all logic and views (vanilla JS) |
| `style.css` | mobile-first, high-contrast, wet-hands UI |
| `manifest.webmanifest` + `icons` | installable on Android |
| `sw.js` | offline cache (only registers on https) |

## Deployment

- **Tailnet (current):** `concrete-mix.service` serves this directory on
  `http://100.102.58.28:8092/` - read-only systemd unit, restart=always.
- **GitHub Pages:** push the files to a repo, enable Pages on the branch root.
  Everything is relative-path and static, so it works unchanged. HTTPS there also
  enables the service worker + "Add to home screen" (works fully offline).
- **File copy:** copy the folder to the phone and open `index.html` - works
  offline from `file://` too (service worker won't register, localStorage will).

## Model

Recipes are stored **per kg of cement** (weight ratios, SSD aggregate), so any
sack size / sack count scales automatically.

```
Cnom    = sackSize x sacks
Cact    = Cnom x (1 + buffer/100)
sand    = ratioSand  x Cact        (SSD)
gravel  = ratioGravel x Cact       (SSD)
water   = w/c x Cnom               <- design water, from NOMINAL cement
ceiling = w/c x Cact               <- hard stop, the only water margin
SP      = (spPct/100) x Cact / spDensity   <- dose given as % of cement weight
```

Superplasticizer follows the datasheet convention: **% of cement weight**
(Viscocrete 3115 N: 0.3–0.8% for soft plastic concrete, 0.8–2.0% only for flowing
or self-compacting). The app converts to litres with the product density
(default 1.06 kg/L), shows the batch dose in mL, and refuses to exceed the max dose.

The buffer therefore lowers the real w/c (`w/c x Cnom/Cact`) instead of scaling
the batch: +5% cement buys ~5% water-overrun tolerance. With buffer 0 the
ceiling equals the design water and the discipline is simply "never exceed w/c".

**Moisture (optional pan test).** `m = (wet - dry) / dry`, on a dry basis.
Free water credited from an aggregate: `dryMass x (m - absorption)`, floored at
zero. Batch wet mass = `dryMass x (1 + m)` where `dryMass = SSD / (1 + absorption)`.
Without a pan test the aggregate is assumed SSD and nothing is credited.

**Strength estimate** (indicative only): cube MPa `= A x exp(-2.88 x w/c)`,
`A = 169` OPC / `155` PCC. K `= MPa x 10.197`. Refined against logged cube results.

**Slump loop.** Start at 85% of the design water, then
`add = k x (10 - slump)`, `k = 2.4 L per cm per m3` (0.48 L/cm on a 0.2 m3 batch),
each step capped at 8% of batch water (max 2 L). Hard stop at the ceiling.
Too wet -> add cement + aggregate proportionally (`dC = excess water / w/c`).
`k` self-corrects from each finished batch (+-20% clamp).

**Cost.** Quantities normalised per m3 from absolute volumes
(SG: cement 3.15, aggregate 2.65). Sand/gravel Rp per m3 is converted to Rp/kg
using the bulk density measured during bucket calibration. Break-even SP price:

```
breakEven(Rp/L) = (costOfNoSPRecipe - costOfSPRecipeExcludingSP) / SP litres
```

## Defaults (editable in the app)

| recipe | sand | gravel | w/c | cement/m3 | ≈strength |
|---|---|---|---|---|---|
| K300 site mix | 1.80 | 2.75 | 0.50 | 387 kg | 36.7 MPa ≈ K374 |
| K250 site mix | 2.05 | 3.10 | 0.55 | 349 kg | 31.8 MPa ≈ K324 |
| K300 Jayamix design | 3.367 | 2.857 | 0.595 | 300 kg | 27.9 MPa ≈ K285 (needs SP) |
| K250 Jayamix design | 3.817 | 3.206 | 0.668 | 270 kg | 22.6 MPa ≈ K231 (needs SP) |

The two Jayamix rows are derived from the PT SCG Readymix Indonesia (Jayamix) mix
design 427/E-MD-SRMI/VIII/2026 for this project (K-250/K-300, 10+-2 cm slump, SSD).
Their **retarder is deliberately dropped** — it exists for truck transit, not site
mixing. Those mixes are only workable with superplasticizer at that cement content.

Note the estimate lands *below* their nominal K250/K300 for those two rows. That is
the model being honest, not a criticism of their design: readymix uses strength-class
cement (OPC 50), optimised grading and a batching plant, so it hits the grade at
w/c 0.6-0.67 where a generic PCC curve says it shouldn't. Site mixing cannot
reproduce that control — hence the leaner w/c in the site-mix defaults.

Site-mix defaults are the trimmed, no-admixture recipes: strength comes from
w/c, cement content buys only paste/workability. Validate with one trial batch
and 7/28-day cubes before trusting them on structure.

## First run on site

1. **Calibration** — bucket tare, bucket volume in litres, then 3 full buckets of
   sand and 3 of gravel weighed and averaged. Re-weigh after rain or a new delivery.
2. **Pan test (optional)** — 1 kg wet sample, dry it, weigh again. Absorption
   defaults: sand 1.5%, gravel 0.8%.
3. **Cost** (optional) — cement per sack, sand/gravel per m3, SP per litre.
4. **Batch** — pick grade, sack size, sacks per batch. The app gives full buckets
   plus a remainder; nothing is ever subtracted from a full bucket.
5. **Slump** — pour the start water, measure, record. Follow the addition, repeat.

## Data

Everything lives in `localStorage` under `concrete-mix-v1`. Export CSV (spreadsheet)
or a JSON backup from the Diary tab. Import the JSON to restore or move phones.
