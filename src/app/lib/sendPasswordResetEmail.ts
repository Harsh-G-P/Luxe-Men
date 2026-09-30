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

    subject: "Reset Your Password • LUXE MEN",

    html: `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>Reset Your Password</title>
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
                                    font-size:17px;
                                    text-align:center;
                                "
                            >
                                ✦
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
                    Account Security
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
                    Reset Your Password
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

                    We received a request to reset the password
                    associated with your LUXE MEN account.
                </p>


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
                                href="${resetLink}"
                                style="
                                    display:inline-block;
                                    background:#181714;
                                    color:#ffffff;
                                    text-decoration:none;
                                    padding:16px 32px;
                                    font-size:8px;
                                    line-height:12px;
                                    letter-spacing:3px;
                                    text-transform:uppercase;
                                "
                            >
                                Reset Password
                            </a>

                        </td>
                    </tr>
                </table>


                <!-- EXPIRATION -->

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
                                padding:20px 0;
                                font-size:8px;
                                line-height:14px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                color:#9b8150;
                            "
                        >
                            Link Validity
                        </td>

                        <td
                            align="right"
                            style="
                                padding:20px 0;
                                font-size:10px;
                                color:#4f4b44;
                            "
                        >
                            30 Minutes
                        </td>

                    </tr>
                </table>


                <!-- SECURITY NOTE -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin-top:30px;
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
                            If you did not request a password reset,
                            you can safely ignore this email. Your password
                            will remain unchanged.
                        </td>

                    </tr>
                </table>


                <!-- FALLBACK LINK -->

                <p
                    style="
                        margin:35px 0 0;
                        text-align:center;
                        font-size:8px;
                        line-height:16px;
                        color:#aaa49b;
                    "
                >
                    If the button above does not work, copy and paste
                    the password reset link into your browser.
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
                    For your security, never share this link with anyone.
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
                            LUXE MEN · ACCOUNT SECURITY
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

  console.log("Password reset email sent:", info.messageId);

  return info;
}
