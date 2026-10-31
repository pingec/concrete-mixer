'use strict';
/* ===========================================================================
   Concrete Mixer — offline site batching calculator
   Single-page, no dependencies, localStorage state, PWA-installable.
   =========================================================================== */

const VERSION = '1.0.0';

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
  'Total water': 'Total air', 'Water ceiling': 'Batas air',
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
  'Export CSV': 'Ekspor CSV', 'Export backup': 'Ekspor cadangan', 'Import backup': 'Impor cadangan',
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
  'Dose capped': 'Dosis dibatasi'
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
  { id: 'g300s', key: 'K300', name: 'K300 — site mix',        source: 'site', sand: 1.80,  gravel: 2.75,  wc: 0.500,  sp: 0 },
  { id: 'g250s', key: 'K250', name: 'K250 — site mix',        source: 'site', sand: 2.05,  gravel: 3.10,  wc: 0.550,  sp: 0 },
  { id: 'g300r', key: 'K300', name: 'K300 — Jayamix design', source: 'rmx',  sand: 3.367, gravel: 2.857, wc: 0.5953, sp: 0.48 },
  { id: 'g250r', key: 'K250', name: 'K250 — Jayamix design', source: 'rmx',  sand: 3.817, gravel: 3.206, wc: 0.6680, sp: 0.53 }
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
  cal: { tare: 0, bucketL: 12, sandWeigh: [], gravelWeigh: [], date: null },
  moist: { useSand: false, useGravel: false, sandWet: 0, sandDry: 0, gravelWet: 0, gravelDry: 0, sandAbs: 1.5, gravelAbs: 0.8 },
  prices: { cement: 0, sandPerM3: 0, gravelPerM3: 0, spPerL: 0, waterPerM3: 0, rmxPerM3: 1400000 },
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
    // migration: the readymix preset is Jayamix (SCG Readymix Indonesia)
    S.grades.forEach((g) => {
      if (g && typeof g.name === 'string') g.name = g.name.replace(/readymix design/i, 'Jayamix design');
    });
    // migration: SP used to be litres per kg of cement, now % of cement weight
    if (!d.spUnitV2) {
      S.grades.forEach((g) => {
        if (g && +g.sp > 0 && +g.sp < 0.05) g.sp = +(+g.sp * (+S.spDensity || 1.06) * 100).toFixed(3);
      });
      S.spUnitV2 = true;
    }
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
const spPctOf = (g) => Math.max(0, Math.min(+g.sp || 0, +S.spMaxPct || 0));
const spCapped = (g) => (+g.sp || 0) > (+S.spMaxPct || 0) + 1e-9;

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

function strengthMPa(wc) {
  const A = STRENGTH.A[S.cementType] || STRENGTH.A.PCC;
  return A * Math.exp(-STRENGTH.k * wc);
}
function siteStrengthA() {
  const vals = S.log.filter((e) => e.d28 > 0 && e.wcActual > 0)
    .map((e) => e.d28 / Math.exp(-STRENGTH.k * e.wcActual));
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

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
  sp: ['Superplasticizer for this batch. <b>Dose is % of cement weight</b>, as the datasheet writes it, converted to millilitres with the product density. Dilute it into half the mixing water — never onto dry material, and never add water after it. Add in two half-doses with a mix and a slump test between them.',
    'Plastisizer untuk campuran ini. <b>Dosis dalam % berat semen</b>, seperti di lembar data, diubah ke mililiter memakai massa jenis produk. Encerkan ke setengah air — jangan ke bahan kering, dan jangan menambah air setelahnya. Beri dua setengah dosis dengan aduk dan uji slump di antaranya.'],
  spmax: ['Hard ceiling on superplasticizer dose, as % of cement weight. Viscocrete 3115 N datasheet: <b>0.3–0.8%</b> for soft plastic concrete (your 8–12 cm slump), <b>0.8–2.0%</b> only for flowing or self-compacting concrete. The app refuses to dose above this and flags the recipe if it asks for more.',
    'Batas keras dosis plastisizer, dalam % berat semen. Lembar data Viscocrete 3115 N: <b>0,3–0,8%</b> untuk beton plastis (slump 8–12 cm), <b>0,8–2,0%</b> hanya untuk beton mengalir atau self-compacting. Aplikasi menolak dosis di atas ini dan menandai resep yang meminta lebih.'],
  k: ['How much extra water raises slump by 1 cm, per m³ of concrete. Default 2.4 L/m³ per cm — that is about 0.48 L per cm on a 0.2 m³ batch. The app re-fits this automatically from every finished batch (±20% per batch, so it cannot run away), which makes the next addition more accurate for your sand, cement and mixer.',
    'Berapa banyak air tambahan menaikkan slump 1 cm, per m³ beton. Awal 2,4 L/m³ per cm — sekitar 0,48 L per cm untuk campuran 0,2 m³. Aplikasi menyetel ulang otomatis dari setiap campuran yang selesai (±20% per campuran, jadi tidak bisa melenceng), sehingga tambahan berikutnya makin akurat untuk pasir, semen dan molen Anda.']
};
const infoBtn = (k) => `<button class="info" data-info="${k}" aria-label="?">?</button>`;
const infoNote = (k) => `<div class="note info" id="info-${k}" style="display:none">${INFO[k][LANG === 'id' ? 1 : 0]}</div>`;

/* ---------------------------------------------------------------- UI ---- */
const TABS = ['Batch', 'Slump', 'Diary', 'Grades', 'Calibration', 'Cost', 'Settings'];
const ICONS = { Batch: '🧱', Slump: '📏', Diary: '📖', Grades: '📋', Calibration: '⚖️', Cost: '💰', Settings: '⚙️' };
let screen = 'Batch';
const openGrades = new Set();

function renderTabs() {
  const SHORT = { Calibration: 'Calib' };
  $('#tabs').innerHTML = TABS.map((n) => {
    const live = n === 'Slump' && !S.live;
    return `<button data-nav="${n}" class="${screen === n ? 'active' : ''}" ${live ? 'style="opacity:.5"' : ''}>
      <span class="ico">${ICONS[n]}</span><span>${t(SHORT[n] || n)}</span></button>`;
  }).join('');
}

function render() {
  LANG = S.lang || 'en';
  document.documentElement.lang = LANG;
  $('#btnLang').textContent = LANG === 'en' ? 'ID' : 'EN';
  $('#ver').textContent = 'v' + VERSION;
  renderTabs();
  const map = { Batch: viewBatch, Slump: viewSlump, Diary: viewDiary, Grades: viewGrades, Calibration: viewCalib, Cost: viewCost, Settings: viewSettings };
  $('#main').innerHTML = (map[screen] || viewBatch)();
  if (screen === 'Batch') syncBatch();
  window.scrollTo({ top: 0 });
}

/* ---- Batch ---- */
function viewBatch() {
  const s = snapshot();
  const g = s.g;
  const noCal = !s.bS || !s.bG;
  const pct = S.mixerL ? Math.round(s.vol * 1000 / S.mixerL * 100) : 0;
  const wc = g.wc;
  const est = strengthMPa(wc);

  const gradeOpts = S.grades.map((x) => `<option value="${x.id}" ${x.id === g.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');

  let html = `
  <div class="card">
    <h2>${t('Recipe')}</h2>
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
    <div class="note info" style="margin-top:0">
      ${g.sand.toFixed(2)} : ${g.gravel.toFixed(2)} : ${g.wc.toFixed(2)} ${LANG === 'id' ? 'per kg semen' : 'per kg cement'}
      · <b>${est.toFixed(1)} MPa ≈ K${Math.round(est * 10.197)}</b> (${S.cementType})
    </div>
    <details style="margin-top:10px" ${(+S.bufferPct > 0 || +S.mixerL !== 350) ? 'open' : ''}>
      <summary>${t('Cement buffer')} · ${t('Mixer capacity')}</summary>
      <div class="row" style="margin-top:10px">
        <label class="field" style="margin:0"><span class="lbl">${t('Cement buffer')} (%) ${infoBtn('buffer')}</span>
          <input type="number" inputmode="decimal" step="1" min="0" max="30" data-bind="bufferPct" data-num="1" value="${S.bufferPct}">
          <span class="hint">0 = ${LANG === 'id' ? 'tanpa cadangan' : 'no margin'}</span></label>
        <label class="field" style="margin:0"><span class="lbl">${t('Mixer capacity')} (L)</span>
          <input type="number" inputmode="numeric" step="10" min="60" data-bind="mixerL" data-num="1" value="${S.mixerL}">
          <span class="hint">350–400 L ${LANG === 'id' ? 'umum di Bali' : 'typical in Bali'}</span></label>
      </div>
      ${infoNote('buffer')}
    </details>
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
    <div class="stat"><span class="k">${t('Water to pour')} ${infoBtn('wpour')}</span><span class="v"><span id="o-totalW">—</span><span class="unit">L</span></span></div>
    ${infoNote('wpour')}
    <div class="stat" id="row-credit" style="display:none"><span class="k">${t('Water in aggregate')}</span><span class="v"><span id="o-credit">—</span><span class="unit">L</span></span></div>
    <div class="stat"><span class="k">${t('Water ceiling')} ${infoBtn('ceil')}</span><span class="v"><span id="o-ceilW">—</span><span class="unit">L</span></span></div>
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
  set('o-totalW', nf(s.waterCorrected, 1));
  set('o-ceilW', nf(s.ceilingNet, 1));
  set('o-credit', nf(s.creditS + s.creditG, 1));
  const rowCredit = document.getElementById('row-credit');
  if (rowCredit) rowCredit.style.display = (s.creditS + s.creditG) > 0.05 ? '' : 'none';
  set('o-sp', nf(s.spL * 1000, 0));
  set('o-spPct', `(${nf(s.spPct, 2)}% ${LANG === 'id' ? 'dari semen' : 'of cement'})`);
  set('o-vol', nf(s.vol, 3));
  const pct = S.mixerL ? Math.round(s.vol * 1000 / S.mixerL * 100) : 0;
  set('o-volpct', `${pct}% ${LANG === 'id' ? 'dari molen' : 'of mixer'}`);
  const row = document.getElementById('row-sp'); if (row) row.style.display = s.spL > 0 ? '' : 'none';

  const w = [];
  if (pct > 60) w.push(`<div class="note danger"><b>${t('Over capacity')}</b> — ${nf(s.vol, 3)} m³ = ${pct}% ${LANG === 'id' ? 'dari molen' : 'of the mixer'}. ${LANG === 'id' ? 'Kurangi karung.' : 'Reduce sacks.'}</div>`);
  if (s.mS != null && s.creditS > 0) w.push(`<div class="note info">${t('Sand')}: ${(s.mS * 100).toFixed(1)}% ${t('Moisture').toLowerCase()} → ${nf(s.creditS, 1)} L ${LANG === 'id' ? 'dikurangi dari air' : 'credited to the mix'}</div>`);
  if (s.mS != null && s.creditS <= 0) w.push(`<div class="note warn">${t('Sand')}: ${(s.mS * 100).toFixed(1)}% ≤ ${t('Absorption').toLowerCase()} ${S.moist.sandAbs}% → ${LANG === 'id' ? 'tidak ada air bebas' : 'no free water, no credit'}</div>`);
  if (s.spCapped) w.push(`<div class="note danger"><b>${t('Dose capped')}</b> — ${LANG === 'id'
    ? `resep minta ${nf(s.g.sp, 2)}% tetapi maksimum ${nf(S.spMaxPct, 2)}%. Dipakai ${nf(s.spPct, 2)}%.`
    : `recipe asks ${nf(s.g.sp, 2)}% but the max is ${nf(S.spMaxPct, 2)}%. Using ${nf(s.spPct, 2)}%.`}</div>`);
  if (s.spL > 0) w.push(`<div class="note info">${t('Plasticizer')}: ${nf(s.spL * 1000, 0)} mL = ${nf(s.spPct, 2)}% ${LANG === 'id' ? 'dari berat semen' : 'of cement weight'}. ${LANG === 'id' ? 'Encerkan dalam setengah air, jangan tuang ke bahan kering.' : 'Dilute in half the water — never onto dry material.'}</div>`);
  const wEl = document.getElementById('warn'); if (wEl) wEl.innerHTML = w.join('');
  if (wEl && !w.length) wEl.innerHTML = '';
}

/* ---- Slump ---- */
function viewSlump() {
  if (!S.live) {
    return `<div class="card center"><h2>${t('Slump')}</h2>
      <p class="fine">${LANG === 'id' ? 'Belum ada campuran berjalan.' : 'No batch in progress.'}</p>
      <button class="primary wide" data-nav="Batch">${t('Batch')} →</button></div>`;
  }
  const L = S.live;
  const last = L.slumps.length ? L.slumps[L.slumps.length - 1].v : null;
  const lo = (+S.targetSlump) - (+S.band), hi = (+S.targetSlump) + (+S.band);
  const inBand = last != null && last >= lo && last <= hi;
  const overWet = last != null && last > hi;

  let guidance = '';
  if (last == null) {
    guidance = `<div class="note info">${LANG === 'id' ? 'Tuang air awal, aduk 2 menit, lalu ukur slump.' : 'Pour the start water, mix 2 minutes, then measure the slump.'}</div>`;
  } else if (inBand) {
    guidance = `<div class="note ok"><b>${t('Ready')}</b> — ${LANG === 'id' ? 'slump dalam target. Tekan Selesai.' : 'slump is in the band. Press Finish batch.'}</div>`;
  } else if (overWet) {
    const excess = Math.max(0, L.poured - L.ceilingNet);
    const dC = excess > 0 ? excess / L.wc : 0;
    guidance = `<div class="note danger"><b>${LANG === 'id' ? 'Terlalu basah' : 'Too wet'}</b> — ${LANG === 'id' ? 'jangan tambah air. Tambah semen + agregat proporsional:' : 'no more water. Add cement + aggregate proportionally:'}
      <br><b>+${nf(dC, 1)} kg ${t('Cement')} · +${nf(dC * L.g.sand, 1)} kg ${t('Sand')} · +${nf(dC * L.g.gravel, 1)} kg ${t('Gravel')}</b>
      <br><span class="fine">${LANG === 'id' ? 'Volume campuran bertambah — cek kapasitas molen.' : 'Batch volume grows — check mixer capacity.'}</span></div>`;
  } else {
    const add = nextWater(L, last);
    const kL = (+S.kPerM3PerCm || 2.4) * L.vol;
    if (add < 0.1) {
      guidance = `<div class="note danger"><b>${LANG === 'id' ? 'Batas air tercapai' : 'Water ceiling reached'}</b> — ${LANG === 'id'
        ? 'Slump masih di bawah ' + lo + ' cm. Pakai plastisizer sesuai dosis, atau tambah semen + agregat proporsional. Jangan tambah air.'
        : 'Slump is still below ' + lo + ' cm. Use plasticizer at the label dose, or add cement + aggregate proportionally. No more water.'}</div>`;
    } else {
      guidance = `<div class="note warn"><b>${t('Add water')}: ${nf(add, 1)} L</b> — ${LANG === 'id' ? 'aduk 1–2 menit, ukur lagi.' : 'mix 1–2 minutes, then measure again.'}
        <br><span class="fine">k = ${nf(kL, 2)} L/cm ${LANG === 'id' ? 'untuk campuran ini' : 'for this batch'} · ${t('Remaining')} ${nf(Math.max(0, L.ceilingNet - L.poured - add), 1)} L</span></div>`;
    }
  }

  const adds = L.adds.length
    ? `<details><summary>${t('Water used')} (${nf(L.poured, 1)} L)</summary><div class="fine mono">${L.adds.map((a, i) => `#${i + 1} +${nf(a.L, 1)} L → ${a.slump} cm`).join('<br>')}</div></details>`
    : '';

  const chip = (v) => `<button data-chip="${v}" class="${last === v ? 'on' : ''}">${v}</button>`;

  return `
  <div class="card">
    <h2>${esc(L.gradeName)} · ${nf(L.Cact, 0)} kg ${t('Cement').toLowerCase()}</h2>
    <div class="stat hero" style="border-bottom:none;padding-top:0"><span class="k">${t('Pour now')}</span><span class="v"><span>${nf(L.nextAdd || 0, 1)}</span><span class="unit">L</span></span></div>
    <div style="margin-top:2px">${guidance}</div>
    <div class="stat" style="margin-top:10px"><span class="k">${t('Water')} ${LANG === 'id' ? 'di drum' : 'in drum'}</span><span class="v sm">${nf(L.poured, 1)} L</span></div>
    <div class="stat"><span class="k">${t('Water ceiling')} ${infoBtn('ceil')}</span><span class="v sm">${nf(L.ceilingNet, 1)} L</span></div>
    ${infoNote('ceil')}
  </div>

  <div class="card">
    <h2>${t('Record slump')}</h2>
    <label class="field" style="margin-bottom:0"><span class="lbl">${t('Slump')} (cm)</span>
      <input type="number" inputmode="decimal" step="0.5" min="0" max="30" id="slumpIn" value="${last == null ? '' : last}" placeholder="—" style="font-size:30px"></label>
    <div class="quick" style="grid-template-columns:repeat(3,1fr)">${[4, 6, 8, 10, 12, 14].map(chip).join('')}</div>
    <button class="primary wide" data-action="slump-rec">${t('Record slump')}</button>
    <div class="row" style="margin-top:10px">
      <button class="dark" data-action="slump-finish">${t('Finish batch')}</button>
      <button class="small" data-action="slump-note">${t('Notes')}</button>
    </div>
    <button class="small wide" style="margin-top:10px" data-action="slump-cancel">${t('Cancel batch')}</button>
    <div style="margin-top:12px">${adds}</div>
  </div>`;
}

/* ---- Diary ---- */
function viewDiary() {
  const rows = S.log.slice().reverse();
  const isEmpty = !rows.length;
  return `
  <div class="card">
    <h2>${t('Diary')} <span class="sub">${S.log.length} ${t('Batches').toLowerCase()}</span></h2>
    <div class="row">
      <button class="small" data-action="csv">${t('Export CSV')}</button>
      <button class="small" data-action="backup">${t('Export backup')}</button>
    </div>
    <div class="row" style="margin-top:8px">
      <label class="small" style="display:block"><input type="file" id="importFile" accept="application/json" style="display:none">
        <button class="small wide" data-action="import">${t('Import backup')}</button></label>
    </div>
  </div>
  ${isEmpty ? `<div class="card center fine">${t('No batches logged yet.')}</div>` : ''}
  <div class="list">
  ${rows.map((e) => `
    <div class="item">
      <div class="t">${esc(e.gradeName)} · ${nf(e.Cact, 0)} kg ${t('Cement').toLowerCase()}</div>
      <div class="m">${new Date(e.ts).toLocaleString()} · ${nf(e.waterUsed, 1)} L ${t('Water').toLowerCase()} (${nf(e.wcActual, 3)} w/c) · slump ${e.finalSlump ?? '—'} cm · ${nf(e.vol, 3)} m³${e.spL > 0 ? ' · SP ' + nf(e.spL * 1000, 0) + ' mL' : ''}</div>
      <div class="m">${t('Sand')} ${nf(e.wetSand, 1)} kg${e.bucketSand ? ' (' + e.bucketSand + ' ' + t('buckets') + ')' : ''} · ${t('Gravel')} ${nf(e.wetGrav, 1)} kg${e.bucketGrav ? ' (' + e.bucketGrav + ' ' + t('buckets') + ')' : ''}${e.mS != null ? ' · ' + t('Moisture').toLowerCase() + ' ' + (e.mS * 100).toFixed(1) + '%' : ''}</div>
      <div class="m">${t('Strength estimate')}: ${nf(e.strengthEst, 1)} MPa ≈ K${Math.round(e.strengthEst * 10.197)}${e.costPerM3 ? ' · Rp ' + nf(e.costPerM3, 0) + '/m³' : ''}</div>
      ${e.notes ? `<div class="m">📝 ${esc(e.notes)}</div>` : ''}
      <div class="row" style="margin-top:8px">
        <label class="field" style="margin:0"><span class="lbl">${t('7 days')} (MPa)</span><input type="number" inputmode="decimal" step="0.1" placeholder="—" value="${e.d7 ?? ''}" data-cube="d7" data-id="${e.id}"></label>
        <label class="field" style="margin:0"><span class="lbl">${t('28 days')} (MPa)</span><input type="number" inputmode="decimal" step="0.1" placeholder="—" value="${e.d28 ?? ''}" data-cube="d28" data-id="${e.id}"></label>
      </div>
      <div class="acts"><button class="xs" data-action="del" data-id="${e.id}">${t('Delete')}</button></div>
    </div>`).join('')}
  </div>`;
}

/* ---- Grades ---- */
function viewGrades() {
  return `<div class="card">
    <h2>${t('Grade table')} <span class="sub">${t('per kg cement')}</span></h2>
    ${S.grades.map((g) => {
      const c = perM3(g), f = strengthMPa(g.wc);
      return `<details class="item" data-gid="${g.id}" ${openGrades.has(g.id) ? 'open' : ''} style="margin-bottom:10px">
        <summary style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;padding:2px 0">
          <span style="font-size:16px;color:var(--ink)">${esc(g.name)}</span>
          <span class="fine" style="white-space:nowrap">${nf(c.C, 0)} kg/m³ · K${Math.round(f * 10.197)}</span>
        </summary>
        <div style="margin-top:10px">
          <label class="field" style="margin:0 0 8px"><span class="lbl">${t('Recipe name')}</span>
            <input type="text" value="${esc(g.name)}" data-grade="${g.id}" data-gf="name"></label>
          <div class="row3">
            <label class="field" style="margin:0"><span class="lbl">${t('Sand ratio')}</span><input type="number" step="0.01" value="${g.sand}" data-grade="${g.id}" data-gf="sand" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">${t('Gravel ratio')}</span><input type="number" step="0.01" value="${g.gravel}" data-grade="${g.id}" data-gf="gravel" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">w/c</span><input type="number" step="0.005" value="${g.wc}" data-grade="${g.id}" data-gf="wc" data-num="1"></label>
          </div>
          <div class="row3" style="margin-top:8px">
            <label class="field" style="margin:0"><span class="lbl">SP % ${LANG === 'id' ? 'semen' : 'cement'}</span><input type="number" step="0.01" min="0" value="${g.sp || 0}" data-grade="${g.id}" data-gf="sp" data-num="1"></label>
            <label class="field" style="margin:0"><span class="lbl">${t('Source')}</span>
              <select data-grade="${g.id}" data-gf="source">
                <option value="site" ${g.source === 'site' ? 'selected' : ''}>${t('Site mix')}</option>
                <option value="rmx" ${g.source === 'rmx' ? 'selected' : ''}>${t('Jayamix design')}</option>
              </select></label>
            <div style="display:flex;align-items:flex-end"><button class="xs wide" style="color:var(--danger)" data-action="grade-del" data-id="${g.id}">${t('Delete')}</button></div>
          </div>
          <div class="fine" style="margin-top:8px">${t('Cement content')} ≈ ${nf(c.C, 0)} kg/m³ · ${t('Strength (MPa)')} ≈ ${nf(f, 1)} MPa ≈ K${Math.round(f * 10.197)}</div>
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
        <td>${esc(r.g.name)}${(r.g.sp || 0) > 0 ? ' <span class="fine">+SP</span>' : ''}</td>
        <td>${nf(r.c.C, 0)}</td>
        <td class="big">${anyPrice() ? nf(r.c.cost, 0) : '—'}</td></tr>`).join('')}
    </table>
    ${notes}
  </div>

  <div class="card">
    <h2>${t('Cost per batch')} <span class="sub">${esc(s.g.name)}</span></h2>
    <div class="stat hero"><span class="k">${LANG === 'id' ? 'Biaya campuran ini' : 'This batch'}</span><span class="v">${batchCost ? money(batchCost) : '—'}</span></div>
    <div class="stat"><span class="k">${t('Batch volume')}</span><span class="v sm">${nf(s.vol, 3)} m³</span></div>
    ${batchCost ? `<div class="stat"><span class="k">${t('Cost per m3')}</span><span class="v sm">${money(batchCost / s.vol)}</span></div>` : ''}
    ${batchCost && rmx ? `<div class="stat"><span class="k">${LANG === 'id' ? 'Hemat vs readymix' : 'Saved vs readymix'}</span><span class="v sm" style="color:var(--ok)">${money(rmx - batchCost / s.vol)} /m³</span></div>` : ''}
  </div>`;
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
    <div class="row">
      <label class="field"><span class="lbl">${t('Target slump')} (cm)</span><input type="number" step="1" data-bind="targetSlump" data-num="1" value="${S.targetSlump}"></label>
      <label class="field"><span class="lbl">${t('Slump band')} (±cm)</span><input type="number" step="0.5" data-bind="band" data-num="1" value="${S.band}"></label>
    </div>
    <div class="row">
      <label class="field"><span class="lbl">${t('Start water %')}</span><input type="number" step="5" data-bind="startWaterPct" data-num="1" value="${S.startWaterPct}"></label>
      <label class="field"><span class="lbl">${t('Water per cm, per m3')} ${infoBtn('k')}</span><input type="number" step="0.1" min="0.2" data-bind="kPerM3PerCm" data-num="1" value="${S.kPerM3PerCm}"><span class="hint">L/m³ ${LANG === 'id' ? 'per cm' : 'per cm'}</span></label>
    </div>
    ${infoNote('k')}
    <div class="row" style="margin-top:10px">
      <label class="field" style="margin:0"><span class="lbl">${t('Superplasticizer max dose')} ${infoBtn('spmax')}</span>
        <input type="number" step="0.1" min="0" max="5" data-bind="spMaxPct" data-num="1" value="${S.spMaxPct}">
        <span class="hint">% ${LANG === 'id' ? 'dari berat semen' : 'of cement weight'}</span></label>
      <label class="field" style="margin:0"><span class="lbl">${t('SP density')}</span>
        <input type="number" step="0.01" min="0.8" max="1.4" data-bind="spDensity" data-num="1" value="${S.spDensity}">
        <span class="hint">kg/L</span></label>
    </div>
    ${infoNote('spmax')}
    <div class="note info">${t('Strength estimate')}: ${nf(strengthMPa(0.50), 1)} MPa @ w/c 0.50 (${S.cementType})${A ? `<br>${LANG === 'id' ? 'Dari kubus Anda' : 'From your cubes'}: A ≈ ${nf(A, 0)} (${LANG === 'id' ? 'model default' : 'default model'} ${STRENGTH.A[S.cementType]})` : ''}</div>
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
    ts: Date.now(), gradeId: s.g.id, gradeName: s.g.name, g: { sand: s.g.sand, gravel: s.g.gravel, wc: s.g.wc, sp: s.g.sp || 0, key: s.g.key },
    sack: s.sack, n: s.n, Cnom: s.Cnom, Cact: s.Cact, wc: s.g.wc,
    sandSSD: s.sandSSD, gravSSD: s.gravSSD, wetSand: s.wetSand, wetGrav: s.wetGrav,
    waterCorrected: s.waterCorrected, ceilingNet: s.ceilingNet, vol: s.vol, spL: s.spL,
    mS: s.mS, mG: s.mG, creditS: s.creditS, creditG: s.creditG,
    bucketSand: s.bucketSand, bucketGrav: s.bucketGrav, bS: s.bS, bG: s.bG,
    poured: 0, nextAdd: s.startWater, adds: [], slumps: [], notes: '', bufferPct: +S.bufferPct || 0
  };
  save(); screen = 'Slump'; render();
}

/* Single source of truth for "how much water next" — used by the view and the recorder. */
function nextWater(L, slump) {
  const target = +S.targetSlump, band = +S.band;
  if (slump == null || slump >= target - band) return 0;
  const kL = (+S.kPerM3PerCm || 2.4) * L.vol;
  const cap = Math.min(2, Math.max(0.5, 0.08 * Math.max(1, L.waterCorrected)));
  let add = clamp(kL * (target - slump), 0.1, cap);
  if (L.poured + add > L.ceilingNet) add = Math.max(0, L.ceilingNet - L.poured);
  return add < 0.1 ? 0 : add;
}

function recordSlump() {
  const L = S.live; if (!L) return;
  const v = parseFloat($('#slumpIn').value);
  if (!isFinite(v) || v < 0) { toast(LANG === 'id' ? 'Isi angka slump' : 'Enter a slump value'); return; }
  L.slumps.push({ v, t: Date.now() });
  L.poured += L.nextAdd || 0;
  if (L.nextAdd) { L.adds.push({ L: L.nextAdd, slump: v }); }
  const target = +S.targetSlump, band = +S.band;
  // compute next suggestion
  L.nextAdd = nextWater(L, v);
  save(); render();
}

function finishBatch() {
  const L = S.live; if (!L) return;
  const slumpInput = $('#slumpIn');
  const typed = slumpInput && slumpInput.value !== '' ? parseFloat(slumpInput.value) : null;
  if (isFinite(typed) && typed > 0 && (!L.slumps.length || L.slumps[L.slumps.length - 1].v !== typed)) {
    L.slumps.push({ v: typed, t: Date.now() });
  }
  // assume the last instructed water was poured before this reading
  if (L.nextAdd > 0) { L.poured += L.nextAdd; L.nextAdd = 0; }
  const finalSlump = L.slumps.length ? L.slumps[L.slumps.length - 1].v : null;
  const total = L.poured;                                   // water poured into the drum
  const totalWater = total + (L.creditS || 0) + (L.creditG || 0);   // + free water in aggregates
  const wcActual = L.Cact > 0 ? totalWater / L.Cact : 0;
  const entry = {
    id: 'b' + Date.now(), ts: L.ts, gradeName: L.gradeName, source: L.g.source || '',
    cementType: S.cementType, sack: L.sack, n: L.n, Cnom: L.Cnom, Cact: L.Cact, bufferPct: L.bufferPct,
    wetSand: L.wetSand, wetGrav: L.wetGrav, mS: L.mS, mG: L.mG, creditS: L.creditS, creditG: L.creditG,
    waterDesign: L.g.wc * L.Cnom, waterUsed: total, totalWater, wcActual, ceilingNet: L.ceilingNet,
    finalSlump, adds: L.adds.slice(), slumps: L.slumps.slice(), spL: L.spL, vol: L.vol,
    bucketSand: L.bucketSand == null ? null : Math.floor(L.bucketSand),
    bucketGrav: L.bucketGrav == null ? null : Math.floor(L.bucketGrav),
    strengthEst: strengthMPa(wcActual), notes: L.notes || '', d7: null, d28: null,
    costPerM3: anyPrice() ? costOf({ sand: L.g.sand, gravel: L.g.gravel, wc: L.g.wc, sp: L.g.sp || 0, key: L.g.key }).cost : null
  };
  S.log.push(entry);
  // learn k from the last successful addition (L per cm per m3)
  if (L.adds.length >= 1 && L.slumps.length >= 2) {
    const a = L.adds[L.adds.length - 1];
    const prev = L.slumps[L.slumps.length - 2].v;
    if (a.L > 0 && a.slump > 0 && prev != null && a.slump > prev) {
      const kMeas = a.L / ((a.slump - prev) * L.vol);
      S.kPerM3PerCm = clamp(0.7 * (+S.kPerM3PerCm) + 0.3 * kMeas, (+S.kPerM3PerCm) * 0.8, (+S.kPerM3PerCm) * 1.2);
    }
  }
  S.live = null; save(); screen = 'Diary'; render();
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
    'waterDesign', 'waterUsed', 'wcActual', 'finalSlump', 'spL', 'vol', 'bucketSand', 'bucketGrav', 'strengthEst', 'd7', 'd28', 'costPerM3', 'notes', 'adds'];
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

/* ------------------------------------------------------------- handlers -- */
document.addEventListener('click', (ev) => {
  const nav = ev.target.closest('[data-nav]');
  if (nav) { screen = nav.dataset.nav; render(); return; }
  const chip = ev.target.closest('[data-chip]');
  if (chip) {
    const i = $('#slumpIn');
    if (i) i.value = chip.dataset.chip;
    $$('.quick button').forEach((b) => b.classList.remove('on'));
    chip.classList.add('on');
    return;
  }
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
  if (act === 'slump-rec') return recordSlump();
  if (act === 'slump-finish') return finishBatch();
  if (act === 'slump-cancel') { S.live = null; save(); screen = 'Batch'; return render(); }
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
  if (act === 'grade-add') {
    const id = 'g' + Date.now();
    S.grades.push({ id, key: 'K' + (300 + S.grades.length), name: 'K??? — new', source: 'site', sand: 1.8, gravel: 2.75, wc: 0.5, sp: 0 });
    S.gradeId = id; save(); return render();
  }
  if (act === 'grade-del') {
    if (S.grades.length <= 1) return;
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
  if (el.dataset.gf || el.dataset.bind) {
    // full re-render for selects / committed values so derived cards refresh
    if (el.tagName === 'SELECT') render();
    else if (screen === 'Grades' || screen === 'Calibration' || screen === 'Cost' || screen === 'Settings') render();
    else if (screen === 'Batch') syncBatch();
  }
});

/* --------------------------------------------------------------- boot ---- */
document.addEventListener('toggle', (ev) => {
  const d = ev.target.closest && ev.target.closest('details[data-gid]');
  if (!d) return;
  if (d.open) openGrades.add(d.dataset.gid); else openGrades.delete(d.dataset.gid);
}, true);

$('#btnLang').addEventListener('click', () => {
  S.lang = S.lang === 'en' ? 'id' : 'en'; save(); render();
});

load();
LANG = S.lang || 'en';
render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
