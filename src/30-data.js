
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
  const show = (key) => config[key] !== false;
  const hasSolar = show("show_solar");
  if (show("show_autarky") && isNum(load) && isNum(gridImport) && load > 0.05) {
    items.push(["autarky", t.autarky, formatPercent(clamp(((load - gridImport) / load) * 100, 0, 100), locale)]);
  }
  if (hasSolar && show("show_self_use") && isNum(solar) && isNum(gridExport) && solar > 0.05) {
    items.push(["selfuse", t.selfUse, formatPercent(clamp(((solar - gridExport) / solar) * 100, 0, 100), locale)]);
  }
  const priceImport = positiveNumber(config.price_import);
  if (show("show_savings") && priceImport !== null && isNum(load) && isNum(gridImport)) {
    const priceExport = positiveNumber(config.price_export) || 0;
    const saved = Math.max(0, load - gridImport) * priceImport + (isNum(gridExport) ? gridExport : 0) * priceExport;
    items.push(["money", t.savings, `${formatNumber(saved, locale, 2)} ${config.currency ?? t.currency}`.trim()]);
  }
  if (hasSolar && show("show_co2") && isNum(solar)) {
    const factor = Number.parseFloat(config.co2_factor);
    const kg = solar * (Number.isFinite(factor) && factor >= 0 ? factor : 0.5);
    items.push(["co2", t.co2, kg >= 1000 ? `${formatNumber(kg / 1000, locale, 2)} t` : `${formatNumber(kg, locale, kg < 10 ? 1 : 0)} kg`]);
  }
  const pvCapacity = positiveNumber(config.pv_capacity);
  if (hasSolar && show("show_yield") && pvCapacity !== null && isNum(solar)) {
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

// Installation details: power per phase, inverter load, battery (BMS) and
// generator. `key` is the option under `entities:`, `deye` the DeyeCloud
// device keys tried in order (an inverter's device sensors).
const SYSTEM_METRICS = {
  loadL1: { key: "load_power_l1", deye: ["LoadPowerL1", "LoadPhasePowerA"] },
  loadL2: { key: "load_power_l2", deye: ["LoadPowerL2", "LoadPhasePowerB"] },
  loadL3: { key: "load_power_l3", deye: ["LoadPowerL3", "LoadPhasePowerC"] },
  gridL1: { key: "grid_power_l1", deye: ["GridPowerL1"] },
  gridL2: { key: "grid_power_l2", deye: ["GridPowerL2"] },
  gridL3: { key: "grid_power_l3", deye: ["GridPowerL3"] },
  voltL1: { key: "grid_voltage_l1", deye: ["GridVoltageL1", "LoadVoltageL1", "ACVoltageRUA"] },
  voltL2: { key: "grid_voltage_l2", deye: ["GridVoltageL2", "LoadVoltageL2", "ACVoltageSVB"] },
  voltL3: { key: "grid_voltage_l3", deye: ["GridVoltageL3", "LoadVoltageL3", "ACVoltageTWC"] },
  batteryTemp: { key: "battery_temperature", deye: ["Temperature- Battery", "BatteryTemperature", "BMSTemperature"] },
  batteryVoltage: { key: "battery_voltage", deye: ["BatteryVoltage", "BMSVoltage"] },
  batteryCurrent: { key: "battery_current", deye: ["BatteryTotalCurrent", "BatteryCurrent", "BMSCurrent", "BatteryCurrent1"] },
  inverterPower: { key: "inverter_power", deye: ["TotalInverterOutputPower"] },
  ratedPower: { key: "inverter_rated_power", deye: ["RatedPower"] },
  generator: { key: "generator_power", deye: ["TotalGeneratorPower", "GeneratorActivePower"] },
};
// Battery temperatures outside this range limit charging on most LiFePO4 packs.
const BATTERY_COLD = 10;
const BATTERY_HOT = 45;

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Power in W from a sensor in W or kW.
function wattsOf(stateObj) {
  const value = stateNumber(stateObj);
  if (value === null) return null;
  return /^kW$/i.test(stateUnit(stateObj)) ? value * 1000 : value;
}

function systemData(hass, resolved, config) {
  const states = hass?.states || {};
  const configured = config.entities || {};
  // Device sensors of the first inverter, by normalized key.
  const devices = resolved.candidates.filter(([, s]) => s.attributes?.sensor_type === "device"
    && String(s.attributes?.device_type || "").includes("INVERTER"));
  const serial = devices.length ? String(devices[0][1].attributes?.device_sn || "") : "";
  const byKey = new Map();
  for (const [entityId, stateObj] of devices) {
    if (String(stateObj.attributes?.device_sn || "") !== serial) continue;
    const key = deviceKey(stateObj);
    if (key) byKey.set(normalizeKey(key), { entityId, stateObj });
  }
  const found = {};
  for (const [name, def] of Object.entries(SYSTEM_METRICS)) {
    const id = configured[def.key];
    if (id && states[id]) found[name] = { entityId: id, stateObj: states[id] };
    else found[name] = def.deye.map((key) => byKey.get(normalizeKey(key))).find((entry) => entry && stateNumber(entry.stateObj) !== null) || null;
  }
  const watts = (name) => (found[name] ? wattsOf(found[name].stateObj) : null);
  const number = (name) => (found[name] ? stateNumber(found[name].stateObj) : null);
  const gridSign = config.invert_grid ? -1 : 1;
  const phases = [1, 2, 3].map((n) => ({
    name: `L${n}`,
    load: watts(`loadL${n}`),
    grid: isNum(watts(`gridL${n}`)) ? watts(`gridL${n}`) * gridSign : null,
    voltage: number(`voltL${n}`),
    entityId: found[`loadL${n}`]?.entityId || found[`gridL${n}`]?.entityId || found[`voltL${n}`]?.entityId || null,
  }));
  const hasPhases = phases.filter((p) => isNum(p.load) || isNum(p.grid)).length >= 2;
  const loads = phases.map((p) => p.load).filter(isNum);
  const rated = positiveNumber(config.inverter_power_rating) ? positiveNumber(config.inverter_power_rating) * 1000 : watts("ratedPower");
  const inverterPower = watts("inverterPower");
  const batteryTemp = number("batteryTemp");
  const generator = watts("generator");
  const data = {
    phases: hasPhases ? phases : null,
    phaseMax: Math.max(1, ...loads),
    phaseSpread: loads.length >= 2 ? Math.max(...loads) - Math.min(...loads) : null,
    inverter: isNum(inverterPower) ? {
      power: inverterPower,
      rated: isNum(rated) && rated > 0 ? rated : null,
      share: isNum(rated) && rated > 0 ? clamp((Math.abs(inverterPower) / rated) * 100, 0, 100) : null,
      entityId: found.inverterPower.entityId,
    } : null,
    battery: [
      ["temperature", found.batteryTemp, batteryTemp, "°C"],
      ["voltage", found.batteryVoltage, number("batteryVoltage"), "V"],
      ["current", found.batteryCurrent, isNum(number("batteryCurrent")) ? Math.abs(number("batteryCurrent")) : null, "A"],
    ].filter(([, entry, value]) => entry && isNum(value)).map(([kind, entry, value, unit]) => ({ kind, entityId: entry.entityId, value, unit })),
    batteryTemp,
    batteryWarn: isNum(batteryTemp) ? (batteryTemp < BATTERY_COLD ? "cold" : batteryTemp > BATTERY_HOT ? "hot" : null) : null,
    generator: isNum(generator) && generator > ACTIVE_W ? { power: generator, entityId: found.generator.entityId } : null,
  };
  return data.phases || data.inverter || data.battery.length || data.generator ? data : null;
}

// Status used by themes that show one (LCARS): alert when offline or the
// battery reached its reserve, caution when delayed, close to the reserve,
// a panel is underperforming or the battery is too cold or hot.
function systemStatus(status, forecast, panels, system) {
  if (status.state === "offline" || (isNum(forecast.soc) && forecast.soc <= forecast.minSoc + 1)) return "alert";
  if (status.state === "delayed" || (isNum(forecast.soc) && forecast.soc < forecast.minSoc + 15) || panels?.weakest || system?.batteryWarn) return "warn";
  return "nominal";
}
