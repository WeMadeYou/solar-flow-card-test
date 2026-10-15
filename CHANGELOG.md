# Changelog

## 1.0.2

- Grid power on DeyeCloud stations that only report the net grid power ("Grid Net Power", `wirePower`): the card showed the grid as 0 W / balanced while importing. The net power is now used (+ import, − export), also in the power chart.
- When a DeyeCloud station sensor is missing or has no value, the inverter's own sensor is used instead: `TotalGridPower`, `TotalSolarPower`, `TotalConsumptionPower`, `BatteryPower`, `SOC`.

## 1.0.1

- LICENSE uses the plain MIT layout, so GitHub and HACS recognize it; both copyright holders are kept.
- Smaller animated preview in the README (2.9 MB).

## 1.0.0

First stable release: everything from the 0.1 betas, tested on a live DeyeCloud installation.

- `show_autarky` is now `show_self_sufficiency`, matching the label. The old name keeps working, and the visual editor switches to the new one on the next change.
- Releases are regular releases, so HACS offers updates without "Show beta versions".
- A live demo runs on GitHub Pages, and the README shows an animated preview of all themes.
- HACS validation runs in GitHub Actions.

## 0.1.8-beta

- Installation: phases are shown only when at least two have voltage or carry power. Single-phase inverters that report L2/L3 as 0 W / 0 V no longer get empty phase tiles; the rest of the section stays.

## 0.1.7-beta

- New **Installation** section in every theme:
  - power on each phase with grid power, voltage and the spread between phases;
  - inverter load against its rated power;
  - battery temperature, voltage and current, with a warning when the battery is below 10 °C or above 45 °C;
  - the generator while it runs.
- DeyeCloud sensors are found automatically; other inverters set them under `entities:`.
- New options: `show_system` (also in the editor) and `inverter_power_rating`.
- LCARS: a battery that is too cold or too hot sets the status to caution.

## 0.1.6-beta

- Three new themes:
  - `expanse`: a ship's power distribution display with orbital trajectories and a segmented charge bar.
  - `foundation`: a radiant of turning golden orbits around the battery, with a written forecast.
  - `galaxy`: a targeting computer in a trench, with an opening crawl telling where the power comes from.

## 0.1.5-beta

- Chart legend entries are buttons: a click hides or shows that series (PV, home, battery, grid, SOC; PV, consumption, grid import on the bar charts). The scale follows the visible series, the tooltip drops hidden ones, and the choice is remembered in the browser.

## 0.1.4-beta

- Flow dots move smoothly in the direction of the flow in every theme. The animation used a CSS variable inside its keyframes, which Chromium does not interpolate, so the dots stood still or jumped.
- Paper: dots run along the Sankey ribbons, between the label columns.
- LCARS: a light wave runs over the lit segments, backwards for battery charging and grid export.
- With "reduce motion" switched on in the system the dots move three times slower instead of stopping; only decorative effects (pulsing, breathing, the LCARS wave) stop. `animation: false` still turns everything off.

## 0.1.3-beta

- Translations moved to `translations/<language>.json`, one file per language; the build embeds them and the editor lists every language automatically.
- `scripts/check-translations.mjs` reports missing keys, typos and placeholder mistakes.
- GitHub Actions check every pull request and rebuild `solar-flow-card.js` after a merge.
- `CONTRIBUTING.md`: how to add a language.
- Language codes with a region (`pt-br`) are supported.

## 0.1.2-beta

- Language picker in the visual editor (Home Assistant language, English, Polski). The `language` option already worked in YAML.

## 0.1.1-beta

- Tiles and summary labels wrap to two lines instead of being cut off ("Rozładowanie magazynu", "Samowystarczalność").
- Paper: the sentence lists only the sources in use, as shares of what they supply right now, adding up to 100% (it could show "battery 112%" when the inverter used part of the battery's power).
- Paper: the Sankey diagram has "From / To" headings and a grey "Losses" band for the power that goes into the inverter but not out of it, so both sides match.

## 0.1.0-beta

First public beta.

- Five themes: Diorama, Aurora, Paper, LCARS, Atlantis.
- DeyeCloud sensors found automatically; other inverters through `entities:`.
- Periods 24H / 3D / 7D / month / all time with charts from Home Assistant's history and statistics.
- Period summary (self-sufficiency, self-consumption, savings, CO₂, yield per kWp), each item can be switched off.
- Battery forecast, inverter details, optimizer tiles.
- Installations without PV (battery with an EMS): `show_solar: false`.
- English and Polish.
