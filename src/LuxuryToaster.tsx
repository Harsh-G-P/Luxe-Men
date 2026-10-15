
"use client";

import {
    Toaster,
    type ToastClassnames,
} from "sonner";

const luxuryToastClasses: ToastClassnames = {
    toast: `
        !relative
        !flex
        !items-start
        !gap-3
        !overflow-hidden
        !rounded-none
        !border
        !border-[#dedbd4]
        !bg-[#faf9f6]
        !px-4
        !py-3.5
        !text-[#1b1a18]
        !shadow-[0_5px_18px_rgba(27,26,24,0.07)]
        before:absolute
        before:inset-y-0
        before:left-0
        before:w-[2px]
        before:bg-[#b49a6c]
    `,
    content: "!flex !min-w-0 !flex-1 !flex-col !gap-0.5",
    title: `
        !font-serif
        !text-[14px]
        !font-normal
        !leading-snug
        !tracking-[0.01em]
        !text-[#1b1a18]
    `,
    description: `
        !mt-0.5
        !text-[11px]
        !leading-relaxed
        !tracking-[0.015em]
        !text-[#817d75]
    `,
    icon: "!mt-0.5 !flex !shrink-0 !items-center !justify-center",
    loader: "!border-[#e2ded4] !border-t-[#9b8150]",
    closeButton: `
        !static
        !left-auto
        !right-auto
        !top-auto
        !ml-1
        !flex
        !h-5
        !w-5
        !shrink-0
        !items-center
        !justify-center
        !rounded-none
        !border
        !border-[#e2ded4]
        !bg-transparent
        !text-[#817d75]
        !shadow-none
        hover:!border-[#b49a6c]
        hover:!bg-[#f0ece3]
        hover:!text-[#6f604e]
    `,
    success: "!border-l-[#68795c]",
    error: "!border-l-[#956d60]",
    warning: "!border-l-[#b49a6c]",
    info: "!border-l-[#9b8150]",
    loading: "!border-l-[#9b8150]",
    default: "!border-l-[#c8bb94]",
};

function LuxuryToastIcon() {
    return (
        <span
            className="
                mt-0.5
                flex
                h-10
                w-10
                shrink-0
                flex-col
                items-center
                justify-center
                text-[#9b8150]
            "
            aria-label="Luxe Men"
        >
            <span className="font-serif text-[11px] leading-none tracking-[-0.08em]">
                LM
            </span>
            <span className="mt-1 h-px w-4 bg-[#b49a6c]" />
        </span>
    );
}

export default function LuxuryToaster() {
    return (
        <Toaster
            position="top-right"
            theme="light"
            richColors={false}
            closeButton
            expand={false}
            visibleToasts={2}
            duration={3000}
            gap={8}
            offset={20}
            mobileOffset={12}
            icons={{
                success: <LuxuryToastIcon />,
                error: <LuxuryToastIcon />,
                warning: <LuxuryToastIcon />,
                info: <LuxuryToastIcon />,
                loading: <LuxuryToastIcon />,
            }}
            toastOptions={{
                classNames: luxuryToastClasses,
                duration: 3000,
            }}
        />
    );
}