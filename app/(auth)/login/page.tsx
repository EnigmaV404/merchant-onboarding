import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProfiles } from "@/lib/auth/mock-users";

const loginCards = [
  {
    profile: mockProfiles.agent,
    icon: ClipboardList,
    href: "/api/auth/mock?profile=agent" as Route,
    signals: ["Assigned cases", "Missing documents", "Submit validation"]
  },
  {
    profile: mockProfiles.reviewer,
    icon: ShieldCheck,
    href: "/api/auth/mock?profile=reviewer" as Route,
    signals: ["Pending review", "Failed checks", "SLA breached"]
  },
  {
    profile: mockProfiles.lead,
    icon: Gauge,
    href: "/api/auth/mock?profile=lead" as Route,
    signals: ["Agent performance", "SLA trends", "Bottlenecks"]
  }
];

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">FastLend operations</p>
        <h1 className="text-3xl font-semibold tracking-normal">Choose a mock login</h1>
        <p className="text-sm text-muted-foreground">
          Each profile opens a different role-based landing dashboard for onboarding operations.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {loginCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.profile.profileId} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle>{item.profile.title}</CardTitle>
                  <CardDescription className="mt-2 min-h-12">{item.profile.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {item.signals.map((signal) => (
                    <div key={signal} className="flex items-center justify-between border-b py-2 last:border-b-0">
                      <span className="text-muted-foreground">{signal}</span>
                      <span className="font-medium">Visible</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <Link href={item.href}>
                    Login as {item.profile.title}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
