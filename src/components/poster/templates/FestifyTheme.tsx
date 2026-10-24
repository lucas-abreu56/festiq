import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Empilha nomes compostos longos em 2 ou 3 linhas centralizadas (exatamente como
 * "ARCTIC / MONKEYS", "BURY / TOMORROW" e "ARIANA / GRANDE" no pôster original do Festify),
 * mantendo largura compacta para que cada fileira comporte de 3 a 4 artistas sem buracos
 * e sem jamais truncar nenhuma letra (Zero-Truncate Rule).
 */
function stackFestifyLines(name: string, maxSingleLineChars: number): string[] {
  const clean = name.trim();
  if (clean.length <= maxSingleLineChars) {
    return [clean];
  }
  // Se for palavra única gigante sem espaços (ex: "STOPBEINGANTISOCIAL" com 19 chars),
  // quebra ao meio com hífen tipográfico preservando 100% dos caracteres
  if (!clean.includes(" ")) {
    if (clean.length > 14) {
      const mid = Math.ceil(clean.length / 2);
      return [clean.slice(0, mid) + "-", clean.slice(mid)];
    }
    return [clean];
  }
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [words[0], words[1]];
  }

  // Se o nome for longo (> 28 caracteres e >= 4 palavras), quebra em 3 linhas
  // balanceadas para que cada linha tenha menos de 16 caracteres, blindando contra cortes laterais
  if (clean.length > 28 && words.length >= 4) {
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

export const FestifyTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Estrutura fiel ao cartaz original do Festify (24 artistas no total):
  // Linha 1: 1 Headliner Principal
  // Linha 2: 2 Co-Headliners
  // Linha 3: 3 Sub-Headliners
  // Undercard: 18 artistas distribuídos em fileiras equilibradas:
  // Em 9:16: 5 fileiras (4, 4, 4, 3, 3) garantindo respiro e zero corte
  // Em 1:1: 4 fileiras (5, 5, 4, 4) aproveitando a amplitude de 540px
  const festifyArtists = allArtists.slice(0, 24);
  const mainHeadliner = festifyArtists[0];
  const row2CoHeadliners = festifyArtists.slice(1, 3);
  const row3SubHeadliners = festifyArtists.slice(3, 6);
  const undercard = festifyArtists.slice(6, 24);

  const undercardRows = isSquare
    ? [
        undercard.slice(0, 5),
        undercard.slice(5, 10),
        undercard.slice(10, 14),
        undercard.slice(14, 18),
      ].filter((r) => r.length > 0)
    : [
        undercard.slice(0, 4),
        undercard.slice(4, 8),
        undercard.slice(8, 12),
        undercard.slice(12, 15),
        undercard.slice(15, 18),
      ].filter((r) => r.length > 0);

  const presenterLabel =
    lineup.mode === "genre"
      ? "FESTIQ GENRE SESSION'S"
      : lineup.mode === "popularity"
      ? "FESTIQ TOP CHARTS'"
      : "FESTIQ STUDIO'S";

  return (
    <div className="w-full h-full bg-white text-[#0D0D0D] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Gradiente Solar Superior Fiel ao Festify (#FDE05D -> #FFFFFF) */}
      <div
        className="w-full pointer-events-none absolute top-0 inset-x-0"
        style={{
          height: isSquare ? "25%" : "22%",
          background:
            "linear-gradient(180deg, #FDE05D 0%, #FEE882 48%, #FFF7CC 78%, #FFFFFF 100%)",
        }}
      />

      {/* Detalhes Celestes Laterais (Lua Crescente e Estrelas Amarelas em SVG) */}
      <svg
        className="absolute inset-x-0 pointer-events-none z-10"
        style={{ top: isSquare ? "19%" : "16%", height: "90px" }}
        viewBox="0 0 600 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M44 18C36.5 18 30.5 24 30.5 31.5C30.5 39 36.5 45 44 45C46.5 45 48.8 44.3 50.8 43.1C48.3 44.1 45.5 44.3 42.8 43.3C36.8 41.1 33.7 34.4 35.9 28.4C37.5 24 41.3 20.9 45.8 20.3C45.2 18.9 44.6 18 44 18Z"
          fill="#FDE05D"
        />
        <circle cx="168" cy="10" r="2.2" fill="#FDE05D" />
        <circle cx="24" cy="74" r="3" fill="#FDE05D" />

        <circle cx="489" cy="8" r="2" fill="#FDE05D" />
        <path
          d="M532 8L534.2 12.8L539 15L534.2 17.2L532 22L529.8 17.2L525 15L529.8 12.8L532 8Z"
          fill="#FDE05D"
        />
        <circle cx="566" cy="28" r="3.5" fill="#FDE05D" />
        <path
          d="M536 45L538.5 47.5M538.5 45L536 47.5"
          stroke="#FDE05D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 2. Cabeçalho Azul Royal (Estilo "MANDATORY'S / FORESTFEST 2019") */}
      <div
        className={`relative z-10 text-center px-6 ${
          isSquare ? "pt-4 pb-1" : "pt-6 pb-1"
        }`}
      >
        <p className="font-sans font-extrabold text-[11px] uppercase tracking-[0.08em] text-[#2B6EF2] leading-tight">
          {presenterLabel}
        </p>
        <h1
          className={`font-sans font-black uppercase tracking-[0.03em] text-[#2B6EF2] leading-none mt-0.5 ${
            isSquare ? "text-2xl" : "text-3xl"
          }`}
        >
          {lineup.title}
        </h1>
      </div>

      {/* 3. Pirâmide de Artistas com Ritmo Vertical Uniforme do Topo até a Cabana (Zero Buracos) */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-between items-center w-full ${
          isSquare ? "px-5 py-2" : "px-2.5 py-2"
        }`}
      >
        {/* Nível 1: Headliner Supremo */}
        {mainHeadliner && (
          <div className="text-center w-full">
            <span
              className="block font-sans font-extrabold uppercase text-[#0D0D0D] leading-none"
              style={{
                fontSize:
                  mainHeadliner.name.length > 20
                    ? isSquare
                      ? "clamp(18px, 4.6cqw, 24px)"
                      : "clamp(16px, 4.4cqw, 22px)"
                    : isSquare
                    ? "clamp(22px, 5.6cqw, 29px)"
                    : "clamp(19px, 5.2cqw, 26px)",
                letterSpacing: "0.05em",
              }}
            >
              {mainHeadliner.name}
            </span>
          </div>
        )}

        {/* Nível 2: 2 Co-Headliners em 1 Linha com Gap Equilibrado */}
        <div className="w-full max-w-[92%] flex items-center justify-around text-center">
          {row2CoHeadliners.map((artist) => {
            const lines = stackFestifyLines(artist.name, 14);
            return (
              <div key={artist.id} className="inline-flex flex-col items-center leading-none">
                {lines.map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className="font-sans font-bold uppercase text-[#0D0D0D] whitespace-nowrap"
                    style={{
                      fontSize: isSquare
                        ? "clamp(13px, 3.2cqw, 16.5px)"
                        : "clamp(12.5px, 3.5cqw, 17px)",
                      letterSpacing: "0.04em",
                      lineHeight: lines.length > 1 ? "0.88" : "1.0",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* Nível 3: 3 Sub-Headliners em 1 Linha com espaçamento equilibrado */}
        <div className="w-full max-w-[94%] flex items-center justify-between text-center px-1">
          {row3SubHeadliners.map((artist) => {
            const lines = stackFestifyLines(artist.name, 12);
            return (
              <div key={artist.id} className="inline-flex flex-col items-center leading-none">
                {lines.map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className="font-sans font-bold uppercase text-[#0D0D0D] whitespace-nowrap"
                    style={{
                      fontSize: isSquare
                        ? "clamp(12.5px, 2.9cqw, 16px)"
                        : "clamp(11px, 2.8cqw, 14.5px)",
                      letterSpacing: "0.03em",
                      lineHeight: lines.length > 1 ? "0.88" : "1.0",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* Nível 4+: Undercard (18 artistas no total, fileiras equilibradas de 3 a 4 no 9:16 e 4 a 5 no 1:1) */}
        {undercardRows.map((row, rIdx) => {
          const isShortRow = row.length <= 3;
          const isMidRow = row.length === 4;

          const fontSizeStyle = isSquare
            ? "clamp(10.5px, 2.1cqw, 13.5px)"
            : "clamp(9.0px, 2.3cqw, 11.5px)";

          return (
            <div
              key={`undercard-row-${rIdx}`}
              className={`w-full ${
                isShortRow ? "max-w-[82%]" : isMidRow ? "max-w-[90%]" : "max-w-[96%]"
              } flex items-center justify-between text-center px-1 leading-none`}
            >
              {row.map((artist) => {
                const lines = stackFestifyLines(artist.name, isSquare ? 11 : 9);
                return (
                  <div
                    key={artist.id}
                    className="inline-flex flex-col items-center justify-center text-center px-0.5 leading-none"
                  >
                    {lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="font-sans font-semibold uppercase text-[#141414] whitespace-nowrap"
                        style={{
                          fontSize: fontSizeStyle,
                          letterSpacing: "0.02em",
                          lineHeight: lines.length > 1 ? "0.88" : "1.0",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 4. Ilustração Vetorial Inferior Fiel ao Festify (Cabana, Floresta, Montanhas e Vasos) */}
      <div className="relative z-10 w-full mt-auto bg-white">
        <svg
          viewBox="0 0 600 185"
          className={`w-full block ${isSquare ? "h-[90px]" : "h-[110px]"}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYBottom meet"
        >
          <rect
            x="108"
            y="26"
            width="156"
            height="34"
            rx="17"
            fill="white"
            stroke="#FDE05D"
            strokeWidth="2.2"
          />
          <rect
            x="386"
            y="42"
            width="194"
            height="18"
            rx="9"
            fill="white"
            stroke="#FDE05D"
            strokeWidth="2.2"
          />

          <path
            d="M310 34V18C310 11.3726 315.373 6 322 6H401C405.971 6 410 10.0294 410 15C410 19.9706 405.971 24 401 24H326V34H310Z"
            fill="#FDE05D"
          />
          <rect x="422" y="6" width="46" height="18" rx="9" fill="#FDE05D" />

          <path d="M0 144H600V165H0V144Z" fill="#FDE05D" />
          <path d="M8 165L37 64L55 122L63 94L78 165H8Z" fill="#FDE05D" />
          <path
            d="M70 128C110 128 145 138 175 148L182 92L196 146L216 105L228 152L248 112L258 155H375L380 120L390 155L418 96L435 155L538 118L556 155L582 98L596 155L600 165H0V142C20 132 45 128 70 128Z"
            fill="#FDE05D"
          />

          <polygon points="549,92 536,110 562,110" fill="#FDE05D" />
          <polygon points="549,105 533,126 565,126" fill="#FDE05D" />
          <rect x="546" y="126" width="6" height="25" fill="#FDE05D" />

          <polygon
            points="81,96 63,154 99,154"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line x1="81" y1="96" x2="81" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />

          <g>
            <path
              d="M126 106C106 96 94 78 96 64C108 62 126 74 132 98"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2"
            />
            <line x1="100" y1="68" x2="128" y2="104" stroke="#2B6EF2" strokeWidth="2" />
            <line x1="108" y1="77" x2="100" y2="83" stroke="#2B6EF2" strokeWidth="1.8" />
            <line x1="115" y1="86" x2="106" y2="93" stroke="#2B6EF2" strokeWidth="1.8" />
            <line x1="114" y1="74" x2="122" y2="69" stroke="#2B6EF2" strokeWidth="1.8" />

            <path
              d="M142 106C136 82 146 58 164 52C172 66 168 92 148 106"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2"
            />
            <line x1="162" y1="56" x2="144" y2="106" stroke="#2B6EF2" strokeWidth="2" />
            <line x1="156" y1="70" x2="146" y2="66" stroke="#2B6EF2" strokeWidth="1.8" />
            <line x1="152" y1="82" x2="141" y2="78" stroke="#2B6EF2" strokeWidth="1.8" />
            <line x1="154" y1="78" x2="165" y2="82" stroke="#2B6EF2" strokeWidth="1.8" />

            <rect
              x="129"
              y="105"
              width="16"
              height="12"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
            />
            <circle
              cx="137"
              cy="141"
              r="26"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
            />
            <path
              d="M114 130H160C162 135 163 140 162 145H112C111 140 112 135 114 130Z"
              fill="#2B6EF2"
            />
            <path
              d="M113 145H161C159 156 149 165 137 165C125 165 115 156 113 145Z"
              fill="#FDE05D"
              stroke="#2B6EF2"
              strokeWidth="2"
            />
          </g>

          <polygon
            points="196,95 178,155 214,155"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
          />
          <line x1="196" y1="95" x2="196" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />
          <polygon
            points="214,116 199,165 229,165"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
          />
          <line x1="214" y1="116" x2="214" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />

          <g>
            <rect
              x="309"
              y="34"
              width="12"
              height="36"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
            />
            <rect x="321" y="34" width="6" height="36" fill="#2B6EF2" />

            <polygon
              points="284,64 316,64 358,125 326,125"
              fill="#2B6EF2"
              stroke="#2B6EF2"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="284,64 236,165 332,165"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <polygon points="284,64 294,64 342,165 332,165" fill="#2B6EF2" />

            <polygon
              points="284,83 270,112 298,112"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            <rect
              x="279"
              y="134"
              width="15"
              height="31"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
            />
            <rect x="279" y="134" width="4" height="31" fill="#2B6EF2" />

            <polygon
              points="318,116 347,116 385,134 347,134"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="318,116 347,134 347,165 318,148"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <rect
              x="347"
              y="134"
              width="39"
              height="31"
              fill="#2B6EF2"
              stroke="#2B6EF2"
              strokeWidth="2.2"
            />
            <rect x="353" y="141" width="10" height="12" fill="white" />
            <rect x="369" y="141" width="10" height="12" fill="white" />
          </g>

          <polygon
            points="413,108 401,155 425,155"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
          />
          <line x1="413" y1="108" x2="413" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />
          <polygon
            points="434,98 416,165 452,165"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
          />
          <line x1="434" y1="98" x2="434" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />

          <g>
            <line x1="495" y1="30" x2="495" y2="95" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="495" cy="22" r="8" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 45L483 37" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 62L507 52" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 76L483 68" stroke="#2B6EF2" strokeWidth="2.2" />

            <path d="M487 95L476 70" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="473" cy="63" r="6.5" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />

            <path d="M503 95L513 60" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="515" cy="52" r="6.5" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />

            <path
              d="M484 95H506L502 112C518 112 528 122 525 138C522 152 511 165 495 165C479 165 468 152 465 138C462 122 472 112 488 112L484 95Z"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M466 135C472 130 479 130 485 135C491 140 499 140 505 135C511 130 518 130 524 135L520 149C514 144 508 144 502 149C496 154 488 154 482 149C476 144 471 144 469 149L466 135Z"
              fill="#2B6EF2"
            />
            <path
              d="M470 149C474 146 479 147 484 150C490 154 497 154 503 150C508 147 513 146 519 149C514 159 505 165 495 165C485 165 475 159 470 149Z"
              fill="#FDE05D"
              stroke="#2B6EF2"
              strokeWidth="2"
            />
          </g>

          <line x1="0" y1="165" x2="600" y2="165" stroke="#2B6EF2" strokeWidth="2.5" />
        </svg>

        <div
          className={`w-full bg-white flex items-center justify-center relative px-6 ${
            isSquare ? "pb-1.5 pt-0.5" : "pb-2 pt-0.5"
          }`}
        >
          <span className="font-sans font-black text-sm uppercase tracking-[0.06em] text-[#2B6EF2]">
            FESTIQ
          </span>
          <span className="absolute right-8 font-sans font-bold text-[7.5px] uppercase tracking-widest text-black/25">
            {lineup.timeRange === "short_term"
              ? "LAST MONTH"
              : lineup.timeRange === "medium_term"
              ? "6 MONTHS"
              : "ALL TIME"}
          </span>
        </div>
      </div>
    </div>
  );
};
