"""Check the generated static tiles and write a small size report."""

import gzip
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE = ROOT / "site"
TILES = SITE / "tiles"


def main():
    with gzip.open(ROOT / "all_pairs.geojson.gz", "rt", encoding="utf-8") as source:
        features = json.load(source)["features"]
    manifest = json.loads((SITE / "data/pairs.json").read_text(encoding="utf-8"))
    assert len(features) == sum(pair["count"] for pair in manifest) == 49277
    assert len(manifest) == 7
    assert (SITE / "index.html").exists()
    tiles = list(TILES.glob("*/*/*/*.pbf"))
    assert tiles, "Tippecanoe produced no PBF tiles"
    sizes = defaultdict(lambda: {"count": 0, "bytes": 0})
    pair_sizes = defaultdict(lambda: {"count": 0, "bytes": 0, "largest_tile_bytes": 0})
    largest = max(tiles, key=lambda path: path.stat().st_size)
    for path in tiles:
        with path.open("rb") as tile:
            assert tile.read(2) != b"\x1f\x8b", f"Compressed tile: {path}"
        slug, zoom = path.relative_to(TILES).parts[:2]
        sizes[zoom]["count"] += 1
        sizes[zoom]["bytes"] += path.stat().st_size
        pair_sizes[slug]["count"] += 1
        pair_sizes[slug]["bytes"] += path.stat().st_size
        pair_sizes[slug]["largest_tile_bytes"] = max(pair_sizes[slug]["largest_tile_bytes"], path.stat().st_size)
    assert set(pair_sizes) == {Path(pair["file"]).stem for pair in manifest}
    report = {
        "source_features": len(features), "pairs": len(manifest),
        "tile_count": len(tiles),
        "tile_bytes": sum(path.stat().st_size for path in tiles),
        "largest_tile": str(largest.relative_to(SITE)),
        "largest_tile_bytes": largest.stat().st_size,
        "zooms": dict(sorted(sizes.items(), key=lambda item: int(item[0]))),
        "by_pair": dict(sorted(pair_sizes.items())),
    }
    (SITE / "tile-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    assert report["tile_bytes"] < 1_000_000_000, "Tiles exceed GitHub Pages site size limit"


if __name__ == "__main__":
    main()
