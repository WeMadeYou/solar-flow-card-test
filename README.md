# Solar Flow Card

> **Beta.** Things may still change between versions; please report problems in the issues.

A Home Assistant dashboard card for solar installations with a battery: live power flow, charts, a battery forecast, inverter details and per-panel production, in five themes.

DeyeCloud sensors are found automatically; any other inverter works by pointing the card at its entities.

| Diorama | Aurora | Paper | LCARS | Atlantis |
|---|---|---|---|---|
| ![Diorama](docs/diorama.png) | ![Aurora](docs/aurora.png) | ![Paper](docs/paper.png) | ![LCARS](docs/lcars.png) | ![Atlantis](docs/atlantis.png) |

## Features

- **Live power flow** between solar, battery, grid and home, animated in the direction energy moves.
- **Periods** 24H, 3D, 7D, month and all time for production, consumption, grid import/export and battery charge/discharge.
- **Charts** following the selected period: power over the day (24H, 3D) and daily or monthly energy bars (7D, month, all). Hover or tap for values.
- **Period summary**: self-sufficiency, self-consumption, savings, avoided CO₂ and yield per kWp (energy produced per kW of installed panels; compare days and installations). Each item can be switched off.
- **Installations without PV** (battery with an EMS): `show_solar: false`.
- **Battery forecast**: time until full while charging, time until the reserve while discharging.
- **Inverter details** (tap the inverter or the house): PV strings, temperatures, battery and grid readings.
- **Panels**: one tile per optimizer with today's production; the weakest panel is highlighted when it falls below 85% of the median.
- English and Polish; the visual editor covers every option.

History comes from Home Assistant itself (recorder history and long-term statistics), so the card adds no requests to your inverter's cloud.

## Themes

| Theme | Look |
|---|---|
| `diorama` | An isometric house with your panels on the roof; the sky follows the time of day, windows light up at night. |
| `aurora` | Neon rings and glowing flows on a night sky. |
| `paper` | An editorial page: a sentence that explains the moment and a Sankey diagram of where the power goes. |
| `lcars` | A starship operations panel with segment bars, a battery cell gauge and a status line. |
| `atlantis` | A holographic power core with the battery in a crystal and hexagonal panels. |

## Installation

### HACS

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/gratak/solar-flow-card`, type **Dashboard**.
2. Search for **Solar Flow Card**, **Download**.
3. Reload the browser. HACS adds the dashboard resource for you.

While the card is in beta its releases are marked as pre-releases: in HACS open the card, ⋮ → **Redownload** and turn on **Show beta versions** to pick one.

### Manual

Copy `solar-flow-card.js` to `config/www/` and add a dashboard resource `/local/solar-flow-card.js` of type **JavaScript module**.

## Configuration

```yaml
type: custom:solar-flow-card
theme: diorama            # diorama | aurora | paper | lcars | atlantis
title: Dom                # optional; defaults to the station name
battery_capacity: 23.5    # kWh, enables the battery forecast
battery_min_soc: 10       # %, reserve used for "lasts until"
pv_capacity: 8            # kWp, enables the specific yield
pv_panels: 16             # modules drawn on the diorama roof (optimizers count automatically)
price_import: 1.10        # per kWh, enables savings
price_export: 0.30        # per kWh exported
currency: zł              # defaults to the card language's currency
co2_factor: 0.7           # kg CO₂ per grid kWh (default 0.5)
period: today             # default tab: today | 3d | 7d | month | all
```

| Option | Default | Description |
|---|---|---|
| `theme` | `diorama` | Card theme. |
| `station_id` | first station | DeyeCloud station when you have several. |
| `language` | Home Assistant | `en` or `pl`. |
| `show_energy` | `true` | Energy section with tabs, chart, tiles and summary. |
| `show_chart` | `true` | Chart in the energy section. |
| `show_forecast` | `true` | Battery forecast (needs `battery_capacity`). |
| `show_panels` | `true` | Optimizer / panel tiles. |
| `show_solar` | `true` | Set `false` for installations without PV (battery with an EMS): hides the sun, panels, PV production and the PV-based summary items in every theme. |
| `show_autarky` | `true` | Self-sufficiency in the period summary. |
| `show_self_use` | `true` | Self-consumption in the period summary. |
| `show_savings` | `true` | Savings in the period summary (also needs `price_import`). |
| `show_co2` | `true` | Avoided CO₂ in the period summary. |
| `show_yield` | `true` | Yield per kWp in the period summary (also needs `pv_capacity`). |
| `panel_strings` | 1 or 2 | Number of strings the panels are split into, in order. |
| `animation` | `true` | Animated flows. |
| `load_fonts` | `true` | Load the theme's font from Google Fonts; off uses system fonts. |
| `invert_battery` | `false` | Your signed battery power is positive while charging. |
| `invert_grid` | `false` | Your signed grid power is positive while exporting. |

### Other inverters

Set the entities the card should use. Every key is optional; use either separate import/export (charge/discharge) sensors or one signed sensor.

```yaml
type: custom:solar-flow-card
entities:
  solar_power: sensor.pv_power                 # W
  load_power: sensor.house_power               # W
  battery_power: sensor.battery_power          # W, + discharging / − charging
  battery_soc: sensor.battery_soc              # %
  grid_power: sensor.grid_power                # W, + import / − export
  # or: grid_import_power / grid_export_power, battery_charge_power / battery_discharge_power
  solar_energy: sensor.pv_energy_today         # kWh today, state_class total_increasing
  load_energy: sensor.house_energy_today
  grid_import_energy: sensor.grid_import_today
  grid_export_energy: sensor.grid_export_today
  battery_charge_energy: sensor.battery_charge_today
  battery_discharge_energy: sensor.battery_discharge_today
panels:                                        # optional, energy today per panel
  - sensor.panel_1_energy_today
  - entity: sensor.panel_2_energy_today
    power: sensor.panel_2_power
    name: South 2
```

The 3D, 7D, month and all-time totals and bars come from the long-term statistics of the daily energy sensors, so those need `state_class: total_increasing`. Statistics are compiled hourly; today's part always uses the live sensor.

## Development

The card is built from `src/*.js` into `solar-flow-card.js`:

```sh
node scripts/build.mjs
```

`demo/index.html` runs the card against a stand-in Home Assistant (`demo/mock-hass.js`) with DeyeCloud-style data; serve the repository root and open it to try themes, scenarios and languages. `node scripts/screenshots.mjs` (needs Playwright) renders the screenshots in `docs/`.

## License

MIT. The data layer started from the Energy Flow card of [hass-deyecloud](https://github.com/heavenknows1978/hass-deyecloud) by Trần Công Tuấn Anh, also MIT.
