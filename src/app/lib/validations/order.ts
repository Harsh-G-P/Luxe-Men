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

    cancellationStatus: z
      .enum([
        "NONE",
        "REQUESTED",
        "REJECTED",
      ])
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.status !== undefined ||
      data.paymentStatus !== undefined ||
      data.cancellationStatus !== undefined,
    {
      message: "Nothing to update",
    }
  );

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;