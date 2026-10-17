import { SpotifyArtist, MOCK_ARTISTS } from "./mock-artists";

export type FestivalThemeId = "lolla" | "festify" | "tropical" | "retro";
export type CreationMode = "taste" | "genre" | "popularity";
export type TimeRange = "short_term" | "medium_term" | "long_term";
export type PosterAspectRatio = "9:16" | "1:1";

export interface FestivalDay {
  dayLabel: string;
  dateLabel: string;
  headliner: SpotifyArtist;
  coHeadliners: SpotifyArtist[];
  undercard: SpotifyArtist[];
}

export interface FestivalLineup {
  title: string;
  subtitle: string;
  themeId: FestivalThemeId;
  mode: CreationMode;
  timeRange: TimeRange;
  aspectRatio: PosterAspectRatio;
  days: FestivalDay[];
  allArtists: SpotifyArtist[];
  singleStageHeadliners: SpotifyArtist[];
  singleStageSubHeadliners: SpotifyArtist[];
  singleStageUndercard: SpotifyArtist[];
}

/**
 * Remove duplicatas garantindo integridade
 */
export function deduplicateArtists(artists: SpotifyArtist[]): SpotifyArtist[] {
  const seen = new Set<string>();
  return artists.filter((a) => {
    if (seen.has(a.id) || seen.has(a.name.toLowerCase().trim())) {
      return false;
    }
    seen.add(a.id);
    seen.add(a.name.toLowerCase().trim());
    return true;
  });
}

/**
 * Filtra e enriquece artistas por gênero musical
 */
export function filterArtistsByGenre(
  artists: SpotifyArtist[],
  targetGenre: string
): SpotifyArtist[] {
  const normalizedTarget = targetGenre.toLowerCase();
  const matched = artists.filter((a) =>
    a.genres.some((g) => g.toLowerCase().includes(normalizedTarget))
  );

  // Se tiver menos de 20, complementa do mock geral filtrado pelo gênero
  if (matched.length < 20) {
    const fallbackFromMock = MOCK_ARTISTS.filter((a) =>
      a.genres.some((g) => g.toLowerCase().includes(normalizedTarget))
    );
    return deduplicateArtists([...matched, ...fallbackFromMock]);
  }

  return matched;
}

/**
 * Organiza artistas por pontuação de popularidade
 */
export function sortArtistsByPopularity(artists: SpotifyArtist[]): SpotifyArtist[] {
  return [...artists].sort((a, b) => b.popularity - a.popularity);
}

/**
 * Constrói a estrutura equilibrada do festival
 */
export function buildFestivalLineup({
  artists,
  festivalName = "FESTIQ SESSIONS",
  themeId = "lolla",
  mode = "taste",
  timeRange = "medium_term",
  aspectRatio = "9:16",
  targetGenre,
}: {
  artists: SpotifyArtist[];
  festivalName?: string;
  themeId?: FestivalThemeId;
  mode?: CreationMode;
  timeRange?: TimeRange;
  aspectRatio?: PosterAspectRatio;
  targetGenre?: string;
}): FestivalLineup {
  let processed = deduplicateArtists(artists.length > 0 ? artists : MOCK_ARTISTS);

  if (mode === "genre" && targetGenre) {
    processed = filterArtistsByGenre(processed, targetGenre);
  } else if (mode === "popularity") {
    processed = sortArtistsByPopularity(processed);
  }

  // Se ainda tiver menos de 30 artistas, completa com o mock
  if (processed.length < 30) {
    processed = deduplicateArtists([...processed, ...MOCK_ARTISTS]);
  }

  // Divisão clássica de 3 dias (Sex / Sáb / Dom)
  const h1 = processed[0];
  const h2 = processed[1] || processed[0];
  const h3 = processed[2] || processed[0];

  // Co-headliners (2 para cada dia)
  const coDay1 = [processed[3], processed[6]].filter(Boolean);
  const coDay2 = [processed[4], processed[7]].filter(Boolean);
  const coDay3 = [processed[5], processed[8]].filter(Boolean);

  // Undercard distribuído sequencialmente
  const undercardPool = processed.slice(9, 45);
  const undercardDay1: SpotifyArtist[] = [];
  const undercardDay2: SpotifyArtist[] = [];
  const undercardDay3: SpotifyArtist[] = [];

  undercardPool.forEach((artist, index) => {
    if (index % 3 === 0) undercardDay1.push(artist);
    else if (index % 3 === 1) undercardDay2.push(artist);
    else undercardDay3.push(artist);
  });

  const days: FestivalDay[] = [
    {
      dayLabel: "SEXTA-FEIRA",
      dateLabel: "24 OUT",
      headliner: h1,
      coHeadliners: coDay1,
      undercard: undercardDay1,
    },
    {
      dayLabel: "SÁBADO",
      dateLabel: "25 OUT",
      headliner: h2,
      coHeadliners: coDay2,
      undercard: undercardDay2,
    },
    {
      dayLabel: "DOMINGO",
      dateLabel: "26 OUT",
      headliner: h3,
      coHeadliners: coDay3,
      undercard: undercardDay3,
    },
  ];

  return {
    title: festivalName.toUpperCase(),
    subtitle: getSubtitleForMode(mode, timeRange, targetGenre),
    themeId,
    mode,
    timeRange,
    aspectRatio,
    days,
    allArtists: processed.slice(0, 45),
    singleStageHeadliners: [h1, h2, h3],
    singleStageSubHeadliners: processed.slice(3, 11),
    singleStageUndercard: processed.slice(11, 45),
  };
}

function getSubtitleForMode(mode: CreationMode, timeRange: TimeRange, targetGenre?: string): string {
  if (mode === "genre" && targetGenre) {
    return `EDIÇÃO ESPECIAL · GÊNERO: ${targetGenre.toUpperCase()}`;
  }
  if (mode === "popularity") {
    return "TOP ARTISTAS · RANKING DE POPULARIDADE";
  }
  switch (timeRange) {
    case "short_term":
      return "EDIÇÃO DE VERÃO · ÚLTIMAS 4 SEMANAS";
    case "medium_term":
      return "LINEUP OFICIAL · ÚLTIMOS 6 MESES";
    case "long_term":
      return "ALL-TIME GREATEST · HISTÓRICO COMPLETO";
  }
}
