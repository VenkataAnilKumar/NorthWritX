# Northwrit Sovereign Law Firm Pilot Charter (GTM-01, Gate G16)

> Requirements reconciliation — November 9, 2026. The [Workflow Contracts](../04-specs/Northwrit_Workflow-Contracts.md) govern review invalidation, export eligibility, lifecycle handoffs, and baseline release scope. Architectural approval does not establish implementation status.

> **Standard 4-Week Enterprise Evaluation Agreement for Ontario Mid-Sized Law Firms (15–75 Lawyers)**

---

## 1. Executive Summary & Purpose

This Pilot Charter governs the formal 4-week sovereign deployment and evaluation of **Northwrit (`NorthWritX`)** by participating Ontario law firms. The primary objective is to validate lawyer capacity recovery, 4-state citation precision under the McGill Guide 10th Edition, and client disbursement recovery under Law Society of Ontario (LSO) guidelines, prior to commercial conversion.

---

## 2. Pilot Firm Cohort & Scope

| Parameter | Specification |
|---|---|
| **Target Cohort** | 3–5 Ontario Mid-Sized Law Firms (Toronto, Ottawa, Hamilton, London) |
| **Firm Size** | 15–75 Fee Earners (Partners, Senior Associates, Associates, Articling Students) |
| **Practice Areas** | Commercial Litigation, Employment Law, Corporate M&A, Commercial Real Estate |
| **Infrastructure Deployment** | P0: managed Canadian-region cloud. Customer VPC requires separate deployment validation. Firm Server and Local Companion belong to P1 and require explicitly expanded pilot scope. |
| **Duration** | 4 Consecutive Calendar Weeks |

---

## 3. Four-Week Pilot Milestone Execution Schedule

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            4-WEEK PILOT TIMELINE                             │
│                                                                              │
│  WEEK 1: Provisioning & Ethical Walls                                        │
│  ├── Tenant & Customer VPC Configuration (ca-central-1)                      │
│  ├── Entra ID / Okta SSO Integration with Mandatory MFA (SA03)              │
│  └── Ethical Wall barrier initialization for adverse matters (SA11)          │
│                                                                              │
│  WEEK 2: Associate Champion Onboarding                                       │
│  ├── Microsoft Word Add-in deployment (Office.js DR05)                       │
│  ├── Clause Playbook configuration (Standard vs Fallback)                    │
│  └── Pre-search Bearings calibration & CanLII retrieval training             │
│                                                                              │
│  WEEK 3: Parallel Shadow Practice Testing                                    │
│  ├── Shadow drafting: Statements of Defence, Motion Factums, and Memos      │
│  ├── Review Grid batch extraction on active commercial leases/NDAs           │
│  └── 4-State CiteCheck verification audit against official CanLII records    │
│                                                                              │
│  WEEK 4: Executive Audit & Commercial Conversion                             │
│  ├── Managing Partner time-saved & capacity audit (SA06)                     │
│  ├── LEDES 1998B / UTBMS E100 disbursement statement validation              │
│  └── Execution of 12-month commercial enterprise contract                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Weekly Deliverables

#### Week 1: Environment Provisioning, Security & Governance
- **Deliverables:**
  - Automated deployment of customer tenant using `deploy/vpc-terraform/aws-ca-central-1/` or `deploy/firm-server/`.
  - KMS Customer-Managed Key (BYOK) generated under firm custody.
  - Setup of 6 standardized law firm roles (`firm_admin`, `partner`, `senior_associate`, `associate`, `paralegal`, `readonly_auditor`).
  - Active Ethical Wall barriers established for conflicted matters.

#### Week 2: Associate Champion Onboarding & Microsoft Word Integration
- **Deliverables:**
  - Centralized sideloading of `apps/word-addin/manifest.xml` via Microsoft 365 Admin Center.
  - Onboarding workshop for 5–10 designated litigation and corporate associate champions.
  - Configuration of firm standard positions in `ClauseLibrary` (Delaware governing law escalations, liability cap fallbacks).

#### Week 3: Parallel Shadow Practice on Active Matters
- **Deliverables:**
  - Application of Northwrit across at least 15 live or recent matters in parallel with traditional manual research.
  - Execution of 50+ grounded CanLII research runs with interactive Bearings dialogue.
  - Validation that 100% of generated citations match McGill Guide 10th Ed. standards.

#### Week 4: Managing Partner Audit & Commercial Conversion
- **Deliverables:**
  - Aggregated firm analytics report extracted from `ControlCentrePage`: total tokens, billable lawyer hours recovered, and estimated capacity savings.
  - Generation of itemized client disbursement statements using UTBMS Activity Codes (`E100` Legal AI Research, `E101` Review Grid Extraction, `E102` Court Book Assembly).
  - Presentation to Management Committee for annual subscription conversion.

---

## 4. Quantitative Conversion Criteria & Success Thresholds (Gate G16)

The pilot shall be deemed successful and trigger commercial execution upon meeting the following verifiable thresholds:

1. **Weekly Active Usage (WAU):** $\ge 80\%$ weekly active utilization among onboarded associate champions.
2. **Citation Accuracy:** $100\%$ precision on McGill Guide 10th Ed. neutral citations with zero hallucinated authorities admitted.
3. **Passage Support:** Apply baseline G4: at least 99% lawyer-confirmed accuracy for citations labelled Verified. Subsequent-history detection requires RS10 and licensed coverage in an explicitly expanded pilot. Unavailable treatment is disclosed.
4. **Lawyer Time Recovery:** Documented average savings of $\ge 3.5\text{ hours}$ per lawyer per week on legal research and initial drafting.
5. **Client Disbursement Recovery:** Approval by firm billing partner of monthly LEDES 1998B disbursement reports.

---

## 5. Law Society of Ontario (LSO) Compliance Warranty

Northwrit warrants and covenants that:
- **Zero Model Training on Firm Data:** Customer matter documents, queries, and outputs are never utilized for model fine-tuning or retained in persistent model caches.
- **Air-Gapped Sovereign Fallback:** In the event of cloud provider connectivity disruptions, the platform gracefully fails closed with structured `blocked_by_policy` codes and never routes unredacted legal text to unauthorized foreign models.
- **Data Residency Warranty:** All server-side data rest and in-flight transit remains strictly within Canada (`ca-central-1` / `canadaeast`).
