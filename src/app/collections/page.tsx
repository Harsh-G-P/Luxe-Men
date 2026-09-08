import CollectionsPage from "../components/Shop/CollectionsPage";

type Props = {
    searchParams: Promise<{
        limit?: string;
        search?: string;
        category?: string;
        brand?: string;
        sort?: string;
    }>;
};

export default async function Collections({
    searchParams,
}: Props) {
    const {
        limit: limitParam,
        search,
        category,
        brand,
        sort,
    } = await searchParams;

    const limit = Math.min(
        Math.max(Number(limitParam) || 10, 1),
        100
    );

    return (
        <div>
            <CollectionsPage
                search={search}
                category={category}
                brand={brand}
                sort={sort}
                limit={limit}
            />
        </div>
    );
}
