import { NextRequest, NextResponse } from "next/server";
import { sendTextMessage } from "@/utils/Notifications/sendTextMessage";

export async function POST(request: NextRequest) {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { to, message, from } = body;

  if (!to || !message) {
    return NextResponse.json(
      { error: "Missing required fields: to, message" },
      { status: 400 },
    );
  }

  const result = await sendTextMessage({ to, message, from });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Failed to send text message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
