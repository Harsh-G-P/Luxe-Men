import z from "zod";

function sanitizeString(val: unknown) {
    if (typeof val !== "string") return val

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

export const categorySchema = z.object({
    title: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Title must be at least 3 characters long")
            .max(20, "Title must be at most 20 characters long")
            .transform(toTitleCase)
    )
}).strict()