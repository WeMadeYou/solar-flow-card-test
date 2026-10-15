
// [config key, label key, input step]
const EDITOR_NUMBERS = [
  ["battery_capacity", "editorBatteryCapacity", "0.1"],
  ["battery_min_soc", "editorBatteryMinSoc", "1"],
  ["pv_capacity", "editorPvCapacity", "0.1"],
  ["pv_panels", "editorPvPanels", "1"],
  ["inverter_power_rating", "editorInverterRating", "0.1"],
  ["price_import", "editorPriceImport", "0.01"],
  ["price_export", "editorPriceExport", "0.01"],
  ["co2_factor", "editorCo2", "0.01"],
];
// Switches that are off unless set: [config key, label key].
const EDITOR_OPTIN = [["wide", "editorWide"], ["show_insights", "editorInsights"]];
const EDITOR_SWITCHES = [
  ["show_solar", "editorSolar"],
  ["show_battery", "editorBattery"],
  ["show_energy", "editorShowEnergy"],
  ["show_chart", "editorShowChart"],
  ["show_forecast", "editorShowForecast"],
  ["show_system", "editorShowSystem"],
  ["show_panels", "editorShowPanels"],
  ["show_weather", "editorShowWeather"],
  ["show_self_sufficiency", "editorShowSelfSufficiency"],
  ["show_self_use", "editorShowSelfUse"],
  ["show_savings", "editorShowSavings"],
  ["show_co2", "editorShowCo2"],
  ["show_yield", "editorShowYield"],
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
    // The editor writes the current option names; an old name is replaced on
    // the next change.
    this._config = migrateConfig(config || {});
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
        .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
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
          <label><span>${escapeHtml(t.editorLanguage)}</span>
            <select id="language">
              <option value="">${escapeHtml(t.languageAuto)}</option>
              ${Object.entries(LANGUAGE_NAMES).map(([code, name]) => `<option value="${code}" ${this._config.language === code ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
            </select>
          </label>
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
        ${EDITOR_OPTIN.map(([key, label]) => `
          <div class="switch"><label for="${key}" style="color:inherit">${escapeHtml(t[label])}</label>
            <input id="${key}" type="checkbox" ${this._config[key] === true ? "checked" : ""} /></div>`).join("")}
        <p class="hint">${escapeHtml(t.editorHint)}</p>
      </div>`;
    const root = this.shadowRoot;
    root.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
      this._set("theme", button.dataset.theme);
      this._render();
    }));
    root.getElementById("language")?.addEventListener("change", (e) => {
      this._set("language", e.target.value || undefined);
      this._render();
    });
    root.getElementById("title")?.addEventListener("change", (e) => this._set("title", e.target.value.trim() || undefined));
    root.getElementById("currency")?.addEventListener("change", (e) => this._set("currency", e.target.value.trim() || undefined));
    root.getElementById("station_id")?.addEventListener("change", (e) => this._set("station_id", e.target.value || undefined));
    EDITOR_NUMBERS.forEach(([key]) => root.getElementById(key)?.addEventListener("change", (e) => {
      const number = Number.parseFloat(e.target.value);
      this._set(key, Number.isFinite(number) ? number : undefined);
    }));
    EDITOR_OPTIN.forEach(([key]) => root.getElementById(key)?.addEventListener("change", (e) =>
      this._set(key, e.target.checked ? true : undefined)
    ));
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
    description: "Solar, battery, grid and home power flow with charts, forecasts and nine themes.",
    preview: true,
    documentationURL: "https://github.com/gratak/solar-flow-card",
  });
}

console.info(
  `%c SOLAR FLOW CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#f5a400;font-weight:700;padding:3px 6px;border-radius:4px 0 0 4px",
  "color:#f5a400;background:#fff6dc;font-weight:700;padding:3px 6px;border-radius:0 4px 4px 0"
);
