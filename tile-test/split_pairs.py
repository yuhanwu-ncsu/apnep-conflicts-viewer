"""Split the compressed combined source into seven Tippecanoe inputs."""

import gzip
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = json.loads((ROOT / "pairs.json").read_text(encoding="utf-8"))


def main():
    with gzip.open(ROOT / "all_pairs.geojson.gz", "rt", encoding="utf-8") as source:
        features = json.load(source)["features"]
    groups = defaultdict(list)
    for feature in features:
        groups[feature["properties"]["pair"]].append(feature)
    output = ROOT / "inputs"
    output.mkdir(exist_ok=True)
    for pair in MANIFEST:
        items = groups[pair["pair"]]
        assert len(items) == pair["count"]
        slug = Path(pair["file"]).stem
        path = output / f"{slug}.geojson.gz"
        with gzip.open(path, "wt", encoding="utf-8") as target:
            json.dump({"type": "FeatureCollection", "features": items}, target, separators=(",", ":"))
        print(f"{slug}: {len(items):,} features")


if __name__ == "__main__":
    main()
