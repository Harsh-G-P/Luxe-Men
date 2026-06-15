import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      role: string
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    role: string
    name?: string | null
  }
}