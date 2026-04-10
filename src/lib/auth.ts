import { cookies } from "next/headers";

const COOKIE_NAME = "vmr_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type UserRole = "member" | "admin";

function getMemberPassword(): string {
  return process.env.AUTH_PASSWORD ?? "cps-vmr-local";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "cps-vmr-admin";
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

/** Returns the role for the given password, or null if invalid. */
export function verifyPassword(password: string): UserRole | null {
  if (password === getAdminPassword()) return "admin";
  if (password === getMemberPassword()) return "member";
  return null;
}

/** Create a signed token encoding the role: `ts.role.sig` */
export async function createAuthToken(role: UserRole): Promise<string> {
  const ts = Date.now().toString();
  const payload = `${ts}.${role}`;
  const sig = await hmacSign(payload, getAuthSecret());
  return `${payload}.${sig}`;
}

/** Validate token and return the role, or null if invalid/expired. */
export async function validateAuthToken(token: string): Promise<UserRole | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [ts, role, sig] = parts;
  if (!ts || !role || !sig) return null;
  if (role !== "member" && role !== "admin") return null;

  const age = Date.now() - Number(ts);
  if (Number.isNaN(age) || age > COOKIE_MAX_AGE * 1000) return null;

  const expectedSig = await hmacSign(`${ts}.${role}`, getAuthSecret());
  if (sig !== expectedSig) return null;

  return role as UserRole;
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

/** Returns the role if the request is authenticated, or null if not. */
export async function getSessionRole(): Promise<UserRole | null> {
  if (!process.env.AUTH_PASSWORD) return "admin"; // dev shortcut: no password set = full access
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return validateAuthToken(token);
}

/** Returns true if authenticated (any role). Used in API routes. */
export async function requireInternalAccess(): Promise<boolean> {
  const role = await getSessionRole();
  return role !== null;
}

/** Returns true if authenticated as admin. Used in admin API routes. */
export async function requireAdminAccess(): Promise<boolean> {
  const role = await getSessionRole();
  return role === "admin";
}

export { COOKIE_NAME };
