import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const protectedPaths = ["/dashboard", "/onboarding"]
const authPaths = ["/login", "/signup"]

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user
  const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAuthPage = authPaths.some((p) => nextUrl.pathname.startsWith(p))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
