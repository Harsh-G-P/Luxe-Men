"use client";

import Link from "next/link";

export default function ProductActions() {
    return (
        <div className="px-7">
            <div className="mt-2 space-y-1">

                <p className="text-[9px] text-gray-500">
                    Complimentary express shipping with Signature Luxe Men packaging included.
                </p>


                <p className="text-[9px] text-gray-500">
                    <Link
                        href="/contact?tab=size-guide"
                        className="
                            cursor-pointer
                            underline
                            underline-offset-2
                            transition-opacity
                            hover:opacity-50
                        "
                    >
                        Size Guide
                    </Link>
                    <br />
                    Find the perfect fit with our detailed sizing guide.
                </p>

                <p className="text-[9px] text-gray-500">
                    <Link
                        href="/contact"
                        className="
                            cursor-pointer
                            underline
                            underline-offset-2
                            transition-opacity
                            hover:opacity-50
                        "
                    >
                        Contact Luxe Men
                    </Link>
                </p>

                <p className="text-[9px] text-gray-500">
                    Luxe Men Services: Complimentary Shipping, Secure Payments and Premium Packaging.
                </p>

            </div>
        </div>
    );
}
