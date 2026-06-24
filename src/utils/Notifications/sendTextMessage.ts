import twilio from "twilio";
export const sendTextMessage = async (to: string, message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const twilioMessage = await client.messages.create({
    body: message,
    from: "+12058552485",
    to,
  });

  return twilioMessage;
};
