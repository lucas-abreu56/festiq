import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Quebra nomes longos de headliners em 2 linhas equilibradas (como "QUEENS OF / THE STONE AGE"
 * ou "RED HOT / CHILI PEPPERS" no pôster real do Lollapalooza), mantendo corpo grande
 * e impedindo que vazem da coluna ciano.
 */
function splitHeadlinerLines(name: string): string[] {
  const clean = name.trim();
  if (clean.length <= 14 || !clean.includes(" ")) {
    return [clean];
  }
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [words[0], words[1]];
  }
  // Encontra o ponto de corte mais equilibrado em número de caracteres
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

export const LollaWaveTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Coluna esquerda (Ciano): 10 Headliners alinhados à direita, 100% dentro da onda ciano
  const headliners = allArtists.slice(0, 10);
  // Coluna direita (Amarelo-Limão): 35 artistas do undercard distribuídos em linhas coesas
  const undercard = allArtists.slice(10);

  // Agrupa o undercard balanceando a soma de caracteres por linha para preencher a coluna amarela sem buracos
  const undercardRows: (typeof undercard)[] = [];
  const targetCharsPerRow = isSquare ? 36 : 32;
  let currentRow: typeof undercard = [];
  let currentLen = 0;

  undercard.forEach((artist) => {
    const nameLen = artist.name.length;
    if (
      currentRow.length >= 4 ||
      (currentRow.length >= 2 && currentLen + nameLen > targetCharsPerRow)
    ) {
      undercardRows.push(currentRow);
      currentRow = [artist];
      currentLen = nameLen;
    } else {
      currentRow.push(artist);
      currentLen += nameLen + 3;
    }
  });
  if (currentRow.length > 0) {
    undercardRows.push(currentRow);
  }

  return (
    <div className="w-full h-full bg-[#F25444] text-[#0D0D0D] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Camada Gráfica de Fundo: Fronteira Ciano/Amarelo alinhada exatamente em 39.5% (x=237 de 600) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="600" height="900" fill="#F25444" />

        {/* Textura Street-Art no Canto Superior Esquerdo ("15" / Grafismos Pretos) */}
        <g fill="#0D0D0D" opacity="0.88">
          <text x="8" y="42" fontSize="34" fontWeight="900" fontFamily="Impact, sans-serif" transform="rotate(-12 8 42)">
            15
          </text>
          <text x="58" y="28" fontSize="28" fontWeight="900" fontFamily="Impact, sans-serif" transform="rotate(8 58 28)">
            15
          </text>
          <text x="4" y="105" fontSize="32" fontWeight="900" fontFamily="Impact, sans-serif" transform="rotate(-6 4 105)">
            15
          </text>
          <text x="2" y="175" fontSize="30" fontWeight="900" fontFamily="Impact, sans-serif" transform="rotate(10 2 175)">
            15
          </text>
          <circle cx="24" cy="64" r="10" />
          <circle cx="20" cy="62" r="2.5" fill="#F25444" />
          <circle cx="28" cy="62" r="2.5" fill="#F25444" />
        </g>

        {/* Onda Orgânica Ciano à Esquerda (cobre até x=242..248 em toda a altura vertical) */}
        <path
          d="M 18 890 C 12 720, 8 580, 14 420 C 20 250, 30 110, 88 26 C 135 -10, 240 0, 330 18 L 330 890 Z"
          fill="#63CBD8"
        />

        {/* Espirais Ciano Claros dentro da Onda Esquerda */}
        <circle
          cx="135"
          cy="195"
          r="92"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="22"
          opacity="0.7"
        />
        <circle
          cx="135"
          cy="195"
          r="46"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="18"
          opacity="0.7"
        />
        <circle
          cx="145"
          cy="530"
          r="82"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="20"
          opacity="0.65"
        />
        <circle
          cx="145"
          cy="530"
          r="38"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="16"
          opacity="0.65"
        />

        {/* Campo Orgânico Amarelo-Limão à Direita (Fronteira estável em x=238..244 = 39.8% da largura) */}
        <path
          d="M 335 0 C 300 50, 242 120, 240 280 C 238 450, 242 660, 236 890 L 600 890 L 600 0 Z"
          fill="#E2F018"
        />

        {/* Flores de Hibisco Tropicais no Canto Superior Direito */}
        <g transform="translate(510, -8)">
          <circle cx="45" cy="35" r="28" fill="#FF77A9" opacity="0.9" />
          <circle cx="72" cy="52" r="24" fill="#FF4081" opacity="0.85" />
          <path d="M20 15 Q 45 45 85 20" stroke="#2E7D32" strokeWidth="6" fill="none" />
          <circle cx="48" cy="36" r="6" fill="#C2185B" />
        </g>

        {/* Estrelas Brancas e Brilhos na Onda Ciano */}
        <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <path d="M68 115 L68 129 M61 122 L75 122 M63 117 L73 127 M73 117 L63 127" />
          <path d="M46 250 L46 262 M40 256 L52 256 M42 252 L50 260 M50 252 L42 260" />
          <path d="M88 475 L88 487 M82 481 L94 481 M84 477 L92 485 M92 477 L84 485" />
        </g>

        {/* Mão Vetorial Fazendo Símbolo do Rock na Borda Esquerda */}
        <g transform="translate(-4, 385)" fill="#E0F2F1" stroke="#0D0D0D" strokeWidth="2.5">
          <path d="M0 65 L26 42 L32 18 C33 14 38 15 37 20 L33 40 L42 42 L50 22 C52 18 57 20 55 25 L46 48 L34 62 L0 82 Z" />
        </g>

        {/* Trilhas Onduladas Pretas no Canto Inferior Esquerdo */}
        <path
          d="M 8 660 Q 24 725, 16 795 Q 12 830, 42 840 L 160 855"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="3.2"
          strokeDasharray="160 6"
        />
        <path
          d="M 2 685 Q 16 745, 10 810 Q 6 842, 36 850 L 150 865"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="2.2"
        />
      </svg>

      {/* 2. Cabeçalho Oficial (Data/Local 100% no Ciano + Logo Estilo Lolla 3D no Amarelo) */}
      <div
        className={`relative z-10 px-4 sm:px-5 flex items-center w-full ${
          isSquare ? "pt-3 pb-1" : "pt-4 pb-1.5"
        }`}
      >
        {/* Data e Local (38% da largura -> termina exatamente antes da fronteira de 39.8%) */}
        <div className="w-[38%] text-right pr-2.5">
          <p className="font-sans text-[8px] sm:text-[9px] font-extrabold text-[#0D0D0D] leading-tight">
            Outubro 24, 25 e 26 de 2026
          </p>
          <p className="font-sans text-[7.5px] sm:text-[8.5px] font-bold text-[#0D0D0D]/90 leading-tight">
            Autódromo de Interlagos
          </p>
          <p className="font-sans text-[7.5px] sm:text-[8.5px] font-bold text-[#0D0D0D]/90 leading-tight">
            São Paulo, SP
          </p>
        </div>

        {/* Logo Principal com Extrusão 3D Preta Fiel ao Lollapalooza */}
        <div className="w-[62%] flex flex-col items-start pl-2">
          <div className="relative inline-block">
            <span
              className={`font-display font-black uppercase tracking-tight text-white block leading-none px-3 py-1 bg-[#0D0D0D] rounded-md border-2 border-white shadow-[4px_4px_0px_#0D0D0D] ${
                isSquare ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              }`}
            >
              {lineup.title}
            </span>
            <span className="inline-block bg-[#0D0D0D] text-white font-display font-black text-[7px] sm:text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mt-0.5 float-right">
              BRASIL
            </span>
          </div>
        </div>
      </div>

      {/* 3. Corpo do Lineup: Divisão Exata 38% (Ciano) / 62% (Amarelo-Limão) — Zero Vazamento de Cor */}
      <div
        className={`relative z-10 flex-1 px-3.5 sm:px-5 flex items-stretch w-full overflow-hidden ${
          isSquare ? "py-1" : "py-1.5"
        }`}
      >
        {/* COLUNA ESQUERDA (38%): 10 Headliners Empilhados e 100% Dentro do Ciano */}
        <div className="w-[38%] flex flex-col justify-between text-right pr-2.5 py-0.5">
          {headliners.map((artist) => {
            const lines = splitHeadlinerLines(artist.name);
            const isShort = artist.name.length <= 6; // Ex: SZA, ALOK, LORDE, BECK
            const maxLineLen = Math.max(...lines.map((l) => l.length));

            // Escala adaptativa: nomes curtos (SZA) ganham corpo máximo; nomes em 2 linhas mantêm impacto forte sem vazar
            const sizeClass = isSquare
              ? isShort
                ? "text-lg sm:text-xl tracking-normal"
                : maxLineLen > 13
                ? "text-[11.5px] sm:text-[13px] tracking-tighter"
                : "text-sm sm:text-base tracking-tight"
              : isShort
              ? "text-xl sm:text-2xl tracking-normal"
              : maxLineLen > 13
              ? "text-[13px] sm:text-[15px] tracking-tighter"
              : "text-base sm:text-lg tracking-tight";

            return (
              <div key={artist.id} className="leading-none">
                {lines.map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className={`block font-display font-black uppercase text-[#0D0D0D] ${sizeClass}`}
                    style={{ lineHeight: lines.length > 1 ? "0.86" : "0.92" }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA (62%): 35 Artistas do Undercard 100% Dentro do Amarelo-Limão */}
        <div className="w-[62%] flex flex-col justify-between text-left pl-2.5 py-0.5">
          {undercardRows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="w-full flex flex-wrap items-center justify-start gap-x-1.5 gap-y-0 leading-none"
            >
              {row.map((artist, aIdx) => {
                const isShortUnder = artist.name.length <= 6;
                return (
                  <React.Fragment key={artist.id}>
                    <span
                      className={`font-display font-black uppercase text-[#0D0D0D] ${
                        isSquare
                          ? isShortUnder
                            ? "text-[10px] sm:text-[11px] tracking-normal"
                            : "text-[9px] sm:text-[10px] tracking-tight"
                          : isShortUnder
                          ? "text-[11px] sm:text-[12.5px] tracking-normal"
                          : "text-[10px] sm:text-[11.5px] tracking-tight"
                      }`}
                      style={{ lineHeight: "1.02" }}
                    >
                      {artist.name}
                    </span>
                    {aIdx < row.length - 1 && (
                      <span className="text-[#0097A7] font-black text-[8px] sm:text-[9px] leading-none">
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rodapé Oficial: Silhueta da Multidão + Barra Preta de Assinatura */}
      <div className="relative z-10 mt-auto">
        <svg
          className={`w-full block ${isSquare ? "h-4 sm:h-5" : "h-6 sm:h-7"}`}
          viewBox="0 0 600 45"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 45 L0 32 Q 90 28, 180 36 L 236 34 L 285 18 L 295 28 L 340 20 L 385 30 L 420 12 L 435 28 L 495 16 L 540 28 L 585 8 L 600 22 L 600 45 Z"
            fill="#0D0D0D"
          />
        </svg>

        <div
          className={`bg-[#0D0D0D] px-4 flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-mono text-white/85 uppercase ${
            isSquare ? "py-1.5" : "py-2"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-sm bg-[#E2F018] text-[#0D0D0D] font-black">
              FESTIQ
            </span>
            <span className="px-1.5 py-0.5 rounded-sm bg-[#63CBD8] text-[#0D0D0D] font-black">
              SPOTIFY API
            </span>
            <span className="text-white/60 hidden sm:inline">
              {lineup.subtitle}
            </span>
          </div>
          <div className="text-right text-white/70 font-bold tracking-wider">
            <span>{isSquare ? "1080 × 1080 PX" : "1080 × 1920 PX"}</span>
            <span className="mx-1 text-[#E2F018]">•</span>
            <span>{allArtists.length} ARTISTAS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
