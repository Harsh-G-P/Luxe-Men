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
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">

      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
              Admin / Order Management
            </p>

            <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
              Order Specifications
            </h2>
          </div>

          <span className="shrink-0 text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Preferences
          </span>
        </div>
      </div>

      {/* Order Preferences */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-5 py-5 md:px-6">

        {/* Packaging */}
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Packaging Option
          </p>

          <p className="mt-1.5 font-serif text-[13px] text-[#1b1a18]">
            {packagingOption || "Not selected"}
          </p>
        </div>

        {/* Invoice */}
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Invoice Configuration
          </p>

          <p
            className={`mt-1.5 inline-flex items-center text-[9px] uppercase tracking-[0.12em] ${removeInvoice
                ? "text-[#9a6f63]"
                : "text-[#6f604e]"
              }`}
          >
            <span
              className={`mr-2 h-1.5 w-1.5 shrink-0 rounded-full ${removeInvoice
                  ? "bg-[#9a6f63]"
                  : "bg-[#9a8a74]"
                }`}
            />

            {removeInvoice
              ? "Price Hidden"
              : "Invoice Included"}
          </p>
        </div>

        {/* Delivery Instructions */}
        <div className="col-span-2 border-t border-[#eeece7] pt-5">
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Customer Delivery Instructions
          </p>

          <div className="mt-2 border-l border-[#d9d5cd] pl-3">
            <p className="whitespace-pre-line wrap-break-word text-[10px] leading-5 text-[#57534c]">
              {notes?.trim() || "No delivery instructions provided"}
            </p>
          </div>
        </div>

        {/* Gift Message */}
        <div className="col-span-2 border-t border-[#eeece7] pt-5">
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Gift Message
          </p>

          <div className="mt-2 border-l border-[#9a8a74] pl-3">
            <p className="whitespace-pre-line wrap-break-word font-serif text-[11px] leading-6 text-[#57534c]">
              {giftMessage?.trim() || "No gift message provided"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}