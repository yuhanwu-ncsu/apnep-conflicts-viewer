# APNEP Data Inventory Conflicts Viewer

Spatial conflict explorer for the Albemarle-Pamlico National Estuary Partnership (APNEP) Phase 2 data inventory. Overlays human-use pressures against ecological and community resources on a ~5 km² hex grid with a 3×3 bivariate classification, across seven pressure × resource pairs.

**Live site:** https://yuhanwu-ncsu.github.io/apnep-conflicts-viewer/

Built with ArcGIS Experience Builder 1.21 (Developer Edition). Data is served from an NCSU ArcGIS Online feature layer (`all_pairs`, filtered per view by the `pair` field).

## Repository layout

```
index.html          App entry — the ExB export's index.html, copied verbatim
                    (buildNumber must match cdn/N/), plus a reload-retry
                    script appended before </body> that recovers from flaky
                    chunk loads.
cdn/N/              ONE exported build (N = buildNumber). ExB's own build
                    assets; never hand-edited.
```

The Pages site serves the repo root, so `index.html` and `cdn/` must stay at the top level. Previous `cdn/N` folders are removed on each deploy (`git rm`), not archived here.

Files intentionally absent from root: `service-worker.js` and `web.config` are ExB export leftovers for self-hosting — the service worker is unregistered on Pages (and would only serve stale assets) and `web.config` is IIS-only.

## Deploy workflow

1. Test in ExB Dev Edition (server on `localhost:3001`, app `0`; both `server/public/apps/0/config.json` and `resources/config/config.json` are kept in sync).
2. Export the app: `GET /download/0?token=devtoken&clientId=yq1cUb319pjTB3no`, poll status, download the zip.
3. Unzip build assets into `cdn/<N>`, discard the zip's root `index.html` (it replaces the repo root one verbatim after appending the retry script), and discard its `service-worker.js`/`web.config`.
4. `git rm -r cdn/<old>`, commit, push to `main`. GitHub Pages picks it up automatically.

## Sign-in (OAuth)

The app signs in to NCSU ArcGIS Online via registered OAuth client ID `yq1cUb319pjTB3no`. Redirect URIs are registered as bare origins (`https://yuhanwu-ncsu.github.io`, `https://localhost:3001`); AGOL matches subpaths under a registered origin, so new paths under the same origin need no change. The client secret is never used in the exported app and must never be committed.
