type OrderReadyEmailParams = {
  name: string;
  orderNumber: string;
  pickupLocation?: string;
};

export function orderReadyEmailTemplate({
  name,
  orderNumber,
  pickupLocation = "4052 Helena Rd, Helena, AL 35080",
}: OrderReadyEmailParams): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Order is Ready — Candle Cowbar</title>
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
                      Your Order is Ready, ${name}! 🕯️
                    </h1>
                    <p style="margin:10px 0 0;font-size:15px;color:#a0a0a0;">Come pick it up whenever you're ready.</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="background-color:#ffffff;padding:40px;">

                    <!-- Order Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f7;border-radius:10px;border:1px solid #e8e8e3;margin-bottom:32px;">
                      <tr>
                        <td style="padding:28px 32px;">
                          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#999999;">Order Details</p>

                          <!-- Order Number -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                            <tr>
                              <td style="padding:12px 16px;background-color:#ffffff;border-radius:8px;border:1px solid #eeeeee;">
                                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;">Order Number</p>
                                <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">#${orderNumber}</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Pickup Location -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:12px 16px;background-color:#ffffff;border-radius:8px;border:1px solid #eeeeee;">
                                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;">Pickup Location</p>
                                <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">${pickupLocation}</p>
                              </td>
                            </tr>
                          </table>
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
                                "🛍️",
                                "Bring this email or your order number when you arrive.",
                              ],
                              [
                                "🕐",
                                "Orders are held for 7 days — pick up at your convenience.",
                              ],
                              [
                                "📞",
                                "Questions? Reply to this email or call us at (205) 603-8724.",
                              ],
                            ]
                              .map(
                                ([icon, text]) => `
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                                  <table cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="font-size:18px;padding-right:12px;vertical-align:top;">${icon}</td>
                                      <td style="font-size:14px;color:#555555;line-height:1.6;">${text}</td>
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

                    <!-- CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td align="center">
                          <a href="https://candlecowbar.com/orders"
                            style="display:inline-block;background-color:#111111;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:8px;">
                            View My Order
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="border-top:1px solid #eeeeee;"></td>
                      </tr>
                    </table>

                    <!-- Footer note -->
                    <p style="margin:0;font-size:13px;color:#aaaaaa;text-align:center;line-height:1.6;">
                      Thank you for shopping with us, ${name}. We appreciate your support! 🖤
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color:#f5f5f0;padding:24px 40px;border-radius:0 0 12px 12px;">
                    <p style="margin:0;font-size:12px;color:#aaaaaa;">
                      © ${new Date().getFullYear()} Candle Cowbar · 4052 Helena Rd, Helena, AL 35080
                    </p>
                    <p style="margin:8px 0 0;font-size:12px;color:#cccccc;">
                      You're receiving this because you placed an order with us.
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
