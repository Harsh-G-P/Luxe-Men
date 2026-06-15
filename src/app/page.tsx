import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if(!session){
    return <div>Please login to view </div>
  }
  return (
    <div>
      <h1>Home</h1>
      <p>Name:{session?.user?.name}</p>
    </div>
  );
}