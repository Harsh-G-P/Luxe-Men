
import OrderSummary from "./Checkout/OrderSummary";
import CheckoutFlow from "./Checkout/CheckoutFlow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        redirect("/cart");
    }
    
    return (
        <div className="min-h-screen ">
            <div className="mx-auto max-w-330 px-10 py-6">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">

                    {/* LEFT */}
                    <div>
                        {/* Account */}
                        <div className="mb-10 border border-neutral-200 px-5 py-4">
                            <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
                                You are checking out as:
                            </p>

                            <p className="mt-1 text-[15px]">
                                {session.user.email?.replace(/(.{2}).+(@.+)/, "$1****$2")}
                            </p>
                        </div>

                        <CheckoutFlow />

                    </div>

                    {/* RIGHT SIDEBAR */}
                    <OrderSummary />

                </div>
            </div>
        </div>
    );
}