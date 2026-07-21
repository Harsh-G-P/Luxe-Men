"use client";

import { useState } from "react";
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";
import ProductActions from "./ProductActions";
import ProductAccordion from "./ProductAccordion";

type Variant = {
  id: string;
  price: number | null;
  productId: string;
  stock: number;
  attributes: Record<string, string>;
};

type Product = {
    id: string;
    title: string;
    price: number;
    description: string | null;
    brand: {
        title: string;
    };
    variants: Variant[];
};

type Props = {
  product: Product;
  totalStock: number;
};

export default function ProductDetails({ product, totalStock }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<
    typeof product.variants[number] | null
  >(null);

  return (
    <div className="grid grid-cols-1 gap-20 md:grid-cols-[1.4fr_0.6fr]">
      <div>
        <ProductInfo
          brand={product.brand.title}
          title={product.title}
          price={selectedVariant?.price ?? product.price}
          stock={selectedVariant?.stock ?? totalStock}
          description={product.description ?? ""}
        />
        <ProductAccordion />
      </div>

      <div>
        <VariantSelector
    productId={product.id}
    variants={product.variants}
    onVariantChange={setSelectedVariant}
/>
        <ProductActions />
      </div>
    </div>
  );
}