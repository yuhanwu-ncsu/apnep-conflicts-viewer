"""Create a compact, reproducible Tippecanoe input from the local AGOL kit.

Usage: python tile-test/prepare_input.py [path/to/all_pairs.geojson]
"""

import gzip
import io
import json
import sys
from pathlib import Path

DEFAULT_SOURCE = Path("C:/Users/ywu223/Project/apnep-phase2-inventory-review/data/phase2_viz/agol/all_pairs.geojson")
DESTINATION = Path(__file__).with_name("all_pairs.geojson.gz")
FIELDS = (
    "h3_index", "pair", "pressure", "resource", "Pressure_Level",
    "Resource_Level", "biv_class", "biv_label",
)


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    features = json.loads(source.read_text(encoding="utf-8"))["features"]
    if len(features) != 49277:
        raise ValueError(f"Expected 49,277 hexes; found {len(features):,}")
    pairs = set()
    for feature in features:
        p = feature["properties"]
        pairs.add(p["pair"])
        if p["biv_class"] != (p["Pressure_Level"] - 1) * 3 + p["Resource_Level"]:
            raise ValueError(f"Invalid class in {p['h3_index']}")
        feature["properties"] = {field: p[field] for field in FIELDS}
    if len(pairs) != 7:
        raise ValueError(f"Expected seven pairs; found {len(pairs)}")
    with DESTINATION.open("wb") as raw:
        with gzip.GzipFile(fileobj=raw, mode="wb", mtime=0) as compressed:
            with io.TextIOWrapper(compressed, encoding="utf-8") as writer:
                json.dump({"type": "FeatureCollection", "features": features}, writer, separators=(",", ":"))
    print(f"Wrote {len(features):,} hexes from seven pairs to {DESTINATION} ({DESTINATION.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
