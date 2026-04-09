import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAuthToken, getAuthCookieConfig, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      );
    }

    const token = await createAuthToken();
    const cookieStore = await cookies();
    const config = getAuthCookieConfig(token);
    cookieStore.set(config);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 },
    );
  }
}
