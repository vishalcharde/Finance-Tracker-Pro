# 💰 Finance Tracker Pro

Finance Tracker Pro is a client-side, production-grade financial ledger engine and visual analytics asset allocation dashboard built completely using vanilla web web technologies.

---

## 🛠️ Technology Stack Architecture

*   **Markup Foundation:** Semantic HTML5 with accessible structural elements (`main`, `section`, `nav`, `role="dialog"`).
*   **Design Tokens & Layout:** CSS3 Custom Variables featuring an adaptive Light/Dark matrix, a Glassmorphism styling layer framework, CSS Grid, and custom media layout queries.
*   **Core Execution Engine:** Vanilla JavaScript (ES6+) utilizing Object-Oriented State Controllers, persistent LocalStorage synchronization pipelines, and transactional state change tracking.
*   **Visual Analytics Layer:** Chart.js Engine configuration running concurrent multiaxial lifecycles (Line graph, Doughnut allocation, Bar comparisons).
*   **Vector iconography:** Font Awesome Core CDN layout integration.

---

## 📋 Features & Functionality Matrix

### 1. Unified Dashboard Insights
*   **Total Balance:** Real-time net available capital computation matching cash inflow/outflow deltas.
*   **Inflows / Outflows Tracking:** Distinct macroscopic tracking variables recording raw gross totals.
*   **Savings Multiplier:** Automated tracking displaying current saving margins alongside proportional bar metrics.
*   **Intraday Burn Watch:** Isolation metrics identifying total transactions registered within the current calendar block.

### 2. Micro-Transactional Processing Loop
*   Dual-classification ledger controls supporting both capital investments (Inflows) and spending outlays (Outflows).
*   Dynamic inline data modifications via unique structural reference IDs.
*   Safety validation constraints checking for numerical boundary accuracy and metadata verification.

### 3. Comprehensive Refinement Toolbar Grid
*   Full-text search matching alphanumeric properties across descriptions and vendor classifications.
*   Hierarchical filtering options sorting data views by specific expense classifications or transaction flow profiles.
*   Numerical ceiling constraints and start/end calendar windows for deep historical audits.

### 4. Portability Operations (CSV Integration Engine)
*   **Export Pipeline:** Serializes active database state arrays into standard-compliant comma-separated values documents.
*   **Import Engine:** Features a custom lexical parsing framework to parse external documents, validate variable formats, drop broken structures, and safely merge valid historical data logs.

---

## 💾 Core Object Data Relational Schema

Each transaction entity node maps to a rigid structural layout before being committed to the storage layer:

```json
{
  "id": "tx_node_1717182940251_x9f2a",
  "classification": "income" | "expense",
  "category": "Salary" | "Investments" | "Freelance" | "Food" | "Housing" | "Utilities" | "Entertainment" | "Transportation" | "Healthcare" | "Other",
  "amount": 4750.50,
  "date": "2026-07-10",
  "description": "Enterprise consulting retainer payout - Q3 milestone allocation block"
}
