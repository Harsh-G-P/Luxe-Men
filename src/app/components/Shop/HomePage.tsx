import prisma from "@/app/lib/prisma";
import Hero from "./Home/Hero";
import ProductSection from "./Home/ProductSection";
import WhyChooseUs from "./Home/WhyChooseUs";
import Ourstory from "./Home/Ourstory";
import LookbookPreview from "./Home/LookbookPreview";
import PromoBanner from "./Home/PromoBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {

    const bestseller = (
        await prisma.product.findMany({
            where: {
                bestseller: true,
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
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
    ).map((product) => ({
        ...product,
        price: Number(product.price),
        images: product.images as string[],
    }));

    const newArrival = (
        await prisma.product.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 1,
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
    ).map((product) => ({
        ...product,
        price: Number(product.price),
        images: product.images as string[],
    }));



    return (
        <div>
            <Hero />
            <PromoBanner product={newArrival[0]} />
            <Ourstory />
            <ProductSection
                title="Signature Pieces"
                subtitle="A considered selection of pieces that define the collection."
                viewAllHref="/collections?sort=bestseller"
                products={bestseller}
            />
            <LookbookPreview />
            <WhyChooseUs />
        </div>
    );
}