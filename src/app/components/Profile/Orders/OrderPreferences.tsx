"use client";

type Props = {
  packagingOption?: string | null;
  giftMessage?: string | null;
  notes?: string | null;
  removeInvoice: boolean;
};

export default function OrderPreferences({
  packagingOption,
  giftMessage,
  notes,
  removeInvoice,
}: Props) {
  return (
    <div className="border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-6 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Order Preferences
        </h2>
        
      </div>

      <div className="grid grid-cols-2 gap-6 px-6 py-6">

  {packagingOption && (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        Packaging
      </p>

      <p className="mt-2 text-xs">
        {packagingOption}
      </p>
    </div>
  )}

  <div>
    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
      Invoice
    </p>

    <p className="mt-2 text-xs">
      {removeInvoice
        ? "Price removed from invoice"
        : "Invoice included"}
    </p>
  </div>

  {notes && (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        Delivery Instructions
      </p>

      <p className="mt-2 text-xs leading-6 text-neutral-700">
        {notes}
      </p>
    </div>
  )}

  {giftMessage && (
    <div className="col-span-2">
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        Gift Message
      </p>

      <p className="mt-2 whitespace-pre-line rounded-md border border-neutral-200 bg-neutral-50 p-4 text-xs leading-6 text-neutral-700">
        {giftMessage}
      </p>
    </div>
  )}

</div>

    </div>
  );
}