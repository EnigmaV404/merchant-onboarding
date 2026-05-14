# Merchant Onboarding Platform

# PRD: Merchant Onboarding Platform for FastLend NBFC

## 1. Context

FastLend NBFC processes roughly 600 merchant applications per month across three merchant categories: retail, food and beverage, and digital services. Each category has a different document and approval policy.

Today, the process is manual: operations agents track work in a shared Excel sheet and CRM, documents are collected through email, and approvals are coordinated through email threads. Average approval time is 7 days. A recent audit found that 23% of approved merchants were missing at least one required check at the point of sign-off.

## 2. Problem Statement

FastLend does not have a centralized, policy-driven onboarding workflow that enforces category-specific documents and approval checks before merchant sign-off.

Because agents depend on Excel, CRM notes, email attachments, and manual judgment, applications move slowly and inconsistently. The business risk is material: merchants can be approved even when required checks are missing. The platform must become the source of truth for intake, document collection, checklist validation, review, approval, rejection, waivers, and audit history.

The current process requires reviewers to manually validate even standard low-risk documents despite availability of automated verification services, increasing operational latency and reviewer workload.

## 3. Goals

### Business goals

- Reduce average merchant approval time from 7 days to 3 business days or less.
- Reduce missing required checks at sign-off from 23% to 0% for platform-approved applications.
- Move active application tracking out of Excel and email into one auditable workflow.
- Give operations leads clear visibility into volume, ageing, bottlenecks, SLA breaches, send-backs, and exceptions.
- Increase straight-through processing (STP) rate for low-risk merchant onboarding.
- Improve verification consistency through automated source validation and tampering checks.

### User goals

- Operations agents should know exactly what is pending for each merchant without maintaining side trackers.
- Risk and compliance reviewers should be unable to approve incomplete applications unless an authorized waiver exists.
- Team leads should be able to monitor throughput and intervene before applications breach SLA.
- Reduce manual review dependency for standard verification scenarios.

****

## 4. In Scope for v1

- Merchant application creation and assignment.
- Category-based document and approval checklist.
- Document upload, tagging, review, rejection, and replacement.
- Workflow statuses from draft to final decision.
- Separate operations and reviewer queues.
- Approval guardrails that block incomplete sign-off.
- Authorized waiver flow with mandatory reason capture.
- Application-level audit trail.
- Basic reporting dashboard for turnaround time, missing checks, ageing, status, and send-backs.
- Admin configuration for category-level checklist rules.

## 5. Out of Scope for v1

- Merchant acquisition, lead generation, self-serve portal or CRM integration

## 6. Users and Personas

### Persona 1: Operations Agent

The operations agent creates and manages merchant applications, collects documents, tracks missing items, and prepares applications for review.

Needs:

- One queue for assigned applications.
- Clear view of mandatory documents by merchant category.
- Ability to upload and tag documents against checklist items.
- Ability to see missing documents and pending actions.
- System prevention against submitting incomplete applications for review.
- View automated verification results
- Understand why a case failed automation
- Retry verification
- Upload alternate documents
- Handle unsupported document types

### Persona 2: Risk and Compliance Reviewer

The risk and compliance reviewer validates whether an application meets FastLend’s approval policy before final sign-off.

Needs:

- Queue of applications ready for review.
- Category-specific checklist and document view.
- Ability to verify, reject, send back, approve, or reject applications.
- Approval guardrails that prevent accidental non-compliant approvals.
- Tampering alerts
- Cross-document mismatch indicators
- Exception-only queue
- Full decision and waiver history for audit.

### Persona 3: Operations Team Lead

The operations team lead manages workload, SLA adherence, escalations, and process quality.

Needs:

- Dashboard by status, category, ageing, owner, and reviewer.
- Ability to identify bottlenecks and SLA breaches.
- Ability to reassign applications.
- Visibility into missing-check trends, waiver trends, and send-back reasons.

### Persona 4: **Platform Admin / Risk Configuration Manager**

The Platform Admin / Risk Configuration Manager manages automation workflows and defines category-wise verification flows

Needs:

- Configuration dashboard

## 7. Merchant Category Policy Framework

FastLend supports three merchant categories. Each category must have a configurable checklist.

### Retail

Example required checks:

- Owner identity proof - Proprietor/Director PAN and Aadhaar.
- Owner address proof - Proprietor/Director Aadhaar.
- GST or tax registration, where applicable - Shop & Establishment Act Certificate, GST Certificate (if applicable).
- Bank account verification - 6 months Bank Statements, Cancelled Cheque.
- Store or operating address verification - Utility Bill (Electricity/Water) of the shop, Outlet Front Photo.
- Risk reviewer approval

### Food and Beverage

Example required checks:

- Owner identity proof - Proprietor/Director PAN and Aadhaar.
- Owner address proof - Proprietor/Director Aadhaar.
- Bank account verification - 6 months Bank Statements, Cancelled Cheque.
- GST or tax registration, where applicable - Shop & Establishment Act Certificate, GST Certificate (if applicable).
- Mandatory License: FSSAI License (Central/State/Basic).
- Food license or applicable operating license - Rent Agreement, Fire NOC (for large dine-ins)
- Store or operating address verification - Utility Bill (Electricity/Water) of the shop, Outlet Front Photo.
- Risk reviewer approval

### Digital Services

Example required checks:

- Owner identity proof - Proprietor/Director PAN and Aadhaar.
- Owner address proof - Proprietor/Director Aadhaar.
- Bank account verification - 6 months Bank Statements, Cancelled Cheque.
- GST or tax registration, where applicable - Shop & Establishment Act Certificate, GST Certificate (if applicable).
- Website, app, or digital presence verification - Evidence of the digital platform or service portal.
- Service category declaration - Sample invoices to verify the nature of services and the client base.
- Risk reviewer approval

Admin users must be able to configure required and optional checklist items without engineering changes after launch along with verification service to be used.

## 8. Functional Requirements

### 8.1 Application Intake

The system must allow an operations agent to create a merchant application with minimum fields:

- Merchant legal name
- Merchant display name
- Merchant category
- Business type
- Primary contact name
- Primary contact phone number
- Primary contact email
- Registered business address
- Operating address, if different
- Assigned operations agent
- Application source
- Application status

When the category is selected, the system must automatically generate the correct checklist.

### 8.2 Checklist Engine

Each checklist item must support:

- Required or optional flag
- Document or non-document check type
- Owner: operations, merchant, reviewer, or system
- Status: not started, pending, uploaded, verified, failed, waived
- Notes or rejection reason
- Last updated by
- Last updated timestamp

Mandatory checklist items cannot be removed by agents. The system must block approval when any mandatory item is not verified or formally waived.

### 8.3 Document Management

Agents must be able to upload documents against checklist items.

Each document record must capture:

- File name
- Document type
- Linked checklist item
- Verification method
- Uploaded by
- Uploaded timestamp
- Verification status
- Rejection reason, if rejected

Reviewers must be able to mark a document as verified, rejected, or requiring clarification. Rejected documents can be replaced, but the prior version must remain visible in history. Admins must be able access available document verification services or mark them for manual review.

### 8.4 Workflow Statuses

Recommended v1 statuses:

- Draft
- Pending Documents
- Ready for Review
- In Review
- Sent Back
- Approved
- Rejected
- Withdrawn

Status transitions must be permission-controlled. Operations agents can submit only complete cases for review. Reviewers can approve only when all mandatory checks are verified or waived by an authorized user.

### 8.5 Approval Guardrails

The approval action must validate the full mandatory checklist before final sign-off.

Approval must be blocked when:

- A mandatory document is missing.
- A mandatory document is uploaded but not verified.
- A mandatory check has failed.
- A waiver is missing for an exception case.
- A waiver exists but has no reason or approver.

The system must show the exact blocking items. Approval-time checklist snapshot must be stored for audit.

### 8.6 Waiver Flow

Authorized reviewers may waive selected mandatory checks only where policy allows it.

Waiver requirements:

- Waiver permission is role-based.
- Waiver reason is mandatory.
- Waiver timestamp is captured.
- Waiver approver is captured.
- Waived items are visible in application review and reporting.

### 8.7 Queues

Operations queue filters:

- Merchant name
- Merchant category
- Status
- Missing documents
- Ageing

Reviewer queue filters:

- Ready for Review
- In Review
- Merchant category
- Failed checks
- Waiver present
- Ageing
- SLA breach risk

### 8.8 Send-Back Flow

Reviewers must be able to send applications back with structured reasons.

Send-back reasons:

- Missing document
- Incorrect document
- Document mismatch
- Merchant detail mismatch
- Additional verification required
- Policy exception clarification required

When an application is sent back, status changes to Sent Back and the assigned operations agent sees it in their queue with reviewer comments.

### 8.9 Audit Trail

The audit trail must capture:

- Application creation
- Field updates
- Category changes
- Checklist generation and updates
- Document upload, rejection, replacement, and verification
- Status changes
- Send-back reasons
- Waivers
- Approval or rejection decision
- User performing each action
- Timestamp of each action

The audit trail must not be editable or deletable by agents or reviewers.

### 8.10 Reporting Dashboard

The v1 dashboard must show:

- Total applications received
- Applications by status
- Applications by category
- Average approval turnaround time
- Applications ageing beyond SLA
- Missing required check rate at sign-off
- Send-back rate and send-back reasons
- Waiver count and waiver rate
- Approval and rejection count

## 9. User Stories and Acceptance Criteria

### Operations Agent Stories

#### Story 1

As an operations agent, I want to create a merchant application and select a merchant category so that the correct checklist is applied automatically.

Acceptance criteria:

- Given I select retail, food and beverage, or digital services, the system displays the relevant checklist.
- Mandatory checklist items are clearly marked.
- I cannot remove mandatory checklist items.

#### Story 2

As an operations agent, I want to upload documents against checklist items so that reviewers can validate manual approval requirements quickly.

Acceptance criteria:

- Every uploaded document must be linked to a checklist item.
- Documents with automated verification must immediately be approved or rejected
- The system captures uploader name and upload timestamp.
- The checklist item moves to uploaded status after upload.
- The system captures reasons for rejected documents and allows re-upload of same document or alternative.

#### Story 3

As an operations agent, I want to see which applications are missing documents so that I can prioritize follow-ups.

Acceptance criteria:

- My queue supports a missing documents filter.
- Each application shows pending mandatory item count.
- Applications can be sorted by ageing.

#### Story 4

As an operations agent, I want the system to block review submission for incomplete cases so that I do not send non-actionable cases to reviewers.

Acceptance criteria:

- The system directly pushed the application to review if all items are verified and available.
- The system displays all missing items when submission is blocked.
- The system allows exception flow if enabled by the admin user to still push the request for manual review/approval with relevant comments.

### Risk and Compliance Reviewer Stories

#### Story 1

As a reviewer, I want to see all applications ready for review in one queue so that I can process cases efficiently.

Acceptance criteria:

- Reviewer queue shows Ready for Review and In Review applications.
- Queue can be filtered by category, ageing, failed checks, and waiver presence.
- Reviewer can open the full checklist and document set from the queue.

#### Story 2

As a reviewer, I want approval to be blocked when mandatory checks are incomplete so that no merchant is approved with missing required checks.

Acceptance criteria:

- Approve action is blocked if any mandatory item is not verified or waived.
- The system shows the exact blocking checklist items.
- Blocked approval attempt is logged.

#### Story 3

As a reviewer, I want to send an application back with structured reasons so that operations agents know what to fix.

Acceptance criteria:

- Reviewer can select one or more send-back reasons.
- Reviewer can add comments at application or checklist-item level.
- Application status changes to Sent Back.
- Assigned agent sees the application in the Sent Back queue.

#### Story 4

As a reviewer, I want to approve policy waivers with mandatory reasons so that exceptions are audit-safe.

Acceptance criteria:

- Only authorized reviewer roles can waive mandatory checks.
- Waiver reason is mandatory.
- Waiver approver and timestamp are stored in the audit trail.

### Operations Team Lead Stories

#### Story 1

As a team lead, I want to monitor application ageing by owner and status so that I can prevent SLA breaches.

Acceptance criteria:

- Dashboard shows ageing by status and owner.
- Team lead can filter by category.
- Team lead can reassign applications.

#### Story 2

As a team lead, I want to see missing-check and send-back trends so that I can identify process gaps.

Acceptance criteria:

- Dashboard shows missing required check rate.
- Dashboard shows send-back count and top send-back reasons.
- Data can be filtered by agent, reviewer, category, and date range.

## 10. KPIs, Targets, and Definition of Done

### KPI 1: Average Approval Turnaround Time

Baseline: 7 days.

Target: 3 business days or less within 60 days of go-live.

Definition of done:

- Application created timestamp and approved timestamp are captured.
- Turnaround time is calculated from application creation to final approval.
- Dashboard reports average turnaround time for approved applications.
- KPI is achieved when the 30-day rolling average is 3 business days or less for two consecutive reporting weeks.

Measurement method:

- Source: workflow event logs.
- Formula: total business days from application creation to approval divided by number of approved applications in the period.
- Cuts: overall, merchant category, agent, and reviewer.

Capacity and cycle-time rationale:

- Monthly volume: 600 applications.
- Working days assumed: 22 per month.
- Daily intake: 600 / 22 = approximately 27 applications per working day.
- Agent pool: 40 agents.
- New daily intake per agent: 27 / 40 = approximately 0.7 applications per agent per day.
- This indicates the 7-day approval time is unlikely to be caused by raw agent capacity. The main delay is expected to come from queue wait time, document follow-ups, email coordination, incomplete submissions, reviewer back-and-forth, and manual tracking overhead.
- Therefore, the 3-business-day target is based on reducing workflow latency, not assuming a proportional increase in agent productivity.

### KPI 2: Missing Required Check Rate at Sign-Off

Baseline: 23%.

Target: 0% for platform-approved applications from day 1 of production use.

Definition of done:

- Approval is blocked when a mandatory item is incomplete, failed, or not covered by an authorized waiver.
- Every approved application stores an approval-time checklist snapshot.
- Every waived mandatory item has reason, approver, and timestamp.
- KPI is achieved when 100% of approved applications have no missing mandatory checks in the approval snapshot.

Measurement method:

- Source: approval validation logs and approval-time checklist snapshot.
- Formula: approved applications with one or more missing mandatory checks divided by total approved applications.
- Frequency: daily automated report and monthly audit sample.

### KPI 3: Platform Adoption for Active Application Tracking

Baseline: active applications are tracked manually through Excel, CRM, and email.

Target: 95% or more of active merchant applications are created, status-tracked, and decisioned inside the platform within 45 days of go-live.

Definition of done:

- New applications can be created in the platform.
- Application status, document status, reviewer decision, and final outcome are stored in the platform.
- Team leads use the dashboard as the primary source of truth.
- KPI is achieved when at least 95% of applications received in the measurement period have complete platform workflow records.

Measurement method:

- Source: platform application count compared against FastLend’s monthly intake count.
- Formula: applications with complete platform workflow records divided by total merchant applications received in the same period.
- Complete record means application creation, category selection, checklist generation, document status, review decision, and final status are present.

## 11. Permissions

### Operations Agent

Can create and update assigned applications, upload documents, update operations-owned checklist items, submit complete applications for review, and respond to send-backs.

Cannot approve applications, waive mandatory checks, delete audit history, or modify policy rules.

### Risk and Compliance Reviewer

Can review applications, verify or reject documents, approve or reject applications, send applications back, and waive allowed checks if authorized.

Cannot delete audit history or change policy configuration unless also assigned admin permission.

### Operations Team Lead

Can view dashboard, monitor SLA, reassign applications, and export operational reports.

Cannot override approval guardrails unless also assigned reviewer or admin permission.

### Admin

Can configure category-level checklists, approval policies, user roles, and SLA thresholds.

## 12. Key Workflows

### Workflow 1: Application Creation

1. Agent creates application.
2. Agent selects merchant category.
3. System applies category checklist.
4. Agent uploads available documents.
5. System validates documents where automation is available
6. System displays missing mandatory items and documents that failed validations.
7. Application remains Pending Documents until minimum requirements are met.
8. Agent is able to upload missing documents and re-upload failed documents

### Workflow 2: Submit for Review

1. Agent attempts to submit application.
2. System validates mandatory document upload requirements.
3. If complete, status changes to Ready for Review.
4. If incomplete, submission is blocked and missing items are displayed.
5. Agent can add a comment to overwrite mandatory/missing/failed rules

### Workflow 3: Reviewer Decision

1. Reviewer opens application from queue.
2. Reviewer validates documents and checklist items.
3. Reviewer marks items verified, failed, or waived.
4. Reviewer approves, rejects, or sends back.
5. On approval attempt, system validates all mandatory checks.
6. If valid, approval snapshot and audit trail are stored.

## 13. Explicit v1 Trade-Off: Not Building a Self-Serve Merchant Portal

For v1, we will not build a merchant-facing portal where merchants can log in, upload documents, and track application status or integrate with CRM.

Reason:

FastLend’s urgent problem is internal control, policy enforcement, and audit completeness. The highest-risk issue is that 23% of approved merchants were missing required checks at sign-off. A merchant portal  may improve document collection later, but it does not directly solve approval guardrails, reviewer accountability, or audit integrity and the tight timelines do not allow room for Fastlend specific customization that replicate same CRM level onboarding experience. CRM integration too is not possible given limited engineering bandwidth.

The v1 priority is to build the internal operating system for agents, reviewers, and team leads. Once policy compliance and workflow adoption are stable, a merchant portal or CRM integration can be considered for v2.

## 14. Risks and Mitigations

### Risk: Agents continue using Excel as a shadow tracker

Mitigation:

- Make platform queues faster and more useful than Excel.
- Use platform reports for team lead reviews.
- Make platform workflow required for final approval.

### Risk: Policy configuration is too rigid

Mitigation:

- Build configurable category-level checklists in v1.
- Avoid hardcoding document rules where possible.
- Support required, optional, waived, document, and non-document check types.

### Risk: Reviewers overuse waivers

Mitigation:

- Restrict waiver permission by role.
- Require waiver reasons.
- Track waiver rates in dashboard.
- Include waiver review in monthly audit.

### Risk: Turnaround time does not improve

Mitigation:

- Track ageing by status and owner.
- Add SLA breach flags.
- Allow team leads to reassign cases.
- Monitor send-back reasons to reduce repeated defects.

## 15. Open Questions

- What are the exact mandatory documents and checks for each category?
- Which checks can be waived, and which checks must never be waived?
- Who can approve waivers?
- Should business days exclude only weekends or FastLend holidays as well?
- What document file types and size limits should be supported?
- What retention policy applies to documents and audit logs?

## 16. Launch Plan

### Phase 1: Configuration and Pilot

- Configure the three merchant categories.
- Configure document and approval checklist for each category.
- Onboard a pilot group of operations agents and reviewers.
- Run pilot on new applications only.

### Phase 2: Controlled Rollout

- Expand to all operations agents and reviewers.
- Monitor approval time, missing-check rate, and platform adoption daily.
- Stop using Excel as the primary tracker for new applications.

### Phase 3: Stabilization

- Review KPI performance at 30 and 60 days.
- Identify bottlenecks by workflow stage.
- Review waiver and send-back trends.
- Prioritize v2 items such as merchant portal, CRM integration, and automated verification.

## 17. Success Criteria

The v1 release is successful when:

- Average approval turnaround time reaches 3 business days or less within 60 days of go-live.
- Missing required check rate at sign-off is 0% for platform-approved applications.
- At least 95% of active applications are tracked and decisioned in the platform within 45 days of go-live.
- Agents, reviewers, and team leads can complete their core workflows without Excel or email as the system of record.
- Every approved application has a complete approval snapshot and audit trail.

[PROJECT.md](https://www.notion.so/PROJECT-md-35ffb5d65ec1808e869cf5e2ccab181a?pvs=21)