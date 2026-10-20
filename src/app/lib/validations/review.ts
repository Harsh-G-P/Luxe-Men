
import z from "zod";

function sanitizeString(val: unknown) {
    if (typeof val !== "string") return val;

    return val
        .trim()
        .replace(/\s+/g, " ")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export const reviewSchema = z.object({
    rating: z
        .number()
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),

    comment: z.preprocess(
        sanitizeString,
        z
            .string()
            .max(1000, "Comment must be at most 1000 characters long")
            .optional()
    ),
}).strict();
