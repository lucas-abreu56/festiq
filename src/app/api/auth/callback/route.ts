import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getAppBaseUrl } from "@/lib/spotify-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = getAppBaseUrl(request.nextUrl.origin);

  if (error || !code) {
    console.error("Spotify Auth error ou ausência de code:", error);
    const errRes = NextResponse.redirect(`${baseUrl}?auth_error=${encodeURIComponent(error || "cancelado")}`);
    errRes.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return errRes;
  }

  const verifier = request.cookies.get("spotify_verifier")?.value;
  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (!verifier || !state || state !== storedState) {
    console.error("Mismatch de verifier ou state");
    const mismatchRes = NextResponse.redirect(`${baseUrl}?auth_error=state_mismatch`);
    mismatchRes.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return mismatchRes;
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier, request.nextUrl.origin);
    const response = NextResponse.redirect(`${baseUrl}?connected=true`);
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");

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
    const failRes = NextResponse.redirect(`${baseUrl}?auth_error=token_exchange_failed`);
    failRes.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return failRes;
  }
}
