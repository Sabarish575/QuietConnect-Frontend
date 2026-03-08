import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){

    const cookieStore=await cookies();
    const jwt=cookieStore.get("jwt")?.value;

    if(!jwt){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

     return NextResponse.json({ token: jwt });

}