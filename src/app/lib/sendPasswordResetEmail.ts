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

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
) {
  const info = await transporter.sendMail({
    from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="background:#f4f4f5;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <div style="background:#111827;padding:32px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;">
              Password Reset Request
            </h1>
          </div>

          <div style="padding:40px 32px;">

            <p>Hello <strong>${name}</strong>,</p>

            <p>
              We received a request to reset your password.
            </p>

            <div style="text-align:center;margin:35px 0;">
              <a
                href="${resetLink}"
                style="
                  background:#111827;
                  color:#fff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                "
              >
                Reset Password
              </a>
            </div>

            <p>
              This link expires in 30 minutes.
            </p>

            <p>
              If you didn't request this, you can safely ignore this email.
            </p>

          </div>
        </div>
      </div>
    `,
  });

   console.log("Email sent:", info.messageId);

  return info;
}