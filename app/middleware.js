import { NextResponse } from "next/server";

const DASHBOARD_ROOTS = ["/teacher", "/principal"];

const parseRole = (cookieStore) => {
  return cookieStore.get("role")?.value || "";
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/live")
  ) {
    return NextResponse.next();
  }

  const hasProtectedPrefix = DASHBOARD_ROOTS.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const token = request.cookies.get("token")?.value;
  const role = parseRole(request.cookies);

  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && hasProtectedPrefix) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    const redirectPath = role === "principal" ? "/principal/dashboard" : "/teacher/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (token && pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/principal/dashboard", request.url));
  }

  if (token && pathname.startsWith("/principal") && role !== "principal") {
    return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
