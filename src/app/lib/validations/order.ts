
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

    refundStatus: z
      .enum([
        "NONE",
        "REQUESTED",
        "REJECTED",
        "REFUNDED",
      ])
      .optional(),

    refundReason: z
      .string()
      .trim()
      .min(5, "Refund reason must be at least 5 characters")
      .max(500, "Refund reason is too long")
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.status !== undefined ||
      data.paymentStatus !== undefined ||
      data.cancellationStatus !== undefined ||
      data.refundStatus !== undefined ||
      data.refundReason !== undefined,
    {
      message: "Nothing to update",
    }
  );

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;


export const refundRequestSchema = z.object({
  refundReason: z
    .string()
    .trim()
    .min(5, "Refund reason must be at least 5 characters")
    .max(500, "Refund reason is too long"),
});

export type RefundRequestSchema = z.infer<
  typeof refundRequestSchema
>;
