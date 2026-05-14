import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileWarning,
  Filter,
  ShieldCheck,
  TrendingUp,
  UploadCloud
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/layout/metric-card";

const agentCases = [
  { merchant: "Blue Nile Retail", category: "Retail", status: "Pending documents", missing: 2, sla: "8h 20m", risk: "Medium" },
  { merchant: "Urban Bites", category: "Food & Beverage", status: "Pending documents", missing: 5, sla: "1d 4h", risk: "Low" },
  { merchant: "Swift Digital Services", category: "Digital Services", status: "Sent back", missing: 1, sla: "4h 10m", risk: "High" },
  { merchant: "Vanguard Electronics", category: "Retail", status: "Ready for review", missing: 0, sla: "2d 1h", risk: "Low" }
];

const reviewerQueue = [
  { merchant: "Blue Nile Retail", category: "Retail", verified: 8, pending: 2, failed: 0, ageing: "14h 22m", severity: "green" },
  { merchant: "Swift Digital Services", category: "SaaS / Enterprise", verified: 12, pending: 0, failed: 3, ageing: "74h 05m", severity: "red" },
  { merchant: "Opal Logistics Inc.", category: "Supply Chain", verified: 4, pending: 5, failed: 1, ageing: "22h 10m", severity: "amber" },
  { merchant: "Aurora Media Group", category: "Advertising / Digital", verified: 2, pending: 8, failed: 4, ageing: "92h 18m", severity: "red" }
];

const leadAgents = [
  { name: "Ankit Sharma", tat: "4.2h", open: 12, closed: 45 },
  { name: "Priya Das", tat: "3.8h", open: 8, closed: 52 },
  { name: "Rahul Roy", tat: "5.1h", open: 15, closed: 38 },
  { name: "Nisha Rao", tat: "4.6h", open: 10, closed: 41 }
];

function StatusPill({ label, tone = "muted" }: { label: string; tone?: "green" | "amber" | "red" | "blue" | "muted" }) {
  const tones = {
    green: "border-green-200 bg-green-50 text-green-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    muted: "border-border bg-muted text-muted-foreground"
  };

  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
}

function OperationalTable({
  headers,
  children
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

function ProgressRow({ label, value, tone }: { label: string; value: number; tone: "green" | "amber" | "red" | "blue" }) {
  const tones = {
    green: "bg-green-600",
    amber: "bg-amber-600",
    red: "bg-red-600",
    blue: "bg-blue-600"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className={`h-2 rounded-full ${tones[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function AgentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Application dashboard"
        description="Assigned merchant files, missing document follow-ups, and cases that need operations action."
        actions={
          <Button asChild>
            <Link href="/applications">
              <UploadCloud className="size-4" />
              New application
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Assigned applications" value="24" trend="7 require action today" />
        <MetricCard label="Missing documents" value="18" trend="PAN and GST are top blockers" />
        <MetricCard label="Ready for review" value="9" trend="All mandatory checks complete" />
        <MetricCard label="Sent back" value="4" trend="Reviewer comments pending" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>My active applications</CardTitle>
            <div className="flex gap-2">
              <Input className="h-9 w-64" placeholder="Search merchant..." />
              <Button variant="outline" size="sm">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OperationalTable headers={["Merchant", "Category", "Status", "Missing", "SLA", "Risk"]}>
              {agentCases.map((item) => (
                <tr key={item.merchant}>
                  <td className="px-4 py-3 font-semibold">{item.merchant}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={item.status} tone={item.status === "Sent back" ? "amber" : item.missing === 0 ? "green" : "blue"} />
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.missing}</td>
                  <td className="px-4 py-3">{item.sla}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={item.risk} tone={item.risk === "High" ? "red" : item.risk === "Medium" ? "amber" : "green"} />
                  </td>
                </tr>
              ))}
            </OperationalTable>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operations alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">3 merchants need reupload before SLA close.</div>
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-800">9 applications are complete enough to submit.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ReviewerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Review queue"
        description="Verification workload, failed checks, breached SLAs, and cases ready for decision."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pending review" value="1,284" trend="Exception and ready-for-review cases" />
        <MetricCard label="SLA breached" value="42" trend="Prioritize before new intake" />
        <MetricCard label="Avg. verification time" value="14m 20s" trend="Across automated checks" />
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Active merchant queue</CardTitle>
          <div className="flex gap-2">
            <Input className="h-9 w-72" placeholder="Search queue..." />
            <Button variant="outline" size="sm">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OperationalTable headers={["Merchant", "Category", "Verified", "Pending", "Failed", "Ageing", "Action"]}>
            {reviewerQueue.map((item) => (
              <tr key={item.merchant}>
                <td className="px-4 py-3 font-semibold">{item.merchant}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3">
                  <StatusPill label={`${item.verified} verified`} tone="green" />
                </td>
                <td className="px-4 py-3">
                  <StatusPill label={`${item.pending} pending`} tone={item.pending > 0 ? "amber" : "green"} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill label={`${item.failed} failed`} tone={item.failed > 0 ? "red" : "green"} />
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${item.severity === "red" ? "bg-red-600" : item.severity === "amber" ? "bg-amber-600" : "bg-green-600"}`} />
                    {item.ageing}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button asChild size="sm">
                    <Link href="/review">Review case</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </OperationalTable>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SLA performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ProgressRow label="Under 24h" value={88} tone="green" />
            <ProgressRow label="24h - 48h" value={9} tone="amber" />
            <ProgressRow label="Breached (>48h)" value={3} tone="red" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Urgent system alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
              <AlertTriangle className="mt-0.5 size-4" />
              TIN verification service latency is affecting automated review.
            </div>
            <div className="flex gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-800">
              <ShieldCheck className="mt-0.5 size-4" />
              42 high-priority cases moved into active review queue.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LeadDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations lead dashboard"
        description="Agent throughput, SLA delay, bottlenecks, send-back reasons, and missing document trends."
        actions={
          <Button>
            <TrendingUp className="size-4" />
            Generate report
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monthly volume" value="612" trend="27 average daily intake" />
        <MetricCard label="Avg. TAT" value="4.4h" trend="Across active agents" />
        <MetricCard label="SLA delay" value="82%" trend="Onboarding is top bottleneck" />
        <MetricCard label="Send-back rate" value="11%" trend="Invalid ID documents dominate" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Agent performance</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="size-4" />
              All agents
            </Button>
          </CardHeader>
          <CardContent>
            <OperationalTable headers={["Agent name", "Avg TAT", "Open cases", "Closed cases"]}>
              {leadAgents.map((agent) => (
                <tr key={agent.name}>
                  <td className="px-4 py-4 font-semibold">{agent.name}</td>
                  <td className="px-4 py-4">{agent.tat}</td>
                  <td className="px-4 py-4">{agent.open}</td>
                  <td className="px-4 py-4">{agent.closed}</td>
                </tr>
              ))}
            </OperationalTable>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bottlenecks & SLA trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ProgressRow label="Onboarding delay" value={82} tone="red" />
            <ProgressRow label="Document submission delay" value={45} tone="amber" />
            <ProgressRow label="Reviewer approval delay" value={12} tone="green" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Missing document trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-6 border-l border-b px-6 pb-4">
              {[
                ["PAN Card", 46],
                ["GST Cert", 82],
                ["Address Proof", 31],
                ["Bank Stat.", 71]
              ].map(([label, value]) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-primary" style={{ height: `${value}%` }} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send-back reasons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <FileWarning className="mt-1 size-4 text-red-600" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Invalid PAN/Aadhaar</span>
                  <span>42%</span>
                </div>
                <ProgressRow label=" " value={42} tone="red" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 size-4 text-blue-600" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Blurry image documents</span>
                  <span>28%</span>
                </div>
                <ProgressRow label=" " value={28} tone="blue" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="size-4" />
              System normal. Uptime 99.98%.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
