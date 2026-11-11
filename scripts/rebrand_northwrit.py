"""Apply NorthWrit's product branding to the imported Mike source.

Requires Pillow. Pass --social-source on the first run to install artwork.
Use --check to verify an already branded tree without writing files.
"""

import argparse
import io
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "apps" / "northwrit"
NAVY = "#1F3A5F"
PAPER = "#F8F9FA"
FOLD = "#AEC4D1"
LEFT = ((32, 9), (13, 52), (32, 42))
RIGHT = ((32, 9), (32, 42), (51, 52))
PRODUCT_NAME = re.compile(r"(?<![\w@./-])Mike(?:OSS)?(?![\w/-]|\.\w)")
COPY_ROOTS = (
    "frontend/src", "word-addin/src", "word-addin/e2e-live",
    "desktop/src", "desktop/e2e", "backend/src",
    "packages/client/src", "packages/ui/src",
)
UPSTREAM_DIAGNOSTICS = {"errorReporting.ts", "errorReporting.test.ts", "sentryTunnel.test.ts"}


def points(polygon):
    return " ".join(f"{x},{y}" for x, y in polygon)


MARK = (
    f'<rect width="64" height="64" rx="15" fill="{NAVY}"/>'
    f'<polygon points="{points(LEFT)}" fill="{PAPER}"/>'
    f'<polygon points="{points(RIGHT)}" fill="{FOLD}"/>'
)


def svg(content, view_box):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" '
        f'role="img" aria-label="NorthWrit">{content}</svg>\n'
    ).encode()


def icon():
    scale = 16
    canvas = Image.new("RGBA", (64 * scale, 64 * scale))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((0, 0, 64 * scale - 1, 64 * scale - 1), 15 * scale, fill=NAVY)
    for polygon, color in ((LEFT, PAPER), (RIGHT, FOLD)):
        draw.polygon([(x * scale, y * scale) for x, y in polygon], fill=color)
    return canvas


def encode(image, format_name, **options):
    output = io.BytesIO()
    image.save(output, format=format_name, **options)
    return output.getvalue()


def replace(path, substitutions):
    original = (ROOT / path).read_bytes()
    content = original.decode("utf-8").replace("\r\n", "\n")
    for before, after in substitutions:
        if before in content and (before not in after or after not in content):
            content = content.replace(before, after)
        elif after not in content:
            raise ValueError(f"{path}: expected branding anchor missing: {before!r}")
    if b"\r\n" in original:
        content = content.replace("\n", "\r\n")
    return content.encode("utf-8")


def rebrand_ui_copy(outputs):
    for directory in COPY_ROOTS:
        for path in sorted((ROOT / directory).rglob("*")):
            if path.suffix not in {".ts", ".tsx", ".js", ".mjs", ".html"} or path.name in UPSTREAM_DIAGNOSTICS:
                continue
            relative = path.relative_to(ROOT).as_posix()
            original = outputs.get(relative)
            if original is None:
                original = path.read_bytes()
            lines = original.decode("utf-8").splitlines(keepends=True)
            branded = "".join(
                line if line.lstrip().startswith(("//", "/*", "*", "{/*", "<!--"))
                else PRODUCT_NAME.sub("NorthWrit", line)
                for line in lines
            ).encode("utf-8")
            if branded != original:
                outputs[relative] = branded


def changes(social_source):
    support_address = "NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL"
    edits = {
        ".gitignore": [("/supabase/", "/supabase/*\n!/supabase/gateway.conf")],
        "docker-compose.yml": [
            ("# MikeOSS — full local stack", "# NorthWrit — full local stack"),
            ("      - API_BASE_URL=${API_BASE_URL:-http://backend:3001}", "      - API_BASE_URL=${API_BASE_URL:-http://backend:3001}\n      - FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}"),
            ("      dockerfile: frontend/Dockerfile\n      args:", "      dockerfile: frontend/Dockerfile\n      args:\n        FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}"),
            ("        FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}", "        FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}\n        NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL: ${NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL:-}"),
            ("GOTRUE_SMTP_SENDER_NAME: Mike", "GOTRUE_SMTP_SENDER_NAME: NorthWrit"),
        ],
        "frontend/Dockerfile": [
            ("ARG NEXT_PUBLIC_SENTRY_DSN=", "ARG FRONTEND_URL=http://localhost:3000\nARG NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL=\nARG NEXT_PUBLIC_SENTRY_DSN="),
        ],
        ".env.example": [("\nSENTRY_DISABLED=\n", "\nSENTRY_DISABLED=true\n"), ("NODE_ENV=development", "NODE_ENV=development\nNEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL=")],
        "backend/.env.example": [("\nSENTRY_DISABLED=false", "\nSENTRY_DISABLED=true")],
        "backend/src/lib/observability/sentry.test.ts": [
            ('["upstream", "", "", true, MIKE_SENTRY_DSN.backend]', '["upstream", "", "", false, ""]'),
            ('["fork with its own Sentry", "", "https://fork@self.example/9", true, "https://fork@self.example/9"]', '["fork with its own Sentry", "", "https://fork@self.example/9", false, ""]'),
            ("preserves %s reporting defaults with the stock Compose env_file", "keeps %s telemetry disabled with the NorthWrit Compose example"),
        ],
        "backend/supabase/config.toml": [('sender_name = "MikeOSS (No Reply)"', 'sender_name = "NorthWrit (No Reply)"')],
        "backend/src/modules/chat/engine/prompts.ts": [("You are Mike, an AI legal assistant", "You are NorthWrit, an AI legal assistant")],
        "backend/src/modules/chat/engine/__tests__/prompts.test.ts": [("You are Mike, an AI legal assistant", "You are NorthWrit, an AI legal assistant")],
        "backend/src/modules/chat/engine/wordPrompt.ts": [("You are Mike, an AI legal assistant", "You are NorthWrit, an AI legal assistant")],
        "backend/src/modules/tabular/tabular.chats.ts": [("You are Mike, an AI legal assistant", "You are NorthWrit, an AI legal assistant")],
        "backend/src/modules/chat/engine/tools/documentOps.ts": [
            (">Mike</", ">NorthWrit</"),
            ("Generated by Mike", "Generated by NorthWrit"),
        ],
        "frontend/src/app/layout.tsx": [
            ('    metadataBase: new URL("https://app.mikeoss.com"),', '    metadataBase: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL) : undefined,'),
            ('        url: "https://app.mikeoss.com",', '        url: "/",'),
            ("Mike - Legal AI Platform", "NorthWrit | Canadian Legal AI Workspace"),
            ('siteName: "Mike"', 'siteName: "NorthWrit"'),
            ('alt: "Mike"', 'alt: "NorthWrit"'),
            ("/link-image.jpg", "/northwrit-social.jpg"),
            ("height: 651", "height: 630"),
        ],
        "frontend/src/app/components/site-logo.tsx": [
            ('    const landingHref =\n        process.env.NODE_ENV === "production"\n            ? "https://mikeoss.com"\n            : "http://localhost:3000";', '    const landingHref = "/";'),
            ("<span>Mike</span>", "<span>NorthWrit</span>"),
        ],
        "frontend/src/app/global-error.tsx": [("went wrong – Mike", "went wrong – NorthWrit")],
        "frontend/src/app/lib/errorReporting.ts": [("→ Mike project Sentry", "→ upstream project Sentry")],
        "frontend/src/app/components/shared/views/EigenpalDocxRenderer.module.css": [
            ("Mike owns the filename", "NorthWrit owns the filename"),
        ],
        "frontend/src/app/components/workflows/OpenSourceWorkflowModal.tsx": [
            ("mikeoss.com website.", "upstream project's website."),
        ],
        "backend/src/modules/workflows/workflows.types.ts": [
            ('name: "Mike",', 'name: "Upstream workflow catalogue",'),
        ],
        "backend/src/lib/observability/sentry.ts": [
            ("→ Mike project Sentry", "→ upstream project Sentry"),
        ],
        "packages/ui/package.json": [("shared by the Mike web app", "shared by the NorthWrit web app")],
        "packages/client/package.json": [("shared by the Mike web app", "shared by the NorthWrit web app")],
        "word-addin/server.mjs": [("Mike Word add-in host", "NorthWrit Word add-in host")],
        "word-addin/server.test.mjs": [("Mike Word", "NorthWrit Word")],
        "docs/slack-mcp-app-manifest.example.json": [
            ("Mike MCP Client", "NorthWrit MCP Client"),
            ("Mike's Slack MCP connector", "NorthWrit's Slack MCP connector"),
        ],
        "frontend/src/app/monitoring/route.test.ts": [
            ('["upstream", "", "", 200, "default"]', '["upstream", "", "", 204, "disabled"]'),
            ('["fork with its own Sentry", "", OWN_DSN, 200, "build"]', '["fork with its own Sentry", "", OWN_DSN, 204, "disabled"]'),
            ("preserves %s defaults with the stock Compose environment", "keeps %s telemetry disabled with the NorthWrit Compose example"),
        ],
        "word-addin/manifest.xml": [
            ("<Id>a1b2c3d4-e5f6-7890-abcd-ef1234567890</Id>", "<Id>285efbda-798e-4d3c-8430-4d96c0ca3a04</Id>"),
            ("<ProviderName>MikeOSS</ProviderName>", "<ProviderName>NorthWrit</ProviderName>"),
            ('DefaultValue="Mike"', 'DefaultValue="NorthWrit"'),
            ("Mike Legal AI", "NorthWrit Legal AI"),
            ("Open the Mike AI legal assistant pane", "Open the NorthWrit legal assistant pane"),
            ('id="MikeOSS.Group"', 'id="NorthWrit.Group"'),
            ('id="MikeOSS.OpenMike"', 'id="NorthWrit.Open"'),
            ("<TaskpaneId>MikeTaskpane</TaskpaneId>", "<TaskpaneId>NorthWritTaskpane</TaskpaneId>"),
        ],
        "word-addin/src/commands/commands.html": [("<title>Mike Commands</title>", "<title>NorthWrit Commands</title>")],
        "word-addin/src/taskpane/index.html": [("<title>MikeOSS</title>", "<title>NorthWrit for Word</title>")],
        "word-addin/src/taskpane/lib/openExternalUrl.ts": [
            ('process.env.REACT_APP_WEB_APP_URL || "https://app.mikeoss.com"', 'process.env.REACT_APP_WEB_APP_URL || "http://localhost:3000"'),
        ],
        "word-addin/.env.example": [
            ("REACT_APP_WEB_APP_URL=https://app.mikeoss.com", "REACT_APP_WEB_APP_URL=http://localhost:3000"),
            ("\nREACT_APP_SENTRY_DISABLED=false", "\nREACT_APP_SENTRY_DISABLED=true"),
            ("REACT_APP_WEB_APP_URL=http://localhost:3000", "REACT_APP_WEB_APP_URL=http://localhost:3000\nNEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL="),
        ],
        "word-addin/webpack.config.js": [
            ('process.env.REACT_APP_WEB_APP_URL || "https://app.mikeoss.com"', 'process.env.REACT_APP_WEB_APP_URL || "http://localhost:3000"'),
            ('        REACT_APP_SENTRY_DISABLED:', f'        {support_address}: process.env.{support_address} || "",\n        REACT_APP_SENTRY_DISABLED:'),
        ],
        "word-addin/src/env.d.ts": [
            ("    readonly REACT_APP_WEB_APP_URL: string | undefined;", f"    readonly REACT_APP_WEB_APP_URL: string | undefined;\n    readonly {support_address}: string | undefined;"),
        ],
        "packages/client/src/userError.ts": [
            ('export const SUPPORT_EMAIL = "will@mikeoss.com";',
             f'const configuredSupportEmail = process.env.{support_address}?.trim() ?? "";\n'
             'export const SUPPORT_EMAIL = /^[A-Z0-9._+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(configuredSupportEmail)\n'
             '    ? configuredSupportEmail\n    : "";'),
            ("Mike couldn't reach the server", "NorthWrit couldn't reach the server"),
            ("Mike is temporarily unavailable", "NorthWrit is temporarily unavailable"),
            ("Hi Mike team,", "Hi NorthWrit team,"),
            ("Mike support:", "NorthWrit support:"),
        ],
        "packages/client/src/userError.test.ts": [
            ("Mike couldn't reach the server", "NorthWrit couldn't reach the server"),
            ("Mike support", "NorthWrit support"),
        ],
        "word-addin/src/taskpane/lib/supportHandoff.ts": [
            ('`Email ${SUPPORT_EMAIL} — the details are on your clipboard`', '`${SUPPORT_EMAIL ? `Email ${SUPPORT_EMAIL}` : "Contact your workspace administrator"} — the details are on your clipboard`'),
            ('message: `Email ${SUPPORT_EMAIL}`,', 'message: SUPPORT_EMAIL ? `Email ${SUPPORT_EMAIL}` : "Contact your workspace administrator",'),
        ],
        "frontend/src/app/support/page.tsx": [('placeholder="https://mikeoss.com/..."', 'placeholder="https://..."')],
        "desktop/package.json": [
            ('"productName": "Mike"', '"productName": "NorthWrit"'),
            ("Mike for Mac — desktop shell around the Mike web app", "NorthWrit for Mac"),
        ],
        "desktop/e2e/helpers.mjs": [('"Mike.app"', '"NorthWrit.app"'), ('    "Mike",\n', '    "NorthWrit",\n')],
        "desktop/src/main.js": [
            ('const DEFAULT_SERVER_URL = "https://app.mikeoss.com";', 'const DEFAULT_SERVER_URL = "http://localhost:3000";'),
            ('label: "Mike on GitHub"', 'label: "Upstream source on GitHub"'),
            ('dialog.showErrorBox("Mike",', 'dialog.showErrorBox("NorthWrit",'),
        ],
        "desktop/src/local/supervisor.js": [('GOTRUE_SMTP_SENDER_NAME: "Mike"', 'GOTRUE_SMTP_SENDER_NAME: "NorthWrit"'), ('Starting Mike services', 'Starting NorthWrit services')],
        "desktop/src/pages/welcome.html": [
            ("Use Mike Cloud", "Connect to a NorthWrit server"),
            ("Sign in at app.mikeoss.com. Your work syncs", "Use the server address provided by your firm. Your work syncs"),
            ("window.mikeDesktop.chooseCloud();", "window.mikeDesktop.openConnect();"),
        ],
    }
    for config in ("electron-builder.json", "electron-builder.local.json", "electron-builder.release.json"):
        edits[f"desktop/{config}"] = [
            ('"appId": "com.openlegalproducts.mike"', '"appId": "com.northwrit.desktop"'),
            ('"productName": "Mike"', '"productName": "NorthWrit"'),
        ]
    for path in sorted((ROOT / "frontend/src").rglob("*.test.*")):
        content = path.read_text(encoding="utf-8")
        if "will@mikeoss.com" not in content or path.name == "supportHandoff.test.ts":
            continue
        relative = path.relative_to(ROOT).as_posix()
        edits[relative] = [
            ('stringContaining("will@mikeoss.com")', 'stringContaining("mailto:?")'),
        ] if 'stringContaining("will@mikeoss.com")' in content else [("mailto:will@mikeoss.com", "mailto:")]
    edits.setdefault("frontend/src/app/lib/userFacingError.test.tsx", []).append(
        (r"/^mailto:will@mikeoss\.com\?/", r"/^mailto:\?/")
    )
    edits["frontend/src/wordAddin/supportHandoff.test.ts"] = [
        ('expect(result.message).toContain("will@mikeoss.com");', 'expect(result.message).toContain("Contact your workspace administrator");'),
        ('`Email ${SUPPORT_EMAIL} — the details are on your clipboard`', '"Contact your workspace administrator — the details are on your clipboard"'),
        ('`Email ${SUPPORT_EMAIL}`', '"Contact your workspace administrator"'),
        ("    SUPPORT_EMAIL,\n", ""),
    ]
    outputs = {path: replace(path, substitutions) for path, substitutions in edits.items()}
    rebrand_ui_copy(outputs)

    # Use the shared theme-aware component so the web and Word surfaces retain
    # upstream animation, size and run-status colours.
    shared_path = "packages/ui/src/MikeIconUI.tsx"
    shared = (ROOT / shared_path).read_text(encoding="utf-8")
    start = shared.index("function Blades(")
    end = shared.index("export function MikeIcon(", start)
    mark = f'''function Blades({{ ids, inverse }}: {{ ids: Record<string, string>; inverse: boolean }}) {{
    return (
        <g transform="translate(100 100) scale(4.6875)">
            <rect width="64" height="64" rx="15" fill={{`url(#${{ids.glassFill}})`}} />
            <polygon points="{points(LEFT)}" fill={{inverse ? "{NAVY}" : "{PAPER}"}} />
            <polygon points="{points(RIGHT)}" fill={{inverse ? "#4A6B82" : "{FOLD}"}} />
        </g>
    );
}}

'''
    # Use the same navy as the file icons for the default light-theme palette.
    old = 'fillStops: ["#0a0a0a", "#151515", "#080808", "#111111"]'
    new = f'fillStops: ["{NAVY}", "{NAVY}", "{NAVY}", "{NAVY}"]'
    updated = (shared[:start] + mark + shared[end:]).replace(old, new, 1)
    outputs[shared_path] = updated.replace(
        "<Blades ids={m} />",
        "<Blades ids={m} inverse={darkTheme && !done && !error && !tint} />",
    ).replace(
        "const DEGREES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];\n", ""
    ).encode()
    test_path = "packages/ui/src/MikeIconUI.test.tsx"
    outputs[test_path] = replace(test_path, [("rgb(10,10,10)", "rgb(31,58,95)")])

    outputs["frontend/src/app/icon.svg"] = svg(MARK, "0 0 64 64")
    wordmark = '<text x="80" y="46" font-family="Georgia,serif" font-size="43" fill="#1F3A5F">NorthWrit</text>'
    outputs["frontend/public/icons/northwrit-logo.svg"] = svg(MARK + wordmark, "0 0 285 64")
    master = icon()
    outputs["frontend/src/app/favicon.ico"] = encode(master.resize((64, 64), Image.Resampling.LANCZOS), "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    outputs["frontend/public/apple-touch-icon.png"] = encode(master.resize((180, 180), Image.Resampling.LANCZOS), "PNG")
    for size in (16, 32, 80):
        outputs[f"word-addin/assets/icon-{size}.png"] = encode(master.resize((size, size), Image.Resampling.LANCZOS), "PNG")
    outputs["desktop/assets/icon-1024.png"] = encode(master, "PNG")
    outputs["desktop/assets/icon.icns"] = encode(master, "ICNS")
    outputs["desktop/assets/icon.html"] = (
        '<!doctype html>\n<meta charset="utf-8">\n'
        '<style>body{margin:0}svg{display:block;width:1024px;height:1024px}</style>\n'
    ).encode() + svg(MARK, "0 0 64 64")
    social_path = "frontend/public/northwrit-social.jpg"
    if social_source:
        with Image.open(social_source) as source:
            preview = ImageOps.fit(source.convert("RGB"), (1200, 630), method=Image.Resampling.LANCZOS)
            outputs[social_path] = encode(preview, "JPEG", quality=92, optimize=True)
    else:
        with Image.open(ROOT / social_path) as preview:
            if preview.size != (1200, 630) or preview.format != "JPEG":
                raise ValueError("Expected a 1200×630 JPEG. Supply --social-source to regenerate it.")
            preview.verify()
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--social-source", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    pending = []
    for name, expected in changes(args.social_source).items():
        path = ROOT / name
        if path.is_file() and path.read_bytes() == expected:
            continue
        pending.append(name)
        if not args.check:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(expected)
    for name in pending:
        print(name)
    print(f"{len(pending)} branding files {'out of date' if args.check else 'updated'}.")
    return int(args.check and bool(pending))


if __name__ == "__main__":
    raise SystemExit(main())
