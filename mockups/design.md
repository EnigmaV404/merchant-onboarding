# Merchant Onboarding Operations Platform — Design Guidelines

## Design Philosophy

The platform should feel like an enterprise-grade operational control center built for high-volume onboarding and compliance workflows inside banks and NBFCs.

The experience must prioritize:

* Operational efficiency
* Fast decision-making
* Compliance enforcement
* Reviewer productivity
* Workflow clarity
* Minimal context switching

The interface should optimize for dense information visibility while maintaining strong hierarchy and readability.

---

# Visual Language

## Design Style

* Modern fintech enterprise SaaS
* Dense operational UI
* Workflow-first layouts
* Functional over decorative
* Minimal but polished
* High information clarity
* Structured and scalable

Avoid:

* Consumer-app aesthetics
* Marketing-style visuals
* Oversized cards
* Excessive whitespace
* Heavy gradients
* Soft playful UI patterns

---

# Brand Palette

## Primary Colors

* Primary Red: #E31E24
* Primary Blue: #1D4ED8
* Dark Navy: #0F172A
* Slate Gray: #334155
* Light Background: #F8FAFC
* Border Gray: #E2E8F0
* White: #FFFFFF

## Semantic Colors

* Success: #16A34A
* Warning: #D97706
* Error: #DC2626
* Info: #2563EB
* Escalation / Priority: #7C3AED

Use semantic colors consistently for:

* SLA states
* Risk indicators
* Verification status
* Escalations
* Approval/rejection states
* Compliance blockers

---

# Layout Principles

## Operational Density

The UI should maximize information visibility without overwhelming users.

Prioritize:

* Compact tables
* Split-pane layouts
* Persistent operational context
* Sticky action areas
* Reduced click depth
* Fast scanning patterns

Preferred layout patterns:

* Multi-panel workspaces
* Queue + detail view
* Persistent side navigation
* Fixed operational headers

---

# Information Hierarchy

Critical operational signals should always remain visible:

* SLA countdown
* Risk level
* Merchant category
* Verification status
* Pending mandatory checks
* Workflow stage
* Escalation state

Primary actions should remain accessible without excessive scrolling.

---

# Components & Interaction Style

## Tables

* Compact row density
* Strong scanability
* Sticky headers preferred
* Sortable and filterable
* Status indicators inline

## Status Indicators

Use badges/chips for:

* Approval status
* Risk level
* Verification outcomes
* SLA severity
* Escalation markers

## Checklists

* Clearly separate mandatory vs optional checks
* Missing mandatory checks should visually block approval
* Checklist states should update dynamically based on merchant category

## Action Controls

Primary workflow actions:

* Approve
* Reject
* Escalate
* Request Documents

Actions should feel operational and decisive rather than conversational.

---

# Typography

Typography should feel:

* Clean
* Enterprise-grade
* Highly readable
* Operationally efficient

Recommended:

* Sans-serif typography
* Strong contrast
* Tight but readable spacing
* Clear distinction between metadata and primary content

---

# User Experience Principles

The workflow should:

* Minimize reviewer memory dependency
* Reduce context switching
* Guide compliance enforcement
* Improve throughput for experienced reviewers
* Support human + automated verification orchestration

The platform should feel scalable and configurable for multiple merchant onboarding workflows.

---

# Overall Product Feel

The experience should resemble:

* A fintech operations command center
* A compliance workflow orchestration layer
* A high-volume review platform used by operations and risk teams

The UI should communicate:

* Reliability
* Governance
* Operational control
* Speed
* Audit readiness
* Enterprise scalability
