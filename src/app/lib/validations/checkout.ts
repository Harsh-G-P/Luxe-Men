import z from "zod";

function sanitizeString(val: unknown) {
    if (typeof val !== "string") return val;

    return val
        .trim()
        .replace(/\s+/g, " ")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export const checkoutSchema = z.object({
    addressId: z
        .string()
        .min(1, "Please select a shipping address")
        .cuid("Invalid address ID"),

    paymentMethod: z.enum(["COD", "STRIPE"], {
        error: "Invalid payment method",
    }),

    notes: z.preprocess(
        sanitizeString,
        z.string().max(500).optional()
    ),

    packagingOption: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(1, "Packaging option is required")
            .max(100, "Packaging option is too long")
    ),

    giftMessage: z.preprocess(
        sanitizeString,
        z
            .string()
            .max(200, "Gift message cannot exceed 200 characters")
            .optional()
    ),

    removeInvoice: z.boolean().default(false),
}).strict();

export type CheckoutSchema = z.infer<typeof checkoutSchema>;