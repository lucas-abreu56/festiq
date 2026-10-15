import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    console.error("Spotify Auth error ou ausência de code:", error);
    return NextResponse.redirect(`${baseUrl}?auth_error=${encodeURIComponent(error || "cancelado")}`);
  }

  const verifier = request.cookies.get("spotify_verifier")?.value;
  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (!verifier || !state || state !== storedState) {
    console.error("Mismatch de verifier ou state");
    return NextResponse.redirect(`${baseUrl}?auth_error=state_mismatch`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);
    const response = NextResponse.redirect(`${baseUrl}?connected=true`);

    // Armazena access_token e refresh_token em cookies protegidos
    response.cookies.set("spotify_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in || 3600,
    });

    if (tokens.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    // Limpa os cookies temporários de autenticação
    response.cookies.delete("spotify_verifier");
    response.cookies.delete("spotify_auth_state");

    return response;
  } catch (err) {
    console.error("Falha ao obter tokens:", err);
    return NextResponse.redirect(`${baseUrl}?auth_error=token_exchange_failed`);
  }
}
