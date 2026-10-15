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

    const title = isRejected
        ? "Cancellation Request Rejected"
        : "Order Cancelled";

    const eyebrow = isRejected
        ? "Cancellation Update"
        : "Order Update";

    const intro = isRejected
        ? "Your cancellation request for the following order has been reviewed and could not be approved."
        : "Your order has been successfully cancelled.";

    const info = await transporter.sendMail({
        from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
        to: email,

        subject: isRejected
            ? `Cancellation Request Rejected • ${orderNumber}`
            : `Order Cancelled • ${orderNumber}`,

        html: `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>${title}</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f0eee9;
        font-family:Arial, Helvetica, sans-serif;
        color:#1c1b18;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#f0eee9;
        padding:45px 15px;
    "
>
<tr>
<td align="center">

    <!-- MAIN CONTAINER -->

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            max-width:650px;
            background:#faf9f6;
            border:1px solid #d8d3c9;
        "
    >

        <!-- HEADER -->

        <tr>
            <td
                align="center"
                style="
                    padding:38px 30px 30px;
                    border-bottom:1px solid #ded9d0;
                "
            >

                <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                >
                    <tr>

                        <td
                            style="
                                width:45px;
                                border-top:1px solid #d1cbc1;
                            "
                        ></td>

                        <td
                            align="center"
                            style="
                                padding:0 15px;
                                font-size:8px;
                                line-height:12px;
                                letter-spacing:4px;
                                color:#9b8150;
                                text-transform:uppercase;
                                white-space:nowrap;
                            "
                        >
                            LUXE MEN
                        </td>

                        <td
                            style="
                                width:45px;
                                border-top:1px solid #d1cbc1;
                            "
                        ></td>

                    </tr>
                </table>

            </td>
        </tr>


        <!-- CONTENT -->

        <tr>
            <td
                style="
                    padding:48px 45px;
                "
            >

                <!-- STATUS ICON -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                >
                    <tr>
                        <td align="center">

                            <div
                                style="
                                    width:52px;
                                    height:52px;
                                    line-height:52px;
                                    border:1px solid #9b8150;
                                    color:#9b8150;
                                    font-size:18px;
                                    text-align:center;
                                "
                            >
                                ${isRejected ? "×" : "✓"}
                            </div>

                        </td>
                    </tr>
                </table>


                <!-- EYEBROW -->

                <p
                    style="
                        margin:28px 0 0;
                        text-align:center;
                        font-size:8px;
                        line-height:12px;
                        letter-spacing:4px;
                        text-transform:uppercase;
                        color:#9b8150;
                    "
                >
                    ${eyebrow}
                </p>


                <!-- TITLE -->

                <h1
                    style="
                        margin:10px 0 0;
                        text-align:center;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:32px;
                        line-height:42px;
                        font-weight:400;
                        color:#25231f;
                    "
                >
                    ${title}
                </h1>


                <!-- INTRO -->

                <p
                    style="
                        max-width:440px;
                        margin:18px auto 0;
                        text-align:center;
                        font-size:11px;
                        line-height:20px;
                        color:#8b867d;
                    "
                >
                    Dear ${name},
                    <br /><br />

                    ${intro}
                </p>


                <!-- ORDER DETAILS -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin-top:38px;
                        border-top:1px solid #ded9d0;
                        border-bottom:1px solid #ded9d0;
                    "
                >

                    <!-- ORDER NUMBER -->

                    <tr>

                        <td
                            style="
                                padding:22px 0;
                                font-size:8px;
                                line-height:14px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                color:#9b8150;
                            "
                        >
                            Order Number
                        </td>

                        <td
                            align="right"
                            style="
                                padding:22px 0;
                                font-family:Georgia, 'Times New Roman', serif;
                                font-size:15px;
                                color:#25231f;
                            "
                        >
                            ${orderNumber}
                        </td>

                    </tr>


                    <!-- TOTAL -->

                    <tr>

                        <td
                            style="
                                padding:0 0 22px;
                                font-size:8px;
                                line-height:14px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                color:#9b8150;
                            "
                        >
                            Total
                        </td>

                        <td
                            align="right"
                            style="
                                padding:0 0 22px;
                                font-size:13px;
                                color:#25231f;
                            "
                        >
                            $${total.toFixed(2)}
                        </td>

                    </tr>


                    <!-- PAYMENT -->

                    <tr>

                        <td
                            style="
                                padding:0 0 22px;
                                font-size:8px;
                                line-height:14px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                color:#9b8150;
                            "
                        >
                            Payment
                        </td>

                        <td
                            align="right"
                            style="
                                padding:0 0 22px;
                                font-size:10px;
                                color:#4f4b44;
                            "
                        >
                            ${paymentMethod}
                        </td>

                    </tr>


                    <!-- STATUS -->

                    <tr>

                        <td
                            style="
                                padding:0 0 22px;
                                font-size:8px;
                                line-height:14px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                color:#9b8150;
                            "
                        >
                            Order Status
                        </td>

                        <td
                            align="right"
                            style="
                                padding:0 0 22px;
                                font-size:10px;
                                color:#4f4b44;
                            "
                        >
                            ${isRejected ? "Active" : "Cancelled"}
                        </td>

                    </tr>

                </table>


                ${isRejected && reason
                ? `
                            <!-- REJECTION REASON -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-top:30px;
                                    background:#f4f1e9;
                                    border-left:2px solid #9b8150;
                                "
                            >
                                <tr>
                                    <td
                                        style="
                                            padding:18px 20px;
                                        "
                                    >

                                        <p
                                            style="
                                                margin:0 0 8px;
                                                font-size:8px;
                                                line-height:12px;
                                                letter-spacing:2px;
                                                text-transform:uppercase;
                                                color:#9b8150;
                                            "
                                        >
                                            Reason
                                        </p>

                                        <p
                                            style="
                                                margin:0;
                                                font-size:10px;
                                                line-height:18px;
                                                color:#777168;
                                            "
                                        >
                                            ${reason}
                                        </p>

                                    </td>
                                </tr>
                            </table>
                        `
                : ""
            }


                <!-- STATUS MESSAGE -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin-top:32px;
                    "
                >
                    <tr>

                        <td
                            valign="top"
                            style="
                                width:8px;
                                padding-top:5px;
                            "
                        >
                            <div
                                style="
                                    width:6px;
                                    height:6px;
                                    background:#9b8150;
                                "
                            ></div>
                        </td>

                        <td
                            style="
                                padding-left:12px;
                                font-size:9px;
                                line-height:18px;
                                color:#99938a;
                            "
                        >

                            ${isRejected
                ? `
                                        Your order remains active and will
                                        continue through the normal order process.
                                    `
                : paymentMethod === "STRIPE"
                    ? `
                                            Since this order was paid online,
                                            your refund will be handled separately
                                            according to the applicable refund process.
                                        `
                    : `
                                            Since this order was placed with
                                            Cash on Delivery, no payment was collected.
                                        `
            }

                        </td>

                    </tr>
                </table>


                <!-- CTA -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin-top:38px;
                    "
                >
                    <tr>
                        <td align="center">

                            <a
                                href="${process.env.NEXT_PUBLIC_APP_URL}/profile/orders"
                                style="
                                    display:inline-block;
                                    background:#181714;
                                    color:#ffffff;
                                    text-decoration:none;
                                    padding:16px 30px;
                                    font-size:8px;
                                    line-height:12px;
                                    letter-spacing:3px;
                                    text-transform:uppercase;
                                "
                            >
                                View Orders
                            </a>

                        </td>
                    </tr>
                </table>


                <!-- SUPPORT -->

                <p
                    style="
                        margin:35px 0 0;
                        text-align:center;
                        font-size:9px;
                        line-height:18px;
                        color:#99938a;
                    "
                >
                    If you have any questions about your order,
                    please contact our support team.
                </p>


                <p
                    style="
                        margin:18px 0 0;
                        text-align:center;
                        font-size:9px;
                        line-height:18px;
                        color:#99938a;
                    "
                >
                    Thank you for choosing LUXE MEN.
                </p>

            </td>
        </tr>


        <!-- FOOTER -->

        <tr>
            <td
                align="center"
                style="
                    padding:25px 30px;
                    border-top:1px solid #ded9d0;
                    background:#f4f1e9;
                "
            >

                <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                >
                    <tr>

                        <td
                            style="
                                width:35px;
                                border-top:1px solid #d1cbc1;
                            "
                        ></td>

                        <td
                            style="
                                padding:0 12px;
                                font-size:7px;
                                line-height:12px;
                                letter-spacing:3px;
                                color:#aaa49a;
                                text-transform:uppercase;
                                white-space:nowrap;
                            "
                        >
                            Crafted With Care
                        </td>

                        <td
                            style="
                                width:35px;
                                border-top:1px solid #d1cbc1;
                            "
                        ></td>

                    </tr>
                </table>

            </td>
        </tr>

    </table>

</td>
</tr>
</table>

</body>
</html>
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
