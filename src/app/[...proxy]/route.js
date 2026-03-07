import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function handler(request, { params }) {

  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proxyPath = params.proxy.join("/");
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  const targetUrl = `https://quietconnect-backend.onrender.com/${proxyPath}${
    queryString ? "?" + queryString : ""
  }`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      ...(request.method !== "GET" && { body: await request.text() }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;