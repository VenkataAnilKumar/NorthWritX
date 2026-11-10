# Northwrit Glassy Multi-Surface Platform Architecture Specification

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.
## Unified 2026 Liquid Glass Architecture across Web, Desktop, and Mobile

**Document Code:** `NW-ARCH-SURFACES-GLASSY-01`  
**Status:** Approved Architectural Specification | **Version:** 2.0 | **Date:** November 5, 2026  
**Cross-References:** [Platform Layers & Surfaces](Northwrit_Platform-Layers-and-Surfaces.md) | [Architecture Stack](Northwrit_Architecture-Stack.md) | [Security & Compliance](Northwrit_Security-Compliance.md) | [Agent Builder Platform](Northwrit_Agent-Builder-Platform-Architecture.md)  
**Open Source Lineage:** `sim` (`emcn`, `desktop-bridge`), `openagents` (`openagents-ios/Voice`, `openagents-desktop/hud`), `janhq/jan` (Tauri 2.0 Architecture)

---

## 1. Executive Synthesis & Deep Industry Research

### 1.1 The Multi-Surface Legal Imperative
Modern legal AI benchmarks (such as Harvey AI and CoCounsel) demonstrate that legal work is fundamentally multi-surface, but fragmented:
- **At the Firm Desk (Web Platform):** Litigators and corporate counsel require multi-window, multi-document analysis: cross-examining 50-document **Review Grids**, authoring version-bound **Folio** drafts, visually assembling automated pipelines in **Flow Builder**, and managing firm-wide **Control Centre** billing disbursements.
- **In the Courtroom or In Flight (Desktop App):** Lawyers are subject to strict air-gapped security, spotty Wi-Fi, and real-time litigation pressures. They require an embedded zero-egress loopback inference engine (`127.0.0.1:1337`), an instant **Global HUD Search Dock (`Cmd/Ctrl+Shift+N`)** floating above third-party applications (Word, Acrobat, Outlook), and an offline encrypted document store with Bates coordinate grounding.
- **In Courthouse Corridors & Client Transit (Mobile App):** Litigators do not author 50-page briefs on a phone. Instead, they require hands-free **Courtroom Voice Dictation** that automatically extracts McGill Guide legal citations, a **Mobile Optical CiteCheck Scanner** to photograph opposing counsel's paper submissions and inspect passage support with licensed authority treatment gated by RS10, and a **1-Tap Partner Sign-Off Feed** powered by biometric FaceID / TouchID authorization.

### 1.2 The 2026 "Liquid Glass" Visual Aesthetic
Research into 2026 spatial design trends indicates that early glassmorphism suffered from washed-out opacity and unreadable text. Northwrit implements **Liquid Obsidian & Sapphire Glass**:
1. **Dark Glassmorphic Substrate:** Base background in deep Obsidian (`#070B14`), overlaid with frosted elevated panels (`rgba(15, 23, 42, 0.65)` + `backdrop-filter: blur(24px) saturate(180%)`).
2. **Selective Glass Application Rule:** Translucent glass is strictly used for **contextual framing and navigation** (floating headers, HUD search bars, sliding evidence drawers, modals, status pills). Dense primary legal reading surfaces (Folios, briefs, affidavits) are rendered on solid, high-contrast, eye-protective cards (`#0B1220` or Paper Warm `#FAF9F5`) to prevent visual fatigue and comply with WCAG AAA accessibility.
3. **Specular Crystal Highlights:** Subtle 1px borders (`rgba(255, 255, 255, 0.08)` resting, `rgba(255, 255, 255, 0.20)` hover) mimicking polished optical crystal.
4. **Ambient Light Pools:** Radial gradients (`#1D4ED8` Authority Blue and `#059669` Emerald) softly illuminating active surfaces from behind.

---

## 2. Multi-Surface System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SHARED 2026 GLASSY DESIGN SYSTEM (@northwrit/ui)                │
│   • Frosted Liquid Glass (backdrop-blur-2xl, bg-slate-950/65, border-white/10)        │
│   • Obsidian Deep (#070B14), Authority Blue (#1D4ED8), Cyan (#0284C7), Paper (#FAF9F5)│
│   • Specular Edge Refraction, Spring Micro-Interactions, WCAG AAA High-Contrast Text   │
└───────────────────────────┬────────────────────────────────┬───────────────────────────┘
                            │                                │
         ┌──────────────────┴────────────────┐               │
         ▼                                   ▼               ▼
┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│ 🌐 GLASSY WEB (apps/web)  │  │ 🖥️ DESKTOP (apps/companion│  │ 📱 MOBILE (apps/mobile)   │
│ • Next.js 15 App Router   │  │ • Tauri 2.0 Rust + React19│  │ • Tauri 2.0 Mobile        │
│ • Floating Frosted Shell  │  │ • Windows Mica / macOS Vib│  │ • Courtroom Voice Dictate │
│ • Matter Workspace Portal │  │ • 127.0.0.1:1337 Loopback │  │ • Camera CiteCheck Scanner│
│ • Folio Drafting Studio   │  │ • Global Cmd+Shift+N HUD  │  │ • 1-Tap Partner Sign-Off  │
│ • Visual Flow Builder     │  │ • Offline Bates Viewer    │  │ • Biometric Enclave       │
│ • Agent Studio & Sandbox  │  │ • Local Encrypted SQLite  │  │ • Encrypted Offline Cache │
│ • Control Centre & LEDES  │  │ • Bi-directional Sync     │  │ • Push Notification Alerts│
└─────────────┬─────────────┘  └─────────────┬─────────────┘  └─────────────┬─────────────┘
              │                              │                              │
              └──────────────────────────────┼──────────────────────────────┘
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          NORTHWRIT CONTROL PLANE & SOVEREIGN GATE                      │
│   • apps/api (Fastify REST & SSE Control Plane, OpenAPI /docs, WebSocket Sync Hub)     │
│   • packages/shield (Policy Evaluator -> Issues signed ShieldDecision HMAC tokens)     │
│   • services/shield-pii (FastAPI + Presidio: Bilingual Canadian PII Redaction)         │
│   • packages/gateway (Zero-Bypass Sovereign Gateway locked to AWS ca-central-1)        │
│   • packages/db (PostgreSQL 16 + pgvector, Row-Level Security: SET LOCAL matter_id)    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Surface 1: The Glassy Web Platform (`apps/web`)

The Web Platform serves as the central command workstation, fully equipped for heavy multi-document analysis and administrative governance.

### 3.1 Portal Directory Structure
```text
apps/web/src/app/
├── layout.tsx                # Floating Glass Shell, ambient mesh, sovereign status badge
├── globals.css               # 2026 Liquid Glass CSS variables and Tailwind utilities
├── workspace/page.tsx        # Matter Workspace: Tri-pane research, Bearings modal, coordinate viewer
├── folio/page.tsx            # Folio Studio: Floating document stage, version glow badges, export
├── flow-builder/page.tsx     # Visual Flow Builder: Glassmorphic nodes & glowing SVG execution wires
├── agent-builder/page.tsx    # Agent Studio: Catalog, configuration studio & Run Trail sandbox
├── control-centre/page.tsx   # Control Centre: 6-role RBAC, Shield Log & UTBMS E100-E102 billing
└── marketing/page.tsx        # Commercial Showcase: Interactive wrongful dismissal demo & ROI modeller
```

### 3.2 Web Workflows
1. **Tri-Pane Matter Workspace (`/workspace`):**
   - **Left Rail (Matter Explorer):** Frosted glass container housing indexed pleadings, affidavits, and transcripts with Bates search.
   - **Centre Stage (Assistant Chat):** Floating conversational console with pre-search **Bearings** calibration dialogue (`RS01`), dynamic follow-ups, and interactive citation chips.
   - **Right Lateral Drawer:** Frosted sliding sheet displaying PDF sheets with synchronized text-to-coordinate bounding box highlighting (`RV01`).
2. **Version-Bound Folio Drafting (`/folio`):**
   - Solid, glare-free document sheet floating over an obsidian glass surface.
   - Version status glow badges: `🟢 Approved` (emerald glow), `🟡 Under Review` (amber glow), `⚪ Draft` (slate pearl glow).
   - Instant SHA-256 Hash Recalculation: Any edit to an approved Folio automatically invalidates the approval and transitions the state back to `Draft`.
3. **Visual Flow Builder (`/flow-builder`):**
   - Frosted node cards representing Canadian legal stages (Intake, Shield PII, CanLII Search, Review Grid, Folio Drafting, Partner Approval Gate, Bates Stamping).
   - Animated luminescent SVG wires pulsing authority blue during active execution.
4. **Agent Studio (`/agent-builder`):**
   - Visual catalog of 6 turnkey Canadian legal agents (`legal-researcher`, `contract-analyzer`, `factum-drafter`, `discovery-examiner`, `privilege-screener`, `regulatory-monitor`).
   - Live Run Trail sandbox telemetry HUD showing latency, token budget, and UTBMS disbursement accrual.

---

## 4. Surface 2: The Sovereign Desktop Companion (`apps/companion`)

Built on **Tauri 2.0 (Rust) + React 19**, the Desktop Companion is engineered for air-gapped litigation environments, hearings, and offline travel.

### 4.1 Native Desktop Architecture
- **Window Composition:** Configured via `src-tauri/tauri.conf.json` with native OS compositor transparency:
  - **Windows 11:** Mica and Acrylic material compositor.
  - **macOS:** `NSVisualEffectView` vibrant window styling.
- **Embedded Zero-Egress Loopback (`127.0.0.1:1337`):**
  - Bundles local quantized model inference (`llama.cpp` serving `Qwen2.5-Coder-7B-Instruct` or `Llama-3.2-3B`).
  - Physical socket boundary: All WAN traffic is blocked under `local_only` policy (`SH05`).
- **Global HUD Search Dock (`Cmd/Ctrl + Shift + N`):**
  - Floating Spotlight-style research palette that appears over Microsoft Word, Outlook, or Adobe Acrobat.
  - Features quick CanLII query resolution, 4-state CiteCheck verification, and pinpoint excerpt copy without switching desktop applications.
- **Offline Matter Indexer & Bates Viewer:**
  - Encrypted local SQLite/LanceDB document indexer allowing lightning-fast coordinate retrieval when disconnected.
  - Bi-directional sync manager that reconciles local drafts with the central PostgreSQL store upon reconnecting.

---

## 5. Surface 3: The Litigator Mobile App (`apps/mobile`)

Engineered with **Tauri 2.0 Mobile (iOS & Android)**, the Litigator Mobile App provides a thumb-friendly companion for lawyers on the move.

### 5.1 Mobile Ergonomics & Workflows
- **Thumb-Docked Navigation:** Floating glass navigation capsule anchored to the bottom edge with tactile haptics.
- **Courtroom Audio Dictation & Voice Bearings:**
  - One-tap audio recording during courtroom recesses (adapted from `openagents-ios/Voice`).
  - Visual audio level meter (`VoiceLevelView`) and real-time partial transcription.
  - Automated McGill Guide legal citation extraction and research point structuring.
- **Mobile Optical CiteCheck Scanner:**
  - Camera-based OCR scanner allowing counsel to photograph physical briefs or opposing factums.
  - Extracts citations and displays four-state passage-support results. Subsequent-history alerts require RS10 and licensed treatment data, with coverage limitations and unavailable results explicitly shown.
- **1-Tap Partner Folio Sign-Off:**
  - Push notification feed alerting partners when a junior associate marks a Folio `in_review`.
  - Expandable mobile sheet displaying linked evidence passages and a 1-tap `Approve` action authenticated via biometric FaceID / TouchID.
- **Hardware Enclave Security:**
  - Device-bound cryptographic keys stored within the iOS Secure Enclave / Android Keystore.

---

## 6. Open-Source Code Reuse Mapping (70% Reuse / 30% Custom Legal Layer)

In strict adherence to Northwrit engineering rules, the multi-surface platform copies, rebrands, and extends existing battle-tested code from `V:\AI Engineer\Agent Platforms\Open Sources`:

| Target Northwrit Module | Physical Source to Copy (`Copy-Item`) | Upstream Project | Rebranding & Extension Protocol |
|---|---|---|---|
| **`packages/ui` (Glass Primitives)** | `V:\AI Engineer\Agent Platforms\Open Sources\sim\packages\emcn\*`<br>`V:\AI Engineer\Agent Platforms\Open Sources\sim\apps\sim\components\*` | `sim` (EMCN) | Rebrand `@sim/emcn` → `@northwrit/ui`; implement 2026 Liquid Obsidian glass tokens (`backdrop-blur-2xl`), `<GlassCard />`, `<GlassHeader />`, `<GlassDrawer />`, and `<GlassModal />`. |
| **`packages/desktop-bridge`** | `V:\AI Engineer\Agent Platforms\Open Sources\sim\packages\desktop-bridge\*` | `sim` (desktop-bridge) | Rebrand `@sim/desktop-bridge` → `@northwrit/desktop-bridge`; maintain `title-bar.ts`, `local-files.ts`, and `local-filesystem-limits.ts`; add Tauri 2.0 IPC bindings. |
| **`apps/companion` (Desktop App)** | `V:\AI Engineer\Agent Platforms\Open Sources\sim\apps\sim\*`<br>Architecture: `janhq/jan` (Tauri 2.0) | `sim` + `Jan.ai` | Configure Tauri 2.0 Mica/Vibrancy window translucency; wire loopback proxy (`127.0.0.1:1337`); implement global `Cmd+Shift+N` HUD search dock. |
| **`apps/mobile/src/voice`** | `V:\AI Engineer\Agent Platforms\Open Sources\openagents\apps\openagents-ios\OpenAgents\Voice\*` (`VoiceBar.swift`, `VoiceSession.swift`, `VoiceLevelView.swift`) | `openagents` (iOS Voice) | Adapt voice streaming, level metering, and audio session management into mobile voice dictation; add McGill citation extraction logic. |
| **`apps/companion/src/hud`** | `V:\AI Engineer\Agent Platforms\Open Sources\openagents\apps\openagents-desktop\*` (`dictation-face`, `Shaders.metal`) | `openagents` (Desktop HUD) | Adapt floating HUD overlay and keyboard shortcut state management for the global `Cmd+Shift+N` research dock. |

---

## 7. Cross-Surface Invariants & Security Boundaries

1. **Zero-Bypass Shield Invariant (`SH01`, `SH02`):**
   - Every inference request across Web, Desktop, and Mobile must carry an HMAC-SHA256 signed `ShieldDecision` token issued by `packages/shield`.
2. **Deterministic Canadian Data Residency (`ca-central-1`):**
   - All cloud network egress is locked strictly to AWS Canada Central (`ca-central-1`) or Azure Canada East (`canadaeast`).
   - Desktop and Mobile offline modes enforce socket-level blocking of WAN traffic.
3. **McGill Guide 10th Edition Citation Discipline:**
   - Citations generated or parsed across all surfaces adhere strictly to McGill Guide 10th Ed. rules and 4-state CiteCheck classification (`verified`, `unverified`, `contradicted`, `unavailable`).
4. **Canadian English Spelling Standard:**
   - All code, UI strings, documentation, and error messages strictly use Canadian English (`centre`, `colour`, `licence` (noun), `behaviour`, `rigour`, `organization`, `analyse`).
5. **Prohibited Competitor Terms:**
   - The terms **Vault**, **Spaces**, **Pages**, **Labs**, **Canvas**, and **Copilot** are strictly prohibited across all surfaces, routes, and identifiers.
