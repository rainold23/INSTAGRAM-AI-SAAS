import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers.get("cookie")?.match(/(?:^|; )ig_oauth_state=([^;]+)/)?.[1];
  if (!session?.user?.id) return NextResponse.redirect(new URL("/login", url));
  if (!code || !state || !cookieState || state !== cookieState) return NextResponse.redirect(new URL("/dashboard?instagram=error", url));

  const appId = process.env.META_APP_ID, secret = process.env.META_APP_SECRET, redirect = process.env.META_REDIRECT_URI;
  if (!appId || !secret || !redirect) return NextResponse.redirect(new URL("/dashboard?instagram=error", url));

  try {
    const form = new URLSearchParams({ client_id: appId, client_secret: secret, grant_type: "authorization_code", redirect_uri: redirect, code });
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    const short = await tokenResponse.json();
    if (!tokenResponse.ok || !short.access_token) throw new Error("token exchange failed");

    const longResponse = await fetch("https://graph.instagram.com/access_token?" + new URLSearchParams({ grant_type: "ig_exchange_token", client_secret: secret, access_token: short.access_token }));
    const long = await longResponse.json();
    const accessToken = long.access_token || short.access_token;
    const expiresIn = Number(long.expires_in || short.expires_in || 3600);

    const profileResponse = await fetch("https://graph.instagram.com/me?fields=id,username&access_token=" + encodeURIComponent(accessToken));
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.id) throw new Error("profile lookup failed");

    const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } });
    if (!membership) throw new Error("workspace not found");

    await prisma.instagramAccount.upsert({
      where: { id: profile.id },
      update: { instagramId: profile.id, username: profile.username, accessToken, tokenExpiresAt: new Date(Date.now() + expiresIn * 1000), connected: true, userId: session.user.id, workspaceId: membership.workspaceId },
      create: { id: profile.id, instagramId: profile.id, username: profile.username, accessToken, tokenExpiresAt: new Date(Date.now() + expiresIn * 1000), connected: true, userId: session.user.id, workspaceId: membership.workspaceId }
    });

    const response = NextResponse.redirect(new URL("/dashboard?instagram=connected", url));
    response.cookies.delete("ig_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/dashboard?instagram=error", url));
  }
}
