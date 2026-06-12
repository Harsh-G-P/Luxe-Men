import { errorResponse, successResponse } from "@/app/lib/apiResponse"
import prisma from "@/app/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server"

export async function POST (req: NextRequest){
    try{
        const { email,password} = await req.json()
        const existingUser = await prisma.user.findUnique({
            where: {
                email
           }
        })
        if(existingUser){
            return errorResponse("Unable to create account. Please check your details or sign in if you already have an account.", 400)
        }
        
        //Hash password before saving to database
        const hashPassword = await bcrypt.hash(password,10)

        //Create new user in database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword
            }
        })

        return successResponse("Account created successfully")

    } catch (error) {
        return errorResponse("Registration failed. Please try again.", 500, error)
    }
}