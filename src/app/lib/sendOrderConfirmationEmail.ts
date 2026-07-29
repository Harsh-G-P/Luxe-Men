import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

type Props = {
  email: string;
  name: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
};

export async function sendOrderConfirmationEmail({
  email,
  name,
  orderNumber,
  total,
  paymentMethod,
}: Props) {
  const info = await transporter.sendMail({
    from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
    to: email,
    subject: `Order Confirmation • ${orderNumber}`,

    html: `
      <div style="background:#f4f4f5;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <div style="background:#111827;padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;">
              Thank You For Your Order
            </h1>
          </div>

          <div style="padding:40px;">

            <p>Hello <strong>${name}</strong>,</p>

            <p>
              Your order has been placed successfully.
            </p>

            <table
              width="100%"
              cellpadding="10"
              style="
                margin:30px 0;
                border-collapse:collapse;
                border:1px solid #e5e7eb;
              "
            >
              <tr>
                <td><strong>Order Number</strong></td>
                <td>${orderNumber}</td>
              </tr>

              <tr>
                <td><strong>Total</strong></td>
                <td>$${total.toFixed(2)}</td>
              </tr>

              <tr>
                <td><strong>Payment</strong></td>
                <td>${paymentMethod}</td>
              </tr>
            </table>

            <div style="text-align:center;margin:40px 0;">
              <a
                href="${process.env.NEXT_PUBLIC_APP_URL}/profile/orders"
                style="
                  background:#111827;
                  color:white;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                "
              >
                View Order
              </a>
            </div>

            <p>
              We'll send another email when your order has been shipped.
            </p>

            <p>
              Thank you for shopping with us.
            </p>

          </div>

        </div>
      </div>
    `,
  });

  console.log("Order email sent:", info.messageId);

  return info;
}