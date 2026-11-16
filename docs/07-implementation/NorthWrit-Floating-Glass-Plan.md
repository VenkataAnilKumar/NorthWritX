# NorthWrit floating glass workspace

Date: November 16, 2026

## Approved direction

A detached navigation rail and floating controls sit over a warm ivory canvas with restrained teal atmosphere. Documents, tables, workflow instructions and AI response text retain opaque reading surfaces. Serif display headings and the NorthWrit N mark provide identity; controls use the existing sans-serif face.

The reviewed concept is a visual reference, including illustrative text. Implementation uses existing authorized data, document viewers, conversations and review flows. It does not add sample AI findings, new matter metadata or Phase 4 capabilities.

## Implementation plan

1. Document surface roles, responsive rules, motion and accessibility in the [design system](../engineering/design-system.md).
2. Add web-owned workspace surface variables, with light/dark values, opaque fallbacks and reduced-transparency/forced-colors support.
3. Apply the floating shell and navigation, page headers and shared section navigation to Assistant, Matters, Library and Workflows.
4. Style the existing Assistant composer and project chat panels; keep document reading areas opaque and mobile document views full-screen within safe margins.
5. Review real content, loading states, nested links, collapsed navigation and keyboard focus at desktop/mobile widths. Check dark mode, reduced motion and transparency fallback.
6. Run affected tests, lint, type checking, production build and repository checks. Capture actual web/Electron screens and commit the reviewed change.

## Acceptance

- Main navigation and existing deep links remain reachable with identical authorization and data ownership.
- Floating controls have visible focus, named icon buttons and clear selected states.
- Text remains readable when blur is unavailable, transparency is reduced, or forced colors are active.
- Reading and scrolling do not place document text behind translucent content panes; sticky table cells retain opaque backings.
- Mobile layout uses available height and width, retains sidebar dismissal, and keeps composer actions accessible.
- No animated background, continuous blur animation, new dependency or change to Word's shared design tokens.
- Actual AI execution remains pending model configuration. No deployment is included.

## Verification

Implemented and reviewed locally on November 16, 2026.

- 121 affected tests passed across 12 files covering sidebar/workspace navigation, shared headers, document panels and composer behavior.
- Web production build and its TypeScript stage passed. Lint passed with zero errors and 29 existing warnings. Existing build warnings about CSS `::highlight` and missing deployment metadata origin remain.
- Repository, branding and whitespace checks passed.
- The real production browser loaded Matters, Library, Workflows and Advanced settings; no uncaught page errors occurred during the exercised flow.
- Light/dark surfaces were captured. Chromium media emulation verified that reduced transparency and forced colors disable blur. Browser checks wait for media-query styles to settle.
- The synthetic supplier agreement rendered with its version panel; document-panel blur was confirmed disabled.
- At 390 × 844, mobile sidebar dismissal and composer bounds passed. Keyboard Tab reached an app control. This is a focused check, not a full accessibility certification.
- The real Linux Electron window loaded the updated matter workspace. Native installer/signing and real Word-host validation are outside this web-only surface change.

## Captures

These are unmodified screenshots of the running application with synthetic data. The AI model is unconfigured; no generated findings are shown. [Capture hashes](../assets/ui/manifest.json) identify the files.

| View | Capture |
| --- | --- |
| Assistant, light | [Light workspace](../assets/ui/01-assistant-light.png) |
| Assistant, dark | [Dark workspace](../assets/ui/02-assistant-dark.png) |
| Source document | [Document workspace](../assets/ui/03-document-workspace.png) |
| Mobile sidebar | [Mobile navigation](../assets/ui/04-mobile-navigation.png) |
| Electron | [Desktop workspace](../assets/ui/05-electron.png) |

Existing split-panel interactions and model configuration requirements remain authoritative. The concept's illustrative AI response and proposed extra source-navigation layout are not represented as newly delivered capabilities.
