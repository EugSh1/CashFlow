import { type NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const publicRoutes = ["/", "/log-in", "/register"];
    const token = req.cookies.get("token");
    const isAuthenticated = !!token;

    if (!isAuthenticated && !publicRoutes.includes(req.nextUrl.pathname)) {
        const newUrl = new URL("/log-in", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
