import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const protectedPaths = [
        "/dashboard",
        "/content",
        "/calendar",
        "/analytics",
        "/billing",
        "/admin",
      ];
      const isProtected = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      if (!isProtected) return true;
      return !!auth?.user;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
