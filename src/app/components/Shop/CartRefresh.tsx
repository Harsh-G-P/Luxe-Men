"use client";

import { useEffect } from "react";

export default function CartRefresh() {

    useEffect(() => {
        window.dispatchEvent(new Event("cartUpdated"));
    }, []);

    return null;
}