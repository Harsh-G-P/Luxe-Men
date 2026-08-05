import z from "zod";

export const updateOrderSchema = z
  .object({
    status: z
      .enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ])
      .optional(),

    paymentStatus: z
      .enum([
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ])
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.status || data.paymentStatus,
    {
      message: "Nothing to update",
    }
  );

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;