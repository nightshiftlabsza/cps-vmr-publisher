import { cookies } from "next/headers";

const COOKIE_NAME = "vmr_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getAuthPassword(): string {
  return process.env.AUTH_PASSWORD ?? "cps-vmr-local";
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret-change-me";
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAuthToken(): Promise<string> {
  const ts = Date.now().toString();
  const sig = await hmacSign(ts, getAuthSecret());
  return `${ts}.${sig}`;
}

export async function validateAuthToken(token: string): Promise<boolean> {
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;

  // Token older than 30 days
  const age = Date.now() - Number(ts);
  if (Number.isNaN(age) || age > COOKIE_MAX_AGE * 1000) return false;

  const expectedSig = await hmacSign(ts, getAuthSecret());
  return sig === expectedSig;
}

export function verifyPassword(password: string): boolean {
  return password === getAuthPassword();
}

export function getAuthCookieConfig(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function getClearAuthCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

/** Check auth cookie — use in API routes. Returns true if valid. */
export async function requireInternalAccess(): Promise<boolean> {
  // Skip auth in development if no password is configured
  if (!process.env.AUTH_PASSWORD) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validateAuthToken(token);
}

export { COOKIE_NAME };
