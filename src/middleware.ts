import {NextRequest, NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
    console.log("Middleware Called");
    return;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/','/game'],
}