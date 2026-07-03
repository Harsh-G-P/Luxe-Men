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

export const categoryAttributeSchema = z.object({
  title: z.preprocess(
    sanitizeString,
    z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(20, "Title must be at most 20 characters long")
      .transform(toTitleCase)
  ),
  categoryId: z
    .string()
    .min(1, "Please select a category"),

  values: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((v) => v.trim().toUpperCase())
          .filter(Boolean);
      }
      return val;
    },
    z.array(
      z.preprocess(
        sanitizeString,
        z.string().min(1)
      )
    )
     .min(1, "At least one value is required")
    .max(20, "Maximum 20 values allowed")
  )

}).strict()