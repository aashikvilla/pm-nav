import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth config (no Prisma adapter).
 * Used by middleware to validate JWT without hitting the database.
 */
export const authConfig: NextAuthConfig = {
  providers: [], // populated in auth.ts with full credentials+google
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}
