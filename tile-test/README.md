# Tippecanoe test

This isolated branch test uses the local APNEP `all_pairs.geojson` upload kit. It builds seven MapLibre vector tilesets from all 49,277 hexes, one tileset per pair, so visitors load only their selected pair. It checks for uncompressed PBF tiles and records tile count and sizes in `tile-report.json`. It uploads a runnable site as a GitHub Actions artifact. It does not deploy or replace the live Experience Builder page.

The checked-in `all_pairs.geojson.gz` contains only the eight fields needed for the map filters and popup. Regenerate it after the local source data changes with:

```powershell
python tile-test/prepare_input.py
```

The workflow builds Tippecanoe on Ubuntu, following the upstream build instructions. Download the `apnep-vector-tile-test` Actions artifact, extract it, and run `python -m http.server 8000` in its root. Open `http://localhost:8000/` to test the seven-pair tile viewer. The report gives the actual tile footprint before any Pages deployment decision.
