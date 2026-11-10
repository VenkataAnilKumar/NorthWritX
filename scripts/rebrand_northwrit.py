"""Rebrand product text and vector marks, with preview, backup, and guarded restore.

Internal namespaces and external service addresses remain compatible with upstream.
Run with Python 3.11+; no third-party packages are required.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import struct
import zlib
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    ".git", ".agents", ".claude", ".codex", ".cursor", ".venv", "node_modules",
    ".next", "dist", "build", "__pycache__", "vendor", "alembic",
}
TEXT_SUFFIXES = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mdx", ".html",
    ".css", ".scss", ".rs", ".toml", ".yaml", ".yml", ".sh", ".txt", ".svg",
}
PROTECTED = re.compile(
    r"https?://[^\s<>\"']+|[\w.+-]+@[\w.-]+|"
    r"\b[\w.-]*onyx\.(?:app|ai|com|dev)[^\s<>\"']*"
)
BRAND = re.compile(r"(?<![\w])(?:OnyxBot|Onyx|ONYX)(?![\w])")
LEGAL = re.compile(
    r"copyright|SPDX|licensed|license key|received from Onyx|"
    r"SOC 2|certified|certification|DanswerAI", re.IGNORECASE
)
MARK = "M12 52V12H21L43 38V12H52V52H43L21 26V52Z"
ICON_SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="12" fill="#14283F"/>'
    f'<path d="{MARK}" fill="#FFFFFF"/></svg>\n'
).encode()
PNG_ICONS = {
    "mobile/assets/images/icon.png": 1024,
    "mobile/assets/images/splash-icon.png": 512,
    "desktop/src-tauri/icons/32x32.png": 32,
    "desktop/src-tauri/icons/128x128.png": 128,
    "desktop/src-tauri/icons/128x128@2x.png": 256,
    "desktop/src-tauri/icons/tray-icon.png": 32,
}
ICO = "desktop/src-tauri/icons/icon.ico"
ICNS = "desktop/src-tauri/icons/icon.icns"
IDENTITY_EDITS = {
    "desktop/src-tauri/tauri.conf.json": {
        "app.onyx.desktop": "app.northwrit.desktop",
        '    "exceptionDomain": "cloud.onyx.app",\n': "",
        '"tabbingIdentifier": "onyx"': '"tabbingIdentifier": "northwrit"',
        "NorthWrit Cloud Desktop App": "NorthWrit Desktop",
        "A lightweight desktop wrapper for NorthWrit Cloud - your AI-powered knowledge assistant.": "Desktop client for your NorthWrit server.",
    },
    "desktop/src-tauri/src/config.rs": {
        'DEFAULT_SERVER_URL: &str = "https://cloud.onyx.app"': 'DEFAULT_SERVER_URL: &str = ""',
        'ProjectDirs::from("app", "onyx", "onyx-desktop")': 'ProjectDirs::from("app", "northwrit", "northwrit-desktop")',
    },
    "desktop/src/index.html": {
        'placeholder="https://cloud.onyx.app"': 'placeholder="https://northwrit.example.com"',
        'const DEFAULT_DOMAIN = "https://cloud.onyx.app";': 'const DEFAULT_DOMAIN = "";',
        "// On error, default to cloud": "// On error, let the user enter their server URL.",
        "onyxDomain": "northwritDomain",
    },
    "desktop/README.md": {
        "[NorthWrit Cloud](https://cloud.onyx.app)": "your NorthWrit server",
        "The app defaults to `https://cloud.onyx.app` but supports any NorthWrit instance.": "Enter your NorthWrit server URL on first launch.",
        "The app loads content from `cloud.onyx.app`.": "The app loads content from the server you configured.",
    },
    "mobile/app.json": {
        "app.onyx.mobile": "app.northwrit.mobile",
        '"scheme": "onyx"': '"scheme": "northwrit"',
    },
    "mobile/src/api/auth/instanceUrl.ts": {
        'ONYX_CLOUD_URL = "https://cloud.onyx.app"': 'SERVER_URL_PLACEHOLDER = "https://northwrit.example.com"',
    },
    "mobile/src/app/(auth)/connect.tsx": {
        "useState(serverUrl ?? ONYX_CLOUD_URL)": 'useState(serverUrl ?? "")',
        "ONYX_CLOUD_URL": "SERVER_URL_PLACEHOLDER",
    },
}
CALLBACK_FILES = {
    "mobile/src/api/auth/browserSso.ts",
    "mobile/src/api/auth/__tests__/browserSso.test.ts",
    "backend/onyx/configs/app_configs.py",
    "backend/tests/external_dependency_unit/auth/test_mobile_sso_bridge.py",
}


def render_icon(size: int) -> bytes:
    """Rasterize the NorthWrit monogram for native application bundles."""
    rows = bytearray()
    for row in range(size):
        rows.append(0)  # PNG filter byte.
        y = (row + 0.5) * 64 / size
        for column in range(size):
            x = (column + 0.5) * 64 / size
            diagonal = 12 + (x - 21) * 26 / 22
            white = 12 <= y < 52 and (
                12 <= x < 21 or 43 <= x < 52
                or 21 <= x < 43 and diagonal <= y < diagonal + 14
            )
            rows.extend(b"\xff\xff\xff" if white else b"\x14\x28\x3f")

    def chunk(kind: bytes, contents: bytes) -> bytes:
        return (
            struct.pack(">I", len(contents)) + kind + contents
            + struct.pack(">I", zlib.crc32(kind + contents))
        )

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows))
        + chunk(b"IEND", b"")
    )


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def replace_brand(text: str) -> str:
    """Protect service addresses and ownership notices while replacing display text."""
    result: list[str] = []
    for line in text.splitlines(keepends=True):
        if LEGAL.search(line):
            result.append(line)
            continue
        protected: list[str] = []

        def hold(match: re.Match[str]) -> str:
            protected.append(match.group())
            return f"\x01{len(protected) - 1}\x02"

        line = PROTECTED.sub(hold, line)
        line = BRAND.sub(
            lambda match: "NorthWritBot" if match.group() == "OnyxBot" else "NorthWrit",
            line,
        )
        for index, value in enumerate(protected):
            line = line.replace(f"\x01{index}\x02", value)
        result.append(line)
    return "".join(result)


def transform(path: Path, data: bytes) -> bytes:
    relative = path.as_posix()
    if relative in PNG_ICONS:
        return render_icon(PNG_ICONS[relative])
    if relative == ICO:
        png = render_icon(256)
        return struct.pack("<HHHBBBBHHII", 0, 1, 1, 0, 0, 0, 0, 1, 24, len(png), 22) + png
    if relative == ICNS:
        png = render_icon(512)
        return struct.pack(">4sI4sI", b"icns", len(png) + 16, b"ic09", len(png) + 8) + png
    if relative in {
        "web/public/logo.svg", "desktop/src-tauri/icons/icon.svg",
        "desktop/src-tauri/icons/tray-icon.svg",
    }:
        return ICON_SVG
    if b"\x00" in data:
        return data
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        return data
    changed = replace_brand(text)
    for previous, replacement in IDENTITY_EDITS.get(relative, {}).items():
        changed = changed.replace(previous, replacement)
    if relative in CALLBACK_FILES:
        changed = changed.replace("onyx://auth/callback", "northwrit://auth/callback")
    changed = changed.replace("an NorthWrit", "a NorthWrit")
    if relative.endswith(("logos/onyx-logo.tsx", "icons/onyx-logo.tsx")):
        changed = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0 64 64"', changed)
    if relative == "web/src/lib/app/svcSS.ts":
        changed = changed.replace('"/onyx.ico"', '"/logo.svg"')
    # Keep exported component names so all existing callers use the new mark.
    if relative.endswith(("logos/onyx-logo.tsx", "icons/onyx-logo.tsx")) and MARK not in text:
        changed = re.sub(
            r"<(?:Path|path)\b[\s\S]*?/>", "", changed
        )
        tag = "Path" if 'react-native-svg' in text else "path"
        close = "</Svg>" if tag == "Path" else "</svg>"
        changed = changed.replace(
            close, f'<{tag} d="{MARK}" fill="currentColor" />\n  {close}'
        )
    if relative.endswith("logos/onyx-wordmark.tsx") and ">NorthWrit</text>" not in text:
        changed = re.sub(r"<path\b[\s\S]*?/>", "", changed)
        changed = changed.replace('viewBox="0 0 152 64"', 'viewBox="0 0 310 64"')
        changed = changed.replace(
            "</svg>",
            '<text x="0" y="47" fontSize="46" fontFamily="sans-serif" '
            'fontWeight="600" fill="currentColor">NorthWrit</text>\n  </svg>',
        )
    return changed.encode("utf-8")


def files(root: Path):
    for directory, names, filenames in os.walk(root, followlinks=False):
        names[:] = sorted(
            name for name in names
            if name not in SKIP_DIRS and not (Path(directory) / name).is_symlink()
        )
        for name in sorted(filenames):
            path = Path(directory) / name
            if path.is_symlink() or path.name in {"AGENTS.md", "CLAUDE.md"}:
                continue
            if re.search(r"license|notice|copyright|lock", name, re.IGNORECASE):
                continue
            if path.suffix in TEXT_SUFFIXES or path.relative_to(root).as_posix() in (
                PNG_ICONS.keys() | {ICO, ICNS}
            ):
                yield path


def atomic_write(path: Path, data: bytes) -> None:
    temporary = path.with_name(path.name + ".northwrit-tmp")
    with temporary.open("xb") as stream:
        stream.write(data)
    os.replace(temporary, path)


def restore(root: Path, backup: Path) -> None:
    manifest = json.loads((backup / "manifest.json").read_text(encoding="utf-8"))
    if manifest["root"] != str(root):
        raise ValueError("Backup belongs to another source directory")
    for entry in manifest["files"]:
        path = (root / entry["path"]).resolve()
        original = (backup / "originals" / entry["path"]).resolve()
        if not path.is_relative_to(root) or not original.is_relative_to(backup):
            raise ValueError("Unsafe manifest path")
        if digest(original.read_bytes()) != entry["before"]:
            raise ValueError(f"Corrupt backup: {entry['path']}")
        if digest(path.read_bytes()) not in {entry["before"], entry["after"]}:
            raise ValueError(f"Later edits found: {entry['path']}; restore stopped")
    for entry in manifest["files"]:
        atomic_write(root / entry["path"], (backup / "originals" / entry["path"]).read_bytes())
    print(f"Restored {len(manifest['files'])} files")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT / "NorthWrit")
    actions = parser.add_mutually_exclusive_group()
    actions.add_argument("--apply", action="store_true")
    actions.add_argument("--restore", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    if not (root / "web").is_dir() or not (root / "backend").is_dir():
        raise ValueError("Expected an Onyx source root with web and backend directories")
    if args.restore:
        restore(root, args.restore.resolve())
        return
    changes: list[tuple[Path, bytes, bytes]] = []
    for path in files(root):
        before = path.read_bytes()
        after = transform(path.relative_to(root), before)
        if before != after:
            if path.suffix == ".json":
                try:
                    json.loads(before)
                except (json.JSONDecodeError, UnicodeDecodeError):
                    pass  # Some upstream .json files contain JSONC or test fixtures.
                else:
                    json.loads(after)
            changes.append((path.relative_to(root), before, after))
    entries = [
        {"path": path.as_posix(), "before": digest(before), "after": digest(after)}
        for path, before, after in changes
    ]
    report = {
        "root": str(root), "brand": "NorthWrit", "files": entries,
        "scope": "Display text, prompts, documentation, and app icons",
        "retained": [
            "Internal identifiers, module paths, environment variables, and database names",
            "External URLs, image registries, package coordinates, and service credentials",
            "License and attribution notices, migration history, and lockfiles",
            "Upstream screenshots and other illustrative assets",
        ],
    }
    reports = ROOT / ".rebrand-backups"
    reports.mkdir(exist_ok=True)
    (reports / "preview.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"{len(changes)} files need changes. Preview: {reports / 'preview.json'}")
    if not args.apply or not changes:
        return
    backup = reports / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup.mkdir()
    for relative, before, _ in changes:
        target = backup / "originals" / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(before)
    (backup / "manifest.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    for relative, before, after in changes:
        path = root / relative
        if path.read_bytes() != before:
            raise RuntimeError(f"Concurrent edit detected: {relative}. Use the backup to recover.")
        atomic_write(path, after)
    print(f"Applied rebrand. Backup and manifest: {backup}")


if __name__ == "__main__":
    main()
