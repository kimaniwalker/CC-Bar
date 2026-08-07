"use server";

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = "support@candlecowbar.com",
}: SendEmailParams) {
  try {
    await sgMail.send({
      to,
      cc: [
        "kimaniwalker@gmail.com",
        "support@candlecowbar.com",
        "candlecow@outlook.com",
      ],
      from,
      subject,
      html,
      text: text ?? html.replace(/<[^>]*>/g, ""), // ✅ fallback plain text
    });

    console.log(`Email sent to ${to} with subject "${subject}"`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to send email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
