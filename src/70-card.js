
const DEFAULT_CONFIG = {
  theme: "diorama",
  show_energy: true,
  show_chart: true,
  show_forecast: true,
  show_panels: true,
  animation: true,
  load_fonts: true,
};

// Chart series the viewer switched off by clicking the legend; remembered in
// this browser for every card. Storage can be unavailable (private mode).
const HIDDEN_SERIES_KEY = "solar-flow-card:hidden-series";

function loadHiddenSeries() {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDDEN_SERIES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((kind) => typeof kind === "string") : []);
  } catch (error) {
    return new Set();
  }
}

function saveHiddenSeries(hidden) {
  try {
    localStorage.setItem(HIDDEN_SERIES_KEY, JSON.stringify([...hidden]));
  } catch (error) {
    // Not persisted; the choice still applies until the page reloads.
  }
}

class SolarFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
    this._period = null;
    this._inverterOpen = false;
    this._cache = new Map();
    this._hiddenSeries = loadHiddenSeries();
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
    this._config = { ...DEFAULT_CONFIG, ...migrateConfig(normalized) };
    if (!THEMES.includes(this._config.theme)) this._config.theme = "diorama";
    this._signature = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 8 + (this._config.show_system !== false ? 2 : 0) + (this._config.show_energy !== false ? 5 : 0) + (this._config.show_panels !== false ? 2 : 0);
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
    const buckets = withLiveToday(entry.data.buckets, spec, today).map(deriveLoadEnergy);
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
      data: energy.buckets ? { kind: "energy", spec: energy.spec, buckets: energy.buckets, noSolar: this._config.show_solar === false } : null,
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
    const noBattery = this._config.show_battery === false;
    // No consumption sensor: the same balance as liveValues(), point by point.
    let load = series.load || null;
    if (!load && (series.solar || grid)) {
      const length = (series.solar || grid).length;
      load = Array.from({ length }, (_, i) => {
        const [s, g, b] = [series.solar?.[i], grid?.[i], battery?.[i]];
        if (!isNum(s) && !isNum(g) && !isNum(b)) return null;
        return Math.max(0, Math.max(0, isNum(s) ? s : 0) + (isNum(g) ? g : 0) + (isNum(b) ? b : 0));
      });
    }
    return {
      kind: "power",
      spec,
      solar: this._config.show_solar === false ? null : series.solar || null,
      load,
      battery: noBattery ? null : battery,
      grid,
      soc: noBattery ? null : series.soc || null,
    };
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
      const showSolar = config.show_solar !== false;
      const live = liveValues(resolved, config);
      if (!showSolar) {
        live.solar = 0;
        live.solarActive = false;
      }
      const showBattery = config.show_battery !== false;
      if (!showBattery) {
        Object.assign(live, { charge: 0, discharge: 0, battery: 0, soc: null, chargeActive: false, dischargeActive: false });
      }
      const status = liveStatus(resolved);
      const today = todayEnergy(resolved);
      const energy = this._periodEnergy(resolved, period, today);
      const chart = this._chartState(resolved, period, energy);
      const forecast = batteryForecast(live, config);
      const panels = showSolar ? panelData(this._hass, resolved, config) : null;
      const weather = theme === "diorama" ? weatherData(this._hass, config) : null;
      const inverter = this._inverterOpen ? inverterReadings(resolved) : null;
      const system = config.show_system !== false ? systemData(this._hass, resolved, config) : null;
      if (system && !showBattery) Object.assign(system, { battery: [], batteryWarn: null });
      const since = period === "all" && energy.buckets?.length
        ? energy.buckets[0].start.toLocaleDateString(locale, { month: "short", year: "numeric" })
        : null;
      const ids = {
        live: Object.fromEntries(Object.entries(resolved.live).map(([k, v]) => [k, v?.entityId || null])),
        energy: Object.fromEntries(Object.entries(resolved.energy).map(([k, v]) => [k, v?.entityId || null])),
      };
      const now = new Date();
      const signature = JSON.stringify([
        language, config, period, [...this._hiddenSeries], live, status.state, today, energy.totals, Boolean(energy.loading),
        chart && [Boolean(chart.loading), Boolean(chart.error), chart.at], forecast.mode, Math.round(forecast.hours * 60 || 0),
        panels?.panels.map((p) => [p.today, p.power]), system, weather && [weather.condition, weather.temperature], this._inverterOpen,
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
          showSolar,
          showSystem: config.show_system !== false,
          showBattery,
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
        system,
        weather,
        inverterOpen: this._inverterOpen,
        hiddenSeries: this._hiddenSeries,
      };
      model.systemStatus = systemStatus(status, forecast, panels, system);

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
    root.querySelectorAll("[data-series]").forEach((element) => {
      element.addEventListener("click", () => {
        const kind = element.dataset.series;
        if (this._hiddenSeries.has(kind)) this._hiddenSeries.delete(kind);
        else this._hiddenSeries.add(kind);
        saveHiddenSeries(this._hiddenSeries);
        this._signature = "";
        this._render();
      });
    });
    wireChart(root, model.chart?.data, model.t, model.locale, model.hiddenSeries);
  }
}
