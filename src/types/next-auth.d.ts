
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            role: string;
            username?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        role: string;
        name?: string | null;
        username?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        role?: string;
        name?: string | null;
        username?: string | null;
        loginTime?: number;
        expired?: boolean;
        userDeleted?: boolean;
    }
}