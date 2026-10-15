import { NextRequest, NextResponse } from "next/server";
import { SpotifyArtist } from "@/lib/mock-artists";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get("time_range") || "medium_term";

  const accessToken = request.cookies.get("spotify_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({
      authenticated: false,
      artists: [],
      message: "Usuário não conectado ao Spotify.",
    });
  }

  try {
    // 1. Busca perfil básico do usuário (para obter o primeiro nome para sugestões de festival)
    let displayName = "Meu";
    try {
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        displayName = userData.display_name?.split(" ")[0] || "Meu";
      }
    } catch {
      // Ignora erro no perfil se o endpoint de artistas funcionar
    }

    // 2. Busca top 50 artistas
    const artistsRes = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (artistsRes.status === 401) {
      // Token expirado
      return NextResponse.json(
        { authenticated: false, artists: [], message: "Sessão expirada. Conecte novamente." },
        { status: 401 }
      );
    }

    if (!artistsRes.ok) {
      const err = await artistsRes.text();
      console.error("Erro na busca de top artistas:", err);
      return NextResponse.json(
        { authenticated: false, artists: [], message: "Falha ao obter artistas." },
        { status: artistsRes.status }
      );
    }

    const data = await artistsRes.json();
    const items: SpotifyArtist[] = (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      genres: item.genres || [],
      popularity: item.popularity || 50,
      images: item.images || [],
      external_urls: item.external_urls || { spotify: "" },
    }));

    return NextResponse.json({
      authenticated: true,
      userName: displayName,
      artists: items,
    });
  } catch (error) {
    console.error("Erro no endpoint /api/spotify/top-artists:", error);
    return NextResponse.json(
      { authenticated: false, artists: [], message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
