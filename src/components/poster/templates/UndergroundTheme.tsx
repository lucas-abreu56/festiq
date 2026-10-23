import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Empilha nomes compostos longos em 2 linhas centralizadas com entrelinha compacta
 * para que bandas com nomes longos (ex: "HOMIXIDE GANG", "DENZEL CURRY", "SHECK WES",
 * "STOPBEINGANTISOCIAL") apareçam 100% inteiras sem truncamento (Zero-Truncate Rule).
 */
function stackUndergroundName(name: string, maxSingleChars = 11): string[] {
  const clean = name.trim().toUpperCase();
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

export const UndergroundTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Estrutura fiel ao pôster preto brutalista ("Visual Concept Only"):
  // Linha 1: 1 Mega Headliner em largura total (ex: KENDRICK LAMAR)
  const megaHeadliner = allArtists[0];

  // Linha 2: Tríade com Headliner #2 gigante ao centro e 2 Co-Headliners empilhados nas pontas (ex: TRAVIS SCOTT ★ DRAKE ★ KANYE WEST)
  const triadLeft = allArtists[1] || allArtists[0];
  const triadCenter = allArtists[2] || allArtists[0];
  const triadRight = allArtists[3] || allArtists[0];

  // Linha 3: Trio Sub-Headliners (ex: PLAYBOICARTI ★ FUTURE ★ DONTOLIVER)
  const subTrio = allArtists.slice(4, 7);

  // Linha 4: Quarteto Destaque (ex: CHIEF KEEF ★ YEAT ★ LIL YACHTY ★ ASAP ROCKY)
  const featuredQuartet = allArtists.slice(7, 11);

  // Linhas 5 em diante: Undercard denso com estrelas ★ (34 artistas distribuídos em 7 a 9 fileiras)
  const remainingArtists = allArtists.slice(11);
  const rowsCount = isSquare ? 6 : 8;
  const undercardRows: SpotifyArtist[][] = [];
  const baseCount = Math.floor(remainingArtists.length / rowsCount);
  const extraCount = remainingArtists.length % rowsCount;
  let cursor = 0;

  for (let r = 0; r < rowsCount; r++) {
    const count = baseCount + (r < extraCount ? 1 : 0);
    undercardRows.push(remainingArtists.slice(cursor, cursor + count));
    cursor += count;
  }

  const rawTitle = (lineup.title || "UNDERGROUND FESTIVAL").trim().toUpperCase();

  return (
    <div
      className={`w-full h-full bg-[#0A0A0A] text-[#E0E0E0] flex flex-col justify-between relative overflow-hidden select-none font-display ${
        isSquare ? "px-4 py-3" : "px-3.5 py-3"
      }`}
      style={{
        backgroundColor: "#0A0A0A",
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(35, 35, 35, 0.45) 0%, transparent 60%),
          linear-gradient(180deg, #070707 0%, #0E0E0E 40%, #080808 100%)
        `,
      }}
    >
      {/* 1. TEXTURA DE FOTOCÓPIA / XEROX GRANULADO E DOBRAS ANALÓGICAS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0"
        viewBox="0 0 360 640"
        preserveAspectRatio="none"
      >
        <filter id="rage-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rage-noise)" />
        {/* Marcas de dobra horizontal e vertical de xerox */}
        <line x1="0" y1="230" x2="360" y2="232" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.18" strokeDasharray="4 2" />
        <line x1="0" y1="440" x2="360" y2="438" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.14" />
        <line x1="180" y1="0" x2="180" y2="640" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="6 4" />
      </svg>

      {/* 2. BARRA SUPERIOR BRUTALISTA: INSÍGNIA + "VISUAL CONCEPT ONLY." + ESTRELA "SÃO PAULO" */}
      <div className="relative z-10 w-full flex items-center justify-between text-[7px] font-mono uppercase tracking-widest text-[#888888] pb-1 border-b border-[#242424]/80">
        {/* Insígnia Gótica Esquerda */}
        <div className="flex items-center gap-1 text-[#CCCCCC]">
          <span className="text-[9px]">☣</span>
          <span className="font-bold tracking-wider text-[6.5px]">STUDIO</span>
        </div>

        {/* Label Central Visual Concept Only */}
        <span className="text-[#A0A0A0] font-bold tracking-[0.2em] text-[6.8px]">
          VISUAL CONCEPT ONLY.
        </span>

        {/* Estrela Pontiaguda Direita */}
        <div className="flex items-center gap-1 px-1.5 py-[1px] bg-[#1E1E1E] border border-[#383838] rounded-sm text-[#F0F0F0]">
          <span className="font-black text-[6.5px] tracking-wider">NEW YORK</span>
        </div>
      </div>

      {/* 3. HERO GRAPHIC: BRASÃO GÓTICO CROMADO + STENCIL "FESTIVAL" + 4 INSÍGNIAS TRIBAL/DRAGÃO */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center my-0.5">
        <div className="relative w-full flex items-center justify-center">
          {/* Brasão Gótico Caligráfico Halftone em SVG */}
          <svg
            viewBox="0 0 340 105"
            className={`w-full block select-none pointer-events-none ${isSquare ? "h-[62px]" : "h-[74px]"}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="metal-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#C0C0C0" />
                <stop offset="45%" stopColor="#555555" />
                <stop offset="55%" stopColor="#EAEAEA" />
                <stop offset="80%" stopColor="#888888" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>

            {/* Logo Caligráfico Dark Metal Texturizado */}
            <g stroke="url(#metal-chrome)" strokeWidth="3" strokeLinejoin="miter" strokeMiterlimit="6" opacity="0.92">
              <path d="M 25 75 Q 35 15, 65 30 Q 85 45, 100 15 Q 115 45, 135 25 Q 155 10, 170 35 Q 185 10, 205 25 Q 225 45, 240 15 Q 255 45, 275 30 Q 305 15, 315 75 Z" />
              <path d="M 45 65 L 55 35 L 75 55 L 90 25 L 110 50 L 130 20 L 150 48 L 170 18 L 190 48 L 210 20 L 230 50 L 250 25 L 265 55 L 285 35 L 295 65" />
              <path d="M 70 85 L 170 95 L 270 85" strokeWidth="2" strokeDasharray="3 3" />
            </g>

            {/* Estêncil do Nome do Festival ou "FESTIVAL" sobreposto */}
            <text
              x="170"
              y="68"
              textAnchor="middle"
              className="font-display font-black uppercase tracking-[0.16em]"
              fill="#0A0A0A"
              stroke="#D4D4D4"
              strokeWidth="1.8"
              paintOrder="stroke fill"
              fontSize="34"
              style={{
                textShadow: "0 0 10px rgba(255,255,255,0.45)",
              }}
            >
              FESTIVAL
            </text>
          </svg>
        </div>

        {/* 4 Insígnias Tribais / Halftone Crests em Linha */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full -mt-1 opacity-80">
          {[0, 1, 2, 3].map((idx) => (
            <svg
              key={idx}
              viewBox="0 0 42 36"
              className="w-7 h-6 text-[#A0A0A0]"
              fill="currentColor"
            >
              <path d="M21 2 L25 14 L37 10 L29 20 L39 28 L27 26 L23 35 L21 26 L19 35 L15 26 L3 28 L13 20 L5 10 L17 14 Z" opacity="0.85" />
              <circle cx="21" cy="18" r="3.5" fill="#0A0A0A" stroke="currentColor" strokeWidth="1" />
            </svg>
          ))}
        </div>

        {/* Linha Divisória de Estêncil com Data */}
        <div className="w-full flex items-center justify-between border-t border-b border-[#303030] py-1 mt-1">
          <span className="text-[6.5px] font-mono text-[#777777] uppercase tracking-widest pl-1">
            {lineup.subtitle.split("·")[0].trim()}
          </span>
          <span className="font-mono font-black uppercase tracking-[0.24em] text-white text-[8px]">
            22 JANUARY 2027
          </span>
          <span className="text-[6.5px] font-mono text-[#777777] uppercase tracking-widest pr-1">
            OFFICIAL LINEUP
          </span>
        </div>
      </div>

      {/* 4. CORPO DO LINEUP COM ESTRELAS (★) E TIPOGRAFIA XEROX BRUTALISTA */}
      <div
        className={`relative z-10 flex-1 w-full flex flex-col justify-between items-center text-center overflow-hidden my-0.5 ${
          isSquare ? "py-1" : "py-1.5"
        }`}
      >
        {/* LINHA 1: MEGA HEADLINER EM LARGURA TOTAL (Colossal, ex: KENDRICK LAMAR) */}
        {megaHeadliner && (
          <div className="w-full text-center leading-none">
            <span
              className="block font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
              style={{
                fontSize: isSquare ? "clamp(19px, 4.6cqw, 26px)" : "clamp(18px, 5.2cqw, 25px)",
                WebkitTextStroke: "0.8px #E2E2E2",
                textShadow: "0 0 8px rgba(255,255,255,0.35)",
              }}
            >
              {megaHeadliner.name}
            </span>
          </div>
        )}

        {/* LINHA 2: TRÍADE PRINCIPAL (Co-Headliner Esquerdo ★ Headliner #2 Centro ★ Co-Headliner Direito) */}
        <div className="w-full flex items-center justify-between px-1 leading-none">
          {/* Esquerda: Co-headliner empilhado em 2 linhas */}
          <div className="flex-1 flex flex-col items-center justify-center text-center leading-none">
            {stackUndergroundName(triadLeft.name, 9).map((l, lIdx) => (
              <span
                key={lIdx}
                className="font-display font-bold uppercase text-[#D8D8D8] whitespace-nowrap tracking-tight"
                style={{
                  fontSize: isSquare ? "clamp(10.5px, 2.4cqw, 14px)" : "clamp(10px, 2.8cqw, 13px)",
                  lineHeight: "0.88",
                }}
              >
                {l}
              </span>
            ))}
          </div>

          {/* Separador Estrela ★ */}
          <span className="text-[#A5A5A5] text-[11px] leading-none px-1 select-none">★</span>

          {/* Centro: Headliner #2 Gigante */}
          <div className="flex-1 flex flex-col items-center justify-center text-center leading-none">
            {stackUndergroundName(triadCenter.name, 12).map((l, lIdx) => (
              <span
                key={lIdx}
                className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                style={{
                  fontSize: isSquare ? "clamp(14px, 3.4cqw, 19px)" : "clamp(13.5px, 3.9cqw, 18px)",
                  WebkitTextStroke: "0.5px #E2E2E2",
                  lineHeight: "0.92",
                }}
              >
                {l}
              </span>
            ))}
          </div>

          {/* Separador Estrela ★ */}
          <span className="text-[#A5A5A5] text-[11px] leading-none px-1 select-none">★</span>

          {/* Direita: Co-headliner empilhado em 2 linhas */}
          <div className="flex-1 flex flex-col items-center justify-center text-center leading-none">
            {stackUndergroundName(triadRight.name, 9).map((l, lIdx) => (
              <span
                key={lIdx}
                className="font-display font-bold uppercase text-[#D8D8D8] whitespace-nowrap tracking-tight"
                style={{
                  fontSize: isSquare ? "clamp(10.5px, 2.4cqw, 14px)" : "clamp(10px, 2.8cqw, 13px)",
                  lineHeight: "0.88",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* LINHA 3: TRIO SUB-HEADLINER (ex: PLAYBOICARTI ★ FUTURE ★ DONTOLIVER) */}
        <div className="w-full flex items-center justify-between px-1.5 leading-none">
          {subTrio.map((artist, aIdx) => {
            const lines = stackUndergroundName(artist.name, 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="flex-1 flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((l, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-bold uppercase text-white whitespace-nowrap tracking-tight"
                      style={{
                        fontSize: isSquare ? "clamp(9.5px, 2.2cqw, 12.5px)" : "clamp(9px, 2.6cqw, 12px)",
                        lineHeight: lines.length > 1 ? "0.9" : "1.0",
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                {aIdx < subTrio.length - 1 && (
                  <span className="text-[#888888] text-[9.5px] leading-none px-0.5 select-none">★</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 4: QUARTETO DESTAQUE COM EMPILHAMENTO (ex: CHIEF KEEF ★ YEAT ★ LIL YACHTY ★ ASAP ROCKY) */}
        <div className="w-full flex items-center justify-between px-1 leading-none">
          {featuredQuartet.map((artist, aIdx) => {
            const lines = stackUndergroundName(artist.name, 8);
            return (
              <React.Fragment key={artist.id}>
                <div className="flex-1 flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((l, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-extrabold uppercase text-[#ECECEC] whitespace-nowrap tracking-tight"
                      style={{
                        fontSize: isSquare ? "clamp(9px, 2.0cqw, 11.5px)" : "clamp(8.5px, 2.4cqw, 11px)",
                        lineHeight: lines.length > 1 ? "0.9" : "1.0",
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                {aIdx < featuredQuartet.length - 1 && (
                  <span className="text-[#888888] text-[8.5px] leading-none px-0.5 select-none">★</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHAS 5 EM DIANTE: UNDERCARD BRUTALISTA DENSE COM SEPARADORES ★ */}
        {undercardRows.map((row, rIdx) => {
          const fontSizeStyle = isSquare
            ? "clamp(7.6px, 1.8cqw, 9.8px)"
            : "clamp(7.0px, 2.0cqw, 8.8px)";

          return (
            <div
              key={`under-${rIdx}`}
              className="w-full flex items-center justify-between px-1 leading-none overflow-hidden"
              style={{ fontSize: fontSizeStyle }}
            >
              {row.map((artist, aIdx) => {
                const lines = stackUndergroundName(artist.name, 10);
                return (
                  <React.Fragment key={artist.id}>
                    <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                      {lines.map((l, lIdx) => (
                        <span
                          key={lIdx}
                          className="font-display font-bold uppercase text-[#C8C8C8] whitespace-nowrap tracking-tighter"
                          style={{ lineHeight: lines.length > 1 ? "0.9" : "1.0" }}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                    {aIdx < row.length - 1 && (
                      <span className="text-[#666666] text-[7.5px] leading-none select-none">★</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 5. RODAPÉ BRUTALISTA: "VISUAL CONCEPT ONLY" + BADGES METÁLICAS */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-1 border-t border-[#262626]">
        {/* Faixa Stencil Expandida */}
        <span
          className="font-display font-black uppercase text-[#E0E0E0] tracking-[0.28em] pl-[0.28em] leading-none mb-1 text-[8.5px]"
          style={{ WebkitTextStroke: "0.2px #FFFFFF" }}
        >
          V I S U A L &nbsp; C O N C E P T &nbsp; O N L Y
        </span>

        {/* Metadados e Insígnias de Rodapé */}
        <div className="w-full flex items-center justify-between text-[6.5px] font-mono text-[#777777] uppercase px-1">
          {/* Mini Crests Esquerda */}
          <div className="flex items-center gap-1 text-[#888888]">
            <span>☣</span>
            <span>DESIGNED 2026</span>
          </div>

          {/* Pílula Central */}
          <div className="px-2 py-[1px] bg-[#161616] border border-[#333333] rounded-full text-[#DDDDDD] font-bold">
            FESTIQ STUDIO ©
          </div>

          {/* Mini Crests Direita */}
          <div className="flex items-center gap-1 text-[#888888]">
            <span>COPYRIGHT</span>
            <span>☣</span>
          </div>
        </div>
      </div>
    </div>
  );
};
