import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const appId = process.env.META_APP_ID;
  const redirect = process.env.META_REDIRECT_URI;
  if (!appId || !redirect) return NextResponse.json({ error: "Meta/Instagram no está configurado." }, { status: 503 });
  const state = crypto.randomBytes(24).toString("hex");
  const params = new URLSearchParams({
    client_id: appId, redirect_uri: redirect, response_type: "code",
    scope: "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_comments,instagram_business_manage_messages",
    enable_fb_login: "0", state
  });
  const response = NextResponse.json({ url: "https://www.instagram.com/oauth/authorize?" + params.toString() });
  response.cookies.set("ig_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return response;
}
