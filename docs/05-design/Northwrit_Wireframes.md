# Northwrit UI Wireframes (ASCII)

**Status:** Proposed | **Version:** 1.0 | **Date:** November 3, 2026

---

## Wireframe 1: Main Matter Workspace with Split Folio

```
+----------------------------------------------------------------------------------------------------------+
| NORTHWRIT   Matter: Project Northern / M-2026-089   [Shield: HYBRID (CA)]   Sarah (Assoc)   [Control Ctr]|
+----------------------------------------------------------------------------------------------------------+
| MATTERS   | CHAT & RESEARCH                       | FOLIO: Memorandum of Law (v1.2) [Approved ●] [Export]|
|-----------+---------------------------------------+------------------------------------------------------|
| > Active  | User: What notice period applies to a | 1. ISSUE                                             |
|   Lion    | 5-year VP terminated without cause?   | Whether executive employees in Ontario with 5 years  |
| * Northern|                                       | service are bound by contractual ESA minimums...     |
|   Apex    | Northwrit: Under Ontario law, where a |                                                      |
|           | termination clause is unenforceable,  | 2. RULE & ANALYSIS                                   |
| REPOSIT.  | common law reasonable notice applies  | In Ontario, common law notice principles govern when |
| Files (8) | [1: Verified]. In Waksdale [2], the   | contractual provisions violate ESA standards [1].    |
| Folios (3)| ONCA held that invalid clauses render | The Court of Appeal in Waksdale v. Swegon [2] held   |
| Notes (4) | the entire clause void.               | that termination provisions cannot be severed...     |
|           |                                       |                                                      |
| CITATIONS | [1] Amberber v. IBM, 2018 ONCA 571    | 3. AUTHORITIES TABLE                                 |
| [1] ONCA  |     (Para 23) [● Verified]            | - Amberber v. IBM, 2018 ONCA 571 ............. [p. 3]|
| [2] ONCA  | [2] Waksdale v. Swegon, 2020 ONCA 391 | - Waksdale v. Swegon, 2020 ONCA 391 .......... [p. 4]|
|           |     (Para 12) [● Verified]            |                                                      |
|           | ------------------------------------- | Reviewer: Elena (Partner)                            |
|           | [ Ask follow-up question...       ^ ] | Approved at: 2026-11-03 16:45 EST                     |
+----------------------------------------------------------------------------------------------------------+
```

---

## Wireframe 2: Bearings Clarification Dialogue

```
+--------------------------------------------------------------------------+
|  SET BEARINGS (RESEARCH SCOPE)                                       [X] |
+--------------------------------------------------------------------------+
|  Before executing legal search, please confirm research boundaries:      |
|                                                                          |
|  Jurisdiction:                                                           |
|  [ Ontario (Superior Court & Court of Appeal)                       |v]  |
|                                                                          |
|  Representation & Posture:                                               |
|  ( ) Plaintiff / Employee                                                |
|  (X) Defendant / Employer                                                |
|  ( ) Neutral Advisory                                                    |
|                                                                          |
|  Relevant Timeframe Cutoff:                                              |
|  [ Past 10 Years (2016 - 2026)                                      |v]  |
|                                                                          |
|  [ ] Restrict citations strictly to binding appellate authorities        |
|                                                                          |
|  [ Cancel ]                                          [ Confirm & Research ]
+--------------------------------------------------------------------------+
```

---

## Wireframe 3: Shield Privacy Drawer & Log Preview

```
+--------------------------------------------------------------------------+
|  NORTHWRIT SHIELD: PRIVACY & OUTBOUND AUDIT                          [X] |
+--------------------------------------------------------------------------+
|  Current Matter: Acme Acquisition           Current Mode: [ LOCAL ONLY ] |
|                                                                          |
|  Active Policy Constraints:                                              |
|  - Cloud Inference: BLOCKED                                              |
|  - Outbound Network Calls: DISABLED                                      |
|  - Local Model: Llama-3.3-70B-Q4 (vLLM Firm Server @ 10.0.4.12)          |
|                                                                          |
|  RECENT SHIELD EVENTS:                                                   |
|  Time     Event          Model           Destination   Status            |
|  14:22:01 Completion     Llama-3.3-70B   Local Host    Success           |
|  14:25:10 Web Search     External        External Net  BLOCKED (Policy)  |
|  14:30:19 Embedding      BGE-M3-Local    Local Host    Success           |
|                                                                          |
|  [ Download Audit Log (SHA-256 Signed JSON) ]       [ Close Drawer ]     |
+--------------------------------------------------------------------------+
```
