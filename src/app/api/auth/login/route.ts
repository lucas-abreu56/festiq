import { NextResponse } from "next/server";
import { generateRandomString, getSpotifyAuthUrl } from "@/lib/spotify-auth";

export async function GET() {
  const verifier = generateRandomString(64);
  const state = generateRandomString(16);
  const authUrl = getSpotifyAuthUrl(verifier, state);

  const response = NextResponse.redirect(authUrl);

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
