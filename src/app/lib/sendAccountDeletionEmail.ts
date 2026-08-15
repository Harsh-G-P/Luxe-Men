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

    const info = await transporter.sendMail({
        from: `"Luxe Men" <${process.env.BREVO_SENDER}>`,
        to: email,

        subject: isRejected
            ? "Account Deletion Request Rejected"
            : "Your Luxe Men Account Has Been Deleted",

        html: `
            <div style="
                background:#f4f4f5;
                padding:40px 20px;
                font-family:Arial,sans-serif;
            ">

                <div style="
                    max-width:650px;
                    margin:auto;
                    background:#fff;
                    border-radius:12px;
                    border:1px solid #e5e7eb;
                    overflow:hidden;
                ">

                    <!-- Header -->
                    <div style="
                        background:#111827;
                        padding:32px;
                        text-align:center;
                    ">

                        <h1 style="
                            margin:0;
                            color:#fff;
                            font-size:24px;
                        ">
                            ${
                                isRejected
                                    ? "Deletion Request Rejected"
                                    : "Account Deleted"
                            }
                        </h1>

                    </div>


                    <!-- Content -->
                    <div style="padding:40px;">

                        <p>
                            Hello <strong>${name}</strong>,
                        </p>


                        ${
                            isRejected
                                ? `
                                    <p style="
                                        color:#4b5563;
                                        line-height:1.7;
                                    ">
                                        Your request to delete your Luxe Men
                                        account has been reviewed by our
                                        administration team and rejected.
                                    </p>

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
                                            Account Status
                                        </p>

                                        <p style="
                                            margin:0;
                                            color:#111827;
                                            font-weight:600;
                                        ">
                                            Account Active
                                        </p>

                                    </div>

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

                                    <p style="
                                        color:#4b5563;
                                        line-height:1.7;
                                    ">
                                        Your account remains active and you can
                                        continue using Luxe Men normally.
                                    </p>
                                `
                                : `
                                    <p style="
                                        color:#4b5563;
                                        line-height:1.7;
                                    ">
                                        Your Luxe Men account has been
                                        permanently deleted following your
                                        account deletion request and
                                        administrator approval.
                                    </p>

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
                                            Account Status
                                        </p>

                                        <p style="
                                            margin:0;
                                            color:#111827;
                                            font-weight:600;
                                        ">
                                            Permanently Deleted
                                        </p>

                                    </div>

                                    <p style="
                                        color:#4b5563;
                                        line-height:1.7;
                                    ">
                                        Your account and associated account
                                        information are no longer available
                                        through Luxe Men.
                                    </p>

                                    <p style="
                                        color:#4b5563;
                                        line-height:1.7;
                                    ">
                                        If you did not request this deletion,
                                        please contact our support team
                                        immediately.
                                    </p>
                                `
                        }


                        <p style="margin-top:40px;">
                            Thank you for shopping with Luxe Men.
                        </p>

                    </div>

                </div>

            </div>
        `,
    });

    console.log(
        `Account deletion ${type.toLowerCase()} email sent:`,
        info.messageId
    );

    return info;
}