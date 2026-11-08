'use strict';
/* ===========================================================================
   Concrete Mixer — offline site batching calculator
   Single-page, no dependencies, localStorage state, PWA-installable.
   =========================================================================== */

const VERSION = '1.12.0';

/* ---------------------------------------------------------------- i18n --- */
const ID = {
  'Batch': 'Campuran', 'Slump': 'Slump', 'Diary': 'Catatan', 'Grades': 'Mutu',
  'Calibration': 'Kalibrasi', 'Cost': 'Biaya', 'Settings': 'Setelan',
  'Grade': 'Mutu beton', 'Cement sack': 'Karung semen', 'Sacks per batch': 'Karung per campuran',
  'Cement buffer': 'Cadangan semen', 'Buffer %': 'Cadangan %',
  'Recipe': 'Resep', 'Bucket plan': 'Rencana ember', 'Water': 'Air',
  'Cement': 'Semen', 'Sand': 'Pasir', 'Gravel': 'Kerikil (split)',
  'Start batch': 'Mulai campuran', 'Finish batch': 'Selesai',
  'Cancel batch': 'Batalkan', 'Record slump': 'Catat slump',
  'Total water': 'Total air', 'Water ceiling': 'Batas air', 'Max total water': 'Air maksimum',
  'Start water': 'Air awal', 'Plasticizer': 'Plastisizer (SP)',
  'Batch volume': 'Volume campuran', 'Mixer capacity': 'Kapasitas molen',
  'Full buckets': 'Ember penuh', 'remainder': 'sisa',
  'Not calibrated yet': 'Belum dikalibrasi',
  'Moisture': 'Kadar air', 'Dry basis': 'Basis kering',
  'Absorption': 'Penyerapan', 'wet sample': 'sampel basah', 'dry sample': 'sampel kering',
  'Average bucket': 'Rata-rata ember', 'weighings': 'penimbangan',
  'Add weighing': 'Tambah timbangan', 'Clear': 'Hapus',
  'Bucket tare': 'Berat ember kosong', 'Bucket volume': 'Volume ember',
  'Pan test (optional)': 'Uji wajan (opsional)',
  'Use sand moisture': 'Pakai kadar air pasir', 'Use gravel moisture': 'Pakai kadar air kerikil',
  'Prices': 'Harga', 'Cement per sack': 'Semen per karung',
  'Sand per m3': 'Pasir per m3', 'Gravel per m3': 'Kerikil per m3',
  'Plasticizer per litre': 'Plastisizer per liter', 'Water per m3': 'Air per m3',
  'Cost per m3': 'Biaya per m3', 'Cost per batch': 'Biaya per campuran',
  'Compare recipes': 'Bandingkan resep', 'Break-even SP price': 'Harga SP titik impas',
  'Export CSV': 'Ekspor CSV', 'Export backup': 'Ekspor cadangan',
  'Add batches from file': 'Tambah batch dari file',
  'Restore backup': 'Pulihkan cadangan',
  'adds only, never replaces': 'hanya menambah, tidak mengganti',
  'replaces everything on this phone': 'mengganti semua di HP ini',
  'Delete': 'Hapus', 'Edit': 'Ubah', 'Add grade': 'Tambah mutu', 'Reset defaults': 'Kembalikan awal',
  'Notes': 'Catatan', 'Cube tests': 'Uji kubus', '7 days': '7 hari', '28 days': '28 hari',
  'Strength estimate': 'Perkiraan kuat tekan', 'Cement type': 'Jenis semen',
  'Target slump': 'Target slump', 'Slump band': 'Toleransi slump',
  'Water per cm, per m3': 'Air per cm, per m3', 'Start water %': 'Air awal %',
  'Language': 'Bahasa', 'Save': 'Simpan', 'Close': 'Tutup',
  'Danger zone': 'Zona berbahaya', 'Erase all data': 'Hapus semua data',
  'Batches': 'Campuran', 'Water used': 'Air terpakai', 'Final slump': 'Slump akhir',
  'Add water': 'Tambah air', 'Pour now': 'Tuang sekarang', 'Remaining': 'Sisa',
  'No batches logged yet.': 'Belum ada campuran tercatat.',
  'Grade table': 'Tabel mutu', 'per kg cement': 'per kg semen',
  'Source': 'Sumber', 'Site mix': 'Campuran site', 'Readymix design': 'Desain readymix',
  'kg per bucket': 'kg per ember', 'Ready': 'Siap', 'Over capacity': 'Melebihi kapasitas',
  'Strength (MPa)': 'Kuat tekan (MPa)', 'Cement content': 'Kadar semen',
  'Recipe name': 'Nama resep', 'Sand ratio': 'Rasio pasir', 'Gravel ratio': 'Rasio kerikil',
  'w/c': 'w/c', 'SP L per kg cement': 'SP L per kg semen',
  'buckets': 'ember', 'Bulk density': 'Berat jenis lepas', 'Record slump': 'Catat slump',
  'of mixer': 'dari molen', 'Pour now': 'Tuang sekarang',
  'Water to pour': 'Air untuk dituang', 'Water in aggregate': 'Air dalam agregat',
  'Readymix per m3': 'Readymix per m3', 'Calib': 'Kalib', 'exact': 'pas',
  'fill calibration': 'isi kalibrasi', 'Remaining': 'Sisa',
  'Reset': 'Kembalikan', 'Reset settings to defaults': 'Kembalikan setelan ke awal',
  'Reset recipes to defaults': 'Kembalikan resep ke awal', 'Jayamix design': 'Desain Jayamix',
  'Superplasticizer max dose': 'Dosis maksimum superplasticizer', 'SP density': 'Massa jenis SP',
  'Dose capped': 'Dosis dibatasi', 'Batch scatter σ': 'Sebaran batch σ',
  'target': 'target', 'Invalid backup': 'Cadangan tidak valid', 'OK': 'OK',
  'sand': 'pasir', 'gravel': 'kerikil',
  'Where it goes': 'Untuk bagian', 'Tips': 'Panduan', 'Back': 'Kembali', 'Resume': 'Lanjutkan',
  'Cast': 'Cetak', 'due now': 'sudah jatuh tempo', 'due in': 'jatuh tempo dalam', 'Pours': 'Coran',
  'Ungrouped': 'Tanpa coran',
  'Staging': 'Persiapan', 'Staged': 'Siap', 'Slump test': 'Uji slump',
  'Buffer': 'Cadangan',
  'Plasticizer only': 'Plastisizer saja', 'Both at max': 'Air dan SP di batas',
  'SP max': 'Maks SP', 'Default max dose': 'Dosis maks awal',
  'Superplasticizer': 'Superplastisizer', 'In the drum': 'Di drum',
  'Advise': 'Saran', 'Add': 'Tambah'
};

let LANG = 'en';
const t = (s) => (LANG === 'id' ? (ID[s] || s) : s);

/* --------------------------------------------------------------- utils --- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (v, d = 0) => (isFinite(v) ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round = (v, step) => Math.round(v / step) * step;

function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
function setPath(obj, path, val) {
  const p = path.split('.'); const last = p.pop();
  let o = obj; for (const k of p) { if (o[k] == null) o[k] = {}; o = o[k]; }
  o[last] = val;
}

/* --------------------------------------------------------------- state --- */
const DEFAULT_GRADES = () => ([
  { id: 'g300s', key: 'K300', name: 'K300 — site mix (No SP)',       source: 'site', sand: 1.80,  gravel: 2.75,  wc: 0.490,  sp: 0,    spCap: 0.8 },
  { id: 'g250s', key: 'K250', name: 'K250 — site mix (No SP)',       source: 'site', sand: 2.05,  gravel: 3.10,  wc: 0.540,  sp: 0,    spCap: 0.8 },
  { id: 'g300r', key: 'K300', name: 'K300 — Jayamix design (With SP)', source: 'rmx',  sand: 3.367, gravel: 2.857, wc: 0.5953, sp: 0.48, spCap: 0.8 },
  { id: 'g250r', key: 'K250', name: 'K250 — Jayamix design (With SP)', source: 'rmx',  sand: 3.817, gravel: 3.206, wc: 0.6680, sp: 0.53, spCap: 0.8 },
  { id: 'gpile', key: 'Pile', name: 'K350 — Bore pile mix', source: 'site', sand: 2.275, gravel: 2.175, wc: 0.450, sp: 0.40, spCap: 0.8, tslump: 16 }
]);

const DEFAULTS = () => ({
  lang: 'en',
  grades: DEFAULT_GRADES(),
  gradeId: 'g300s',
  sackSize: 40,
  sacks: 2,
  bufferPct: 0,
  startWaterPct: 85,
  targetSlump: 10,
  band: 2,
  mixerL: 350,
  cementType: 'PCC',
  kPerM3PerCm: 2.4,
  spMaxPct: 0.8,
  spDensity: 1.06,
  spUnitV2: true,
  spCapV1: true,
  sigmaMPa: 5,
  wcTrimV2: true,
  defaultsV: 4,
  pourTag: '',
  cal: { tare: 2, bucketL: 20, sandWeigh: [36], gravelWeigh: [30], date: new Date().toISOString().slice(0, 10) },
  moist: { useSand: false, useGravel: false, sandWet: 0, sandDry: 0, gravelWet: 0, gravelDry: 0, sandAbs: 1.5, gravelAbs: 0.8 },
  prices: { cement: 64000, sandPerM3: 550000, gravelPerM3: 550000, spPerL: 90000, waterPerM3: 0, rmxPerM3: 1400000 },
  log: [],
  live: null
});

const KEY = 'concrete-mix-v1';
let S = DEFAULTS();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    S = Object.assign(DEFAULTS(), d);
    S.cal = Object.assign(DEFAULTS().cal, d.cal || {});
    S.moist = Object.assign(DEFAULTS().moist, d.moist || {});
    S.prices = Object.assign(DEFAULTS().prices, d.prices || {});
    if (!Array.isArray(S.grades) || !S.grades.length) S.grades = DEFAULT_GRADES();
    if (!Array.isArray(S.log)) S.log = [];
    // migration: the readymix preset is Jayamix (SCG Readymix Indonesia); label the SP split
    S.grades.forEach((g) => {
      if (!g || typeof g.name !== 'string') return;
      g.name = g.name.replace(/readymix design/i, 'Jayamix design').trim();
      if (/Jayamix design/i.test(g.name) && !/\(With SP\)/i.test(g.name)) g.name += ' (With SP)';
      if (/site mix/i.test(g.name) && !/\(No SP\)/i.test(g.name)) g.name += ' (No SP)';
    });
    // migration: SP used to be litres per kg of cement, now % of cement weight
    if (!d.spUnitV2) {
      S.grades.forEach((g) => {
        if (g && +g.sp > 0 && +g.sp < 0.05) g.sp = +(+g.sp * (+S.spDensity || 1.06) * 100).toFixed(3);
      });
      S.spUnitV2 = true;
    }
    // migration: site-mix w/c trimmed to hold the characteristic grade at sigma 5 MPa
    if (!d.wcTrimV2) {
      S.grades.forEach((g) => {
        if (!g) return;
        if (g.id === 'g300s' && Math.abs(+g.wc - 0.500) < 1e-6) g.wc = 0.490;
        if (g.id === 'g250s' && Math.abs(+g.wc - 0.550) < 1e-6) g.wc = 0.540;
      });
      S.wcTrimV2 = true;
    }
    // migration: the SP dose cap is per recipe now (0.8 % = top of the datasheet
    // band for soft-plastic concrete). Fill blanks only — never overwrite a typed cap.
    if (!d.spCapV1) {
      S.grades.forEach((g) => { if (g && !(+g.spCap > 0)) g.spCap = +S.spMaxPct || 0.8; });
      S.spCapV1 = true;
    }
    // migration: ship new built-in presets to existing installs (only ones never seen)
    if (!(+d.defaultsV >= 2)) {
      const have = new Set(S.grades.map((g) => g.id));
      const pile = DEFAULT_GRADES().find((g) => g.id === 'gpile');
      if (pile && !have.has(pile.id)) S.grades.push(pile);
      S.defaultsV = 2;
    }
    // migration: name the bore pile preset by its grade (only if the name is untouched)
    if (!(+d.defaultsV >= 3)) {
      const p = S.grades.find((g) => g && g.id === 'gpile');
      if (p && p.name === 'Bore Pile Mix (w/c 0.45, slump 16±2)') {
        p.name = DEFAULT_GRADES().find((g) => g.id === 'gpile').name;
      }
      S.defaultsV = 3;
    }
    // migration: site prices + a starter bucket calibration so bucket counts show on first open.
    // Only blanks are filled — anything already typed by the user is left alone.
    if (!(+d.defaultsV >= 4)) {
      const P = { cement: 64000, sandPerM3: 550000, gravelPerM3: 550000, spPerL: 90000 };
      Object.keys(P).forEach((k) => { if (!(+S.prices[k] > 0)) S.prices[k] = P[k]; });
      if (!(+S.cal.tare > 0)) S.cal.tare = 2;
      if (!(+S.cal.bucketL > 0) || Math.abs(+S.cal.bucketL - 12) < 1e-9) S.cal.bucketL = 20;
      if (!Array.isArray(S.cal.sandWeigh) || !S.cal.sandWeigh.length) S.cal.sandWeigh = [36];
      if (!Array.isArray(S.cal.gravelWeigh) || !S.cal.gravelWeigh.length) S.cal.gravelWeigh = [30];
      if (!S.cal.date) S.cal.date = new Date().toISOString().slice(0, 10);
      S.defaultsV = 4;
    }
    // migration: an open batch is a row ledger now. Rebuild the timeline from the
    // old adds[] — each addition was stored with the reading that followed it.
    if (S.live && !Array.isArray(S.live.rows)) {
      const sl = Array.isArray(S.live.slumps) ? S.live.slumps : [];
      const ad = Array.isArray(S.live.adds) ? S.live.adds : [];
      const t0 = +S.live.ts || Date.now();
      const rows = [];
      sl.forEach((x, i) => {
        const a = ad[i];
        if (a && +a.L > 0) rows.push({ id: 'm' + i + 'w', t: (+x.t || t0 + i * 60000) - 2000, kind: 'water', L: +a.L });
        if (a && +a.sp > 0) rows.push({ id: 'm' + i + 's', t: (+x.t || t0 + i * 60000) - 1000, kind: 'sp', mL: +a.sp });
        rows.push({ id: 'm' + i, t: +x.t || t0 + i * 60000, kind: 'slump', v: +x.v });
      });
      S.live.rows = rows;
      syncLedger(S.live);
    }
    // persist migration results so they do not re-run on every load
    if (d.defaultsV !== S.defaultsV || d.spUnitV2 !== S.spUnitV2 || d.wcTrimV2 !== S.wcTrimV2 || d.spCapV1 !== S.spCapV1) save();
  } catch (e) { console.warn('load failed', e); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn('save failed', e); } }

/* ------------------------------------------------------------ engineering */
const SG = { cement: 3150, sand: 2650, gravel: 2650 };      // kg/m3 (SSD)
const AIR = 0.02;                                           // entrapped air, fraction of concrete volume
const STRENGTH = { k: 2.88, A: { OPC: 169, PCC: 155 } };    // cube MPa = A * exp(-k * w/c)

const grade = () => S.grades.find((g) => g.id === S.gradeId) || S.grades[0];

/* Superplasticizer: dose is a % of cement weight (datasheet convention),
   converted to litres with the product density (~1.06 kg/L for PCE). */
const spDensity = () => +S.spDensity || 1.06;
/* The dose cap is per recipe, not one global number. 0.8 % is the top of the
   datasheet band for soft-plastic concrete — a mix that is workable without
   plasticizer, which is what the site and pile mixes are. 0.8–2.0 % belongs to
   flowing/SCC designs that need a special mix design; pouring 2 % into a mix
   built without plasticizer buys bleeding, not slump. Settings supplies the
   default for recipes that carry no cap of their own. */
const spCapOfG = (g) => +((g && +g.spCap > 0 ? +g.spCap : +S.spMaxPct) || 0.8);
const spPctOf = (g) => Math.max(0, Math.min(+g.sp || 0, spCapOfG(g)));
const spCapped = (g) => (+g.sp || 0) > spCapOfG(g) + 1e-9;

/* A grade may carry its own slump target (e.g. a flowable pile mix); otherwise
   the global default from Settings applies. A running batch freezes its target. */
const effTarget = (L) => +(((L && L.target) || (L ? 0 : (grade().tslump || 0)) || S.targetSlump) || 10);
const effBand = (L) => +(((L && L.band) || S.band) || 2);

function bucketKg(kind) {
  const arr = S.cal[kind + 'Weigh'] || [];
  const tare = +S.cal.tare || 0;
  const v = arr.map((x) => +x - tare).filter((x) => x > 0.5);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}
function bulkDensity(kind, fallback) {
  const per = bucketKg(kind), L = +S.cal.bucketL || 0;
  return per > 0 && L > 0 ? (per / L) * 1000 : fallback;
}
function moistureOf(kind) {
  const m = S.moist;
  const wet = +m[kind + 'Wet'] || 0, dry = +m[kind + 'Dry'] || 0;
  const use = m['use' + kind[0].toUpperCase() + kind.slice(1)];
  if (!use || wet <= 0 || dry <= 0) return null;
  return (wet - dry) / dry;
}

/* Build a fully resolved snapshot of one batch from current settings. */
function snapshot() {
  const g = grade();
  const sack = +S.sackSize || 40, n = +S.sacks || 0;
  const Cnom = sack * n;
  const Cact = Cnom * (1 + (+S.bufferPct || 0) / 100);
  const sandSSD = g.sand * Cact, gravSSD = g.gravel * Cact;
  const waterDesign = g.wc * Cnom;          // water for the grade at nominal cement
  const waterCeiling = g.wc * Cact;         // hard stop: never above grade w/c on actual cement
  const spPct = spPctOf(g);
  const spL = (spPct / 100) * Cact / spDensity();

  const absS = +S.moist.sandAbs || 0, absG = +S.moist.gravelAbs || 0;
  const mS = moistureOf('sand'), mG = moistureOf('gravel');
  const dryS = sandSSD / (1 + absS / 100), dryG = gravSSD / (1 + absG / 100);
  let wetSand = sandSSD, wetGrav = gravSSD, creditS = 0, creditG = 0;
  if (mS != null) { wetSand = dryS * (1 + mS); creditS = Math.max(0, dryS * (mS - absS / 100)); }
  if (mG != null) { wetGrav = dryG * (1 + mG); creditG = Math.max(0, dryG * (mG - absG / 100)); }

  const waterCorrected = Math.max(0, waterDesign - creditS - creditG);
  const ceilingNet = Math.max(0, waterCeiling - creditS - creditG);

  // Volume from SSD masses + all water in the mix (poured + aggregate free water).
  const vol = (Cact / SG.cement + sandSSD / SG.sand + gravSSD / SG.gravel + (waterCorrected + creditS + creditG + spL) / 1000) / (1 - AIR);

  const bS = bucketKg('sand'), bG = bucketKg('gravel');
  return {
    g, sack, n, Cnom, Cact, sandSSD, gravSSD, waterDesign, waterCeiling, spL, spPct, spCapped: spCapped(g),
    mS, mG, creditS, creditG, wetSand, wetGrav, waterCorrected, ceilingNet, vol,
    bS, bG,
    bucketSand: bS > 0 ? wetSand / bS : null,
    bucketGrav: bG > 0 ? wetGrav / bG : null,
    startWater: round(waterCorrected * (+S.startWaterPct || 85) / 100, 0.5)
  };
}

/* ---- strength model ------------------------------------------------------
   Abrams: cube strength grows as w/c falls. The value below is a MEAN cube
   strength. A K-grade is a CHARACTERISTIC strength (95% of cubes exceed it),
   so the mean must sit above the grade by 1.64 sigma. sigma is the site's own
   scatter; 5 MPa is a controlled small-crew operation. */
function strengthMPa(wc) {
  const A = STRENGTH.A[S.cementType] || STRENGTH.A.PCC;
  return A * Math.exp(-STRENGTH.k * wc);
}
const sigmaMPa = () => Math.max(0, +S.sigmaMPa || 0);
const charMPa = (mean) => mean - 1.64 * sigmaMPa();
const toK = (mpa) => mpa * 10.197;
function gradeFit(mean) {
  const char = charMPa(mean);
  return { mean, char, kMean: toK(mean), kChar: toK(char) };
}
/* Site recipes get a characteristic K (we control the design); readymix-derived
   rows only get a mean, because their cement class and grading are unknown to us
   and the generic curve is conservative for lean, admixture-modified mixes. */
function strengthLabel(mean, source) {
  const f = gradeFit(mean);
  const meanTxt = `${nf(f.mean, 1)} MPa ${LANG === 'id' ? 'rata-rata' : 'mean'}`;
  if (source === 'rmx') return `${meanTxt}*`;
  return `${meanTxt} → K${Math.round(f.kChar)} ${LANG === 'id' ? 'karakteristik' : 'characteristic'}`;
}
function siteStrengthA() {
  const vals = S.log.filter((e) => e.d28 > 0 && e.wcActual > 0)
    .map((e) => e.d28 / Math.exp(-STRENGTH.k * e.wcActual));
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/* ------------------------------------------------------------ cube tests */
const DAYMS = 86400000;
function cubeState(e) {
  const now = Date.now();
  const d7 = +e.ts + 7 * DAYMS, d28 = +e.ts + 28 * DAYMS;
  return {
    d7, d28,
    due7: !(+e.d7 > 0) && now >= d7,
    due28: !(+e.d28 > 0) && now >= d28,
    left7: Math.ceil((d7 - now) / DAYMS),
    left28: Math.ceil((d28 - now) / DAYMS)
  };
}
const cubeDueCount = () => S.log.reduce((n, e) => {
  if (!e.ts) return n;
  const c = cubeState(e);
  return n + (c.due7 ? 1 : 0) + (c.due28 ? 1 : 0);
}, 0);
const fmtDate = (ts) => new Date(ts).toLocaleDateString(LANG === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short' });
const fmtShort = (ts) => {
  const d = new Date(ts), md = `${d.getDate()}/${d.getMonth() + 1}`;
  return d.getFullYear() === new Date().getFullYear() ? md : `${md}/${String(d.getFullYear()).slice(2)}`;
};

/* ----------------------------------------------------------------- cost --- */
function perM3(g) {
  const Vs = 1 / SG.cement + g.sand / SG.sand + g.gravel / SG.gravel + g.wc / 1000;
  const C = (1 - AIR) / Vs;
  return { C, sand: g.sand * C, gravel: g.gravel * C, water: g.wc * C, sp: (spPctOf(g) / 100) * C / spDensity(), vol: Vs };
}
function costOf(g) {
  const p = perM3(g);
  const pcKg = (+S.prices.cement || 0) / (+S.sackSize || 40);
  const csKg = (+S.prices.sandPerM3 || 0) / bulkDensity('sand', 1500);
  const cgKg = (+S.prices.gravelPerM3 || 0) / bulkDensity('gravel', 1450);
  const cost = p.C * pcKg + p.sand * csKg + p.gravel * cgKg + p.water * (+S.prices.waterPerM3 || 0) / 1000 + p.sp * (+S.prices.spPerL || 0);
  return Object.assign(p, { cost, spCost: p.sp * (+S.prices.spPerL || 0), cementCost: p.C * pcKg });
}
function anyPrice() {
  const p = S.prices;
  return !!(p.cement || p.sandPerM3 || p.gravelPerM3 || p.spPerL || p.waterPerM3);
}

/* ------------------------------------------------------------ inline help */
const INFO = {
  buffer: ['Extra cement on top of the recipe. Sand and gravel scale up with it, but the water stays at the <b>nominal</b> recipe — so the real w/c drops: +5% cement buys about 5% water-overrun tolerance (1 L per 40 kg sack). 0 = no margin, the ceiling is then exactly the recipe water.',
    'Semen tambahan di atas resep. Pasir dan kerikil ikut naik, tetapi air tetap pada resep <b>nominal</b> — jadi w/c nyata turun: +5% semen memberi toleransi kelebihan air sekitar 5% (1 L per karung 40 kg). 0 = tanpa cadangan, batas air sama dengan resep.'],
  start: ['The first pour, before the first slump test — 85% of the water budget. The remaining part is used to trim the mix up to the target slump.',
    'Tuangan pertama sebelum uji slump — 85% dari anggaran air. Sisanya dipakai untuk menyetel campuran sampai slump target.'],
  wpour: ['Water you must actually pour: recipe water minus the free water already sitting in the sand and gravel. If you have not measured moisture, it equals the recipe water.',
    'Air yang benar-benar harus dituang: air resep dikurangi air bebas yang sudah ada di pasir dan kerikil. Kalau kadar air tidak diukur, nilainya sama dengan air resep.'],
  ceil: ['Hard stop — never pour more than this. It is measured against the cement actually in the drum (including the buffer). With buffer 0 it equals “water to pour”; the gap between the two <b>is</b> the buffer margin. Nothing else can make them differ.',
    'Batas keras — jangan menuang lebih dari ini. Dihitung terhadap semen yang benar-benar ada di drum (termasuk cadangan). Dengan cadangan 0 nilainya sama dengan “air untuk dituang”; selisih keduanya <b>adalah</b> cadangan semen. Tidak ada hal lain yang membuat keduanya berbeda.'],
  buckets: ['Whole level-full buckets, rounded <b>down</b>. The remainder is added as a partial bucket at the end — nothing is ever scooped back out of a full bucket.',
    'Ember penuh diratakan, dibulatkan <b>ke bawah</b>. Sisanya ditambahkan sebagai sebagian ember di akhir — tidak pernah mengurangi ember yang sudah penuh.'],
  sp: ['Superplasticizer for this batch. <b>Dose is % of cement weight</b>, as the datasheet writes it, converted to millilitres with the product density. Add it to the mixing water or pour it together with the water — never onto dry material. Wet-mix at least <b>5 minutes</b> (Viscocrete 3115 N datasheet), and only start adding the remaining water in the last third of that time. Once it is in, do not try to stretch the slump with water: add more plasticizer instead.',
    'Plastisizer untuk campuran ini. <b>Dosis dalam % berat semen</b>, seperti di lembar data, diubah ke mililiter memakai massa jenis produk. Masukkan ke air pengaduk atau tuang bersamaan dengan air — jangan ke bahan kering. Aduk basah minimal <b>5 menit</b> (lembar data Viscocrete 3115 N), dan mulai tambahkan sisa air hanya pada sepertiga terakhir waktu itu. Setelah masuk, jangan mengejar slump dengan air: tambah plastisizer.'],
  spmax: ['Cap on the <b>total</b> plasticizer dose for one recipe, as % of cement weight — the recipe\'s own dose plus everything added during mixing. Viscocrete 3115 N datasheet: <b>0.3–0.8%</b> for soft plastic concrete, i.e. a mix that is workable without plasticizer (that is what the site and pile mixes are); <b>0.8–2.0%</b> only for flowing or self-compacting concrete, and the datasheet adds that those need <i>a special mix design</i>. That is why the cap is per recipe rather than one global number: 2% poured into a mix designed without plasticizer buys bleeding, not slump. Set it per recipe on the Grades tab; the value here is only the default for recipes that carry none.',
    'Batas dosis <b>total</b> plastisizer untuk satu resep, dalam % berat semen — dosis resep ditambah semua yang ditambahkan saat mengaduk. Lembar data Viscocrete 3115 N: <b>0,3–0,8%</b> untuk beton plastis, yaitu campuran yang sudah bisa dikerjakan tanpa plastisizer (seperti resep site dan tiang bor); <b>0,8–2,0%</b> hanya untuk beton mengalir atau self-compacting, dan lembar data menambahkan bahwa itu butuh <i>rancangan campuran khusus</i>. Karena itu batasnya per resep, bukan satu angka global: 2% ke dalam campuran yang dirancang tanpa plastisizer hanya membeli bleeding. Atur per resep di tab Mutu; nilai di sini hanya awal untuk resep yang belum punya batas sendiri.'],
  k: ['How much extra water raises slump by 1 cm, per m³ of concrete. Default 2.4 L/m³ per cm — that is about 0.48 L per cm on a 0.2 m³ batch. The app re-fits this automatically from every finished batch (±20% per batch, so it cannot run away), which makes the next addition more accurate for your sand, cement and mixer.',
    'Berapa banyak air tambahan menaikkan slump 1 cm, per m³ beton. Awal 2,4 L/m³ per cm — sekitar 0,48 L per cm untuk campuran 0,2 m³. Aplikasi menyetel ulang otomatis dari setiap campuran yang selesai (±20% per campuran, jadi tidak bisa melenceng), sehingga tambahan berikutnya makin akurat untuk pasir, semen dan molen Anda.'],
  strength: ['A <b>K-grade is a characteristic strength</b>: 95% of cube results must be at or above it, so the batch <i>average</i> has to sit higher — typically by 1.64 σ, where σ is the scatter of cube results on your site. The app estimates the mean from w/c (Abrams curve, cement type PCC/OPC), then subtracts 1.64 σ to show the characteristic K-grade that mean implies. That is why a mix labelled K300 shows a mean around 37 MPa and a characteristic around K300 — same mix, two different statistics. Log real cube results and the app re-fits the curve to your cement instead of the generic one.',
    'Mutu <b>K adalah kuat tekan karakteristik</b>: 95% hasil kubus harus sama atau di atasnya, jadi <i>rata-rata</i> campuran harus lebih tinggi — biasanya 1,64 σ, dengan σ adalah sebaran hasil kubus di site Anda. Aplikasi memperkirakan rata-rata dari w/c (kurva Abrams, jenis semen PCC/OPC), lalu mengurangi 1,64 σ untuk menunjukkan mutu K karakteristik yang dihasilkan. Karena itu campuran berlabel K300 tampil dengan rata-rata sekitar 37 MPa dan karakteristik sekitar K300 — campuran sama, dua statistik berbeda. Catat hasil kubus nyata dan aplikasi akan menyetel kurva ke semen Anda, bukan kurva umum.'],
  pour: ['Where this batch of concrete goes in the build — a pile group, a beam, a slab, or just a date. It is only a label: nothing is calculated from it. It groups the diary by what is being built, lets cube results be traced back to it, and every batch you start afterwards inherits it.',
    'Ke bagian mana beton ini dituang — kelompok tiang, balok, plat, atau sekadar tanggal. Ini hanya label: tidak ada perhitungan darinya. Catatan dikelompokkan menurut bagian yang dicor, hasil kubus bisa dilacak ke bagian itu, dan campuran berikutnya mewarisi label ini.'],
  merge: ['Adds the batches from another phone’s backup to the diary on <b>this</b> phone and leaves everything else alone — recipes, calibration, prices, cement type and any batch in progress stay exactly as they are. A batch that is already here is skipped, matched on its batch id (or, for older files, on its timestamp, grade and volume). Nothing is ever deleted or replaced. Use “Restore backup” instead only when you want this phone to become a copy of the other one.',
    'Menambahkan batch dari cadangan HP lain ke catatan di HP <b>ini</b>, dan tidak menyentuh yang lain — resep, kalibrasi, harga, jenis semen, dan campuran yang sedang berjalan tetap seperti adanya. Batch yang sudah ada dilewati, dicocokkan lewat id batch (untuk file lama: waktu, mutu, dan volume). Tidak ada yang dihapus atau diganti. Pakai “Pulihkan cadangan” hanya kalau HP ini mau dijadikan salinan HP lain.']
};
const infoBtn = (k) => `<button class="info" data-info="${k}" aria-label="?">?</button>`;
const infoNote = (k) => `<div class="note info" id="info-${k}" style="display:none">${INFO[k][LANG === 'id' ? 1 : 0]}</div>`;

/* ---------------------------------------------------------------- UI ---- */
const TABS = ['Batch', 'Slump', 'Diary', 'Grades', 'Calibration', 'Cost', 'Settings'];
const ICONS = { Batch: '🧱', Slump: '📏', Diary: '📖', Grades: '📋', Calibration: '⚖️', Cost: '💰', Settings: '⚙️' };
let screen = 'Batch';
let stageOpen = false;   // staging checklist expanded after the first slump reading
let notice = null;       // full-screen result of an incremental batch import
const openGrades = new Set();
const openEntries = new Set();   // diary rows the user expanded

function renderTabs() {
  const SHORT = { Calibration: 'Calib' };
  const due = cubeDueCount();
  /* The ADVISE pill is a child of the tab bar, not a separately fixed element.
     Two fixed elements anchored to the bottom drift apart while Android Chrome
     collapses its URL bar — pingo: "the advice button sometimes jumps too high".
     Inside the bar it moves with the bar, so the gap is always the same. */
  const fab = (screen === 'Slump' && S.live)
    ? `<button class="fab ${adviceOpen ? 'on' : ''}" data-action="advise">${adviceOpen
        ? (LANG === 'id' ? 'TUTUP' : 'CLOSE') : (LANG === 'id' ? 'SARAN' : 'ADVISE')}</button>`
    : '';
  $('#tabs').innerHTML = TABS.map((n) => {
    const live = n === 'Slump' && !S.live;
    return `<button data-nav="${n}" class="${screen === n ? 'active' : ''}" ${live ? 'style="opacity:.5"' : ''}>
      <span class="ico">${ICONS[n]}</span><span>${t(SHORT[n] || n)}</span>${n === 'Diary' && due ? `<span class="badge">${due}</span>` : ''}</button>`;
  }).join('') + fab;
}

let lastScreen = null;
function render() {
  LANG = S.lang || 'en';
  document.documentElement.lang = LANG;
  $('#btnLang').textContent = LANG === 'en' ? 'ID' : 'EN';
  $('#ver').textContent = 'v' + VERSION;
  renderTabs();
  const map = { Batch: viewBatch, Slump: viewSlump, Diary: viewDiary, Grades: viewGrades, Calibration: viewCalib, Cost: viewCost, Settings: viewSettings, Tips: viewTips };
  /* Re-rendering must not move the page under the worker's thumb. Only a move
     to a different screen starts at the top; everything else keeps its place. */
  const keepY = screen === lastScreen ? window.scrollY : 0;
  $('#main').innerHTML = (map[screen] || viewBatch)() + (notice ? noticeHTML(notice) : '');
  if (screen === 'Batch') syncBatch();
  lastScreen = screen;
  /* the strip sticks directly under the header, whatever height it ends up */
  const hdr = document.querySelector('header');
  if (hdr) document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px');
  window.scrollTo({ top: keepY });
}

/* Render, then put one element back where it was on screen. Adding a ledger row
   pushes everything below it down by the row's height; without this the add
   forms slide away from the thumb on every entry. */
function renderAnchored(sel) {
  const a = document.querySelector(sel);
  const top = a ? a.getBoundingClientRect().top : null;
  render();
  if (top == null) return;
  const b = document.querySelector(sel);
  if (!b) return;
  const dy = b.getBoundingClientRect().top - top;
  if (Math.abs(dy) > 1) window.scrollTo({ top: Math.max(0, window.scrollY + dy) });
}

/* ---- Batch ---- */
function viewBatch() {
  const s = snapshot();
  const g = s.g;
  const noCal = !s.bS || !s.bG;
  const wc = g.wc;
  const est = strengthMPa(wc);

  const gradeOpts = S.grades.map((x) => `<option value="${x.id}" ${x.id === g.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');

  let html = `
  <div class="card">
    <h2>${t('Recipe')}</h2>
    <div class="rsum" id="o-sum"></div>
    ${S.live ? `<div class="note info" style="margin-top:0">
      <b>${LANG === 'id' ? 'Campuran berjalan' : 'Batch in progress'}</b> — ${esc(S.live.gradeName)} · ${nf(S.live.Cact, 0)} kg ${t('Cement').toLowerCase()}, ${nf(S.live.poured, 1)} L ${LANG === 'id' ? 'di drum' : 'in drum'}
      <button class="small wide" style="margin-top:8px" data-nav="Slump">${t('Resume')} →</button></div>` : ''}
    <label class="field"><span class="lbl">${t('Grade')}</span>
      <select data-bind="gradeId" data-rerender="1">${gradeOpts}</select>
    </label>
    <div class="row">
      <label class="field"><span class="lbl">${t('Cement sack')}</span>
        <select data-bind="sackSize" data-num="1" data-rerender="1">
          <option value="40" ${+S.sackSize === 40 ? 'selected' : ''}>40 kg</option>
          <option value="50" ${+S.sackSize === 50 ? 'selected' : ''}>50 kg</option>
        </select></label>
      <label class="field"><span class="lbl">${t('Sacks per batch')}</span>
        <input type="number" inputmode="decimal" step="0.5" min="0.5" data-bind="sacks" data-num="1" value="${S.sacks}"></label>
    </div>
    <label class="field"><span class="lbl">${t('Where it goes')} ${infoBtn('pour')}</span>
      <input type="text" data-bind="pourTag" value="${esc(S.pourTag || '')}" placeholder="${LANG === 'id' ? 'mis. Tiang P1–P4' : 'e.g. Pile P1–P4'}">
      <span class="hint">${LANG === 'id' ? 'label saja — dipakai semua campuran berikutnya' : 'label only — carried by every batch you start after this'}</span></label>
    ${infoNote('pour')}
    <div class="note info" style="margin-top:0">
      ${g.sand.toFixed(2)} : ${g.gravel.toFixed(2)} : ${g.wc.toFixed(2)} ${LANG === 'id' ? 'per kg semen' : 'per kg cement'}
      · <b>${strengthLabel(est, g.source)}</b> ${infoBtn('strength')}
      ${g.source === 'rmx' ? `<br><span class="fine">*${LANG === 'id' ? ' kurva umum — campuran kurus dengan aditif biasanya lebih tinggi dari ini' : ' generic curve — lean admixture mixes usually test higher than this'}</span>` : ''}
    </div>
    ${infoNote('strength')}
  </div>

  <div class="card">
    <h2>${t('Bucket plan')} <span class="sub">${infoBtn('buckets')}</span></h2>
    <div class="stat hero" style="padding-top:0"><span class="k">${t('Cement')}</span><span class="v"><span id="o-cement">—</span><span class="unit">kg</span></span></div>
    <div class="bigcards" style="margin-top:8px">
      <div class="bigcard"><div class="n" id="o-sandB">—</div><div class="t">${t('Sand')}</div><div class="s" id="o-sandR">—</div><div class="s" id="o-sandKg">—</div></div>
      <div class="bigcard"><div class="n" id="o-gravB">—</div><div class="t">${t('Gravel')}</div><div class="s" id="o-gravR">—</div><div class="s" id="o-gravKg">—</div></div>
    </div>
    ${infoNote('buckets')}
    <div class="stat" style="margin-top:12px"><span class="k">${t('Start water')} (${S.startWaterPct}%) ${infoBtn('start')}</span><span class="v"><span id="o-startW">—</span><span class="unit">L</span></span></div>
    ${infoNote('start')}
    <div class="stat" id="row-credit" style="display:none"><span class="k">${t('Water in aggregate')}</span><span class="v"><span id="o-credit">—</span><span class="unit">L</span></span></div>
    <div class="stat limit"><span class="k">⛔ ${t('Max total water')} ${infoBtn('ceil')}</span><span class="v"><span id="o-ceilW">—</span><span class="unit">L</span></span></div>
    <div class="fine" id="o-ceilNote" style="margin:6px 2px 0"></div>
    ${infoNote('ceil')}
    <div class="stat" id="row-sp" style="display:none"><span class="k">${t('Plasticizer')} ${infoBtn('sp')}</span><span class="v"><span id="o-sp">—</span><span class="unit">mL</span> <span class="fine" id="o-spPct"></span></span></div>
    ${infoNote('sp')}
    <div class="stat"><span class="k">${t('Batch volume')}</span><span class="v"><span id="o-vol">—</span><span class="unit">m³</span> <span class="fine" id="o-volpct"></span></span></div>
    <div id="warn"></div>
    <button class="primary wide" style="margin-top:14px" data-action="start">${t('Start batch')} →</button>
  </div>`;

  if (noCal) html += `<div class="note warn">${t('Not calibrated yet')} — ${LANG === 'id' ? 'isi kalibrasi ember agar jumlah ember muncul.' : 'fill in the bucket calibration to get bucket counts.'}</div>`;
  return html;
}

function syncBatch() {
  const s = snapshot();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  /* One-line recipe summary at the top: everything a worker needs to sanity-check
     the batch, deliberately quiet so it does not compete with the numbers below. */
  const sumEl = document.getElementById('o-sum');
  if (sumEl) {
    const wcBatch = s.Cact > 0 ? (s.waterDesign / s.Cact) : s.g.wc;
    const wcTxt = Math.abs(wcBatch - s.g.wc) < 0.005 ? nf(s.g.wc, 2) : `${nf(s.g.wc, 2)} → ${nf(wcBatch, 2)}`;
    const tgt = effTarget(null), band = effBand(null);
    const it = (k, v) => `<span class="it"><span class="l">${k}</span> <span class="v">${v}</span></span>`;
    sumEl.innerHTML = [
      it(t('Cement'), `${nf(s.Cact, 0)} kg`),
      it(t('Sand'), `${nf(s.wetSand, 0)} kg`),
      it(t('Gravel'), `${nf(s.wetGrav, 0)} kg`),
      it(t('Water'), `${nf(s.waterCorrected, 0)} L`),
      it('SP', s.spL > 0 ? `${nf(s.spL * 1000, 0)} mL` : '—'),
      it(t('w/c'), wcTxt),
      it(t('Slump'), `${nf(tgt, 0)}${band > 0 ? '±' + nf(band, 0) : ''} cm`)
    ].join('');
  }

  const bucketTxt = (n) => n == null ? '—' : (Math.floor(n) + '');
  const remTxt = (need, per) => {
    if (need == null || !per) return '—';
    const full = Math.floor(need), rem = need - full, kg = rem * per;
    return `${nf(need, 2)} ${t('buckets')} → <b>${full}</b> + ${rem.toFixed(2)} (${nf(kg, 1)} kg)`;
  };
  set('o-sandB', s.bucketSand == null ? '—' : Math.floor(s.bucketSand));
  set('o-gravB', s.bucketGrav == null ? '—' : Math.floor(s.bucketGrav));
  const remLine = (need, per) => {
    if (need == null || !per) return t('fill calibration');
    const full = Math.floor(need), rem = need - full;
    return rem < 0.005 ? t('exact') : `+ ${rem.toFixed(2)} (${nf(rem * per, 1)} kg)`;
  };
  set('o-sandR', remLine(s.bucketSand, s.bS));
  set('o-gravR', remLine(s.bucketGrav, s.bG));
  set('o-sandKg', `${nf(s.wetSand, 1)} kg`);
  set('o-gravKg', `${nf(s.wetGrav, 1)} kg`);
  set('o-cement', nf(s.Cact, 1));
  set('o-startW', nf(s.startWater, 1));
  set('o-ceilW', nf(s.ceilingNet, 1));
  const margin = s.ceilingNet - s.waterCorrected;
  set('o-ceilNote', Math.abs(margin) < 0.05
    ? (LANG === 'id' ? 'tanpa cadangan semen' : 'no cement buffer set')
    : (LANG === 'id' ? `cadangan semen ${nf(margin, 1)} L` : `cement buffer margin ${nf(margin, 1)} L`));
  set('o-credit', nf(s.creditS + s.creditG, 1));
  const rowCredit = document.getElementById('row-credit');
  if (rowCredit) rowCredit.style.display = (s.creditS + s.creditG) > 0.05 ? '' : 'none';
  set('o-sp', nf(s.spL * 1000, 0));
  set('o-spPct', `(${nf(s.spPct, 2)}% ${LANG === 'id' ? 'dari semen' : 'of cement'})`);
  set('o-vol', nf(s.vol, 3));
  const pct = S.mixerL ? Math.round(s.vol * 1000 / S.mixerL * 100) : 0;
  set('o-volpct', `${pct}% ${LANG === 'id' ? `dari molen ${S.mixerL} L` : `of the ${S.mixerL} L mixer`}`);
  const row = document.getElementById('row-sp'); if (row) row.style.display = s.spL > 0 ? '' : 'none';

  const w = [];
  if (pct > 65) w.push(`<div class="note danger"><b>${t('Over capacity')}</b> — ${nf(s.vol, 3)} m³ = ${pct}% ${LANG === 'id' ? `dari molen ${S.mixerL} L` : `of the ${S.mixerL} L mixer`}. ${LANG === 'id' ? 'Kurangi karung.' : 'Reduce sacks.'}</div>`);
  if (s.mS != null && s.creditS > 0) w.push(`<div class="note info">${t('Sand')}: ${(s.mS * 100).toFixed(1)}% ${t('Moisture').toLowerCase()} → ${nf(s.creditS, 1)} L ${LANG === 'id' ? 'dikurangi dari air' : 'credited to the mix'}</div>`);
  if (s.mS != null && s.creditS <= 0) w.push(`<div class="note warn">${t('Sand')}: ${(s.mS * 100).toFixed(1)}% ≤ ${t('Absorption').toLowerCase()} ${S.moist.sandAbs}% → ${LANG === 'id' ? 'tidak ada air bebas' : 'no free water, no credit'}</div>`);
  if (s.spCapped) w.push(`<div class="note danger"><b>${t('Dose capped')}</b> — ${LANG === 'id'
    ? `resep minta ${nf(s.g.sp, 2)}% tetapi maksimum ${nf(spCapOfG(s.g), 2)}%. Dipakai ${nf(s.spPct, 2)}%.`
    : `recipe asks ${nf(s.g.sp, 2)}% but the max is ${nf(spCapOfG(s.g), 2)}%. Using ${nf(s.spPct, 2)}%.`}</div>`);
  if (s.spL > 0) w.push(`<div class="note info">${t('Plasticizer')}: ${nf(s.spL * 1000, 0)} mL = ${nf(s.spPct, 2)}% ${LANG === 'id' ? 'dari berat semen' : 'of cement weight'}. ${LANG === 'id' ? 'Encerkan dalam air, jangan tuang ke bahan kering. Aduk basah 5 menit.' : 'Dilute in the water — never onto dry material. Wet mix 5 minutes.'}</div>`);
  const wEl = document.getElementById('warn'); if (wEl) wEl.innerHTML = w.join('');
  if (wEl && !w.length) wEl.innerHTML = '';
}

/* ---- Slump ---- */
/* Staging checklist for one batch: what goes in the drum, in order. Values are
   frozen in the live batch, so the list does not move while the mix is running. */
function stageSteps(L) {
  const id = LANG === 'id';
  const buckets = (n, per, kg) => {
    if (n == null || !per) return `${nf(kg, 1)} kg`;
    const full = Math.floor(n), rem = n - full;
    return rem < 0.005
      ? `${full} ${t('buckets')} · ${nf(kg, 1)} kg`
      : `${full} ${t('buckets')} + ${rem.toFixed(2)} · ${nf(kg, 1)} kg`;
  };
  const out = [
    { m: t('Sand'), s: buckets(L.bucketSand, L.bS, L.wetSand) },
    { m: t('Gravel'), s: buckets(L.bucketGrav, L.bG, L.wetGrav) },
    { m: t('Cement'), s: `${nf(L.n, L.n % 1 ? 1 : 0)} × ${L.sack} kg = ${nf(L.Cact, 0)} kg` },
    { m: id ? 'Aduk kering' : 'Dry mix', s: id ? 'pasir + kerikil 1 menit, lalu semen, aduk 1 menit' : 'sand + gravel 1 min, then cement, mix 1 min' }
  ];
  if (L.spL > 0) out.push({ m: t('Plasticizer'), s: `${nf(L.spL * 1000, 0)} mL — ${id ? 'encerkan di air awal, jangan ke bahan kering' : 'diluted in the start water, never onto dry material'}` });
  out.push({ m: t('Start water'), s: `${nf(L.startWater, 1)} L — ${id ? 'aduk basah 5 menit, lalu setel' : 'wet mix 5 min, then trim'}` });
  out.push({ m: t('Slump test'), s: id ? 'ukur, lalu masukkan angkanya di bawah' : 'measure, then enter the reading below' });
  return out;
}


/* ---- the ledger ----------------------------------------------------------
   Every event in the drum is one row: a water addition, a plasticizer
   addition, or a slump reading. Every total is a FOLD of those rows, never a
   stored field. That is the whole design: a typo is an edit, a mistake is a
   delete, and the water, w/c, strength, advice and diary record all recompute
   from what is left. It is also why the old double-credit / re-read guards are
   gone — a duplicate entry is now a visible row you remove, not an invisible
   credit nobody can see. */
const newRowId = () => 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
let rowEdit = null;      // ledger row currently open for editing
let adviceOpen = false;  // the ADVISE card
let echo = null;         // one line of feedback, and where refusals are said

function foldRows(L) {
  let water = 0, sp = 0, wAt = 0, sAt = 0; const slumps = [];
  (L.rows || []).forEach((r) => {
    if (r.kind === 'water') water += +r.L || 0;
    else if (r.kind === 'sp') sp += +r.mL || 0;
    else if (r.kind === 'slump') { slumps.push({ v: +r.v || 0, t: +r.t || 0 }); wAt = water; sAt = sp; }
  });
  return { water: +water.toFixed(4), sp: +sp.toFixed(2), slumps, wAt: +wAt.toFixed(4), sAt: +sAt.toFixed(2) };
}

/* nextWater() and the advice engine were written against L.poured / L.spExtra /
   L.slumps, so the fold feeds those same names instead of rewriting the maths.
   They are caches: nothing writes them except this function. */
function syncLedger(L) {
  const f = foldRows(L);
  L.poured = f.water;
  L.spExtra = f.sp;
  L.slumps = f.slumps;
  L.lastSlump = f.slumps.length ? f.slumps[f.slumps.length - 1].v : null;
  /* What has gone in since the cone was last read. Until it is read again the
     effect is unknown, so neither lever may be re-offered — that is what used to
     put the same 2.0 L back in the field after it had already been poured. */
  L.sinceWater = L.lastSlump == null ? 0 : Math.max(0, +(L.poured - f.wAt).toFixed(3));
  L.sinceSp = L.lastSlump == null ? 0 : Math.max(0, +(L.spExtra - f.sAt).toFixed(1));
  L.nextAdd = L.lastSlump == null
    ? Math.max(0, (+L.startWater || 0) - L.poured)
    : Math.max(0, nextWater(L, L.lastSlump) - L.sinceWater);
  return f;
}

/* The older diary/CSV shape: each addition labelled with the reading that
   followed it. Kept so exports and pre-ledger entries still read the same. */
function rowsToAdds(rows) {
  const out = [];
  (rows || []).forEach((r) => {
    if (r.kind === 'water') out.push({ L: +r.L, slump: null });
    else if (r.kind === 'sp') out.push({ sp: +r.mL, slump: null });
    else if (r.kind === 'slump') out.forEach((a) => { if (a.slump == null) a.slump = +r.v; });
  });
  return out;
}

const rowText = (r) => r.kind === 'water'
  ? `+${nf(r.L, +r.L.toFixed(1) === +r.L ? 1 : 2)} L ${LANG === 'id' ? 'air' : 'water'}`
  : r.kind === 'sp'
    ? `+${nf(r.mL, 0)} mL ${LANG === 'id' ? 'plastisizer' : 'plasticizer'}`
    : `${nf(r.v, 1)} cm`;
/* Seconds matter here: several entries land inside the same minute while the
   drum is being worked, and their order is the record. */
const clock = (t) => new Date(t).toLocaleTimeString(LANG === 'id' ? 'id-ID' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function setEcho(kind, text) { echo = { kind, text, t: Date.now() }; }
/* A refusal is the one result that must reach the screen: say it, and repaint. */
function refuse(text) { setEcho('danger', text); render(); }

/* Feedback after an action: what went in, where the drum stands, and what the
   engine says next — one line, under the row it belongs to. */
function afterAdd(L, what) {
  const m = L.lastSlump == null ? null : makeVerdict(L, L.lastSlump);
  const tail = m ? ` · ${m.head}${m.num ? ': ' + m.num : ''}`
    : ` · ${LANG === 'id' ? 'aduk 5 menit, lalu catat slump' : 'mix 5 minutes, then record the slump'}`;
  setEcho(m && m.kind === 'danger' ? 'danger' : (m && m.kind === 'ok' ? 'ok' : 'warn'),
    `${what} · ${LANG === 'id' ? 'di drum' : 'in drum'} ${nf(L.poured, 1)} / ${nf(L.ceilingNet, 1)} L${tail}`);
}

function addWaterRow(L, litres) {
  const v = +litres;
  if (!isFinite(v) || v <= 0) return refuse(LANG === 'id' ? 'Isi jumlah airnya dulu.' : 'Enter the litres first.');
  const total = L.poured + v;
  if (total > L.ceilingNet + 1e-6) {
    const room = Math.max(0, L.ceilingNet - L.poured);
    return refuse(LANG === 'id'
      ? `Itu jadi ${nf(total, 1)} L — batas ${nf(L.ceilingNet, 1)} L. Paling banyak ${nf(room, 1)} L.`
      : `That would be ${nf(total, 1)} L — the ceiling is ${nf(L.ceilingNet, 1)} L. At most ${nf(room, 1)} L.`);
  }
  L.rows.push({ id: newRowId(), t: Date.now(), kind: 'water', L: +v.toFixed(3) });
  syncLedger(L); afterAdd(L, `+${nf(v, +v.toFixed(1) === +v ? 1 : 2)} L ${LANG === 'id' ? 'air' : 'water'}`);
  save(); renderAnchored('.addrow');
}

function addSpRow(L, mL) {
  const v = +mL;
  if (!isFinite(v) || v <= 0) return refuse(LANG === 'id' ? 'Isi mL plastisizernya dulu.' : 'Enter the millilitres first.');
  const cap = capOf(L), now = doseNow(L);
  const addPct = L.Cact > 0 ? (v / 1000) * spDensity() / L.Cact * 100 : 0;
  if (now + addPct > cap + 0.01) {   // 0.01 % ≈ the granularity of a measured dose
    const roomML = Math.max(0, (cap - now) / 100 * L.Cact / spDensity() * 1000);
    return refuse(LANG === 'id'
      ? `Itu jadi ${nf(now + addPct, 2)}% — batas ${nf(cap, 2)}%. Paling banyak ${nf(roomML, 0)} mL.`
      : `That would be ${nf(now + addPct, 2)}% — the cap is ${nf(cap, 2)}%. At most ${nf(roomML, 0)} mL.`);
  }
  L.rows.push({ id: newRowId(), t: Date.now(), kind: 'sp', mL: Math.round(v) });
  syncLedger(L); afterAdd(L, `+${nf(v, 0)} mL ${LANG === 'id' ? 'plastisizer' : 'plasticizer'} · ${LANG === 'id' ? 'dosis' : 'dose'} ${nf(doseNow(L), 2)}%`);
  save(); renderAnchored('.addrow');
}

function addSlumpRow(L, cm) {
  const v = +cm;
  if (!isFinite(v) || v < 0 || v > 30) return refuse(LANG === 'id' ? 'Isi angka slump 0–30 cm.' : 'Enter a slump between 0 and 30 cm.');
  L.rows.push({ id: newRowId(), t: Date.now(), kind: 'slump', v: +v });
  syncLedger(L);
  const m = makeVerdict(L, L.lastSlump);
  setEcho(m.kind === 'ok' ? 'ok' : (m.kind === 'danger' ? 'danger' : 'warn'), `${nf(v, 1)} cm · ${m.head}${m.num ? ': ' + m.num : ''}`);
  save(); renderAnchored('.addrow');
}

function editRowValue(L, id, raw) {
  const r = (L.rows || []).find((x) => x.id === id);
  if (!r) return;
  const v = +raw;
  if (!isFinite(v) || v < 0) return refuse(LANG === 'id' ? 'Angka tidak terbaca.' : 'That is not a number.');
  if (r.kind === 'water') {
    const others = L.poured - (+r.L || 0);
    if (others + v > L.ceilingNet + 1e-6) return refuse(LANG === 'id'
      ? `Total jadi ${nf(others + v, 1)} L — batas ${nf(L.ceilingNet, 1)} L.`
      : `That would total ${nf(others + v, 1)} L — the ceiling is ${nf(L.ceilingNet, 1)} L.`);
    r.L = +v.toFixed(3);
  } else if (r.kind === 'sp') {
    const others = L.spExtra - (+r.mL || 0);
    const cap = capOf(L);
    const total = L.Cact > 0 ? ((others + v) / 1000) * spDensity() / L.Cact * 100 : 0;
    if (total > cap + 0.01) return refuse(LANG === 'id'
      ? `Dosis jadi ${nf(total, 2)}% — batas ${nf(cap, 2)}%.`
      : `That would be ${nf(total, 2)}% — the cap is ${nf(cap, 2)}%.`);
    r.mL = Math.round(v);
  } else {
    if (v > 30) return refuse(LANG === 'id' ? 'Slump 0–30 cm.' : 'Slump between 0 and 30 cm.');
    r.v = +v;
  }
  rowEdit = null; syncLedger(L);
  setEcho('ok', `${rowText(r)} · ${LANG === 'id' ? 'diperbarui' : 'updated'}`);
  save(); renderAnchored('.addrow');
}

function delRow(L, id) {
  const r = (L.rows || []).find((x) => x.id === id);
  if (!r) return;
  if (!confirm(`${rowText(r)} — ${LANG === 'id' ? 'hapus baris ini?' : 'delete this row?'}`)) return;
  L.rows = L.rows.filter((x) => x.id !== id);
  rowEdit = null; syncLedger(L);
  setEcho('ok', `${rowText(r)} · ${LANG === 'id' ? 'dihapus' : 'deleted'} · ${LANG === 'id' ? 'di drum' : 'in drum'} ${nf(L.poured, 1)} L`);
  save(); renderAnchored('.addrow');
}

function viewSlump() {
  if (!S.live) {
    return `<div class="card center"><h2>${t('Slump')}</h2>
      <p class="fine">${LANG === 'id' ? 'Belum ada campuran berjalan.' : 'No batch in progress.'}</p>
      <button class="primary wide" data-nav="Batch">${t('Batch')} →</button></div>`;
  }
  const L = S.live;
  syncLedger(L);
  const id = LANG === 'id';
  const last = L.lastSlump;
  const m = last == null ? null : makeVerdict(L, last);
  const cap = capOf(L), dose = doseNow(L);
  const wcNow = L.Cact > 0 ? (L.poured + (L.creditS || 0) + (L.creditG || 0)) / L.Cact : 0;

  /* Staging checklist — open until the first reading, then one quiet line. */
  const steps = stageSteps(L);
  const done = steps.map((_, i) => !!(L.steps && L.steps[i]));
  const doneN = done.filter(Boolean).length;
  const stageRow = (st, i) => `<button class="step ${done[i] ? 'done' : ''}" data-step="${i}">
      <span class="n">${done[i] ? '✓' : i + 1}</span>
      <span class="t"><b>${st.m}</b><span class="s">${st.s}</span></span></button>`;
  const stageBlock = L.slumps.length === 0
    ? `<div class="stage-h">${t('Staging')} <span class="fine">${doneN}/${steps.length}</span></div>
       <div class="stage">${steps.map(stageRow).join('')}</div>`
    : `<button class="small wide" data-stage-toggle="1">${t('Staged')} ${doneN}/${steps.length}${doneN === steps.length ? ' ✓' : ''} ${stageOpen ? '▾' : '▸'}</button>
       ${stageOpen ? `<div class="stage">${steps.map(stageRow).join('')}</div>` : ''}`;

  /* Advice is a reading of the ledger, on demand — never a card in the face. */
  const nextW = last == null ? 0 : nextWater(L, last);
  const roomLeft = Math.max(0, L.ceilingNet - L.poured);
  const advice = !adviceOpen ? '' : (m == null
    ? `<div class="note info">${id ? 'Tuang air awal, aduk basah 5 menit, lalu ukur slump.' : 'Pour the start water, wet mix 5 minutes, then measure the slump.'}</div>`
    : `<div class="note ${m.kind}"><b>${m.head}${m.num ? `: ${m.num}` : ''}</b> — ${m.body}
        ${m.alt ? `<br><span class="fine">${m.alt}</span>` : ''}
        ${m.kind === 'warn' && !m.measure ? `<br><span class="fine">k = ${nf((+S.kPerM3PerCm || 2.4) * L.vol, 2)} L/cm · ${nf(roomLeft, 1)} L ${id ? 'sisa ruang' : 'of room left'} ${id ? 'sebelum batas air' : 'before the ceiling'}</span>` : ''}</div>`);

  const rows = L.rows || [];
  const led = rows.length ? rows.map((r) => {
    if (rowEdit === r.id) {
      const val = r.kind === 'water' ? r.L : r.kind === 'sp' ? r.mL : r.v;
      return `<div class="lrow">
        <span class="lt">${clock(r.t)}</span>
        <input type="number" inputmode="decimal" step="${r.kind === 'sp' ? 10 : 0.1}" min="0" id="rowIn" value="${val}">
        <span class="lu">${r.kind === 'water' ? 'L' : r.kind === 'sp' ? 'mL' : 'cm'}</span>
        <span class="lacts"><button class="xs ok" data-action="row-save" data-id="${r.id}">✓</button>
        <button class="xs" data-action="row-cancel">×</button></span></div>`;
    }
    return `<div class="lrow${r.kind === 'slump' ? ' sl' : ''}">
      <span class="lt">${clock(r.t)}</span>
      <span class="ll">${rowText(r)}</span>
      <span class="lacts"><button class="xs neutral" data-action="row-edit" data-id="${r.id}">✎</button>
      <button class="xs" data-action="row-del" data-id="${r.id}">×</button></span></div>`;
  }).join('') : `<div class="fine">${id ? 'Belum ada yang dicatat.' : 'Nothing logged yet.'}</div>`;

  /* syncLedger already knows both cases: before the first reading it is what is
     left of the start water, after it the advice's own addition minus whatever
     has gone in since that reading. Never re-offer what is already in the drum. */
  const wPrefill = Math.max(0, +L.nextAdd || 0);
  const spPrefill = (+L.sinceSp || 0) >= 5 ? 0 : Math.round(spStepML(L));
  const tgtC = Math.round(effTarget(L));
  const chips = [tgtC - 6, tgtC - 4, tgtC - 2, tgtC, tgtC + 2, tgtC + 4].filter((v) => v > 0);

  /* Small, always-visible answer to "what is in the drum and how much room is
     left": two meters, water and plasticizer, nothing else. Sticks under the
     header so it stays true while the ledger scrolls. */
  const meter = (label, used, cap, unit, digits) => {
    const p = cap > 0 ? Math.min(1, used / cap) : 0;
    const lvl = p >= 0.999 ? 'full' : (p >= 0.9 ? 'high' : '');
    return `<span class="mtr ${lvl}">
      <span class="lb">${label}</span>
      <span class="bar"><i class="${lvl}" style="width:${Math.round(p * 100)}%"></i></span>
      <span class="num">${nf(used, digits)}<span class="of">/</span>${nf(cap, digits)}<i>${unit}</i></span></span>`;
  };
  const showSp = +L.g.sp > 0 || +L.spExtra > 0;
  const strip = `<div class="strip">
    ${meter(id ? 'Air' : 'Water', L.poured, L.ceilingNet, 'L', 1)}
    ${showSp ? meter('SP', dose, cap, '%', 2) : ''}
  </div>`;

  return `
  ${strip}
  <div class="card">
    <h2>${esc(L.gradeName)} · ${nf(L.Cact, 0)} kg ${t('Cement').toLowerCase()} <span class="sub">${t('target')} ${effTarget(L)} ± ${effBand(L)} cm</span></h2>
    ${stageBlock}
    <div class="stat"><span class="k">${t('Water')} ${id ? 'di drum' : 'in drum'}</span><span class="v sm">${nf(L.poured, 1)} L</span></div>
    <div class="stat limit"><span class="k">⛔ ${t('Max total water')} ${infoBtn('ceil')}</span><span class="v"><span>${nf(L.ceilingNet, 1)}</span><span class="unit">L</span></span></div>
    ${infoNote('ceil')}
    <div class="fine" style="margin-top:6px">${t('Superplasticizer')} <b>${nf(dose, 2)}%</b> ${id ? 'dari' : 'of'} ${nf(cap, 2)}% · w/c <b>${nf(wcNow, 3)}</b> · ${nf(L.vol, 3)} m³</div>
  </div>

  <div class="card">
    <h2>${t('In the drum')} <span class="sub">${rows.length}</span></h2>
    ${echo ? `<div class="note ${echo.kind}" id="echo">${echo.text}</div>` : ''}
    <div class="led">${led}</div>
    <hr class="sep">
    <div class="addrow">
      <label class="field" style="margin:0"><span class="lbl">${t('Water')} (L)</span>
        <input type="number" inputmode="decimal" step="0.1" min="0" id="wIn" value="${+wPrefill.toFixed(1)}"></label>
      <button class="dark" data-action="add-water">+ ${t('Add')}</button>
    </div>
    <div class="addrow" style="margin-top:8px">
      <label class="field" style="margin:0"><span class="lbl">${t('Superplasticizer')} (mL)</span>
        <input type="number" inputmode="numeric" step="10" min="0" id="spIn" value="${spPrefill}"></label>
      <button class="dark" data-action="add-sp">+ ${t('Add')}</button>
    </div>
    <div class="addrow" style="margin-top:8px">
      <label class="field" style="margin:0"><span class="lbl">${t('Slump')} (cm)</span>
        <input type="number" inputmode="decimal" step="0.5" min="0" max="30" id="slIn" placeholder="—"></label>
      <button class="primary" data-action="add-slump">${id ? 'CATAT' : 'RECORD'}</button>
    </div>
    <div class="quick" style="grid-template-columns:repeat(3,1fr);margin-top:8px">${chips.map((v) => `<button data-chip="${v}" class="${last === v ? 'on' : ''}">${v}</button>`).join('')}</div>
    <div class="row" style="margin-top:12px">
      <button class="dark" data-action="slump-finish">${t('Finish batch')}</button>
      <button class="small" data-action="slump-note">${t('Notes')}</button>
    </div>
    <button class="small wide" style="margin-top:10px" data-action="slump-cancel">${t('Cancel batch')}</button>
  </div>
  <div class="fabgap"></div>
  ${adviceOpen ? `<div class="fabcard">${advice}</div>` : ''}`;
}

/* ---- Diary ---- */
function viewDiary() {
  const rows = S.log.slice().reverse();
  const isEmpty = !rows.length;
  /* pour grouping — read-only summary, built from whatever labels exist */
  const groups = [];
  S.log.forEach((e) => {
    const k = String(e.pour || '').trim();
    if (!k) return;
    let g = groups.find((x) => x.k === k);
    if (!g) { g = { k, n: 0, vol: 0, C: 0, slumps: [], due: 0, last: 0 }; groups.push(g); }
    g.n += 1; g.vol += +e.vol || 0; g.C += +e.Cact || 0; g.last = Math.max(g.last, +e.ts || 0);
    if (+e.finalSlump > 0) g.slumps.push(+e.finalSlump);
    const c = cubeState(e);
    g.due += (c.due7 ? 1 : 0) + (c.due28 ? 1 : 0);
  });
  groups.sort((a, b) => b.last - a.last);
  const ungrouped = S.log.filter((e) => !String(e.pour || '').trim()).length;
  return `
  <div class="card">
    <h2>${t('Diary')} <span class="sub">${S.log.length} ${t(S.log.length === 1 ? 'Batch' : 'Batches').toLowerCase()}</span></h2>
    <div class="row">
      <button class="small" data-action="csv">${t('Export CSV')}</button>
      <button class="small" data-action="backup">${t('Export backup')}</button>
    </div>
    <div class="row" style="margin-top:8px">
      <label class="small" style="display:block"><input type="file" id="mergeFile" accept="application/json,.json" style="display:none">
        <button class="small wide" data-action="merge">${t('Add batches from file')}</button></label>
    </div>
    <div class="fine" style="margin-top:4px">${infoBtn('merge')} ${t('adds only, never replaces')}</div>
    <div class="row" style="margin-top:8px">
      <label class="small" style="display:block"><input type="file" id="importFile" accept="application/json" style="display:none">
        <button class="small wide" data-action="import">${t('Restore backup')}</button></label>
    </div>
    <div class="fine" style="margin-top:4px">${t('replaces everything on this phone')}</div>
    ${infoNote('merge')}
  </div>
  ${isEmpty ? `<div class="card center fine">${t('No batches logged yet.')}</div>` : ''}
  ${groups.length ? `<div class="card">
    <h2>${t('Where it goes')} <span class="sub">${groups.length}</span></h2>
    ${groups.map((g) => `<div class="item" style="margin-bottom:8px">
      <div class="t">${esc(g.k)}</div>
      <div class="m">${g.n} ${g.n === 1 ? t('Batch') : t('Batches').toLowerCase()} · ${nf(g.vol, 2)} m³ · ${nf(g.C, 0)} kg ${t('Cement').toLowerCase()} · ${LANG === 'id' ? 'slump rata-rata' : 'avg slump'} ${g.slumps.length ? nf(g.slumps.reduce((a, b) => a + b, 0) / g.slumps.length, 1) : '—'} cm</div>
      ${g.due ? `<div class="m" style="color:var(--danger);font-weight:700">${g.due} ${LANG === 'id' ? 'uji kubus jatuh tempo' : (g.due === 1 ? 'cube test due' : 'cube tests due')}</div>` : ''}
    </div>`).join('')}
    ${ungrouped ? `<div class="fine">${ungrouped} ${LANG === 'id' ? 'campuran tanpa label coran' : (ungrouped === 1 ? 'batch without a pour label' : 'batches without a pour label')}</div>` : ''}
  </div>` : ''}
  <div class="list">
  ${rows.map((e) => {
    const cs = cubeState(e);
    const due = (n, d) => `${fmtDate(d)}${n ? ` <b style="color:var(--danger)">${t('due now')}</b>` : ''}`;
    const tgt = +(e.targetSlump || S.targetSlump) || 10, band = +S.band || 2;
    const sl = e.finalSlump;
    const pillCls = sl == null ? '' : (sl > tgt + band ? 'danger' : sl < tgt - band ? 'warn' : 'ok');
    const dueN = (cs.due7 ? 1 : 0) + (cs.due28 ? 1 : 0);
    return `
    <details class="item entry" data-entry="${e.id}" ${openEntries.has(e.id) ? 'open' : ''}>
      <summary>
        <div class="row1">
          <span class="t">${esc(e.gradeName)}</span>
          <span class="pill ${pillCls}">${sl == null ? '—' : nf(sl, 1)} cm</span>
        </div>
        <div class="m">${nf(e.Cact, 0)} kg · ${nf(e.waterUsed, 1)} L · w/c ${nf(e.wcActual, 3)} · ${fmtShort(e.ts)} ${new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        ${(e.pour || e.spExtra > 0 || dueN) ? `<div class="m">${e.pour ? '🔖 ' + esc(e.pour) : ''}${e.spExtra > 0 ? (e.pour ? ' · ' : '') + 'SP +' + nf(e.spExtra, 0) + ' mL' : ''}${dueN ? `${(e.pour || e.spExtra > 0) ? ' · ' : ''}<b style="color:var(--danger)">${dueN} ${LANG === 'id' ? 'uji kubus' : (dueN === 1 ? 'cube test' : 'cube tests')} ${t('due now')}</b>` : ''}</div>` : ''}
        ${e.notes ? `<div class="m">📝 ${esc(e.notes)}</div>` : ''}
      </summary>
      <div class="ebody">
        <div class="m">${new Date(e.ts).toLocaleString()}${e.spL > 0 ? ' · SP ' + nf(e.spL * 1000, 0) + ' mL' : ''}</div>
        <div class="m">${t('Sand')} ${nf(e.wetSand, 1)} kg${e.bucketSand ? ' (' + e.bucketSand + ' ' + t('buckets') + ')' : ''} · ${t('Gravel')} ${nf(e.wetGrav, 1)} kg${e.bucketGrav ? ' (' + e.bucketGrav + ' ' + t('buckets') + ')' : ''}${e.mS != null ? ' · ' + t('Moisture').toLowerCase() + ' ' + (e.mS * 100).toFixed(1) + '%' : ''}</div>
        <div class="m">${strengthLabel(e.strengthEst, e.source)}${e.costPerM3 ? ' · Rp ' + nf(e.costPerM3, 0) + '/m³' : ''}</div>
        ${Array.isArray(e.rows) && e.rows.length ? `<div class="led" style="margin-top:8px">${e.rows.map((r) => `<div class="lrow"><span class="lt">${clock(r.t)}</span><span class="ll">${rowText(r)}</span></div>`).join('')}</div>` : ''}
        <div class="row" style="margin-top:8px">
          <label class="field" style="margin:0"><span class="lbl">${t('7 days')} (MPa)</span><input type="number" inputmode="decimal" step="0.1" placeholder="—" value="${e.d7 ?? ''}" data-cube="d7" data-id="${e.id}"></label>
          <label class="field" style="margin:0"><span class="lbl">${t('28 days')} (MPa)</span><input type="number" inputmode="decimal" step="0.1" placeholder="—" value="${e.d28 ?? ''}" data-cube="d28" data-id="${e.id}"></label>
        </div>
        <div class="fine" style="margin-top:6px">${t('Cast')} ${fmtDate(e.ts)} · ${t('7 days')} ${due(cs.due7, cs.d7)} · ${t('28 days')} ${due(cs.due28, cs.d28)}</div>
        <div class="acts"><button class="xs" data-action="del" data-id="${e.id}">${t('Delete')}</button></div>
      </div>
    </details>`;
  }).join('')}
  </div>`;
}

/* ---- Grades ---- */
function viewGrades() {
  return `<div class="card">
    <h2>${t('Grade table')} <span class="sub">${t('per kg cement')}</span></h2>
    ${S.grades.map((g) => {
      const c = perM3(g), f = strengthMPa(g.wc);
      return `<details class="item" data-gid="${g.id}" ${openGrades.has(g.id) ? 'open' : ''} style="margin-bottom:10px">
        <summary class="gsum">
          <span class="gname">${esc(g.name)}</span>
          <span class="gsub">${nf(c.C, 0)} kg/m³ · ${strengthLabel(f, g.source)}</span>
        </summary>
        <div style="margin-top:10px">
          <label class="field" style="margin:0 0 8px"><span class="lbl">${t('Recipe name')}</span>
            <input type="text" value="${esc(g.name)}" data-grade="${g.id}" data-gf="name"></label>
          <div class="row3">
            <label class="field" style="margin:0"><span class="lbl">${t('Sand ratio')}</span><input type="number" step="0.01" value="${g.sand}" data-grade="${g.id}" data-gf="sand" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">${t('Gravel ratio')}</span><input type="number" step="0.01" value="${g.gravel}" data-grade="${g.id}" data-gf="gravel" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">w/c</span><input type="number" step="0.005" value="${g.wc}" data-grade="${g.id}" data-gf="wc" data-num="1"></label>
          </div>
          <div class="row" style="margin-top:8px">
            <label class="field" style="margin:0"><span class="lbl">SP % ${LANG === 'id' ? 'semen' : 'cement'}</span><input type="number" step="0.01" min="0" value="${g.sp || 0}" data-grade="${g.id}" data-gf="sp" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">${t('SP max')} %</span>
              <input type="number" step="0.1" min="0" max="5" value="${spCapOfG(g)}" data-grade="${g.id}" data-gf="spCap" data-num="1">
              <span class="hint">${LANG === 'id' ? 'semen · 0,8 plastis · 2,0 SCC' : 'of cement · 0.8 plastic · 2.0 SCC'}</span></label>
          </div>
          <div class="row" style="margin-top:8px">
            <label class="field" style="margin:0"><span class="lbl">${t('Source')}</span>
              <select data-grade="${g.id}" data-gf="source">
                <option value="site" ${g.source === 'site' ? 'selected' : ''}>${t('Site mix')}</option>
                <option value="rmx" ${g.source === 'rmx' ? 'selected' : ''}>Jayamix</option>
              </select></label>
            <label class="field" style="margin:0"><span class="lbl">${t('Target slump')}</span>
              <input type="number" step="0.5" min="0" placeholder="${S.targetSlump}" value="${g.tslump || ''}" data-grade="${g.id}" data-gf="tslump" data-num="1">
              <span class="hint">${LANG === 'id' ? 'kosong = setelan' : 'blank = default'}</span></label>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:8px">
            <button class="xs" data-action="grade-del" data-id="${g.id}">${t('Delete')}</button>
          </div>
          <div class="fine" style="margin-top:8px">${t('Cement content')} ≈ ${nf(c.C, 0)} kg/m³ · ${nf(f, 1)} MPa ${LANG === 'id' ? 'rata-rata' : 'mean'} · K${Math.round(gradeFit(f).kChar)} ${LANG === 'id' ? 'karakteristik' : 'characteristic'} (σ ${nf(sigmaMPa(), 1)} MPa)</div>
          ${g.source === 'rmx' ? `<div class="fine" style="margin-top:4px">${LANG === 'id'
            ? 'Desain pabrik pemasok — bukan resep site: mutunya bergantung pada semen kelas 50 dan batching plant. Jangan dipakai sebagai instruksi campuran di lokasi.'
            : 'Supplier plant design — not a site recipe: its grade depends on strength-class cement and a batching plant. Do not use it as a site mixing instruction.'}</div>` : ''}
        </div>
      </details>`;
    }).join('')}
    <button class="dark wide" data-action="grade-add">+ ${t('Add grade')}</button>
    <button class="small wide" style="margin-top:8px" data-action="grade-reset">${t('Reset recipes to defaults')}</button>
  </div>`;
}

/* ---- Calibration ---- */
function viewCalib() {
  const s = snapshot();
  const bS = bucketKg('sand'), bG = bucketKg('gravel');
  const mS = moistureOf('sand'), mG = moistureOf('gravel');
  const list = (kind) => {
    const arr = S.cal[kind + 'Weigh'] || [];
    return arr.length ? arr.map((w, i) => `<span class="chip">${nf(w, 2)} kg <a href="#" data-action="wipe-w" data-kind="${kind}" data-i="${i}" style="color:inherit;text-decoration:none">×</a></span>`).join('') : '<span class="fine">—</span>';
  };
  return `
  <div class="card">
    <h2>${t('Calibration')}</h2>
    <div class="row">
      <label class="field"><span class="lbl">${t('Bucket tare')} (kg)</span><input type="number" step="0.05" data-bind="cal.tare" data-num="1" value="${S.cal.tare}"></label>
      <label class="field"><span class="lbl">${t('Bucket volume')} (L)</span><input type="number" step="0.5" data-bind="cal.bucketL" data-num="1" value="${S.cal.bucketL}"></label>
    </div>
    <hr class="sep">
    <div class="row">
      <div style="flex:1">
        <div class="lbl fine"><b>${t('Sand')}</b> — ${t('Average bucket')}: <b>${bS ? nf(bS, 2) + ' kg' : '—'}</b> (${S.cal.sandWeigh.length} ${t('weighings')})</div>
        <div class="chips" style="margin:8px 0">${list('sand')}</div>
        <div class="row3">
          <input type="number" step="0.05" id="wSand" placeholder="kg" style="font-size:17px">
          <button class="small" data-action="add-w" data-kind="sand">+</button>
        </div>
      </div>
    </div>
    <hr class="sep">
    <div class="row">
      <div style="flex:1">
        <div class="lbl fine"><b>${t('Gravel')}</b> — ${t('Average bucket')}: <b>${bG ? nf(bG, 2) + ' kg' : '—'}</b> (${S.cal.gravelWeigh.length} ${t('weighings')})</div>
        <div class="chips" style="margin:8px 0">${list('gravel')}</div>
        <div class="row3">
          <input type="number" step="0.05" id="wGravel" placeholder="kg" style="font-size:17px">
          <button class="small" data-action="add-w" data-kind="gravel">+</button>
        </div>
      </div>
    </div>
    <div class="note info">${t('Bucket plan')}: ${nf(s.wetSand, 1)} kg ${t('Sand').toLowerCase()} = ${s.bucketSand ? s.bucketSand.toFixed(2) : '—'} ${t('buckets')} · ${nf(s.wetGrav, 1)} kg ${t('Gravel').toLowerCase()} = ${s.bucketGrav ? s.bucketGrav.toFixed(2) : '—'} ${t('buckets')}
      ${bS ? '<br>' + t('Bulk density') + ': ' + nf(bulkDensity('sand', 1500), 0) + ' kg/m³ (' + t('Sand').toLowerCase() + ') · ' + nf(bulkDensity('gravel', 1450), 0) + ' kg/m³ (' + t('Gravel').toLowerCase() + ')' : ''}</div>
  </div>

  <div class="card">
    <h2>${t('Pan test (optional)')}</h2>
    <label class="field" style="display:flex;gap:10px;align-items:center">
      <input type="checkbox" data-bind="moist.useSand" data-check="1" ${S.moist.useSand ? 'checked' : ''} style="width:26px;height:26px;min-height:0">
      <span class="lbl" style="margin:0">${t('Use sand moisture')}</span></label>
    <div class="row">
      <label class="field"><span class="lbl">${t('wet sample')} (g)</span><input type="number" step="1" data-bind="moist.sandWet" data-num="1" value="${S.moist.sandWet || ''}"></label>
      <label class="field"><span class="lbl">${t('dry sample')} (g)</span><input type="number" step="1" data-bind="moist.sandDry" data-num="1" value="${S.moist.sandDry || ''}"></label>
    </div>
    <div class="stat"><span class="k">${t('Moisture')} ${t('Sand').toLowerCase()}</span><span class="v sm">${mS != null ? (mS * 100).toFixed(1) + '%' : '—'}</span></div>
    <div class="stat"><span class="k">${t('Absorption')} ${t('Sand').toLowerCase()} (%)</span><span class="v sm"><input type="number" step="0.1" data-bind="moist.sandAbs" data-num="1" value="${S.moist.sandAbs}" style="max-width:110px;min-height:44px;font-size:17px;margin-left:auto"></span></div>
    <hr class="sep">
    <label class="field" style="display:flex;gap:10px;align-items:center">
      <input type="checkbox" data-bind="moist.useGravel" data-check="1" ${S.moist.useGravel ? 'checked' : ''} style="width:26px;height:26px;min-height:0">
      <span class="lbl" style="margin:0">${t('Use gravel moisture')}</span></label>
    <div class="row">
      <label class="field"><span class="lbl">${t('wet sample')} (g)</span><input type="number" step="1" data-bind="moist.gravelWet" data-num="1" value="${S.moist.gravelWet || ''}"></label>
      <label class="field"><span class="lbl">${t('dry sample')} (g)</span><input type="number" step="1" data-bind="moist.gravelDry" data-num="1" value="${S.moist.gravelDry || ''}"></label>
    </div>
    <div class="stat"><span class="k">${t('Moisture')} ${t('Gravel').toLowerCase()}</span><span class="v sm">${mG != null ? (mG * 100).toFixed(1) + '%' : '—'}</span></div>
    <div class="stat"><span class="k">${t('Absorption')} ${t('Gravel').toLowerCase()} (%)</span><span class="v sm"><input type="number" step="0.1" data-bind="moist.gravelAbs" data-num="1" value="${S.moist.gravelAbs}" style="max-width:110px;min-height:44px;font-size:17px;margin-left:auto"></span></div>
    <div class="note info">${LANG === 'id' ? 'Kadar air diukur pada sampel basah vs kering. Air bebas = massa kering × (kadar air − penyerapan).' : 'Moisture is measured on a wet vs dried sample. Free water = dry mass × (moisture − absorption).'}</div>
  </div>`;
}

/* ---- Cost ---- */
function viewCost() {
  const rows = S.grades.map((g) => ({ g, c: costOf(g) }));
  const byKey = {};
  rows.forEach((r) => { (byKey[r.g.key] = byKey[r.g.key] || []).push(r); });
  const s = snapshot();
  const cur = costOf(grade());
  const batchCost = anyPrice() ? cur.cost * s.vol : null;
  const rmx = +S.prices.rmxPerM3 || 0;
  const money = (v) => 'Rp ' + nf(v, 0);

  Object.keys(byKey).forEach((k) => {
    const min = Math.min(...byKey[k].map((r) => r.c.cost));
    byKey[k].forEach((r) => { r.win = anyPrice() && r.c.cost === min; });
  });

  const notes = Object.keys(byKey).map((k) => {
    const withSp = byKey[k].find((r) => (r.g.sp || 0) > 0);
    const noSp = byKey[k].find((r) => !((r.g.sp || 0) > 0));
    if (!withSp || !noSp || !anyPrice()) return '';
    const withoutSp = withSp.c.cost - withSp.c.spCost;
    const be = withSp.c.sp > 0 ? (noSp.c.cost - withoutSp) / withSp.c.sp : 0;
    const diff = noSp.c.cost - withSp.c.cost;
    const verdict = diff > 0
      ? (LANG === 'id' ? `+SP lebih murah ${money(diff)}/m³` : `+SP is cheaper by ${money(diff)}/m³`)
      : (LANG === 'id' ? `tanpa SP lebih murah ${money(-diff)}/m³` : `no-SP is cheaper by ${money(-diff)}/m³`);
    return `<div class="note ${diff > 0 ? 'ok' : 'info'}" style="margin-top:8px">
      <b>${k}</b> — ${verdict}
      <br><span class="fine">${t('Break-even SP price')}: <b>${money(be)}/L</b> · ${LANG === 'id' ? 'harga Anda' : 'your price'} ${money(+S.prices.spPerL || 0)}/L</span></div>`;
  }).join('');

  return `
  <div class="card">
    <h2>${t('Prices')} <span class="sub">${LANG === 'id' ? 'opsional, Rp' : 'optional, Rp'}</span></h2>
    <div class="row">
      <label class="field"><span class="lbl">${t('Cement per sack')}</span>
        <input type="number" step="1000" data-bind="prices.cement" data-num="1" value="${S.prices.cement || ''}" placeholder="—">
        <span class="hint">${S.prices.cement ? money(S.prices.cement) + ' / ' + S.sackSize + ' kg' : ' '}</span></label>
      <label class="field"><span class="lbl">${t('Plasticizer per litre')}</span>
        <input type="number" step="1000" data-bind="prices.spPerL" data-num="1" value="${S.prices.spPerL || ''}" placeholder="—">
        <span class="hint">${S.prices.spPerL ? money(S.prices.spPerL) + ' / L' : ' '}</span></label>
    </div>
    <div class="row">
      <label class="field"><span class="lbl">${t('Sand per m3')}</span>
        <input type="number" step="10000" data-bind="prices.sandPerM3" data-num="1" value="${S.prices.sandPerM3 || ''}" placeholder="—">
        <span class="hint">${S.prices.sandPerM3 ? money(S.prices.sandPerM3) + ' = ' + money(S.prices.sandPerM3 / bulkDensity('sand', 1500)) + '/kg' : ' '}</span></label>
      <label class="field"><span class="lbl">${t('Gravel per m3')}</span>
        <input type="number" step="10000" data-bind="prices.gravelPerM3" data-num="1" value="${S.prices.gravelPerM3 || ''}" placeholder="—">
        <span class="hint">${S.prices.gravelPerM3 ? money(S.prices.gravelPerM3) + ' = ' + money(S.prices.gravelPerM3 / bulkDensity('gravel', 1450)) + '/kg' : ' '}</span></label>
    </div>
    <div class="row">
      <label class="field"><span class="lbl">${t('Water per m3')}</span>
        <input type="number" step="1000" data-bind="prices.waterPerM3" data-num="1" value="${S.prices.waterPerM3 || ''}" placeholder="0">
        <span class="hint">${LANG === 'id' ? 'biasanya gratis' : 'usually free'}</span></label>
      <label class="field"><span class="lbl">${t('Readymix per m3')}</span>
        <input type="number" step="10000" data-bind="prices.rmxPerM3" data-num="1" value="${S.prices.rmxPerM3 || ''}" placeholder="—">
        <span class="hint">${LANG === 'id' ? 'untuk perbandingan' : 'for comparison'}</span></label>
    </div>
  </div>

  <div class="card">
    <h2>${t('Compare recipes')} <span class="sub">${t('Cost per m3')}</span></h2>
    <table class="grid">
      <tr><th>${t('Recipe')}</th><th>${t('Cement')} kg</th><th>Rp/m³</th></tr>
      ${rows.map((r) => `<tr class="${r.win ? 'win' : ''}">
        <td>${esc(r.g.name)}</td>
        <td>${nf(r.c.C, 0)}</td>
        <td class="big">${anyPrice() ? nf(r.c.cost, 0) : '—'}</td></tr>`).join('')}
    </table>
    ${notes}
  </div>

  <div class="card">
    <h2>${t('Cost per batch')} <span class="sub">${esc(s.g.name)}</span></h2>
    <div class="stat hero"><span class="k">${LANG === 'id' ? 'Campuran ini' : 'This batch'}</span><span class="v">${batchCost ? money(batchCost) : '—'}</span></div>
    <div class="stat"><span class="k">${t('Batch volume')}</span><span class="v sm">${nf(s.vol, 3)} m³</span></div>
    ${batchCost ? `<div class="stat"><span class="k">${t('Cost per m3')}</span><span class="v sm">${money(batchCost / s.vol)}</span></div>` : ''}
  </div>

  ${batchCost && rmx ? `<div class="card">
    <h2>${LANG === 'id' ? 'Per m³: site vs readymix' : 'Per m³: site vs readymix'}</h2>
    <table class="grid">
      <tr><th>${LANG === 'id' ? 'Per m³' : 'Per m³'}</th><th>Rp</th></tr>
      <tr><td>${esc(s.g.name)}</td><td>${nf(batchCost / s.vol, 0)}</td></tr>
      <tr><td>${LANG === 'id' ? 'Readymix terkirim' : 'Readymix delivered'}</td><td>${nf(rmx, 0)}</td></tr>
      <tr class="${rmx >= batchCost / s.vol ? 'win' : ''}"><td>${rmx >= batchCost / s.vol ? (LANG === 'id' ? 'Hemat' : 'Saved') : (LANG === 'id' ? 'Lebih mahal' : 'Costs more')}</td>
        <td>${nf(Math.abs(rmx - batchCost / s.vol), 0)}${rmx ? ' (' + nf(Math.abs(rmx - batchCost / s.vol) / rmx * 100, 0) + '%)' : ''}</td></tr>
    </table>
    <div class="fine" style="margin-top:8px">${LANG === 'id'
      ? 'Ketiga angka dalam Rp per m³ — selisihnya juga per m³, bukan per campuran.'
      : 'All three figures are Rp per m³ — the difference is per m³ too, not per batch.'}</div>
    <div class="stat" style="margin-top:10px"><span class="k">${LANG === 'id' ? 'Selisih campuran ini' : 'On this batch'}</span>
      <span class="v sm">${money((rmx - batchCost / s.vol) * s.vol)} <span class="fine">${nf(s.vol, 3)} m³</span></span></div>
  </div>` : ''}`;
}

/* ---- Tips: the process rules the numbers depend on ---- */
const TIPS = [
  { t: ['Water by measurement, not by eye', 'Air diukur, bukan dikira'],
    b: ['1 litre too much in a 2-sack batch is +0.0125 w/c — about <b>−1.5 MPa</b>. Mark a 20 L bucket in 1 L steps, or count a 1.5 L scoop. Every number in this app rests on this one habit.',
      'Kelebihan 1 liter pada campuran 2 karung = +0,0125 w/c — sekitar <b>−1,5 MPa</b>. Tandai ember 20 L per 1 liter, atau hitung ciduk 1,5 L. Semua angka di aplikasi ini bergantung pada kebiasaan ini.'] },
  { t: ['Calibrate the buckets, then re-check them', 'Kalibrasi ember, lalu ulangi'],
    b: ['Weigh 3 full buckets of sand and of gravel as they sit in the stockpile — damp, not dried. Repeat monthly, after rain and on every new delivery. The bulk density from those same numbers is what the mixer capacity check uses.',
      'Timbang 3 ember penuh pasir dan kerikil sesuai kondisi di stockpile — lembap, bukan dikeringkan. Ulangi tiap bulan, setelah hujan, dan setiap kiriman baru. Berat jenis lepas dari angka itu dipakai untuk cek kapasitas molen.'] },
  { t: ['One pan test per delivery', 'Satu uji wajan per kiriman'],
    b: ['2 kg of sand weighed wet, dried in a wok on the stove, weighed again. Ten minutes of work corrects the water for the whole pour. Sand at 8% moisture with no pan test means the app tells you to pour about 2 L too much.',
      '2 kg pasir ditimbang basah, dikeringkan di wajan, ditimbang lagi. Sepuluh menit kerja mengoreksi air untuk seluruh coran. Pasir 8% tanpa uji wajan berarti aplikasi menyuruh menuang sekitar 2 L terlalu banyak.'] },
  { t: ['The slump test is a procedure, not an opinion', 'Uji slump itu prosedur, bukan pendapat'],
    b: ['Three layers, 25 blows each with the rod, lift the cone in 5–7 seconds, measure immediately. Sloppy technique teaches the app a wrong k — and then its advice on how much water to add is wrong too.',
      'Tiga lapis, 25 tusukan per lapis, angkat kerucut dalam 5–7 detik, ukur segera. Teknik yang asal membuat aplikasi belajar k yang salah — dan saran jumlah air berikutnya ikut salah.'] },
  { t: ['At the water ceiling, use SP — never water', 'Saat batas air tercapai, pakai SP — bukan air'],
    b: ['If slump is still under the band with all the water in, add superplasticizer at the label dose, diluted in water, never onto dry mix. Water past the ceiling is the one thing that silently downgrades the concrete.',
      'Kalau slump masih di bawah target padahal air sudah habis, tambah plastisizer sesuai dosis label, diencerkan di air, jangan ke campuran kering. Air melewati batas adalah satu-satunya hal yang diam-diam menurunkan mutu.'] },
  { t: ['Hot day, morning pour', 'Hari panas, cor pagi'],
    b: ['At 30 °C in the sun slump drops 2–3 cm in 15 minutes. Keep cement shaded, and treat slump loss with SP, not water. A mix that has sat 30 minutes is not the same mix.',
      'Pada 30 °C di bawah matahari, slump turun 2–3 cm dalam 15 menit. Simpan semen tertekan, dan atasi slump turun dengan SP, bukan air. Campuran yang didiamkan 30 menit bukan campuran yang sama.'] },
  { t: ['The stockpile decides the mix', 'Tumpukan menentukan campuran'],
    b: ['Sand on a tarpaulin, shaped into a cone, sample from the base — not the top. Grading separates and moisture stratifies: the bottom of the pile is wetter and coarser than what you see.',
      'Pasir di atas terpal, dibentuk kerucut, ambil sampel dari bagian bawah — bukan atas. Gradasi memisah dan kadar air berlapis: dasar tumpukan lebih basah dan lebih kasar dari yang terlihat.'] },
  { t: ['Cast cubes on the first batch of a pour', 'Cetak kubus pada campuran pertama'],
    b: ['3 cubes, cured wet, tested at 7 and 28 days, results entered in the Diary. That is the only way to know what you actually made — and the app re-fits its strength curve to your cement from those results.',
      '3 kubus, direndam, diuji umur 7 dan 28 hari, hasilnya dimasukkan ke Catatan. Itu satu-satunya cara tahu beton yang benar-benar dibuat — dan aplikasi menyetel kurva kuat tekan ke semen Anda dari hasil itu.'] },
  { t: ['Weigh a sack from each cement delivery', 'Timbang satu karung tiap kiriman semen'],
    b: ['A 39 kg bag in a 40 kg recipe breaks every ratio in the table, silently. Same for old stock: cement stored 3 months in a humid room can lose 10–20%.',
      'Karung 39 kg pada resep 40 kg merusak semua rasio di tabel, tanpa terlihat. Sama untuk stok lama: semen 3 bulan di gudang lembap bisa kehilangan 10–20%.'] },
  { t: ['Bore piles: keep the tremmie buried', 'Tiang bor: tremie tetap terbenam'],
    b: ['Tremmie at least 1.5 m into the concrete, no free fall, steady rise, and never let a batch wait in the drum while the previous pile finishes — that is where segregation starts.',
      'Tremie masuk minimal 1,5 m ke dalam beton, jangan jatuh bebas, naik stabil, dan jangan biarkan campuran menunggu di drum saat tiang sebelumnya selesai — di situlah segregasi mulai.'] },
  { t: ['Check actual against theoretical pile volume', 'Bandingkan volume tiang nyata dan teoretis'],
    b: ['π/4 × D² × depth per pile. 10–15% over is normal fill; 30% over means the hole is collapsing or necking, a construction problem no mix design fixes. Under means the pile is short.',
      'π/4 × D² × kedalaman per tiang. Lebih 10–15% itu normal; lebih 30% berarti lubang runtuh atau mengecil, masalah pelaksanaan yang tidak bisa diperbaiki resep. Kurang berarti tiangnya pendek.'] }
];

function viewTips() {
  const i = LANG === 'id' ? 1 : 0;
  return `<div class="card">
    <h2>${t('Tips')} <span class="sub">${LANG === 'id' ? 'aturan proses di site' : 'site process rules'}</span></h2>
    <ol class="steps">${TIPS.map((x) => `<li><b>${x.t[i]}</b><br><span class="fine">${x.b[i]}</span></li>`).join('')}</ol>
  </div>
  <button class="small wide" data-nav="Batch">← ${t('Back')}</button>`;
}

/* ---- Settings ---- */
function viewSettings() {
  const A = siteStrengthA();
  return `
  <div class="card">
    <h2>${t('Settings')}</h2>
    <label class="field"><span class="lbl">${t('Cement type')}</span>
      <select data-bind="cementType" data-rerender="1">
        <option value="PCC" ${S.cementType === 'PCC' ? 'selected' : ''}>PCC — portland composite (default)</option>
        <option value="OPC" ${S.cementType === 'OPC' ? 'selected' : ''}>OPC — ordinary portland</option>
      </select>
      <span class="hint">${LANG === 'id' ? 'PCC lebih lambat, kuat 28 hari ~8% lebih rendah pada w/c sama. Bekisting dilepas lebih lama.' : 'PCC is slower and ~8% lower at 28 days for the same w/c. Keep formwork on longer.'}</span></label>
    <div class="row" style="align-items:flex-end">
      <label class="field" style="margin:0"><span class="lbl">${t('Mixer capacity')} (L)</span>
        <input type="number" inputmode="numeric" step="10" min="60" data-bind="mixerL" data-num="1" value="${S.mixerL}">
        <span class="hint">350–400 L ${LANG === 'id' ? 'umum di Bali' : 'typical in Bali'}</span></label>
      <label class="field" style="margin:0"><span class="lbl">${t('Buffer')} (%) ${infoBtn('buffer')}</span>
        <input type="number" inputmode="decimal" step="1" min="0" max="30" data-bind="bufferPct" data-num="1" value="${S.bufferPct}">
        <span class="hint">0 = ${LANG === 'id' ? 'tanpa cadangan' : 'no margin'}</span></label>
    </div>
    ${infoNote('buffer')}
    <hr class="sep">
    <div class="row">
      <label class="field"><span class="lbl">${t('Target slump')} (cm)</span><input type="number" step="1" data-bind="targetSlump" data-num="1" value="${S.targetSlump}"></label>
      <label class="field"><span class="lbl">${t('Slump band')} (±cm)</span><input type="number" step="0.5" data-bind="band" data-num="1" value="${S.band}"></label>
    </div>
    <div class="row" style="align-items:flex-end">
      <label class="field"><span class="lbl">${t('Start water %')}</span><input type="number" step="5" data-bind="startWaterPct" data-num="1" value="${S.startWaterPct}"></label>
      <label class="field"><span class="lbl">${t('Water per cm, per m3')} ${infoBtn('k')}</span><input type="number" step="0.1" min="0.2" data-bind="kPerM3PerCm" data-num="1" value="${S.kPerM3PerCm}"><span class="hint">L/m³ ${LANG === 'id' ? 'per cm' : 'per cm'}</span></label>
    </div>
    ${infoNote('k')}
    <div class="row" style="margin-top:10px">
      <label class="field" style="margin:0"><span class="lbl">${t('Default max dose')} ${infoBtn('spmax')}</span>
        <input type="number" step="0.1" min="0" max="5" data-bind="spMaxPct" data-num="1" value="${S.spMaxPct}">
        <span class="hint">% ${LANG === 'id' ? 'dari berat semen · untuk resep baru' : 'of cement weight · new recipes only'}</span></label>
      <label class="field" style="margin:0"><span class="lbl">${t('SP density')}</span>
        <input type="number" step="0.01" min="0.8" max="1.4" data-bind="spDensity" data-num="1" value="${S.spDensity}">
        <span class="hint">kg/L · ${LANG === 'id' ? 'timbang 1 L untuk memastikan' : 'weigh 1 L to confirm'}</span></label>
    </div>
    ${infoNote('spmax')}
    <label class="field"><span class="lbl">${t('Batch scatter σ')} ${infoBtn('strength')}</span>
      <input type="number" step="0.5" min="0" max="15" data-bind="sigmaMPa" data-num="1" value="${S.sigmaMPa}">
      <span class="hint">MPa · ${LANG === 'id' ? 'sebaran hasil kubus di site ini' : 'spread of cube results on this site'}</span></label>
    ${infoNote('strength')}
    <div class="note info">${S.cementType} · ${t('Strength estimate')}: ${strengthLabel(strengthMPa(grade().wc), grade().source)} @ w/c ${grade().wc.toFixed(3)}${A ? `<br>${LANG === 'id' ? 'Dari kubus Anda' : 'From your cubes'}: A ≈ ${nf(A, 0)} (${LANG === 'id' ? 'model default' : 'default model'} ${STRENGTH.A[S.cementType]})` : ''}</div>
  </div>

  <div class="card">
    <h2>${t('Language')}</h2>
    <div class="row">
      <button class="small ${S.lang === 'en' ? 'dark' : ''}" data-action="lang" data-lang="en">English</button>
      <button class="small ${S.lang === 'id' ? 'dark' : ''}" data-action="lang" data-lang="id">Bahasa Indonesia</button>
    </div>
  </div>

  <div class="card">
    <h2>${t('Reset')}</h2>
    <button class="small wide" data-action="reset-settings">${t('Reset settings to defaults')}</button>
    <div class="fine" style="margin:4px 0 10px">${LANG === 'id' ? 'menyimpan catatan campuran dan tabel mutu' : 'keeps the batch diary and the recipe table'}</div>
    <button class="small wide" data-action="grade-reset">${t('Reset recipes to defaults')}</button>
    <div class="fine" style="margin:4px 0 10px">${LANG === 'id' ? 'mengganti tabel mutu dengan 4 resep awal' : 'restores the four default recipes'}</div>
    <button class="danger wide" data-action="wipe">${t('Erase all data')}</button>
    <div class="fine" style="margin-top:4px">${LANG === 'id' ? 'menghapus semuanya, termasuk catatan' : 'deletes everything, including the diary'}</div>
  </div>

  <div class="card fine">
    Concrete Mixer v${VERSION} · ${LANG === 'id' ? 'bekerja offline, data disimpan di perangkat ini' : 'works offline, data stored on this device'}
  </div>`;
}

/* ------------------------------------------------------------- actions --- */
function startBatch() {
  const s = snapshot();
  S.live = {
    ts: Date.now(), gradeId: s.g.id, gradeName: s.g.name, g: { sand: s.g.sand, gravel: s.g.gravel, wc: s.g.wc, sp: s.g.sp || 0, spCap: spCapOfG(s.g), key: s.g.key },
    sack: s.sack, n: s.n, Cnom: s.Cnom, Cact: s.Cact, wc: s.g.wc,
    sandSSD: s.sandSSD, gravSSD: s.gravSSD, wetSand: s.wetSand, wetGrav: s.wetGrav,
    waterCorrected: s.waterCorrected, ceilingNet: s.ceilingNet, vol: s.vol, spL: s.spL,
    mS: s.mS, mG: s.mG, creditS: s.creditS, creditG: s.creditG,
    bucketSand: s.bucketSand, bucketGrav: s.bucketGrav, bS: s.bS, bG: s.bG,
    poured: 0, nextAdd: s.startWater, rows: [], slumps: [], notes: '', bufferPct: +S.bufferPct || 0,
    pour: String(S.pourTag || '').trim(), steps: [], startWater: s.startWater,
    spExtra: 0, lastSlump: null,
    target: (+s.g.tslump > 0 ? +s.g.tslump : +S.targetSlump), band: +S.band
  };
  save(); screen = 'Slump'; render();
}

/* Single source of truth for "how much water next" — used by the view and the recorder. */
function nextWater(L, slump) {
  const target = effTarget(L), band = effBand(L);
  if (slump == null || slump >= target - band) return 0;
  const kL = (+S.kPerM3PerCm || 2.4) * L.vol;
  const cap = Math.min(2, Math.max(0.5, 0.08 * Math.max(1, L.waterCorrected)));
  let add = clamp(kL * (target - slump), 0.1, cap);
  if (L.poured + add > L.ceilingNet) add = Math.max(0, L.ceilingNet - L.poured);
  return add < 0.1 ? 0 : add;
}

/* makeVerdict is the advice engine: one object describing what the batch needs
   next. The ADVISE card and the one-line echo both render it, so they cannot
   disagree with each other. */
function wetExcess(L, slump) {
  const hi = effTarget(L) + effBand(L);
  const overshoot = Math.max(0, slump - hi) * (+S.kPerM3PerCm || 2.4) * L.vol;
  return Math.max(0, L.poured - L.ceilingNet, overshoot);
}

/* ---- superplasticizer headroom -------------------------------------------
   The cap is a ceiling on the TOTAL dose, so the room left depends on what is
   already in the drum: the recipe's own dose plus everything logged as extra.
   One owner for "how much plasticizer next" — the advice card and the echo line
   both read it, and two copies would drift. */
const capOf = (L) => spCapOfG((L && L.g) || grade());
function doseNow(L) {
  const C = +(L && L.Cact) || 0;
  const extraL = (+(L && L.spExtra) || 0) / 1000;
  const base = +((L && L.g && L.g.sp) || 0);
  return base + (C > 0 ? (extraL * spDensity() / C) * 100 : 0);
}
const spRoomPct = (L) => Math.max(0, capOf(L) - doseNow(L));
/* The step shrinks at the edge, so the last dose can never overrun the cap. */
const spStepPct = (L) => Math.min(0.1, spRoomPct(L));
const spStepML = (L) => (spStepPct(L) / 100) * (+(L && L.Cact) || 0) / spDensity() * 1000;

/* ---- "slump is short, what now?" -----------------------------------------
   Two levers, two ceilings, four cases:
     water room + SP room  -> offer both (the SP lever only on a recipe that
                              already carries plasticizer — otherwise the water
                              can still do the job the recipe was designed for)
     water room + SP capped-> water only
     water at ceiling      -> plasticizer only, and it goes in NEAT into the
                              turning drum: it does not need water to carry it,
                              only to meet wet cement. With water closed, diluting
                              it would mean pouring over the ceiling.
     both exhausted        -> neither. Say so plainly instead of inventing a step.

   The plasticizer dose is a step, not a prediction: nobody can say how many
   centimetres 0.1 % buys on a given cement, so the card offers the increment
   and the cone decides. Two independent sources (datasheet soft-plastic band,
   Jayamix 0.48 %) put the working range for these mixes at 0.4–0.6 %. */
function shortAdvice(L, slump) {
  const id = LANG === 'id';
  /* An addition already in the drum that has not been measured yet. The advice
     cannot know what it bought, and repeating the same addition would double it. */
  const sinceW = Math.max(0, +L.sinceWater || 0), sinceSp = Math.max(0, +L.sinceSp || 0);
  if (sinceW > 0.05 || sinceSp >= 5) {
    const what = [sinceW > 0.05 ? `${nf(sinceW, 1)} L ${id ? 'air' : 'water'}` : '',
      sinceSp >= 5 ? `${nf(sinceSp, 0)} mL ${id ? 'plastisizer' : 'plasticizer'}` : '']
      .filter(Boolean).join(id ? ' dan ' : ' and ');
    const mins = sinceSp >= 5 ? (id ? '5 menit' : '5 minutes') : (id ? '1–2 menit' : '1–2 minutes');
    return { kind: 'warn', head: id ? 'UKUR LAGI' : 'MEASURE AGAIN', num: '', unit: '', inputs: false, measure: true,
      body: id
        ? `${what} sudah masuk setelah bacaan ${nf(slump, 1)} cm. Aduk ${mins}, lalu catat slump baru — jangan tambah lagi sebelum diukur.`
        : `${what} went in after the ${nf(slump, 1)} cm reading. Mix ${mins}, then record a new slump — do not add again before measuring.` };
  }
  const waterRoom = Math.max(0, L.ceilingNet - L.poured);
  const add = nextWater(L, slump);
  const spML = spStepML(L);
  const spOK = spRoomPct(L) > 0.009 && spML >= 5;   // room for a dose worth measuring
  const waterOK = add >= 0.1;
  const hasSP = +L.g.sp > 0;
  const cap = capOf(L);
  const dose = `${nf(doseNow(L), 2)}% → ${nf(doseNow(L) + spStepPct(L), 2)}% ${id ? 'dari' : 'of'} ${nf(cap, 2)}%`;
  const carrier = Math.min(1, waterRoom);
  const offerSP = spOK && (hasSP || !waterOK);
  const spWhere = carrier >= 0.2
    ? (id ? `dalam ${nf(carrier, 1)} L air (dari sisa ${nf(waterRoom, 1)} L)` : `in ${nf(carrier, 1)} L of the ${nf(waterRoom, 1)} L left`)
    : (id ? 'langsung ke drum yang berputar' : 'straight into the turning drum');
  /* The alternative carries its own mixing time: the water line above says
     1–2 minutes, and a worker who takes the plasticizer route would follow that
     number. Viscocrete 3115 N wants 5 minutes of wet mixing to give its full
     water reduction. */
  const spLine = `${id ? 'Atau plastisizer' : 'Or plasticizer'} <b>+${nf(spML, 0)} mL</b> ${spWhere} · ${id ? 'aduk 5 menit' : 'mix 5 min'} · ${id ? 'dosis' : 'dose'} <b>${dose}</b>`;
  const spOnly = id
    ? `Plastisizer <b>+${nf(spML, 0)} mL</b> ${spWhere}, aduk 5 menit, lalu ukur lagi. Dosis <b>${dose}</b>.`
    : `Plasticizer <b>+${nf(spML, 0)} mL</b> ${spWhere}, mix 5 minutes, then measure again. Dose <b>${dose}</b>.`;
  const noSPNote = hasSP ? '' : (id
    ? ' Resep ini tanpa plastisizer — menambahkannya mengubah campuran.'
    : ' This recipe carries no plasticizer — adding it changes the mix.');
  const left = nf(Math.max(0, waterRoom - add), 1);
  const anySP = hasSP || +L.spExtra > 0;
  if (waterOK && offerSP) {
    return { kind: 'warn', head: t('Add water').toUpperCase(), num: `${nf(add, 1)} L`, unit: id ? 'sekarang' : 'now', inputs: true,
      body: id ? `Aduk 1–2 menit, lalu ukur lagi. Sisa air ${left} L.` : `Mix 1–2 minutes, then measure again. ${left} L of water left.`,
      alt: spLine };
  }
  if (waterOK) {
    /* Water still available but plasticizer is not an option: either it is at
       its cap, or this recipe was designed without it. Do not mention a cap
       that does not apply. */
    const capNote = anySP && !spOK
      ? (id ? ` Plastisizer sudah di batas ${nf(cap, 2)}%.` : ` Plasticizer is at its cap of ${nf(cap, 2)}%.`)
      : '';
    return { kind: 'warn', head: t('Add water').toUpperCase(), num: `${nf(add, 1)} L`, unit: id ? 'sekarang' : 'now', inputs: true,
      body: (id ? `Aduk 1–2 menit, lalu ukur lagi. Sisa air ${left} L.` : `Mix 1–2 minutes, then measure again. ${left} L of water left.`) + capNote };
  }
  if (offerSP) {
    return { kind: 'warn', head: t('Plasticizer only').toUpperCase(), num: `+${nf(spML, 0)} mL`, unit: '', inputs: true,
      body: spOnly + noSPNote };
  }
  return { kind: 'danger', head: t('Both at max').toUpperCase(), num: '', unit: '', inputs: false,
    body: id
      ? 'Air dan plastisizer sama-sama di batas — campuran ini tidak bisa dibuat lebih cair. Tuang kalau masih bisa dituang, dan catat slump yang didapat: target resep ini tidak tercapai dengan campuran ini.'
      : "Water and plasticizer are both at their limits — this batch cannot be made more fluid. Place it if it still pours, and record the slump you got: this recipe's target is not reachable with this mix." };
}

function makeVerdict(L, slump) {
  const id = LANG === 'id';
  const lo = effTarget(L) - effBand(L), hi = effTarget(L) + effBand(L);
  const base = { slump, poured: L.poured };
  if (slump > hi) {
    const dC = wetExcess(L, slump) / L.wc;
    return Object.assign(base, { kind: 'danger',
      head: id ? 'TERLALU BASAH' : 'TOO WET',
      num: `+${nf(dC, 1)} kg`, unit: id ? 'semen' : 'cement',
      body: id
        ? `Tambah semen + agregat proporsional: +${nf(dC, 1)} kg semen, +${nf(dC * L.g.sand, 1)} kg pasir, +${nf(dC * L.g.gravel, 1)} kg kerikil. Jangan tambah air.`
        : `Add cement + aggregate proportionally: +${nf(dC, 1)} kg cement, +${nf(dC * L.g.sand, 1)} kg sand, +${nf(dC * L.g.gravel, 1)} kg gravel. No more water.` });
  }
  if (slump >= lo) {
    return Object.assign(base, { kind: 'ok',
      head: id ? 'SIAP' : 'READY',
      num: `${nf(slump, 1)} cm`, unit: 'slump',
      body: id ? `Slump dalam target ${effTarget(L)} ± ${effBand(L)} cm. Selesaikan campuran ini.` : `Slump is inside the band ${effTarget(L)} ± ${effBand(L)} cm. Finish this batch.`,
      finish: true });
  }
  /* Short of the band: one owner decides, so the advise card and the echo
     can never recommend different levers. */
  return Object.assign(base, shortAdvice(L, slump));
}

/* Result of an incremental import: full screen and on demand, because
   "did my batches go in and did anything of mine get lost?" must be answerable
   in one glance. No water footer here — this is not a batch in progress. */
function noticeHTML(v) {
  const id = LANG === 'id';
  return `<div class="vwrap" role="alertdialog" aria-live="assertive">
    <div class="vcard v-${v.kind}">
      <div class="vhead">${v.head}</div>
      ${v.num ? `<div class="vnum">${v.num}</div>` : ''}
      ${v.unit ? `<div class="vunit">${v.unit}</div>` : ''}
      <div class="vbody">${v.body}</div>
      <button class="vbtn ghost2" data-action="nclose">${id ? 'MENGERTI' : 'GOT IT'}</button>
      ${v.fine ? `<div class="vfine">${v.fine}</div>` : ''}
    </div>
  </div>`;
}

function finishBatch() {
  const L = S.live; if (!L) return;
  syncLedger(L);
  const finalSlump = L.lastSlump;
  if (finalSlump == null) {
    const warn = LANG === 'id'
      ? 'Belum ada angka slump. Simpan campuran tanpa hasil uji?'
      : 'No slump reading recorded. Save the batch without one?';
    if (!confirm(warn)) return;
  }
  const total = L.poured;                                           // water poured into the drum
  const totalWater = total + (L.creditS || 0) + (L.creditG || 0);   // + free water in aggregates
  const wcActual = L.Cact > 0 ? totalWater / L.Cact : 0;
  const adds = rowsToAdds(L.rows);
  const entry = {
    id: 'b' + Date.now(), ts: L.ts, gradeName: L.gradeName, source: L.g.source || '', pour: L.pour || '',
    cementType: S.cementType, sack: L.sack, n: L.n, Cnom: L.Cnom, Cact: L.Cact, bufferPct: L.bufferPct,
    wetSand: L.wetSand, wetGrav: L.wetGrav, mS: L.mS, mG: L.mG, creditS: L.creditS, creditG: L.creditG,
    waterDesign: L.g.wc * L.Cnom, waterUsed: total, totalWater, wcActual, ceilingNet: L.ceilingNet,
    finalSlump, targetSlump: effTarget(L), adds, rows: (L.rows || []).map((r) => ({ ...r })),
    slumps: L.slumps.slice(), spL: L.spL, spExtra: +L.spExtra || 0, vol: L.vol,
    bucketSand: L.bucketSand == null ? null : Math.floor(L.bucketSand),
    bucketGrav: L.bucketGrav == null ? null : Math.floor(L.bucketGrav),
    strengthEst: strengthMPa(wcActual), notes: L.notes || '', d7: null, d28: null,
    costPerM3: anyPrice() ? costOf({ sand: L.g.sand, gravel: L.g.gravel, wc: L.g.wc, sp: L.g.sp || 0, key: L.g.key }).cost : null
  };
  S.log.push(entry);
  // learn k from the last water addition that was followed by a higher reading
  if (adds.length >= 1 && L.slumps.length >= 2) {
    const a = adds[adds.length - 1];
    const prev = L.slumps[L.slumps.length - 2].v;
    if (a.L > 0 && a.slump > 0 && prev != null && a.slump > prev) {
      const kMeas = a.L / ((a.slump - prev) * L.vol);
      S.kPerM3PerCm = clamp(0.7 * (+S.kPerM3PerCm) + 0.3 * kMeas, (+S.kPerM3PerCm) * 0.8, (+S.kPerM3PerCm) * 1.2);
    }
  }
  S.live = null; rowEdit = null; adviceOpen = false; echo = null;
  save(); screen = 'Diary'; render();
  toast(LANG === 'id' ? 'Campuran tersimpan' : 'Batch saved');
}

function resetSettings() {
  const d = DEFAULTS();
  ['sackSize', 'sacks', 'bufferPct', 'startWaterPct', 'targetSlump', 'band', 'mixerL', 'cementType', 'kPerM3PerCm', 'spMaxPct']
    .forEach((k) => { S[k] = d[k]; });
  S.cal = d.cal; S.moist = d.moist; S.prices = d.prices; S.live = null;
  save(); render();
  toast(LANG === 'id' ? 'Setelan dikembalikan' : 'Settings reset');
}

function toast(msg) {
  const d = document.createElement('div');
  d.textContent = msg;
  d.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(64px + env(safe-area-inset-top));background:#101418;color:#fff;padding:12px 18px;border-radius:12px;font-weight:700;z-index:99;max-width:90vw;text-align:center;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.25)';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2200);
}

/* ---------------------------------------------------------- import/export */
function download(name, text, type) {
  const blob = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function exportCSV() {
  const cols = ['ts', 'gradeName', 'cementType', 'sack', 'n', 'Cnom', 'Cact', 'bufferPct', 'wetSand', 'wetGrav', 'mS', 'mG', 'creditS', 'creditG',
    'waterDesign', 'waterUsed', 'wcActual', 'finalSlump', 'spL', 'spExtra', 'vol', 'bucketSand', 'bucketGrav', 'strengthEst', 'd7', 'd28', 'costPerM3', 'notes', 'adds'];
  const head = cols.join(',');
  const lines = S.log.map((e) => cols.map((c) => {
    let v = e[c];
    if (c === 'adds') v = (e.adds || []).map((a) => a.L.toFixed(2) + '@' + a.slump).join(' | ');
    if (v == null) return '';
    if (typeof v === 'number') return (Math.round(v * 1000) / 1000);
    return '"' + String(v).replace(/"/g, '""') + '"';
  }).join(','));
  download(`concrete-batches-${new Date().toISOString().slice(0, 10)}.csv`, [head, ...lines].join('\n'), 'text/csv');
}

function exportBackup() {
  download(`concrete-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(S, null, 2), 'application/json');
}

/* ------------------------------------------------- incremental batch import --
   Deliberately separate from the restore path above, which replaces the whole
   state. Here only S.log is touched: recipes, calibration, prices, cement type,
   settings and a batch in progress stay exactly as they are. A batch already in
   the diary is skipped, matched on its id — or, for backups written before ids
   existed, on timestamp + grade + volume. */
/* Every key an entry can be recognised by. An entry is stored under its id AND
   under what it is (timestamp + grade + volume), so a file that arrives without
   ids still matches the copy that was saved with one — otherwise re-importing
   the same backup would add the id-less batches again. */
const entryKeys = (e) => {
  const out = [];
  if (e && e.id) out.push('id:' + e.id);
  out.push('k:' + (+(e && e.ts) || 0) + '|' + ((e && e.gradeName) || '') + '|' + (e && e.vol != null ? (+e.vol).toFixed(3) : ''));
  return out;
};

function mergeFile(text, fileName) {
  const id = LANG === 'id';
  let d = null;
  try { d = JSON.parse(text); } catch (err) { d = null; }
  const incoming = Array.isArray(d) ? d : (d && Array.isArray(d.log) ? d.log : null);
  if (!incoming) {
    notice = { kind: 'danger',
      head: id ? 'BUKAN FILE CADANGAN' : 'NOT A BACKUP FILE',
      body: id ? 'File ini tidak berisi data batch. Pakai file <b>.json</b> yang diekspor dari layar Catatan di HP lain.'
        : 'That file carries no batch data. Use the <b>.json</b> file exported from the Diary screen on the other phone.' };
    return render();
  }
  const seen = new Set();
  S.log.forEach((e) => entryKeys(e).forEach((k) => seen.add(k)));
  const fresh = [];
  let dup = 0, bad = 0;
  incoming.forEach((e) => {
    if (!e || typeof e !== 'object' || !(+(e.ts) > 0)) { bad++; return; }
    const keys = entryKeys(e);
    if (keys.some((k) => seen.has(k))) { dup++; return; }
    keys.forEach((k) => seen.add(k));
    const c = Object.assign({}, e);
    if (!c.id) c.id = 'b' + c.ts + 'm' + (fresh.length + 1);   // legacy entry without an id
    fresh.push(c);
  });
  if (!fresh.length) {
    notice = { kind: 'warn',
      head: id ? 'TIDAK ADA YANG BARU' : 'NOTHING NEW',
      num: nf(dup, 0), unit: id ? 'sudah ada' : 'already here',
      body: id ? `Semua batch di file itu sudah ada di catatan Anda. <b>Tidak ada yang diubah.</b>`
        : `Every batch in that file is already in your diary. <b>Nothing was changed.</b>`,
      fine: (id ? 'catatan sekarang' : 'diary now') + ` ${S.log.length} ` + (S.log.length === 1 ? 'batch' : 'batches') };
    return render();
  }
  const ask = (id
    ? `Tambah ${fresh.length} batch ke catatan Anda (${S.log.length})? Tidak ada yang diganti.`
    : `Add ${fresh.length} batches to your ${S.log.length}? Nothing is replaced.`)
    + (dup ? (id ? `\n${dup} sudah ada — dilewati.` : `\n${dup} already here — skipped.`) : '');
  if (!confirm(ask)) return;
  const before = S.log.length;
  S.log = S.log.concat(fresh).sort((a, b) => (+a.ts || 0) - (+b.ts || 0));
  save();
  notice = { kind: 'ok',
    head: id ? 'BATCH DITAMBAHKAN' : 'BATCHES ADDED',
    num: '+' + nf(fresh.length, 0), unit: id ? 'batch' : (fresh.length === 1 ? 'batch' : 'batches'),
    body: (dup ? (id ? `${dup} sudah ada di catatan, dilewati. ` : `${dup} were already here, skipped. `) : '')
      + (bad ? (id ? `${bad} baris tidak terbaca. ` : `${bad} unreadable rows. `) : '')
      + (id ? 'Resep, kalibrasi, harga dan setelan tidak disentuh.'
        : 'Recipes, calibration, prices and settings were not touched.'),
    fine: (id ? 'catatan' : 'diary') + ` ${before} → <b>${S.log.length}</b>`
      + (fileName ? ` · ${esc(fileName)}` : '' ) };
  render();
}

/* ------------------------------------------------------------- handlers -- */
document.addEventListener('click', (ev) => {
  const nav = ev.target.closest('[data-nav]');
  if (nav) { screen = nav.dataset.nav; render(); return; }
  const chip = ev.target.closest('[data-chip]');
  if (chip) {
    const i = $('#slIn');
    if (i) i.value = chip.dataset.chip;
    $$('.quick button').forEach((b) => b.classList.remove('on'));
    chip.classList.add('on');
    return;
  }
  const stepEl = ev.target.closest('[data-step]');
  if (stepEl && S.live) {
    const i = +stepEl.dataset.step;
    S.live.steps = S.live.steps || [];
    S.live.steps[i] = !S.live.steps[i];
    save(); render(); return;
  }
  const stageTog = ev.target.closest('[data-stage-toggle]');
  if (stageTog) { stageOpen = !stageOpen; render(); return; }
  const ib = ev.target.closest('[data-info]');
  if (ib) {
    const note = document.getElementById('info-' + ib.dataset.info);
    if (note) {
      const wasOpen = note.style.display !== 'none';
      $$('.card .note.info[id^="info-"]').forEach((n) => { n.style.display = 'none'; });
      note.style.display = wasOpen ? 'none' : 'block';
      ib.classList.toggle('on', !wasOpen);
    }
    return;
  }
  const a = ev.target.closest('[data-action]');
  if (!a) return;
  const act = a.dataset.action;
  if (act === 'start') return startBatch();
  if (act === 'slump-finish') return finishBatch();
  if (act === 'add-water') { const i = $('#wIn'); if (S.live) addWaterRow(S.live, i ? i.value : 0); return; }
  if (act === 'add-sp') { const i = $('#spIn'); if (S.live) addSpRow(S.live, i ? i.value : 0); return; }
  if (act === 'add-slump') { const i = $('#slIn'); if (S.live) addSlumpRow(S.live, i ? i.value : 0); return; }
  if (act === 'row-edit') { rowEdit = a.dataset.id; return render(); }
  if (act === 'row-cancel') { rowEdit = null; return render(); }
  if (act === 'row-save') { const i = $('#rowIn'); if (S.live) editRowValue(S.live, a.dataset.id, i ? i.value : ''); return; }
  if (act === 'row-del') { if (S.live) delRow(S.live, a.dataset.id); return; }
  if (act === 'advise') { adviceOpen = !adviceOpen; return render(); }
  if (act === 'nclose') { notice = null; return render(); }
  if (act === 'slump-cancel') { rowEdit = null; adviceOpen = false; echo = null; S.live = null; save(); screen = 'Batch'; return render(); }
  if (act === 'slump-note') {
    const n = prompt(t('Notes'), (S.live && S.live.notes) || '');
    if (n != null && S.live) { S.live.notes = n; save(); }
    return;
  }
  if (act === 'del') {
    if (!confirm(t('Delete') + '?')) return;
    S.log = S.log.filter((e) => e.id !== a.dataset.id); save(); return render();
  }
  if (act === 'csv') return exportCSV();
  if (act === 'backup') return exportBackup();
  if (act === 'import') return $('#importFile') && $('#importFile').click();
  if (act === 'merge') { return $('#mergeFile') && $('#mergeFile').click(); }
  if (act === 'grade-add') {
    const id = 'g' + Date.now();
    S.grades.push({ id, key: 'K' + (300 + S.grades.length), name: 'K??? — new', source: 'site', sand: 1.8, gravel: 2.75, wc: 0.5, sp: 0 });
    S.gradeId = id; save(); return render();
  }
  if (act === 'grade-del') {
    if (S.grades.length <= 1) return;
    const del = S.grades.find((x) => x.id === a.dataset.id);
    if (!confirm(t('Delete') + (del ? ` “${del.name}”?` : '?'))) return;
    S.grades = S.grades.filter((g) => g.id !== a.dataset.id);
    if (!S.grades.find((g) => g.id === S.gradeId)) S.gradeId = S.grades[0].id;
    save(); return render();
  }
  if (act === 'grade-reset') {
    if (!confirm(t('Reset recipes to defaults') + '?')) return;
    S.grades = DEFAULT_GRADES(); S.gradeId = S.grades[0].id; save(); return render();
  }
  if (act === 'reset-settings') {
    if (!confirm(t('Reset settings to defaults') + '?')) return;
    return resetSettings();
  }
  if (act === 'add-w') {
    const kind = a.dataset.kind;
    const inp = document.getElementById(kind === 'sand' ? 'wSand' : 'wGravel');
    const v = parseFloat(inp.value);
    if (!isFinite(v) || v <= 0) return;
    S.cal[kind + 'Weigh'].push(v); S.cal.date = new Date().toISOString().slice(0, 10);
    save(); return render();
  }
  if (act === 'wipe-w') {
    ev.preventDefault();
    const kind = a.dataset.kind, i = +a.dataset.i;
    S.cal[kind + 'Weigh'].splice(i, 1); save(); return render();
  }
  if (act === 'lang') { S.lang = a.dataset.lang; save(); return render(); }
  if (act === 'wipe') {
    if (!confirm(t('Erase all data') + '?')) return;
    localStorage.removeItem(KEY); S = DEFAULTS(); save(); return render();
  }
});

document.addEventListener('input', (ev) => {
  const el = ev.target;
  const path = el.dataset.bind;
  if (path) {
    let v;
    if (el.type === 'checkbox') v = el.checked;
    else if (el.dataset.num || el.type === 'number') v = el.value === '' ? 0 : parseFloat(el.value);
    else v = el.value;
    setPath(S, path, v);
    save();
    if (screen === 'Batch') syncBatch();
  }
  const lv = el.dataset.live;
  if (lv && S.live) {
    const num = el.value === '' ? null : parseFloat(el.value);
    S.live[lv] = (num == null || !isFinite(num)) ? (lv === 'spActual' ? 0 : null) : num;
    save();
  }
  const gf = el.dataset.gf;
  if (gf) {
    const g = S.grades.find((x) => x.id === el.dataset.grade);
    if (g) { g[gf] = el.type === 'number' ? (el.value === '' ? 0 : parseFloat(el.value)) : el.value; save(); }
  }
  const cube = el.dataset.cube;
  if (cube) {
    const e = S.log.find((x) => x.id === el.dataset.id);
    if (e) { e[cube] = el.value === '' ? null : parseFloat(el.value); save(); }
  }
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.id === 'mergeFile' && el.files && el.files[0]) {
    const file = el.files[0];
    const fr = new FileReader();
    fr.onload = () => {
      try { mergeFile(String(fr.result), file.name); }
      catch (e) { console.warn('merge failed', e); toast(LANG === 'id' ? 'Gagal membaca file' : 'Could not read that file'); }
      el.value = '';                       // same file can be picked again
    };
    fr.readAsText(file);
    return;
  }
  if (el.id === 'importFile' && el.files && el.files[0]) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const d = JSON.parse(fr.result);
        S = Object.assign(DEFAULTS(), d);
        S.cal = Object.assign(DEFAULTS().cal, d.cal || {});
        S.moist = Object.assign(DEFAULTS().moist, d.moist || {});
        S.prices = Object.assign(DEFAULTS().prices, d.prices || {});
        save(); render(); toast('OK');
      } catch (e) { toast('Invalid backup'); }
    };
    fr.readAsText(el.files[0]);
    return;
  }
  if (el.dataset.rerender) { render(); return; }
  /* data-live fields (water poured / SP added) commit on 'input' and change
     nothing derived, so they must NOT re-render here: the change fires on blur,
     which is exactly when the worker's thumb is on the button below the field —
     replacing the DOM at that instant swallows the tap, and the button appears
     to need two presses. */
  if (el.dataset.live) { return; }
  if (el.dataset.gf || el.dataset.bind) {
    // full re-render for selects / committed values so derived cards refresh
    if (el.tagName === 'SELECT') render();
    else if (screen === 'Grades' || screen === 'Calibration' || screen === 'Cost' || screen === 'Settings') render();
    else if (screen === 'Batch') syncBatch();
    else if (screen === 'Diary') render();
  }
});

/* --------------------------------------------------------------- boot ---- */
document.addEventListener('toggle', (ev) => {
  const g = ev.target.closest && ev.target.closest('details[data-gid]');
  if (g) { if (g.open) openGrades.add(g.dataset.gid); else openGrades.delete(g.dataset.gid); }
  const en = ev.target.closest && ev.target.closest('details[data-entry]');
  if (en) { if (en.open) openEntries.add(en.dataset.entry); else openEntries.delete(en.dataset.entry); }
}, true);

$('#btnLang').addEventListener('click', () => {
  S.lang = S.lang === 'en' ? 'id' : 'en'; save(); render();
});

/* Header "?" — the process rules, reachable from any screen */
$('#btnTips').addEventListener('click', () => {
  screen = screen === 'Tips' ? 'Batch' : 'Tips';
  render();
});

load();
LANG = S.lang || 'en';
render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js')
    .then((reg) => reg.update().catch(() => {}))
    .catch(() => {});
}
