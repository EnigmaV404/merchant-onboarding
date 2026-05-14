import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {trend ? <p className="mt-2 text-xs text-muted-foreground">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
