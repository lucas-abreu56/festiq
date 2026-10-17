import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const LollaWaveTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  // Todos os 45 artistas garantidos
  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Coluna esquerda (Ciano): 10 Headliners alinhados à direita, como no pôster oficial do Lolla
  const headliners = allArtists.slice(0, 10);
  // Coluna direita (Amarelo-Limão): Todos os 35 artistas restantes do undercard
  const undercard = allArtists.slice(10);

  // Agrupa o undercard em linhas densas de 3 a 4 artistas (exatamente ~12 a 15 linhas como no cartaz oficial)
  const undercardRows: (typeof undercard)[] = [];
  const perRow = isSquare ? 3 : 3;
  for (let i = 0; i < undercard.length; i += perRow) {
    undercardRows.push(undercard.slice(i, i + perRow));
  }

  return (
    <div className="w-full h-full bg-[#F25444] text-[#0D0D0D] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Camada Gráfica de Fundo: Cantos Street-Art Vermelhos + Onda Ciano + Campo Amarelo-Limão */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fundo Vermelho Coral (Aparece no canto superior esquerdo como no cartaz oficial) */}
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

        {/* Onda Orgânica Ciano à Esquerda */}
        <path
          d="M 18 890 C 12 720, 6 580, 14 420 C 22 250, 32 110, 88 28 C 135 -10, 250 0, 340 18 L 340 890 Z"
          fill="#63CBD8"
        />

        {/* Espirais Ciano Claros dentro da Onda Esquerda */}
        <circle
          cx="145"
          cy="185"
          r="95"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="22"
          opacity="0.7"
        />
        <circle
          cx="145"
          cy="185"
          r="48"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="18"
          opacity="0.7"
        />
        <circle
          cx="155"
          cy="520"
          r="85"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="20"
          opacity="0.65"
        />
        <circle
          cx="155"
          cy="520"
          r="40"
          fill="none"
          stroke="#82D9E4"
          strokeWidth="16"
          opacity="0.65"
        />

        {/* Campo Orgânico Amarelo-Limão à Direita */}
        <path
          d="M 345 0 C 315 65, 235 160, 238 320 C 240 480, 232 680, 210 890 L 600 890 L 600 0 Z"
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
          <path d="M72 110 L72 126 M64 118 L80 118 M66 112 L78 124 M78 112 L66 124" />
          <path d="M52 245 L52 257 M46 251 L58 251 M48 247 L56 255 M56 247 L48 255" />
          <path d="M98 465 L98 477 M92 471 L104 471 M94 467 L102 475 M102 467 L94 475" />
        </g>

        {/* Mão Vetorial Fazendo Símbolo do Rock na Borda Esquerda */}
        <g transform="translate(-4, 375)" fill="#E0F2F1" stroke="#0D0D0D" strokeWidth="2.5">
          <path d="M0 65 L28 42 L34 18 C35 14 40 15 39 20 L35 40 L44 42 L52 22 C54 18 59 20 57 25 L48 48 L36 62 L0 82 Z" />
        </g>

        {/* Trilhas Onduladas Pretas no Canto Inferior Esquerdo */}
        <path
          d="M 8 620 Q 26 700, 18 780 Q 14 820, 45 830 L 175 848"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="3.5"
          strokeDasharray="180 6"
        />
        <path
          d="M 2 650 Q 18 720, 10 795 Q 6 832, 38 842 L 165 860"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="2.5"
        />
      </svg>

      {/* 2. Cabeçalho Oficial (Data/Local Alinhados à Direita + Logo Estilo Lolla 3D) */}
      <div
        className={`relative z-10 px-4 sm:px-5 flex items-center justify-center gap-3 ${
          isSquare ? "pt-3 pb-1" : "pt-5 pb-2"
        }`}
      >
        {/* Data e Local (Sobre o Ciano, Alinhado à Direita) */}
        <div className="w-[37%] text-right pr-1">
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
        <div className="w-[63%] flex flex-col items-start pl-1">
          <div className="relative inline-block">
            <span
              className={`font-display font-black uppercase tracking-tight text-white block leading-none px-2.5 py-1 bg-[#0D0D0D] rounded-md border-2 border-white shadow-[4px_4px_0px_#0D0D0D] ${
                isSquare ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              }`}
            >
              {lineup.title}
            </span>
            <span className="inline-block bg-[#0D0D0D] text-white font-display font-black text-[7px] sm:text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mt-0.5 ml-auto float-right">
              BRASIL
            </span>
          </div>
        </div>
      </div>

      {/* 3. Corpo do Lineup: Coluna Esquerda (10 Headliners Alinhados à Direita) + Coluna Direita (35 Undercard) */}
      <div
        className={`relative z-10 flex-1 px-3 sm:px-5 grid grid-cols-12 gap-2 items-stretch overflow-hidden ${
          isSquare ? "py-0.5" : "py-1.5"
        }`}
      >
        {/* COLUNA ESQUERDA: 10 Headliners Empilhados e Alinhados à Direita sobre a Onda Ciano */}
        <div className="col-span-5 flex flex-col justify-between text-right pr-1.5 py-0.5">
          {headliners.map((artist) => {
            const isLong = artist.name.length > 16;
            return (
              <div key={artist.id} className="leading-none">
                <span
                  className={`block font-display font-black uppercase tracking-tighter text-[#0D0D0D] ${
                    isSquare
                      ? isLong
                        ? "text-[11px] sm:text-xs"
                        : "text-xs sm:text-sm"
                      : isLong
                      ? "text-xs sm:text-sm"
                      : "text-sm sm:text-base"
                  }`}
                  style={{ lineHeight: "0.9" }}
                >
                  {artist.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA: 35 Artistas do Undercard em Linhas Densas sobre o Amarelo-Limão */}
        <div className="col-span-7 flex flex-col justify-between text-left pl-1 py-0.5">
          {undercardRows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="flex flex-wrap items-center justify-start gap-x-1 gap-y-0 leading-none"
            >
              {row.map((artist, aIdx) => (
                <React.Fragment key={artist.id}>
                  <span
                    className={`font-display font-black uppercase tracking-tight text-[#0D0D0D] ${
                      isSquare
                        ? "text-[8px] sm:text-[9px]"
                        : "text-[9px] sm:text-[10.5px]"
                    }`}
                    style={{ lineHeight: "1.02" }}
                  >
                    {artist.name}
                  </span>
                  {aIdx < row.length - 1 && (
                    <span className="text-[#00ACC1] font-black text-[7px] sm:text-[8px] leading-none">
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rodapé Oficial: Silhueta da Multidão + Barra Preta de Assinatura */}
      <div className="relative z-10 mt-auto">
        {/* Silhueta de Público e Mãos Erguidas (SVG Vetorial sem Emojis) */}
        <svg
          className={`w-full block ${isSquare ? "h-5 sm:h-6" : "h-7 sm:h-8"}`}
          viewBox="0 0 600 45"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 45 L0 32 Q 90 28, 180 36 L 230 34 L 285 18 L 295 28 L 340 20 L 385 30 L 420 12 L 435 28 L 495 16 L 540 28 L 585 8 L 600 22 L 600 45 Z"
            fill="#0D0D0D"
          />
        </svg>

        {/* Barra Preta Inferior */}
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
