# Northwrit User Journeys

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.

**Status:** Proposed | **Version:** 1.0 | **Date:** November 3, 2026

---

## Journey 1: The Research Lawyer Memo Workflow (P0 Core)

**Persona:** Sarah (Litigation Associate)  
**Goal:** Research an unsettled question under Ontario employment law regarding termination notice, grounded in client employment agreements and correspondence.

```
   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
   │ 1. Create     │ ──► │ 2. Ingest     │ ──► │ 3. Bearings   │ ──► │ 4. Scoped     │
   │    Matter     │     │    Record     │     │    Dialogue   │     │    Research   │
   └───────────────┘     └───────────────┘     └───────────────┘     └───────┬───────┘
                                                                             │
   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐             │
   │ 7. Approved   │ ◄── │ 6. Lawyer     │ ◄── │ 5. Draft      │ ◄───────────┘
   │    Export     │     │    Review     │     │    Memo Folio │
   └───────────────┘     └───────────────┘     └───────────────┘
```

### Step-by-Step Flow

1. **Matter Creation & Policy Setup (MT01, MT02, MT03, SH01):**
   - Sarah opens Northwrit, selects *New Matter*, enters "Acme v. Tremblay", jurisdiction "Ontario", Matter Instructions *"We act for the defendant employer; cite using McGill Guide"*, and sets Privacy Mode to *Hybrid* (Canadian-region cloud permitted).
   - System establishes tenant and matter ACL boundaries before accepting files.

2. **Ingest Record Documents (RV01, RV02):**
   - Sarah uploads the employment agreement (`agreement.docx`) and 14 email exchanges (`emails.pdf`).
   - *System Behaviour:* Ingests, parses text, extracts chunks with page/paragraph locators, and records version `v1`.
   - *Failure Path:* If a scanned PDF lacks a text layer and OCR (RV04, P1) is not yet enabled, Northwrit visibly marks `scan_03.pdf` as `Failed: scanned PDF without text layer` rather than silently ignoring it.

3. **Establish Research Scope via Bearings (RS01, RS02, RS03):**
   - Sarah prompts: *"Does the employee have a claim for reasonable notice beyond statutory ESA minimums given the termination clause?"*
   - *System Behaviour (Bearings):* Northwrit checks for missing parameters and prompts Sarah to confirm:
     - Jurisdiction: Ontario (CA-ON).
     - Relevant date: June 2026.
     - Material facts: 5 years service, non-executive role.
   - *Source Unavailable Path:* If an upstream source API is unreachable, Northwrit returns partial findings and explicitly displays a coverage gap banner naming the unavailable source.

4. **Live Research & Claim-Level Verification (RS01, RS04, RS05):**
   - Northwrit synthesizes legal propositions, separating matter facts, supporting authorities, contrary authorities, and unknowns.
   - For every proposition, **CiteCheck** resolves the citation, fetches the passage, checks support, and assigns one of four labels:
     - `[1] Waksdale v. Swegon North America Inc., 2020 ONCA 391 [Verified]`
     - `[2] Cecchetto v. Fiat, 2019 ONSC 1234 [Unverified: passage discusses constructive dismissal, not severability]`
   - The UI clearly states that *Verified* confirms passage support, not subsequent appellate history (citator treatment).

5. **Draft Research Memo Folio (AG01, SO02, RS06):**
   - Via the bounded Research-to-Memo workflow (AG01), Northwrit opens an editable split-pane **Folio** beside the chat containing Facts, Issues, Rule, Analysis, Authorities Table, and Limitations.

6. **Review & Approval State Transition (SO03, SO04):**
   - The Folio opens in state `Draft (v1)`.
   - Sarah refines paragraph 4 (creating `v2`) and submits for review (`In review`), assigning Partner Elena.
   - Elena leaves a comment requesting clarification on mitigation (`Changes requested`).
   - Sarah updates the analysis (`v3`) and resubmits. Elena clicks `Approve`. State transitions to `Approved (bound to v3)`.
   - *Invalidation Rule:* If Sarah subsequently edits a sentence or uploads a replacement employment contract, `v3`'s approval is invalidated. Content edits create a new version in `Draft`; changes to cited evidence preserve v3 and return its state to `In review`. Unrelated uploads do not invalidate approval.

7. **Export (SO05):**
   - Sarah exports the approved memo to Word (`.docx`), preserving citations, scope assumptions, reviewer identity, and version `v3`.

---

## Journey 2: Contract Counsel Playbook Review (P1)

**Persona:** Marc (General Counsel)  
**Goal:** Review an incoming supplier Master Services Agreement against the corporate risk playbook.

1. **Ingest & Auto-Sort (RV01, RV05):** Marc uploads `Supplier_MSA_VendorDraft.docx`. Auto-Sort classifies it as *MSA* and extracts parties and dates.
2. **Select Playbook (DR02, DR03):** Marc selects the approved "Inbound Technology Procurement Playbook".
3. **Run Playbook Check (DR03):**
   - The engine checks each clause against standard positions and fallback wording.
   - *Limitation of Liability:* Playbook requires a 12-month fees cap; supplier draft has uncapped data-breach liability. Flagged as `Deviation`.
4. **Propose Redline & Checkpoint (DR03, DR04, AG03):**
   - Northwrit generates a Redline Report (DR04) and proposes tracked-change edits in the Folio or Word Add-in (DR05).
   - Marc reviews and approves each proposed redline before export.

---

## Journey 3: Administrator Policy Enforcement & Audit (P0 / P1)

**Persona:** Elena (Managing Partner / Administrator)  
**Goal:** Enforce strict Canadian data residency and audit all outbound model calls across the firm.

1. **Configure Firm & Matter Policy (SH01, SA08, MT03):**
   - Elena opens the Control Centre, sets the Firm Policy to allow only Canadian-region cloud adapters with contractual no-training terms (SA04), and sets high-sensitivity Matter "Project Lion" to *Local Only*.
2. **Blocked Outbound Route Behaviour (SH01, SH04):**
   - At P0 (before the P1 Local Companion is installed), if a user in "Project Lion" attempts a model call, Shield blocks the step and returns `blocked_by_policy` with available alternatives rather than silently escalating to a cloud model.
   - At P1 (with the Local Companion active, SH05), the request routes strictly to the certified local model with zero external network egress.
3. **Shield Log & Audit Inspection (SH03, SA09):**
   - Elena inspects the **Shield Log** to verify every allowed and blocked outbound attempt, seeing user, timestamp, data category (`prompt`, `excerpt`), model, region, and rule ID—with zero duplicated sensitive payload text.

---

## Journey 4: Knowledge Manager Precedent Curation (P1)

**Persona:** David (Knowledge Manager)  
**Goal:** Publish an approved firm precedent and playbook without exposing private client matter facts.

1. **Curate Precedent Bank (RV06, DR02):** David uploads sanitized model clauses and an Ontario NDA Playbook into the Precedent Bank, assigning version `1.0` and practice-group owners.
2. **Package as a Firm Pack (CN03):** David bundles the NDA Playbook, an NDA Triage agent (AG04), and standing prompts (AS04) into a private Firm Pack and publishes it to the Corporate team. Memory rules (CU03) ensure no private matter facts ever flow back into the shared Precedent Bank without explicit approval.

---

## Journey 5: Legal Operations Intake & Triage (P1)

**Persona:** Liam (Legal Operations Manager)  
**Goal:** Triage incoming business legal requests, assign ownership, and monitor task budgets.

1. **Intake Queue (AG08):** Business requests arrive in the Intake queue. Northwrit classifies the request type and drafts an initial acknowledgment for lawyer approval (AG03).
2. **Assign & Track (MT06, SA06):** Liam routes the request to an open matter, assigns an associate, and monitors task budget consumption and turnaround on the Matter Dashboard.
