import { NextRequest, NextResponse } from "next/server";
import { SpotifyArtist } from "@/lib/mock-artists";
import { refreshSpotifyAccessToken } from "@/lib/spotify-auth";

export const dynamic = "force-dynamic";

const ALL_TIME_RANGES = ["medium_term", "long_term", "short_term"] as const;

function mapSpotifyArtist(item: any): SpotifyArtist {
  return {
    id: item.id,
    name: item.name,
    genres: Array.isArray(item.genres) ? item.genres : [],
    popularity: typeof item.popularity === "number" ? item.popularity : 50,
    images: Array.isArray(item.images) ? item.images : [],
    external_urls: item.external_urls || { spotify: "" },
  };
}

function attachNoStoreAndCookies(
  response: NextResponse,
  refreshedTokens: { access_token: string; expires_in?: number; refresh_token?: string } | null
) {
  response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  if (refreshedTokens?.access_token) {
    response.cookies.set("spotify_access_token", refreshedTokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: refreshedTokens.expires_in || 3600,
    });
    if (refreshedTokens.refresh_token) {
      response.cookies.set("spotify_refresh_token", refreshedTokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedRange = searchParams.get("time_range") || "medium_term";
  const timeRange = ALL_TIME_RANGES.includes(requestedRange as any)
    ? requestedRange
    : "medium_term";

  let accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
  let refreshedTokens: { access_token: string; expires_in?: number; refresh_token?: string } | null = null;

  // Se o access_token expirou mas existe refresh_token válido, renova automaticamente
  if (!accessToken && refreshToken) {
    refreshedTokens = await refreshSpotifyAccessToken(refreshToken);
    if (refreshedTokens?.access_token) {
      accessToken = refreshedTokens.access_token;
    }
  }

  if (!accessToken) {
    return attachNoStoreAndCookies(
      NextResponse.json({
        authenticated: false,
        artists: [],
        message: "Usuário não conectado ao Spotify.",
      }),
      null
    );
  }

  try {
    // 1. Busca perfil do usuário conectado (e valida se o token não está expirado/403)
    let userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // Se retornou 401 e temos refresh_token, tenta renovar uma vez
    if (userRes.status === 401 && refreshToken && !refreshedTokens) {
      refreshedTokens = await refreshSpotifyAccessToken(refreshToken);
      if (refreshedTokens?.access_token) {
        accessToken = refreshedTokens.access_token;
        userRes = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
      }
    }

    if (userRes.status === 403) {
      const errBody = await userRes.text();
      console.error("Spotify 403 em /v1/me (restrição Quota/Development Mode):", errBody);
      return attachNoStoreAndCookies(
        NextResponse.json(
          {
            authenticated: false,
            errorCode: "SPOTIFY_USER_NOT_ALLOWED",
            artists: [],
            message:
              "Esta conta ainda não está liberada no painel da API do Spotify. Enquanto o app estiver em Development Mode no Spotify Dashboard, apenas e-mails adicionados em User Management são autorizados pela Spotify API.",
          },
          { status: 403 }
        ),
        refreshedTokens
      );
    }

    let displayName = "Meu";
    if (userRes.ok) {
      try {
        const userData = await userRes.json();
        displayName = userData.display_name?.trim()?.split(" ")[0] || "Meu";
      } catch {
        // Mantém fallback "Meu"
      }
    }

    // 2. Busca top 50 artistas no período solicitado
    const artistsRes = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    if (artistsRes.status === 401) {
      return attachNoStoreAndCookies(
        NextResponse.json(
          {
            authenticated: false,
            errorCode: "SPOTIFY_SESSION_EXPIRED",
            artists: [],
            message: "Sessão expirada. Conecte novamente ao Spotify.",
          },
          { status: 401 }
        ),
        null
      );
    }

    if (artistsRes.status === 403) {
      const errBody = await artistsRes.text();
      console.error("Spotify 403 em /v1/me/top/artists (restrição Quota/Development Mode):", errBody);
      return attachNoStoreAndCookies(
        NextResponse.json(
          {
            authenticated: false,
            errorCode: "SPOTIFY_USER_NOT_ALLOWED",
            artists: [],
            message:
              "Esta conta ainda não está liberada no painel da API do Spotify. Enquanto o app estiver em Development Mode no Spotify Dashboard, apenas e-mails adicionados em User Management são autorizados pela Spotify API.",
          },
          { status: 403 }
        ),
        refreshedTokens
      );
    }

    if (!artistsRes.ok) {
      const err = await artistsRes.text();
      console.error("Erro na busca de top artistas:", err);
      return attachNoStoreAndCookies(
        NextResponse.json(
          {
            authenticated: false,
            errorCode: "SPOTIFY_API_ERROR",
            artists: [],
            message: "Falha ao obter artistas do Spotify.",
          },
          { status: artistsRes.status }
        ),
        refreshedTokens
      );
    }

    const data = await artistsRes.json();
    const seenIds = new Set<string>();
    const items: SpotifyArtist[] = [];

    for (const raw of data.items || []) {
      if (raw?.id && !seenIds.has(raw.id)) {
        seenIds.add(raw.id);
        items.push(mapSpotifyArtist(raw));
      }
    }

    // 3. Cascata de períodos: se a conta tiver poucos artistas no período atual (< 15),
    // complementa automaticamente com os outros períodos da PRÓPRIA conta do usuário
    if (items.length < 15) {
      const fallbackRanges = ALL_TIME_RANGES.filter((r) => r !== timeRange);
      for (const fbRange of fallbackRanges) {
        if (items.length >= 45) break;
        try {
          const fbRes = await fetch(
            `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${fbRange}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              cache: "no-store",
            }
          );
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            for (const raw of fbData.items || []) {
              if (raw?.id && !seenIds.has(raw.id)) {
                seenIds.add(raw.id);
                items.push(mapSpotifyArtist(raw));
              }
            }
          }
        } catch {
          // Ignora falha em período secundário
        }
      }
    }

    // 4. Fallback adicional para contas recém-criadas: artistas seguidos ou faixas recentes
    if (items.length === 0) {
      try {
        const followedRes = await fetch(
          "https://api.spotify.com/v1/me/following?type=artist&limit=50",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        if (followedRes.ok) {
          const followedData = await followedRes.json();
          for (const raw of followedData?.artists?.items || []) {
            if (raw?.id && !seenIds.has(raw.id)) {
              seenIds.add(raw.id);
              items.push(mapSpotifyArtist(raw));
            }
          }
        }
      } catch {
        // Ignora se escopo não estiver presente no token antigo
      }
    }

    if (items.length === 0) {
      try {
        const recentRes = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=50",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          for (const playItem of recentData?.items || []) {
            const trackArtists = playItem?.track?.artists || [];
            for (const art of trackArtists) {
              if (art?.id && art?.name && !seenIds.has(art.id)) {
                seenIds.add(art.id);
                items.push({
                  id: art.id,
                  name: art.name,
                  genres: [],
                  popularity: playItem?.track?.popularity || 65,
                  images: playItem?.track?.album?.images || [],
                  external_urls: art.external_urls || { spotify: "" },
                });
              }
            }
          }
        }
      } catch {
        // Ignora se escopo não estiver presente no token antigo
      }
    }

    return attachNoStoreAndCookies(
      NextResponse.json({
        authenticated: true,
        userName: displayName,
        artists: items,
      }),
      refreshedTokens
    );
  } catch (error) {
    console.error("Erro no endpoint /api/spotify/top-artists:", error);
    return attachNoStoreAndCookies(
      NextResponse.json(
        {
          authenticated: false,
          errorCode: "INTERNAL_ERROR",
          artists: [],
          message: "Erro interno no servidor ao consultar o Spotify.",
        },
        { status: 500 }
      ),
      null
    );
  }
}
