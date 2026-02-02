import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware can be used for additional security if needed
  // For now, admin authentication is handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
