import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getClearAuthCookieConfig } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getClearAuthCookieConfig());

  return NextResponse.redirect(new URL("/login", process.env.APP_BASE_URL ?? "http://localhost:3000"));
}
