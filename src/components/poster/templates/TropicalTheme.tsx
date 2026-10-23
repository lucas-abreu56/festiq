import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";
import {
  PLANETA_RAIL_LEFT_DATA_URI,
  PLANETA_RAIL_RIGHT_DATA_URI,
} from "@/lib/assets/planeta-rails";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Extrai a letra principal do festival para o emblema 3D no centro do globo:
 * - Se começar com "PLANETA " e tiver segunda palavra (ex: "PLANETA ATLÂNTIDA" -> "A", "PLANETA LUCAS" -> "L"),
 *   usa a inicial da segunda palavra.
 * - Caso contrário, usa a primeira letra alfanumérica do nome escolhido (ex: "FESTIQ STUDIO" -> "F", "MEUPALOOZA" -> "M").
 */
function extractPlanetaLetter(title: string): string {
  const clean = (title || "FESTIQ").trim().toUpperCase();
  if (clean.startsWith("PLANETA ")) {
    const rest = clean.replace(/^PLANETA\s+/, "").trim();
    const match = rest.match(/[A-ZÀ-Ú0-9]/);
    if (match) return match[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const firstMatch = clean.match(/[A-ZÀ-Ú0-9]/);
  if (firstMatch) {
    return firstMatch[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return "A";
}

/**
 * Empilha nomes compostos em 2 linhas equilibradas quando ultrapassam `maxSingleChars`
 * (exatamente como "VINTAGE / CULTURE", "JOTA / QUEST", "LUAN / SANTANA", "LUÍSA / SONZA"
 * no cartaz oficial do Planeta Atlântida), mantendo todos os nomes 100% inteiros.
 */
function stackPlanetaName(name: string, maxSingleChars: number): string[] {
  const clean = name.trim();
  if (clean.length <= maxSingleChars || !clean.includes(" ")) {
    return [clean];
  }
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [words[0], words[1]];
  }
  let bestIdx = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(" ").length;
    const l2 = words.slice(i).join(" ").length;
    const diff = Math.abs(l1 - l2);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(" "), words.slice(bestIdx).join(" ")];
}

/**
 * Distribui os 32 artistas do undercard em 8 fileiras equilibradas (ou 7 fileiras em 1:1)
 * com 3 a 5 artistas cada e equaliza a soma de caracteres por fileira, evitando linhas
 * isoladas com 1 artista e garantindo ritmo vertical uniforme do topo ao rodapé.
 */
function buildPlanetaUndercardRows(
  artists: SpotifyArtist[],
  isSquare: boolean
): SpotifyArtist[][] {
  if (artists.length === 0) return [];

  const targetRows = isSquare
    ? Math.min(7, Math.max(1, Math.round(artists.length / 4.5)))
    : Math.min(8, Math.max(1, Math.round(artists.length / 4)));

  const rows: SpotifyArtist[][] = [];
  const baseCount = Math.floor(artists.length / targetRows);
  const extraCount = artists.length % targetRows;
  let cursor = 0;

  for (let r = 0; r < targetRows; r++) {
    const count = baseCount + (r < extraCount ? 1 : 0);
    rows.push(artists.slice(cursor, cursor + count));
    cursor += count;
  }

  const getRowWeight = (row: SpotifyArtist[]) =>
    row.reduce((acc, a) => acc + a.name.length, 0) + Math.max(0, row.length - 1) * 3;

  // Equaliza a soma de caracteres entre fileiras do undercard
  for (let iter = 0; iter < 25; iter++) {
    let heaviestIdx = 0;
    let lightestIdx = 0;
    let maxW = -Infinity;
    let minW = Infinity;

    rows.forEach((row, idx) => {
      const w = getRowWeight(row);
      if (w > maxW) {
        maxW = w;
        heaviestIdx = idx;
      }
      if (w < minW) {
        minW = w;
        lightestIdx = idx;
      }
    });

    if (maxW - minW <= 6 || heaviestIdx === lightestIdx) break;

    const heavyRow = rows[heaviestIdx];
    const lightRow = rows[lightestIdx];
    const idealDiff = (maxW - minW) / 2;
    let bestH = -1;
    let bestL = -1;
    let bestScore = Infinity;

    for (let h = 0; h < heavyRow.length; h++) {
      for (let l = 0; l < lightRow.length; l++) {
        const delta = heavyRow[h].name.length - lightRow[l].name.length;
        if (delta > 1) {
          const score = Math.abs(delta - idealDiff);
          if (score < bestScore) {
            bestScore = score;
            bestH = h;
            bestL = l;
          }
        }
      }
    }

    if (bestH !== -1 && bestL !== -1) {
      const tmp = heavyRow[bestH];
      heavyRow[bestH] = lightRow[bestL];
      lightRow[bestL] = tmp;
    } else {
      break;
    }
  }

  return rows;
}

export const TropicalTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  const letter = extractPlanetaLetter(lineup.title);

  // Estrutura fiel ao cartaz oficial do Planeta Atlântida 2023:
  // Linha 1: 3 Headliners principais separados por raios (⚡) e empilhados em 2 linhas
  const row1Headliners = allArtists.slice(0, 3);
  // Linha 2: 4 Co-Headliners em UMA ÚNICA FILEIRA (nomes compostos empilham em 2 linhas como "JOTA / QUEST • LUAN / SANTANA • LUDMILLA • LUÍSA / SONZA")
  const row2CoHeadliners = allArtists.slice(3, 7);
  // Linha 3: 3 Sub-Headliners em UMA ÚNICA FILEIRA
  const row3SubHeadliners = allArtists.slice(7, 10);
  // Linha 4: 3 Sub-Headliners em UMA ÚNICA FILEIRA
  const row4SubHeadliners = allArtists.slice(10, 13);
  // Linhas 5 a 12: Demais 32 artistas distribuídos em 8 fileiras equalizadas de 4 artistas (ou 7 fileiras em 1:1)
  const undercardRows = buildPlanetaUndercardRows(allArtists.slice(13, 45), isSquare);

  const dotColors = ["text-[#0097A7]", "text-[#E64A19]", "text-[#00897B]"];

  const displayArcTitle =
    lineup.title.trim().toUpperCase() === "FESTIQ STUDIO"
      ? "PLANETA FESTIQ"
      : lineup.title.trim().toUpperCase();

  return (
    <div
      className="w-full h-full text-[#141414] flex flex-row items-stretch justify-between relative overflow-hidden select-none font-sans"
      style={{
        background:
          "linear-gradient(180deg, #F595B1 0%, #F69EAE 14%, #F6A6A5 28%, #F7B499 42%, #F8C08F 56%, #FAC881 70%, #FAD471 84%, #FCE063 100%)",
      }}
    >
      {/* 1. COLUNA ILUSTRADA ESQUERDA (Coqueiros, Globo, Raio 3D, Boca Pop-Art, Ondas + Linha Preta Vertical) */}
      <div className="relative h-full w-[18.5%] flex-shrink-0 overflow-hidden">
        <img
          src={PLANETA_RAIL_LEFT_DATA_URI}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-fill pointer-events-none select-none"
        />
      </div>

      {/* 2. PALCO CENTRAL: Globo 3D com Letra Centralizada + Saba em Atlântida + Lineup Uniforme + Rodapé Oficial */}
      <div
        className={`relative z-10 flex-1 h-full flex flex-col justify-between items-center text-center overflow-hidden ${
          isSquare ? "px-2 py-1.5" : "px-2 py-2.5"
        }`}
      >
        {/* TOPO: Globo Azul 3D + Letra Dourada Centralizada no Meio + "3 E 4 DE FEVEREIRO / NA SABA, EM ATLÂNTIDA" */}
        <div className="w-full flex flex-col items-center">
          <svg
            viewBox="0 0 280 172"
            className={
              isSquare
                ? "w-28 sm:w-32 h-auto -mb-1"
                : "w-36 sm:w-40 h-auto -mb-1"
            }
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="planeta-sphere-3d" cx="36%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#58C9F7" />
                <stop offset="28%" stopColor="#1E88E5" />
                <stop offset="68%" stopColor="#0D47A1" />
                <stop offset="100%" stopColor="#051E42" />
              </radialGradient>

              <linearGradient id="planeta-letter-gold" x1="0%" y1="0%" x2="25%" y2="100%">
                <stop offset="0%" stopColor="#FFE548" />
                <stop offset="55%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#F57C00" />
              </linearGradient>

              <linearGradient id="planeta-ring-top" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E64A19" />
                <stop offset="50%" stopColor="#FF5722" />
                <stop offset="100%" stopColor="#D84315" />
              </linearGradient>

              {/* Arco para o Nome do Festival ao redor do topo do Globo */}
              <path
                id="planeta-title-arc"
                d="M 52 108 A 88 88 0 1 1 228 108"
              />

              <clipPath id="globe-clip">
                <circle cx="140" cy="104" r="56" />
              </clipPath>
            </defs>

            {/* Metade Traseira do Anel Orbital */}
            <g transform="rotate(-15 140 104)">
              <path
                d="M 46 104 A 94 25 0 0 1 234 104"
                stroke="#8D1F05"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 46 101 A 94 25 0 0 1 234 101"
                stroke="#D84315"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Esfera Azul 3D Principal (Centro Exato em cx=140, cy=104) */}
            <circle
              cx="140"
              cy="104"
              r="56"
              fill="url(#planeta-sphere-3d)"
              stroke="#072652"
              strokeWidth="1.5"
            />

            {/* Grade de Meridianos e Paralelos na Esfera */}
            <g clipPath="url(#globe-clip)" stroke="#64B5F6" strokeOpacity="0.32" strokeWidth="1" fill="none">
              <ellipse cx="140" cy="70" rx="52" ry="11" />
              <ellipse cx="140" cy="92" rx="58" ry="14" />
              <ellipse cx="140" cy="116" rx="58" ry="14" />
              <ellipse cx="140" cy="138" rx="52" ry="11" />
              <ellipse cx="140" cy="104" rx="16" ry="56" />
              <ellipse cx="140" cy="104" rx="34" ry="56" />
              <ellipse cx="140" cy="104" rx="49" ry="56" />
              <line x1="140" y1="48" x2="140" y2="160" />
            </g>

            {/* Brilho Especular Superior Esquerdo */}
            <ellipse
              cx="116"
              cy="78"
              rx="16"
              ry="10"
              transform="rotate(-25 116 78)"
              fill="#FFFFFF"
              fillOpacity="0.22"
            />

            {/* Nome do Festival Arqueado na Fonte Geométrica Larga do Planeta */}
            <text
              fill="#141414"
              stroke="#141414"
              strokeWidth="4.5"
              strokeLinejoin="round"
              paintOrder="stroke"
              fontSize={displayArcTitle.length > 18 ? "13.5" : "16"}
              fontWeight="900"
              letterSpacing="0.8"
              fontFamily="var(--font-inter), sans-serif"
              transform="translate(1.8, 2.2)"
            >
              <textPath href="#planeta-title-arc" startOffset="50%" textAnchor="middle">
                {displayArcTitle}
              </textPath>
            </text>
            <text
              fill="#FFFFFF"
              stroke="#141414"
              strokeWidth="2"
              strokeLinejoin="round"
              paintOrder="stroke"
              fontSize={displayArcTitle.length > 18 ? "13.5" : "16"}
              fontWeight="900"
              letterSpacing="0.8"
              fontFamily="var(--font-inter), sans-serif"
            >
              <textPath href="#planeta-title-arc" startOffset="50%" textAnchor="middle">
                {displayArcTitle}
              </textPath>
            </text>

            {/* LETRA 3D DOURADA CENTRALIZADA EXATAMENTE NO MEIO DO GLOBO (cx=140, cy=104) NA FONTE DO PLANETA */}
            <g>
              <text
                x="145"
                y="109"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#041530"
                fillOpacity="0.45"
                fontSize="64"
                fontWeight="900"
                fontFamily="var(--font-inter), sans-serif"
              >
                {letter}
              </text>
              <text
                x="143.5"
                y="107.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#871900"
                stroke="#681200"
                strokeWidth="2.5"
                strokeLinejoin="round"
                paintOrder="stroke"
                fontSize="64"
                fontWeight="900"
                fontFamily="var(--font-inter), sans-serif"
              >
                {letter}
              </text>
              <text
                x="141.8"
                y="105.8"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#BF360C"
                stroke="#871900"
                strokeWidth="1.5"
                strokeLinejoin="round"
                paintOrder="stroke"
                fontSize="64"
                fontWeight="900"
                fontFamily="var(--font-inter), sans-serif"
              >
                {letter}
              </text>
              <text
                x="140"
                y="104"
                textAnchor="middle"
                dominantBaseline="central"
                fill="url(#planeta-letter-gold)"
                stroke="#D84315"
                strokeWidth="1.2"
                strokeLinejoin="round"
                paintOrder="stroke"
                fontSize="64"
                fontWeight="900"
                fontFamily="var(--font-inter), sans-serif"
              >
                {letter}
              </text>
            </g>

            {/* Metade Frontal do Anel Orbital 3D */}
            <g transform="rotate(-15 140 104)">
              <path
                d="M 234 108 A 94 25 0 0 1 46 108"
                stroke="#9A1B00"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 234 104 A 94 25 0 0 1 46 104"
                stroke="url(#planeta-ring-top)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 222 106 A 86 22 0 0 1 58 106"
                stroke="#FFAB40"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </g>
          </svg>

          {/* Informações Clássicas do Planeta Atlântida Restauradas Abaixo do Globo */}
          <div className="leading-none -mt-0.5">
            <p
              className={`font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1.2px_2px_rgba(0,0,0,0.35)] ${
                isSquare ? "text-[8px] sm:text-[9px]" : "text-[8.5px] sm:text-[9.5px]"
              }`}
            >
              3 E 4 DE FEVEREIRO
            </p>
            <p
              className={`font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1.2px_2px_rgba(0,0,0,0.35)] mt-[1px] ${
                isSquare ? "text-[6.8px] sm:text-[7.5px]" : "text-[7px] sm:text-[8px]"
              }`}
            >
              NA SABA, EM ATLÂNTIDA · {lineup.subtitle.split("·")[0].trim()}
            </p>
          </div>
        </div>

        {/* 3. BLOCO DE LINEUP COM RITMO VERTICAL UNIFORME ENTRE TODAS AS FILEIRAS (Fiel ao Cartaz de 2023) */}
        <div
          className={`w-full flex-1 flex flex-col justify-between items-center text-center overflow-hidden ${
            isSquare ? "py-1.5" : "py-2"
          }`}
        >
          {/* LINHA 1: 3 Headliners Principais Lado a Lado Separados por Raios (⚡) */}
          <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
            {row1Headliners.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, 9);
              const maxLineChars = Math.max(...lines.map((l) => l.length));
              return (
                <React.Fragment key={artist.id}>
                  <div className="text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className={`block font-sans font-black uppercase text-[#141414] whitespace-nowrap ${
                          isSquare
                            ? maxLineChars > 13
                              ? "text-[9.5px] sm:text-[10.5px] tracking-tighter"
                              : "text-[11px] sm:text-xs tracking-tight"
                            : maxLineChars > 13
                            ? "text-[9px] sm:text-[10px] tracking-tighter"
                            : "text-[10.5px] sm:text-xs tracking-tight"
                        }`}
                        style={{ lineHeight: "0.92" }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < row1Headliners.length - 1 && (
                    <svg
                      viewBox="0 0 16 24"
                      className="w-2.5 h-3.5 flex-shrink-0"
                      fill={idx === 0 ? "#FF5722" : "#0097A7"}
                    >
                      <polygon points="10,0 0,14 7,14 4,24 16,9 9,9" />
                    </svg>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 2: 4 Co-Headliners em 1 ÚNICA FILEIRA (Nomes compostos empilhados em 2 linhas como "JOTA / QUEST • LUAN / SANTANA • LUDMILLA • LUÍSA / SONZA") */}
          <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 leading-none">
            {row2CoHeadliners.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, 9);
              const maxLineChars = Math.max(...lines.map((l) => l.length));
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className={`font-sans font-black uppercase text-[#141414] whitespace-nowrap ${
                          isSquare
                            ? maxLineChars > 14
                              ? "text-[7.5px] sm:text-[8.5px] tracking-tighter"
                              : "text-[9px] sm:text-[10px] tracking-tight"
                            : maxLineChars > 14
                            ? "text-[7px] sm:text-[7.8px] tracking-tighter"
                            : "text-[8.2px] sm:text-[9.2px] tracking-tight"
                        }`}
                        style={{ lineHeight: lines.length > 1 ? "0.92" : "0.98" }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < row2CoHeadliners.length - 1 && (
                    <span
                      className={`font-black text-[8px] leading-none flex-shrink-0 ${
                        dotColors[idx % dotColors.length]
                      }`}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHAS 3 e 4: Sub-Headliners Médios (3 Artistas por Fileira, Empilhando Nomes Compostos > 12 Letras) */}
          {[row3SubHeadliners, row4SubHeadliners].map((subRow, sIdx) => (
            <div
              key={`sub-${sIdx}`}
              className="w-full flex items-center justify-center gap-1.5 sm:gap-2 leading-none"
            >
              {subRow.map((artist, idx) => {
                const lines = stackPlanetaName(artist.name, 11);
                const maxLineChars = Math.max(...lines.map((l) => l.length));
                return (
                  <React.Fragment key={artist.id}>
                    <div className="inline-flex flex-col items-center text-center leading-none">
                      {lines.map((line, lIdx) => (
                        <span
                          key={lIdx}
                          className={`font-sans font-extrabold uppercase text-[#141414] whitespace-nowrap ${
                            isSquare
                              ? maxLineChars > 14
                                ? "text-[7.8px] sm:text-[8.6px] tracking-tighter"
                                : "text-[8.8px] sm:text-[9.8px] tracking-tight"
                              : maxLineChars > 14
                              ? "text-[7.2px] sm:text-[8px] tracking-tighter"
                              : "text-[8px] sm:text-[8.8px] tracking-tight"
                          }`}
                          style={{ lineHeight: lines.length > 1 ? "0.92" : "0.98" }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    {idx < subRow.length - 1 && (
                      <span
                        className={`font-black text-[7.5px] leading-none flex-shrink-0 ${
                          dotColors[(sIdx + idx) % dotColors.length]
                        }`}
                      >
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}

          {/* LINHAS 5 a 12: Undercard Equalizado (4 Artistas por Fileira, Irmãos Diretos no Flexbox para Espaçamento Vertical Perfeito!) */}
          {undercardRows.map((row, rIdx) => {
            const rowChars = row.reduce((acc, a) => acc + a.name.length, 0);
            return (
              <div
                key={`under-${rIdx}`}
                className="w-full flex items-center justify-center gap-x-1 sm:gap-x-1.5 leading-none whitespace-nowrap"
              >
                {row.map((artist, aIdx) => (
                  <React.Fragment key={artist.id}>
                    <span
                      className={`font-sans font-extrabold uppercase text-[#141414] whitespace-nowrap ${
                        isSquare
                          ? rowChars > 46
                            ? "text-[6.8px] sm:text-[7.5px] tracking-tighter"
                            : "text-[7.5px] sm:text-[8.4px] tracking-tight"
                          : rowChars > 42
                          ? "text-[6.2px] sm:text-[6.8px] tracking-tighter"
                          : "text-[6.8px] sm:text-[7.5px] tracking-tight"
                      }`}
                      style={{ lineHeight: "1.0" }}
                    >
                      {artist.name}
                    </span>
                    {aIdx < row.length - 1 && (
                      <span
                        className={`font-black text-[6.5px] leading-none flex-shrink-0 ${
                          dotColors[(rIdx + aIdx) % dotColors.length]
                        }`}
                      >
                        •
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>

        {/* 4. RODAPÉ OFICIAL PLANETA ATLÂNTIDA RESTAURADO: Slogan + Site + Pílula Coral-Laranja */}
        <div className="w-full flex flex-col items-center text-center pt-0.5">
          <div className="w-28 h-[1.5px] bg-[#0097A7] mb-0.5" />

          <p
            className={`font-sans font-black uppercase tracking-wider text-[#141414] leading-none ${
              isSquare ? "text-[8.5px] sm:text-[9.5px]" : "text-[9px] sm:text-[10px]"
            }`}
          >
            O PLANETA VOLTA A GIRAR
          </p>
          <p className="font-sans font-bold text-[6px] sm:text-[6.8px] uppercase tracking-widest text-[#141414]/80 mt-[1px]">
            PLANETAFESTIQ.COM.BR
          </p>

          <div
            className={`mt-0.5 px-3.5 rounded-full bg-[#F4511E] text-white flex items-center justify-center gap-2 font-sans font-black uppercase tracking-wider shadow-sm ${
              isSquare
                ? "py-0.5 text-[6.5px] sm:text-[7px]"
                : "py-1 text-[7px] sm:text-[8px]"
            }`}
          >
            <span className="px-1 py-[1px] bg-[#D50000] rounded text-white">
              FESTIQ
            </span>
            <span>SPOTIFY API</span>
            <span>•</span>
            <span>{isSquare ? "1080×1080" : "1080×1920"}</span>
          </div>
        </div>
      </div>

      {/* 5. COLUNA ILUSTRADA DIREITA (Linha Preta Vertical + Coqueiros, Globo, Raio 3D, Boca Pop-Art, Ondas) */}
      <div className="relative h-full w-[18.5%] flex-shrink-0 overflow-hidden">
        <img
          src={PLANETA_RAIL_RIGHT_DATA_URI}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-fill pointer-events-none select-none"
        />
      </div>
    </div>
  );
};
