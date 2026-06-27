import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from './lib/auth';

export default async function proxy(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Proxy Auth Error:", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/tickets/:path'],
};






// import { NextResponse } from 'next/server'
 
// // This function can be marked `async` if using `await` inside
// export function proxy(request) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }
 
// // Alternatively, you can use a default export:
// // export default function proxy(request) { ... }
 
// export const config = {
//   matcher: '/about/:path*',
// }