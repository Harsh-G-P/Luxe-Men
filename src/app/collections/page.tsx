import CollectionsPage from "../components/Shop/CollectionsPage";


type Props={
    searchParams: Promise<{
        search?: string
        category?: string
        brand?: string
        sort?: string
    }>
}

export default async function Collections({searchParams}:Props) {
    const { search,category,brand,sort } = await searchParams
    return (
        <div>
            <CollectionsPage search={search} category={category} brand={brand} sort={sort} />
        </div>
    );
}