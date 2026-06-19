import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import Logout from "./components/Logout";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if(!session){
    return (
    <div>
      <p className="mb-5">Please login to view </p>
      <Link href={'/login'} className="border p-2">Login</Link>
      </div>
  )
  }
  return (
    <div>
      <h1>Home</h1>
      <p>Name:{session?.user?.name}</p>
      <p>Username:{session?.user?.username}</p>
      <Logout />
    </div>
  );
}