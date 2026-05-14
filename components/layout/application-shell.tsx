import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";
import { appConfig } from "@/config/app";
import { platformNavigation } from "@/config/navigation";
import { hasPermission } from "@/lib/auth/rbac";
import { getCurrentSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShellNavLink } from "@/components/layout/shell-nav-link";

export async function ApplicationShell({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  const visibleNav = platformNavigation.filter((item) => !item.permission || hasPermission(session.user.role, item.permission));

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-active/40 bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <Link href="/dashboard" className="block">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">FastLend</p>
            <h1 className="mt-1 text-lg font-semibold leading-tight">{appConfig.name}</h1>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNav.map((item) => (
            <ShellNavLink key={item.href} item={item} />
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="rounded-md bg-white/8 p-3">
            <p className="text-sm font-medium">{session.user.name}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-xs text-white/65">{session.user.email}</span>
              <Badge variant="secondary">{session.user.title}</Badge>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search applications, merchants, documents" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button asChild variant="outline" size="icon" aria-label="Switch profile">
              <Link href="/login">
                <LogOut className="size-4" />
              </Link>
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
