// A small stand-in for Home Assistant: DeyeCloud-style sensors plus the two
// recorder WebSocket calls the card uses. For the demo page and screenshots.

const STATION = "62745671";

export const SCENARIOS = {
  noon: { label: "Noon, charging", generationPower: 5200, consumptionPower: 640, batteryPower: -3900, purchasePower: 0, gridPower: 660, batterySOC: 71 },
  afternoon: { label: "Afternoon, mixed", generationPower: 1550, consumptionPower: 2760, batteryPower: 1320, purchasePower: 8, gridPower: 0, batterySOC: 55 },
  evening: { label: "Evening, battery", generationPower: 0, consumptionPower: 1850, batteryPower: 1850, purchasePower: 0, gridPower: 0, batterySOC: 38 },
  night: { label: "Night, grid", generationPower: 0, consumptionPower: 420, batteryPower: 0, purchasePower: 420, gridPower: 0, batterySOC: 10 },
};

function sun(h) {
  return Math.max(0, Math.sin(((h - 6.5) / 12) * Math.PI)) * 5600;
}

function profile(t) {
  const d = new Date(t);
  const h = d.getHours() + d.getMinutes() / 60;
  const pv = sun(h) * (0.85 + 0.15 * Math.sin(t / 7e5));
  const load = 380 + (h > 17 && h < 22 ? 1500 : 0) + (h > 7 && h < 8 ? 2100 : 0) + 120 * Math.sin(t / 3e5);
  const battery = Math.max(-3500, Math.min(3500, load - pv));
  const soc = Math.max(12, Math.min(100, h < 9 ? 35 - h * 2 : h < 15 ? 17 + (h - 9) * 14 : 100 - (h - 15) * 7));
  return {
    generationPower: pv,
    consumptionPower: load,
    batteryPower: battery,
    purchasePower: h < 5 ? 300 : 0,
    gridPower: pv - load > 3500 ? pv - load - 3500 : 0,
    batterySOC: soc,
  };
}

export function createHass({ scenario = "afternoon", language = "pl" } = {}) {
  const live = SCENARIOS[scenario] || SCENARIOS.afternoon;
  const states = {};
  const now = new Date().toISOString();
  const add = (id, state, attributes) => {
    states[id] = { entity_id: id, state: String(state), attributes: { station_id: STATION, station_name: "Dom", ...attributes }, last_updated: now, last_changed: now };
  };
  const units = { batterySOC: "%" };
  for (const key of ["generationPower", "consumptionPower", "gridPower", "purchasePower", "wirePower", "chargePower", "dischargePower", "batteryPower", "batterySOC"]) {
    add(`sensor.deye_${key.toLowerCase()}`, live[key] ?? 0, { sensor_type: "station_latest", metric_key: key, unit_of_measurement: units[key] || "W" });
  }
  const today = { generationValue: 18.4, consumptionValue: 12.7, gridValue: 3.1, purchaseValue: 0.9, chargeValue: 7.8, dischargeValue: 4.3 };
  for (const [key, value] of Object.entries(today)) {
    add(`sensor.deye_${key.toLowerCase()}_today`, value, { sensor_type: "daily", metric_key: key, relative_day: "today", unit_of_measurement: "kWh", state_class: "total_increasing" });
  }
  const inverter = (key, value, unit) => add(`sensor.deye_inverter_${key.toLowerCase()}`, value, {
    sensor_type: "device", device_type: "INVERTER", device_sn: "2603313875", device_key: key, unit_of_measurement: unit,
  });
  const pv1 = live.generationPower * 0.52;
  const pv2 = live.generationPower * 0.48;
  inverter("DCVoltagePV1", pv1 ? 342.1 : 12.4, "V");
  inverter("DCCurrentPV1", pv1 / 342.1, "A");
  inverter("DCPowerPV1", pv1, "W");
  inverter("DCVoltagePV2", pv2 ? 331.4 : 11.8, "V");
  inverter("DCCurrentPV2", pv2 / 331.4, "A");
  inverter("DCPowerPV2", pv2, "W");
  inverter("ACTemperature", 41.2, "°C");
  inverter("DCTemperature", 37.5, "°C");
  inverter("BatteryVoltage", 52.8, "V");
  inverter("BatteryCurrent", -live.batteryPower / 52.8, "A");
  inverter("BatteryTemperature", 24.0, "°C");
  inverter("GridFrequency", 50.01, "Hz");
  inverter("ACVoltageRUA", 231.5, "V");
  for (let i = 0; i < 16; i++) {
    const serial = `OPT${2400 + i}`;
    const value = i === 11 ? 0.61 : 1.12 + (i % 5) * 0.03;
    add(`sensor.optimizer_${serial.toLowerCase()}_today`, value, { sensor_type: "optimizer", metric_key: "today", device_sn: serial, unit_of_measurement: "kWh" });
    add(`sensor.optimizer_${serial.toLowerCase()}_power`, (live.generationPower / 16) * (i === 11 ? 0.55 : 1), { sensor_type: "optimizer", metric_key: "power", device_sn: serial, unit_of_measurement: "W" });
  }

  const callWS = async (message) => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    if (message.type === "history/history_during_period") {
      const start = Date.parse(message.start_time);
      const end = Date.parse(message.end_time);
      const out = {};
      for (const id of message.entity_ids) {
        const key = states[id]?.attributes?.metric_key;
        const rows = [];
        for (let t = start; t <= end; t += 5 * 60000) {
          const p = profile(t);
          const value = key in p ? p[key] : key === "chargePower" || key === "dischargePower" || key === "wirePower" ? 0 : 0;
          rows.push({ s: value.toFixed(0), lu: t / 1000 });
        }
        out[id] = rows;
      }
      return out;
    }
    if (message.type === "recorder/statistics_during_period") {
      const out = {};
      const nowDate = new Date();
      for (const id of message.statistic_ids) {
        const key = states[id]?.attributes?.metric_key;
        const rows = [];
        const scale = { generationValue: 1, consumptionValue: 0.7, purchaseValue: 0.12, gridValue: 0.18, chargeValue: 0.4, dischargeValue: 0.32 }[key] ?? 0.3;
        if (message.period === "day") {
          for (let d = new Date(message.start_time); d <= nowDate; d.setDate(d.getDate() + 1)) {
            const base = 10 + 12 * Math.abs(Math.sin(d.getDate() * 1.7));
            rows.push({ start: d.getTime(), change: base * scale * (key === "consumptionValue" ? 0.9 : 1) + (key === "consumptionValue" ? 5 : 0) });
          }
        } else {
          for (let i = 0; i < 22; i++) {
            const d = new Date(2024, 11 + i, 1);
            if (d > nowDate) break;
            const season = 1 + Math.sin(((d.getMonth() - 2) / 12) * 2 * Math.PI);
            rows.push({ start: d.getTime(), change: key === "consumptionValue" ? 380 : key === "purchaseValue" ? 140 * (2 - season) : 420 * season * scale });
          }
        }
        out[id] = rows;
      }
      return out;
    }
    throw new Error(`Unsupported mock call ${message.type}`);
  };

  return { states, language, locale: { language }, callWS };
}
