import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma"
import bcrypt from "bcryptjs"
import env from "./env"
import { requestCooldown } from "./redis/redis-request-cooldown"
import { loginLimiter } from "./redis/auth-limiters"
import { getLoginCooldown, isLoginBlocked, recordFailedLogin, resetFailedLogin } from "./redis/redis-login-bruteforce"
import { SECURITY_CONFIG } from "./redis/security-config"


export const authOptions: NextAuthOptions = ({
    pages: {
        signIn: "/login"
    },

    secret: env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 //30 days
    },

    jwt: {
        maxAge: 30 * 24 * 60 * 60 //30 days
    },

    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const email = credentials?.email
                const password = credentials?.password

                if (!email || !password) {
                    throw new Error(JSON.stringify({
                        type: "ValidationError"
                    }));
                }

                const [cooldown, limiter, blocked] = await Promise.all([
                    requestCooldown(email),
                    loginLimiter(email),
                    isLoginBlocked(email),
                ]);

                //cooldown
                if (!cooldown.allowed) {
                    throw new Error(
                        JSON.stringify({
                            type:
                                "Cooldown",

                            retryAfter:
                                cooldown
                                    .retryAfter
                        })
                    )
                }

                //rate-limit
                if (!limiter.allowed) {
                    throw new Error(
                        JSON.stringify({
                            type: "RateLimit",
                            retryAfter: limiter.retryAfter,
                            remaining: limiter.remaining
                        })
                    )
                }

                //email blocked
                if (blocked) {
                    console.log("Blocked user")
                    throw new Error(JSON.stringify({
                        type: "BruteForce",
                        retryAfter: await getLoginCooldown(email)
                    }))
                }

                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user) {
                    const attempts = await recordFailedLogin(email)

                    throw new Error(
                        JSON.stringify({
                            type: "InvalidCredentials",
                            remainingAttempts:
                                SECURITY_CONFIG.LOGIN.MAX_ATTEMPTS - attempts
                        })
                    )
                }

                // EMAIL VERIFICATION CHECK
                if (!user.emailVerified) {
                    throw new Error(
                        JSON.stringify({
                            type: "EmailNotVerified",
                        })
                    )
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    const attempts = await recordFailedLogin(email)

                    throw new Error(
                        JSON.stringify({
                            type: "InvalidCredentials",
                            remainingAttempts:
                                SECURITY_CONFIG.LOGIN.MAX_ATTEMPTS - attempts + 1
                        })
                    )
                }

                await resetFailedLogin(email)

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    role: user.role
                }

            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const Absolute_Expiry = 30 * 24 * 60 * 60 * 1000
            if (user) {
                token.userId = user.id
                token.role = user.role
                token.name = user.name
                token.username = user.username
                token.loginTime = Date.now()
            }
            if (typeof token.loginTime === "number" && Date.now() - token.loginTime > Absolute_Expiry) {
                token.expired = true
            }
            return token
        },
        async session({ session, token }) {
            if (token.expired) {
                session.user = undefined as any
                return session
            }
            if (session.user) {
                session.user.id = token.userId as string
                session.user.role = token.role as string
                session.user.name = token.name as string
                session.user.username = token.username as string
            }
            return session
        }
    },
})