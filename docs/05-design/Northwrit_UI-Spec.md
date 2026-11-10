# Northwrit UI Specification

**Status:** Proposed | **Version:** 1.0 | **Date:** November 3, 2026

---

## 1. Global Shell & Layout Structure

The Northwrit UI follows a structured three-column flexible architecture that keeps the matter, jurisdiction, processing mode, source scope, and review status visible without navigating to administrative screens (MT03):

```
┌──────┬───────────────────────────────┬──────────────────────────────┐
│ Nav  │ Matter Explorer & Work Area   │ Folio Editor / Evidence View │
│ Bar  │ (Chat, Search, Uploads)       │ (Split Screen 50/50 view)    │
│      │                               │                              │
│ [M]  │ Matter: Acme v. Tremblay      │ Folio: Legal Research Memo   │
│ [R]  │ Policy: [● Hybrid (CA)]       │ State: [ Approved (v3) ]     │
│ [D]  │ ───────────────────────────── │ ──────────────────────────── │
│ [A]  │ Chat / Research Input         │ 1. Issues                    │
│ [S]  │ Bearings Prompt               │ 2. Rule & Analysis [1]       │
│      │ Evidence Preview              │ 3. Table of Authorities      │
└──────┴───────────────────────────────┴──────────────────────────────┘
```

---

## 2. Screen-by-Screen Behaviour

### 1. Matter Top Bar
- **Matter Breadcrumb:** `Firm / Litigation / Acme v. Tremblay (M-2026-089)`
- **Context Pills:** Displays active Jurisdiction (`CA-ON`), Source Scope (`Matter + CanLII`), and the clickable **Shield Pill** (*Local Only*, *Hybrid*, *Cloud*).
- **Members & Ethical Walls:** Shows authorized participants and role badges.

### 2. Bearings Clarification Prompt (RS02)
- Triggered inline or as a modal whenever a research query lacks jurisdiction, relevant date, represented side, or material facts.
- **Behaviour:** Blocks search execution until the user confirms the missing parameters or explicitly selects "Search without date restriction". Never guesses silently.

### 3. Evidence Viewer Drawer (AS01, RS05)
- Slides out or splits the right pane when a user clicks a citation chip.
- Displays:
  - Source title, version or `retrieved_at` timestamp, and jurisdiction.
  - Exact page and paragraph locator with the cited span highlighted.
  - CiteCheck support badge (*Verified*, *Unverified*, *Contradicted*, *Unavailable*) and the model identity that checked it.

### 4. Folio Editor beside Chat (SO02, SO03, SO04)
- **Toolbar:** Version selector (`v1`, `v2`, `v3`), Compare Versions toggle, Review State selector (`Draft`, `In review`, `Changes requested`, `Approved`), and Export (`DOCX` at P0; `PDF`, `XLSX` at P1).
- **Approval Invalidation Banner:** If a user edits an `Approved` Folio or if a cited document version changes, an amber banner appears: *"Approval on v3 was invalidated by recent changes. Current version v4 requires review."*

### 5. Shield Log View (SH03)
- Accessible per matter and in the Admin Control Centre.
- Displays an append-only table of outbound cloud events and blocked attempts: Timestamp, Actor, Matter, Destination Provider/Model, Region, Outbound Data Categories (`prompt`, `excerpt`, etc.), Redaction Applied (`Yes/No`), Decision (`Allowed` / `Blocked`), and Rule ID.
- Never displays raw prompt or document text.

### 6. Admin Control Centre (SA05–SA13)
- Dedicated administrative console for users with the `admin` role:
  - **Firm & Model Policy (SH01, SA08):** Set firm-wide maximum privacy mode, enable/disable specific model adapters, verify no-training contract status (SA04), and enforce Canadian residency (SA12).
  - **Users, Roles & Ethical Walls (SA07, SA10, SA11):** Manage role assignments, SSO/SCIM provisioning, and ethical wall rules blocking specific users from named matters across all surfaces.
  - **Retention, Budgets & Audit Export (SA05, SA06, SA09):** Configure retention schedules, per-user/per-firm rate limits and task budgets, and export the hash-chained Audit Trail.

---

## 3. Empty, Error & Blocked States

| State | Visual & Interactive Behaviour |
|---|---|
| **Empty Matter** | Prompts the user to confirm Matter Instructions (MT02) and Privacy Mode (MT03) before dragging in PDF/DOCX files. |
| **Ingestion Failure (RV01)** | Failed files remain visible in the document list with a red `Failed` badge and plain-language reason (e.g., *"scan_03.pdf: Scanned PDF has no text layer; OCR required"*). Other files continue indexing. |
| **Blocked by Policy (SH01, SH04)** | When Shield blocks an outbound call, the step halts with a structured card showing the Rule ID, blocked category, destination region, and clickable permitted alternatives (e.g., *"Narrow sources to local matter files"* or *"Run on Local Companion"*). |
| **Partial Results / Source Outage** | Displays a persistent warning header on the answer or Folio listing the exact unavailable source and coverage gap so partial completion is never silent. |
