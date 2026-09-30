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
    type: "REJECTED" | "DELETED";
    reason?: string | null;
};

export async function sendAccountDeletionEmail({
    email,
    name,
    type,
    reason,
}: Props) {
    const isRejected = type === "REJECTED";

    const title = isRejected
        ? "Deletion Request Rejected"
        : "Account Deleted";

    const eyebrow = isRejected
        ? "Account Update"
        : "Account Closure";

    const info = await transporter.sendMail({
        from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
        to: email,

        subject: isRejected
            ? "Account Deletion Request Rejected • LUXE MEN"
            : "Your LUXE MEN Account Has Been Deleted",

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

                    ${isRejected
                ? `
                                Your request to delete your LUXE MEN
                                account has been reviewed and could not
                                be approved.
                            `
                : `
                                Your LUXE MEN account has been permanently
                                deleted following your account deletion
                                request and administrator approval.
                            `
            }
                </p>


                <!-- ACCOUNT STATUS -->

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
                            Account Status
                        </td>

                        <td
                            align="right"
                            style="
                                padding:22px 0;
                                font-size:10px;
                                color:#4f4b44;
                            "
                        >
                            ${isRejected
                ? "Account Active"
                : "Permanently Deleted"
            }
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


                <!-- INFORMATION -->

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
                                        Your account remains active and
                                        you can continue using LUXE MEN
                                        normally.
                                    `
                : `
                                        Your account and associated account
                                        information are no longer available
                                        through LUXE MEN.
                                    `
            }

                        </td>

                    </tr>
                </table>


                ${!isRejected
                ? `
                            <!-- SECURITY NOTICE -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-top:25px;
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
                                        If you did not request this deletion,
                                        please contact our support team
                                        immediately.
                                    </td>

                                </tr>
                            </table>
                        `
                : ""
            }


                <!-- FOOTER MESSAGE -->

                <p
                    style="
                        margin:35px 0 0;
                        text-align:center;
                        font-size:9px;
                        line-height:18px;
                        color:#99938a;
                    "
                >
                    ${isRejected
                ? "You may continue enjoying your LUXE MEN account."
                : "Thank you for being part of LUXE MEN."
            }
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
                            LUXE MEN · ACCOUNT SERVICES
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
        `Account deletion ${type.toLowerCase()} email sent:`,
        info.messageId
    );

    return info;
}
