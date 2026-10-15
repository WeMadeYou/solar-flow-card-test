
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
  if (f.mode === "charging") return { label: m.t.chipFull, value: formatWhen(f.at, m.locale) };
  if (f.mode === "discharging") return { label: m.t.chipLasts, value: formatWhen(f.at, m.locale) };
  if (isNum(f.stored)) return { label: m.t.chipStored, value: formatEnergy(f.stored, m.locale) };
  return { label: m.t.battery, value: formatPercent(f.soc, m.locale) };
}

// The inverter at the centre of a theme: its measured output when known,
// otherwise what it delivers from the panels and the battery.
function inverterHub(m) {
  const inverter = m.system?.inverter;
  if (inverter) return { power: Math.abs(inverter.power), share: inverter.share };
  const { live } = m;
  return { power: Math.max(0, live.solar + live.discharge - live.charge), share: null };
}

// Battery label for a theme's battery node: "Battery 37%".
function batteryLabel(m) {
  return isNum(m.live.soc) ? `${m.t.battery} ${formatPercent(m.live.soc, m.locale)}` : m.t.battery;
}

// When the battery will be full or reach the reserve, with an arrow.
function batteryWhenShort(m) {
  const f = m.forecast;
  return f.at ? `${f.mode === "charging" ? "▲" : "▼"} ${formatWhen(f.at, m.locale)}` : "";
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
  const w = m.weather;
  const clear = !w || w.sun !== false;
  // Overcast skies turn grey.
  if (w?.grey) g += `<rect x="0" y="0" width="520" height="360" fill="${night ? "#0a0f1c" : "#8d99a8"}" opacity="${w.grey}"/>`;
  if (night) {
    if (clear) {
      const stars = [[40, 30], [90, 70], [150, 24], [210, 52], [300, 28], [360, 64], [460, 36], [500, 80], [120, 110], [260, 96]];
      g += stars.map(([x, y], i) => `<circle class="dio-star" style="--d:${(i * 0.7) % 4}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.2 : 1.8}" fill="#fff" opacity="${0.5 + (i % 4) * 0.12}"/>`).join("");
      g += '<circle cx="430" cy="62" r="17" fill="#f4f1dc"/><circle cx="438" cy="56" r="15" fill="#253563" opacity=".9"/>';
    }
  } else if (clear) {
    const p = clamp((h - 6) / 14, 0, 1);
    const sx = 70 + p * 380;
    const sy = 140 - Math.sin(Math.PI * p) * 100;
    g += `<circle class="dio-glow" cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="44" fill="#ffe27a" opacity=".22"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="26" fill="#ffe27a"/>`;
  }
  // Clouds drift across the sky; more and darker ones in bad weather.
  const cloudCount = w ? w.clouds : night ? 0 : 3;
  const cloudFill = w?.grey ? (night ? "#4a5468" : "#dfe4ea") : night ? "#5a6886" : "#fff";
  // Heights and sizes; the drift spreads them across the sky.
  const cloudSpots = [[70, 1], [48, 1.3], [105, 0.8], [88, 1.1], [36, 1.4], [122, 0.9]];
  for (let i = 0; i < cloudCount; i++) {
    const [y, k] = cloudSpots[i];
    const x = 0;
    const speed = (w?.wind ? 40 : 90) + i * 17;
    g += `<g class="dio-cloud" style="--t:${speed}s;--d:${loopPhase(speed, speed * (0.2 + (0.6 * i) / cloudCount))}" fill="${cloudFill}" opacity="${w?.grey ? 0.95 : 0.85}">
      <g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="18" cy="-8" rx="22" ry="12"/><ellipse cx="-16" cy="-4" rx="16" ry="9"/></g></g>`;
  }
  if (w?.rain) {
    const drops = w.rain > 1 ? 70 : 36;
    g += `<g class="dio-rain ${w.rain > 1 ? "heavy" : ""}" stroke="${night ? "#7f95c2" : "#7d93ad"}" stroke-width="1.4" stroke-linecap="round">`
      + Array.from({ length: drops }, (_, i) => {
        const x = (i * 137) % 540 - 10;
        const y = (i * 61) % 260;
        return `<line style="--d:-${((i * 0.37) % 1.2).toFixed(2)}s" x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 12}"/>`;
      }).join("") + "</g>";
  }
  if (w?.snow) {
    g += '<g class="dio-snow" fill="#fff">' + Array.from({ length: 40 }, (_, i) => {
      const x = (i * 131) % 520;
      const y = (i * 53) % 260;
      return `<circle style="--d:-${((i * 0.53) % 6).toFixed(2)}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.4}"/>`;
    }).join("") + "</g>";
  }
  if (w?.fog) {
    g += '<g class="dio-fog" fill="#eef1f4">'
      + [[60, 150], [200, 185], [360, 165], [120, 230]].map(([x, y], i) => `<rect style="--d:-${i * 5}s" x="${x - 150}" y="${y}" width="300" height="18" rx="9" opacity=".45"/>`).join("")
      + "</g>";
  }
  if (w?.lightning) g += '<rect class="dio-flash" x="0" y="0" width="520" height="360" fill="#fff"/>';
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
  const count = m.config.showSolar ? clamp(panelList.length || Math.round(positiveNumber(m.config.pv_panels) || 8), 1, 24) : 0;
  const rows = count > 16 ? 3 : count > 8 ? 2 : 1;
  const cols = Math.max(1, Math.ceil(count / rows));
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
  if (m.config.showBattery) {
    g += `<g class="sfc-click" ${entityAttr(batteryEntityId(m))}>`;
    g += box(-2.6, 1.6, 1.0, 0.8, 1.6, "#e6f6ef", "#d4efe3", "#b9e2d0");
    const level = isNum(m.live.soc) ? clamp(m.live.soc, 0, 100) / 100 : 0;
    g += poly("#cfe7dc", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 1.3], [-2.45, 2.4, 1.3]);
    g += poly(level < 0.2 ? "#f26b5b" : "#1fbf86", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 0.3 + level], [-2.45, 2.4, 0.3 + level]);
    g += "</g>";
  }
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
  if (m.config.showBattery) g += flowPath(`M${bat} Q${(bat[0] + wallL[0]) / 2} ${bat[1] - 30} ${wallL}`, L.chargeActive || L.dischargeActive, L.chargeActive, "battery");
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
      <div class="dio-clock">${escapeHtml(clockText(m))}${isNum(m.weather?.temperature) ? ` <button class="dio-temp" ${entityAttr(m.weather.entityId)}>${escapeHtml(`${formatNumber(m.weather.temperature, locale, 0)}${m.weather.unit}`)}</button>` : ""}</div>
      ${m.config.showSolar ? pill(288, 78, "pv", formatPower(live.solar, locale), t.fromRoof, m.ids.live.solar) : ""}
      ${m.config.showBattery ? pill(22, 208, "battery", formatPercent(live.soc, locale), batteryNote, batteryEntityId(m)) : ""}
      ${pill(378, 240, "grid", formatPower(gridValue, locale), t.grid.toLowerCase(), gridEntityId(m))}
      ${pill(120, 296, "load", formatPower(live.load, locale), t.inHome, m.ids.live.load)}
    </div>
    <div class="dio-bottom">
      <div class="dio-chips">
        ${m.config.showSolar
          ? `<button class="dio-chip sun" ${entityAttr(m.ids.energy.solar)}><small>${escapeHtml(t.chipRoof)}</small><b>${escapeHtml(formatEnergy(today.solar, locale))}</b></button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridImport)}><small>${escapeHtml(t.gridImport)}</small><b>${escapeHtml(formatEnergy(today.gridImport, locale))}</b></button>`}
        ${m.config.showBattery
          ? `<button class="dio-chip bat" ${entityAttr(batteryEntityId(m))}><small>${escapeHtml(when.label)}</small><b>${escapeHtml(when.value)}</b></button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridExport)}><small>${escapeHtml(t.gridExport)}</small><b>${escapeHtml(formatEnergy(today.gridExport, locale))}</b></button>`}
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
  const batteryNote = f.mode === "charging" || f.mode === "discharging" ? `${f.mode === "charging" ? t.chipFull : t.chipLasts} ${formatWhen(f.at, locale)}` : batteryStatus(m);
  const batteryFlow = live.dischargeActive ? -live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const flowLabel = (x, y, cls, active, value) => active
    ? `<text class="aur-flow-label ${cls}" x="${x}" y="${y}">${escapeHtml(formatPower(value, locale))}</text>` : "";
  const sub = [m.config.showSolar && positiveNumber(m.config.pv_capacity) && `${formatNumber(positiveNumber(m.config.pv_capacity), locale, 1)} kWp`,
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
          ${m.config.showSolar ? flowPath("M238 104 L238 147", live.solarActive, false, "pv", 'filter="url(#aur-glow)"') : ""}
          ${m.config.showBattery ? flowPath("M108 165 Q165 148 220 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery", 'filter="url(#aur-glow)"') : ""}
          ${flowPath("M256 165 Q311 148 368 165", live.importActive || live.exportActive, live.importActive, "grid", 'filter="url(#aur-glow)"')}
          ${flowPath("M238 183 L238 236", live.loadActive, false, "load", 'filter="url(#aur-glow)"')}
        </g>
        ${flowLabel(248, 130, "pv", live.solarActive, live.solar)}
        ${flowLabel(132, 146, "battery", live.chargeActive || live.dischargeActive, Math.abs(batteryFlow))}
        ${flowLabel(300, 146, "grid", live.importActive || live.exportActive, gridValue)}
      </svg>
      ${m.config.showSolar ? ring("pv", 238, 58, t.legendPv, powerParts(live.solar, locale), "", live.solarActive ? "" : t.idle, m.ids.live.solar) : ""}
      ${!m.config.showBattery ? "" : ring("battery", 62, 165, t.legendSoc, [formatPercent(live.soc, locale), ""], batteryFlow ? `${batteryFlow < 0 ? "−" : "+"}${formatPower(Math.abs(batteryFlow), locale)}` : t.idle, batteryNote, batteryEntityId(m), socArc)}
      ${ring("grid", 414, 165, t.grid, powerParts(gridValue, locale), "", gridStatus(m), gridEntityId(m))}
      ${ring("home", 238, 282, t.home, powerParts(live.load, locale), "", "", m.ids.live.load)}
      <button class="aur-hub" style="${pos(238, 165)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">${MINI_ICONS.chip}</button>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Paper: an editorial page with a Sankey diagram of where the power goes.
// --------------------------------------------------------------------------

// Where the power comes from right now, as shares that add up to 100%.
// Sources are allocated to the uses in proportion, as in the Sankey.
function liveSources(m) {
  const { live } = m;
  const items = [
    ["pv", m.t.solar, m.config.showSolar ? live.solar : 0, m.ids.live.solar],
    ["battery", m.t.battery, live.discharge, batteryEntityId(m)],
    ["grid", m.t.grid, live.gridImport, gridEntityId(m)],
  ];
  const total = items.reduce((sum, [, , value]) => sum + (value > ACTIVE_W ? value : 0), 0);
  const shares = items.map(([, , value]) => (total > 0 && value > ACTIVE_W ? (value / total) * 100 : 0));
  const rounded = shares.map(Math.round);
  const drift = 100 - rounded.reduce((a, b) => a + b, 0);
  if (total > 0 && drift) rounded[shares.indexOf(Math.max(...shares))] += drift;
  return { items, total, shares: rounded };
}

function sankeyHtml(m) {
  const { live, t, locale } = m;
  const sources = liveSources(m).items.filter(([, , value]) => value > ACTIVE_W);
  const sinks = [
    ["load", t.home, live.load, m.ids.live.load],
    ["battery", t.battery, live.charge, batteryEntityId(m)],
    ["grid", t.grid, live.gridExport, gridEntityId(m)],
  ].filter(([, , value]) => value > ACTIVE_W);
  if (!sources.length || !sinks.length) return `<div class="pap-quiet">${escapeHtml(t.idle)}</div>`;
  // Balance both sides: what goes in but is not measured going out is the
  // inverter's losses and own use; the reverse is an unmeasured source.
  const sourceTotal = sources.reduce((s, [, , v]) => s + v, 0);
  const sinkTotal = sinks.reduce((s, [, , v]) => s + v, 0);
  if (sourceTotal - sinkTotal > ACTIVE_W) sinks.push(["loss", t.losses, sourceTotal - sinkTotal, null]);
  if (sinkTotal - sourceTotal > ACTIVE_W) sources.push(["other", t.otherSource, sinkTotal - sourceTotal, null]);
  const total = Math.max(sourceTotal, sinkTotal);
  const W = 468;
  const H = 200;
  const gap = 14;
  const scale = (H - gap * (Math.max(sources.length, sinks.length) - 1)) / total;
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
  let flows = "";
  // Each source feeds every use in proportion to the use's share.
  for (const s of left) {
    for (const k of right) {
      const h = ((s.value * k.value) / total) * scale;
      if (h < 0.5) continue;
      const y0 = s.y + s.used;
      const y1 = k.y + k.used;
      s.used += h;
      k.used += h;
      ribbons += `<path class="pap-ribbon ${s.kind}" d="M10 ${y0.toFixed(1)} C${W / 2} ${y0.toFixed(1)} ${W / 2} ${y1.toFixed(1)} ${W - 10} ${y1.toFixed(1)} L${W - 10} ${(y1 + h).toFixed(1)} C${W / 2} ${(y1 + h).toFixed(1)} ${W / 2} ${(y0 + h).toFixed(1)} 10 ${(y0 + h).toFixed(1)} Z"/>`;
      // Dots running along the middle of the ribbon, source to use.
      if (h >= 3) {
        const a = y0 + h / 2;
        const b = y1 + h / 2;
        flows += `<path class="sfc-flow pap-flow" d="M14 ${a.toFixed(1)} C${W / 2} ${a.toFixed(1)} ${W / 2} ${b.toFixed(1)} ${W - 14} ${b.toFixed(1)}"/>`;
      }
    }
  }
  const bars = left.map((s) => `<rect class="pap-node ${s.kind}" x="0" y="${s.y.toFixed(1)}" width="10" height="${s.h.toFixed(1)}"/>`).join("")
    + right.map((k) => `<rect class="pap-node sink ${k.kind}" x="${W - 10}" y="${k.y.toFixed(1)}" width="10" height="${k.h.toFixed(1)}"/>`).join("");
  const label = (node, side) => `
    <button class="pap-label ${side} ${node.kind}" style="top:${((Math.max(0, node.y + node.h / 2 - 16) / H) * 100).toFixed(1)}%" ${entityAttr(node.entityId)}>
      <b>${escapeHtml(formatPower(node.value, locale))}</b>${escapeHtml(node.label)}${node.kind === "battery" && isNum(live.soc) ? ` · ${escapeHtml(formatPercent(live.soc, locale))}` : ""}
    </button>`;
  return `
    <div class="pap-cols"><span>${escapeHtml(t.sankeyFrom)}</span><span>${escapeHtml(t.sankeyTo)}</span></div>
    <div class="pap-sankey">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="pap-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".4" stop-color="#fff"/>
            <stop offset=".6" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <mask id="pap-mask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#pap-fade)"/></mask>
        </defs>
        ${ribbons}<g mask="url(#pap-mask)">${flows}</g>${bars}</svg>
      ${left.map((n) => label(n, "left")).join("")}
      ${right.map((n) => label(n, "right")).join("")}
    </div>`;
}

// One or two sentences about the moment, as HTML with <em> highlights.
// Used by Paper and by the crawl of the Galaxy theme.
function liveSentence(m) {
  const { t, locale, live } = m;
  let lede = "";
  const sourcesNow = liveSources(m);
  if (live.load > ACTIVE_W && sourcesNow.total > 0) {
    const names = [t.paperSun, t.paperBattery, t.paperGrid];
    const parts = sourcesNow.shares.map((pct, i) => [names[i], pct]).filter(([, pct]) => pct > 0);
    lede = parts.length === 1
      ? fill(t.paperOnly, { source: `<em>${parts[0][0]}</em>` })
      : fill(t.paperMix, { parts: parts.map(([name, pct]) => `${name} <em>${pct}%</em>`).join(", ") });
  }
  const f = m.forecast;
  if (f.mode === "discharging") lede += ` ${fill(t.paperLasts, { time: `<em>${formatWhen(f.at, locale)}</em>` })}`;
  if (f.mode === "charging") lede += ` ${fill(t.paperFull, { time: `<em>${formatWhen(f.at, locale)}</em>` })}`;
  if (live.exportActive) lede += ` ${fill(t.paperExport, { power: `<em>${formatPower(live.gridExport, locale)}</em>` })}`;
  return lede.trim().replace(/<(?!\/?em>)/g, "&lt;");
}

function renderPaper(m) {
  const { t, locale, live } = m;
  const load = live.load;
  const lede = liveSentence(m);
  const date = m.now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  return `
    <div class="pap-eyebrow"><span>${escapeHtml(m.name)}</span><span>${escapeHtml(date)} · ${escapeHtml(clockText(m))} ${liveBadge(m)}</span></div>
    <h1 class="pap-headline" ${entityAttr(m.ids.live.load)}>${escapeHtml(fill(t.paperHeadline, { power: formatPower(load, locale) }))}</h1>
    ${lede ? `<p class="pap-lede">${lede}</p>` : ""}
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
  return Array.from({ length: count }, (_, i) => (i < on ? `<i class="on" style="--i:${i};--n:${on - 1}"></i>` : "<i></i>")).join("");
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
    ...(m.panels ? [["c1", "01", t.lcarsPanels, 'data-action="panels"']] : []),
    ...(m.config.showBattery ? [["c2", "02", t.battery, entityAttr(batteryEntityId(m))]] : []),
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
      <div class="lc-main ${m.config.wide ? "wide" : ""}">
        <div class="lc-panel">
        ${m.config.showSolar ? row("pv", t.lcarsPvIn, live.solar, m.ids.live.solar) : ""}
        ${!m.config.showBattery ? "" : row(live.chargeActive ? "battery rev" : "battery", live.chargeActive ? t.lcarsBatIn : t.lcarsBatOut, live.chargeActive ? live.charge : live.discharge, batteryEntityId(m))}
        ${row(live.exportActive ? "grid rev" : "grid", live.exportActive ? t.lcarsGridOut : t.lcarsGridIn, live.exportActive ? live.gridExport : live.gridImport, gridEntityId(m))}
        ${row("home", t.lcarsHome, live.load, m.ids.live.load)}
        <div class="lc-soc ${m.config.showBattery ? "" : "no-battery"}">
          ${m.config.showBattery ? `<div class="lc-cells">${Array.from({ length: 10 }, (_, i) => `<i class="${i < cellsOn ? "on" : ""}"></i>`).join("")}</div>` : ""}
          <div class="lc-readout">
            ${m.config.showBattery ? `
            <div><span>${escapeHtml(t.stateOfCharge)}</span><b>${escapeHtml(formatPercent(live.soc, locale))}</b></div>
            <div><span>${escapeHtml(t.stored)}</span><b>${escapeHtml(isNum(f.stored) ? formatEnergy(f.stored, locale) : "—")}</b></div>
            <div><span>${escapeHtml(f.mode === "charging" ? t.chipFull : t.autonomy)}</span><b>${escapeHtml(f.at ? formatWhen(f.at, locale) : "—")}</b></div>` : `
            <div><span>${escapeHtml(t.consumption)}</span><b>${escapeHtml(formatEnergy(m.today.load, locale))}</b></div>
            <div><span>${escapeHtml(t.gridImport)}</span><b>${escapeHtml(formatEnergy(m.today.gridImport, locale))}</b></div>
            <div><span>${escapeHtml(t.gridExport)}</span><b>${escapeHtml(formatEnergy(m.today.gridExport, locale))}</b></div>`}
            <div><span>${escapeHtml(t.autarkyToday)}</span><b>${escapeHtml(autarkyToday)}</b></div>
          </div>
        </div>
        <div class="lc-status ${status}">${escapeHtml(t[`status${status[0].toUpperCase()}${status.slice(1)}`])}</div>
        </div>
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
  // The core is the inverter; its ring shows the load against rated power.
  const hub = inverterHub(m);
  const arc = (((hub.share ?? 0) / 100) * 603.2).toFixed(1);
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
          ${m.config.showSolar ? flowPath("M240 18 L240 69", live.solarActive, false, "pv") : ""}
          ${m.config.showBattery ? flowPath("M60 165 L144 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M420 165 L336 165", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${flowPath("M240 261 L240 312", live.loadActive, false, "load")}
        </g>
      </svg>
      <button class="atl-center" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <small>${escapeHtml(t.inverter)}</small><b>${escapeHtml(formatPower(hub.power, locale))}</b>
        ${isNum(hub.share) ? `<small>${escapeHtml(formatPercent(hub.share, locale))}</small>` : ""}
      </button>
      ${m.config.showSolar ? label("left:50%;top:3%", "", formatPower(live.solar, locale), t.sun, m.ids.live.solar, "pv") : ""}
      ${!m.config.showBattery ? "" : label("left:10%;top:50%", batteryLabel(m), formatPower(batteryFlow, locale), [live.chargeActive ? t.absorbing : live.dischargeActive ? t.supplying : t.idle, batteryWhenShort(m)].filter(Boolean).join(" "), batteryEntityId(m))}
      ${label("left:90%;top:50%", t.grid, formatPower(gridValue, locale), gridStatus(m), gridEntityId(m), "grid")}
      ${label("left:50%;top:97%", "", formatPower(live.load, locale), t.home, m.ids.live.load, "load")}
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Expanse: a ship's power distribution display with orbital trajectories.
// --------------------------------------------------------------------------

function renderExpanse(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 330;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const box = (cls, x, y, code, label, value, note, attr) => `
    <button class="exp-box ${cls}" style="${pos(x, y)}" ${attr}>
      <span class="exp-code">${escapeHtml(code)}</span><small>${escapeHtml(label)}</small>
      <b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const minSoc = clamp(m.forecast.minSoc ?? 10, 0, 100);
  const segments = Array.from({ length: 25 }, (_, i) => {
    const from = i * 4;
    return `<i class="${from < soc ? "on" : ""} ${from < minSoc ? "reserve" : ""}"></i>`;
  }).join("");
  const f = m.forecast;
  const code = String(m.station || "").replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `
    <div class="exp-grid"></div>
    <header class="exp-header">
      <div class="exp-tag">${escapeHtml(code)}</div>
      <div class="exp-title"><h1>${escapeHtml(m.name)}</h1><span>${escapeHtml(t.expanseTitle)}</span></div>
      <div class="exp-clock ${m.status.state}"><small>${escapeHtml(m.t[m.status.state])}</small><b>${escapeHtml(clockText(m))}</b></div>
    </header>
    <div class="exp-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <g class="exp-orbits" fill="none">
          <ellipse cx="240" cy="165" rx="210" ry="128"/><ellipse cx="240" cy="165" rx="150" ry="92"/>
          <line x1="20" y1="165" x2="460" y2="165"/><line x1="240" y1="22" x2="240" y2="308"/>
        </g>
        <g fill="none" stroke-linecap="round">
          ${m.config.showSolar ? flowPath("M150 72 Q218 72 222 140", live.solarActive, false, "pv") : ""}
          ${flowPath("M330 72 Q262 72 258 140", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${m.config.showBattery ? flowPath("M150 258 Q218 258 222 190", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M330 258 Q262 258 258 190", live.loadActive, true, "load")}
        </g>
        <g transform="translate(240 165)" fill="none">
          <circle r="34" class="exp-ring"/>
          <circle r="27" class="exp-spin"/>
          <path d="M-8 0 H8 M0 -8 V8" class="exp-cross"/>
        </g>
      </svg>
      <button class="exp-core" style="${pos(240, 165)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}"></button>
      ${m.config.showSolar ? box("pv", 92, 72, "SOL-01", t.solar, formatPower(live.solar, locale), live.solarActive ? "" : t.idle, entityAttr(m.ids.live.solar)) : ""}
      ${box("grid", 388, 72, "GRD-02", t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${!m.config.showBattery ? "" : box("battery", 92, 258, "BAT-03", t.battery, formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${box("load", 388, 258, "HAB-04", t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
    </div>
    ${m.config.showBattery ? `
    <button class="exp-soc" ${entityAttr(batteryEntityId(m))}>
      <span class="exp-soc-head"><small>${escapeHtml(t.stateOfCharge)}</small><b>${escapeHtml(formatPercent(live.soc, locale))}</b>
        <em>${escapeHtml(f.at ? `${f.mode === "charging" ? t.chipFull : t.chipLasts} ${formatWhen(f.at, locale)}` : isNum(f.stored) ? formatEnergy(f.stored, locale) : "")}</em></span>
      <span class="exp-soc-bar">${segments}</span>
    </button>` : ""}
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Foundation: a radiant of slowly turning orbits that forecasts the battery.
// --------------------------------------------------------------------------

// A negative start offset that follows the wall clock, so a looping
// animation continues where it was when the card re-renders.
function loopPhase(seconds, shift = 0) {
  return `-${(((Date.now() / 1000) + shift) % seconds).toFixed(2)}s`;
}

// One orbit of the radiant: a still ellipse with a planet travelling the
// whole way round it (SVG motion, so it follows the ellipse exactly).
function foundationOrbit(rx, ry, angle, r, seconds, reverse, m) {
  const path = reverse
    ? `M${rx} 0 A${rx} ${ry} 0 1 0 ${-rx} 0 A${rx} ${ry} 0 1 0 ${rx} 0`
    : `M${rx} 0 A${rx} ${ry} 0 1 1 ${-rx} 0 A${rx} ${ry} 0 1 1 ${rx} 0`;
  const still = m.config.animation === false || (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const planet = still
    ? `<circle cx="${rx}" r="${r}"/>`
    : `<circle r="${r}"><animateMotion dur="${seconds}s" begin="${loopPhase(seconds)}" repeatCount="indefinite" path="${path}"/></circle>`;
  return `<g class="fnd-orbit" transform="rotate(${angle})"><ellipse rx="${rx}" ry="${ry}"/>${planet}</g>`;
}

function renderFoundation(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 340;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const node = (cls, x, y, label, value, note, attr) => `
    <button class="fnd-node ${cls}" style="${pos(x, y)}" ${attr}>
      <small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  // Points on the orbits; a fixed pattern so the picture is stable between renders.
  const stars = Array.from({ length: 46 }, (_, i) => {
    const a = i * 2.39996;
    const r = 30 + ((i * 37) % 120);
    return `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r * 0.62).toFixed(1)}" r="${i % 7 ? 0.8 : 1.6}"/>`;
  }).join("");
  const f = m.forecast;
  const forecast = !m.config.showBattery
    ? liveSentence(m) || escapeHtml(t.galaxyQuiet)
    : f.mode === "discharging"
      ? fill(t.paperLasts, { time: `<em>${formatWhen(f.at, locale)}</em>` })
      : f.mode === "charging"
        ? fill(t.paperFull, { time: `<em>${formatWhen(f.at, locale)}</em>` })
        : escapeHtml(t.foundationSteady);
  return `
    <div class="fnd-dust"></div>
    <header class="fnd-header">
      <small>${escapeHtml(t.foundationTitle)}</small>
      <h1>${escapeHtml(m.name)}</h1>
      <span>${escapeHtml(m.now.toLocaleDateString(locale, { day: "numeric", month: "long" }))} · ${escapeHtml(clockText(m))} ${liveBadge(m)}</span>
    </header>
    <div class="fnd-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs>
          <radialGradient id="fnd-sphere" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#fff4d6"/><stop offset=".35" stop-color="#e8c47a" stop-opacity=".7"/><stop offset="1" stop-color="#b8862e" stop-opacity="0"/></radialGradient>
          <filter id="fnd-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g transform="translate(240 170)" fill="none">
          ${foundationOrbit(150, 58, 0, 2.5, 48, false, m)}
          ${foundationOrbit(128, 74, 32, 2, 70, true, m)}
          ${foundationOrbit(128, 74, -32, 2, 95, false, m)}
          <g class="fnd-stars">${stars}</g>
          <circle r="62" fill="url(#fnd-sphere)" class="fnd-sphere"/>
          <circle r="44" class="fnd-ring"/>
        </g>
        <g fill="none" stroke-linecap="round" filter="url(#fnd-glow)">
          ${m.config.showSolar ? flowPath("M240 48 L240 120", live.solarActive, false, "pv") : ""}
          ${m.config.showBattery ? flowPath("M108 170 L190 170", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M372 170 L290 170", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${flowPath("M240 292 L240 220", live.loadActive, true, "load")}
        </g>
      </svg>
      <button class="fnd-center" style="${pos(240, 170)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <b>${escapeHtml(formatPower(inverterHub(m).power, locale))}</b><small>${escapeHtml(t.inverter)}</small>
      </button>
      ${m.config.showSolar ? node("pv", 240, 22, t.sun, formatPower(live.solar, locale), "", entityAttr(m.ids.live.solar)) : ""}
      ${!m.config.showBattery ? "" : node("battery", 60, 170, batteryLabel(m), formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${node("grid", 420, 170, t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${node("load", 240, 318, t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
    </div>
    <p class="fnd-forecast"><small>${escapeHtml(t.foundationForecast)}</small>${forecast.replace(/<(?!\/?em>)/g, "&lt;")}</p>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Galaxy: a targeting computer flying down a trench, with an opening crawl.
// --------------------------------------------------------------------------

function renderGalaxy(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 300;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const readout = (cls, x, y, label, value, note, attr) => `
    <button class="gal-readout ${cls}" style="${pos(x, y)}" ${attr}>
      <small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  const crawl = liveSentence(m) || escapeHtml(t.galaxyQuiet);
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const lock = m.config.showBattery && soc <= (m.forecast.minSoc ?? 10) + 1 ? "low" : "";
  return `
    <div class="gal-stars"></div>
    <header class="gal-header">
      <small>${escapeHtml(t.galaxyTitle)}</small>
      <h1>${escapeHtml(m.name)}</h1>
      <div class="gal-crawl"><p>${crawl}</p></div>
    </header>
    <div class="gal-scope">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <g class="gal-trench" fill="none">
          ${[0, 1, 2, 3].map((i) => `<rect class="gal-warp" style="--d:${i}" x="190" y="115" width="100" height="70"/>`).join("")}
          <rect x="190" y="115" width="100" height="70" class="gal-target ${lock}"/>
          <path d="M240 100 V125 M240 175 V200 M175 150 H200 M280 150 H305" class="gal-cross ${lock}"/>
        </g>
        <g fill="none" stroke-linecap="round">
          ${m.config.showSolar ? flowPath("M14 12 L190 115", live.solarActive, false, "pv") : ""}
          ${flowPath("M466 12 L290 115", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${m.config.showBattery ? flowPath("M14 288 L190 185", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M466 288 L290 185", live.loadActive, true, "load")}
        </g>
      </svg>
      <button class="gal-center" style="${pos(240, 150)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <b>${escapeHtml(formatPower(inverterHub(m).power, locale))}</b>
        <small>${escapeHtml(t.inverter)}</small>
      </button>
      ${m.config.showSolar ? readout("pv", 62, 118, t.solar, formatPower(live.solar, locale), "", entityAttr(m.ids.live.solar)) : ""}
      ${!m.config.showBattery ? "" : readout(`battery ${lock}`, 62, 182, batteryLabel(m), formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${readout("grid", 418, 118, t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${readout("load", 418, 182, t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
      <div class="gal-hud"><span>${escapeHtml(clockText(m))}</span><span class="${m.status.state}">${escapeHtml(m.t[m.status.state])}</span></div>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Gate: a gate control room. Nine chevrons show the battery level, the
// dialing computer lists every flow, MALP telemetry is the energy section.
// --------------------------------------------------------------------------

// The compact gate: a smaller gate whose four chevrons are the connection
// points of the panels, grid, home and battery, each linked to a picture in
// a corner; the other five chevrons show the battery level. Chevron i sits
// at -90° + 40° × i. The wide layout keeps all nine chevrons for the level.
const GATE_PORTS = { pv: 8, grid: 1, load: 3, battery: 6 };
const GATE_LEVEL = [0, 2, 4, 5, 7];
const GATE_SCALE = 0.66;
const GATE_ICONS = { pv: [-258, -196], grid: [258, -196], load: [258, 176], battery: [-258, 176] };

// The ring, chevrons and event horizon, centred on 0,0 at full size.
function gateRingMarkup(m, { lit, active, ports, id }) {
  const glyphs = ["M-5 -6 L5 -6 L0 6 Z", "M-6 0 A6 6 0 1 1 6 0", "M-5 -6 V6 M5 -6 V6 M-5 0 H5", "M0 -7 L6 6 L-6 6 Z", "M-6 -4 H6 M-3 4 H3 M0 -7 V7"];
  let g = "";
  for (let i = 0; i < 39; i++) {
    const a = (i / 39) * Math.PI * 2;
    const b = a + Math.PI / 39;
    g += `<g transform="translate(${(Math.cos(a) * 214).toFixed(1)} ${(Math.sin(a) * 214).toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(1)})"><path d="${glyphs[i % 5]}" class="${i % 7 ? "" : "hi"}"/></g>`
      + `<line x1="${(Math.cos(b) * 203).toFixed(1)}" y1="${(Math.sin(b) * 203).toFixed(1)}" x2="${(Math.cos(b) * 225).toFixed(1)}" y2="${(Math.sin(b) * 225).toFixed(1)}" class="gt-seam"/>`;
  }
  const portOf = ports ? Object.fromEntries(Object.entries(GATE_PORTS).map(([kind, i]) => [i, kind])) : {};
  let chevrons = "";
  for (let i = 0; i < 9; i++) {
    const angle = -90 + i * 40;
    const a = (angle * Math.PI) / 180;
    const kind = portOf[i];
    const port = kind && ports[kind];
    const cls = !ports ? (i < lit ? "on" : "")
      : port ? `port ${kind} ${port[0] ? "on" : ""}` : kind ? "unused" : GATE_LEVEL.indexOf(i) < lit ? "on" : "";
    chevrons += `<g class="gt-chevron ${cls}" transform="translate(${(Math.cos(a) * 252).toFixed(1)} ${(Math.sin(a) * 252).toFixed(1)}) rotate(${angle + 90})">
      <path d="M-22 -14 L22 -14 L8 12 L-8 12 Z" class="gt-chevron-body"/><path d="M-13 -9 L13 -9 L0 9 Z" class="gt-chevron-light"/></g>`;
  }
  const spin = m.live.chargeActive ? "cw" : m.live.dischargeActive ? "ccw" : "";
  const ripples = Array.from({ length: 6 }, (_, i) => `<circle r="${(i + 1) * 26}" style="--d:${loopPhase(6, i)}"/>`).join("");
  return `
    <g class="gt-horizon ${active ? "open" : ""}"><circle r="190" class="gt-eh" fill="url(#gt-eh-${id})"/><g class="gt-ripples">${ripples}</g></g>
    <circle r="220" class="gt-ring-base"/>
    <circle r="246" class="gt-ring-edge"/><circle r="194" class="gt-ring-edge"/>
    <circle r="214" class="gt-ring-track"/>
    <g class="gt-glyphs ${spin}" style="--d:${loopPhase(180)}">${g}</g>
    ${chevrons}`;
}

// Each gate gets its own gradient ids: both are in the card, and a gradient
// inside the hidden one would not paint the visible one.
const gateDefs = (id) => `<defs>
  <radialGradient id="gt-eh-${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e6fbff" stop-opacity=".95"/><stop offset=".35" stop-color="#5fc8ff" stop-opacity=".75"/><stop offset=".8" stop-color="#1b5fb8" stop-opacity=".55"/><stop offset="1" stop-color="#0a2a5c" stop-opacity=".2"/></radialGradient>
  <linearGradient id="gt-zpm-${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a18"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
</defs>`;

// Wide layout: the full gate, nine chevrons for the battery level.
function gateFull(m, lit, active) {
  return `<svg class="gt-svg" viewBox="-300 -300 600 600" aria-hidden="true">${gateDefs("full")}${gateRingMarkup(m, { lit, active, ports: null, id: "full" })}</svg>`;
}

// Pictures for the corners, drawn around 0,0 within about ±40.
function gateIcon(kind, m) {
  const { live } = m;
  if (kind === "pv") {
    // An array of solar cells on a stand.
    const cells = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push(`<path d="M${-30 + c * 15 + r * 3} ${-18 + r * 11} h13 l2 9 h-13 z"/>`);
    return `<g class="gt-icon pv ${live.solarActive ? "on" : ""}"><path class="gt-icon-stand" d="M0 15 V30 M-12 30 H12"/><g class="gt-icon-cells">${cells.join("")}</g></g>`;
  }
  if (kind === "battery") {
    // A zero point module: a crystal filled to the battery level.
    const level = isNum(live.soc) ? clamp(live.soc, 0, 100) / 100 : 0;
    const top = 30 - level * 56;
    return `<g class="gt-icon battery ${live.chargeActive || live.dischargeActive ? "on" : ""}">
      <clipPath id="gt-zpm-clip"><path d="M-11 -28 L11 -28 L16 -20 L16 22 L11 30 L-11 30 L-16 22 L-16 -20 Z"/></clipPath>
      <path class="gt-zpm-glass" d="M-11 -28 L11 -28 L16 -20 L16 22 L11 30 L-11 30 L-16 22 L-16 -20 Z"/>
      <rect clip-path="url(#gt-zpm-clip)" x="-16" y="${top.toFixed(1)}" width="32" height="${(30 - top).toFixed(1)}" fill="url(#gt-zpm-compact)" class="gt-zpm-core"/>
      <path class="gt-zpm-band" d="M-14 -34 H14 V-28 H-14 Z M-14 30 H14 V36 H-14 Z"/>
      <path class="gt-zpm-edge" d="M0 -28 V30"/></g>`;
  }
  if (kind === "grid") {
    // A dial home device: rings of glyph keys round a red dome.
    const keys = (rx, ry, n) => Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return `<ellipse cx="${(Math.cos(a) * rx).toFixed(1)}" cy="${(Math.sin(a) * ry).toFixed(1)}" rx="3" ry="2"/>`;
    }).join("");
    return `<g class="gt-icon grid ${live.importActive || live.exportActive ? "on" : ""}">
      <path class="gt-dhd-base" d="M-36 4 L-26 24 H26 L36 4"/>
      <ellipse class="gt-dhd-top" rx="38" ry="18" cy="2"/>
      <g class="gt-dhd-keys">${keys(30, 13, 16)}${keys(19, 8, 12)}</g>
      <ellipse class="gt-dhd-dome" rx="8" ry="5" cy="1"/></g>`;
  }
  // The base inside the mountain.
  return `<g class="gt-icon load ${live.loadActive ? "on" : ""}">
    <path class="gt-sgc-mountain" d="M-40 28 L-16 -18 L-4 -8 L10 -30 L40 28 Z"/>
    <path class="gt-sgc-door" d="M-12 28 V8 H12 V28"/><path class="gt-sgc-door-line" d="M0 8 V28"/>
    <path class="gt-sgc-lights" d="M-26 20 h4 M-18 14 h4 M18 16 h4 M26 22 h4"/></g>`;
}

// Compact layout: a smaller gate with the corner pictures linked to their
// connection chevrons.
function gateCompact(m, lit, active) {
  const { live, config } = m;
  const ports = {
    pv: config.showSolar && [live.solarActive, false],
    grid: [live.importActive || live.exportActive, live.exportActive],
    load: [live.loadActive, true],
    battery: config.showBattery && [live.chargeActive || live.dischargeActive, live.chargeActive],
  };
  let lines = "";
  let icons = "";
  for (const [kind, index] of Object.entries(GATE_PORTS)) {
    const port = ports[kind];
    if (!port) continue;
    const angle = ((-90 + index * 40) * Math.PI) / 180;
    const tip = [Math.cos(angle) * 276 * GATE_SCALE, Math.sin(angle) * 276 * GATE_SCALE];
    const [x, y] = GATE_ICONS[kind];
    const start = [x + (x < 0 ? 44 : -44), y + (y < 0 ? 18 : -14)];
    lines += flowPath(`M${start[0]} ${start[1]} Q${((start[0] + tip[0]) / 2).toFixed(0)} ${start[1]} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`, port[0], port[1], kind);
    icons += `<g transform="translate(${x} ${y})">${gateIcon(kind, m)}</g>`;
  }
  return `<svg class="gt-svg" viewBox="-330 -280 660 560" aria-hidden="true">${gateDefs("compact")}
    <g class="gt-lines" fill="none" stroke-linecap="round">${lines}</g>
    ${icons}
    <g transform="scale(${GATE_SCALE})">${gateRingMarkup(m, { lit, active, ports, id: "compact" })}</g></svg>`;
}

function renderGate(m) {
  const { t, locale, live, config } = m;
  const f = m.forecast;
  const hub = inverterHub(m);
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : null;
  const pvCapacity = positiveNumber(config.pv_capacity);
  // Chevrons: the battery level in nine steps; without a battery, the
  // inverter's load (or the panels' share of their size).
  const level = config.showBattery && isNum(soc) ? soc
    : isNum(hub.share) ? hub.share
      : pvCapacity ? clamp((live.solar / (pvCapacity * 1000)) * 100, 0, 100) : 0;
  const active = live.loadActive || live.solarActive;
  const atReserve = config.showBattery && isNum(soc) && soc <= f.minSoc + 1;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const max = Math.max(1000, (pvCapacity || 0) * 1000, live.solar, live.load, live.charge, live.discharge, live.gridImport, live.gridExport);
  const rows = [
    config.showSolar && ["pv", t.solar, live.solar, live.solarActive, pvCapacity ? fill(t.gateOfCapacity, { pct: formatNumber((live.solar / (pvCapacity * 1000)) * 100, locale, 0), size: `${formatNumber(pvCapacity, locale, 1)} kWp` }) : "", m.ids.live.solar],
    config.showBattery && ["battery", t.battery, batteryFlow, live.chargeActive || live.dischargeActive, batteryStatus(m), batteryEntityId(m)],
    ["grid", t.grid, gridValue, live.importActive || live.exportActive, gridStatus(m), gridEntityId(m)],
    ["load", t.home, live.load, live.loadActive, t.consumption, m.ids.live.load],
    ["inverter", t.inverter, hub.power, hub.power > ACTIVE_W, isNum(hub.share) ? fill(t.gateOfCapacity, { pct: formatNumber(hub.share, locale, 0), size: formatPower(m.system.inverter.rated, locale) }) : "", "inverter"],
  ].filter(Boolean);
  const locked = rows.filter((r) => r[3]).length;
  const status = atReserve ? ["alert", t.gateReserve]
    : live.chargeActive ? ["on", t.gateInbound]
      : live.dischargeActive ? ["on", t.gateOutbound]
        : live.exportActive ? ["on", t.gateExport]
          : live.importActive ? ["on", t.gateImport]
            : ["", t.gateIdle];
  const kv = (label, value) => `<div class="gt-kv"><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b></div>`;
  const own = isNum(m.today.load) && isNum(m.today.gridImport) && m.today.load > 0.05
    ? formatPercent(clamp(((m.today.load - m.today.gridImport) / m.today.load) * 100, 0, 100), locale) : "—";
  const corner = (cls, pos, label, value) => `<div class="gt-node ${cls}" style="${pos}">${escapeHtml(label)}<b>${escapeHtml(value)}</b></div>`;
  const values = {
    pv: [t.solar, formatPower(live.solar, locale), m.ids.live.solar],
    grid: [t.grid, formatPower(gridValue, locale), gridEntityId(m)],
    battery: [t.battery, `${live.dischargeActive ? "−" : live.chargeActive ? "+" : ""}${formatPower(batteryFlow, locale)}`, batteryEntityId(m)],
    load: [t.home, formatPower(live.load, locale), m.ids.live.load],
  };
  // Readouts under the corner pictures of the compact gate (viewBox -330…330 × -280…280).
  const label = (kind) => {
    const [x, y] = GATE_ICONS[kind];
    const [name, value, entity] = values[kind];
    return `<button class="gt-label ${kind}" style="left:${(((x + 330) / 660) * 100).toFixed(1)}%;top:${(((y + 44 + 280) / 560) * 100).toFixed(1)}%" ${entityAttr(entity)}>${escapeHtml(name)}<b>${escapeHtml(value)}</b></button>`;
  };
  const center = `
        <button class="gt-center" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
          ${config.showBattery ? `
            <small>${escapeHtml(t.battery)}</small><b>${escapeHtml(formatPercent(soc, locale))}</b>
            ${f.capacity ? `<span>${escapeHtml(`${isNum(f.stored) ? formatNumber(f.stored, locale, 1) : "—"} / ${formatEnergy(f.capacity, locale)}`)}</span>` : ""}
            ${f.at ? `<em>${escapeHtml(`${f.mode === "charging" ? "▲" : "▼"} ${formatWhen(f.at, locale)}`)}</em>` : ""}` : `
            <small>${escapeHtml(t.inverter)}</small><b>${escapeHtml(formatPower(hub.power, locale))}</b>`}
        </button>`;
  return `
    <header class="gt-top">
      <span class="gt-tag">SGC-E</span>
      <div class="gt-title"><h1>${escapeHtml(m.name)} · ${escapeHtml(t.gateTitle)}</h1><span>${escapeHtml(t.gateSub)} · ${escapeHtml(String(m.station || "—"))}</span></div>
      <div class="gt-right"><span>${escapeHtml(m.now.toLocaleDateString(locale, { day: "numeric", month: "short" }))} · ${escapeHtml(clockText(m))}</span><span class="gt-live ${m.status.state}">${escapeHtml(m.t[m.status.state])}</span></div>
    </header>
    <div class="gt-layout ${config.wide ? "wide" : ""}">
      <div class="gt-gate gt-compact">
        ${gateCompact(m, Math.round((level / 100) * GATE_LEVEL.length), active)}
        ${center}
        ${["pv", "grid", "battery", "load"].filter((kind) => (kind !== "pv" || config.showSolar) && (kind !== "battery" || config.showBattery)).map(label).join("")}
      </div>
      <div class="gt-gate gt-full">
        ${gateFull(m, Math.round((level / 100) * 9), active)}
        ${center}
        ${config.showSolar ? corner("pv", "left:0;top:4%", t.solar, formatPower(live.solar, locale)) : ""}
        ${corner("grid", "right:0;top:4%", t.grid, formatPower(gridValue, locale))}
        ${config.showBattery ? corner("battery", "left:0;bottom:4%", t.battery, `${live.dischargeActive ? "−" : live.chargeActive ? "+" : ""}${formatPower(batteryFlow, locale)}`) : ""}
        ${corner("load", "right:0;bottom:4%", t.home, formatPower(live.load, locale))}
      </div>
      <div class="gt-panel gt-dial">
        <div class="gt-ph"><span>${escapeHtml(t.gateDial)}</span><b>${escapeHtml(fill(t.gateLocked, { n: locked, total: rows.length }))}</b></div>
        ${rows.map(([cls, label, value, active, note, entity], i) => `
          <button class="gt-row ${cls}" ${entity === "inverter" ? 'data-action="inverter"' : entityAttr(entity)}>
            <i class="gt-ch ${active ? "on" : ""}"></i>
            <span><small>${escapeHtml(fill(t.gateChevron, { n: i + 1 }))}</small><strong>${escapeHtml(label)}</strong><i class="gt-bar"><i style="width:${clamp((value / max) * 100, active ? 2 : 0, 100).toFixed(0)}%"></i></i></span>
            <span class="gt-v">${escapeHtml(formatPower(value, locale))}${note ? `<em>${escapeHtml(note)}</em>` : ""}</span>
          </button>`).join("")}
        <div class="gt-status ${status[0]}">◆ ${escapeHtml(status[1])} ◆</div>
        <div class="gt-kvs">
          ${config.showBattery ? kv(f.mode === "charging" ? t.chipFull : t.chipLasts, f.at ? formatWhen(f.at, locale) : "—") : kv(t.gridImport, formatEnergy(m.today.gridImport, locale))}
          ${config.showBattery ? kv(t.stored, isNum(f.stored) ? formatEnergy(f.stored, locale) : "—") : kv(t.gridExport, formatEnergy(m.today.gridExport, locale))}
          ${config.showBattery ? kv(t.gateReserveLabel, formatPercent(f.minSoc, locale)) : kv(t.consumption, formatEnergy(m.today.load, locale))}
          ${kv(t.autarkyToday, own)}
        </div>
      </div>
      <div class="gt-energy">${energySectionHtml(m)}</div>
      <div class="sfc-sections">${inverterHtml(m)}${systemHtml(m)}${panelsHtml(m)}</div>
    </div>`;
}

const THEME_RENDER = {
  diorama: renderDiorama,
  aurora: renderAurora,
  paper: renderPaper,
  lcars: renderLcars,
  atlantis: renderAtlantis,
  expanse: renderExpanse,
  foundation: renderFoundation,
  galaxy: renderGalaxy,
  gate: renderGate,
};
