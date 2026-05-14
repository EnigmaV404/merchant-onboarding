# PROJECT.md

# Overview

Build a modern merchant onboarding platform for a financial institution.

The platform is used internally by:

- Operations Agents
- Compliance Reviewers
- Operations Team Leads
- Platform Admins

The system handles onboarding for:

- Retail merchants
- Food & Beverage merchants
- Digital Services merchants

The application should support:

- Dynamic onboarding workflows
- Automated document verification orchestration
- OCR extraction pipelines
- Confidence-based routing
- Exception handling
- Manual review workflows
- Audit-safe approvals
- Operational dashboards

The system should feel scalable, operationally efficient, and enterprise-ready.

---

# Core Product Philosophy

The platform is NOT a simple form tracker.

It is:

- a workflow orchestration platform
- a verification engine
- an operational decisioning system

The experience should prioritize:

- speed
- operational visibility
- exception handling
- automation-first onboarding
- auditability
- scalability

---

# Suggested Tech Stack

Frontend:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

Backend:

- Node.js or NestJS
- PostgreSQL
- Prisma ORM

State & Data:

- React Query / TanStack Query
- Zustand or Context API

Charts:

- Recharts

Authentication:

- Role-based authentication

Architecture:

- Modular service-oriented architecture
- API-first structure
- Async workflow support

---

# Core Modules

## 1. Authentication & Roles

Roles:

- Operations Agent
- Compliance Reviewer
- Team Lead
- Admin

Support:

- RBAC
- route protection
- module-level permissions
- action-level permissions

---

# 2. Merchant Application Module

Support:

- create merchant application
- edit application
- assign owner
- application timeline
- status management

Fields:

- merchant legal name
- merchant display name
- merchant category
- business constitution
- GST number
- PAN
- primary contact
- email
- phone
- registered address
- operating address
- onboarding source
- assigned agent
- risk status
- onboarding status

Statuses:

- Draft
- Pending Documents
- Verification In Progress
- Ready for Review
- In Review
- Exception Review Required
- Sent Back
- Approved
- Rejected
- Withdrawn
- Auto-Approved

---

# 3. Dynamic Checklist Engine

Generate onboarding requirements dynamically based on:

- merchant category
- business type
- risk profile
- verification capability availability

Checklist item structure:

- id
- title
- description
- required/optional
- document type
- automation supported
- verification status
- confidence score
- reviewer notes
- uploaded file references
- retry status

Support:

- conditional checklist rendering
- configurable checklist templates
- admin-managed rules

---

# 4. Document Management System

Support:

- drag-and-drop upload
- multi-file upload
- preview
- version history
- tagging
- retry uploads

Supported flows:

- OCR extraction
- verification APIs
- tampering detection
- entity matching
- confidence scoring

Document statuses:

- Uploaded
- Processing
- OCR Complete
- Verification Passed
- Verification Failed
- Tampered
- Manual Review Required
- Rejected
- Verified

---

# 5. Automated Verification Orchestrator

Create an orchestration layer for document intelligence workflows.

The system should support integrations such as:

- PAN verification
- GST verification
- MCA verification
- Aadhaar verification
- FSSAI verification
- bank account verification
- OCR extraction
- tampering detection
- address matching
- face comparison
- entity matching

Each verification response should generate:

- verification result
- confidence score
- extracted fields
- mismatch indicators
- retry recommendation
- escalation recommendation

---

# 6. Confidence Scoring Engine

Each onboarding case should generate:

- overall onboarding confidence score
- document-level confidence
- verification confidence
- entity match confidence

Threshold-based routing:

- high confidence → auto-approve eligible
- medium confidence → reviewer validation
- low confidence → mandatory exception review

Support configurable thresholds.

---

# 7. Exception Management Module

Create a dedicated exception workflow.

Triggers:

- low confidence
- OCR failure
- tampering detection
- entity mismatch
- missing verification
- unsupported document type
- policy violation

Support:

- reviewer notes
- escalation
- retry verification
- alternate document requests
- override approvals

---

# 8. Reviewer Workflow

Reviewer capabilities:

- verify documents
- review extracted fields
- compare mismatches
- approve/reject applications
- issue waivers
- send back applications
- request alternate documents

Reviewer queue filters:

- risk level
- merchant category
- confidence score
- pending review
- SLA breach
- tampering alerts
- mismatch alerts

---

# 9. Additional Document Module

Support dynamic document requests.

Fields:

- custom document name
- custom description
- mandatory/optional toggle
- upload field
- manual verification required
- reviewer notes

Purpose:

- edge-case onboarding
- unsupported document types
- client-specific onboarding requirements

---

# 10. Dashboard & Reporting

Create operational dashboards.

Metrics:

- onboarding volume
- approval TAT
- STP rate
- reviewer workload
- auto-approval %
- exception rate
- rejection rate
- SLA breaches
- ageing buckets
- verification failures
- tampering alerts

Views:

- agent dashboard
- reviewer dashboard
- team lead dashboard
- admin analytics

---

# 11. Audit Trail System

Every action must be auditable.

Track:

- user actions
- status transitions
- verification results
- API calls
- confidence changes
- reviewer overrides
- waiver actions
- uploads
- rejections
- approvals

Audit logs should be immutable.

---

# 12. Workflow Logic

Primary workflow:

Application Created

→ Dynamic Checklist Generated

→ Documents Uploaded

→ OCR & Verification Triggered

→ Confidence Scoring

→ Auto-Approve OR Exception Queue

→ Reviewer Decision

→ Final Approval/Rejection

Support asynchronous processing states.

---

# 13. UI Expectations

Focus on:

- operational efficiency
- data density
- workflow visibility
- fast navigation
- clean enterprise experience

Core screens:

- dashboard
- application queue
- application detail view
- document review panel
- verification timeline
- exception review console
- analytics dashboard
- admin configuration

Preferred UX patterns:

- split-pane layouts
- sticky status panels
- timeline views
- verification cards
- inline actions
- expandable sections
- filter-heavy operational tables

---

# 14. Seed Data

Create:

- sample merchant applications
- multiple merchant categories
- failed verification examples
- tampered document examples
- exception cases
- auto-approved cases

---

# 15. Suggested Folder Structure

/apps

/components

/modules

/services

/lib

/hooks

/types

/config

/data

/prisma

/api

/workflows

/utils

---

# 16. Important Product Behaviors

The platform should:

- minimize reviewer workload
- prioritize exception-based operations
- support automation-first onboarding
- remain configurable
- support future integrations easily

Avoid:

- hardcoded onboarding logic
- static forms
- linear-only workflows
- excessive modal usage
- spreadsheet-style UX

---

# 17. Stretch Goals

Optional advanced capabilities:

- workflow builder
- no-code checklist configuration
- AI risk summaries
- document fraud intelligence
- merchant self-serve portal
- webhook/event architecture
- SLA automation engine
- real-time collaboration
- approval matrices
- case assignment automation

---

# 18. Final Build Expectations

The final product should resemble:

- a modern enterprise operations platform
- intelligent onboarding orchestration software
- scalable fintech infrastructure

Prioritize:

- realistic workflows
- polished operational UX
- believable enterprise interactions
- modular architecture
- scalable component patterns
- production-grade information hierarchy