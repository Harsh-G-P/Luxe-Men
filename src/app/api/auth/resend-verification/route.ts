import { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { generateVerificationToken } from "@/app/lib/tokens";
import { sendVerificationEmail } from "@/app/lib/email";
import { errorResponse, successResponse } from "@/app/lib/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email || typeof email !== "string") {
        return errorResponse("Please enter a valid email address",400)
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse("If the account exists, a verification email has been sent.",400)
    }

    // 2. If already verified
    if (user.emailVerified) {

      return successResponse("Email is already verified. You can log in.")
    }

    // 3. Delete old tokens
    const del = await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // 4. Create new token
    const { token, tokenHash } = generateVerificationToken();

    const create = await prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });

    // 5. Create link
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    // 6. Send email
    const send = await sendVerificationEmail(
      user.email,
      user.name,
      verificationLink
    );

    return successResponse("If the account exists, a verification email has been sent.")

  } catch (error) {
        console.error(error)
        return errorResponse("Verification failed", 500)
  }
}