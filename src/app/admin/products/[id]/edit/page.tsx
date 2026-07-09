import AddProductPage from "@/app/components/Admin/ProductPages/AddProductPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Edit({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const product = await prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            variants: true,
        },
    });

    if (!product) {
        redirect("/admin/products");
    }


    const brands = await prisma.brand.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    const categories = (
        await prisma.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                attributes: {
                    select: {
                        title: true,
                        values: true,
                    },
                },
            },
        })
    ).map((category) => ({
        ...category,
        attributes: category.attributes.map((attr) => ({
            ...attr,
            values: attr.values as string[],
        })),
    }));

    const formattedProduct = {
        ...product,
        description: product.description ?? "",
        price: product.price.toString(),
        images: product.images as string[],
        variants: product.variants.map((variant) => ({
            attributes: variant.attributes as Record<string, string>,
            sku: variant.sku ?? "",
            price: variant.price?.toString() ?? "",
            stock: variant.stock,
        })),
    };
    return (
        <div>
            <AddProductPage product={formattedProduct}
                brands={brands} categories={categories} />
        </div>
    );
}