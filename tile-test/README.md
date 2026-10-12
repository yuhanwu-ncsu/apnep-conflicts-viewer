# Tippecanoe test

This isolated branch test uses the local APNEP `all_pairs.geojson` upload kit. It builds seven MapLibre vector tilesets from all 49,277 hexes, one tileset per pair, so visitors load only their selected pair. It checks for uncompressed PBF tiles and records tile count and sizes in `tile-report.json`. It uploads a runnable site as a GitHub Actions artifact. It does not deploy or replace the live Experience Builder page.

The checked-in `all_pairs.geojson.gz` contains only the eight fields needed for the map filters and popup. Regenerate it after the local source data changes with:

```powershell
python tile-test/prepare_input.py
```

The workflow builds Tippecanoe on Ubuntu, following the upstream build instructions. Download the `apnep-vector-tile-test` Actions artifact, extract it, and run `python -m http.server 8000` in its root. Open `http://localhost:8000/` to test the seven-pair tile viewer. The report gives the actual tile footprint before any Pages deployment decision.

The test viewer reproduces the live page's three categories, seven pair views, bivariate legend, pressure/resource/conflict switches, information panel, layer visibility and opacity, basemap choices, zoom, home, and expanded map. Pair selection is reflected in the URL. Click a hex to inspect its classes and source values.

The collapsible, full-height left side panel carries the live viewer's Info & Sources and Popup pattern, including the five pill-style disclosures, clickable source arrows, and an interactive APNEP region SVG with four percentage buttons. Its popup uses the bivariate matrix and class-relative value bars. The bivariate legend stays on the right; clicking a hex outlines it on the map and softly rings its matching legend swatch. The header uses the APNEP logo served by the U.S. Fish and Wildlife Service. The place search is limited to six named locations, and the three basemap choices restyle OpenStreetMap raster tiles. The runtime requests MapLibre and basemap tiles from external servers, while conflict data comes from the static local vector tiles.
