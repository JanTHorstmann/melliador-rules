from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "03_src" / "core"
DESTINATION = ROOT / "foundry" / "melliador-rules" / "scripts" / "core"


def main():
    if not SOURCE.is_dir():
        raise SystemExit(f"Rule core directory not found: {SOURCE}")

    DESTINATION.mkdir(parents=True, exist_ok=True)
    expected = {path.name for path in SOURCE.glob("*.js")}
    for existing in DESTINATION.glob("*.js"):
        if existing.name not in expected:
            existing.unlink()
    for source_file in SOURCE.glob("*.js"):
        shutil.copy2(source_file, DESTINATION / source_file.name)

    print(f"Copied {len(expected)} core modules to {DESTINATION}")


if __name__ == "__main__":
    main()
