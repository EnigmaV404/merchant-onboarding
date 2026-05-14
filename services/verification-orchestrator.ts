export type VerificationJobInput = {
  applicationId: string;
  documentId?: string;
  serviceName: string;
};

export type VerificationJobResult = {
  status: "queued";
  jobId: string;
};

export async function enqueueVerificationJob(input: VerificationJobInput): Promise<VerificationJobResult> {
  return {
    status: "queued",
    jobId: `${input.serviceName}:${input.applicationId}:${input.documentId ?? "application"}`
  };
}
