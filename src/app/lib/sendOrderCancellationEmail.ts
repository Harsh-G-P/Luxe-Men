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
    type: "APPROVED" | "REJECTED";
    reason?: string | null;
};

export async function sendOrderCancellationEmail({
    email,
    name,
    orderNumber,
    total,
    paymentMethod,
    type,
    reason,
}: Props) {
    const isRejected = type === "REJECTED";

    const info = await transporter.sendMail({
        from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
        to: email,
        subject: isRejected
            ? `Cancellation Request Rejected • ${orderNumber}`
            : `Order Cancelled • ${orderNumber}`,

        html: `
            <div style="background:#f4f4f5;padding:40px 20px;font-family:Arial,sans-serif;">
                <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

                    <div style="background:#111827;padding:32px;text-align:center;">
                        <h1 style="margin:0;color:#fff;">
                            ${
                                isRejected
                                    ? "Cancellation Request Rejected"
                                    : "Order Cancelled"
                            }
                        </h1>
                    </div>

                    <div style="padding:40px;">

                        <p>Hello <strong>${name}</strong>,</p>

                        <p>
                            ${
                                isRejected
                                    ? "Your cancellation request for the following order has been rejected."
                                    : "Your order has been successfully cancelled."
                            }
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

                            <tr>
                                <td><strong>Order Status</strong></td>
                                <td>
                                    ${isRejected ? "Active" : "Cancelled"}
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
                                                    padding:16px;
                                                    background:#f9fafb;
                                                    border-left:3px solid #111827;
                                                ">
                                                    <p style="
                                                        margin:0 0 8px;
                                                        font-size:13px;
                                                        font-weight:bold;
                                                    ">
                                                        Reason
                                                    </p>

                                                    <p style="
                                                        margin:0;
                                                        color:#6b7280;
                                                        font-size:13px;
                                                        line-height:1.6;
                                                    ">
                                                        ${reason}
                                                    </p>
                                                </div>
                                            `
                                            : ""
                                    }

                                    <p>
                                        Your order remains active and will
                                        continue through the normal order process.
                                    </p>
                                `
                                : `
                                    ${
                                        paymentMethod === "STRIPE"
                                            ? `
                                                <p>
                                                    Since this order was paid online,
                                                    your refund will be handled
                                                    separately according to the
                                                    refund process.
                                                </p>
                                            `
                                            : `
                                                <p>
                                                    Since this order was placed with
                                                    Cash on Delivery, no payment was
                                                    collected.
                                                </p>
                                            `
                                    }
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
                            If you have any questions about your order,
                            please contact our support team.
                        </p>

                        <p>
                            Thank you for shopping with Luxe Men.
                        </p>

                    </div>

                </div>
            </div>
        `,
    });

    console.log(
        isRejected
            ? "Order cancellation rejection email sent:"
            : "Order cancellation email sent:",
        info.messageId
    );

    return info;
}