"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createXlsxBlob } from "@/lib/xlsx";

type MerchantReportRow = {
  applicationId: string;
  legalName: string;
  tradingName: string;
  category: string;
  jurisdiction: string;
  ubo: string;
  contactEmail: string;
  contactPhone: string;
  applicationStatus: string;
  submittedAt: string;
};

const reportRows: MerchantReportRow[] = [
  {
    applicationId: "APP-1042",
    legalName: "Blue Nile Retail Pvt Ltd",
    tradingName: "Blue Nile Retail",
    category: "Retail",
    jurisdiction: "Bengaluru, India",
    ubo: "Mahesh Rao",
    contactEmail: "ops@bluenile.example",
    contactPhone: "+91 98765 43210",
    applicationStatus: "Pending Documents",
    submittedAt: "2026-05-10"
  },
  {
    applicationId: "APP-1054",
    legalName: "Vanguard Electronics LLP",
    tradingName: "Vanguard Electronics",
    category: "Retail",
    jurisdiction: "Mumbai, India",
    ubo: "Ira Menon",
    contactEmail: "compliance@vanguard.example",
    contactPhone: "+91 99887 76655",
    applicationStatus: "Approved",
    submittedAt: "2026-05-12"
  },
  {
    applicationId: "APP-1060",
    legalName: "Urban Bites Foods Private Limited",
    tradingName: "Urban Bites",
    category: "Food & Beverage",
    jurisdiction: "Pune, India",
    ubo: "Kabir Sethi",
    contactEmail: "finance@urbanbites.example",
    contactPhone: "+91 91234 56780",
    applicationStatus: "Sent Back",
    submittedAt: "2026-05-14"
  },
  {
    applicationId: "APP-1071",
    legalName: "Swift Digital Services Private Limited",
    tradingName: "Swift Digital",
    category: "Digital Services",
    jurisdiction: "Hyderabad, India",
    ubo: "Ananya Shah",
    contactEmail: "ops@swiftdigital.example",
    contactPhone: "+91 90000 11223",
    applicationStatus: "Exception Review Required",
    submittedAt: "2026-05-15"
  },
  {
    applicationId: "APP-1088",
    legalName: "Opal Logistics Incorporated",
    tradingName: "Opal Logistics",
    category: "Digital Services",
    jurisdiction: "Delhi, India",
    ubo: "Rohan Khanna",
    contactEmail: "admin@opal.example",
    contactPhone: "+91 95555 44110",
    applicationStatus: "Rejected",
    submittedAt: "2026-05-08"
  }
];

const statusOptions = Array.from(new Set(reportRows.map((row) => row.applicationStatus)));
const previewColumns: Array<[keyof MerchantReportRow, string]> = [
  ["applicationId", "Application ID"],
  ["legalName", "Legal Name"],
  ["tradingName", "Trading Name"],
  ["category", "Category"],
  ["jurisdiction", "Jurisdiction"],
  ["ubo", "UBO"],
  ["contactEmail", "Contact Email"],
  ["contactPhone", "Contact Phone"],
  ["applicationStatus", "Application Status"]
];

export function ReportsWorkspace({ canExport }: { canExport: boolean }) {
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-15");
  const [status, setStatus] = useState("ALL");

  const filteredRows = useMemo(
    () =>
      reportRows.filter((row) => {
        const withinStart = !startDate || row.submittedAt >= startDate;
        const withinEnd = !endDate || row.submittedAt <= endDate;
        const statusMatches = status === "ALL" || row.applicationStatus === status;
        return withinStart && withinEnd && statusMatches;
      }),
    [endDate, startDate, status]
  );

  const downloadReport = () => {
    const header = previewColumns.map(([, label]) => label);
    const rows = filteredRows.map((row) => previewColumns.map(([key]) => row[key]));
    const blob = createXlsxBlob("Merchant Requests", [header, ...rows]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merchant-requests-${startDate || "all"}-${endDate || "all"}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Preview and download merchant requests with their latest onboarding status."
        actions={
          <Button onClick={downloadReport} disabled={!canExport || filteredRows.length === 0}>
            <Download className="size-4" />
            Download XLSX
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Report filters</CardTitle>
          <CardDescription>Start with date selection. Status is optional.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start date</Label>
            <Input id="start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End date</Label>
            <Input id="end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <select
              id="status-filter"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            <Filter className="size-4" />
            {filteredRows.length} rows
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Preview</CardTitle>
            <CardDescription>The downloaded file uses the same filtered data.</CardDescription>
          </div>
          <Badge variant="outline" className="gap-2">
            <Eye className="size-3" />
            Data preview
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {previewColumns.map(([, label]) => (
                    <th key={label} className="px-4 py-3 text-left font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRows.map((row) => (
                  <tr key={row.applicationId}>
                    {previewColumns.map(([key]) => (
                      <td key={key} className="px-4 py-3">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredRows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={previewColumns.length}>
                      No merchant requests match the selected filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
