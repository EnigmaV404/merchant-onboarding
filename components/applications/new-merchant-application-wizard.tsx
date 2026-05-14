"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Loader2,
  Plus,
  Tag,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MerchantCategory } from "@/types/domain";
import { cn } from "@/lib/utils";

type WizardDocument = {
  id: string;
  title: string;
  mandatory: boolean;
  tags: string[];
  fileName?: string;
};

export type MerchantApplicationDraft = {
  merchantName: string;
  displayName: string;
  category: MerchantCategory;
  documents: WizardDocument[];
  submissionMode: "standard" | "exception";
  exceptionComment?: string;
};

type WizardStep = {
  id: number;
  title: string;
  icon: React.ElementType;
};

const wizardSteps: WizardStep[] = [
  { id: 1, title: "Merchant Details", icon: Building2 },
  { id: 2, title: "Documents", icon: ClipboardCheck },
  { id: 3, title: "Review & Submit", icon: CheckCircle2 }
];

const categoryLabels: Record<MerchantCategory, string> = {
  RETAIL: "Retail",
  FOOD_AND_BEVERAGE: "Food & Beverage",
  DIGITAL_SERVICES: "Digital Services"
};

const categoryDocuments: Record<MerchantCategory, Array<Omit<WizardDocument, "tags" | "fileName">>> = {
  RETAIL: [
    { id: "pan", title: "PAN Card", mandatory: true },
    { id: "gst", title: "GST Certificate", mandatory: true },
    { id: "store-photo", title: "Store Front Photo", mandatory: true },
    { id: "bank", title: "Bank Statement", mandatory: false }
  ],
  FOOD_AND_BEVERAGE: [
    { id: "pan", title: "PAN Card", mandatory: true },
    { id: "fssai", title: "FSSAI License", mandatory: true },
    { id: "outlet-photo", title: "Outlet Front Photo", mandatory: true },
    { id: "bank", title: "Bank Statement", mandatory: true },
    { id: "fire-noc", title: "Fire NOC", mandatory: false }
  ],
  DIGITAL_SERVICES: [
    { id: "pan", title: "PAN Card", mandatory: true },
    { id: "website", title: "Website / App Proof", mandatory: true },
    { id: "service-declaration", title: "Service Category Declaration", mandatory: true },
    { id: "bank", title: "Bank Statement", mandatory: true }
  ]
};

const documentTags = ["Identity", "Tax", "Address", "Banking", "License", "Digital Presence"];

export function NewMerchantApplicationWizard({
  uploaderName,
  onSubmit
}: {
  uploaderName: string;
  onSubmit: (draft: MerchantApplicationDraft) => void;
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    legalName: "",
    displayName: "",
    category: "RETAIL" as MerchantCategory,
    jurisdiction: "",
    beneficialOwner: "",
    email: "",
    phone: "",
    description: ""
  });
  const [documents, setDocuments] = useState<Record<string, WizardDocument>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [exceptionComment, setExceptionComment] = useState("");
  const [submissionMode, setSubmissionMode] = useState<"standard" | "exception">("standard");

  const requiredDocuments = useMemo(
    () =>
      categoryDocuments[form.category].map((document) => ({
        ...document,
        tags: documents[document.id]?.tags ?? [defaultTagForDocument(document.id)],
        fileName: documents[document.id]?.fileName
      })),
    [documents, form.category]
  );

  const missingRequiredDocs = requiredDocuments.filter((document) => document.mandatory && !document.fileName);
  const missingMandatoryFields = getMissingMandatoryFields(form);
  const submissionBlockers = [...missingMandatoryFields, ...missingRequiredDocs.map((document) => `${document.title} document is required`)];
  const canStandardSubmit = submissionBlockers.length === 0;
  const canExceptionSubmit = submissionBlockers.length > 0 && exceptionComment.trim().length > 0;

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateDocument = (document: WizardDocument, update: Partial<WizardDocument>) => {
    setDocuments((current) => ({
      ...current,
      [document.id]: {
        ...document,
        ...current[document.id],
        ...update
      }
    }));
  };

  const submitApplication = () => {
    setSubmitAttempted(true);

    if (submissionMode === "standard" && !canStandardSubmit) {
      return;
    }

    if (submissionMode === "exception" && !canExceptionSubmit) {
      return;
    }

    onSubmit({
      merchantName: form.legalName,
      displayName: form.displayName,
      category: form.category,
      documents: requiredDocuments,
      submissionMode,
      exceptionComment: submissionMode === "exception" ? exceptionComment.trim() : undefined
    });
    setSubmitted(true);
  };

  return (
    <section className="rounded-lg border bg-[#f8fafc] p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Intake</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">New merchant application</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Capture merchant details and documents — application enters the verification pipeline on submit.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-muted px-3 py-1 text-sm uppercase tracking-wide">
          {categoryLabels[form.category]}
        </Badge>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-4">
        {wizardSteps.map((item) => {
          const Icon = item.icon;
          const isActive = step === item.id;
          const isComplete = step > item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={cn(
                "flex h-14 items-center gap-3 rounded-lg border bg-white px-4 text-left text-sm font-semibold text-muted-foreground shadow-sm transition-colors",
                isActive && "border-primary bg-primary/5 text-slate-950 ring-1 ring-primary",
                isComplete && "text-slate-950"
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && "bg-green-600 text-white"
                )}
              >
                {isComplete ? <CheckCircle2 className="size-4" /> : item.id}
              </span>
              <Icon className="size-4" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      <Card className="mt-6 min-h-[520px] border-slate-200 shadow-sm">
        <CardContent className="p-8">
          {step === 1 ? (
            <BasicDetailsStep form={form} updateForm={updateForm} />
          ) : step === 2 ? (
            <DocumentsStep
              documents={requiredDocuments}
              uploaderName={uploaderName}
              updateDocument={updateDocument}
            />
          ) : (
            <ReviewStep
              form={form}
              documents={requiredDocuments}
              missingRequiredDocs={missingRequiredDocs}
              submissionBlockers={submissionBlockers}
              submitAttempted={submitAttempted}
              submitted={submitted}
              submissionMode={submissionMode}
              setSubmissionMode={setSubmissionMode}
              exceptionComment={exceptionComment}
              setExceptionComment={setExceptionComment}
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-3 items-center">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} className="w-fit">
          Back
        </Button>
        <p className="text-center text-sm font-medium text-muted-foreground">Step {step} of 3</p>
        <div className="flex justify-end">
          {step < 3 ? (
            <Button onClick={() => setStep((current) => Math.min(3, current + 1))}>
              Continue
              <span aria-hidden>→</span>
            </Button>
          ) : (
            <Button disabled={submitted} onClick={submitApplication}>
              {submitted ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Submitted
                </>
              ) : (
                <>
                  Submit application
                  <span aria-hidden>→</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function BasicDetailsStep({
  form,
  updateForm
}: {
  form: Record<string, string>;
  updateForm: (key: keyof NewMerchantApplicationWizardForm, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading title="Merchant details" description="Captured from the partner portal or entered manually by the agent." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Legal entity name" required>
          <Input value={form.legalName} onChange={(event) => updateForm("legalName", event.target.value)} placeholder="e.g. Velvet & Vine LLC" />
        </Field>
        <Field label="Trading / DBA name">
          <Input value={form.displayName} onChange={(event) => updateForm("displayName", event.target.value)} placeholder="e.g. Velvet & Vine" />
        </Field>
        <Field label="Category" required>
          <div className="grid gap-2 md:grid-cols-3">
            {Object.entries(categoryLabels).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={form.category === value ? "default" : "outline"}
                className={cn("h-12", form.category === value && "bg-primary/10 text-primary hover:bg-primary/15")}
                onClick={() => updateForm("category", value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Field>
        <Field label="Jurisdiction" required>
          <Input value={form.jurisdiction} onChange={(event) => updateForm("jurisdiction", event.target.value)} placeholder="City, Country" />
        </Field>
        <Field label="Ultimate beneficial owner" required>
          <Input value={form.beneficialOwner} onChange={(event) => updateForm("beneficialOwner", event.target.value)} placeholder="Full legal name" />
        </Field>
        <Field label="Contact email" required>
          <Input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="ops@merchant.com" />
        </Field>
        <Field label="Contact phone">
          <Input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+1 555 0100" />
        </Field>
      </div>
      <Field label="Business description">
        <textarea
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          placeholder="Short description of operating model, locations, channels."
          className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-3 text-sm"
        />
      </Field>
    </div>
  );
}

type NewMerchantApplicationWizardForm = {
  legalName: string;
  displayName: string;
  category: string;
  jurisdiction: string;
  beneficialOwner: string;
  email: string;
  phone: string;
  description: string;
};

function DocumentsStep({
  documents,
  uploaderName,
  updateDocument
}: {
  documents: WizardDocument[];
  uploaderName: string;
  updateDocument: (document: WizardDocument, update: Partial<WizardDocument>) => void;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading title="Documents upload and tagging" description="Upload each proof against a checklist item and tag it before verification." />
      <div className="grid gap-4">
        {documents.map((document) => (
          <div key={document.id} className="grid gap-4 rounded-lg border bg-white p-4 lg:grid-cols-[1fr_220px_260px] lg:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h3 className="font-semibold">{document.title}</h3>
                <Badge variant={document.mandatory ? "secondary" : "muted"}>{document.mandatory ? "Mandatory" : "Optional"}</Badge>
                {document.fileName ? <Badge variant="outline">Uploaded</Badge> : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {document.fileName ? `${document.fileName} · uploaded by ${uploaderName}` : "Waiting for upload."}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <Tag className="size-3" />
                Tags
              </Label>
              <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-md border border-input bg-background p-2">
                {documentTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDocumentTag(document, tag, updateDocument)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      document.tags.includes(tag)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {!document.tags.includes(tag) ? <Plus className="size-3" /> : null}
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`wizard-${document.id}`} className="sr-only">
                Upload {document.title}
              </Label>
              <Input
                id={`wizard-${document.id}`}
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) updateDocument(document, { fileName: file.name });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  documents,
  missingRequiredDocs,
  submissionBlockers,
  submitAttempted,
  submitted,
  submissionMode,
  setSubmissionMode,
  exceptionComment,
  setExceptionComment
}: {
  form: Record<string, string>;
  documents: WizardDocument[];
  missingRequiredDocs: WizardDocument[];
  submissionBlockers: string[];
  submitAttempted: boolean;
  submitted: boolean;
  submissionMode: "standard" | "exception";
  setSubmissionMode: (mode: "standard" | "exception") => void;
  exceptionComment: string;
  setExceptionComment: (comment: string) => void;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading title="Review and submit" description="Confirm the intake package before moving the application into verification." />
      <div className="grid gap-4 xl:grid-cols-2">
        <SummaryPanel title="Merchant">
          <SummaryLine label="Legal entity" value={form.legalName || "Not captured"} />
          <SummaryLine label="DBA" value={form.displayName || "Not captured"} />
          <SummaryLine label="Category" value={categoryLabels[form.category as MerchantCategory]} />
          <SummaryLine label="Jurisdiction" value={form.jurisdiction || "Not captured"} />
        </SummaryPanel>
        <SummaryPanel title="Documents">
          <SummaryLine label="Uploaded" value={`${documents.filter((document) => document.fileName).length}/${documents.length}`} />
          <SummaryLine label="Missing mandatory" value={`${missingRequiredDocs.length}`} />
          <SummaryLine label="Submission mode" value={submissionMode === "exception" ? "Exception review" : "Standard review"} />
        </SummaryPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-start gap-3">
            {submissionBlockers.length > 0 ? (
              <XCircle className="mt-1 size-5 text-red-600" />
            ) : (
              <CheckCircle2 className="mt-1 size-5 text-green-600" />
            )}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Submit application guardrails</h4>
                <p className="text-sm text-muted-foreground">
                  Mandatory fields and required documents are checked when the application is submitted.
                </p>
              </div>
              {submissionBlockers.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                  {submissionBlockers.map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  All mandatory fields and required documents are present.
                </div>
              )}
              {submitAttempted && submissionBlockers.length > 0 && submissionMode === "standard" ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  Standard submission is blocked until the listed guardrails are cleared.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 size-5 text-amber-600" />
            <div className="w-full space-y-3">
              <div>
                <h4 className="font-semibold">Exception flow</h4>
                <p className="text-sm text-muted-foreground">
                  Route incomplete or edge-case applications to manual review with mandatory operations comments.
                </p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <Button
                  type="button"
                  variant={submissionMode === "standard" ? "default" : "outline"}
                  onClick={() => setSubmissionMode("standard")}
                >
                  Standard submit
                </Button>
                <Button
                  type="button"
                  variant={submissionMode === "exception" ? "default" : "outline"}
                  onClick={() => setSubmissionMode("exception")}
                >
                  Exception review
                </Button>
              </div>
              {submissionMode === "exception" ? (
                <textarea
                  value={exceptionComment}
                  onChange={(event) => setExceptionComment(event.target.value)}
                  placeholder="Explain why this case should move to manual review despite missing or failed requirements."
                  className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-3 text-sm"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="size-4" />
          Application submitted to {submissionMode === "exception" ? "exception review" : "verification pipeline"}.
        </div>
      ) : submitAttempted && submissionMode === "exception" && exceptionComment.trim().length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Loader2 className="size-4" />
          Add an exception comment before routing this case to manual review.
        </div>
      ) : null}
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-normal">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function SummaryPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function defaultTagForDocument(id: string) {
  if (id.includes("pan")) return "Identity";
  if (id.includes("gst")) return "Tax";
  if (id.includes("bank")) return "Banking";
  if (id.includes("fssai") || id.includes("noc")) return "License";
  if (id.includes("website")) return "Digital Presence";
  return "Address";
}

function toggleDocumentTag(
  document: WizardDocument,
  tag: string,
  updateDocument: (document: WizardDocument, update: Partial<WizardDocument>) => void
) {
  const nextTags = document.tags.includes(tag)
    ? document.tags.filter((currentTag) => currentTag !== tag)
    : [...document.tags, tag];

  updateDocument(document, { tags: nextTags.length > 0 ? nextTags : [defaultTagForDocument(document.id)] });
}

function getMissingMandatoryFields(form: NewMerchantApplicationWizardForm) {
  const requiredFields: Array<[keyof NewMerchantApplicationWizardForm, string]> = [
    ["legalName", "Legal entity name is required"],
    ["category", "Merchant category is required"],
    ["jurisdiction", "Jurisdiction is required"],
    ["beneficialOwner", "Ultimate beneficial owner is required"],
    ["email", "Contact email is required"]
  ];

  return requiredFields.filter(([key]) => !form[key]?.trim()).map(([, message]) => message);
}
