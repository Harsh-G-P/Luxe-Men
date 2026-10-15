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
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>Order Confirmation</title>
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
                        >
                        </td>

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
                        >
                        </td>

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

                <!-- ORDER CONFIRMED -->

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
                                    font-size:17px;
                                    text-align:center;
                                "
                            >
                                ✓
                            </div>

                        </td>
                    </tr>
                </table>


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
                    Order Confirmed
                </p>


                <h1
                    style="
                        margin:10px 0 0;
                        text-align:center;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:34px;
                        line-height:42px;
                        font-weight:400;
                        color:#25231f;
                    "
                >
                    Thank You
                </h1>


                <p
                    style="
                        max-width:430px;
                        margin:18px auto 0;
                        text-align:center;
                        font-size:11px;
                        line-height:20px;
                        color:#8b867d;
                    "
                >
                    Dear ${name},
                    <br /><br />

                    Your order has been placed successfully.
                    We are now preparing your selection with the
                    attention to detail that defines LUXE MEN.
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
                                View Order
                            </a>

                        </td>
                    </tr>
                </table>


                <!-- SHIPPING MESSAGE -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin-top:40px;
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
                            >
                            </div>
                        </td>

                        <td
                            style="
                                padding-left:12px;
                                font-size:9px;
                                line-height:18px;
                                color:#99938a;
                            "
                        >
                            We'll send another email when your order
                            has been shipped.
                        </td>

                    </tr>
                </table>


                <p
                    style="
                        margin:35px 0 0;
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
                        >
                        </td>

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
                        >
                        </td>

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

  console.log("Order email sent:", info.messageId);

  return info;
}
