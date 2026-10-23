import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Empilha nomes compostos longos em 2 ou 3 linhas centralizadas com entrelinha compacta
 * para garantir que bandas grandes (ex: "RED HOT CHILI PEPPERS", "QUEENS OF THE STONE AGE",
 * "SOPHIA CHABLAU E UMA ENORME PERDA DE TEMPO") apareçam 100% íntegras sem truncar (Zero-Truncate Rule).
 */
function stackFlogGnawName(name: string, maxSingleChars = 13): string[] {
  const clean = name.trim().toUpperCase();
  if (clean.length <= maxSingleChars || !clean.includes(" ")) {
    return [clean];
  }
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [words[0], words[1]];
  }

  // Se o nome for longo (> 24 caracteres e >= 4 palavras), quebra em 3 linhas
  if (clean.length > 24 && words.length >= 4) {
    const t1 = Math.round(words.length / 3);
    const t2 = Math.round((words.length * 2) / 3);
    const p1 = words.slice(0, t1).join(" ");
    const p2 = words.slice(t1, t2).join(" ");
    const p3 = words.slice(t2).join(" ");
    if (p1 && p2 && p3) return [p1, p2, p3];
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
 * Organiza os artistas na icônica pirâmide de centro gravitacional ("Diamante") do Camp Flog Gnaw Carnival:
 * - O Headliner #1 Supremo fica exatamente no CORAÇÃO do cartaz (fileira 7)
 * - As fileiras do topo (1 a 5) têm 2 a 4 artistas cada, crescendo em direção ao centro
 * - As fileiras da base (10 a 14) têm 3 a 4 artistas cada, eliminando sobrecargas na roda-gigante
 */
function buildFlogGnawRows(allArtists: SpotifyArtist[]): {
  topUndercard: SpotifyArtist[][];
  coHeadliners: SpotifyArtist[];
  mainHeadliner: SpotifyArtist;
  midHeadliners: SpotifyArtist[];
  midDuos: SpotifyArtist[];
  bottomUndercard: SpotifyArtist[][];
} {
  const mainHeadliner = allArtists[0];
  const coHeadliners = allArtists.slice(1, 3);
  const midDuos = allArtists.slice(3, 5);
  const midHeadliners = allArtists.slice(5, 9);

  // Pool do topo: 11 artistas distribuídos em 3 fileiras progressivas
  const topPool = allArtists.slice(9, 20);
  const topPattern = [3, 4, 4];
  const topUndercard: SpotifyArtist[][] = [];
  let tCursor = 0;
  for (const size of topPattern) {
    if (tCursor >= topPool.length) break;
    topUndercard.push(topPool.slice(tCursor, tCursor + size));
    tCursor += size;
  }
  if (tCursor < topPool.length) {
    topUndercard.push(topPool.slice(tCursor));
  }

  // Pool da base: demais artistas distribuídos em 5 fileiras equilibradas
  const bottomPool = allArtists.slice(20);
  const bottomUndercard: SpotifyArtist[][] = [];
  let bCursor = 0;
  const bottomPattern = [5, 5, 5, 5, 5];
  for (const size of bottomPattern) {
    if (bCursor >= bottomPool.length) break;
    bottomUndercard.push(bottomPool.slice(bCursor, bCursor + size));
    bCursor += size;
  }
  if (bCursor < bottomPool.length) {
    bottomUndercard.push(bottomPool.slice(bCursor));
  }

  return {
    topUndercard,
    coHeadliners,
    mainHeadliner,
    midHeadliners,
    midDuos,
    bottomUndercard,
  };
}

export const FlogGnawTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  const {
    topUndercard,
    coHeadliners,
    mainHeadliner,
    midHeadliners,
    midDuos,
    bottomUndercard,
  } = buildFlogGnawRows(allArtists);

  const rawTitle = (lineup.title || "CAMP FLOG GNAW").trim().toUpperCase();
  const presenter = `${allArtists[0]?.name?.split(" ")[0]?.toUpperCase() || "FESTIQ STUDIO"} PRESENTS`;

  return (
    <div
      className="w-full h-full text-white flex flex-col justify-between relative overflow-hidden select-none font-display"
      style={{
        background:
          "linear-gradient(180deg, #FDB2C4 0%, #FFAA98 16%, #FF9768 34%, #FF7F3F 54%, #FF5A1C 74%, #F23A00 100%)",
      }}
    >
      {/* 1. LUA CHEIA ROSADA NO CANTO SUPERIOR DIREITO + NUVENS SUAVES */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 360 640"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="flog-moon-grad" cx="42%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FED2DC" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#F8A5B6" stopOpacity="0.2" />
          </radialGradient>
          <filter id="flog-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Lua Cheia Suave */}
        <circle
          cx={isSquare ? "430" : "305"}
          cy={isSquare ? "75" : "68"}
          r={isSquare ? "55" : "48"}
          fill="url(#flog-moon-grad)"
          filter="url(#flog-glow)"
        />

        {/* Nuvens etéreas de pôr do sol */}
        <ellipse cx="60" cy="115" rx="85" ry="18" fill="#FFC8D4" fillOpacity="0.32" filter="blur(6px)" />
        <ellipse cx="310" cy="240" rx="95" ry="22" fill="#FFA585" fillOpacity="0.28" filter="blur(8px)" />
        <ellipse cx="50" cy="390" rx="110" ry="25" fill="#FF784A" fillOpacity="0.22" filter="blur(10px)" />
      </svg>

      {/* 2. BORBOLETAS ILUSTRADAS EM SVG (MONARCAS LARANJA E MORPHOS AZUIS) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 360 640"
        preserveAspectRatio="none"
      >
        {/* Borboleta Monarca Topo Direito */}
        <g transform="translate(315, 82) scale(0.65) rotate(18)">
          <path d="M0,0 Q-12,-16 -4,-28 Q8,-26 12,-12 Z" fill="#E65100" stroke="#111" strokeWidth="1.2" />
          <path d="M0,0 Q12,-18 20,-14 Q22,-2 10,2 Z" fill="#FF9800" stroke="#111" strokeWidth="1.2" />
          <path d="M-1,-8 L8,-6" stroke="#111" strokeWidth="1.5" />
          <circle cx="0" cy="-10" r="1.5" fill="#111" />
        </g>

        {/* Borboleta Morpho Azul Meio-Esquerda */}
        <g transform="translate(18, 205) scale(0.55) rotate(-22)">
          <path d="M0,0 Q-14,-14 -6,-24 Q6,-22 8,-10 Z" fill="#29B6F6" stroke="#111" strokeWidth="1.2" />
          <path d="M0,0 Q10,-16 18,-10 Q16,-1 6,2 Z" fill="#0288D1" stroke="#111" strokeWidth="1.2" />
          <circle cx="0" cy="-8" r="1.2" fill="#111" />
        </g>

        {/* Borboleta Monarca Fileira 5 */}
        <g transform="translate(56, 245) scale(0.5) rotate(-10)">
          <path d="M0,0 Q-12,-16 -4,-28 Q8,-26 12,-12 Z" fill="#FF6D00" stroke="#111" strokeWidth="1.2" />
          <path d="M0,0 Q12,-18 20,-14 Q22,-2 10,2 Z" fill="#FFA726" stroke="#111" strokeWidth="1.2" />
          <circle cx="0" cy="-10" r="1.5" fill="#111" />
        </g>

        {/* Borboleta Azul ao lado do Headliner Central */}
        <g transform="translate(288, 320) scale(0.65) rotate(15)">
          <path d="M0,0 Q-14,-14 -6,-24 Q6,-22 8,-10 Z" fill="#4FC3F7" stroke="#111" strokeWidth="1.2" />
          <path d="M0,0 Q10,-16 18,-10 Q16,-1 6,2 Z" fill="#0288D1" stroke="#111" strokeWidth="1.2" />
          <circle cx="0" cy="-8" r="1.2" fill="#111" />
        </g>

        {/* Borboleta Monarca Grande Inferior */}
        <g transform="translate(278, 515) scale(0.85) rotate(-18)">
          <path d="M0,0 Q-16,-20 -6,-34 Q10,-30 15,-14 Z" fill="#E65100" stroke="#111" strokeWidth="1.5" />
          <path d="M0,0 Q15,-22 25,-16 Q26,-2 12,3 Z" fill="#FF9800" stroke="#111" strokeWidth="1.5" />
          <line x1="-1" y1="-12" x2="12" y2="-8" stroke="#111" strokeWidth="1.8" />
          <circle cx="0" cy="-12" r="1.8" fill="#111" />
        </g>

        {/* Borboleta Morpho Inferior Esquerda */}
        <g transform="translate(92, 570) scale(0.7) rotate(25)">
          <path d="M0,0 Q-14,-14 -6,-24 Q6,-22 8,-10 Z" fill="#29B6F6" stroke="#111" strokeWidth="1.2" />
          <path d="M0,0 Q10,-16 18,-10 Q16,-1 6,2 Z" fill="#01579B" stroke="#111" strokeWidth="1.2" />
          <circle cx="0" cy="-8" r="1.5" fill="#111" />
        </g>
      </svg>

      {/* 3. CABEÇALHO CARNIVAL: "TYLER PRESENTS..." + LOGO 3D SLAB-SERIF + TICKETS LATERAIS */}
      <div
        className={`relative z-10 w-full flex flex-col items-center text-center ${
          isSquare ? "pt-2.5 pb-1 px-4" : "pt-3.5 pb-1 px-3"
        }`}
      >
        {/* Presenter tag estilo Camp Flog Gnaw */}
        <p
          className="font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1.5px_0_#141414] leading-none mb-1 text-[8px]"
          style={{ WebkitTextStroke: "0.2px #141414" }}
        >
          {presenter}
        </p>

        {/* Logotipo Monumental Slab-Serif 3D Azul-Celeste e Branco */}
        <h1
          className="font-display font-black uppercase text-white tracking-[0.02em] leading-[0.88] select-none text-center"
          style={{
            fontSize: isSquare ? "clamp(24px, 5.2cqw, 32px)" : "clamp(22px, 6.2cqw, 28px)",
            WebkitTextStroke: "1.8px #0E0E0E",
            paintOrder: "stroke fill",
            textShadow:
              "1px 1px 0 #0E0E0E, 2px 2px 0 #0E0E0E, 3px 3px 0 #0E0E0E, 4px 4px 0 #0E0E0E, 5px 5px 0 #0E0E0E",
            backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #D8F4FD 48%, #85D8F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {rawTitle}
        </h1>

        {/* Bloco CARNIVAL + Placas 3D Laterais */}
        <div className="flex items-center justify-center gap-1.5 mt-1 w-full max-w-[94%]">
          {/* Ticket 3D Esquerdo */}
          <div
            className="px-2 py-[2px] bg-[#91E3FC] border-[1.5px] border-[#0E0E0E] rounded-[4px] shadow-[2px_2.5px_0px_#0E0E0E] leading-none -rotate-[2deg]"
          >
            <span className="font-display font-black text-[#0E0E0E] uppercase text-[7px] tracking-wider">
              PALCO IQ
            </span>
          </div>

          {/* Letreiro CARNIVAL Extrudado */}
          <span
            className="font-display font-black uppercase tracking-[0.14em] pl-[0.14em] text-[#0E0E0E] leading-none"
            style={{
              fontSize: isSquare ? "15px" : "13.5px",
              WebkitTextStroke: "1.2px #0E0E0E",
              paintOrder: "stroke fill",
              color: "#FFFFFF",
              textShadow: "1.5px 2px 0px #0E0E0E",
            }}
          >
            CARNIVAL
          </span>

          {/* Ticket 3D Direito */}
          <div
            className="px-2 py-[2px] bg-[#91E3FC] border-[1.5px] border-[#0E0E0E] rounded-[4px] shadow-[2px_2.5px_0px_#0E0E0E] leading-none rotate-[2deg]"
          >
            <span className="font-display font-black text-[#0E0E0E] uppercase text-[7px] tracking-wider">
              {lineup.timeRange === "short_term" ? "4 SEMANAS" : lineup.timeRange === "long_term" ? "HISTÓRICO" : "NOV 22-23"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. CORPO DO LINEUP EM CENTRO GRAVITACIONAL ("DIAMANTE" INVERTIDO) */}
      <div
        className={`relative z-10 flex-1 w-full flex flex-col justify-between items-center text-center overflow-hidden ${
          isSquare ? "px-6 py-1" : "px-3 py-1.5"
        }`}
      >
        {/* FILEIRAS 1 A 3: TOP UNDERCARD (Crescendo em direção ao centro) */}
        {topUndercard.map((row, rIdx) => {
          const fontSizeStyle = isSquare
            ? rIdx === 0
              ? "clamp(9.5px, 2.2cqw, 12px)"
              : rIdx === 1
              ? "clamp(10.2px, 2.4cqw, 12.8px)"
              : "clamp(11px, 2.6cqw, 13.5px)"
            : rIdx === 0
            ? "clamp(8.8px, 2.2cqw, 11px)"
            : rIdx === 1
            ? "clamp(9.5px, 2.4cqw, 11.8px)"
            : "clamp(10.2px, 2.6cqw, 12.5px)";

          return (
            <div
              key={`top-${rIdx}`}
              className="w-full flex items-center justify-center gap-x-1.5 leading-none"
              style={{ fontSize: fontSizeStyle }}
            >
              {row.map((artist, aIdx) => {
                const lines = stackFlogGnawName(artist.name, 11);
                return (
                  <React.Fragment key={artist.id}>
                    <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                      {lines.map((line, lIdx) => (
                        <span
                          key={lIdx}
                          className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                          style={{
                            WebkitTextStroke: "0.45px #0E0E0E",
                            textShadow: "1px 1.5px 0px #0E0E0E, 1.5px 2px 0px #0E0E0E",
                            lineHeight: lines.length > 1 ? "0.9" : "1.0",
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    {aIdx < row.length - 1 && (
                      <span className="text-[#FFCC80] font-sans font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}

        {/* FILEIRA 4: CO-HEADLINERS (2 Artistas de grande peso acima do centro) */}
        <div
          className="w-full flex items-center justify-center gap-x-2 leading-none"
          style={{
            fontSize: isSquare
              ? "clamp(13px, 3.2cqw, 16.5px)"
              : "clamp(11.8px, 3.2cqw, 15px)",
          }}
        >
          {coHeadliners.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.6px #0E0E0E",
                        textShadow: "1.5px 2px 0px #0E0E0E, 2px 2.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.9" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < coHeadliners.length - 1 && (
                  <span className="text-[#FFCC80] font-sans font-black leading-none mx-1 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* FILEIRA 5: O CENTRO GRAVITACIONAL — HEADLINER SUPREMO #1 */}
        <div className="w-full flex items-center justify-center leading-none my-0.5">
          {mainHeadliner && (
            <div className="inline-flex flex-col items-center justify-center text-center leading-none">
              {stackFlogGnawName(mainHeadliner.name, 18).map((line, lIdx) => (
                <span
                  key={lIdx}
                  className="font-display font-black uppercase text-white whitespace-nowrap tracking-wider"
                  style={{
                    fontSize: isSquare ? "clamp(17px, 4.2cqw, 22px)" : "clamp(15.5px, 4.4cqw, 20.5px)",
                    WebkitTextStroke: "0.9px #0E0E0E",
                    paintOrder: "stroke fill",
                    textShadow:
                      "1.5px 2px 0 #0E0E0E, 2.5px 3px 0 #0E0E0E, 3px 3.5px 0 #0E0E0E",
                  }}
                >
                  {line}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* FILEIRA 6: SUB-HEADLINERS (3 a 4 Artistas abaixo do centro) */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 leading-none"
          style={{
            fontSize: isSquare
              ? "clamp(11px, 2.5cqw, 14px)"
              : "clamp(10px, 2.5cqw, 12.8px)",
          }}
        >
          {midHeadliners.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, 11);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.5px #0E0E0E",
                        textShadow: "1px 1.5px 0px #0E0E0E, 1.5px 2px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.9" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < midHeadliners.length - 1 && (
                  <span className="text-[#FFCC80] font-sans font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* FILEIRA 7: DUOS DE DESTAQUE */}
        <div
          className="w-full flex items-center justify-center gap-x-2 leading-none"
          style={{
            fontSize: isSquare
              ? "clamp(11.8px, 2.8cqw, 15px)"
              : "clamp(10.8px, 2.8cqw, 13.8px)",
          }}
        >
          {midDuos.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.55px #0E0E0E",
                        textShadow: "1.2px 1.8px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.9" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < midDuos.length - 1 && (
                  <span className="text-[#FFCC80] font-sans font-black leading-none mx-1 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* FILEIRAS 8+: BOTTOM UNDERCARD (Decrescendo até a floresta) */}
        {bottomUndercard.map((row, rIdx) => {
          const fontSizeStyle = isSquare
            ? "clamp(9.5px, 2.2cqw, 12px)"
            : "clamp(8.8px, 2.2cqw, 11px)";

          return (
            <div
              key={`bottom-${rIdx}`}
              className="w-full flex items-center justify-center gap-x-1.5 leading-none"
              style={{ fontSize: fontSizeStyle }}
            >
              {row.map((artist, aIdx) => {
                const lines = stackFlogGnawName(artist.name, 10);
                return (
                  <React.Fragment key={artist.id}>
                    <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                      {lines.map((line, lIdx) => (
                        <span
                          key={lIdx}
                          className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                          style={{
                            WebkitTextStroke: "0.45px #0E0E0E",
                            textShadow: "1px 1.5px 0px #0E0E0E, 1.5px 2px 0px #0E0E0E",
                            lineHeight: lines.length > 1 ? "0.9" : "1.0",
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    {aIdx < row.length - 1 && (
                      <span className="text-[#FFCC80] font-sans font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 5. ILUSTRAÇÃO INFERIOR DO CAMP FLOG GNAW: SILHUETA DE PINHEIROS + RODA-GIGANTE CIANO + CIRCO */}
      <div className="relative z-10 w-full mt-auto">
        <svg
          viewBox="0 0 360 88"
          className={`w-full block pointer-events-none select-none ${
            isSquare ? "h-[58px]" : "h-[64px]"
          }`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Silhueta de prédios da cidade ao fundo */}
          <path
            d="M 120 45 L 120 30 L 132 30 L 132 25 L 142 25 L 142 35 L 152 35 L 152 20 L 165 20 L 165 38 L 195 38 L 195 18 L 210 18 L 210 32 L 225 32 L 225 45 Z"
            fill="#E64A19"
            fillOpacity="0.45"
          />

          {/* RODA-GIGANTE CENTRAL ILUMINADA EM CIANO */}
          <g transform="translate(180, 42)">
            {/* Suporte em A da roda-gigante */}
            <line x1="0" y1="0" x2="-14" y2="38" stroke="#10809C" strokeWidth="2" />
            <line x1="0" y1="0" x2="14" y2="38" stroke="#10809C" strokeWidth="2" />
            <line x1="-9" y1="24" x2="9" y2="24" stroke="#10809C" strokeWidth="1.5" />

            {/* Aros da Roda-Gigante */}
            <circle cx="0" cy="0" r="28" stroke="#4DE0F4" strokeWidth="1.5" fill="none" opacity="0.9" />
            <circle cx="0" cy="0" r="22" stroke="#4DE0F4" strokeWidth="1" fill="none" opacity="0.65" />
            <circle cx="0" cy="0" r="14" stroke="#4DE0F4" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="0" cy="0" r="4" fill="#4DE0F4" />

            {/* Raios da roda */}
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#4DE0F4" strokeWidth="1" opacity="0.75" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#4DE0F4" strokeWidth="1" opacity="0.75" />
            <line x1="-20" y1="-20" x2="20" y2="20" stroke="#4DE0F4" strokeWidth="1" opacity="0.75" />
            <line x1="-20" y1="20" x2="20" y2="-20" stroke="#4DE0F4" strokeWidth="1" opacity="0.75" />

            {/* Cabines */}
            <circle cx="-28" cy="0" r="2.2" fill="#FFE082" />
            <circle cx="28" cy="0" r="2.2" fill="#FFE082" />
            <circle cx="0" cy="-28" r="2.2" fill="#FFE082" />
            <circle cx="0" cy="28" r="2.2" fill="#FFE082" />
            <circle cx="-20" cy="-20" r="2.2" fill="#FFE082" />
            <circle cx="20" cy="20" r="2.2" fill="#FFE082" />
            <circle cx="-20" cy="20" r="2.2" fill="#FFE082" />
            <circle cx="20" cy="-20" r="2.2" fill="#FFE082" />
          </g>

          {/* Tenda de Circo / Carnaval à Esquerda da Roda */}
          <polygon points="144,48 156,36 168,48" fill="#FF5252" stroke="#0E0E0E" strokeWidth="1" />
          <polygon points="144,48 150,36 156,48" fill="#FFFFFF" />
          <polygon points="156,48 162,36 168,48" fill="#FFFFFF" />

          {/* Silhueta Densa de Floresta de Pinheiros ao Longo de Toda a Base */}
          <path
            d="M 0 88 L 0 54 L 6 42 L 12 54 L 18 38 L 24 52 L 32 40 L 40 50 L 48 36 L 56 52 L 66 38 L 76 50 L 88 42 L 100 52 L 114 44 L 128 54 L 140 48 L 152 56 L 168 50 L 180 54 L 194 48 L 208 54 L 222 46 L 236 54 L 250 40 L 264 52 L 278 42 L 292 54 L 306 38 L 318 52 L 330 40 L 342 50 L 352 38 L 360 48 L 360 88 Z"
            fill="#091C12"
          />

          {/* Colina de Musgo Verde no Rodapé */}
          <path
            d="M 0 88 Q 90 74 180 77 Q 270 80 360 74 L 360 88 Z"
            fill="#1B4D2E"
          />
        </svg>

        {/* Rodapé com Site Oficial e Badge Festiq */}
        <div className="w-full bg-[#1B4D2E] pb-1.5 pt-0.5 px-4 flex items-center justify-between text-[7px] font-mono text-white/90 uppercase tracking-widest">
          <span className="font-bold text-[#A5D6A7]">FESTIQ · CAMP FLOG GNAW TRIBUTE</span>
          <span className="font-black text-white">WWW.CAMPFLOGGNAW.COM</span>
          <span className="font-bold text-[#FFE082]">{isSquare ? "1080×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
