
"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

export default function SessionWatcher() {
    const { data: session, status } = useSession();
    const signingOut = useRef(false);

    useEffect(() => {
        // Wait until NextAuth has finished checking the session
        if (status !== "authenticated") {
            return;
        }

        // User was deleted / session was invalidated
        if (!session?.user?.id && !signingOut.current) {
            signingOut.current = true;

            signOut({
                callbackUrl: "/login",
            });
        }
    }, [session, status]);

    return null;
}
