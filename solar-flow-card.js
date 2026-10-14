/*!
 * Solar Flow Card for Home Assistant
 * https://github.com/gratak/solar-flow-card
 * MIT License. The data layer started from the Energy Flow card of
 * hass-deyecloud by Trần Công Tuấn Anh (MIT).
 *
 * Built from src/*.js by scripts/build.mjs. Edit the sources, not this file.
 */
(() => {
const CARD_VERSION = "1.0.0";
const CARD_TAG = "solar-flow-card";
const EDITOR_TAG = "solar-flow-card-editor";
const THEMES = ["diorama", "aurora", "paper", "lcars", "atlantis"];
const PERIODS = ["today", "3d", "7d", "month", "all"];
// A flow below this many watts counts as idle.
const ACTIVE_W = 5;


const STRINGS = {
  en: {
    locale: "en-GB",
    currency: "€",
    hourShort: "h",
    minShort: "min",
    dayShort: "d",
    defaultTitle: "Home energy",
    live: "Live",
    delayed: "Delayed",
    offline: "Offline",
    solar: "Solar",
    battery: "Battery",
    grid: "Grid",
    home: "Home",
    inverter: "Inverter",
    generating: "Generating",
    idle: "Idle",
    charging: "Charging",
    discharging: "Discharging",
    importing: "Importing",
    exporting: "Exporting",
    balanced: "Balanced",
    fromRoof: "from the roof",
    inHome: "in the home",
    periodToday: "Today",
    period3d: "Last 3 days",
    period7d: "Last 7 days",
    periodMonth: "This month",
    periodAll: "All time",
    periodMonthShort: "Month",
    periodAllShort: "All",
    since: "since {date}",
    energy: "Energy",
    pvProduction: "PV production",
    consumption: "Consumption",
    gridImport: "Grid import",
    gridExport: "Grid export",
    batteryCharge: "Battery charge",
    batteryDischarge: "Battery discharge",
    autarky: "Autarky",
    selfUse: "Self-consumption",
    savings: "Savings",
    co2: "CO₂ avoided",
    specificYield: "Yield",
    legendPv: "PV",
    legendLoad: "Home",
    legendBattery: "Battery",
    legendGrid: "Grid",
    legendSoc: "SOC",
    chartLoading: "Loading history…",
    chartEmpty: "No history for this period yet",
    chartError: "History is not available",
    chartPowerHint: "Battery: up = discharging · Grid: up = import",
    batteryForecast: "Battery forecast",
    fullIn: "Full in {d}",
    fullAt: "about {time}",
    lastsFor: "Lasts {d}",
    lastsUntil: "until about {time} (to {soc}%)",
    holding: "Holding steady",
    storedOf: "{kwh} of {cap}",
    inverterDetails: "Inverter details",
    pvStrings: "PV strings",
    stringN: "String {n}",
    temperatures: "Temperatures",
    batteryDetails: "Battery",
    gridDetails: "Grid",
    noDetails: "The inverter reports no matching measurements.",
    close: "Close",
    panelsTitle: "Panels",
    panelsHint: "Production today",
    panelAvg: "Average {kwh} per panel",
    panelWeak: "Weakest: {name} at {pct}% of the median",
    panelsEven: "All panels within 15% of the median",
    stringModules: "String {n} · {count} modules",
    paperHeadline: "{power} to the home",
    paperShares: "The sun covers {pv}%, the battery {bat}% and the grid {grid}%.",
    paperSunOnly: "The sun covers everything right now.",
    paperLasts: "At this rate the battery lasts until {time}.",
    paperFull: "The battery will be full around {time}.",
    paperExport: "{power} goes out to the grid.",
    paperDay: "The day so far",
    lcarsTitle: "Power · {name}",
    lcarsPvIn: "PV in",
    lcarsBatIn: "Bat in",
    lcarsBatOut: "Bat out",
    lcarsGridIn: "Grid in",
    lcarsGridOut: "Grid out",
    lcarsHome: "Home",
    lcarsPanels: "Panels",
    stored: "Stored",
    autonomy: "Autonomy until",
    stateOfCharge: "Charge",
    autarkyToday: "Autarky today",
    statusNominal: "Status: nominal",
    statusWarn: "Status: caution",
    statusAlert: "Status: alert",
    coreTitle: "Power core",
    sector: "Sector",
    supplying: "Supplying",
    absorbing: "Absorbing",
    sun: "Sun",
    chipRoof: "Today from the roof",
    chipLasts: "Lasts until",
    chipFull: "Full at",
    chipStored: "Stored",
    chipHome: "Used today",
    whereFrom: "Where today's power came from",
    noData: "No energy sensors found",
    noDataHelp: "Install the DeyeCloud integration or set the entities in the card configuration.",
    editorTheme: "Theme",
    themeNames: { diorama: "Diorama", aurora: "Aurora", paper: "Paper", lcars: "LCARS", atlantis: "Atlantis" },
    editorTitle: "Title",
    editorStation: "DeyeCloud station",
    auto: "Automatic",
    editorBatteryCapacity: "Battery capacity (kWh)",
    editorBatteryMinSoc: "Battery reserve (%)",
    editorPvCapacity: "PV size (kWp)",
    editorPvPanels: "Number of panels",
    editorPriceImport: "Import price per kWh",
    editorPriceExport: "Export price per kWh",
    editorCurrency: "Currency",
    editorCo2: "Grid CO₂ (kg per kWh)",
    editorShowEnergy: "Show energy",
    editorShowChart: "Show chart",
    editorShowForecast: "Show battery forecast",
    editorShowPanels: "Show panels",
    editorAnimation: "Animations",
    editorFonts: "Load theme fonts (Google Fonts)",
    editorHint: "DeyeCloud sensors are found automatically. Other inverters: set the entities in YAML (see README).",
  },
  pl: {
    locale: "pl-PL",
    currency: "zł",
    defaultTitle: "Energia w domu",
    live: "Na żywo",
    delayed: "Opóźnione",
    offline: "Brak danych",
    solar: "Panele PV",
    battery: "Magazyn",
    grid: "Sieć",
    home: "Dom",
    inverter: "Falownik",
    generating: "Produkcja",
    idle: "Bezczynny",
    charging: "Ładowanie",
    discharging: "Rozładowanie",
    importing: "Pobór",
    exporting: "Oddawanie",
    balanced: "Zbalansowana",
    fromRoof: "z dachu",
    inHome: "w domu",
    periodToday: "Dziś",
    period3d: "Ostatnie 3 dni",
    period7d: "Ostatnie 7 dni",
    periodMonth: "Ten miesiąc",
    periodAll: "Cały okres",
    periodMonthShort: "Miesiąc",
    periodAllShort: "Wszystko",
    since: "od {date}",
    energy: "Energia",
    pvProduction: "Produkcja PV",
    consumption: "Zużycie",
    gridImport: "Pobór z sieci",
    gridExport: "Oddanie do sieci",
    batteryCharge: "Ładowanie magazynu",
    batteryDischarge: "Rozładowanie magazynu",
    autarky: "Autarkia",
    selfUse: "Autokonsumpcja",
    savings: "Oszczędność",
    co2: "Uniknięte CO₂",
    specificYield: "Uzysk",
    legendLoad: "Dom",
    legendBattery: "Magazyn",
    legendGrid: "Sieć",
    chartLoading: "Wczytywanie historii…",
    chartEmpty: "Brak historii dla tego okresu",
    chartError: "Historia jest niedostępna",
    chartPowerHint: "Magazyn: w górę = rozładowanie · Sieć: w górę = pobór",
    batteryForecast: "Prognoza magazynu",
    fullIn: "Pełny za {d}",
    fullAt: "ok. {time}",
    lastsFor: "Wystarczy na {d}",
    lastsUntil: "do ok. {time} (do {soc}%)",
    holding: "Bez zmian",
    storedOf: "{kwh} z {cap}",
    inverterDetails: "Szczegóły falownika",
    pvStrings: "Stringi PV",
    temperatures: "Temperatury",
    batteryDetails: "Magazyn",
    gridDetails: "Sieć",
    noDetails: "Falownik nie raportuje pasujących pomiarów.",
    close: "Zamknij",
    panelsTitle: "Panele",
    panelsHint: "Produkcja dziś",
    panelAvg: "Średnio {kwh} na panel",
    panelWeak: "Najsłabszy: {name}, {pct}% mediany",
    panelsEven: "Wszystkie panele w granicach 15% mediany",
    stringModules: "String {n} · {count} modułów",
    paperHeadline: "{power} do domu",
    paperShares: "Słońce daje {pv}%, magazyn {bat}%, sieć {grid}%.",
    paperSunOnly: "Teraz wszystko pokrywa słońce.",
    paperLasts: "Przy tym tempie magazyn wystarczy do {time}.",
    paperFull: "Magazyn naładuje się ok. {time}.",
    paperExport: "Do sieci płynie {power}.",
    paperDay: "Przebieg dnia",
    lcarsTitle: "Zasilanie · {name}",
    lcarsPvIn: "PV wej",
    lcarsBatIn: "Mag wej",
    lcarsBatOut: "Mag wyj",
    lcarsGridIn: "Sieć wej",
    lcarsGridOut: "Sieć wyj",
    lcarsHome: "Dom pob",
    lcarsPanels: "Panele",
    stored: "Zapas",
    autonomy: "Autonomia do",
    stateOfCharge: "Stan magazynu",
    autarkyToday: "Autarkia doby",
    statusNominal: "Status: nominalny",
    statusWarn: "Status: uwaga",
    statusAlert: "Status: alarm",
    coreTitle: "Rdzeń zasilania",
    sector: "Sektor",
    supplying: "Oddaje",
    absorbing: "Pobiera",
    sun: "Słońce",
    chipRoof: "Dziś z dachu",
    chipLasts: "Wystarczy do",
    chipFull: "Pełny o",
    chipStored: "W magazynie",
    chipHome: "Zużycie dziś",
    whereFrom: "Skąd dziś prąd w domu",
    noData: "Nie znaleziono czujników energii",
    noDataHelp: "Zainstaluj integrację DeyeCloud albo wskaż encje w konfiguracji karty.",
    editorTheme: "Motyw",
    themeNames: { diorama: "Diorama", aurora: "Aurora", paper: "Papier", lcars: "LCARS", atlantis: "Atlantis" },
    editorTitle: "Tytuł",
    editorStation: "Instalacja DeyeCloud",
    auto: "Automatycznie",
    editorBatteryCapacity: "Pojemność magazynu (kWh)",
    editorBatteryMinSoc: "Rezerwa magazynu (%)",
    editorPvCapacity: "Moc instalacji PV (kWp)",
    editorPvPanels: "Liczba paneli",
    editorPriceImport: "Cena zakupu za kWh",
    editorPriceExport: "Cena sprzedaży za kWh",
    editorCurrency: "Waluta",
    editorCo2: "CO₂ sieci (kg na kWh)",
    editorShowEnergy: "Pokaż energię",
    editorShowChart: "Pokaż wykres",
    editorShowForecast: "Pokaż prognozę magazynu",
    editorShowPanels: "Pokaż panele",
    editorAnimation: "Animacje",
    editorFonts: "Wczytuj czcionki motywu (Google Fonts)",
    editorHint: "Czujniki DeyeCloud są wykrywane automatycznie. Inne falowniki: wskaż encje w YAML (patrz README).",
  },
};

function languageOf(hass, config) {
  const wanted = String(config?.language || hass?.locale?.language || hass?.language || navigator.language || "en")
    .toLowerCase()
    .split(/[-_]/)[0];
  return STRINGS[wanted] ? wanted : "en";
}

function stringsFor(language) {
  return { ...STRINGS.en, ...STRINGS[language] };
}

function fill(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stateNumber(stateObj) {
  if (!stateObj || ["unknown", "unavailable", "none", ""].includes(stateObj.state)) return null;
  const value = Number.parseFloat(stateObj.state);
  return Number.isFinite(value) ? value : null;
}

function stateUnit(stateObj) {
  return stateObj?.attributes?.unit_of_measurement || "";
}

function positiveNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function isNum(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value, locale, digits = 1) {
  return value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatPower(value, locale) {
  if (!isNum(value)) return "—";
  const absolute = Math.abs(value);
  if (absolute >= 1000) return `${formatNumber(value / 1000, locale, absolute >= 10000 ? 1 : 2)} kW`;
  return `${Math.round(value).toLocaleString(locale)} W`;
}

// Value and unit split, for themes that style them separately.
function powerParts(value, locale) {
  if (!isNum(value)) return ["—", ""];
  const absolute = Math.abs(value);
  if (absolute >= 1000) return [formatNumber(value / 1000, locale, absolute >= 10000 ? 1 : 2), "kW"];
  return [Math.round(value).toLocaleString(locale), "W"];
}

function formatEnergy(value, locale) {
  if (!isNum(value)) return "—";
  return `${formatNumber(value, locale, Math.abs(value) < 10 ? 2 : Math.abs(value) < 1000 ? 1 : 0)} kWh`;
}

function formatPercent(value, locale) {
  if (!isNum(value)) return "—";
  return `${Math.round(value).toLocaleString(locale)}%`;
}

function formatClock(date, locale) {
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(hours, t) {
  const minutes = Math.max(1, Math.round(hours * 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 48) return `${Math.round(h / 24)} ${t.dayShort}`;
  return h ? `${h} ${t.hourShort} ${m} ${t.minShort}` : `${m} ${t.minShort}`;
}

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(date, days) {
  const day = new Date(date);
  day.setDate(day.getDate() + days);
  return day;
}

function niceStep(range, ticks) {
  const raw = Math.max(range, 1e-9) / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  return (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
}

// history/history_during_period rows: compressed {s, lu (seconds)} or full
// {state, last_updated}.
function historyPoints(rows) {
  const points = [];
  for (const row of rows || []) {
    const time = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated || row.last_changed);
    const value = Number.parseFloat(row.s ?? row.state);
    if (Number.isFinite(time) && Number.isFinite(value)) points.push([time, value]);
  }
  return points;
}

// Average of the samples in each bucket; a bucket without samples keeps the
// last known value (the recorder only stores changes). Buckets after nowMs
// stay null so today's chart ends at the current time.
function bucketHistory(points, startMs, count, bucketMs, nowMs) {
  const out = new Array(count).fill(null);
  let index = 0;
  let last = null;
  for (let bucket = 0; bucket < count; bucket++) {
    const from = startMs + bucket * bucketMs;
    if (from > nowMs) break;
    const to = from + bucketMs;
    let sum = 0;
    let samples = 0;
    while (index < points.length && points[index][0] < to) {
      if (points[index][0] >= from) {
        sum += points[index][1];
        samples += 1;
      }
      last = points[index][1];
      index += 1;
    }
    out[bucket] = samples ? sum / samples : last;
  }
  return out;
}

function combineSeries(a, b, combine) {
  if (!a || !b) return null;
  return a.map((value, i) => (value === null || b[i] === null ? null : combine(value, b[i])));
}

function linePath(values, x, y) {
  let path = "";
  let open = false;
  values.forEach((value, i) => {
    if (value === null || value === undefined) {
      open = false;
      return;
    }
    path += `${open ? "L" : "M"}${x(i).toFixed(1)} ${y(value).toFixed(1)}`;
    open = true;
  });
  return path;
}

function areaPath(values, x, y, base) {
  let path = "";
  let run = [];
  const flush = () => {
    if (run.length) {
      path += `M${x(run[0]).toFixed(1)} ${base.toFixed(1)}`;
      run.forEach((i) => { path += `L${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`; });
      path += `L${x(run[run.length - 1]).toFixed(1)} ${base.toFixed(1)}Z`;
    }
    run = [];
  };
  values.forEach((value, i) => {
    if (value === null || value === undefined) flush();
    else run.push(i);
  });
  flush();
  return path;
}

function statStart(value) {
  return typeof value === "number" ? value : Date.parse(value);
}

const THEME_FONTS = {
  diorama: "Nunito:wght@600;700;800",
  aurora: "Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700",
  paper: "Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600",
  lcars: "Antonio:wght@400;600;700",
  atlantis: "Exo+2:wght@200;300;500;700",
};

// Fonts declared inside a shadow root are ignored, so add the theme's font
// stylesheet to the document once.
function ensureThemeFonts(theme) {
  const id = `solar-flow-card-font-${theme}`;
  if (!THEME_FONTS[theme] || document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${THEME_FONTS[theme]}&display=swap`;
  document.head.appendChild(link);
}


// Live power sensors. `key` is the card option under `entities:`, `deye` the
// DeyeCloud metric_key used for automatic discovery.
const LIVE_METRICS = {
  solar: { key: "solar_power", deye: "generationPower" },
  load: { key: "load_power", deye: "consumptionPower" },
  gridImport: { key: "grid_import_power", deye: "purchasePower" },
  gridExport: { key: "grid_export_power", deye: "gridPower" },
  grid: { key: "grid_power" },
  battery: { key: "battery_power", deye: "batteryPower" },
  charge: { key: "battery_charge_power", deye: "chargePower" },
  discharge: { key: "battery_discharge_power", deye: "dischargePower" },
  soc: { key: "battery_soc", deye: "batterySOC" },
};

// Daily energy sensors (reset at midnight, state_class total_increasing).
const ENERGY_METRICS = {
  solar: { key: "solar_energy", deye: "generationValue" },
  load: { key: "load_energy", deye: "consumptionValue" },
  gridImport: { key: "grid_import_energy", deye: "purchaseValue" },
  gridExport: { key: "grid_export_energy", deye: "gridValue" },
  charge: { key: "battery_charge_energy", deye: "chargeValue" },
  discharge: { key: "battery_discharge_energy", deye: "dischargeValue" },
};
const ENERGY_ORDER = ["solar", "load", "gridImport", "gridExport", "charge", "discharge"];

function deyeStations(hass) {
  const ids = new Set();
  for (const stateObj of Object.values(hass?.states || {})) {
    const attrs = stateObj?.attributes || {};
    if (attrs.sensor_type && attrs.station_id !== undefined && attrs.station_id !== null) ids.add(String(attrs.station_id));
  }
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function resolveEntities(hass, config) {
  const states = hass?.states || {};
  const stations = deyeStations(hass);
  const station = config.station_id ? String(config.station_id) : stations[0] || null;
  const candidates = station === null
    ? []
    : Object.entries(states).filter(([, s]) => String(s?.attributes?.station_id) === station);
  const pick = (entityId) => (entityId && states[entityId] ? { entityId, stateObj: states[entityId] } : null);
  const find = (test) => {
    const match = candidates.find(([, s]) => test(s.attributes || {}));
    return match ? { entityId: match[0], stateObj: match[1] } : null;
  };
  const configured = config.entities || {};
  const live = {};
  for (const [name, def] of Object.entries(LIVE_METRICS)) {
    live[name] = pick(configured[def.key])
      || (def.deye ? find((a) => a.sensor_type === "station_latest" && a.metric_key === def.deye) : null);
  }
  const energy = {};
  for (const [name, def] of Object.entries(ENERGY_METRICS)) {
    energy[name] = pick(configured[def.key])
      || find((a) => a.sensor_type === "daily" && a.metric_key === def.deye && a.relative_day === "today");
  }
  const named = candidates.find(([, s]) => s.attributes?.station_name);
  return {
    station,
    stations,
    candidates,
    live,
    energy,
    name: config.title || named?.[1].attributes.station_name || null,
  };
}

function hasAnyEntity(resolved) {
  return Object.values(resolved.live).some(Boolean) || Object.values(resolved.energy).some(Boolean);
}

// Live power in W. Battery and grid are also given as signed values:
// battery > 0 discharging into the home, grid > 0 importing.
function liveValues(resolved, config) {
  const value = (entry) => stateNumber(entry?.stateObj);
  const positive = (entry) => Math.max(0, value(entry) ?? 0);
  const { live } = resolved;
  let charge = positive(live.charge);
  let discharge = positive(live.discharge);
  // DeyeCloud often leaves charge/discharge at 0 and only reports the signed
  // battery power: negative while charging, positive while discharging.
  const signedBattery = value(live.battery);
  if (charge <= ACTIVE_W && discharge <= ACTIVE_W && signedBattery !== null) {
    const battery = signedBattery * (config.invert_battery ? -1 : 1);
    if (battery < 0) charge = -battery;
    else discharge = battery;
  }
  let gridImport = positive(live.gridImport);
  let gridExport = positive(live.gridExport);
  const signedGrid = value(live.grid);
  if (gridImport <= ACTIVE_W && gridExport <= ACTIVE_W && signedGrid !== null) {
    const grid = signedGrid * (config.invert_grid ? -1 : 1);
    if (grid > 0) gridImport = grid;
    else gridExport = -grid;
  }
  const solar = positive(live.solar);
  const load = positive(live.load);
  return {
    solar,
    load,
    charge,
    discharge,
    gridImport,
    gridExport,
    battery: discharge - charge,
    grid: gridImport - gridExport,
    soc: value(live.soc),
    solarActive: solar > ACTIVE_W,
    loadActive: load > ACTIVE_W,
    chargeActive: charge > ACTIVE_W,
    dischargeActive: discharge > ACTIVE_W,
    importActive: gridImport > ACTIVE_W,
    exportActive: gridExport > ACTIVE_W,
  };
}

function liveStatus(resolved) {
  const dates = Object.values(resolved.live)
    .map((entry) => entry?.stateObj?.last_updated || entry?.stateObj?.last_changed)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  const available = Object.values(resolved.live).some((entry) => stateNumber(entry?.stateObj) !== null);
  if (!available || !dates.length) return { state: "offline", at: null };
  const at = new Date(Math.max(...dates));
  return { state: Date.now() - at.getTime() <= 3 * 60 * 1000 ? "live" : "delayed", at };
}

function todayEnergy(resolved) {
  const values = {};
  for (const name of ENERGY_ORDER) values[name] = stateNumber(resolved.energy[name]?.stateObj);
  return values;
}

// Long-term statistics query for a period other than today.
function statsSpec(period) {
  const now = new Date();
  if (period === "3d") return { period, start: startOfDay(addDays(now, -2)), statPeriod: "day", ttl: 15 * 60000 };
  if (period === "7d") return { period, start: startOfDay(addDays(now, -6)), statPeriod: "day", ttl: 15 * 60000 };
  if (period === "month") {
    const start = startOfDay(now);
    start.setDate(1);
    return { period, start, statPeriod: "day", ttl: 15 * 60000 };
  }
  return { period, start: new Date(2015, 0, 1), statPeriod: "month", ttl: 60 * 60000 };
}

async function loadStatistics(hass, spec, energy) {
  const sources = Object.fromEntries(ENERGY_ORDER.map((name) => [name, energy[name]?.entityId]).filter(([, id]) => id));
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: Object.values(sources),
    period: spec.statPeriod,
    types: ["change"],
  });
  const byKey = new Map();
  for (const [name, entityId] of Object.entries(sources)) {
    for (const row of response?.[entityId] || []) {
      const start = new Date(statStart(row.start));
      const key = spec.statPeriod === "month" ? `${start.getFullYear()}-${start.getMonth()}` : start.toDateString();
      const bucket = byKey.get(key) || { start };
      bucket[name] = Math.max(0, Number(row.change) || 0);
      byKey.set(key, bucket);
    }
  }
  let buckets;
  if (spec.statPeriod === "day") {
    // A fixed day axis, so a missing day shows as a gap instead of shifting.
    buckets = [];
    for (let day = new Date(spec.start); day <= new Date(); day = addDays(day, 1)) {
      buckets.push(byKey.get(day.toDateString()) || { start: new Date(day) });
    }
  } else {
    buckets = [...byKey.values()].sort((a, b) => a.start - b.start);
  }
  return { buckets };
}

// Statistics are compiled hourly; today's bucket comes from the live Today
// sensors instead so the totals do not lag behind.
function withLiveToday(buckets, spec, today) {
  if (spec.statPeriod !== "day") return buckets;
  const key = new Date().toDateString();
  return buckets.map((bucket) => {
    if (bucket.start.toDateString() !== key) return bucket;
    const next = { ...bucket };
    for (const name of ENERGY_ORDER) if (isNum(today[name])) next[name] = today[name];
    return next;
  });
}

function sumBuckets(buckets) {
  const totals = {};
  for (const name of ENERGY_ORDER) {
    const values = buckets.map((bucket) => bucket[name]).filter(isNum);
    totals[name] = values.length ? values.reduce((sum, value) => sum + value, 0) : null;
  }
  return totals;
}

function periodSummary(totals, config, t, locale) {
  const { solar, load, gridImport, gridExport } = totals;
  const items = [];
  if (isNum(load) && isNum(gridImport) && load > 0.05) {
    items.push(["autarky", t.autarky, formatPercent(clamp(((load - gridImport) / load) * 100, 0, 100), locale)]);
  }
  if (isNum(solar) && isNum(gridExport) && solar > 0.05) {
    items.push(["selfuse", t.selfUse, formatPercent(clamp(((solar - gridExport) / solar) * 100, 0, 100), locale)]);
  }
  const priceImport = positiveNumber(config.price_import);
  if (priceImport !== null && isNum(load) && isNum(gridImport)) {
    const priceExport = positiveNumber(config.price_export) || 0;
    const saved = Math.max(0, load - gridImport) * priceImport + (isNum(gridExport) ? gridExport : 0) * priceExport;
    items.push(["money", t.savings, `${formatNumber(saved, locale, 2)} ${config.currency ?? t.currency}`.trim()]);
  }
  if (isNum(solar)) {
    const factor = Number.parseFloat(config.co2_factor);
    const kg = solar * (Number.isFinite(factor) && factor >= 0 ? factor : 0.5);
    items.push(["co2", t.co2, kg >= 1000 ? `${formatNumber(kg / 1000, locale, 2)} t` : `${formatNumber(kg, locale, kg < 10 ? 1 : 0)} kg`]);
  }
  const pvCapacity = positiveNumber(config.pv_capacity);
  if (pvCapacity !== null && isNum(solar)) {
    const yieldValue = solar / pvCapacity;
    items.push(["yield", t.specificYield, `${formatNumber(yieldValue, locale, yieldValue < 10 ? 2 : 0)} kWh/kWp`]);
  }
  return items;
}

// Time until full while charging, until the reserve while discharging.
function batteryForecast(live, config) {
  const capacity = positiveNumber(config.battery_capacity);
  const minSoc = clamp(Number.parseFloat(config.battery_min_soc ?? 10) || 0, 0, 90);
  if (!isNum(live.soc)) return { capacity, minSoc, soc: null, mode: "unknown" };
  const soc = clamp(live.soc, 0, 100);
  const forecast = { capacity, minSoc, soc, stored: capacity !== null ? (soc / 100) * capacity : null, mode: "idle" };
  if (capacity === null) return forecast;
  if (live.charge > 50 && soc < 99.5) {
    forecast.mode = "charging";
    forecast.hours = (((100 - soc) / 100) * capacity) / (live.charge / 1000);
  } else if (live.discharge > 50 && soc > minSoc) {
    forecast.mode = "discharging";
    forecast.hours = (((soc - minSoc) / 100) * capacity) / (live.discharge / 1000);
  }
  if (forecast.hours !== undefined) forecast.at = new Date(Date.now() + forecast.hours * 3600000);
  return forecast;
}

// DeyeCloud device sensors are named "<key> <serial>"; newer versions also
// expose the key as an attribute.
function deviceKey(stateObj) {
  const attrs = stateObj.attributes || {};
  if (attrs.device_key) return String(attrs.device_key);
  const serial = String(attrs.device_sn || "");
  const words = String(attrs.friendly_name || "").split(/\s+/);
  const index = serial ? words.lastIndexOf(serial) : -1;
  return index > 0 ? words[index - 1] : "";
}

function inverterReadings(resolved) {
  const devices = resolved.candidates.filter(([, s]) => s.attributes?.sensor_type === "device");
  const inverters = devices.filter(([, s]) => String(s.attributes?.device_type || "").includes("INVERTER"));
  const bySerial = new Map();
  for (const [entityId, stateObj] of inverters.length ? inverters : devices) {
    const key = deviceKey(stateObj);
    const value = stateNumber(stateObj);
    if (!key || value === null) continue;
    const serial = String(stateObj.attributes?.device_sn || "");
    const device = bySerial.get(serial) || { serial, strings: new Map(), temperatures: [], battery: [], grid: [] };
    const unit = stateUnit(stateObj);
    const reading = { entityId, key, value, unit };
    const stringMatch = key.match(/PV\s*(\d+)/i);
    if (stringMatch && ["V", "A", "W", "kW"].includes(unit) && !/total|daily|energy/i.test(key)) {
      const index = Number(stringMatch[1]);
      const string = device.strings.get(index) || {};
      string[unit === "kW" ? "W" : unit] = { ...reading, value: unit === "kW" ? value * 1000 : value };
      device.strings.set(index, string);
    } else if (/^(battery|bms|bat)/i.test(key) && ["V", "A", "°C", "W"].includes(unit)) {
      device.battery.push(reading);
    } else if (unit === "°C" || /temp/i.test(key)) {
      device.temperatures.push(reading);
    } else if ((unit === "Hz" || (unit === "V" && /grid|ac|phase|l\d|ua|ub|uc/i.test(key))) && device.grid.length < 6) {
      device.grid.push(reading);
    }
    bySerial.set(serial, device);
  }
  return [...bySerial.values()].filter((d) => d.strings.size || d.temperatures.length || d.battery.length || d.grid.length);
}

// Optimizer / per-panel production: DeyeCloud optimizer sensors, or the
// `panels:` option (entity ids of each panel's energy today).
function panelData(hass, resolved, config) {
  const states = hass?.states || {};
  let panels = [];
  if (Array.isArray(config.panels) && config.panels.length) {
    panels = config.panels.map((item, i) => {
      const entityId = typeof item === "string" ? item : item?.entity;
      const powerId = typeof item === "object" ? item?.power : null;
      return {
        serial: entityId || String(i),
        name: (typeof item === "object" && item?.name) || `#${i + 1}`,
        entityId,
        today: stateNumber(states[entityId]),
        power: powerId ? stateNumber(states[powerId]) : null,
      };
    }).filter((panel) => panel.entityId);
  } else {
    const byDevice = new Map();
    for (const [entityId, stateObj] of resolved.candidates) {
      const attrs = stateObj.attributes || {};
      if (attrs.sensor_type !== "optimizer" || !attrs.device_sn) continue;
      const panel = byDevice.get(attrs.device_sn) || { serial: String(attrs.device_sn) };
      if (attrs.metric_key === "today") {
        panel.today = stateNumber(stateObj);
        panel.entityId = entityId;
      } else if (attrs.metric_key === "power") {
        panel.power = stateNumber(stateObj);
      }
      byDevice.set(attrs.device_sn, panel);
    }
    panels = [...byDevice.values()]
      .filter((panel) => panel.entityId)
      .sort((a, b) => a.serial.localeCompare(b.serial, undefined, { numeric: true }))
      .map((panel, i) => ({ ...panel, name: `#${i + 1}` }));
  }
  if (!panels.length) return null;
  const values = panels.map((p) => p.today).filter(isNum);
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor((sorted.length - 1) / 2)] : 0;
  const max = Math.max(0.01, ...values);
  let weakest = null;
  for (const panel of panels) {
    panel.share = isNum(panel.today) ? clamp(panel.today / max, 0, 1) : 0;
    if (isNum(panel.today) && (!weakest || panel.today < weakest.today)) weakest = panel;
  }
  if (!(median >= 0.05 && weakest && weakest.today < median * 0.85)) weakest = null;
  if (weakest) weakest.weak = true;
  const stringCount = clamp(Math.round(Number(config.panel_strings) || (panels.length > 8 ? 2 : 1)), 1, panels.length);
  const perString = Math.ceil(panels.length / stringCount);
  const strings = [];
  for (let i = 0; i < panels.length; i += perString) strings.push(panels.slice(i, i + perString));
  return {
    panels,
    strings,
    median,
    weakest,
    average: values.length ? values.reduce((s, v) => s + v, 0) / values.length : null,
  };
}

// Status used by themes that show one (LCARS): alert when offline or the
// battery reached its reserve, caution when delayed, close to the reserve
// or a panel is underperforming.
function systemStatus(status, forecast, panels) {
  if (status.state === "offline" || (isNum(forecast.soc) && forecast.soc <= forecast.minSoc + 1)) return "alert";
  if (status.state === "delayed" || (isNum(forecast.soc) && forecast.soc < forecast.minSoc + 15) || panels?.weakest) return "warn";
  return "nominal";
}


const MINI_ICONS = {
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/></svg>',
  import: '<svg viewBox="0 0 24 24"><path d="M4 12h14M13 7l5 5-5 5M4 5v14"/></svg>',
  export: '<svg viewBox="0 0 24 24"><path d="M20 12H6M11 7l-5 5 5 5M20 5v14"/></svg>',
  charge: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 2h6M12 8v8M8 12h8"/></svg>',
  discharge: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 2h6M8 12h8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="m13 2-8 12h6l-1 8 9-13h-6z"/></svg>',
  chip: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  panel: '<svg viewBox="0 0 24 24"><path d="M4 5h16l-2 10H2z"/><path d="M8 5 6.5 15M14 5l-1 10M3 10h16M11 15v4M7 19h8"/></svg>',
};

const TILE_DEFS = [
  ["solar", "sun", "pvProduction"],
  ["load", "home", "consumption"],
  ["gridImport", "import", "gridImport"],
  ["gridExport", "export", "gridExport"],
  ["charge", "charge", "batteryCharge"],
  ["discharge", "discharge", "batteryDischarge"],
];

function periodLabels(t) {
  return {
    today: ["24H", t.periodToday],
    "3d": ["3D", t.period3d],
    "7d": ["7D", t.period7d],
    month: [t.periodMonthShort, t.periodMonth],
    all: [t.periodAllShort, t.periodAll],
  };
}

function tabsHtml(m) {
  const labels = periodLabels(m.t);
  return `
    <div class="sfc-tabs" role="radiogroup" aria-label="${escapeHtml(m.t.energy)}">
      ${PERIODS.map((period) => `
        <button type="button" role="radio" class="sfc-tab ${period === m.period ? "on" : ""}"
          aria-checked="${period === m.period}" title="${escapeHtml(labels[period][1])}"
          data-period="${period}">${escapeHtml(labels[period][0])}</button>`).join("")}
    </div>`;
}

function tilesHtml(m) {
  return `
    <div class="sfc-tiles">
      ${TILE_DEFS.map(([name, icon, label]) => {
        const entityId = m.ids.energy[name];
        return `
          <button class="sfc-tile ${name}" ${entityId ? `data-entity="${escapeHtml(entityId)}"` : "disabled"}>
            <span class="sfc-tile-icon">${MINI_ICONS[icon]}</span>
            <span class="sfc-tile-copy">
              <small>${escapeHtml(m.t[label])}</small>
              <strong>${escapeHtml(m.energyLoading && !isNum(m.totals[name]) ? "…" : formatEnergy(m.totals[name], m.locale))}</strong>
            </span>
          </button>`;
      }).join("")}
    </div>`;
}

function summaryHtml(m) {
  if (!m.summary.length) return "";
  return `
    <div class="sfc-summary">
      ${m.summary.map(([kind, label, value]) => `
        <div class="sfc-summary-item ${kind}">
          <small>${escapeHtml(label)}</small>
          <strong>${escapeHtml(value)}</strong>
        </div>`).join("")}
    </div>`;
}

function energySectionHtml(m, { title = true } = {}) {
  if (!m.config.showEnergy) return "";
  const [kicker, label] = periodLabels(m.t)[m.period];
  const hint = m.period === "all" && m.since ? fill(m.t.since, { date: m.since }) : "";
  return `
    <section class="sfc-section sfc-energy">
      ${title ? `
        <div class="sfc-head">
          <div><span class="sfc-kicker">${escapeHtml(kicker)}</span><h3>${escapeHtml(label)}</h3></div>
          ${hint ? `<span class="sfc-hint">${escapeHtml(hint)}</span>` : ""}
        </div>` : ""}
      ${tabsHtml(m)}
      ${m.config.showChart ? chartHtml(m) : ""}
      ${tilesHtml(m)}
      ${summaryHtml(m)}
    </section>`;
}

function forecastHtml(m) {
  const f = m.forecast;
  if (!m.config.showForecast || f.capacity === null || !isNum(f.soc)) return "";
  const { t, locale } = m;
  let headline = t.holding;
  let detail = "";
  if (f.mode === "charging") {
    headline = fill(t.fullIn, { d: formatDuration(f.hours, t) });
    detail = fill(t.fullAt, { time: formatClock(f.at, locale) });
  } else if (f.mode === "discharging") {
    headline = fill(t.lastsFor, { d: formatDuration(f.hours, t) });
    detail = fill(t.lastsUntil, { time: formatClock(f.at, locale), soc: formatNumber(f.minSoc, locale, 0) });
  }
  return `
    <section class="sfc-section sfc-forecast" ${m.ids.live.soc ? `data-entity="${escapeHtml(m.ids.live.soc)}"` : ""}>
      <span class="sfc-forecast-icon">${MINI_ICONS.charge}</span>
      <div class="sfc-forecast-copy">
        <small>${escapeHtml(t.batteryForecast)}</small>
        <strong>${escapeHtml(headline)}</strong>
        ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
      </div>
      <b class="sfc-forecast-stored">${escapeHtml(fill(t.storedOf, { kwh: formatEnergy(f.stored, locale), cap: formatEnergy(f.capacity, locale) }))}</b>
      <div class="sfc-forecast-bar" aria-hidden="true"><i style="width:${f.soc}%"></i><b style="left:${f.minSoc}%"></b></div>
    </section>`;
}

function readingLabel(key) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

function inverterHtml(m) {
  if (!m.inverterOpen) return "";
  const { t, locale } = m;
  const devices = m.inverter || [];
  const reading = (r) => `
    <button class="sfc-reading" data-entity="${escapeHtml(r.entityId)}">
      <small>${escapeHtml(readingLabel(r.key))}</small>
      <b>${escapeHtml(`${formatNumber(r.value, locale, Math.abs(r.value) < 100 ? 1 : 0)} ${r.unit}`)}</b>
    </button>`;
  const group = (title, items) => items.length ? `
    <div class="sfc-group"><h4>${escapeHtml(title)}</h4><div class="sfc-readings">${items.map(reading).join("")}</div></div>` : "";
  const content = devices.length ? devices.map((device) => `
    ${devices.length > 1 ? `<h4 class="sfc-serial">${escapeHtml(device.serial)}</h4>` : ""}
    ${device.strings.size ? `
      <div class="sfc-group">
        <h4>${escapeHtml(t.pvStrings)}</h4>
        <div class="sfc-strings">
          ${[...device.strings.entries()].sort((a, b) => a[0] - b[0]).map(([index, s]) => `
            <button class="sfc-string" data-entity="${escapeHtml((s.W || s.V || s.A).entityId)}">
              <span>${escapeHtml(fill(t.stringN, { n: index }))}</span>
              <b>${escapeHtml(s.W ? formatPower(s.W.value, locale) : "—")}</b>
              <small>${escapeHtml([s.V && `${formatNumber(s.V.value, locale, 0)} V`, s.A && `${formatNumber(s.A.value, locale, 1)} A`].filter(Boolean).join(" · "))}</small>
            </button>`).join("")}
        </div>
      </div>` : ""}
    ${group(t.temperatures, device.temperatures)}
    ${group(t.batteryDetails, device.battery)}
    ${group(t.gridDetails, device.grid)}`).join("") : `<p class="sfc-empty-note">${escapeHtml(t.noDetails)}</p>`;
  return `
    <section class="sfc-section sfc-inverter">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${MINI_ICONS.chip}</span><h3>${escapeHtml(t.inverterDetails)}</h3></div>
        <button type="button" class="sfc-link" data-action="inverter">${escapeHtml(t.close)}</button>
      </div>
      ${content}
    </section>`;
}

function panelsHtml(m) {
  const data = m.panels;
  if (!m.config.showPanels || !data) return "";
  const { t, locale } = m;
  const note = data.weakest
    ? fill(t.panelWeak, { name: data.weakest.name, pct: formatNumber((data.weakest.today / data.median) * 100, locale, 0) })
    : t.panelsEven;
  return `
    <section class="sfc-section sfc-panels" id="sfc-panels">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${data.panels.length}×</span><h3>${escapeHtml(t.panelsTitle)}</h3></div>
        <span class="sfc-hint">${escapeHtml(t.panelsHint)}</span>
      </div>
      ${data.strings.map((string, i) => `
        <div class="sfc-panel-string">
          ${data.strings.length > 1 ? `<small class="sfc-string-label">${escapeHtml(fill(t.stringModules, { n: i + 1, count: string.length }))}</small>` : ""}
          <div class="sfc-panel-grid" style="--cols:${Math.min(string.length, 8)}">
            ${string.map((panel) => `
              <button class="sfc-panel ${panel.weak ? "weak" : ""}" style="--share:${(panel.share * 100).toFixed(0)}%;--share-n:${panel.share.toFixed(2)}"
                data-entity="${escapeHtml(panel.entityId)}" title="${escapeHtml(panel.serial)}">
                <small>${escapeHtml(panel.name)}</small>
                <strong>${escapeHtml(isNum(panel.today) ? formatNumber(panel.today, locale, 2) : "—")}</strong>
                <span>${escapeHtml(isNum(panel.power) ? formatPower(panel.power, locale) : "kWh")}</span>
              </button>`).join("")}
          </div>
        </div>`).join("")}
      <p class="sfc-panels-note ${data.weakest ? "warn" : ""}">
        ${escapeHtml(fill(t.panelAvg, { kwh: formatEnergy(data.average, locale) }))} · ${escapeHtml(note)}
      </p>
    </section>`;
}

// Sections every theme shows below its main view.
function standardSections(m) {
  return `${inverterHtml(m)}${forecastHtml(m)}${energySectionHtml(m)}${panelsHtml(m)}`;
}

// ---------------------------------------------------------------------------
// Chart: power over the day for 24H / 3D (recorder history), energy bars for
// 7D / month / all (long-term statistics).
// ---------------------------------------------------------------------------

function chartHtml(m) {
  const chart = m.chart;
  if (!chart) return "";
  let body;
  if (chart.data?.kind === "power" && chart.data.solar?.some((v) => v !== null)) {
    body = powerChartHtml(chart.data, m.t, m.locale);
  } else if (chart.data?.kind === "energy" && chart.data.buckets?.some((b) => b.solar || b.load)) {
    body = energyChartHtml(chart.data, m.t, m.locale);
  } else {
    const message = chart.loading ? m.t.chartLoading : chart.error ? m.t.chartError : m.t.chartEmpty;
    body = `<div class="sfc-chart-empty">${escapeHtml(message)}</div>`;
  }
  return `<div class="sfc-chart ${chart.loading ? "loading" : ""}">${body}</div>`;
}

function chartFrame(legend, svg, yLabels, xLabels, hint) {
  return `
    <div class="sfc-legend">${legend.map(([kind, label]) => `<span class="${kind}"><i></i>${escapeHtml(label)}</span>`).join("")}</div>
    <div class="sfc-plot">
      ${svg}
      ${yLabels}
      <i class="sfc-cursor" hidden></i>
      <div class="sfc-tip" hidden></div>
    </div>
    <div class="sfc-xaxis">${xLabels}</div>
    ${hint ? `<p class="sfc-chart-hint">${escapeHtml(hint)}</p>` : ""}`;
}

function powerChartHtml(data, t, locale) {
  const { spec } = data;
  const W = 1000;
  const H = 300;
  const signed = [data.battery, data.grid].filter(Boolean).flat().filter((v) => v !== null);
  const positive = [data.solar, data.load].filter(Boolean).flat().filter((v) => v !== null);
  const maxValue = Math.max(100, ...positive, ...signed);
  const minValue = Math.min(0, ...signed);
  const step = niceStep(maxValue - minValue, 4);
  const top = Math.ceil(maxValue / step) * step;
  const bottom = Math.floor(minValue / step) * step;
  const y = (v) => H - ((v - bottom) / (top - bottom)) * H;
  const x = (i) => ((i + 0.5) / spec.count) * W;
  const zero = y(0);
  const ticks = [];
  for (let v = bottom; v <= top + step / 2; v += step) ticks.push(v);
  const xLabels = [];
  if (spec.period === "today") {
    for (let hour = 0; hour <= 24; hour += 6) xLabels.push([hour / 24, `${String(hour).padStart(2, "0")}:00`]);
  } else {
    const span = spec.axisEnd - spec.start;
    for (let day = new Date(spec.start); day < spec.axisEnd; day = addDays(day, 1)) {
      xLabels.push([(day - spec.start) / span, day.toLocaleDateString(locale, { weekday: "short" })]);
    }
  }
  const socY = (v) => H - (clamp(v, 0, 100) / 100) * H;
  const legend = [
    ["pv", t.legendPv, data.solar],
    ["load", t.legendLoad, data.load],
    ["battery", t.legendBattery, data.battery],
    ["grid", t.legendGrid, data.grid],
    ["soc", t.legendSoc, data.soc],
  ].filter(([, , series]) => series);
  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${ticks.map((v) => `<line class="sfc-gridline ${v === 0 ? "zero" : ""}" x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" />`).join("")}
      ${data.solar ? `<path class="sfc-area pv" d="${areaPath(data.solar, x, y, zero)}" />` : ""}
      ${data.battery ? `<path class="sfc-area battery" d="${areaPath(data.battery, x, y, zero)}" />` : ""}
      ${data.solar ? `<path class="sfc-line pv" d="${linePath(data.solar, x, y)}" />` : ""}
      ${data.battery ? `<path class="sfc-line battery" d="${linePath(data.battery, x, y)}" />` : ""}
      ${data.grid ? `<path class="sfc-line grid" d="${linePath(data.grid, x, y)}" />` : ""}
      ${data.load ? `<path class="sfc-line load" d="${linePath(data.load, x, y)}" />` : ""}
      ${data.soc ? `<path class="sfc-line soc" d="${linePath(data.soc, x, socY)}" />` : ""}
    </svg>`;
  return chartFrame(
    legend,
    svg,
    ticks.map((v) => `<span class="sfc-ylabel" style="top:${((y(v) / H) * 100).toFixed(2)}%">${escapeHtml(formatPower(v, locale))}</span>`).join(""),
    xLabels.map(([pos, label]) => `<span style="left:${(pos * 100).toFixed(2)}%">${escapeHtml(label)}</span>`).join(""),
    t.chartPowerHint
  );
}

function energyChartHtml(data, t, locale) {
  const { buckets, spec } = data;
  const W = 1000;
  const H = 300;
  const kinds = [["solar", "pv"], ["load", "load"], ["gridImport", "grid"]];
  const maxValue = Math.max(0.1, ...buckets.flatMap((b) => kinds.map(([k]) => b[k] || 0)));
  const step = niceStep(maxValue, 4);
  const top = Math.ceil(maxValue / step) * step;
  const y = (v) => H - (v / top) * H;
  const groupWidth = W / buckets.length;
  const barWidth = Math.max(1, (groupWidth * 0.78) / kinds.length);
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  const label = (start, i) => {
    if (spec.period === "3d" || spec.period === "7d") return start.toLocaleDateString(locale, { weekday: "short" });
    if (spec.period === "month") {
      const day = start.getDate();
      return day === 1 || day % 5 === 0 ? String(day) : "";
    }
    if (buckets.length <= 12 || start.getMonth() % 3 === 0) {
      return start.getMonth() === 0 || i === 0
        ? start.toLocaleDateString(locale, { month: "short", year: "2-digit" })
        : start.toLocaleDateString(locale, { month: "short" });
    }
    return "";
  };
  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${ticks.map((v) => `<line class="sfc-gridline ${v === 0 ? "zero" : ""}" x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" />`).join("")}
      ${buckets.map((bucket, i) => kinds.map(([key, cls], k) => {
        const value = bucket[key] || 0;
        const left = i * groupWidth + groupWidth * 0.11 + k * barWidth;
        return value > 0
          ? `<rect class="sfc-bar ${cls}" x="${left.toFixed(1)}" y="${y(value).toFixed(1)}" width="${(barWidth * 0.9).toFixed(1)}" height="${(H - y(value)).toFixed(1)}" />`
          : "";
      }).join("")).join("")}
    </svg>`;
  return chartFrame(
    [["pv", t.pvProduction], ["load", t.consumption], ["grid", t.gridImport]],
    svg,
    ticks.map((v) => `<span class="sfc-ylabel" style="top:${((y(v) / H) * 100).toFixed(2)}%">${escapeHtml(formatNumber(v, locale, step < 1 ? 1 : 0))} kWh</span>`).join(""),
    buckets.map((bucket, i) => {
      const text = label(bucket.start, i);
      return text ? `<span style="left:${(((i + 0.5) / buckets.length) * 100).toFixed(2)}%">${escapeHtml(text)}</span>` : "";
    }).join(""),
    ""
  );
}

function chartTipHtml(data, index, t, locale) {
  if (data.kind === "power") {
    const { spec } = data;
    if (index < 0 || index >= spec.count) return null;
    const at = new Date(spec.start.getTime() + index * spec.bucketMs);
    const rows = [
      ["pv", t.legendPv, data.solar],
      ["load", t.legendLoad, data.load],
      ["battery", t.legendBattery, data.battery],
      ["grid", t.legendGrid, data.grid],
    ].filter(([, , series]) => series && series[index] !== null);
    if (!rows.length) return null;
    const time = spec.period === "today"
      ? formatClock(at, locale)
      : `${at.toLocaleDateString(locale, { weekday: "short" })} ${formatClock(at, locale)}`;
    const soc = data.soc?.[index];
    return `<strong>${escapeHtml(time)}</strong>
      ${rows.map(([kind, label, series]) => `<span class="${kind}"><i></i>${escapeHtml(label)}<b>${escapeHtml(formatPower(series[index], locale))}</b></span>`).join("")}
      ${isNum(soc) ? `<span class="soc"><i></i>${escapeHtml(t.legendSoc)}<b>${escapeHtml(formatPercent(soc, locale))}</b></span>` : ""}`;
  }
  const bucket = data.buckets[index];
  if (!bucket) return null;
  const title = data.spec.statPeriod === "month"
    ? bucket.start.toLocaleDateString(locale, { month: "long", year: "numeric" })
    : bucket.start.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const rows = [
    ["pv", t.pvProduction, bucket.solar],
    ["load", t.consumption, bucket.load],
    ["grid", t.gridImport, bucket.gridImport],
    ["export", t.gridExport, bucket.gridExport],
    ["battery", t.batteryCharge, bucket.charge],
    ["battery", t.batteryDischarge, bucket.discharge],
  ].filter(([, , value]) => value !== undefined);
  return `<strong>${escapeHtml(title)}</strong>
    ${rows.map(([kind, label, value]) => `<span class="${kind}"><i></i>${escapeHtml(label)}<b>${escapeHtml(formatEnergy(value, locale))}</b></span>`).join("")}`;
}

function wireChart(root, data, t, locale) {
  const plot = root.querySelector(".sfc-plot");
  if (!plot || !data) return;
  const cursor = plot.querySelector(".sfc-cursor");
  const tip = plot.querySelector(".sfc-tip");
  const count = data.kind === "power" ? data.spec.count : data.buckets.length;
  const hide = () => {
    cursor.hidden = true;
    tip.hidden = true;
  };
  const show = (event) => {
    const box = plot.getBoundingClientRect();
    const index = Math.floor(clamp((event.clientX - box.left) / box.width, 0, 0.9999) * count);
    const html = chartTipHtml(data, index, t, locale);
    if (!html) return hide();
    const left = ((index + 0.5) / count) * 100;
    cursor.hidden = false;
    cursor.style.left = `${left}%`;
    tip.hidden = false;
    tip.innerHTML = html;
    tip.classList.toggle("flip", left > 55);
    tip.style.left = `${left}%`;
  };
  plot.addEventListener("pointermove", show);
  plot.addEventListener("pointerdown", show);
  plot.addEventListener("pointerleave", hide);
}

function powerSpec(period) {
  const now = new Date();
  const start = startOfDay(period === "3d" ? addDays(now, -2) : now);
  const axisEnd = period === "3d" ? now : addDays(start, 1);
  const bucketMs = (period === "3d" ? 15 : 5) * 60000;
  return { period, start, axisEnd, bucketMs, count: Math.max(1, Math.ceil((axisEnd - start) / bucketMs)), ttl: 5 * 60000 };
}

async function loadPowerHistory(hass, spec, live) {
  const sources = Object.fromEntries(
    ["solar", "load", "battery", "charge", "discharge", "gridImport", "gridExport", "grid", "soc"]
      .map((name) => [name, live[name]?.entityId])
      .filter(([, id]) => id)
  );
  const nowMs = Date.now();
  const response = await hass.callWS({
    type: "history/history_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date(nowMs).toISOString(),
    entity_ids: [...new Set(Object.values(sources))],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const series = {};
  for (const [name, entityId] of Object.entries(sources)) {
    series[name] = bucketHistory(historyPoints(response?.[entityId]), spec.start.getTime(), spec.count, spec.bucketMs, nowMs);
  }
  return { series };
}


// Each theme renders the whole card body: its own main view plus the shared
// sections (styled by the theme's CSS).

function entityAttr(entityId) {
  return entityId ? `data-entity="${escapeHtml(entityId)}"` : "";
}

function liveBadge(m) {
  const state = m.status.state;
  return `<span class="sfc-badge ${state}"><i></i>${escapeHtml(m.t[state])}</span>`;
}

function gridEntityId(m) {
  const ids = m.ids.live;
  if (m.live.importActive) return ids.gridImport || ids.grid;
  if (m.live.exportActive) return ids.gridExport || ids.grid;
  return ids.grid || ids.gridImport || ids.gridExport;
}

function batteryEntityId(m) {
  return m.ids.live.soc || m.ids.live.battery || m.ids.live.discharge;
}

function batteryStatus(m) {
  return m.live.chargeActive ? m.t.charging : m.live.dischargeActive ? m.t.discharging : m.t.idle;
}

function gridStatus(m) {
  return m.live.importActive ? m.t.importing : m.live.exportActive ? m.t.exporting : m.t.balanced;
}

function batteryWhen(m) {
  const f = m.forecast;
  if (f.mode === "charging") return { label: m.t.chipFull, value: formatClock(f.at, m.locale) };
  if (f.mode === "discharging") return { label: m.t.chipLasts, value: formatClock(f.at, m.locale) };
  if (isNum(f.stored)) return { label: m.t.chipStored, value: formatEnergy(f.stored, m.locale) };
  return { label: m.t.battery, value: formatPercent(f.soc, m.locale) };
}

function clockText(m) {
  return formatClock(m.now, m.locale);
}

function flowPath(d, active, reverse, cls, extra = "") {
  return `<path class="sfc-flow-base ${cls}" d="${d}" ${extra}/>`
    + (active ? `<path class="sfc-flow ${cls} ${reverse ? "rev" : ""}" d="${d}" ${extra}/>` : "");
}

// --------------------------------------------------------------------------
// Diorama: an isometric house whose sky follows the time of day.
// --------------------------------------------------------------------------

function dioramaSky(now) {
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < 5.5 || h >= 21) return { phase: "night", sky: ["#0b1630", "#253563"], ground: ["#4a6b57", "#3a5747", "#2f4a3b"] };
  if (h < 8) return { phase: "dawn", sky: ["#f2a07a", "#fde3c4"], ground: ["#bfe3c6", "#a9d6b2", "#98c9a2"] };
  if (h < 17.5) return { phase: "day", sky: ["#7fc3f0", "#bfe4f8"], ground: ["#bfe3c6", "#a9d6b2", "#98c9a2"] };
  return { phase: "dusk", sky: ["#e7855c", "#f6c48d"], ground: ["#b3d6b6", "#9bc8a3", "#8bbb94"] };
}

function dioramaScene(m) {
  const S = 26;
  const CX = 250;
  const CY = 205;
  const P = (x, y, z = 0) => [CX + (x - y) * S * 0.866, CY + (x + y) * S * 0.5 - z * S];
  const pts = (...ps) => ps.map((p) => P(...p).map((v) => v.toFixed(1)).join(",")).join(" ");
  const poly = (fill, ...ps) => `<polygon points="${pts(...ps)}" fill="${fill}"/>`;
  const box = (x, y, w, d, h, top, left, right, z = 0) =>
    poly(left, [x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])
    + poly(right, [x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])
    + poly(top, [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]);
  const sky = dioramaSky(m.now);
  const night = sky.phase === "night";
  const h = m.now.getHours() + m.now.getMinutes() / 60;
  let g = "";
  if (night) {
    const stars = [[40, 30], [90, 70], [150, 24], [210, 52], [300, 28], [360, 64], [460, 36], [500, 80], [120, 110], [260, 96]];
    g += stars.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.2 : 1.8}" fill="#fff" opacity="${0.5 + (i % 4) * 0.12}"/>`).join("");
    g += '<circle cx="430" cy="62" r="17" fill="#f4f1dc"/><circle cx="438" cy="56" r="15" fill="#253563" opacity=".9"/>';
  } else {
    const p = clamp((h - 6) / 14, 0, 1);
    const sx = 70 + p * 380;
    const sy = 140 - Math.sin(Math.PI * p) * 100;
    g += `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="44" fill="#ffe27a" opacity=".22"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="26" fill="#ffe27a"/>`;
    g += '<g fill="#fff" opacity=".85"><ellipse cx="410" cy="64" rx="34" ry="12"/><ellipse cx="430" cy="56" rx="22" ry="12"/><ellipse cx="120" cy="96" rx="26" ry="9"/></g>';
  }
  g += poly(sky.ground[0], [-4, -3, 0], [7, -3, 0], [7, 6, 0], [-4, 6, 0]);
  g += poly(sky.ground[1], [-4, 6, 0], [7, 6, 0], [7, 6, -0.35], [-4, 6, -0.35]);
  g += poly(sky.ground[2], [7, -3, 0], [7, 6, 0], [7, 6, -0.35], [7, -3, -0.35]);
  // House, clickable for the inverter details.
  const windows = night ? "#ffd86b" : "#9fd3f5";
  g += `<g class="sfc-click" data-action="inverter">`;
  g += box(0, 0, 4, 3, 2.2, "#f4efe6", "#f8f4ec", "#e3dccd");
  g += poly("#c7865a", [1.5, 3, 0], [2.3, 3, 0], [2.3, 3, 1.3], [1.5, 3, 1.3]);
  g += poly(windows, [0.4, 3, 0.9], [1.1, 3, 0.9], [1.1, 3, 1.6], [0.4, 3, 1.6]);
  g += poly(windows, [2.8, 3, 0.9], [3.6, 3, 0.9], [3.6, 3, 1.6], [2.8, 3, 1.6]);
  g += poly(windows, [4, 0.6, 0.9], [4, 1.4, 0.9], [4, 1.4, 1.6], [4, 0.6, 1.6]);
  g += poly("#d9573f", [-0.2, 3.2, 2.2], [4.2, 3.2, 2.2], [4.2, 1.5, 3.5], [-0.2, 1.5, 3.5]);
  g += poly("#e8e0d2", [4.2, -0.2, 2.2], [4.2, 3.2, 2.2], [4.2, 1.5, 3.5]);
  // PV modules on the front slope, one per optimizer when known.
  const panelList = m.panels?.panels || [];
  const count = clamp(panelList.length || Math.round(positiveNumber(m.config.pv_panels) || 8), 1, 24);
  const rows = count > 16 ? 3 : count > 8 ? 2 : 1;
  const cols = Math.ceil(count / rows);
  const slope = (s) => [3.0 - 1.25 * s, 2.32 + 0.96 * s];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      if (k >= count) continue;
      const x0 = 0.15 + c * (3.7 / cols);
      const x1 = x0 + 3.7 / cols - 0.07;
      const [ya, za] = slope(r / rows + 0.02);
      const [yb, zb] = slope((r + 1) / rows - 0.02);
      const weak = panelList[k]?.weak;
      g += poly(weak ? "#e8902c" : "#1f3d6b", [x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]);
      const [yc, zc] = slope(r / rows + 0.06);
      const [yd, zd] = slope((r + 1) / rows - 0.06);
      g += poly(weak ? "#f2b36a" : "#2c5591", [x0 + 0.05, yc, zc], [x1 - 0.05, yc, zc], [x1 - 0.05, yd, zd], [x0 + 0.05, yd, zd]);
    }
  }
  g += "</g>";
  // Battery cabinet with its charge level.
  g += `<g class="sfc-click" ${entityAttr(batteryEntityId(m))}>`;
  g += box(-2.6, 1.6, 1.0, 0.8, 1.6, "#e6f6ef", "#d4efe3", "#b9e2d0");
  const level = isNum(m.live.soc) ? clamp(m.live.soc, 0, 100) / 100 : 0;
  g += poly("#cfe7dc", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 1.3], [-2.45, 2.4, 1.3]);
  g += poly(level < 0.2 ? "#f26b5b" : "#1fbf86", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 0.3 + level], [-2.45, 2.4, 0.3 + level]);
  g += "</g>";
  // Pylon.
  const base = P(6, 1.2);
  const top = P(6, 1.2, 5.2);
  g += `<g stroke="#6e7f93" stroke-width="2.2" fill="none" class="sfc-click" ${entityAttr(gridEntityId(m))}>
    <path d="M${base[0] - 14} ${base[1]} L${top[0]} ${top[1]} L${base[0] + 14} ${base[1]}"/>
    <path d="M${top[0] - 22} ${top[1] + 16} H${top[0] + 22} M${top[0] - 16} ${top[1] + 40} H${top[0] + 16} M${base[0] - 9} ${base[1] - 30} L${base[0] + 9} ${base[1] - 60} M${base[0] + 9} ${base[1] - 30} L${base[0] - 9} ${base[1] - 60}"/>
  </g>`;
  // Flows.
  const roof = P(2, 2.4, 2.9);
  const inside = P(2, 1.5, 1.0);
  const bat = P(-1.6, 2.0, 1.2);
  const wallL = P(0, 2.0, 1.0);
  const pole = P(6, 1.2, 4.7);
  const wallR = P(4, 1.0, 1.9);
  const L = m.live;
  g += '<g fill="none" stroke-linecap="round">';
  g += flowPath(`M${roof} Q${roof[0] + 40} ${roof[1] + 30} ${inside}`, L.solarActive, false, "pv");
  g += flowPath(`M${bat} Q${(bat[0] + wallL[0]) / 2} ${bat[1] - 30} ${wallL}`, L.chargeActive || L.dischargeActive, L.chargeActive, "battery");
  g += flowPath(`M${pole} Q${(pole[0] + wallR[0]) / 2} ${pole[1] + 30} ${wallR}`, L.importActive || L.exportActive, L.exportActive, "grid");
  g += "</g>";
  const tree = P(5.6, 4.6);
  g += `<rect x="${tree[0] - 3}" y="${tree[1] - 26}" width="6" height="26" fill="#8a6b4a"/><circle cx="${tree[0]}" cy="${tree[1] - 38}" r="18" fill="${night ? "#3f7a55" : "#5fb878"}"/><circle cx="${tree[0] + 10}" cy="${tree[1] - 30}" r="12" fill="${night ? "#356a49" : "#4fa868"}"/>`;
  return { svg: g, sky };
}

function renderDiorama(m) {
  const { t, locale, live } = m;
  const { svg, sky } = dioramaScene(m);
  const pill = (x, y, cls, value, note, entityId) => `
    <button class="dio-pill" style="left:${((x / 520) * 100).toFixed(1)}%;top:${((y / 360) * 100).toFixed(1)}%" ${entityAttr(entityId)}>
      <i class="${cls}"></i>${escapeHtml(value)} <small>${escapeHtml(note)}</small>
    </button>`;
  const batteryNote = live.dischargeActive ? `−${formatPower(live.discharge, locale)}` : live.chargeActive ? `+${formatPower(live.charge, locale)}` : t.idle;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const when = batteryWhen(m);
  const today = m.today;
  const load = today.load;
  const fromGrid = isNum(today.gridImport) ? today.gridImport : 0;
  const fromBattery = isNum(today.discharge) ? today.discharge : 0;
  const shares = isNum(load) && load > 0.05
    ? [Math.max(0, load - fromGrid - fromBattery) / load, fromBattery / load, fromGrid / load].map((v) => clamp(v * 100, 0, 100))
    : null;
  return `
    <div class="dio-scene" style="--sky-a:${sky.sky[0]};--sky-b:${sky.sky[1]}">
      <svg viewBox="0 0 520 360" aria-hidden="true">${svg}</svg>
      <div class="dio-title"><h1>${escapeHtml(m.name)}</h1>${liveBadge(m)}</div>
      <div class="dio-clock">${escapeHtml(clockText(m))}</div>
      ${pill(288, 78, "pv", formatPower(live.solar, locale), t.fromRoof, m.ids.live.solar)}
      ${pill(22, 208, "battery", formatPercent(live.soc, locale), batteryNote, batteryEntityId(m))}
      ${pill(378, 240, "grid", formatPower(gridValue, locale), t.grid.toLowerCase(), gridEntityId(m))}
      ${pill(120, 296, "load", formatPower(live.load, locale), t.inHome, m.ids.live.load)}
    </div>
    <div class="dio-bottom">
      <div class="dio-chips">
        <button class="dio-chip sun" ${entityAttr(m.ids.energy.solar)}><small>${escapeHtml(t.chipRoof)}</small><b>${escapeHtml(formatEnergy(today.solar, locale))}</b></button>
        <button class="dio-chip bat" ${entityAttr(batteryEntityId(m))}><small>${escapeHtml(when.label)}</small><b>${escapeHtml(when.value)}</b></button>
        <button class="dio-chip home" ${entityAttr(m.ids.energy.load)}><small>${escapeHtml(t.chipHome)}</small><b>${escapeHtml(formatEnergy(today.load, locale))}</b></button>
      </div>
      ${shares ? `
        <div class="dio-share">
          <header>${escapeHtml(t.whereFrom)}<span>${escapeHtml(t.autarky.toLowerCase())} ${escapeHtml(formatPercent(100 - shares[2], locale))}</span></header>
          <div class="dio-track"><div class="pv" style="width:${shares[0]}%"></div><div class="battery" style="width:${shares[1]}%"></div><div class="grid" style="width:${shares[2]}%"></div></div>
        </div>` : ""}
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Aurora: neon rings on a night sky.
// --------------------------------------------------------------------------

function renderAurora(m) {
  const { t, locale, live } = m;
  const W = 476;
  const H = 330;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const ring = (cls, x, y, label, value, unit, note, entityId, extra = "") => {
    const [number, u] = value;
    return `
      <button class="aur-node ${cls}" style="${pos(x, y)}" ${entityId === "inverter" ? 'data-action="inverter"' : entityAttr(entityId)}>
        <span class="aur-ring">${extra}<span><small>${escapeHtml(label)}</small><b>${escapeHtml(number)}</b><small>${escapeHtml(unit || u)}</small></span></span>
        ${note ? `<em>${escapeHtml(note)}</em>` : ""}
      </button>`;
  };
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const socArc = `<svg class="aur-soc" viewBox="0 0 110 110"><circle cx="55" cy="55" r="52"/><circle class="on" cx="55" cy="55" r="52" stroke-dasharray="${(soc / 100 * 326.7).toFixed(1)} 326.7" transform="rotate(-90 55 55)"/></svg>`;
  const f = m.forecast;
  const batteryNote = f.mode === "charging" || f.mode === "discharging" ? `${f.mode === "charging" ? t.chipFull : t.chipLasts} ${formatClock(f.at, locale)}` : batteryStatus(m);
  const batteryFlow = live.dischargeActive ? -live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const flowLabel = (x, y, cls, active, value) => active
    ? `<text class="aur-flow-label ${cls}" x="${x}" y="${y}">${escapeHtml(formatPower(value, locale))}</text>` : "";
  const sub = [positiveNumber(m.config.pv_capacity) && `${formatNumber(positiveNumber(m.config.pv_capacity), locale, 1)} kWp`,
    f.capacity && formatEnergy(f.capacity, locale)].filter(Boolean).join(" · ");
  return `
    <div class="aur-grain"></div>
    <header class="aur-header">
      <div><h1>${escapeHtml(m.name)}</h1>${sub ? `<div class="aur-sub">${escapeHtml(sub)}</div>` : ""}</div>
      <div class="aur-live ${m.status.state}"><i></i>${escapeHtml(m.t[m.status.state])} ${escapeHtml(clockText(m))}</div>
    </header>
    <div class="aur-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs><filter id="aur-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g fill="none" stroke-linecap="round">
          ${flowPath("M238 104 L238 147", live.solarActive, false, "pv", 'filter="url(#aur-glow)"')}
          ${flowPath("M108 165 Q165 148 220 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery", 'filter="url(#aur-glow)"')}
          ${flowPath("M256 165 Q311 148 368 165", live.importActive || live.exportActive, live.importActive, "grid", 'filter="url(#aur-glow)"')}
          ${flowPath("M238 183 L238 236", live.loadActive, false, "load", 'filter="url(#aur-glow)"')}
        </g>
        ${flowLabel(248, 130, "pv", live.solarActive, live.solar)}
        ${flowLabel(132, 146, "battery", live.chargeActive || live.dischargeActive, Math.abs(batteryFlow))}
        ${flowLabel(300, 146, "grid", live.importActive || live.exportActive, gridValue)}
      </svg>
      ${ring("pv", 238, 58, t.legendPv, powerParts(live.solar, locale), "", live.solarActive ? "" : t.idle, m.ids.live.solar)}
      ${ring("battery", 62, 165, t.legendSoc, [formatPercent(live.soc, locale), ""], batteryFlow ? `${batteryFlow < 0 ? "−" : "+"}${formatPower(Math.abs(batteryFlow), locale)}` : t.idle, batteryNote, batteryEntityId(m), socArc)}
      ${ring("grid", 414, 165, t.grid, powerParts(gridValue, locale), "", gridStatus(m), gridEntityId(m))}
      ${ring("home", 238, 282, t.home, powerParts(live.load, locale), "", "", m.ids.live.load)}
      <button class="aur-hub" style="${pos(238, 165)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">${MINI_ICONS.chip}</button>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Paper: an editorial page with a Sankey diagram of where the power goes.
// --------------------------------------------------------------------------

function sankeyHtml(m) {
  const { live, t, locale } = m;
  const sources = [
    ["pv", t.solar, live.solar, m.ids.live.solar],
    ["battery", t.battery, live.discharge, batteryEntityId(m)],
    ["grid", t.grid, live.gridImport, gridEntityId(m)],
  ].filter(([, , value]) => value > ACTIVE_W);
  const sinks = [
    ["load", t.home, live.load, m.ids.live.load],
    ["battery", t.battery, live.charge, batteryEntityId(m)],
    ["grid", t.grid, live.gridExport, gridEntityId(m)],
  ].filter(([, , value]) => value > ACTIVE_W);
  if (!sources.length || !sinks.length) return `<div class="pap-quiet">${escapeHtml(t.idle)}</div>`;
  const W = 468;
  const H = 200;
  const gap = 14;
  const sourceTotal = sources.reduce((s, [, , v]) => s + v, 0);
  const sinkTotal = sinks.reduce((s, [, , v]) => s + v, 0);
  const scale = (H - gap * (Math.max(sources.length, sinks.length) - 1)) / Math.max(sourceTotal, sinkTotal);
  const stack = (items) => {
    let y = 0;
    return items.map(([kind, label, value, entityId]) => {
      const node = { kind, label, value, entityId, y, h: Math.max(2, value * scale), used: 0 };
      y += node.h + gap;
      return node;
    });
  };
  const left = stack(sources);
  const right = stack(sinks);
  let ribbons = "";
  // Each source feeds the sinks in proportion to their size; the left end
  // of a ribbon is measured against the source, the right end against the
  // sink, so both bars fill exactly even when the totals differ slightly.
  for (const s of left) {
    for (const k of right) {
      const h = ((s.value * k.value) / sinkTotal) * scale;
      const hk = ((k.value * s.value) / sourceTotal) * scale;
      if (h < 0.5 && hk < 0.5) continue;
      const y0 = s.y + s.used;
      const y1 = k.y + k.used;
      s.used += h;
      k.used += hk;
      ribbons += `<path class="pap-ribbon ${s.kind}" d="M10 ${y0.toFixed(1)} C${W / 2} ${y0.toFixed(1)} ${W / 2} ${y1.toFixed(1)} ${W - 10} ${y1.toFixed(1)} L${W - 10} ${(y1 + hk).toFixed(1)} C${W / 2} ${(y1 + hk).toFixed(1)} ${W / 2} ${(y0 + h).toFixed(1)} 10 ${(y0 + h).toFixed(1)} Z"/>`;
    }
  }
  const bars = left.map((s) => `<rect class="pap-node ${s.kind}" x="0" y="${s.y.toFixed(1)}" width="10" height="${s.h.toFixed(1)}"/>`).join("")
    + right.map((k) => `<rect class="pap-node sink ${k.kind}" x="${W - 10}" y="${k.y.toFixed(1)}" width="10" height="${k.h.toFixed(1)}"/>`).join("");
  const label = (node, side) => `
    <button class="pap-label ${side}" style="top:${((Math.max(0, node.y + node.h / 2 - 16) / H) * 100).toFixed(1)}%" ${entityAttr(node.entityId)}>
      <b>${escapeHtml(formatPower(node.value, locale))}</b>${escapeHtml(node.label)}${node.kind === "battery" && isNum(live.soc) ? ` · ${escapeHtml(formatPercent(live.soc, locale))}` : ""}
    </button>`;
  return `
    <div class="pap-sankey">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${ribbons}${bars}</svg>
      ${left.map((n) => label(n, "left")).join("")}
      ${right.map((n) => label(n, "right")).join("")}
    </div>`;
}

function renderPaper(m) {
  const { t, locale, live } = m;
  const load = live.load;
  let lede = "";
  if (load > ACTIVE_W) {
    const bat = (live.discharge / load) * 100;
    const grid = (live.gridImport / load) * 100;
    const pv = clamp(100 - bat - grid, 0, 100);
    lede = bat < 1 && grid < 1
      ? t.paperSunOnly
      : fill(t.paperShares, { pv: `<em>${Math.round(pv)}</em>`, bat: `<em>${Math.round(bat)}</em>`, grid: `<em>${Math.round(grid)}</em>` });
  }
  const f = m.forecast;
  if (f.mode === "discharging") lede += ` ${fill(t.paperLasts, { time: `<em>${formatClock(f.at, locale)}</em>` })}`;
  if (f.mode === "charging") lede += ` ${fill(t.paperFull, { time: `<em>${formatClock(f.at, locale)}</em>` })}`;
  if (live.exportActive) lede += ` ${fill(t.paperExport, { power: `<em>${formatPower(live.gridExport, locale)}</em>` })}`;
  const date = m.now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  return `
    <div class="pap-eyebrow"><span>${escapeHtml(m.name)}</span><span>${escapeHtml(date)} · ${escapeHtml(clockText(m))} ${liveBadge(m)}</span></div>
    <h1 class="pap-headline" ${entityAttr(m.ids.live.load)}>${escapeHtml(fill(t.paperHeadline, { power: formatPower(load, locale) }))}</h1>
    ${lede ? `<p class="pap-lede">${lede.replace(/<(?!\/?em>)/g, "&lt;")}</p>` : ""}
    <hr>
    ${sankeyHtml(m)}
    <button type="button" class="sfc-link pap-inverter" data-action="inverter">${escapeHtml(t.inverterDetails)} →</button>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// LCARS: a starship operations panel.
// --------------------------------------------------------------------------

function lcarsSegments(value, max, count = 16) {
  const on = isNum(value) && value > ACTIVE_W ? clamp(Math.ceil((value / max) * count), 1, count) : 0;
  return Array.from({ length: count }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("");
}

function renderLcars(m) {
  const { t, locale, live } = m;
  const max = Math.max(3000, (positiveNumber(m.config.pv_capacity) || 0) * 1000, live.solar, live.load, live.charge, live.discharge, live.gridImport, live.gridExport);
  const row = (cls, label, value, entityId) => `
    <button class="lc-row ${cls}" ${entityAttr(entityId)}>
      <span class="lc-label">${escapeHtml(label)}</span>
      <span class="lc-track">${lcarsSegments(value, max)}</span>
      <span class="lc-value">${escapeHtml(isNum(value) ? `${formatNumber(value / 1000, locale, value < 100 ? 3 : 2)} kW` : "—")}</span>
    </button>`;
  const cellsOn = isNum(live.soc) ? Math.round(clamp(live.soc, 0, 100) / 10) : 0;
  const f = m.forecast;
  const status = m.systemStatus;
  const autarkyToday = isNum(m.today.load) && isNum(m.today.gridImport) && m.today.load > 0.05
    ? formatPercent(clamp(((m.today.load - m.today.gridImport) / m.today.load) * 100, 0, 100), locale) : "—";
  const code = String(m.station || "47").replace(/\D/g, "").slice(-5).padStart(5, "0");
  const side = [
    ["c1", "01", t.lcarsPanels, m.panels ? 'data-action="panels"' : ""],
    ["c2", "02", t.battery, entityAttr(batteryEntityId(m))],
    ["c3", "03", t.grid, entityAttr(gridEntityId(m))],
    ["c4", "04", t.inverter, 'data-action="inverter"'],
    ["c5", "05", t.home, entityAttr(m.ids.live.load)],
  ];
  return `
    <div class="lc-frame">
      <div class="lc-elbow top"><span>${escapeHtml(`${code.slice(0, 2)}-${code.slice(2)}`)}</span></div>
      <div class="lc-topbar"><h1>${escapeHtml(fill(t.lcarsTitle, { name: m.name }))}</h1><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
      <nav class="lc-side">
        ${side.map(([cls, num, label, attr]) => `<button class="${cls}" ${attr}><small>${num}-${(label.length * 7) % 10}</small>${escapeHtml(label)}</button>`).join("")}
        <span class="lc-fill"></span>
      </nav>
      <div class="lc-main">
        ${row("pv", t.lcarsPvIn, live.solar, m.ids.live.solar)}
        ${row("battery", live.chargeActive ? t.lcarsBatIn : t.lcarsBatOut, live.chargeActive ? live.charge : live.discharge, batteryEntityId(m))}
        ${row("grid", live.exportActive ? t.lcarsGridOut : t.lcarsGridIn, live.exportActive ? live.gridExport : live.gridImport, gridEntityId(m))}
        ${row("home", t.lcarsHome, live.load, m.ids.live.load)}
        <div class="lc-soc">
          <div class="lc-cells">${Array.from({ length: 10 }, (_, i) => `<i class="${i < cellsOn ? "on" : ""}"></i>`).join("")}</div>
          <div class="lc-readout">
            <div><span>${escapeHtml(t.stateOfCharge)}</span><b>${escapeHtml(formatPercent(live.soc, locale))}</b></div>
            <div><span>${escapeHtml(t.stored)}</span><b>${escapeHtml(isNum(f.stored) ? formatEnergy(f.stored, locale) : "—")}</b></div>
            <div><span>${escapeHtml(f.mode === "charging" ? t.chipFull : t.autonomy)}</span><b>${escapeHtml(f.at ? formatClock(f.at, locale) : "—")}</b></div>
            <div><span>${escapeHtml(t.autarkyToday)}</span><b>${escapeHtml(autarkyToday)}</b></div>
          </div>
        </div>
        <div class="lc-status ${status}">${escapeHtml(t[`status${status[0].toUpperCase()}${status.slice(1)}`])}</div>
        <div class="sfc-sections">${standardSections(m)}</div>
      </div>
      <div class="lc-elbow bottom"></div>
      <div class="lc-botbar"><span>${escapeHtml(clockText(m))}</span><i></i><span>${escapeHtml(m.t[m.status.state])}</span></div>
    </div>`;
}

// --------------------------------------------------------------------------
// Atlantis: a holographic power core.
// --------------------------------------------------------------------------

function renderAtlantis(m) {
  const { t, locale, live } = m;
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const arc = ((soc / 100) * 603.2).toFixed(1);
  const f = m.forecast;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const r1 = 128;
    const r2 = i % 6 ? 134 : 140;
    return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * r2).toFixed(1)}" y2="${(Math.sin(a) * r2).toFixed(1)}"/>`;
  }).join("");
  const label = (style, small, value, note, entityId, cls = "") => `
    <button class="atl-label ${cls}" style="${style}" ${entityId === "inverter" ? 'data-action="inverter"' : entityAttr(entityId)}>
      ${small ? `<small>${escapeHtml(small)}</small>` : ""}<b>${escapeHtml(value)}</b>${note ? `<small>${escapeHtml(note)}</small>` : ""}
    </button>`;
  return `
    <div class="atl-scan"></div>
    <header class="atl-header">
      <div><h1>${escapeHtml(t.coreTitle)}</h1><div class="atl-sub">${escapeHtml(m.name)} · ${escapeHtml(t.sector)} ${escapeHtml(String(m.station || "—"))} · ${escapeHtml(clockText(m))}</div></div>
      <div class="atl-glyphs ${m.status.state}">◇ ⟡ ◈ ⟐</div>
    </header>
    <div class="atl-core">
      <svg viewBox="0 0 480 330" aria-hidden="true">
        <defs>
          <filter id="atl-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="atl-fill" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7ff3ff" stop-opacity=".55"/><stop offset=".6" stop-color="#00b6e6" stop-opacity=".18"/><stop offset="1" stop-color="#00b6e6" stop-opacity="0"/></radialGradient>
        </defs>
        <g transform="translate(240 165)" fill="none">
          <g class="atl-ticks">${ticks}</g>
          <circle r="104" class="atl-thin"/>
          <circle r="96" class="atl-track"/>
          <circle r="96" class="atl-arc ${live.chargeActive ? "charging" : ""}" stroke-dasharray="${arc} 603.2" transform="rotate(-90)" filter="url(#atl-glow)"/>
          <circle r="72" fill="url(#atl-fill)" class="atl-pulse ${live.chargeActive ? "charging" : live.dischargeActive ? "discharging" : ""}"/>
          <path d="M0 -62 L54 -31 L54 31 L0 62 L-54 31 L-54 -31 Z" class="atl-crystal" filter="url(#atl-glow)"/>
        </g>
        <g fill="none" stroke-linecap="round" filter="url(#atl-glow)">
          ${flowPath("M240 18 L240 69", live.solarActive, false, "pv")}
          ${flowPath("M60 165 L144 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery")}
          ${flowPath("M420 165 L336 165", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${flowPath("M240 261 L240 312", live.loadActive, false, "load")}
        </g>
      </svg>
      <button class="atl-center" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <small>${escapeHtml(t.battery)}</small><b>${escapeHtml(formatPercent(live.soc, locale))}</b>
        <small>${escapeHtml(isNum(f.stored) ? formatEnergy(f.stored, locale) : batteryStatus(m))}</small>
        ${f.at ? `<small class="atl-when" title="${escapeHtml(f.mode === "charging" ? t.chipFull : t.chipLasts)}">${f.mode === "charging" ? "▲" : "▼"} ${escapeHtml(formatClock(f.at, locale))}</small>` : ""}
      </button>
      ${label("left:50%;top:3%", "", formatPower(live.solar, locale), t.sun, m.ids.live.solar, "pv")}
      ${label("left:10%;top:50%", live.chargeActive ? t.absorbing : live.dischargeActive ? t.supplying : t.idle, formatPower(batteryFlow, locale), "", batteryEntityId(m))}
      ${label("left:90%;top:50%", t.grid, formatPower(gridValue, locale), gridStatus(m), gridEntityId(m), "grid")}
      ${label("left:50%;top:97%", "", formatPower(live.load, locale), t.home, m.ids.live.load, "load")}
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

const THEME_RENDER = {
  diorama: renderDiorama,
  aurora: renderAurora,
  paper: renderPaper,
  lcars: renderLcars,
  atlantis: renderAtlantis,
};


const BASE_CSS = `
  :host { display: block; }
  ha-card.sfc {
    display: block;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    container-type: inline-size;
    font-family: var(--sfc-font);
    color: var(--sfc-text);
    background: var(--sfc-bg);
    border: 1px solid var(--sfc-frame, var(--sfc-border));
    border-radius: var(--sfc-radius, 24px);
    box-shadow: var(--sfc-shadow, none);
  }
  .sfc button { font: inherit; color: inherit; }
  .sfc [data-entity], .sfc [data-action] { cursor: pointer; }
  .sfc .sfc-click { cursor: pointer; }
  .sfc-sections { display: grid; gap: 12px; padding: 0 16px 16px; position: relative; }
  .sfc-section {
    padding: 14px;
    border-radius: var(--sfc-section-radius, 16px);
    background: var(--sfc-surface);
    border: 1px solid var(--sfc-border);
  }
  .sfc-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; }
  .sfc-head > div { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .sfc-head h3 { margin: 0; font-size: 16px; font-family: var(--sfc-heading-font, inherit); font-weight: var(--sfc-heading-weight, 700); }
  .sfc-kicker {
    display: inline-grid; place-items: center; min-width: 34px; height: 24px; padding: 0 8px; box-sizing: border-box;
    border-radius: 999px; background: var(--sfc-accent-soft); color: var(--sfc-accent);
    font-size: 10px; font-weight: 800; letter-spacing: .05em;
  }
  .sfc-kicker svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; }
  .sfc-hint { color: var(--sfc-muted); font-size: 11px; text-align: right; }
  .sfc-link { border: 0; background: none; color: var(--sfc-accent); font-weight: 700; font-size: 12px; cursor: pointer; padding: 0; }
  .sfc-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700;
    background: var(--sfc-badge-bg, rgba(0,0,0,.08)); color: var(--sfc-badge-text, inherit); vertical-align: middle; }
  .sfc-badge i { width: 7px; height: 7px; border-radius: 50%; background: #22c58b; }
  .sfc-badge.delayed i { background: #f0a020; }
  .sfc-badge.offline i { background: #e5484d; }

  /* Tabs */
  .sfc-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; padding: 4px; margin-bottom: 12px;
    border-radius: var(--sfc-tabs-radius, 12px); background: var(--sfc-tab-bg); }
  .sfc-tab { border: 0; background: transparent; color: var(--sfc-muted); padding: 7px 2px; border-radius: var(--sfc-tab-radius, 9px);
    font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-tab.on { background: var(--sfc-tab-on-bg); color: var(--sfc-tab-on); box-shadow: var(--sfc-tab-shadow, none); cursor: default; }

  /* Energy tiles */
  .sfc-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  @container (min-width: 620px) { .sfc-tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  .sfc-tile { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 12px; text-align: left;
    border-radius: var(--sfc-tile-radius, 13px); border: 1px solid var(--sfc-border); background: var(--sfc-tile-bg); color: var(--sfc-c); }
  .sfc-tile:disabled { opacity: .55; cursor: default; }
  .sfc-tile.solar, .sfc-summary-item.selfuse, .sfc-summary-item.yield { --sfc-c: var(--sfc-pv); }
  .sfc-tile.load { --sfc-c: var(--sfc-load); }
  .sfc-tile.gridImport, .sfc-tile.gridExport, .sfc-summary-item.autarky { --sfc-c: var(--sfc-grid); }
  .sfc-tile.charge, .sfc-tile.discharge, .sfc-summary-item.money, .sfc-summary-item.co2 { --sfc-c: var(--sfc-battery); }
  .sfc-tile-icon { flex: 0 0 34px; width: 34px; height: 34px; display: grid; place-items: center;
    border-radius: var(--sfc-icon-radius, 10px); background: color-mix(in srgb, var(--sfc-c) 16%, transparent); }
  .sfc-tile-icon svg, .sfc-forecast-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .sfc-tile-copy { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .sfc-tile small, .sfc-summary-item small { color: var(--sfc-muted); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-tile strong { color: var(--sfc-text); font-size: 15px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }
  .sfc-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(98px, 1fr)); gap: 8px; margin-top: 10px; }
  .sfc-summary-item { min-width: 0; padding: 8px 10px; border-radius: var(--sfc-tile-radius, 11px); border: 1px solid var(--sfc-border);
    background: color-mix(in srgb, var(--sfc-tile-bg) 85%, var(--sfc-c, var(--sfc-accent)) 15%); }
  .sfc-summary-item small { display: block; font-size: 10px; }
  .sfc-summary-item strong { display: block; margin-top: 2px; font-size: 14px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }

  /* Battery forecast */
  .sfc-forecast { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px 12px; }
  .sfc-forecast-icon { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; color: var(--sfc-battery);
    background: color-mix(in srgb, var(--sfc-battery) 16%, transparent); }
  .sfc-forecast-copy { min-width: 0; }
  .sfc-forecast-copy small { display: block; color: var(--sfc-muted); font-size: 11px; }
  .sfc-forecast-copy strong { display: block; font-size: 14px; margin-top: 1px; }
  .sfc-forecast-copy em { display: block; color: var(--sfc-muted); font-size: 11px; font-style: normal; }
  .sfc-forecast-stored { font-size: 14px; white-space: nowrap; font-family: var(--sfc-num-font, inherit); }
  .sfc-forecast-bar { grid-column: 1 / -1; position: relative; height: 7px; border-radius: 999px; background: var(--sfc-track); }
  .sfc-forecast-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: var(--sfc-battery); }
  .sfc-forecast-bar b { position: absolute; top: -3px; bottom: -3px; width: 2px; border-radius: 1px; background: var(--sfc-load); }

  /* Inverter details */
  .sfc-group + .sfc-group { margin-top: 12px; }
  .sfc-group h4, .sfc-serial { margin: 0 0 7px; color: var(--sfc-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .sfc-strings { display: grid; gap: 7px; }
  .sfc-string, .sfc-reading { min-width: 0; border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); text-align: left; }
  .sfc-string { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 10px; padding: 9px 12px; border-left: 3px solid var(--sfc-pv); }
  .sfc-string span { font-size: 12px; font-weight: 700; }
  .sfc-string b { grid-row: span 2; align-self: center; font-size: 15px; font-family: var(--sfc-num-font, inherit); }
  .sfc-string small { color: var(--sfc-muted); font-size: 11px; }
  .sfc-readings { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 7px; }
  .sfc-reading { padding: 8px 10px; }
  .sfc-reading small { display: block; color: var(--sfc-muted); font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-reading b { display: block; margin-top: 2px; font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-empty-note { margin: 0; color: var(--sfc-muted); font-size: 12px; }

  /* Panels */
  .sfc-panel-string + .sfc-panel-string { margin-top: 8px; }
  .sfc-string-label { display: block; margin-bottom: 5px; color: var(--sfc-muted); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  .sfc-panel-grid { display: grid; grid-template-columns: repeat(var(--cols, 8), minmax(0, 1fr)); gap: 6px; }
  @container (max-width: 420px) { .sfc-panel-grid { grid-template-columns: repeat(min(var(--cols, 8), 4), minmax(0, 1fr)); } }
  .sfc-panel { min-width: 0; padding: 8px 4px; display: grid; justify-items: center; gap: 1px; border-radius: var(--sfc-tile-radius, 10px);
    border: 1px solid color-mix(in srgb, var(--sfc-pv) 30%, var(--sfc-border));
    background: linear-gradient(0deg, color-mix(in srgb, var(--sfc-pv) 22%, transparent) var(--share), transparent var(--share)), var(--sfc-tile-bg); }
  .sfc-panel.weak { border-color: var(--sfc-load); box-shadow: inset 0 0 0 1px var(--sfc-load); }
  .sfc-panel small { color: var(--sfc-muted); font-size: 10px; font-weight: 700; }
  .sfc-panel strong { font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-panel span { color: var(--sfc-muted); font-size: 10px; }
  .sfc-panels-note { margin: 10px 0 0; color: var(--sfc-muted); font-size: 11px; }
  .sfc-panels-note.warn { color: var(--sfc-load); }

  /* Chart */
  .sfc-chart { margin-bottom: 12px; }
  .sfc-chart.loading .sfc-plot { opacity: .55; }
  .sfc-legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-bottom: 8px; }
  .sfc-legend span { display: inline-flex; align-items: center; gap: 5px; color: var(--sfc-muted); font-size: 11px; font-weight: 650; }
  .sfc-legend i, .sfc-tip i { display: inline-block; width: 9px; height: 9px; border-radius: 3px; background: currentColor; }
  .pv > i { color: var(--sfc-pv); } .load > i { color: var(--sfc-load); } .battery > i { color: var(--sfc-battery); }
  .grid > i { color: var(--sfc-grid); } .export > i { color: color-mix(in srgb, var(--sfc-grid) 55%, var(--sfc-muted)); }
  .soc > i { color: color-mix(in srgb, var(--sfc-battery) 55%, var(--sfc-muted)); height: 2px; }
  .sfc-plot { position: relative; height: 180px; margin-left: 46px; touch-action: pan-y; cursor: crosshair; }
  @container (min-width: 620px) { .sfc-plot { height: 220px; } }
  .sfc-plot svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .sfc-gridline { stroke: var(--sfc-border); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .sfc-gridline.zero { stroke: color-mix(in srgb, var(--sfc-muted) 60%, transparent); }
  .sfc-line { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
  .sfc-line.pv { stroke: var(--sfc-pv); } .sfc-line.load { stroke: var(--sfc-load); }
  .sfc-line.battery { stroke: var(--sfc-battery); stroke-width: 1.5; } .sfc-line.grid { stroke: var(--sfc-grid); stroke-width: 1.5; }
  .sfc-line.soc { stroke: color-mix(in srgb, var(--sfc-battery) 55%, var(--sfc-muted)); stroke-dasharray: 4 4; stroke-width: 1.5; }
  .sfc-area.pv { fill: color-mix(in srgb, var(--sfc-pv) 22%, transparent); }
  .sfc-area.battery { fill: color-mix(in srgb, var(--sfc-battery) 20%, transparent); }
  .sfc-bar.pv { fill: var(--sfc-pv); } .sfc-bar.load { fill: var(--sfc-load); } .sfc-bar.grid { fill: var(--sfc-grid); }
  .sfc-ylabel { position: absolute; right: calc(100% + 6px); transform: translateY(-50%); color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-xaxis { position: relative; height: 18px; margin: 4px 0 0 46px; }
  .sfc-xaxis span { position: absolute; top: 2px; transform: translateX(-50%); color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-cursor { position: absolute; top: 0; bottom: 0; width: 1px; background: color-mix(in srgb, var(--sfc-text) 45%, transparent); pointer-events: none; }
  .sfc-tip { position: absolute; top: 4px; z-index: 5; min-width: 150px; margin-left: 10px; padding: 8px 10px; display: grid; gap: 4px;
    border: 1px solid var(--sfc-border); border-radius: 12px; background: var(--sfc-tip-bg, var(--sfc-surface)); color: var(--sfc-text);
    box-shadow: 0 10px 24px rgba(0, 0, 0, .25); font-size: 11px; pointer-events: none; }
  .sfc-tip[hidden], .sfc-cursor[hidden] { display: none; }
  .sfc-tip.flip { transform: translateX(calc(-100% - 20px)); }
  .sfc-tip span { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 6px; color: var(--sfc-muted); }
  .sfc-tip b { color: var(--sfc-text); }
  .sfc-chart-hint { margin: 2px 0 0; color: var(--sfc-muted); font-size: 10px; }
  .sfc-chart-empty { display: grid; place-items: center; height: 110px; border: 1px dashed var(--sfc-border); border-radius: 12px; color: var(--sfc-muted); font-size: 12px; }

  /* Animated flows */
  .sfc-flow-base { fill: none; stroke: var(--sfc-flow-base); stroke-width: var(--sfc-flow-w, 4); stroke-linecap: round; }
  .sfc-flow { fill: none; stroke-width: var(--sfc-flow-w, 4); stroke-linecap: round; stroke-dasharray: var(--sfc-dash, 1 9);
    animation: sfc-dash var(--sfc-dash-speed, 1s) linear infinite; }
  .sfc-flow.rev { animation-direction: reverse; }
  .sfc-flow.pv { stroke: var(--sfc-pv); } .sfc-flow.load { stroke: var(--sfc-load); }
  .sfc-flow.battery { stroke: var(--sfc-battery); } .sfc-flow.grid { stroke: var(--sfc-grid); }
  @keyframes sfc-dash { to { stroke-dashoffset: calc(-1 * var(--sfc-dash-len, 10)); } }
  .no-anim .sfc-flow, .no-anim .atl-pulse, .no-anim .aur-ring { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .sfc-flow, .atl-pulse, .aur-ring { animation: none !important; } }

  .sfc-empty { padding: 28px; text-align: center; }
  .sfc-empty h2 { margin: 0 0 6px; font-size: 18px; }
  .sfc-empty p { margin: 0; color: var(--sfc-muted); }
`;

const THEME_CSS = {
  // ---------------------------------------------------------------- Diorama
  diorama: `
    .sfc {
      --sfc-font: "Nunito", system-ui, sans-serif;
      --sfc-bg: #ffffff; --sfc-surface: #f5f8fb; --sfc-border: #e3eaf1; --sfc-text: #24364a; --sfc-muted: #6a7d92;
      --sfc-pv: #f5a400; --sfc-load: #f26b5b; --sfc-battery: #1fbf86; --sfc-grid: #5b8def;
      --sfc-accent: #3b82f6; --sfc-accent-soft: #e3eefe; --sfc-tile-bg: #ffffff; --sfc-track: #e7eef4;
      --sfc-tab-bg: #eaf0f6; --sfc-tab-on-bg: #ffffff; --sfc-tab-on: #24364a; --sfc-tab-shadow: 0 2px 8px rgba(30,60,90,.12);
      --sfc-flow-base: rgba(255,255,255,.0); --sfc-flow-w: 4;
      --sfc-radius: 28px; --sfc-shadow: 0 18px 50px rgba(30,70,110,.18); --sfc-frame: transparent;
    }
    .dio-scene { position: relative; aspect-ratio: 520 / 360; background: linear-gradient(180deg, var(--sky-a) 0%, var(--sky-b) 70%); }
    .dio-scene svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .dio-title { position: absolute; left: 4%; top: 4.5%; color: #fff; text-shadow: 0 1px 8px rgba(20,60,100,.35); }
    .dio-title h1 { margin: 0 0 4px; font-size: clamp(18px, 4.6cqw, 26px); font-weight: 800; }
    .dio-title .sfc-badge { --sfc-badge-bg: rgba(255,255,255,.28); --sfc-badge-text: #fff; text-shadow: none; backdrop-filter: blur(6px); }
    .dio-clock { position: absolute; right: 3.5%; top: 5%; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,.3);
      color: #fff; font-weight: 800; font-size: 12px; backdrop-filter: blur(6px); }
    .dio-pill { position: absolute; display: flex; align-items: center; gap: 6px; padding: 6px 11px 6px 9px; border: 0; border-radius: 999px;
      background: rgba(255,255,255,.93); box-shadow: 0 6px 16px rgba(30,60,90,.18); color: #24364a; font-size: clamp(10px, 2.4cqw, 13px);
      font-weight: 800; white-space: nowrap; transition: transform .2s; }
    .dio-pill:hover { transform: translateY(-2px); }
    .dio-pill i { width: 10px; height: 10px; border-radius: 50%; }
    .dio-pill i.pv { background: var(--sfc-pv); } .dio-pill i.battery { background: var(--sfc-battery); }
    .dio-pill i.grid { background: var(--sfc-grid); } .dio-pill i.load { background: var(--sfc-load); }
    .dio-pill small { font-weight: 700; color: #6a7d92; }
    .dio-bottom { padding: 16px; }
    .dio-chips { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .dio-chip { min-width: 0; padding: 12px; border: 0; border-radius: 18px; text-align: left; background: #f3f7fb; }
    .dio-chip.sun { background: #fff6dc; } .dio-chip.bat { background: #e3f7ee; } .dio-chip.home { background: #fde9e4; }
    .dio-chip small { display: block; font-size: 11px; font-weight: 700; color: #6a7d92; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dio-chip b { display: block; margin-top: 2px; font-size: clamp(15px, 3.8cqw, 20px); font-weight: 800; }
    .dio-share { margin-top: 14px; }
    .dio-share header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; }
    .dio-share header span { color: #6a7d92; font-weight: 700; }
    .dio-track { height: 14px; margin-top: 7px; display: flex; overflow: hidden; border-radius: 999px; background: #eef2f6; }
    .dio-track .pv { background: #ffc23d; } .dio-track .battery { background: #2bc48f; } .dio-track .grid { background: #7aa4f2; }
    .sfc-section { border: 0; border-radius: 20px; }
    .sfc-flow { --sfc-dash: 1 9; }
  `,
  // ----------------------------------------------------------------- Aurora
  aurora: `
    .sfc {
      --sfc-font: "Space Grotesk", system-ui, sans-serif; --sfc-num-font: "JetBrains Mono", ui-monospace, monospace;
      --sfc-bg: radial-gradient(60% 40% at 15% 0%, rgba(0,255,200,.18), transparent 70%), radial-gradient(50% 40% at 100% 30%, rgba(140,80,255,.22), transparent 70%), radial-gradient(70% 50% at 50% 110%, rgba(255,60,160,.16), transparent 70%), #0a0d1a;
      --sfc-surface: rgba(255,255,255,.035); --sfc-border: rgba(255,255,255,.08); --sfc-text: #e9f1ff; --sfc-muted: #8390b8;
      --sfc-pv: #ffd23f; --sfc-load: #ff4fa3; --sfc-battery: #4dffd2; --sfc-grid: #a28bff;
      --sfc-accent: #4dffd2; --sfc-accent-soft: rgba(77,255,210,.12); --sfc-tile-bg: rgba(255,255,255,.03); --sfc-track: rgba(255,255,255,.08);
      --sfc-tab-bg: rgba(255,255,255,.04); --sfc-tab-on-bg: #4dffd2; --sfc-tab-on: #0a0d1a; --sfc-tab-shadow: 0 0 14px rgba(77,255,210,.55);
      --sfc-tip-bg: #121731; --sfc-badge-bg: rgba(255,255,255,.06);
      --sfc-flow-base: rgba(255,255,255,.07); --sfc-flow-w: 3; --sfc-dash: 2 16; --sfc-dash-len: 18;
      --sfc-radius: 28px; --sfc-shadow: 0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06);
      background: var(--sfc-bg);
    }
    .aur-grain { position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 4px 4px; }
    .aur-header { position: relative; display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 20px 0; }
    .aur-header h1 { margin: 0; font-size: 22px; letter-spacing: -.02em; }
    .aur-sub { margin-top: 2px; color: var(--sfc-muted); font-size: 12px; }
    .aur-live { display: flex; align-items: center; gap: 6px; font-family: var(--sfc-num-font); font-size: 11px; color: #4dffd2; text-transform: uppercase; }
    .aur-live i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
    .aur-live.delayed { color: #ffb648; } .aur-live.offline { color: #ff5d73; }
    .aur-stage { position: relative; aspect-ratio: 476 / 330; margin: 4px 22px 8px; }
    .aur-stage > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .aur-flow-label { font-family: var(--sfc-num-font); font-size: 11px; }
    .aur-flow-label.pv { fill: var(--sfc-pv); } .aur-flow-label.battery { fill: var(--sfc-battery); } .aur-flow-label.grid { fill: var(--sfc-grid); }
    .aur-node { position: absolute; width: 24%; transform: translate(-50%, -50%); padding: 0; border: 0; background: none; text-align: center; }
    .aur-node.pv { --c1: #ffd23f; --c2: #ff8a00; } .aur-node.battery { --c1: #4dffd2; --c2: #00a3ff; }
    .aur-node.grid { --c1: #a28bff; --c2: #c94dff; } .aur-node.home { --c1: #ff4fa3; --c2: #ff7a59; }
    .aur-ring { position: relative; width: 80%; aspect-ratio: 1; margin: 0 auto; border-radius: 50%; display: grid; place-items: center;
      background: rgba(10,13,26,.78); box-shadow: 0 0 30px color-mix(in srgb, var(--c1) 45%, transparent), inset 0 0 25px color-mix(in srgb, var(--c1) 22%, transparent);
      animation: aur-breathe 4s ease-in-out infinite; }
    .aur-ring::before { content: ""; position: absolute; inset: 0; border-radius: 50%; padding: 2px;
      background: conic-gradient(from 200deg, var(--c1), var(--c2), var(--c1));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
    .aur-ring > span { position: relative; display: grid; justify-items: center; }
    .aur-ring b { font-family: var(--sfc-num-font); font-size: clamp(12px, 3.4cqw, 18px); }
    .aur-ring small { font-size: clamp(7px, 1.8cqw, 9px); color: #9aa6cc; letter-spacing: .14em; text-transform: uppercase; }
    .aur-node em { display: block; margin-top: 6px; font-style: normal; font-size: clamp(9px, 2cqw, 11px); color: #9aa6cc; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
    .aur-soc { position: absolute; inset: -9%; width: 118%; height: 118%; }
    .aur-soc circle { fill: none; stroke: rgba(77,255,210,.12); stroke-width: 3; }
    .aur-soc circle.on { stroke: #4dffd2; stroke-linecap: round; }
    .aur-hub { position: absolute; width: 8%; aspect-ratio: 1; transform: translate(-50%, -50%); display: grid; place-items: center; padding: 0;
      border-radius: 50%; border: 1px solid rgba(77,255,210,.45); background: #0a0d1a; color: #4dffd2; box-shadow: 0 0 16px rgba(77,255,210,.35); }
    .aur-hub svg { width: 60%; fill: none; stroke: currentColor; stroke-width: 1.8; }
    @keyframes aur-breathe { 50% { box-shadow: 0 0 42px color-mix(in srgb, var(--c1) 60%, transparent), inset 0 0 30px color-mix(in srgb, var(--c1) 28%, transparent); } }
    .sfc-section { backdrop-filter: blur(6px); }
    .sfc-head h3 { letter-spacing: -.01em; }
    .sfc-kicker { font-family: var(--sfc-num-font); }
    .sfc-tab { font-family: var(--sfc-num-font); text-transform: uppercase; }
    .sfc-flow { filter: drop-shadow(0 0 4px currentColor); }
  `,
  // ------------------------------------------------------------------ Paper
  paper: `
    .sfc {
      --sfc-font: "Inter", system-ui, sans-serif; --sfc-heading-font: "Fraunces", Georgia, serif; --sfc-num-font: "Fraunces", Georgia, serif;
      --sfc-heading-weight: 600;
      --sfc-bg: #f6f1e7; --sfc-surface: transparent; --sfc-border: #ddd3c2; --sfc-text: #2a2722; --sfc-muted: #8a8173;
      --sfc-pv: #c9862b; --sfc-load: #a8473a; --sfc-battery: #6f8f6a; --sfc-grid: #56677a;
      --sfc-accent: #b06a1f; --sfc-accent-soft: transparent; --sfc-tile-bg: transparent; --sfc-track: #e6ddcd;
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: transparent; --sfc-tab-on: #2a2722; --sfc-tip-bg: #fbf8f1;
      --sfc-radius: 6px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-shadow: 0 20px 40px rgba(60,45,20,.15); --sfc-frame: #e6ddcd;
      --sfc-badge-bg: #ece4d4;
      padding: 24px 22px 6px;
    }
    .pap-eyebrow { display: flex; justify-content: space-between; gap: 10px; align-items: center; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--sfc-muted); }
    .pap-eyebrow .sfc-badge { letter-spacing: .04em; margin-left: 6px; }
    .pap-headline { margin: 8px 0 4px; font-family: var(--sfc-heading-font); font-weight: 600; font-size: clamp(26px, 7cqw, 38px); letter-spacing: -.02em; line-height: 1.05; }
    .pap-lede { margin: 0 0 16px; font-family: var(--sfc-heading-font); font-size: 15px; line-height: 1.45; color: #5b5448; }
    .pap-lede em { font-style: italic; color: var(--sfc-accent); }
    .sfc hr { border: 0; border-top: 1px solid var(--sfc-border); margin: 0; }
    .pap-sankey { position: relative; margin: 16px 0 8px; aspect-ratio: 468 / 200; }
    .pap-sankey svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .pap-ribbon { opacity: .5; } .pap-ribbon.pv { fill: var(--sfc-pv); } .pap-ribbon.battery { fill: var(--sfc-battery); } .pap-ribbon.grid { fill: var(--sfc-grid); }
    .pap-node.pv { fill: var(--sfc-pv); } .pap-node.battery { fill: var(--sfc-battery); } .pap-node.grid { fill: var(--sfc-grid); }
    .pap-node.sink.load { fill: var(--sfc-text); }
    .pap-label { position: absolute; padding: 0; border: 0; background: none; font-size: 11px; color: #5b5448; text-align: left; line-height: 1.2; }
    .pap-label.left { left: 4%; } .pap-label.right { right: 4%; text-align: right; }
    .pap-label b { display: block; font-family: var(--sfc-heading-font); font-size: clamp(15px, 4cqw, 20px); font-weight: 600; color: var(--sfc-text); }
    .pap-quiet { padding: 30px 0; text-align: center; font-family: var(--sfc-heading-font); font-style: italic; color: var(--sfc-muted); }
    .pap-inverter { display: block; margin: 4px 0 14px auto; font-family: var(--sfc-heading-font); font-style: italic; font-weight: 400; color: var(--sfc-accent); }
    .sfc-sections { padding: 0 0 16px; gap: 18px; }
    .sfc-section { padding: 14px 0 0; border: 0; border-top: 1px solid var(--sfc-border); }
    .sfc-head h3 { font-size: 18px; }
    .sfc-kicker { background: none; padding: 0; min-width: 0; color: var(--sfc-accent); font-size: 11px; }
    .sfc-tabs { padding: 0; gap: 14px; grid-auto-columns: max-content; }
    .sfc-tab { padding: 2px 0; border-radius: 0; font-weight: 500; font-size: 12px; }
    .sfc-tab.on { border-bottom: 1.5px solid var(--sfc-text); }
    .sfc-tiles { gap: 0; border-top: 1px solid var(--sfc-border); }
    .sfc-tile { border: 0; border-bottom: 1px solid var(--sfc-border); padding: 10px 4px; }
    .sfc-tile-icon { display: none; }
    .sfc-tile small, .sfc-summary-item small { text-transform: uppercase; letter-spacing: .12em; font-size: 9px; }
    .sfc-tile strong { font-size: 20px; font-weight: 600; }
    .sfc-summary-item { background: none; border: 0; border-left: 1px solid var(--sfc-border); }
    .sfc-summary-item strong { font-size: 18px; font-weight: 600; }
    .sfc-forecast { padding-top: 14px; }
    .sfc-forecast-icon { display: none; }
    .sfc-forecast-copy strong { font-family: var(--sfc-heading-font); font-size: 18px; font-weight: 600; }
    .sfc-flow { display: none; }
    .sfc-panel { border-radius: 0; }
  `,
  // ------------------------------------------------------------------ LCARS
  lcars: `
    .sfc {
      --sfc-font: "Antonio", "Arial Narrow", sans-serif; --sfc-num-font: "Antonio", "Arial Narrow", sans-serif;
      --orange: #ff9c00; --peach: #ffcc99; --lav: #cc99cc; --blue: #9999ff; --red: #cc6666; --gold: #ffcc66; --sky: #99ccff;
      --sfc-bg: #000; --sfc-surface: #000; --sfc-border: #222; --sfc-text: #ffcc99; --sfc-muted: #9999ff;
      --sfc-pv: #ff9c00; --sfc-load: #cc6666; --sfc-battery: #99ccff; --sfc-grid: #cc99cc;
      --sfc-accent: #ff9c00; --sfc-accent-soft: #ff9c00; --sfc-tile-bg: #000; --sfc-track: #222; --sfc-tip-bg: #000;
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: #ff9c00; --sfc-tab-on: #000;
      --sfc-radius: 12px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-frame: #000;
      --sfc-badge-bg: #222;
      text-transform: uppercase; padding: 12px;
    }
    .sfc button { text-transform: uppercase; }
    .lc-frame { display: grid; grid-template-columns: 22% 1fr; grid-template-rows: auto 1fr auto; column-gap: 6px; }
    .lc-elbow { position: relative; background: var(--orange); }
    .lc-elbow.top { grid-column: 1; grid-row: 1; height: 64px; border-radius: 44px 0 0 0; }
    .lc-elbow.top span { position: absolute; right: 8px; bottom: 6px; color: #000; font-size: 11px; }
    .lc-elbow.top::after { content: ""; position: absolute; right: -32px; bottom: 0; width: 32px; height: 22px; background: var(--orange); }
    .lc-elbow.top::before { content: ""; position: absolute; right: -32px; bottom: 0; width: 32px; height: 22px; background: #000; border-radius: 22px 0 0 0; z-index: 1; }
    .lc-elbow.bottom { grid-column: 1; grid-row: 3; height: 46px; border-radius: 0 0 0 40px; background: var(--peach); margin-top: 6px; }
    .lc-elbow.bottom::after { content: ""; position: absolute; right: -32px; top: 0; width: 32px; height: 18px; background: var(--peach); }
    .lc-elbow.bottom::before { content: ""; position: absolute; right: -32px; top: 0; width: 32px; height: 18px; background: #000; border-radius: 0 0 0 18px; z-index: 1; }
    .lc-topbar { grid-column: 2; grid-row: 1; display: flex; align-items: flex-end; gap: 6px; padding-left: 30px; }
    .lc-topbar h1 { align-self: flex-start; margin: 0 8px 0 0; color: var(--orange); font-size: clamp(20px, 5.4cqw, 32px); line-height: 1; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1 1 auto; }
    .lc-topbar i { height: 22px; flex: 0 0 auto; }
    .lc-topbar .b1 { width: 22%; background: var(--orange); } .lc-topbar .b2 { width: 12%; background: var(--lav); }
    .lc-topbar .b3 { width: 18px; background: var(--red); border-radius: 0 11px 11px 0; }
    .lc-side { grid-column: 1; grid-row: 2; display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
    .lc-side button { border: 0; padding: 6px 8px 4px; text-align: right; color: #000; font-size: clamp(11px, 2.8cqw, 15px); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
    .lc-side button small { display: block; font-size: 10px; opacity: .65; }
    .lc-side .c1 { background: var(--lav); } .lc-side .c2 { background: var(--peach); } .lc-side .c3 { background: var(--blue); }
    .lc-side .c4 { background: var(--gold); } .lc-side .c5 { background: var(--red); }
    .lc-side .lc-fill { flex: 1; min-height: 20px; background: var(--lav); }
    .lc-main { grid-column: 2; grid-row: 2; padding: 8px 0 0 12px; min-width: 0; }
    .lc-row { display: grid; grid-template-columns: 22% 1fr 26%; align-items: center; gap: 8px; width: 100%; margin: 4px 0; padding: 0; border: 0; background: none; text-transform: uppercase; }
    .lc-label { font-size: clamp(11px, 2.8cqw, 16px); color: var(--sky); letter-spacing: .05em; text-align: left; }
    .lc-value { font-size: clamp(13px, 3.6cqw, 22px); color: var(--gold); text-align: right; white-space: nowrap; }
    .lc-track { display: flex; gap: 3px; height: 16px; }
    .lc-track i { flex: 1; background: #222; }
    .lc-row.pv .lc-track i.on { background: var(--orange); } .lc-row.battery .lc-track i.on { background: var(--sky); }
    .lc-row.grid .lc-track i.on { background: var(--lav); } .lc-row.home .lc-track i.on { background: var(--red); }
    .lc-soc { display: flex; gap: 12px; margin-top: 12px; }
    .lc-cells { display: flex; flex-direction: column-reverse; gap: 3px; width: 44px; flex: 0 0 44px; }
    .lc-cells i { height: 8px; border-radius: 4px; background: #222; }
    .lc-cells i.on { background: var(--sky); }
    .lc-readout { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
    .lc-readout span { display: block; color: var(--blue); font-size: 11px; letter-spacing: .1em; }
    .lc-readout b { display: block; color: var(--orange); font-size: clamp(16px, 4cqw, 22px); font-weight: 600; line-height: 1.05; }
    .lc-status { display: inline-block; margin: 12px 0 4px; padding: 3px 14px; border-radius: 14px; background: var(--gold); color: #000; font-size: 15px; font-weight: 700; letter-spacing: .08em; }
    .lc-status.warn { background: var(--orange); animation: lc-blink 1.6s steps(2) infinite; }
    .lc-status.alert { background: #ff3355; color: #fff; animation: lc-blink .8s steps(2) infinite; }
    @keyframes lc-blink { 50% { opacity: .45; } }
    .lc-botbar { grid-column: 2; grid-row: 3; display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; padding-left: 30px; }
    .lc-botbar span { height: 18px; padding: 0 10px; background: var(--lav); color: #000; font-size: 12px; line-height: 18px; }
    .lc-botbar i { flex: 1; height: 18px; background: var(--peach); }
    .sfc-sections { padding: 12px 0 0; gap: 10px; }
    .sfc-section { padding: 0; border: 0; }
    .sfc-head { margin-bottom: 8px; }
    .sfc-head h3 { color: var(--orange); font-size: 20px; font-weight: 600; letter-spacing: .04em; }
    .sfc-kicker { border-radius: 12px; color: #000; background: var(--peach); font-size: 12px; }
    .sfc-kicker svg { stroke: #000; }
    .sfc-hint, .sfc-link { color: var(--blue); }
    .sfc-tabs { padding: 0; gap: 4px; }
    .sfc-tab { border-radius: 12px; background: #333; color: var(--peach); font-size: 13px; font-weight: 700; letter-spacing: .06em; }
    .sfc-tab.on { background: var(--orange); color: #000; }
    .sfc-tile { border: 0; border-left: 6px solid var(--sfc-c); padding: 6px 10px; }
    .sfc-tile-icon { display: none; }
    .sfc-tile small, .sfc-summary-item small { color: var(--blue); letter-spacing: .08em; font-size: 11px; }
    .sfc-tile strong { color: var(--gold); font-size: 18px; font-weight: 600; }
    .sfc-summary-item { border: 0; border-radius: 12px; background: #1a1a1a; }
    .sfc-summary-item strong { color: var(--orange); font-size: 16px; }
    .sfc-forecast { padding: 8px 0; }
    .sfc-forecast-icon { display: none; }
    .sfc-forecast-copy small { color: var(--blue); }
    .sfc-forecast-copy strong { color: var(--orange); font-size: 18px; font-weight: 600; }
    .sfc-forecast-bar { height: 10px; border-radius: 5px; }
    .sfc-panel { border: 0; border-radius: 0; background: linear-gradient(0deg, var(--orange) var(--share), #222 var(--share)); color: #000; }
    .sfc-panel small, .sfc-panel span { color: #000; opacity: .7; }
    .sfc-panel.weak { background: linear-gradient(0deg, #ff3355 var(--share), #222 var(--share)); box-shadow: none; }
    .sfc-string, .sfc-reading { border: 0; border-left: 6px solid var(--lav); }
    .sfc-ylabel, .sfc-xaxis span, .sfc-legend span { color: var(--blue); }
  `,
  // --------------------------------------------------------------- Atlantis
  atlantis: `
    .sfc {
      --sfc-font: "Exo 2", system-ui, sans-serif;
      --sfc-bg: radial-gradient(70% 55% at 50% 28%, rgba(0,200,255,.16), transparent 70%), radial-gradient(40% 30% at 85% 90%, rgba(0,255,210,.08), transparent 70%), linear-gradient(180deg, #04202c, #021018);
      --sfc-surface: rgba(0,140,190,.07); --sfc-border: rgba(110,230,255,.22); --sfc-text: #dffbff; --sfc-muted: #5fc6d8;
      --sfc-pv: #ffd36b; --sfc-load: #7affd8; --sfc-battery: #3fe0ff; --sfc-grid: #8fb4ff;
      --sfc-accent: #3fe0ff; --sfc-accent-soft: rgba(63,224,255,.12); --sfc-tile-bg: rgba(0,140,190,.06); --sfc-track: rgba(63,224,255,.12);
      --sfc-tab-bg: rgba(0,140,190,.08); --sfc-tab-on-bg: rgba(63,224,255,.2); --sfc-tab-on: #e8fdff; --sfc-tab-shadow: inset 0 0 0 1px #3fe0ff, 0 0 12px rgba(63,224,255,.35);
      --sfc-tip-bg: #062635; --sfc-badge-bg: rgba(63,224,255,.1);
      --sfc-flow-base: rgba(63,224,255,.12); --sfc-flow-w: 2; --sfc-dash: 2 10; --sfc-dash-len: 12;
      --sfc-radius: 22px; --sfc-section-radius: 4px 16px 4px 16px; --sfc-tile-radius: 3px 12px 3px 12px;
      --sfc-shadow: 0 0 40px rgba(0,180,255,.18), inset 0 0 60px rgba(0,160,220,.12);
      background: var(--sfc-bg);
    }
    .atl-scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(120,230,255,.035) 0 1px, transparent 1px 4px); }
    .atl-header { position: relative; display: flex; justify-content: space-between; padding: 20px 20px 0; }
    .atl-header h1 { margin: 0; font-weight: 300; font-size: clamp(16px, 4.4cqw, 22px); letter-spacing: .32em; text-transform: uppercase; text-shadow: 0 0 12px rgba(0,220,255,.6); }
    .atl-sub { margin-top: 4px; font-size: 10px; letter-spacing: .26em; color: var(--sfc-muted); text-transform: uppercase; }
    .atl-glyphs { font-size: 13px; letter-spacing: .4em; color: #3fb6cc; }
    .atl-glyphs.delayed { color: #ffb648; } .atl-glyphs.offline { color: #ff6b81; }
    .atl-core { position: relative; aspect-ratio: 480 / 330; margin: 26px 12px 18px; }
    .atl-core svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .atl-ticks line { stroke: #5fe3ff; opacity: .35; }
    .atl-thin { stroke: #5fe3ff; opacity: .25; }
    .atl-track { stroke: #0b3a4a; stroke-width: 5; }
    .atl-arc { stroke: #3fe0ff; stroke-width: 5; stroke-linecap: round; }
    .atl-crystal { stroke: #9ff6ff; stroke-width: 1.5; fill: rgba(60,220,255,.1); }
    .atl-pulse { transform-origin: center; animation: atl-pulse 3.2s ease-in-out infinite; }
    .atl-pulse.charging { animation-duration: 1.4s; }
    .atl-pulse.discharging { animation-duration: 2.2s; animation-direction: reverse; }
    @keyframes atl-pulse { 50% { opacity: .45; transform: scale(1.08); } }
    .atl-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 1px;
      padding: 0; border: 0; background: none; text-transform: uppercase; }
    .atl-center b { font-weight: 200; font-size: clamp(26px, 7.5cqw, 40px); color: #e8fdff; text-shadow: 0 0 12px rgba(0,220,255,.7); line-height: 1; }
    .atl-center small { font-size: clamp(8px, 1.9cqw, 10px); letter-spacing: .24em; color: var(--sfc-muted); }
    .atl-center .atl-when { color: #9ff6ff; letter-spacing: .1em; }
    .atl-center { max-width: 24%; text-align: center; }
    .atl-center small { letter-spacing: .14em; }
    .atl-label { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; padding: 0; border: 0; background: none; text-transform: uppercase; white-space: nowrap; }
    .atl-label small { font-size: 9px; letter-spacing: .28em; color: var(--sfc-muted); }
    .atl-label b { font-weight: 500; font-size: clamp(14px, 3.8cqw, 20px); color: #e8fdff; text-shadow: 0 0 10px rgba(0,220,255,.7); text-transform: none; }
    .atl-label.pv b { color: #ffe9a8; } .atl-label.load b { color: #b6fff0; }
    .sfc-flow { stroke-width: 2.4; }
    .sfc-head h3 { font-weight: 300; letter-spacing: .26em; text-transform: uppercase; font-size: 13px; }
    .sfc-kicker { border-radius: 2px 10px 2px 10px; }
    .sfc-tab { letter-spacing: .03em; text-transform: uppercase; font-weight: 500; font-size: 10px; }
    .sfc-tile small, .sfc-summary-item small, .sfc-forecast-copy small { letter-spacing: .2em; text-transform: uppercase; font-size: 9px; }
    .sfc-tile strong, .sfc-summary-item strong { font-weight: 300; font-size: 18px; }
    .sfc-section { position: relative; }
    .sfc-section::before { content: ""; position: absolute; left: -1px; top: 12px; width: 3px; height: 16px; background: #3fe0ff; box-shadow: 0 0 8px #3fe0ff; }
    .sfc-panel-grid { gap: 4px; }
    .sfc-panel-string + .sfc-panel-string .sfc-panel-grid { padding-left: 26px; }
    .sfc-panel { aspect-ratio: 1 / 1.12; padding: 0; align-content: center; border: 0; border-radius: 0;
      clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
      background: linear-gradient(180deg, rgba(0, 220, 255, calc(.2 + var(--share-n) * .5)), rgba(0, 120, 200, .3)); }
    .sfc-panel.weak { background: linear-gradient(180deg, rgba(255,170,60,.7), rgba(200,90,30,.45)); box-shadow: none; }
    .sfc-panel small { font-size: 9px; }
    .sfc-panel span { display: none; }
  `,
};


const DEFAULT_CONFIG = {
  theme: "diorama",
  show_energy: true,
  show_chart: true,
  show_forecast: true,
  show_panels: true,
  animation: true,
  load_fonts: true,
};

class SolarFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
    this._period = null;
    this._inverterOpen = false;
    this._cache = new Map();
    this._signature = "";
  }

  static getStubConfig() {
    return { theme: "diorama" };
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  setConfig(config) {
    // Never throw: Home Assistant can pass an incomplete config while the
    // editor initializes, and a throw replaces the card with an error card.
    const normalized = config && typeof config === "object" && !Array.isArray(config) ? config : {};
    this._config = { ...DEFAULT_CONFIG, ...normalized };
    if (!THEMES.includes(this._config.theme)) this._config.theme = "diorama";
    this._signature = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 8 + (this._config.show_energy !== false ? 5 : 0) + (this._config.show_panels !== false ? 2 : 0);
  }

  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }

  // Cached async loader; a finished request re-renders the card.
  _fetch(key, ttl, loader) {
    const cached = this._cache.get(key);
    if (cached && (cached.loading || Date.now() - cached.at < ttl)) return cached;
    const entry = { ...(cached || {}), loading: true };
    this._cache.set(key, entry);
    loader()
      .then((data) => this._cache.set(key, { data, at: Date.now() }))
      .catch((error) => {
        console.warn("Solar Flow Card: history unavailable", error);
        this._cache.set(key, { error: true, data: cached?.data, at: Date.now() });
      })
      .finally(() => {
        this._signature = "";
        this._render();
      });
    return entry;
  }

  _periodEnergy(resolved, period, today) {
    if (period === "today") return { totals: today, buckets: null, spec: null };
    const ids = ENERGY_ORDER.map((name) => resolved.energy[name]?.entityId).filter(Boolean);
    if (!ids.length || typeof this._hass.callWS !== "function") return { totals: {}, error: true };
    const spec = statsSpec(period);
    const entry = this._fetch(`stats|${period}|${ids.join(",")}|${spec.start.toDateString()}`, spec.ttl, () =>
      loadStatistics(this._hass, spec, resolved.energy)
    );
    if (!entry.data) return { totals: {}, loading: entry.loading, error: entry.error, spec };
    const buckets = withLiveToday(entry.data.buckets, spec, today);
    return { totals: sumBuckets(buckets), buckets, spec, loading: entry.loading, error: entry.error };
  }

  _chartState(resolved, period, energy) {
    if (this._config.show_chart === false) return null;
    if (period === "today" || period === "3d") {
      const ids = Object.values(resolved.live).filter(Boolean).map((entry) => entry.entityId);
      if (!ids.length || typeof this._hass.callWS !== "function") return null;
      const spec = powerSpec(period);
      const entry = this._fetch(`history|${period}|${ids.join(",")}|${spec.start.toDateString()}`, spec.ttl, () =>
        loadPowerHistory(this._hass, spec, resolved.live)
      );
      return {
        loading: entry.loading,
        error: entry.error,
        at: entry.at,
        data: entry.data ? this._powerChartData(entry.data.series, spec) : null,
      };
    }
    if (energy.error && !energy.buckets) return { error: true };
    return {
      loading: energy.loading,
      error: energy.error,
      at: energy.buckets ? energy.buckets.length : 0,
      data: energy.buckets ? { kind: "energy", spec: energy.spec, buckets: energy.buckets } : null,
    };
  }

  // Signed battery and grid series, with the same fallbacks as liveValues().
  _powerChartData(series, spec) {
    const quiet = (values) => !values || values.every((v) => v === null || Math.abs(v) <= ACTIVE_W);
    const batteryFactor = this._config.invert_battery ? -1 : 1;
    const gridFactor = this._config.invert_grid ? -1 : 1;
    let battery = null;
    if (!(quiet(series.charge) && quiet(series.discharge))) {
      battery = combineSeries(series.discharge || series.charge.map(() => 0), series.charge || series.discharge.map(() => 0), (d, c) => d - c);
    } else if (series.battery) {
      battery = series.battery.map((v) => (v === null ? null : v * batteryFactor));
    }
    let grid = null;
    if (!(quiet(series.gridImport) && quiet(series.gridExport)) && (series.gridImport || series.gridExport)) {
      grid = combineSeries(series.gridImport || series.gridExport.map(() => 0), series.gridExport || series.gridImport.map(() => 0), (i, e) => i - e);
    } else if (series.grid) {
      grid = series.grid.map((v) => (v === null ? null : v * gridFactor));
    } else if (series.gridImport) {
      grid = series.gridImport;
    }
    return { kind: "power", spec, solar: series.solar || null, load: series.load || null, battery, grid, soc: series.soc || null };
  }

  _render() {
    if (!this.shadowRoot || !this._hass) return;
    try {
      const config = this._config;
      const language = languageOf(this._hass, config);
      const t = stringsFor(language);
      const locale = t.locale;
      const theme = config.theme;
      if (config.load_fonts !== false) ensureThemeFonts(theme);
      const resolved = resolveEntities(this._hass, config);
      if (!hasAnyEntity(resolved)) {
        const signature = `empty|${language}|${theme}`;
        if (signature === this._signature) return;
        this._signature = signature;
        this.shadowRoot.innerHTML = `<style>${BASE_CSS}${THEME_CSS[theme]}</style>
          <ha-card class="sfc theme-${theme}"><div class="sfc-empty"><h2>${escapeHtml(t.noData)}</h2><p>${escapeHtml(t.noDataHelp)}</p></div></ha-card>`;
        return;
      }
      const period = PERIODS.includes(this._period) ? this._period : PERIODS.includes(config.period) ? config.period : "today";
      const live = liveValues(resolved, config);
      const status = liveStatus(resolved);
      const today = todayEnergy(resolved);
      const energy = this._periodEnergy(resolved, period, today);
      const chart = this._chartState(resolved, period, energy);
      const forecast = batteryForecast(live, config);
      const panels = panelData(this._hass, resolved, config);
      const inverter = this._inverterOpen ? inverterReadings(resolved) : null;
      const since = period === "all" && energy.buckets?.length
        ? energy.buckets[0].start.toLocaleDateString(locale, { month: "short", year: "numeric" })
        : null;
      const ids = {
        live: Object.fromEntries(Object.entries(resolved.live).map(([k, v]) => [k, v?.entityId || null])),
        energy: Object.fromEntries(Object.entries(resolved.energy).map(([k, v]) => [k, v?.entityId || null])),
      };
      const now = new Date();
      const signature = JSON.stringify([
        language, config, period, live, status.state, today, energy.totals, Boolean(energy.loading),
        chart && [Boolean(chart.loading), Boolean(chart.error), chart.at], forecast.mode, Math.round(forecast.hours * 60 || 0),
        panels?.panels.map((p) => [p.today, p.power]), this._inverterOpen,
        inverter?.map((d) => [[...d.strings.values()].map((s) => Object.values(s).map((r) => r.value)), d.temperatures.map((r) => r.value), d.battery.map((r) => r.value), d.grid.map((r) => r.value)]),
        Math.floor(now.getTime() / 60000),
      ]);
      if (signature === this._signature) return;
      this._signature = signature;

      const model = {
        t,
        locale,
        now,
        theme,
        station: resolved.station,
        name: resolved.name || t.defaultTitle,
        config: {
          ...config,
          showEnergy: config.show_energy !== false,
          showChart: config.show_chart !== false,
          showForecast: config.show_forecast !== false,
          showPanels: config.show_panels !== false,
        },
        ids,
        live,
        status,
        today,
        period,
        totals: energy.totals || {},
        energyLoading: Boolean(energy.loading),
        summary: periodSummary(energy.totals || {}, config, t, locale),
        since,
        chart,
        forecast,
        panels,
        inverter,
        inverterOpen: this._inverterOpen,
      };
      model.systemStatus = systemStatus(status, forecast, panels);

      this.shadowRoot.innerHTML = `
        <style>${BASE_CSS}${THEME_CSS[theme]}</style>
        <ha-card class="sfc theme-${theme} ${config.animation === false ? "no-anim" : ""}">${THEME_RENDER[theme](model)}</ha-card>`;
      this._wire(model);
    } catch (error) {
      console.error("Solar Flow Card render error", error);
      this.shadowRoot.innerHTML = `<style>${BASE_CSS}${THEME_CSS.diorama}</style>
        <ha-card class="sfc"><div class="sfc-empty"><h2>Solar Flow Card</h2><p>${escapeHtml(error?.message || error)}</p></div></ha-card>`;
    }
  }

  _wire(model) {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-entity]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: element.dataset.entity },
        }));
      });
    });
    root.querySelectorAll('[data-action="inverter"]').forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        this._inverterOpen = !this._inverterOpen;
        this._signature = "";
        this._render();
      });
    });
    root.querySelectorAll('[data-action="panels"]').forEach((element) => {
      element.addEventListener("click", () => root.getElementById("sfc-panels")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    });
    root.querySelectorAll("[data-period]").forEach((element) => {
      element.addEventListener("click", () => {
        if (element.dataset.period === model.period) return;
        this._period = element.dataset.period;
        this._render();
      });
    });
    wireChart(root, model.chart?.data, model.t, model.locale);
  }
}


// [config key, label key, input step]
const EDITOR_NUMBERS = [
  ["battery_capacity", "editorBatteryCapacity", "0.1"],
  ["battery_min_soc", "editorBatteryMinSoc", "1"],
  ["pv_capacity", "editorPvCapacity", "0.1"],
  ["pv_panels", "editorPvPanels", "1"],
  ["price_import", "editorPriceImport", "0.01"],
  ["price_export", "editorPriceExport", "0.01"],
  ["co2_factor", "editorCo2", "0.01"],
];
const EDITOR_SWITCHES = [
  ["show_energy", "editorShowEnergy"],
  ["show_chart", "editorShowChart"],
  ["show_forecast", "editorShowForecast"],
  ["show_panels", "editorShowPanels"],
  ["animation", "editorAnimation"],
  ["load_fonts", "editorFonts"],
];

class SolarFlowCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._render();
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  _set(key, value) {
    const next = { ...this._config };
    if (value === undefined || value === null || value === "") delete next[key];
    else next[key] = value;
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }

  _render() {
    if (!this.shadowRoot) return;
    const t = stringsFor(languageOf(this._hass, this._config));
    const stations = deyeStations(this._hass);
    const value = (key) => escapeHtml(this._config[key] ?? "");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; color: var(--primary-text-color); }
        .editor { display: grid; gap: 14px; padding: 8px 0; }
        label { display: grid; gap: 6px; font-size: 13px; color: var(--secondary-text-color); }
        input[type="text"], input[type="number"], select {
          width: 100%; min-height: 40px; box-sizing: border-box; padding: 8px 11px; font: inherit;
          color: var(--primary-text-color); background: var(--card-background-color);
          border: 1px solid var(--divider-color); border-radius: 10px;
        }
        .themes { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
        .themes button { padding: 10px 4px; border-radius: 10px; border: 1px solid var(--divider-color); background: var(--card-background-color);
          color: var(--primary-text-color); font: inherit; font-size: 12px; cursor: pointer; }
        .themes button.on { border-color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); font-weight: 700; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
        .switch { display: flex; justify-content: space-between; align-items: center; gap: 12px; color: var(--primary-text-color); font-size: 14px; }
        input[type="checkbox"] { width: 19px; height: 19px; accent-color: var(--primary-color); }
        .hint { margin: 0; color: var(--secondary-text-color); font-size: 12px; }
      </style>
      <div class="editor">
        <label><span>${escapeHtml(t.editorTheme)}</span>
          <div class="themes">${THEMES.map((theme) => `
            <button type="button" data-theme="${theme}" class="${(this._config.theme || "diorama") === theme ? "on" : ""}">${escapeHtml(t.themeNames[theme])}</button>`).join("")}
          </div>
        </label>
        <div class="grid">
          <label><span>${escapeHtml(t.editorTitle)}</span><input id="title" type="text" value="${value("title")}" /></label>
          ${stations.length > 1 ? `
            <label><span>${escapeHtml(t.editorStation)}</span>
              <select id="station_id"><option value="">${escapeHtml(t.auto)}</option>
                ${stations.map((id) => `<option value="${escapeHtml(id)}" ${String(this._config.station_id) === id ? "selected" : ""}>${escapeHtml(id)}</option>`).join("")}
              </select>
            </label>` : ""}
        </div>
        <div class="grid">
          ${EDITOR_NUMBERS.map(([key, label, step]) => `
            <label><span>${escapeHtml(t[label])}</span><input id="${key}" type="number" min="0" step="${step}" inputmode="decimal" value="${value(key)}" /></label>`).join("")}
          <label><span>${escapeHtml(t.editorCurrency)}</span><input id="currency" type="text" value="${value("currency")}" placeholder="${escapeHtml(t.currency)}" /></label>
        </div>
        ${EDITOR_SWITCHES.map(([key, label]) => `
          <div class="switch"><label for="${key}" style="color:inherit">${escapeHtml(t[label])}</label>
            <input id="${key}" type="checkbox" ${this._config[key] === false ? "" : "checked"} /></div>`).join("")}
        <p class="hint">${escapeHtml(t.editorHint)}</p>
      </div>`;
    const root = this.shadowRoot;
    root.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
      this._set("theme", button.dataset.theme);
      this._render();
    }));
    root.getElementById("title")?.addEventListener("change", (e) => this._set("title", e.target.value.trim() || undefined));
    root.getElementById("currency")?.addEventListener("change", (e) => this._set("currency", e.target.value.trim() || undefined));
    root.getElementById("station_id")?.addEventListener("change", (e) => this._set("station_id", e.target.value || undefined));
    EDITOR_NUMBERS.forEach(([key]) => root.getElementById(key)?.addEventListener("change", (e) => {
      const number = Number.parseFloat(e.target.value);
      this._set(key, Number.isFinite(number) ? number : undefined);
    }));
    EDITOR_SWITCHES.forEach(([key]) => root.getElementById(key)?.addEventListener("change", (e) =>
      this._set(key, e.target.checked ? undefined : false)
    ));
  }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, SolarFlowCard);
if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, SolarFlowCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Solar Flow Card",
    description: "Solar, battery, grid and home power flow with charts, forecasts and five themes.",
    preview: true,
    documentationURL: "https://github.com/gratak/solar-flow-card",
  });
}

console.info(
  `%c SOLAR FLOW CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#f5a400;font-weight:700;padding:3px 6px;border-radius:4px 0 0 4px",
  "color:#f5a400;background:#fff6dc;font-weight:700;padding:3px 6px;border-radius:0 4px 4px 0"
);
})();
