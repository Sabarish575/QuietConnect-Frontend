import { cookies } from "next/headers";

export async function GET(){

    const cookieStore=cookies();
    const jwt=cookieStore.get("jwt").value;

    if(!jwt){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

     return NextResponse.json({ token: jwt });

}