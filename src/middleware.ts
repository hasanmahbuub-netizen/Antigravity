import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Temporarily disabled to test login
    // Will re-enable after confirming login works
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/quran/:path*', '/fiqh/:path*', '/settings/:path*', '/onboarding/:path*'],
}
