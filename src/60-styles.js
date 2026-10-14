
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
    .dio-chip.sun { background: #fff6dc; } .dio-chip.grid { background: #e6eefc; } .dio-chip.bat { background: #e3f7ee; } .dio-chip.home { background: #fde9e4; }
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
