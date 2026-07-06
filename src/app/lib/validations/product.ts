import z from "zod";

function sanitizeString(val: unknown) {
    if (typeof val !== "string") return val;

    return val
        .trim()
        .replace(/\s+/g, " ")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function toTitleCase(val: string) {
    return val
        .toLowerCase()
        .split(" ")
        .map(
            word => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

export const productVariantSchema = z.object({
    attributes: z
        .record(
            z.string(),
            z.preprocess(
                sanitizeString,
                z.string().min(1, "Attribute value is required")
            )
        )
        .refine(
            (obj) => Object.keys(obj).length > 0,
            "At least one attribute is required"
        ),

    sku: z.preprocess(
        sanitizeString,
        z
            .string()
            .max(100, "SKU must be at most 100 characters long")
            .optional()
    ),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0")
        .optional(),

    stock: z.coerce
        .number()
        .int("Stock must be a whole number")
        .min(0, "Stock cannot be negative")
}).strict();

export const productSchema = z.object({
    title: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(1, "Title is required")
            .min(3, "Title must be at least 3 characters long")
            .max(150, "Title must be at most 150 characters long")
            .transform(toTitleCase)
    ),

    description: z.preprocess(
        sanitizeString,
        z
            .string()
            .max(2000, "Description must be at most 2000 characters long")
            .optional()
    ),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0"),

    images: z
        .array(
            z.string().url("Invalid image URL")
        )
        .min(1, "At least one image is required")
        .max(10, "Maximum 10 images allowed"),

    isActive: z.boolean().optional(),

    isFeatured: z.boolean().optional(),

    bestseller: z.boolean().optional(),

    categoryId: z
        .string()
        .min(1, "Please select a category")
        .cuid("Invalid category ID"),

    brandId: z
        .string()
        .min(1, "Please select a brand")
        .cuid("Invalid brand ID"),

    variants: z
        .array(productVariantSchema)
        .min(1, "At least one product variant is required")
}).strict();