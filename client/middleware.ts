import { NextRequest, NextResponse } from 'next/server';
import { getRoleFromToken, verifyToken } from './helpers/authHelper';
import { HOME_LINK, LOGIN_LINK, PROTECTED_BUYER_Link, PROTECTED_SELLER_Link, SIGNUP_LINK, UNAUTHORIZE_LINK, USER_ROLE_BUYER, USER_ROLE_SELLER } from './constants';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    const role = getRoleFromToken(token);
    const isTokenValid = verifyToken(token);

    const loggedInUserNotAccessible = [LOGIN_LINK, SIGNUP_LINK, HOME_LINK];
    const protectedRoutes = [PROTECTED_BUYER_Link, PROTECTED_SELLER_Link];

    if (loggedInUserNotAccessible.includes(pathname) && token && isTokenValid) {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    if (protectedRoutes.includes(pathname) && !token && !isTokenValid) {
        return NextResponse.redirect(new URL(LOGIN_LINK, request.url));
    }

    if (pathname.startsWith(PROTECTED_BUYER_Link) && role !== USER_ROLE_BUYER) {
        return NextResponse.redirect(new URL(UNAUTHORIZE_LINK, request.url));
    }

    if (pathname.startsWith(PROTECTED_SELLER_Link) && role !== USER_ROLE_SELLER) {
        return NextResponse.redirect(new URL(UNAUTHORIZE_LINK, request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/:path*'],
};
