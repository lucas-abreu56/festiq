import { NextRequest, NextResponse } from "next/server";
import { SpotifyArtist } from "@/lib/mock-artists";

export const dynamic = "force-dynamic";

// Chave pública de leitura de estatísticas do Audioscrobbler/Last.fm
const DEFAULT_LASTFM_KEY = "2c685b31e32f1d72e42c6f23e232978e";

function mapLastFmPeriod(timeRange: string): string {
  switch (timeRange) {
    case "short_term":
      return "1month";
    case "medium_term":
      return "6month";
    case "long_term":
    default:
      return "overall";
  }
}

function generateLastFmArtistId(name: string, mbid?: string): string {
  if (mbid && mbid.trim()) return `lfm-${mbid.trim()}`;
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = Buffer.from(name.trim()).toString("base64url").slice(0, 8);
  return `lfm-${clean.slice(0, 8)}-${base}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user")?.trim();
  const timeRange = searchParams.get("time_range") || "medium_term";

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
        artists: [],
        message: "Informe o nome de usuário do Last.fm.",
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.LASTFM_API_KEY?.trim() || DEFAULT_LASTFM_KEY;
  const period = mapLastFmPeriod(timeRange);

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${encodeURIComponent(
      user
    )}&period=${period}&limit=50&api_key=${apiKey}&format=json`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "FestiqStudio/1.0",
      },
    });

    const data = await res.json();

    if (data.error) {
      if (data.error === 6) {
        return NextResponse.json(
          {
            authenticated: false,
            artists: [],
            message: `Usuário '${user}' não encontrado no Last.fm. Verifique a grafia do nome de usuário.`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          authenticated: false,
          artists: [],
          message: data.message || "Erro ao consultar o Last.fm.",
        },
        { status: 400 }
      );
    }

    let rawArtists: any[] = data?.topartists?.artist || [];

    // Se o período específico (ex: 1 mês) tiver poucos dados, tenta complementar com 'overall'
    if (rawArtists.length < 15 && period !== "overall") {
      try {
        const fbUrl = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${encodeURIComponent(
          user
        )}&period=overall&limit=50&api_key=${apiKey}&format=json`;
        const fbRes = await fetch(fbUrl, { cache: "no-store" });
        const fbData = await fbRes.json();
        const fbArtists: any[] = fbData?.topartists?.artist || [];

        const seenNames = new Set(rawArtists.map((a) => a.name.toLowerCase().trim()));
        for (const art of fbArtists) {
          const key = art.name.toLowerCase().trim();
          if (!seenNames.has(key)) {
            seenNames.add(key);
            rawArtists.push(art);
          }
        }
      } catch {
        // Mantém os artistas que já tinha
      }
    }

    if (rawArtists.length === 0) {
      return NextResponse.json(
        {
          authenticated: true,
          source: "lastfm",
          userName: user,
          artists: [],
          message: `O usuário '${user}' ainda não possui histórico de escuta registrado no Last.fm.`,
        },
        { status: 200 }
      );
    }

    const artists: SpotifyArtist[] = rawArtists.slice(0, 45).map((item, index) => {
      const score = Math.max(50, Math.min(99, 98 - index));
      return {
        id: generateLastFmArtistId(item.name, item.mbid),
        name: item.name,
        genres: [],
        popularity: score,
        images: [],
        external_urls: {
          spotify: "",
        },
      };
    });

    const response = NextResponse.json({
      authenticated: true,
      source: "lastfm",
      userName: user,
      timeRange,
      artists,
    });
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return response;
  } catch (err) {
    console.error("Erro na API do Last.fm:", err);
    return NextResponse.json(
      {
        authenticated: false,
        artists: [],
        message: "Erro interno ao consultar o serviço do Last.fm.",
      },
      { status: 500 }
    );
  }
}
