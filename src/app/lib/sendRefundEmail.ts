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
    type: "REJECTED" | "REFUNDED";
    reason?: string | null;
};

export async function sendRefundEmail({
    email,
    name,
    orderNumber,
    total,
    type,
    reason,
}: Props) {
    const isRejected = type === "REJECTED";

    const info = await transporter.sendMail({
        from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
        to: email,

        subject: isRejected
            ? `Refund Request Rejected • ${orderNumber}`
            : `Refund Processed • ${orderNumber}`,

        html: `
            <div style="background:#f4f4f5;padding:40px 20px;font-family:Arial,sans-serif;">
                <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

                    <div style="background:#111827;padding:32px;text-align:center;">
                        <h1 style="margin:0;color:#fff;">
                            ${
                                isRejected
                                    ? "Refund Request Rejected"
                                    : "Refund Processed"
                            }
                        </h1>
                    </div>

                    <div style="padding:40px;">

                        <p>Hello <strong>${name}</strong>,</p>

                        ${
                            isRejected
                                ? `
                                    <p>
                                        Your refund request for the following
                                        order has been reviewed and rejected.
                                    </p>
                                `
                                : `
                                    <p>
                                        Your refund has been processed
                                        successfully.
                                    </p>
                                `
                        }

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
                                <td><strong>Amount</strong></td>
                                <td>$${total.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td><strong>Refund Status</strong></td>
                                <td>
                                    ${
                                        isRejected
                                            ? "Rejected"
                                            : "Refunded"
                                    }
                                </td>
                            </tr>
                        </table>

                        ${
                            isRejected
                                ? `
                                    ${
                                        reason
                                            ? `
                                                <div style="
                                                    margin:30px 0;
                                                    padding:20px;
                                                    border-left:3px solid #111827;
                                                    background:#f9fafb;
                                                ">
                                                    <p style="
                                                        margin:0 0 8px;
                                                        font-size:12px;
                                                        font-weight:bold;
                                                        text-transform:uppercase;
                                                        color:#6b7280;
                                                    ">
                                                        Reason
                                                    </p>

                                                    <p style="
                                                        margin:0;
                                                        color:#4b5563;
                                                        line-height:1.6;
                                                    ">
                                                        ${reason}
                                                    </p>
                                                </div>
                                            `
                                            : ""
                                    }

                                    <p>
                                        If you believe this decision was made
                                        in error, please contact our support
                                        team.
                                    </p>
                                `
                                : `
                                    <p>
                                        The refund has been successfully
                                        submitted to your original payment
                                        method. The time required for the funds
                                        to appear may depend on your bank or
                                        card provider.
                                    </p>
                                `
                        }

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
                                View Orders
                            </a>
                        </div>

                        <p>
                            Thank you for shopping with Luxe Men.
                        </p>

                    </div>

                </div>
            </div>
        `,
    });

    console.log(
        `Refund ${type.toLowerCase()} email sent:`,
        info.messageId
    );

    return info;
}