import { errorResponse } from "@/app/lib/apiResponse"
import { authOptions } from "@/app/lib/auth"
import { idSchema } from "@/app/lib/id"
import { generateInvoice } from "@/app/lib/invoice"
import prisma from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"


type Params = {
    params: Promise<{
        id: string
    }>
}

export async function GET(rea: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }
    try {
        const routeParams = await params
        const result = idSchema.safeParse(routeParams)

        if (!result.success) {
            console.log(
                result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = result.data

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                user: true,
                address: true,
                items: true,
            }
        })

        if (!order) {
            return errorResponse("Order not found", 404)
        }

const pdfBytes = await generateInvoice(order);

const buffer = new ArrayBuffer(pdfBytes.length);
const view = new Uint8Array(buffer);

view.set(pdfBytes);

return new Response(buffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Invoice-${order.orderNumber}.pdf`,
  },
});

    } catch (error) {
        console.error("Order Invoice GET API:", error);
        return errorResponse("Internal Server Error");
    }
}