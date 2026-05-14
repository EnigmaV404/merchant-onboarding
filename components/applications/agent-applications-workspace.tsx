"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MerchantApplicationDraft, NewMerchantApplicationWizard } from "@/components/applications/new-merchant-application-wizard";

export function AgentApplicationsWorkspace({ uploaderName }: { uploaderName: string }) {
  const [lastSubmission, setLastSubmission] = useState<MerchantApplicationDraft | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations applications"
        description="Create a new merchant application and submit it into standard verification or exception review."
      />

      <NewMerchantApplicationWizard uploaderName={uploaderName} onSubmit={setLastSubmission} />

      {lastSubmission ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {lastSubmission.merchantName} was submitted for{" "}
          {lastSubmission.submissionMode === "exception" ? "exception review" : "standard verification"}.
        </div>
      ) : null}
    </div>
  );
}
