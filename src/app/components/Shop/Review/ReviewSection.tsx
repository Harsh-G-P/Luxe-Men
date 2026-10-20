"use client";

import { useState } from "react";
import ProductReview from "./ProductReview";
import ProductReviews from "./ProductReviews";

type ReviewSectionProps = {
    productId: string;
};

export default function ReviewSection({
    productId,
}: ReviewSectionProps) {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <ProductReview
                productId={productId}
                onReviewSubmitted={() =>
                    setRefreshKey((current) => current + 1)
                }
            />

            <ProductReviews
                productId={productId}
                refreshKey={refreshKey}
            />
        </>
    );
}