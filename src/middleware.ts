import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "vmr_auth";
const PUBLIC_PATHS = ["/vmr", "/login", "/api/auth", "/uploads", "/_next", "/favicon", "/cps-logo"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname === "/") {
    return NextResponse.next();
  }

  // Skip auth if no password is configured (local dev convenience)
  if (!process.env.AUTH_PASSWORD) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate token (HMAC check)
  const [ts, sig] = token.split(".");
  if (!ts || !sig) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const age = Date.now() - Number(ts);
  if (Number.isNaN(age) || age > 30 * 24 * 60 * 60 * 1000) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify HMAC
  const secret = process.env.AUTH_SECRET ?? "dev-secret-change-me";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ts));
  const expectedSig = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (sig !== expectedSig) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|cps-logo.svg).*)",
  ],
};
