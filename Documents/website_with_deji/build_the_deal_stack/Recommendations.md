# Product Requirements Document (PRD)

## Product Name

**Build the Deal Stack**

## Product Type

Third-party interactive web-based transaction readiness game

## Product Owner

IGetHouse / IICOCECE Properties & Investment Ltd

## Version

v1.0 (MVP – No Backend)

---

## 1. Purpose & Vision

The purpose of *Build the Deal Stack* is to **identify, qualify, and prepare serious real estate buyers and investors** by simulating the real-world property transaction process.

The product is not designed for entertainment. It is designed to:

* Filter unserious prospects
* Expose transaction readiness gaps
* Build confidence in verified, process-driven property acquisition
* Deliver high-quality, context-rich leads to IGetHouse

**Vision Statement:**

> If a user can correctly assemble and execute a deal stack, they are likely ready to transact in the real market.

---

## 2. Problem Statement

In the Nigerian real estate market:

* Many prospects express interest but are not transaction-ready
* Failed or delayed deals are often caused by poor sequencing, missing documentation, or weak due diligence
* Platforms waste resources engaging users who are not prepared to close

There is currently no lightweight, scalable way to **pre-qualify transaction readiness before human engagement**.

---

## 3. Target Users

### Primary Users

* Prospective property buyers
* Real estate investors (local and diaspora)
* Professionals exploring first or second property purchases

### Secondary Users

* Real estate advisors
* Sales teams (future phase)
* Event marketers and partner platforms

---

## 4. Scope & Deployment Model

### In Scope (MVP)

* Third-party standalone web experience
* HTML5, CSS, Vanilla JavaScript
* Local Storage–based state management
* Single-deal scenario
* Card-based deal assembly
* Transaction Readiness Score (TRS)
* Soft lead capture

### Out of Scope (MVP)

* Backend services
* Authentication systems
* Payments
* CRM integration
* Advisor dashboards

---

## 5. Core User Journey

1. User enters the game via external link or QR code
2. User receives a realistic property deal brief
3. User assembles the deal stack using cards
4. System evaluates completeness, sequencing, and risk handling
5. User receives a Transaction Readiness Score
6. User is routed to a score-appropriate conversion CTA

---

## 6. Functional Requirements

### 6.1 Deal Scenario

* Display property type, location, price, and timeline
* Timeline must impose a hard constraint on decisions

### 6.2 Deal Cards

Each card must include:

* ID
* Name
* Category (mandatory, optional, risky, red herring)
* Cost impact
* Time impact
* Prerequisites
* Penalties (if misused or omitted)

### 6.3 Drag-and-Drop Interaction

* Users must drag cards into ordered stack slots
* Cards can be rearranged before validation
* Visual feedback must reflect deal health

### 6.4 Rules Engine

The system must:

* Validate presence of mandatory cards
* Enforce correct sequencing
* Apply risk penalties
* Track time consumption
* Handle simulated random events (optional in MVP)

### 6.5 Scoring System

**Transaction Readiness Score (TRS):**

* Stack completeness (30%)
* Sequencing accuracy (25%)
* Risk handling (25%)
* Time discipline (20%)

Score range: 0–100

### 6.6 Lead Capture (Soft Gate)

* Email input required to view final report
* Stored in Local Storage only

### 6.7 Result Screen

* Display TRS
* Show strengths and gaps
* Present score-based CTA
* Avoid game language

---

## 7. Non-Functional Requirements

### Performance

* Load time under 2 seconds on standard mobile and desktop browsers

### Usability

* Clear, professional interface
* No playful animations or gamified language

### Compatibility

* Modern browsers (Chrome, Safari, Edge, Firefox)
* Mobile-first responsive design

### Security (MVP)

* No sensitive data storage
* Local Storage only

---

## 8. UX Principles

* Serious tone
* Process clarity over visual flair
* Progressive disclosure of complexity
* Feedback framed as insight, not reward

---

## 9. Success Metrics (KPIs)

* Completion rate
* Percentage of users with TRS ≥ 70
* Conversion click-through rate
* Drop-off points during stack assembly

---

## 10. Risks & Mitigations

| Risk                     | Mitigation              |
| ------------------------ | ----------------------- |
| Users treat it as a game | Serious UI and language |
| Over-complexity          | Single scenario in MVP  |
| Data loss                | Clear MVP limitations   |

---

## 11. Future Enhancements (Post-MVP)

* Multiple deal scenarios
* Backend persistence
* Advisor dashboards
* CRM integration
* Partner-branded cards
* Jurisdiction-specific rules

---

## 12. Strategic Alignment

This product supports IGetHouse’s positioning as:

* A verification-first real estate platform
* A trusted investment partner
* A process-driven alternative to speculative property marketing

---

## 13. Final Statement

*Build the Deal Stack* is not a game layer.

It is a **decision filter** that ensures only prepared, informed, and serious prospects advance to real transactions.

This PRD defines the foundation for a scalable, upgrade-ready qualification engine.
