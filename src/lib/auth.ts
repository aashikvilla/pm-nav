import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { profile: true },
        })

        if (!user || !user.email) return null

        // Check if this user has a password (credentials account)
        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "credentials" },
        })

        if (!account?.access_token) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          account.access_token // we store hash in access_token for credentials
        )

        if (!passwordMatch) return null

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Only run for OAuth providers (not credentials)
      if (account?.provider === "credentials") return true
      if (!user.id) return true

      try {
        // Create profile + streak for first-time users
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        })
        if (!existingProfile) {
          await prisma.profile.create({
            data: { userId: user.id, onboardingStep: 0, onboardingCompleted: false },
          })
          await prisma.userStreak.create({ data: { userId: user.id } })
        }
      } catch (err) {
        console.error("[auth] signIn callback error:", err)
        // Don't block sign-in if profile creation fails
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After sign-in, check onboarding state
      if (url.startsWith(baseUrl) || url.startsWith("/")) return url
      return baseUrl + "/dashboard"
    },
  },
})
