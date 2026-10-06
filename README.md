# APNEP Data Inventory Conflicts Viewer

An interactive map viewer for the Albemarle-Pamlico National Estuary Partnership (APNEP) Phase 2 data inventory. It overlays human-use pressures (such as commercial fishing) with ecological and community resources (such as nursery areas) on a ~5 km² hex grid, classifies each cell on a 3×3 pressure-vs-resource scale, and highlights the cells where the two overlap most.

**Live site:** https://yuhanwu-ncsu.github.io/apnep-conflicts-viewer/

Built with ArcGIS Experience Builder 1.21 (Developer Edition). The underlying data comes from an NCSU ArcGIS Online feature layer (`all_pairs`), with each map view filtered to one pressure–resource pair.

Developer reference: [Experience Builder guide](https://developers.arcgis.com/experience-builder/guide/) — intro, install, and developer docs.

## What's in this repo

- `index.html` — the app entry point. It is the file Experience Builder exports, kept as-is except for a small script at the end that reloads the page if a chunk file fails to load during startup.
- `cdn/15/` — the exported app itself (compiled widgets and assets). The number changes with each deploy; older folders are deleted once the new build is confirmed.
- `.github/workflows/deploy.yml` — publishes the site to GitHub Pages whenever `cdn/` or `index.html` changes. Commits that only touch docs (like this README) do not trigger a new deploy.

The site is served straight from the repo root, so `index.html` and `cdn/` stay at the top level.

## Deploying a new build

1. Test the changes in Experience Builder Developer Edition (`localhost:3001`, app `0`). Note: both `server/public/apps/0/config.json` and `server/public/apps/0/resources/config/config.json` hold the app config and must stay in sync.
2. Export the app from the Dev Edition server (`/download/0`), unzip it, and move the build into `cdn/<N>`.
3. Replace the repo's `index.html` with the export's copy, then paste in the reload script from the bottom of the old file. (The export also ships `service-worker.js` and `web.config` for self-hosting; those are skipped here because GitHub Pages doesn't use them.)
4. Delete the old `cdn/` folder, commit, and push to `main`. The deploy workflow publishes the site automatically.
