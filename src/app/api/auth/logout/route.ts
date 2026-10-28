import { NextRequest, NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/spotify-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getAppBaseUrl(request.nextUrl.origin);
  const response = NextResponse.redirect(baseUrl);
  response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");

  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");
  response.cookies.delete("spotify_verifier");
  response.cookies.delete("spotify_auth_state");

  return response;
}
