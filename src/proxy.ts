import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "process";


export async function proxy(req:NextRequest){
    const path = req.nextUrl.pathname

    const token = await getToken({
        req,
        secret:env.NEXTAUTH_SECRET,
    })

  const isDash = path.startsWith('/profile')
  const isAdminPage = path.startsWith('/admin')
  const isLogin = path === "/login"
  const isRegister = path === "/register"

  const isAuth = isLogin || isRegister
  const isProtected = isDash 

  if((!token || token.expired) && isProtected) {
    return NextResponse.redirect(new URL("/login",req.url))
  }

  if (token && isAuth) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if(isAdminPage){
    if(!token){
      return NextResponse.redirect(new URL("/login",req.url))
    }
    if(token.role !== "ADMIN"){
      return NextResponse.redirect(new URL("/",req.url))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)",
    "/api/auth/callback/credentials"
  ],
};