import { NextResponse } from "next/server";


function middleware(request) {

    const token=request.cookies.get("token")?.value;

    const protectedRoutes = [
    "/home",
    "/profile",
    "/chat",
    "/communitypage",
    "/exploreCommunity"
  ];

  const isProtected=protectedRoutes.some((route)=>
    request.nextUrl.pathname.startsWith(route)
    );

    if(isProtected && !token){
        return NextResponse.redirect(new URL("/"),request.URL);
    }
}

export default middleware