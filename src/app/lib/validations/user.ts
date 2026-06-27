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

export const userSchema = z.object({
    name: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Name must be at least 3 characters long")
            .max(20, "Name must be at most 20 characters long")
            .transform(toTitleCase)
    ),
    username: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must be at most 30 characters long")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            )
            .transform((val) => val.toLowerCase())
    ),
    email: z.preprocess(
        sanitizeString,
        z
            .string()
            .email("Invalid email address")
            .transform((val) => val.toLowerCase())
    ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 characters long")
}).strict()

export function formatZodErrors(issues: any[]) {
    const errors: Record<string, string> = {}

    issues.forEach(((issue) => {
        const field = issue.path[0]

        if (field && !errors[field]) {
            errors[field] = issue.message
        }
    }))
    return errors
}

export const forgetPasswordSchema = z.object({
    email: z.preprocess(
        sanitizeString,
        z
            .string()
            .email("Invalid email address")
            .transform((val) => val.toLowerCase())
    )
}).strict()

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Invalid reset token"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 character long"),
    confirmPassword: z.string()
})
    .strict()
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match"
        }
    )

export const profileSchema = z.object({
    name: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Name must be at least 3 characters long")
            .max(20, "Name must be at most 20 characters long")
            .transform(toTitleCase)
    ),
    username: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must be at most 30 characters long")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            )
            .transform((val) => val.toLowerCase())
    ),
    image: z.string().nullable().optional()
}).strict()

export const addressSchema = z.object({
    fullname: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3, "Full name must be at least 3 characters long")
            .max(50, "Full name must be at most 50 characters long")
            .transform(toTitleCase)
    ),
    countryCode: z.preprocess(
        sanitizeString,
        z.string().regex(
            /^\+\d+(?:-\d+)?$/,
            "Invalid country code"
        )
    ),

    phone: z.preprocess(
        sanitizeString,
        z
            .string()
            .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    ),
    addressLine: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(5, "Address must be at least 5 characters long")
            .max(200, "Address must be at most 200 characters long")
    ),
    city: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(2, "City is required")
            .max(50, "City must be at most 50 characters long")
            .transform(toTitleCase)
    ),

    state: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(2, "State is required")
            .max(50, "State must be at most 50 characters long")
            .transform((val) => {
                return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
            })
    ),

    country: z.preprocess(
        sanitizeString,
        z
            .string()
            .min(2, "Country is required")
            .max(50, "Country must be at most 50 characters long")
            .transform(toTitleCase)
    ),

    postalCode: z.preprocess(
        sanitizeString,
        z
            .string()
            .regex(/^[0-9]{6}$/, "Postal code must be 6 digits")
    ),

    isDefault: z.boolean().optional()
}).strict()