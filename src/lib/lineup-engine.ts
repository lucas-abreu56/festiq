import { SpotifyArtist, MOCK_ARTISTS } from "./mock-artists";

export type FestivalThemeId = "lolla" | "festify" | "tropical" | "retro" | "c6fest";
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

export const GENRE_TAXONOMY: Record<string, string[]> = {
  rock: [
    "rock", "punk", "metal", "grunge", "hardcore", "shoegaze", "post-punk",
    "new wave", "emo", "alternative rock", "indie rock", "garage rock",
    "psychedelic rock", "classic rock", "glam rock", "hard rock", "art rock",
    "math rock", "noise rock", "stoner rock", "folk rock", "gothic rock",
    "melodic hardcore", "post-hardcore", "blues rock", "southern rock"
  ],
  metal: [
    "metal", "heavy metal", "death metal", "black metal", "thrash", "doom metal",
    "nu metal", "sludge", "power metal", "metalcore", "progressive metal", "alternative metal"
  ],
  pop: [
    "pop", "dance pop", "synthpop", "electropop", "hyperpop", "indie pop",
    "art pop", "teen pop", "k-pop", "j-pop", "latin pop", "bedroom pop"
  ],
  "hip hop": [
    "hip hop", "rap", "trap", "boom bap", "drill", "conscious hip hop",
    "gangsta rap", "alternative hip hop", "southern hip hop", "rap nacional",
    "brazilian hip hop", "west coast rap", "east coast rap"
  ],
  indie: [
    "indie", "alternative", "dream pop", "chamber pop", "lo-fi", "twee pop",
    "chillwave", "bedroom pop", "indie folk", "indie rock", "indie pop"
  ],
  electronic: [
    "electronic", "techno", "house", "edm", "ambient", "downtempo", "idm",
    "drum and bass", "electro", "trance", "synthwave", "dubstep", "trip hop",
    "french house", "deep house", "brazilian edm", "dance"
  ],
  mpb: [
    "mpb", "samba", "bossa nova", "tropicalia", "brazilian", "choro",
    "pagode", "forro", "axe", "samba-pop", "brazilian pop", "afrobeat"
  ],
  sertanejo: [
    "sertanejo", "sertanejo universitario", "sertanejo raiz", "modão",
    "arrocha", "agronejo"
  ],
  reggae: [
    "reggae", "dub", "dancehall", "ska", "roots reggae", "rocksteady", "reggaeton"
  ],
};

/**
 * Verifica se um artista pertence ao gênero alvo segundo suas tags do Spotify
 */
export function artistMatchesGenre(artist: SpotifyArtist, targetGenre: string): boolean {
  const normalizedTarget = targetGenre.toLowerCase().trim();
  const keywords = GENRE_TAXONOMY[normalizedTarget] || [normalizedTarget];
  return (artist.genres || []).some((g) => {
    const normG = g.toLowerCase();
    return keywords.some((kw) => normG.includes(kw));
  });
}

/**
 * Filtra e enriquece artistas por gênero musical respeitando a ordem de afinidade do usuário
 * e garantindo que JAMAIS artistas de outros gêneros sejam inseridos (Zero-Pollution Rule).
 */
export function filterArtistsByGenre(
  artists: SpotifyArtist[],
  targetGenre: string
): SpotifyArtist[] {
  // 1. Filtra artistas do próprio usuário que combinam com o gênero, preservando a ordem original (mais escutados primeiro)
  let matched = artists.filter((a) => artistMatchesGenre(a, targetGenre));

  // 2. Se o usuário tiver menos de 45 artistas desse gênero, complementa exclusivamente com artistas do mesmo gênero do mock
  if (matched.length < 45) {
    const fallbackFromMock = MOCK_ARTISTS.filter((a) => artistMatchesGenre(a, targetGenre));
    matched = deduplicateArtists([...matched, ...fallbackFromMock]);
  }

  // 3. Se ainda tiver menos de 45 artistas específicos deste gênero, cicla os próprios artistas do gênero
  // JAMAIS importando o MOCK geral de outros gêneros
  if (matched.length < 45 && matched.length > 0) {
    const validPool = [...matched];
    let i = 0;
    while (matched.length < 45) {
      const art = validPool[i % validPool.length];
      matched.push({
        ...art,
        id: `${art.id}-repeat-${matched.length}`,
      });
      i++;
    }
  }

  // 4. Salvaguarda absoluta: se nenhuma correspondência foi encontrada, utiliza os primeiros 45 do mock
  if (matched.length === 0) {
    matched = [...MOCK_ARTISTS.slice(0, 45)];
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

  // Completa com o mock geral APENAS nos modos 'taste' ou 'popularity' quando houver menos de 30 artistas.
  // No modo 'genre', a integridade do gênero já foi estritamente garantida por filterArtistsByGenre.
  if (mode !== "genre" && processed.length < 30) {
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
