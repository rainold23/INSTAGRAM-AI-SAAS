import { prisma } from "@/lib/prisma";

export async function publishInstagramImage(accountId: string, imageUrl: string, caption: string) {
  const account = await prisma.instagramAccount.findUnique({ where: { id: accountId } });
  if (!account?.connected || !account.instagramId || !account.accessToken) throw new Error("Instagram account is not connected.");
  if (account.tokenExpiresAt && account.tokenExpiresAt <= new Date()) throw new Error("Instagram access token has expired. Reconnect the account.");

  const params = new URLSearchParams({ image_url: imageUrl, caption, access_token: account.accessToken });
  const createResponse = await fetch("https://graph.instagram.com/" + account.instagramId + "/media", { method: "POST", body: params });
  const container = await createResponse.json();
  if (!createResponse.ok || !container.id) throw new Error(container?.error?.message || "Instagram media container could not be created.");

  const publishParams = new URLSearchParams({ creation_id: container.id, access_token: account.accessToken });
  const publishResponse = await fetch("https://graph.instagram.com/" + account.instagramId + "/media_publish", { method: "POST", body: publishParams });
  const published = await publishResponse.json();
  if (!publishResponse.ok || !published.id) throw new Error(published?.error?.message || "Instagram publication failed.");
  return published.id as string;
}
