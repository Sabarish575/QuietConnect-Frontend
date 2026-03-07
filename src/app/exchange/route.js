import { NextResponse } from 'next/server';

export async function GET(request) {

    const {searchParams}=new URL(request.url);

    const tempToken=searchParams.get("token");
    const redirect=searchParams.get("redirect");

    if(!tempToken){
        return NextResponse.redirect(new URL("/?error=missing_token",request.url));
    }
    try {

   const response=await fetch(
        `https://quietconnect-backend.onrender.com/authExchange?token=${tempToken}`
    )

    if(!response.ok){
        return NextResponse.redirect(new URL("/?error=exchange_failed",request.url));
    }
    
    const { jwt }=await response.json();

    const destination=redirect==="set-username" ? "/set-username" : "/home";

    const redirectResponse=NextResponse.redirect(new URL(destination,request.url));

     redirectResponse.cookies.set("jwt", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    });

    return redirectResponse;
        
    } catch (error) {
        return NextResponse.redirect(new URL("/?error=server_error", request.url));
    }
}