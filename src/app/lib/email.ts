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

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationLink: string
) {
  const info = await transporter.sendMail({
    from: `"Your App" <${process.env.BREVO_SENDER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="background:#f4f4f5;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <div style="background:#111827;padding:32px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">
              Verify Your Email
            </h1>
          </div>

          <div style="padding:40px 32px;">

            <p style="font-size:16px;color:#374151;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size:16px;color:#374151;line-height:1.7;">
              Thank you for creating an account. Please verify your email address to activate your account.
            </p>

            <div style="text-align:center;margin:40px 0;">
              <a
                href="${verificationLink}"
                style="
                  background:#111827;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                  font-weight:600;
                "
              >
                Verify Email Address
              </a>
            </div>

            <p style="font-size:14px;color:#6b7280;">
              This link will expire in 1 hours.
            </p>

            <p style="font-size:14px;color:#6b7280;">
              If you didn't create this account, you can safely ignore this email.
            </p>

          </div>

          <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            border-top:1px solid #e5e7eb;
          ">
            <p style="margin:0;color:#6b7280;font-size:13px;">
              Secure Account Verification
            </p>
          </div>

        </div>
      </div>
    `,
  });

  console.log("Email sent:", info.messageId);

  return info;
}