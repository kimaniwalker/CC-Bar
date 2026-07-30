type ReservationEmailParams = {
  name: string;
  date: string;
  time: string;
  guests: number;
  isReminder?: boolean;
};

export function reservationEmailTemplate({
  name,
  date,
  time,
  guests,
  isReminder = false,
}: ReservationEmailParams): string {
  const subject = isReminder
    ? `Reminder: Your Candle Cowbar Experience is Tomorrow!`
    : `Your Reservation is Confirmed — Candle Cowbar`;

  const headline = isReminder
    ? `See You Tomorrow, ${name}! 🕯️`
    : `You're Booked, ${name}! 🕯️`;

  const subheadline = isReminder
    ? `Just a friendly reminder about your upcoming experience.`
    : `Your reservation is confirmed and your spot is secured.`;

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color:#111111;padding:36px 40px;border-radius:12px 12px 0 0;">
                      <p style="margin:0;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#a0a0a0;">Candle Cowbar</p>
                      <h1 style="margin:12px 0 0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                        ${headline}
                      </h1>
                      <p style="margin:10px 0 0;font-size:15px;color:#a0a0a0;">${subheadline}</p>
                    </td>
                  </tr>
  
                  <!-- Body -->
                  <tr>
                    <td style="background-color:#ffffff;padding:40px;">
  
                      <!-- Reservation Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f7;border-radius:10px;border:1px solid #e8e8e3;margin-bottom:32px;">
                        <tr>
                          <td style="padding:28px 32px;">
                            <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#999999;">Reservation Details</p>
  
                            <!-- Date -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                              <tr>
                                <td style="padding:12px 16px;background-color:#ffffff;border-radius:8px;border:1px solid #eeeeee;">
                                  <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;">Date</p>
                                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">${date}</p>
                                </td>
                              </tr>
                            </table>
  
                            <!-- Time -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                              <tr>
                                <td style="padding:12px 16px;background-color:#ffffff;border-radius:8px;border:1px solid #eeeeee;">
                                  <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;">Time</p>
                                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">${time}</p>
                                </td>
                              </tr>
                            </table>
  
                            <!-- Guests -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:12px 16px;background-color:#ffffff;border-radius:8px;border:1px solid #eeeeee;">
                                  <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;">Guests</p>
                                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">${guests} ${guests === 1 ? "Guest" : "Guests"}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
  
                      <!-- Location -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#999999;">Location</p>
                            <p style="margin:0;font-size:15px;color:#444444;line-height:1.6;">
                              4052 Helena Rd<br/>Helena, AL 35080
                            </p>
                            <p style="margin:8px 0 0;font-size:13px;color:#888888;">
                              Parking is available in the lot adjacent to the building or on the street.
                            </p>
                          </td>
                        </tr>
                      </table>
  
                      <!-- What to Know -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#999999;">What to Know</p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              ${[
                                [
                                  "🕐",
                                  "Arrive 10–15 minutes early to get settled in.",
                                ],
                                [
                                  "🧁",
                                  "Light refreshments are included with your experience.",
                                ],
                                [
                                  "🍷",
                                  "We are BYOB friendly — bring your favorite wine or beer!",
                                ],
                                [
                                  "🕯️",
                                  "You will leave with a custom candle handcrafted by you.",
                                ],
                              ]
                                .map(
                                  ([icon, text]) => `
                                <tr>
                                  <td style="padding:8px 0;vertical-align:top;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="font-size:18px;padding-right:12px;vertical-align:top;">${icon}</td>
                                        <td style="font-size:14px;color:#555555;line-height:1.6;vertical-align:top;">${text}</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>`,
                                )
                                .join("")}
                            </table>
                          </td>
                        </tr>
                      </table>
  
                      <!-- Cancellation -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;margin-bottom:32px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#d97706;">Cancellation Policy</p>
                            <p style="margin:0;font-size:13px;color:#666666;line-height:1.6;">
                              Cancellations made at least 24 hours in advance will receive a full refund. Cancellations within 24 hours are non-refundable.
                            </p>
                          </td>
                        </tr>
                      </table>
  
                      <!-- Questions -->
                      <p style="margin:0;font-size:14px;color:#888888;text-align:center;line-height:1.6;">
                        Questions? Reply to this email or reach us at<br/>
                        <a href="mailto:support@candlecowbar.com" style="color:#111111;font-weight:600;text-decoration:none;">support@candlecowbar.com</a>
                      </p>
  
                    </td>
                  </tr>
  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color:#f0f0eb;padding:24px 40px;border-radius:0 0 12px 12px;border-top:1px solid #e4e4de;">
                      <p style="margin:0;font-size:12px;color:#aaaaaa;letter-spacing:1px;">
                        © ${new Date().getFullYear()} Candle Cowbar · Helena, AL
                      </p>
                    </td>
                  </tr>
  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
}
