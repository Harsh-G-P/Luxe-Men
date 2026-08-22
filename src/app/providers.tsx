"use client"

import { SessionProvider} from "next-auth/react";
import SessionWatcher from "./lib/SessionWatcher";

export default function Providers({children}:{children :React.ReactNode}) {
    return (
        <SessionProvider refetchInterval={30}>
            <SessionWatcher />
            {children}
        </SessionProvider>
    );
}