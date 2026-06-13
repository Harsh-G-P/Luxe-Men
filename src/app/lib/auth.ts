import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma"
import bcrypt from "bcryptjs"
import env from "./env"


export const authOptions: NextAuthOptions =({
    pages:{
        signIn:"/login"
    },

    secret:env.NEXTAUTH_SECRET,

    session:{
        strategy:"jwt",
        maxAge:30 * 24 * 60 * 60 //30 days
    },

    jwt:{
        maxAge:30 * 24 * 60 * 60 //30 days
    },
    
    providers : [
        CredentialsProvider({
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials){
                const email = credentials?.email
                const password = credentials?.password

                if(!email || !password){
                    return null
                }

                const user = await prisma.user.findUnique({
                    where:{email}
                })

                if(!user){
                    return null
                }

                const isValid = await bcrypt.compare(password,user.password)

                if(!isValid){
                    return null
                }

                return {
                    id:user.id,
                    email:user.email,
                    role:user.role
                }

            }
        }),
    ],
    callbacks:{
        async jwt({token,user}){
            const Absolute_Expiry = 30 * 24 * 60 * 60 * 1000
            if(user){
                token.userId = user.id
                token.role = user.role
                token.loginTime = Date.now()
            }
            if(typeof token.loginTime === "number" && Date.now() - token.loginTime > Absolute_Expiry ){
                token.expired = true
            }
            return token
        },
        async session({session,token}){
            if(token.expired){
                session.user = undefined as any
                return session
            }
            if(session.user){
                session.user.id = token.userId as string
                session.user.role = token.role as string
            }
            return session
        }
    },
})