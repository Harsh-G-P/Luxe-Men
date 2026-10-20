
import prisma from "@/app/lib/prisma";
import ProductGallery from "./Product/ProductGallery";
import Link from "next/link";
import ProductDetails from "./Product/ProductDetails";
import ProductSection from "./Product/ProductSection";
import ProductReview from "./Review/ProductReview";
import ProductReviews from "./Review/ProductReviews";
import ReviewSection from "./Review/ReviewSection";


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
            <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#f8f7f4] px-6">

                {/* Subtle background number */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute select-none font-serif text-[16rem] font-light leading-none text-black/2.5 md:text-[24rem]"
                >
                    404
                </span>

                <div className="relative z-10 mx-auto max-w-2xl text-center">

                    {/* Brand */}
                    <p className="text-[9px] font-medium uppercase tracking-[0.55em] text-gray-400">
                        LUXE MEN
                    </p>

                    {/* Fine divider */}
                    <div className="mx-auto mt-6 flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-black/20" />
                        <span className="h-1 w-1 rounded-full bg-black" />
                        <span className="h-px w-8 bg-black/20" />
                    </div>

                    {/* Error label */}
                    <p className="mt-10 text-[9px] font-medium uppercase tracking-[0.4em] text-gray-400">
                        404 · Piece Not Found
                    </p>

                    {/* Heading */}
                    <h1 className="mt-5 font-serif text-4xl font-light leading-[1.1] tracking-tight text-black sm:text-5xl md:text-6xl">
                        A Piece Worth
                        <br />
                        <span className="italic">Discovering</span>
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mt-7 max-w-md text-[13px] leading-7 text-gray-500">
                        The piece you are looking for is no longer available,
                        or the link may have changed. Discover something
                        equally considered from our collection.
                    </p>

                    {/* CTA */}
                    <div className="mt-10">
                        <Link
                            href="/collections"
                            className="group inline-flex items-center gap-6 border border-black bg-black px-10 py-4 text-[9px] font-medium uppercase tracking-[0.3em] text-white transition-all duration-500 hover:bg-transparent hover:text-black"
                        >
                            <span>Explore Collection</span>

                            <span className="text-sm font-light transition-transform duration-500 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </div>

                    {/* Bottom brand detail */}
                    <div className="mt-14 flex items-center justify-center gap-4 text-[8px] uppercase tracking-[0.35em] text-gray-400">
                        <span>Timeless</span>
                        <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />
                        <span>Refined</span>
                        <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />
                        <span>Luxe Men</span>
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
            productId: variant.productId,
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

            {/* ================================================= */}
            {/* PRODUCT AREA */}
            {/* ================================================= */}

            <section className="w-full">

                {/* ================= DESKTOP ================= */}
                <div className="hidden md:grid md:grid-cols-2">

                    {/* ========================================= */}
                    {/* LEFT - PRODUCT IMAGES */}
                    {/* ========================================= */}

                    <div className="w-full">
                        <ProductGallery
                            images={formattedProduct.images}
                            title={formattedProduct.title}
                        />
                    </div>


                    {/* ========================================= */}
                    {/* RIGHT - PRODUCT DETAILS */}
                    {/* ========================================= */}

                    <div className="relative w-full">
                        <div className="sticky top-16">
                            <ProductDetails
                                product={formattedProduct}
                                totalStock={totalStock}
                            />
                        </div>
                    </div>


                </div>


                {/* ================= MOBILE ================= */}

                <div className="md:hidden">

                    {/* Gallery */}
                    <ProductGallery
                        images={formattedProduct.images}
                        title={formattedProduct.title}
                    />

                    {/* Details */}
                    <section className="w-full bg-white py-12">
                        <ProductDetails
                            product={formattedProduct}
                            totalStock={totalStock}
                        />
                    </section>

                </div>

            </section>

            <ReviewSection productId={product.id} />


            {/* ================================================= */}
            {/* RELATED PRODUCTS */}
            {/* ================================================= */}

            <ProductSection
                title="Related Products"
                subtitle="Discover more premium products selected just for you."
                products={relatedProducts}
                viewAllHref="/collections?sort=new"
            />

        </div>
    );

}