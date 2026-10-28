import { NextRequest, NextResponse } from "next/server";
import { generateRandomString, getSpotifyAuthUrl } from "@/lib/spotify-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const verifier = generateRandomString(64);
  const state = generateRandomString(16);
  const authUrl = getSpotifyAuthUrl(verifier, state, request.nextUrl.origin);

  const response = NextResponse.redirect(authUrl);
  response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");

  // Limpa qualquer token residual de conta anterior antes de iniciar novo fluxo OAuth
  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");

  // Armazena verifier e state em cookies seguros HTTP-Only para conferência no callback
  response.cookies.set("spotify_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutos
  });

  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
