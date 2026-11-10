# Law Society of Ontario (LSO) CPD Seminar Accreditation & MSP Partnership Guide (GTM-02)

> **Accredited Legal Education & Managed Service Provider (MSP) Distribution Framework**

---

## Part A: Accredited LSO CPD Seminar Syllabus

### Course Title
**"Artificial Intelligence Competence, Confidentiality, and Ethical Practice under Law Society of Ontario Rules 3.1, 3.3, and 6.1"**

### Accreditation Hours
- **Substantive CPD Hours:** 1.5 Hours
- **Professionalism / Ethics CPD Hours:** 1.0 Hour
- **Total Accredited Hours:** 2.5 Hours

---

### Detailed Course Outline & Learning Objectives

#### Module 1: Technological Competence & The Hallucination Hazard (Rule 3.1) [45 min]
- **Learning Objectives:**
  - Define the lawyer's professional obligation under LSO Rule 3.1 to understand the operational capabilities, structural limits, and failure modes of generative AI systems.
  - Review international and domestic sanctions concerning fabricated judicial authorities in court filings (*e.g., Mata v. Avianca*, Canadian court practice directions).
  - Understand the technical anatomy of LLM hallucinations: stochastic next-token prediction versus deterministic grounded retrieval.
  - Introduce the **4-State CiteCheck Discipline**: classifying citations as `verified`, `unverified`, `contradicted`, or `unavailable`.

#### Module 2: Client Confidentiality, Data Sovereignty & Privilege (Rule 3.3) [45 min - Professionalism]
- **Learning Objectives:**
  - Analyze the strict evidentiary standards of solicitor-client privilege and confidential client communications under LSO Rule 3.3.
  - Assess cloud LLM provider terms of service: training on customer prompts, zero-retention claims, and telemetry leakage risks.
  - Cross-border data transfer implications: PIPEDA, the US CLOUD Act, and Quebec Law 25 cross-border privacy assessments.
  - Technical countermeasures: Pre-inference Canadian PII pseudonymization (SIN, postal code, court file number, LSO ID), Customer-Managed Encryption Keys (BYOK KMS), and air-gapped local workstation inference (`127.0.0.1:1337`).

#### Module 3: Supervision of Automated Agents & Partner Sign-Off (Rule 6.1) [30 min - Professionalism]
- **Learning Objectives:**
  - Understand the supervising lawyer's non-delegable duty under LSO Rule 6.1 when utilizing automated AI agents for legal drafting and contract review.
  - Establishing mandatory human-in-the-loop approval gates before any AI-generated legal text is filed with a court or delivered to a counterparty.
  - Maintaining immutable, tamper-evident audit trails (Shield Logs) documenting what model, policy, and lawyer approved each transaction.

#### Module 4: Practical Interactive Workshop with Northwrit [30 min]
- **Learning Objectives:**
  - Hands-on simulation of an Ontario wrongful dismissal reasonable notice analysis using interactive **Bearings**.
  - Reviewing the **Review Grid** comparative clause analysis across commercial agreements with exact paragraph coordinate bounding boxes.
  - Exporting UTBMS/LEDES 1998B disbursement records (`E100` Legal AI Research) conforming to Law Society billing transparency standards.

---

## Part B: Canadian Legal IT Managed Service Provider (MSP) Partnership Framework

### 1. Strategic Rationale
Mid-sized Canadian law firms (15–150 lawyers) rarely maintain in-house AI infrastructure engineering teams. To achieve rapid scale across Ontario and nationwide, Northwrit partners with certified legal-specialist Managed Service Providers (MSPs) already managing firm IT infrastructure, Microsoft 365 tenants, and document management systems (iManage, NetDocuments).

### 2. Target Regional MSP Partner Ecosystem

| Geographic Market | Target Specialist Legal MSPs | Core Integration Scope |
|---|---|---|
| **Toronto / GTA (Ontario)** | LexisNexis/Clio certified partners, CareSys, MT>Ventures, ProCirrus | Entra ID SSO, Microsoft Word Add-in deployment, Customer AWS `ca-central-1` VPC setup |
| **Ottawa (National Capital)** | Federal government & regulatory legal IT specialists | Bilingual (EN/FR) bijural deployment, air-gapped firm-server appliances |
| **Montreal (Quebec)** | Quebec Law 25 compliance integrators | Azure `canadaeast` deployment, Civil Code / Civil Law French language localization |
| **Calgary & Vancouver (Western Canada)** | Corporate energy & commercial litigation IT providers | iManage Work 10 on-premise connectors, Ethical Wall configurations |

### 3. Commercial Co-Selling & Revenue Share Model
- **Partner Margin:** 20% recurring annual margin on software subscription licenses for the lifetime of the firm contract.
- **Implementation Services:** 100% of implementation, tenant setup, and local GPU appliance installation fees retainable by the MSP partner ($5,000–$15,000 per firm).
- **Certified Training:** Northwrit provides free quarterly technical certifications for MSP systems engineers.
