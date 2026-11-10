# Northwrit User Guide (Target P0 Pilot)

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.

**Status:** Proposed Pilot Guide | **Date:** November 3, 2026

Northwrit helps you move from a legal question and supporting client documents to a verified, reviewable research memo—while keeping your matter data governed by your firm's privacy policy.

---

## 1. Create a Matter & Set Privacy Policy

1. Click **New Matter** in the left navigation bar.
2. Enter the **Matter Name**, **Client/Matter Number**, **Jurisdiction** (e.g., Ontario), and **Standing Instructions** (e.g., *"We act for the respondent; use McGill Guide citations"*).
3. Choose the **Privacy Mode** (visible at all times in the top bar):
   - **Hybrid (Canadian Cloud):** Private documents stay in your tenant store; permitted cloud models in Canadian regions may be used under policy, and every outbound call is logged in the **Shield Log**.
   - **Cloud:** Uses firm-approved cloud models within configured residency and budget limits.
   - **Local Only (requires P1 Local Companion):** Blocks all external network calls.

---

## 2. Upload Evidence

1. Open the **Documents** tab in your matter and upload PDF or Word (`.docx`) files.
2. Check the ingestion status next to each file:
   - **Indexed:** Ready for search and pinpoint citation.
   - **Failed:** Shows the exact reason (for example, a scanned PDF without a text layer prior to OCR enablement). Northwrit never pretends a failed file was read.

---

## 3. Ask & Research with Bearings

1. Type your legal question in the workspace chat and choose your source scope (*Matter Documents*, *Public Legal Sources*, or *Both*).
2. **Confirm Bearings:** If your question omits the jurisdiction, relevant date, represented side, or key facts, Northwrit prompts you to confirm them before searching.
3. **Inspect Citations & CiteCheck:**
   - Every material claim links to a source passage. Click any citation chip to open the **Evidence Viewer** at the exact paragraph.
   - Check the CiteCheck badge on each citation:
     - **Verified:** The source was resolved and the passage supports the claim.
     - **Unverified:** The source resolved, but the passage does not firmly establish the claim.
     - **Contradicted:** The source passage contradicts the claim.
     - **Unavailable:** The source text could not be fetched under current source rights.
   - *Important:* CiteCheck verifies passage support; it is not a citator (good-law) check unless licensed authority-treatment data is enabled.

---

## 4. Draft, Review & Export a Memo Folio

1. Click **Generate Research Memo** (or run the Research-to-Memo workflow) to open an editable **Folio** beside the chat.
2. Edit the memo directly or ask Northwrit to revise specific sections. Uncited statements are visibly flagged.
3. **Submit for Review:** Change the Folio state from `Draft` to `In review` and assign a reviewer.
4. **Approve:** The reviewer inspects the evidence links and marks the version `Approved`. Note that a substantive edit creates a new draft version. A change to cited evidence preserves the content version, records approval invalidation, and returns it to In review. Unrelated uploads do not invalidate approval.
5. **Export:** Click **Export DOCX** to download the memo with citations, scope assumptions, and version metadata.
