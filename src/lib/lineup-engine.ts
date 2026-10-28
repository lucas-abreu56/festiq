import { SpotifyArtist, MOCK_ARTISTS } from "./mock-artists";

export type FestivalThemeId =
  | "lolla"
  | "festify"
  | "tropical"
  | "retro"
  | "c6fest"
  | "floggnaw";
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

  // 2. Somente se o usuário não tiver NENHUM artista desse gênero, utiliza os representantes do gênero no mock
  if (matched.length === 0) {
    const fallbackFromMock = MOCK_ARTISTS.filter((a) => artistMatchesGenre(a, targetGenre));
    matched = deduplicateArtists(fallbackFromMock);
  }

  // 3. Se tiver menos de 45 artistas específicos deste gênero, cicla os próprios artistas encontrados
  // JAMAIS misturando artistas do MOCK na conta do usuário
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
 * Gera uma variação determinística dos artistas do Mock de acordo com o período selecionado no Modo Demo
 */
export function getMockArtistsForTimeRange(timeRange: TimeRange): SpotifyArtist[] {
  if (timeRange === "short_term") {
    // 4 Semanas (Contemporâneo / Alta Rotação Pop, Trap & Indie)
    return [...MOCK_ARTISTS].sort((a, b) => {
      // Prioriza artistas contemporâneos e de alta popularidade
      const scoreA = a.popularity + (a.genres.some(g => ["trap", "hyperpop", "dance pop", "electropop", "bedroom pop"].some(k => g.includes(k))) ? 15 : 0);
      const scoreB = b.popularity + (b.genres.some(g => ["trap", "hyperpop", "dance pop", "electropop", "bedroom pop"].some(k => g.includes(k))) ? 15 : 0);
      return scoreB - scoreA;
    });
  }

  if (timeRange === "long_term") {
    // Todo o Tempo (Histórico Completo / Lendas e Clássicos)
    return [...MOCK_ARTISTS].sort((a, b) => {
      // Prioriza artistas clássicos / históricos do rock, mpb, reggae e metal
      const isClassicA = a.genres.some(g => ["classic rock", "roots reggae", "tropicalia", "heavy metal", "post-punk", "bossa nova"].some(k => g.includes(k)));
      const isClassicB = b.genres.some(g => ["classic rock", "roots reggae", "tropicalia", "heavy metal", "post-punk", "bossa nova"].some(k => g.includes(k)));
      if (isClassicA && !isClassicB) return -1;
      if (!isClassicA && isClassicB) return 1;
      return b.popularity - a.popularity;
    });
  }

  // medium_term: Ordem padrão curada do festival
  return MOCK_ARTISTS;
}

/**
 * Embaralhamento determinístico usando gerador pseudo-aleatório baseado em seed (LGC)
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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
  shuffleSeed = 0,
}: {
  artists: SpotifyArtist[];
  festivalName?: string;
  themeId?: FestivalThemeId;
  mode?: CreationMode;
  timeRange?: TimeRange;
  aspectRatio?: PosterAspectRatio;
  targetGenre?: string;
  shuffleSeed?: number;
}): FestivalLineup {
  // Se estiver usando o mock (artistas vazios ou mock padrão), aplica a variação por período
  const basePool = artists && artists.length > 0 && artists !== MOCK_ARTISTS
    ? artists
    : getMockArtistsForTimeRange(timeRange);

  let processed = deduplicateArtists(basePool);

  if (mode === "genre" && targetGenre) {
    processed = filterArtistsByGenre(processed, targetGenre);
  } else if (mode === "popularity") {
    processed = sortArtistsByPopularity(processed);
  }

  // Se a conta conectada tiver menos de 45 artistas, cicla exclusivamente os artistas do próprio usuário,
  // JAMAIS misturando artistas do MOCK_ARTISTS no cartaz pessoal do usuário.
  if (mode !== "genre" && processed.length < 45 && processed.length > 0) {
    const userPool = [...processed];
    let i = 0;
    while (processed.length < 45) {
      const art = userPool[i % userPool.length];
      processed.push({
        ...art,
        id: `${art.id}-repeat-${processed.length}`,
      });
      i++;
    }
  }

  // Aplicação do Shuffle determinístico respeitando as regras do modo ativo
  if (shuffleSeed > 0) {
    if (mode === "popularity") {
      // No modo popularidade, mantém os 3 maiores headliners e embaralha tiers secundários
      const top3 = processed.slice(0, 3);
      const subHeadliners = seededShuffle(processed.slice(3, 12), shuffleSeed);
      const undercard = seededShuffle(processed.slice(12), shuffleSeed + 1);
      processed = [...top3, ...subHeadliners, ...undercard];
    } else {
      // Nos modos taste e genre, permite rotacionar headliners e embaralhar o lineup
      const shift = shuffleSeed % Math.min(8, Math.max(3, processed.length));
      const rotated = [...processed.slice(shift), ...processed.slice(0, shift)];
      const headliners = rotated.slice(0, 3);
      const rest = seededShuffle(rotated.slice(3), shuffleSeed);
      processed = [...headliners, ...rest];
    }
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
    allArtists:
      themeId === "festify"
        ? processed.slice(0, 24)
        : themeId === "floggnaw"
        ? processed.slice(0, 41)
        : themeId === "tropical"
        ? processed.slice(0, 34)
        : processed.slice(0, 45),
    singleStageHeadliners: [h1, h2, h3],
    singleStageSubHeadliners:
      themeId === "festify" ? processed.slice(3, 6) : processed.slice(3, 11),
    singleStageUndercard:
      themeId === "festify" ? processed.slice(6, 24) : processed.slice(11, 45),
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
