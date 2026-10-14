# Changelog

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
