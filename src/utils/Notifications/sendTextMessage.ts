"use server";

import twilio from "twilio";

type SendTextMessageParams = {
  to: string;
  message: string;
  from?: string;
};

export async function sendTextMessage({
  to,
  message,
  from = "+12058552485",
}: SendTextMessageParams) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const twilioMessage = await client.messages.create({
      body: message,
      from,
      to,
    });

    console.log(`Text message sent to ${to}: SID ${twilioMessage.sid}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to send text message:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
