import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist, MOCK_ARTISTS } from "@/lib/mock-artists";
import {
  PLANETA_RAIL_LEFT_DATA_URI,
  PLANETA_RAIL_RIGHT_DATA_URI,
} from "@/lib/assets/planeta-rails";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Raio Estilizado 3D do Planeta Atlântida
 */
function LightningBolt({
  color = "#FF3B30",
  className = "w-2.5 h-3.5",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 24"
      className={`${className} flex-shrink-0 pointer-events-none select-none`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="10,0 0,14 7,14 4,24 16,9 9,9" />
    </svg>
  );
}

/**
 * Extrai a letra principal do festival para o emblema 3D no centro do globo
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
 * Empilha nomes compostos em 2 ou 3 linhas equilibradas quando ultrapassam `maxSingleChars`
 * (exatamente como "VINTAGE / CULTURE", "JOTA / QUEST", "LUAN / SANTANA", "LUÍSA / SONZA"
 * no cartaz oficial do Planeta Atlântida), mantendo todos os nomes 100% inteiros e sem cortes.
 */
function stackPlanetaName(name: string, maxSingleChars: number): string[] {
  const clean = name.trim().toUpperCase();
  if (clean.length <= maxSingleChars) {
    return [clean];
  }
  if (!clean.includes(" ")) {
    if (clean.length > 12) {
      const mid = Math.ceil(clean.length / 2);
      return [`${clean.slice(0, mid)}-`, clean.slice(mid)];
    }
    return [clean];
  }
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [words[0], words[1]];
  }

  // Se o nome for longo (> 20 caracteres e >= 4 palavras), quebra em 3 linhas
  if (clean.length > 20 && words.length >= 4) {
    const t1 = Math.round(words.length / 3);
    const t2 = Math.round((words.length * 2) / 3);
    const p1 = words.slice(0, t1).join(" ");
    const p2 = words.slice(t1, t2).join(" ");
    const p3 = words.slice(t2).join(" ");
    if (p1 && p2 && p3) {
      return [p1, p2, p3];
    }
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

interface PlanetaRows {
  row0: SpotifyArtist[]; // Linha 1: 3 Headliners (Vintage Culture, Ivete Sangalo, Matuê)
  row1: SpotifyArtist[]; // Linha 2: 4 Co-Headliners (Jota Quest, Luan Santana, Ludmilla, Luísa Sonza)
  row2: SpotifyArtist[]; // Linha 3: 3 Destaques (Jão, Dilsinho, Gloria Groove)
  row3: SpotifyArtist[]; // Linha 4: 3 Destaques (Armandinho, Dubdogz, Lagum)
  row4: SpotifyArtist[]; // Linha 5: 3 Undercard 1 (Poze do Rodo, Vitor Kley, Mochakk)
  row5: SpotifyArtist[]; // Linha 6: 3 Undercard 2 (Reação em Cadeia, Matheus & Kauan, Gilsons)
  row6: SpotifyArtist[]; // Linha 7: 3 Undercard 3 (Teto & Wiu, Charlie Brown Jr, Melim)
  row7: SpotifyArtist[]; // Linha 8: 3 Undercard 4 (Jovem Dionisio, Comunidade Nin-Jitsu, Vera Loca)
  row8: SpotifyArtist[]; // Linha 9: 3 Undercard 5 (Priscilla Alcantara, Zaka, Ariel B)
  row9: SpotifyArtist[]; // Linha 10: 3 Undercard 6 (Hans Ancina, Guz Zanotto, Gabriel R)
  row10: SpotifyArtist[]; // Linha 11: 3 Undercard 7 (Laypold, DJ Cabeção, Pedro Mueller)
}

function getSafeSlice(pool: SpotifyArtist[], start: number, count: number): SpotifyArtist[] {
  if (pool.length === 0) return [];
  const result: SpotifyArtist[] = [];
  for (let i = 0; i < count; i++) {
    const art = pool[(start + i) % pool.length];
    if (art) result.push(art);
  }
  return result;
}

/**
 * Organiza exatamente 34 artistas nas 11 fileiras oficiais do Planeta Atlântida:
 * 3 + 4 + 3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 = 34 artistas
 */
function buildPlanetaRows(allArtists: SpotifyArtist[]): PlanetaRows {
  const pool = allArtists.length > 0 ? allArtists : MOCK_ARTISTS.slice(0, 34);
  return {
    row0: getSafeSlice(pool, 0, 3),
    row1: getSafeSlice(pool, 3, 4),
    row2: getSafeSlice(pool, 7, 3),
    row3: getSafeSlice(pool, 10, 3),
    row4: getSafeSlice(pool, 13, 3),
    row5: getSafeSlice(pool, 16, 3),
    row6: getSafeSlice(pool, 19, 3),
    row7: getSafeSlice(pool, 22, 3),
    row8: getSafeSlice(pool, 25, 3),
    row9: getSafeSlice(pool, 28, 3),
    row10: getSafeSlice(pool, 31, 3),
  };
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

  const rows = buildPlanetaRows(allArtists);
  const letter = extractPlanetaLetter(lineup.title);

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
        containerType: "inline-size",
      }}
    >
      {/* 1. COLUNA ILUSTRADA ESQUERDA (Coqueiros, Globo, Raio 3D, Boca Pop-Art, Ondas) */}
      <div
        className={`relative h-full flex-shrink-0 overflow-hidden ${
          isSquare ? "w-[13%]" : "w-[13%]"
        }`}
      >
        <img
          src={PLANETA_RAIL_LEFT_DATA_URI}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-fill pointer-events-none select-none"
        />
      </div>

      {/* 2. PALCO CENTRAL: Globo 3D com Letra + 11 Fileiras (34 Artistas) + Rodapé Oficial */}
      <div
        className={`relative z-10 flex-1 h-full flex flex-col justify-between items-center text-center overflow-hidden ${
          isSquare ? "px-2 py-1.5" : "px-1.5 py-1.5"
        }`}
      >
        {/* TOPO: Globo Azul 3D + Letra Dourada + "3 E 4 DE FEVEREIRO / NA SABA, EM ATLÂNTIDA" */}
        <div className="w-full flex flex-col items-center">
          <svg
            viewBox="0 0 280 172"
            className={
              isSquare
                ? "w-[124px] h-auto -mb-1"
                : "w-[145px] h-auto -mb-1"
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

            {/* Nome do Festival Arqueado na Fonte Geométrica do Planeta */}
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

            {/* LETRA 3D DOURADA CENTRALIZADA EXATAMENTE NO MEIO DO GLOBO */}
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

          {/* Informações Clássicas do Planeta Atlântida Abaixo do Globo */}
          <div className="leading-none -mt-0.5">
            <p
              className={`font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1.2px_2px_rgba(0,0,0,0.35)] ${
                isSquare ? "text-[9.2px]" : "text-[8.5px]"
              }`}
            >
              3 E 4 DE FEVEREIRO
            </p>
            <p
              className={`font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1.2px_2px_rgba(0,0,0,0.35)] mt-[1px] ${
                isSquare ? "text-[7.8px]" : "text-[7.2px]"
              }`}
            >
              NA SABA, EM ATLÂNTIDA · {lineup.subtitle.split("·")[0].trim()}
            </p>
          </div>
        </div>

        {/* 3. BLOCO DE LINEUP COM EXATAMENTE 34 ARTISTAS EM 11 FILEIRAS (Fiel ao Cartaz Oficial) */}
        <div
          className={`w-full flex-1 flex flex-col justify-between items-center text-center overflow-hidden ${
            isSquare ? "py-1" : "py-1.5"
          }`}
        >
          {/* LINHA 1: 3 HEADLINERS PRINCIPAIS SEPARADOS POR RAIOS (⚡) E EMPILHADOS EM 2 LINHAS */}
          <div className="w-full flex items-center justify-center gap-1.5 leading-none">
            {rows.row0.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 8 : 7);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(12.5px, 2.6cqw, 15.5px)"
                            : "clamp(9.8px, 2.5cqw, 12.5px)",
                          lineHeight: "0.92",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row0.length - 1 && (
                    <LightningBolt
                      color={idx === 0 ? "#FF3B30" : "#00BCD4"}
                      className={isSquare ? "w-3 h-4" : "w-2.5 h-3.5"}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 2: 4 CO-HEADLINERS (Separados por Pontos Coloridos) */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row1.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 9 : 7);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(10.2px, 2.1cqw, 12.5px)"
                            : "clamp(8.0px, 2.0cqw, 9.8px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row1.length - 1 && (
                    <span
                      className={`font-black text-[7px] leading-none flex-shrink-0 ${
                        idx === 0 ? "text-[#00BCD4]" : idx === 1 ? "text-[#FF5722]" : "text-[#00BCD4]"
                      }`}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 3: 3 DESTAQUES */}
          <div className="w-full flex items-center justify-center gap-1.5 leading-none">
            {rows.row2.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 12 : 9);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(11.2px, 2.3cqw, 13.8px)"
                            : "clamp(8.8px, 2.2cqw, 11.0px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row2.length - 1 && (
                    <span
                      className={`font-black text-[7px] leading-none flex-shrink-0 ${
                        idx === 0 ? "text-[#FF5722]" : "text-[#00BCD4]"
                      }`}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 4: 3 DESTAQUES */}
          <div className="w-full flex items-center justify-center gap-1.5 leading-none">
            {rows.row3.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 12 : 9);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(11.0px, 2.3cqw, 13.5px)"
                            : "clamp(8.8px, 2.2cqw, 11.0px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row3.length - 1 && (
                    <span className="font-black text-[7px] leading-none flex-shrink-0 text-[#00BCD4]">
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 5: 3 ARTISTAS (com Raio e Ponto) */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row4.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(10.5px, 2.2cqw, 13.0px)"
                            : "clamp(8.2px, 2.1cqw, 10.4px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx === 0 ? (
                    <LightningBolt color="#FF3B30" className="w-2 h-3" />
                  ) : idx < rows.row4.length - 1 ? (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#00BCD4]">
                      •
                    </span>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 6: 3 ARTISTAS (com Raio e Ponto) */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row5.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(10.5px, 2.2cqw, 13.0px)"
                            : "clamp(8.2px, 2.1cqw, 10.4px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx === 0 ? (
                    <LightningBolt color="#00BCD4" className="w-2 h-3" />
                  ) : idx < rows.row5.length - 1 ? (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#FF5722]">
                      •
                    </span>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 7: 3 ARTISTAS */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row6.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(10.2px, 2.1cqw, 12.8px)"
                            : "clamp(8.2px, 2.1cqw, 10.4px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx === 0 ? (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#FF5722]">
                      •
                    </span>
                  ) : idx < rows.row6.length - 1 ? (
                    <LightningBolt color="#FF3B30" className="w-2 h-3" />
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 8: 3 ARTISTAS */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row7.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(10.2px, 2.1cqw, 12.8px)"
                            : "clamp(8.2px, 2.1cqw, 10.4px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx === 0 ? (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#00BCD4]">
                      •
                    </span>
                  ) : idx < rows.row7.length - 1 ? (
                    <LightningBolt color="#00BCD4" className="w-2 h-3" />
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 9: 3 ARTISTAS */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row8.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(9.8px, 2.0cqw, 12.2px)"
                            : "clamp(7.8px, 2.0cqw, 9.8px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx === 0 ? (
                    <LightningBolt color="#FF3B30" className="w-2 h-3" />
                  ) : idx < rows.row8.length - 1 ? (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#00BCD4]">
                      •
                    </span>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 10: 3 ARTISTAS */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row9.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(9.8px, 2.0cqw, 12.2px)"
                            : "clamp(7.8px, 2.0cqw, 9.8px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row9.length - 1 && (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#FF5722]">
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* LINHA 11: 3 ARTISTAS */}
          <div className="w-full flex items-center justify-center gap-1 leading-none">
            {rows.row10.map((artist, idx) => {
              const lines = stackPlanetaName(artist.name, isSquare ? 11 : 8);
              return (
                <React.Fragment key={artist.id}>
                  <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-black uppercase text-[#0E0E0E] whitespace-nowrap tracking-tight"
                        style={{
                          fontSize: isSquare
                            ? "clamp(9.8px, 2.0cqw, 12.2px)"
                            : "clamp(7.8px, 2.0cqw, 9.8px)",
                          lineHeight: lines.length > 1 ? "0.92" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {idx < rows.row10.length - 1 && (
                    <span className="font-black text-[6.5px] leading-none flex-shrink-0 text-[#00BCD4]">
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 4. RODAPÉ OFICIAL PLANETA ATLÂNTIDA RESTAURADO: Linha Ciano + Slogan + Site + Pílula Vermelha */}
        <div className="w-full flex flex-col items-center text-center pt-0.5">
          <div className="w-28 h-[2px] bg-[#00D2ED] mb-0.5" />

          <p
            className={`font-sans font-black uppercase tracking-wider text-[#141414] leading-none ${
              isSquare ? "text-[10px]" : "text-[9.2px]"
            }`}
          >
            O PLANETA VOLTA A GIRAR
          </p>
          <p className="font-sans font-bold text-[6.5px] uppercase tracking-widest text-[#141414]/80 mt-[1px]">
            saiba mais em: PLANETAATLANTIDA.COM.BR
          </p>

          <div
            className={`mt-0.5 px-3.5 rounded-full bg-[#E53935] text-white flex items-center justify-center gap-2 font-sans font-black uppercase tracking-wider shadow-sm ${
              isSquare ? "py-0.5 text-[7px]" : "py-1 text-[7.5px]"
            }`}
          >
            <span className="px-1 py-[1px] bg-[#B71C1C] rounded text-white">
              FESTIQ
            </span>
            <span>SPOTIFY API</span>
            <span>•</span>
            <span>{isSquare ? "1080×1080" : "1080×1920"}</span>
          </div>
        </div>
      </div>

      {/* 5. COLUNA ILUSTRADA DIREITA (Coqueiros, Globo, Raio 3D, Boca Pop-Art, Ondas) */}
      <div
        className={`relative h-full flex-shrink-0 overflow-hidden ${
          isSquare ? "w-[13%]" : "w-[13%]"
        }`}
      >
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
