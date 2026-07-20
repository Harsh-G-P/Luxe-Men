import z from "zod";

export const cartSchema = z.object({
    productId: z
        .string()
        .min(1, "Product is required")
        .cuid("Invalid product ID"),

    variantId: z
        .string()
        .min(1,"Please select a variant")
        .cuid("Invalid variant ID")
        .optional(),

    quantity: z.coerce
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Minimum quantity is 1")
        .max(10, "Maximum quantity is 10"),
}).strict();

export const updateCartSchema = z.object({
    quantity: z.coerce
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Minimum quantity is 1")
        .max(10, "Maximum quantity is 10"),
}).strict();