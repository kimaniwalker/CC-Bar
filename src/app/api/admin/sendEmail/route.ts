import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/Notifications/sendEmail";
import { reservationEmailTemplate } from "@/utils/Notifications/reservationEmailTemplate";

export async function POST(request: NextRequest) {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { to, subject, from, text, type, reservation } = body;

  // Build HTML from template or accept raw html
  let html: string = body.html;

  if (type === "reservation") {
    if (
      !reservation?.name ||
      !reservation?.date ||
      !reservation?.time ||
      !reservation?.guests
    ) {
      return NextResponse.json(
        { error: "Missing reservation fields: name, date, time, guests" },
        { status: 400 },
      );
    }
    html = reservationEmailTemplate({
      name: reservation.name,
      date: reservation.date,
      time: reservation.time,
      guests: Number(reservation.guests),
      isReminder: reservation.isReminder ?? false,
    });
  }

  if (!to || !subject || !html) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: to, subject, and either html or type+reservation",
      },
      { status: 400 },
    );
  }

  try {
    await sendEmail({ to, subject, html, text, from });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
