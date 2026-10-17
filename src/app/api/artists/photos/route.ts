import { NextRequest, NextResponse } from "next/server";

/**
 * Rota pública que busca retratos oficiais de artistas via Deezer Public API
 * (sem necessidade de chave de API ou login), garantindo que qualquer artista
 * sem foto receba sua imagem real.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json({ imageUrl: null }, { status: 400 });
  }

  try {
    const query = encodeURIComponent(name);
    const res = await fetch(`https://api.deezer.com/search/artist?q=${query}&limit=1`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const data = await res.json();
    const artist = data?.data?.[0];
    const imageUrl = artist?.picture_big || artist?.picture_medium || null;

    return NextResponse.json({
      name,
      imageUrl,
    });
  } catch {
    return NextResponse.json({ imageUrl: null });
  }
}
