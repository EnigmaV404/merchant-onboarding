import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/applications", "/review", "/exceptions", "/analytics", "/admin"];

export function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Auth enforcement will be connected when the real identity provider is selected.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
