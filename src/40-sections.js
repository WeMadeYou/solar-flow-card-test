
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
      ${TILE_DEFS.filter(([name]) => m.config.showSolar || name !== "solar").map(([name, icon, label]) => {
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
  if (!m.config.showPanels || !m.config.showSolar || !data) return "";
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
  if (chart.data?.kind === "power" && ["solar", "load", "battery", "grid"].some((k) => chart.data[k]?.some((v) => v !== null))) {
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
  const kinds = [["solar", "pv"], ["load", "load"], ["gridImport", "grid"]].filter(([key]) => !data.noSolar || key !== "solar");
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
    [["pv", t.pvProduction], ["load", t.consumption], ["grid", t.gridImport]].filter(([kind]) => !data.noSolar || kind !== "pv"),
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
    ["pv", t.pvProduction, data.noSolar ? undefined : bucket.solar],
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
