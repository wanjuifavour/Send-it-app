import { NextResponse } from "next/server"

export function middleware(request) {
    const token = request.cookies.get("token")?.value
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")

    // if (!token && !isAuthPage) {
    //     return NextResponse.redirect(new URL("/login", request.url))
    // }

    // if (token && isAuthPage) {
    //     return NextResponse.redirect(new URL("/dashboard", request.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: [/*"/dashboard/:path*", "/login", "/register"*/],
}