import { NextRequest, NextResponse } from "next/server";
import { SpotifyArtist } from "@/lib/mock-artists";

export const dynamic = "force-dynamic";

function extractPlaylistId(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  // 1. ID direto (22 caracteres alfanuméricos)
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. URI do Spotify (spotify:playlist:ID)
  const uriMatch = trimmed.match(/spotify:playlist:([a-zA-Z0-9]{22})/);
  if (uriMatch) return uriMatch[1];

  // 3. URLs web do Spotify (open.spotify.com/.../playlist/ID)
  const urlMatch = trimmed.match(/\/playlist\/([a-zA-Z0-9]{22})/);
  if (urlMatch) return urlMatch[1];

  return null;
}

function parseArtistNames(subtitle: string): string[] {
  if (!subtitle) return [];
  // Normaliza espaços não-quebráveis do Spotify (\u00a0)
  const normalized = subtitle.replace(/\u00a0/g, " ");

  // Divide por vírgulas ou ponto-e-vírgula
  return normalized
    .split(/,|\/|;/g)
    .map((name) => name.trim())
    .filter((name) => name.length > 0 && !/^feat\.?$/i.test(name));
}

function generateArtistId(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = Buffer.from(name.trim()).toString("base64url").slice(0, 10);
  return `pl-${clean.slice(0, 8)}-${base}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || searchParams.get("id");

  if (!rawUrl) {
    return NextResponse.json(
      {
        authenticated: false,
        artists: [],
        message: "Informe a URL ou o ID de uma playlist pública do Spotify.",
      },
      { status: 400 }
    );
  }

  const playlistId = extractPlaylistId(rawUrl);
  if (!playlistId) {
    return NextResponse.json(
      {
        authenticated: false,
        artists: [],
        message:
          "Link de playlist inválido. Copie o link completo da playlist no Spotify (ex: https://open.spotify.com/playlist/...).",
      },
      { status: 400 }
    );
  }

  try {
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
    const res = await fetch(embedUrl, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message:
            "Não foi possível acessar a playlist no Spotify. Verifique se a playlist é pública.",
        },
        { status: 404 }
      );
    }

    const html = await res.text();
    const nextDataIndex = html.indexOf("__NEXT_DATA__");
    if (nextDataIndex === -1) {
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message: "Formato de dados do Spotify incompatível ou playlist indisponível.",
        },
        { status: 502 }
      );
    }

    const scriptStart = html.indexOf(">", nextDataIndex) + 1;
    const scriptEnd = html.indexOf("</script>", scriptStart);
    if (scriptStart === 0 || scriptEnd === -1) {
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message: "Falha ao extrair dados da playlist do Spotify.",
        },
        { status: 502 }
      );
    }

    const rawJson = html.slice(scriptStart, scriptEnd);
    const parsed = JSON.parse(rawJson);
    const entity = parsed?.props?.pageProps?.state?.data?.entity;

    if (!entity) {
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message: "Playlist não encontrada ou sem faixas públicas.",
        },
        { status: 404 }
      );
    }

    const playlistName = (entity.name || entity.title || "Playlist").trim();
    const trackList = Array.isArray(entity.trackList) ? entity.trackList : [];

    if (trackList.length === 0) {
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message: "Esta playlist do Spotify está vazia.",
        },
        { status: 400 }
      );
    }

    // Contabiliza frequência e primeira aparição de cada artista
    const artistStats = new Map<
      string,
      { originalName: string; count: number; firstSeenIndex: number }
    >();

    trackList.forEach((track: any, trackIndex: number) => {
      const names = parseArtistNames(track.subtitle || "");
      names.forEach((name) => {
        const key = name.toLowerCase().trim();
        const existing = artistStats.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          artistStats.set(key, {
            originalName: name,
            count: 1,
            firstSeenIndex: trackIndex,
          });
        }
      });
    });

    // Ordena artistas: mais faixas na playlist primeiro; desempate pela ordem das faixas
    const sorted = Array.from(artistStats.values()).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.firstSeenIndex - b.firstSeenIndex;
    });

    const artists: SpotifyArtist[] = sorted.slice(0, 45).map((item, index) => {
      const popularityScore = Math.max(50, Math.min(98, 95 - index));
      return {
        id: generateArtistId(item.originalName),
        name: item.originalName,
        genres: [],
        popularity: popularityScore,
        images: [],
        external_urls: { spotify: "" },
      };
    });

    const response = NextResponse.json({
      authenticated: true,
      source: "spotify_playlist",
      playlistName,
      playlistId,
      totalTracks: trackList.length,
      artists,
    });
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return response;
  } catch (err) {
    console.error("Erro ao processar playlist do Spotify:", err);
    return NextResponse.json(
      {
        authenticated: false,
        artists: [],
        message: "Erro interno ao processar a playlist do Spotify.",
      },
      { status: 500 }
    );
  }
}
