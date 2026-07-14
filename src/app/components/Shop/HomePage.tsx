import prisma from "@/app/lib/prisma";
import FeaturedCollections from "./Home/FeatureCollections";
import Hero from "./Home/Hero";
import PromoBanner from "./Home/PromoBanner";
import ProductSection from "./Home/ProductSection";
import WhyChooseUs from "./Home/WhyChooseUs";
import Newsletter from "./Home/Newsletter";


export default async function HomePage() {
    
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    const featured = (
        await prisma.product.findMany({
            where: {
                isFeatured: true,
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

    const newarriavl = (
        await prisma.product.findMany({
            where: {
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


    return (
        <div>
            <Hero />
            <FeaturedCollections categories={categories} />
            <ProductSection label="Featured"
                title="Featured Products"
                subtitle="Handpicked styles selected to define modern men's fashion."
                viewAllHref="/collections" products={featured} />
            <PromoBanner />
            <ProductSection label="Best Sellers"
                title="Customer Favorites"
                subtitle="Our most-loved pieces chosen by thousands of customers." viewAllHref="/collections?sort=bestseller"
                products={bestseller} />
            <ProductSection
                label="New"
                title="New Arrivals"
                subtitle="Fresh styles just added to our latest collection."
                products={newarriavl}
                viewAllHref="/collections?sort=new"
            />
            <WhyChooseUs />
            <Newsletter />
        </div>
    );
}