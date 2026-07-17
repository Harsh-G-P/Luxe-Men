
import prisma from "@/app/lib/prisma";
import ProductSection from "./Home/ProductSection";
import ProductAccordion from "./Product/ProductAccordion";
import ProductActions from "./Product/ProductActions";
import ProductGallery from "./Product/ProductGallery";
import ProductInfo from "./Product/ProductInfo";
import VariantSelector from "./Product/VariantSelector";
import Link from "next/link";
import ProductDetails from "./Product/ProductDetails";


type Props = {
    slug: string
}

export default async function ProductPage({ slug }: Props) {

    const product = await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            brand: {
                select: {
                    title: true,
                },
            },
            category: {
                select: {
                    title: true,
                },
            },
            variants: true,
        },
    })

    if (!product) {
        return (
            <section className="flex min-h-[80vh] items-center justify-center px-6">
                <div className="mx-auto max-w-lg text-center">

                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gray-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gray-400">
                        404 Error
                    </p>

                    <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
                        Product Not Found
                    </h1>

                    <p className="mx-auto mt-6 max-w-md text-base leading-7 text-gray-500">
                        Sorry, the product you're looking for doesn't exist,
                        may have been removed, or the link is no longer valid.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/collections"
                            className="rounded-full bg-black px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:opacity-90"
                        >
                            Explore Collection
                        </Link>
                    </div>

                </div>
            </section>
        );
    }

    const formattedProduct = {
        ...product,
        price: Number(product.price),
        images: product.images as string[],
        variants: product.variants.map((variant) => ({
            ...variant,
            price: variant.price ? Number(variant.price) : null,
            attributes: variant.attributes as Record<string, string>,
        })),
    };

    const totalStock = product.variants.reduce(
        (total, variant) => total + variant.stock,
        0
    );

    const relatedProducts = (
        await prisma.product.findMany({
            where: {
                isActive: true,
                id: {
                    not: product.id,
                },
                categoryId: product.categoryId,
            },
            orderBy: [
                {
                    isFeatured: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
            take: 4,
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                images: true,
                brand: {
                    select: {
                        title: true,
                    },
                },
            },
        })
    ).map((item) => ({
        ...item,
        price: Number(item.price),
        images: item.images as string[],
    }));

    return (
        <div className="w-full">

            <section className="w-full">
                <ProductGallery
                    images={formattedProduct.images}
                    title={formattedProduct.title}
                />
            </section>
            <section className="w-full px-5 py-16 md:px-20 bg-white">
                <ProductDetails
                    product={formattedProduct}
                    totalStock={totalStock}
                />
            </section>

            <ProductSection
                label="You May Also Like"
                title="Related Products"
                subtitle="Discover more premium products selected just for you."
                products={relatedProducts}
                viewAllHref="/collections?sort=new"
            />
        </div>
    );
}