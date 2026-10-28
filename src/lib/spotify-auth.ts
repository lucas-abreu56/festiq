import crypto from "crypto";

export const SPOTIFY_SCOPES = [
  "user-top-read",
  "user-read-private",
  "user-read-recently-played",
  "user-follow-read",
].join(" ");

export function getAppBaseUrl(requestOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const base = configured || requestOrigin || "http://127.0.0.1:3000";
  return base.replace(/\/+$/, "");
}

export function generateRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return hash
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function getSpotifyAuthUrl(
  verifier: string,
  state: string,
  requestOrigin?: string
): string {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = `${getAppBaseUrl(requestOrigin)}/api/auth/callback`;
  const codeChallenge = generateCodeChallenge(verifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId || "",
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  verifier: string,
  requestOrigin?: string
) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = `${getAppBaseUrl(requestOrigin)}/api/auth/callback`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId || "",
    code_verifier: verifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // Se tiver clientSecret disponível, adiciona autenticação Basic
  if (clientId && clientSecret) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${basic}`;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers,
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao trocar código por token:", errorText);
    throw new Error(`Falha na autenticação Spotify: ${response.statusText}`);
  }

  return response.json();
}

export async function refreshSpotifyAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId || "",
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientId && clientSecret) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${basic}`;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers,
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao renovar access_token do Spotify:", errorText);
    return null;
  }

  return response.json();
}
