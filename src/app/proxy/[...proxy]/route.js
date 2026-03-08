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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      signal: controller.signal,
      ...(request.method !== "GET" && { body: await request.text() }),
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    return NextResponse.json(
      typeof data === "string" ? { message: data } : data,
      { status: response.status }
    );

  } catch (err) {
    "Proxy error:", err.message);
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Backend is waking up, please retry" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;