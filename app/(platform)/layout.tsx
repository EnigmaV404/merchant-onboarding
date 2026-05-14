import { ApplicationShell } from "@/components/layout/application-shell";

export default function PlatformLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApplicationShell>{children}</ApplicationShell>;
}
