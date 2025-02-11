import { NextResponse } from "next/server"

interface MiddlewareRequest {
    cookies: {
        get: (name: string) => { value: string } | undefined;
    };
    nextUrl: {
        pathname: string;
    };
    url: string;
}

export function middleware(request: MiddlewareRequest) {
    const token = request.cookies.get("token")?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create-order/:path*", "/login", "/register"],
}