"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileWarning,
  RotateCcw,
  ShieldCheck,
  Undo2,
  XCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CheckStatus = "verified" | "uploaded" | "failed" | "missing" | "waived";
type ReviewStatus = "Ready for Review" | "In Review" | "Sent Back" | "Approved" | "Rejected" | "Withdrawn";

type ChecklistItem = {
  id: string;
  title: string;
  mandatory: boolean;
  status: CheckStatus;
  documentName?: string;
  reviewerComment?: string;
  waiver?: {
    reason: string;
    approvedBy: string;
    approvedAt: string;
  };
};

type ReviewApplication = {
  id: string;
  merchantName: string;
  category: string;
  risk: "Low" | "Medium" | "High";
  assignedAgent: string;
  status: ReviewStatus;
  ageing: string;
  checklist: ChecklistItem[];
  audit: string[];
  blockedItems: string[];
  sendBackReasons: string[];
  sendBackComment?: string;
};

const sendBackReasonOptions = [
  "Missing document",
  "Incorrect document",
  "Document mismatch",
  "Merchant detail mismatch",
  "Additional verification required",
  "Policy exception clarification required"
];

const initialApplications: ReviewApplication[] = [
  {
    id: "APP-1042",
    merchantName: "Blue Nile Retail",
    category: "Retail",
    risk: "Medium",
    assignedAgent: "Nisha Rao",
    status: "Ready for Review",
    ageing: "14h 22m",
    blockedItems: [],
    sendBackReasons: [],
    audit: ["Application entered reviewer queue."],
    checklist: [
      { id: "pan", title: "Owner PAN and Aadhaar", mandatory: true, status: "verified", documentName: "blue-nile-pan.pdf" },
      { id: "gst", title: "GST or tax registration", mandatory: true, status: "failed", documentName: "gst-certificate.pdf" },
      { id: "store", title: "Store front photo", mandatory: true, status: "uploaded", documentName: "store-front.jpg" },
      { id: "bank", title: "Bank statement", mandatory: false, status: "missing" }
    ]
  },
  {
    id: "APP-1054",
    merchantName: "Vanguard Electronics",
    category: "Retail",
    risk: "Low",
    assignedAgent: "Nisha Rao",
    status: "Ready for Review",
    ageing: "3h 45m",
    blockedItems: [],
    sendBackReasons: [],
    audit: ["Application entered reviewer queue."],
    checklist: [
      { id: "pan", title: "Owner PAN and Aadhaar", mandatory: true, status: "verified", documentName: "pan-aadhaar.pdf" },
      { id: "gst", title: "GST or tax registration", mandatory: true, status: "verified", documentName: "gst.pdf" },
      { id: "store", title: "Store front photo", mandatory: true, status: "verified", documentName: "outlet.png" },
      { id: "bank", title: "Bank statement", mandatory: false, status: "uploaded", documentName: "bank.pdf" }
    ]
  },
  {
    id: "APP-1060",
    merchantName: "Urban Bites",
    category: "Food & Beverage",
    risk: "High",
    assignedAgent: "Nisha Rao",
    status: "In Review",
    ageing: "1d 8h",
    blockedItems: [],
    sendBackReasons: [],
    audit: ["Exception review accepted by reviewer."],
    checklist: [
      { id: "pan", title: "Owner PAN and Aadhaar", mandatory: true, status: "verified", documentName: "identity.pdf" },
      { id: "fssai", title: "FSSAI license", mandatory: true, status: "missing" },
      { id: "bank", title: "Bank account verification", mandatory: true, status: "uploaded", documentName: "bank-statement.pdf" },
      { id: "outlet", title: "Outlet front photo", mandatory: true, status: "failed", documentName: "outlet.jpg" }
    ]
  }
];

function getApprovalBlockers(application: ReviewApplication) {
  return application.checklist
    .filter((item) => item.mandatory && item.status !== "verified" && item.status !== "waived")
    .map((item) => `${item.title}: ${statusLabel(item.status)}`);
}

export function ReviewerConsole({ reviewerName, canWaive }: { reviewerName: string; canWaive: boolean }) {
  const [applications, setApplications] = useState<ReviewApplication[]>(initialApplications);
  const [selectedId, setSelectedId] = useState(initialApplications[0].id);
  const [sendBackReasons, setSendBackReasons] = useState<string[]>([]);
  const [sendBackComment, setSendBackComment] = useState("");
  const [waiverReasons, setWaiverReasons] = useState<Record<string, string>>({});
  const [agentHandoff, setAgentHandoff] = useState<string | null>(null);

  const selectedApplication = applications.find((application) => application.id === selectedId) ?? applications[0];
  const selectedBlockers = getApprovalBlockers(selectedApplication);

  const queueSummary = useMemo(
    () => ({
      ready: applications.filter((application) => application.status === "Ready for Review").length,
      sentBack: applications.filter((application) => application.status === "Sent Back").length,
      approved: applications.filter((application) => application.status === "Approved").length
    }),
    [applications]
  );

  const updateSelected = (updater: (application: ReviewApplication) => ReviewApplication) => {
    setApplications((current) =>
      current.map((application) => (application.id === selectedApplication.id ? updater(application) : application))
    );
  };

  const addAudit = (application: ReviewApplication, message: string) => ({
    ...application,
    audit: [`${new Date().toLocaleString("en-IN")} - ${message}`, ...application.audit]
  });

  const approve = () => {
    const blockers = getApprovalBlockers(selectedApplication);

    updateSelected((application) => {
      if (blockers.length > 0) {
        return addAudit(
          {
            ...application,
            blockedItems: blockers
          },
          `Blocked approval attempt by ${reviewerName}.`
        );
      }

      return addAudit(
        {
          ...application,
          status: "Approved",
          blockedItems: []
        },
        `Approved by ${reviewerName}.`
      );
    });
  };

  const reject = () => {
    updateSelected((application) =>
      addAudit(
        {
          ...application,
          status: "Rejected",
          blockedItems: []
        },
        `Rejected by ${reviewerName}.`
      )
    );
  };

  const withdraw = () => {
    updateSelected((application) =>
      addAudit(
        {
          ...application,
          status: "Withdrawn",
          blockedItems: []
        },
        `Withdrawn from reviewer queue by ${reviewerName}.`
      )
    );
  };

  const sendBack = () => {
    if (sendBackReasons.length === 0 || !sendBackComment.trim()) {
      updateSelected((application) =>
        addAudit(application, `Send-back attempt blocked. Structured reason and reviewer comments are required.`)
      );
      return;
    }

    updateSelected((application) =>
      addAudit(
        {
          ...application,
          status: "Sent Back",
          sendBackReasons,
          sendBackComment: sendBackComment.trim()
        },
        `Sent back to ${application.assignedAgent} by ${reviewerName}. Reasons: ${sendBackReasons.join(", ")}.`
      )
    );
    setAgentHandoff(`${selectedApplication.merchantName} is now visible in ${selectedApplication.assignedAgent}'s Sent Back queue.`);
    setSendBackReasons([]);
    setSendBackComment("");
  };

  const updateChecklistComment = (itemId: string, comment: string) => {
    updateSelected((application) => ({
      ...application,
      checklist: application.checklist.map((item) => (item.id === itemId ? { ...item, reviewerComment: comment } : item))
    }));
  };

  const waiveItem = (itemId: string) => {
    const reason = waiverReasons[itemId]?.trim();

    if (!canWaive || !reason) {
      updateSelected((application) =>
        addAudit(application, !canWaive ? "Waiver attempt blocked. Reviewer is not authorized." : "Waiver attempt blocked. Reason is required.")
      );
      return;
    }

    updateSelected((application) =>
      addAudit(
        {
          ...application,
          checklist: application.checklist.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "waived",
                  waiver: {
                    reason,
                    approvedBy: reviewerName,
                    approvedAt: new Date().toLocaleString("en-IN")
                  }
                }
              : item
          ),
          blockedItems: []
        },
        `Policy waiver approved by ${reviewerName}.`
      )
    );
    setWaiverReasons((current) => ({ ...current, [itemId]: "" }));
  };

  const toggleSendBackReason = (reason: string) => {
    setSendBackReasons((current) => (current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviewer console"
        description="Review merchant applications, apply approval guardrails, issue audit-safe waivers, and route send-backs."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ReviewMetric label="Ready for review" value={queueSummary.ready} />
        <ReviewMetric label="Sent back" value={queueSummary.sentBack} />
        <ReviewMetric label="Approved" value={queueSummary.approved} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Application queue</CardTitle>
            <CardDescription>Select a merchant application to review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => {
                  setSelectedId(application.id);
                  setAgentHandoff(null);
                }}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/60",
                  application.id === selectedApplication.id && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{application.merchantName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {application.id} · {application.category} · {application.ageing}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3" />
                  {getApprovalBlockers(application).length} approval blockers
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{selectedApplication.merchantName}</CardTitle>
                  <CardDescription>
                    {selectedApplication.id} · {selectedApplication.category} · assigned agent {selectedApplication.assignedAgent}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedApplication.status} />
                  <RiskBadge risk={selectedApplication.risk} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedApplication.blockedItems.length > 0 ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <XCircle className="size-4" />
                    Approval blocked
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {selectedApplication.blockedItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="grid gap-3">
                {selectedApplication.checklist.map((item) => (
                  <ChecklistReviewItem
                    key={item.id}
                    item={item}
                    canWaive={canWaive}
                    waiverReason={waiverReasons[item.id] ?? ""}
                    setWaiverReason={(reason) => setWaiverReasons((current) => ({ ...current, [item.id]: reason }))}
                    onWaive={() => waiveItem(item.id)}
                    onComment={(comment) => updateChecklistComment(item.id, comment)}
                  />
                ))}
              </div>

              <div className="grid gap-2 md:grid-cols-4">
                <Button onClick={approve}>
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
                <Button variant="destructive" onClick={reject}>
                  <Ban className="size-4" />
                  Reject
                </Button>
                <Button variant="outline" onClick={withdraw}>
                  <Undo2 className="size-4" />
                  Withdraw
                </Button>
                <Button variant="outline" onClick={() => updateSelected((application) => addAudit({ ...application, status: "In Review" }, `Review resumed by ${reviewerName}.`))}>
                  <RotateCcw className="size-4" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send back to operations</CardTitle>
              <CardDescription>Select structured reasons and add reviewer comments for the assigned agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {sendBackReasonOptions.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => toggleSendBackReason(reason)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      sendBackReasons.includes(reason)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <textarea
                value={sendBackComment}
                onChange={(event) => setSendBackComment(event.target.value)}
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Tell operations exactly what needs to be fixed."
              />
              <Button onClick={sendBack}>
                <FileWarning className="size-4" />
                Send back
              </Button>
              {agentHandoff ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{agentHandoff}</div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit trail</CardTitle>
              <CardDescription>Blocked attempts, waivers, send-backs, and final decisions are recorded here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedApplication.audit.map((event) => (
                <div key={event} className="rounded-md border bg-muted/30 p-3 text-sm">
                  {event}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChecklistReviewItem({
  item,
  canWaive,
  waiverReason,
  setWaiverReason,
  onWaive,
  onComment
}: {
  item: ChecklistItem;
  canWaive: boolean;
  waiverReason: string;
  setWaiverReason: (reason: string) => void;
  onWaive: () => void;
  onComment: (comment: string) => void;
}) {
  const canShowWaiver = item.mandatory && item.status !== "verified" && item.status !== "waived";

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <FileCheck2 className="size-4 text-primary" />
            <h3 className="font-semibold">{item.title}</h3>
            <CheckStatusBadge status={item.status} />
            <Badge variant={item.mandatory ? "secondary" : "muted"}>{item.mandatory ? "Mandatory" : "Optional"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{item.documentName ?? "No document uploaded"}</p>
          {item.waiver ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Waived by {item.waiver.approvedBy} on {item.waiver.approvedAt}: {item.waiver.reason}
            </div>
          ) : null}
        </div>
        <div className="w-full space-y-2 lg:max-w-md">
          <Label htmlFor={`${item.id}-comment`}>Checklist comment</Label>
          <Input
            id={`${item.id}-comment`}
            value={item.reviewerComment ?? ""}
            onChange={(event) => onComment(event.target.value)}
            placeholder="Add checklist-level reviewer note"
          />
          {canShowWaiver ? (
            <div className="space-y-2 rounded-md border bg-muted/30 p-3">
              <Label htmlFor={`${item.id}-waiver`}>Waiver reason</Label>
              <Input
                id={`${item.id}-waiver`}
                value={waiverReason}
                onChange={(event) => setWaiverReason(event.target.value)}
                placeholder="Mandatory reason for audit"
                disabled={!canWaive}
              />
              <Button size="sm" variant="outline" onClick={onWaive} disabled={!canWaive}>
                <ClipboardList className="size-4" />
                Approve waiver
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReviewMetric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const tone =
    status === "Approved"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "Rejected" || status === "Withdrawn"
        ? "border-red-200 bg-red-50 text-red-700"
        : status === "Sent Back"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-blue-200 bg-blue-50 text-blue-700";

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function RiskBadge({ risk }: { risk: ReviewApplication["risk"] }) {
  const tone =
    risk === "High"
      ? "border-red-200 bg-red-50 text-red-700"
      : risk === "Medium"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-green-200 bg-green-50 text-green-700";

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{risk} risk</span>;
}

function CheckStatusBadge({ status }: { status: CheckStatus }) {
  const tone =
    status === "verified" || status === "waived"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "failed"
        ? "border-red-200 bg-red-50 text-red-700"
        : status === "uploaded"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{statusLabel(status)}</span>;
}

function statusLabel(status: CheckStatus) {
  const labels: Record<CheckStatus, string> = {
    verified: "Verified",
    uploaded: "Uploaded",
    failed: "Failed",
    missing: "Missing",
    waived: "Waived"
  };

  return labels[status];
}
