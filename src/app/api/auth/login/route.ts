import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAuthToken, getAuthCookieConfig, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const role = password ? verifyPassword(password) : null;

    if (!role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createAuthToken(role);
    const cookieStore = await cookies();
    cookieStore.set(getAuthCookieConfig(token));

    return NextResponse.json({ success: true, role });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
