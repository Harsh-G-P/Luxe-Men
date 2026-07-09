import ProductPage from "@/app/components/Admin/ProductPages/ProductsPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function products() {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }
    const products = await prisma.product.findMany({
        include: {
            brand: {
                select: {
                    id: true,
                    title: true
                }
            },
            category: {
                select: {
                    id: true,
                    title: true
                }
            },
            variants: {
                select: {
                    stock: true,
                    price: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const serializedProducts = products.map((product) => ({
        ...product,
        price: product.price.toString(), // or Number(product.price)
        images: product.images as string[],
        variants: product.variants.map((variant) => ({
            ...variant,
            price: variant.price?.toString() ?? null, // or Number(...)
        })),
    }));

    return (
        <div>
            <ProductPage products={serializedProducts} />
        </div>
    );
}