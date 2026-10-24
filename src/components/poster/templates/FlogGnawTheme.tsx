import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist, MOCK_ARTISTS } from "@/lib/mock-artists";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Borboleta Monarca Laranja (Vetor Ilustrado Detalhado)
 */
function MonarchButterfly({
  className = "w-3 h-2.5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 24"
      className={`${className} flex-shrink-0 pointer-events-none select-none`}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Asa Esquerda Superior */}
      <path
        d="M15 11C12 4 4 1 1 5C-1 8 1 14 6 15C10 16 13 14 15 11Z"
        fill="#FF6B00"
        stroke="#111"
        strokeWidth="0.9"
      />
      <path
        d="M14 9C10 5 5 3 3 6C2 8 4 12 7 13"
        stroke="#111"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Asa Direita Superior */}
      <path
        d="M17 11C20 4 28 1 31 5C33 8 31 14 26 15C22 16 19 14 17 11Z"
        fill="#FF7A00"
        stroke="#111"
        strokeWidth="0.9"
      />
      <path
        d="M18 9C22 5 27 3 29 6C30 8 28 12 25 13"
        stroke="#111"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Asa Esquerda Inferior */}
      <path
        d="M15 13C12 15 7 17 6 20C5 23 9 24 12 22C14 21 15 17 15 13Z"
        fill="#FFA100"
        stroke="#111"
        strokeWidth="0.8"
      />
      {/* Asa Direita Inferior */}
      <path
        d="M17 13C20 15 25 17 26 20C27 23 23 24 20 22C18 21 17 17 17 13Z"
        fill="#FFA100"
        stroke="#111"
        strokeWidth="0.8"
      />
      {/* Detalhes brancos nos bordos das asas */}
      <circle cx="2" cy="4" r="0.6" fill="#FFF" />
      <circle cx="4" cy="2.5" r="0.6" fill="#FFF" />
      <circle cx="30" cy="4" r="0.6" fill="#FFF" />
      <circle cx="28" cy="2.5" r="0.6" fill="#FFF" />
      {/* Corpo e Antenas */}
      <ellipse cx="16" cy="12" rx="1" ry="5" fill="#111" />
      <path d="M15.5 8C14.5 6 13 5 12 5" stroke="#111" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M16.5 8C17.5 6 19 5 20 5" stroke="#111" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Borboleta Morpho Azul (Vetor Ilustrado Detalhado)
 */
function MorphoButterfly({
  className = "w-3 h-2.5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 24"
      className={`${className} flex-shrink-0 pointer-events-none select-none`}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Asa Esquerda Superior */}
      <path
        d="M15 11C12 4 4 1 1 5C-1 8 1 14 6 15C10 16 13 14 15 11Z"
        fill="#38BDF8"
        stroke="#0B132B"
        strokeWidth="0.9"
      />
      <path
        d="M14 9C10 5 5 3 3 6C2 8 4 12 7 13"
        stroke="#0B132B"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Asa Direita Superior */}
      <path
        d="M17 11C20 4 28 1 31 5C33 8 31 14 26 15C22 16 19 14 17 11Z"
        fill="#0284C7"
        stroke="#0B132B"
        strokeWidth="0.9"
      />
      <path
        d="M18 9C22 5 27 3 29 6C30 8 28 12 25 13"
        stroke="#0B132B"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Asa Esquerda Inferior */}
      <path
        d="M15 13C12 15 7 17 6 20C5 23 9 24 12 22C14 21 15 17 15 13Z"
        fill="#7DD3FC"
        stroke="#0B132B"
        strokeWidth="0.8"
      />
      {/* Asa Direita Inferior */}
      <path
        d="M17 13C20 15 25 17 26 20C27 23 23 24 20 22C18 21 17 17 17 13Z"
        fill="#7DD3FC"
        stroke="#0B132B"
        strokeWidth="0.8"
      />
      {/* Detalhes brancos */}
      <circle cx="2" cy="4" r="0.6" fill="#FFF" />
      <circle cx="30" cy="4" r="0.6" fill="#FFF" />
      {/* Corpo e Antenas */}
      <ellipse cx="16" cy="12" rx="1" ry="5" fill="#0B132B" />
      <path d="M15.5 8C14.5 6 13 5 12 5" stroke="#0B132B" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M16.5 8C17.5 6 19 5 20 5" stroke="#0B132B" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Empilha nomes compostos longos em 2 ou 3 linhas centralizadas com entrelinha compacta
 * para garantir que bandas grandes (ex: "RED HOT CHILI PEPPERS", "QUEENS OF THE STONE AGE",
 * "SOPHIA CHABLAU E UMA ENORME PERDA DE TEMPO") apareçam 100% íntegras sem truncar (Zero-Truncate Rule).
 * Nomes que cabem no limite de caracteres da linha permanecem em 1 única linha, como no pôster original!
 */
function stackFlogGnawName(name: string, maxSingleChars = 15): string[] {
  const clean = name.trim().toUpperCase();
  if (clean.length <= maxSingleChars) {
    return [clean];
  }
  if (!clean.includes(" ")) {
    if (clean.length > 14) {
      const mid = Math.ceil(clean.length / 2);
      return [`${clean.slice(0, mid)}-`, clean.slice(mid)];
    }
    return [clean];
  }
  const words = clean.split(/\s+/);

  // Se o nome for longo (> 24 caracteres e >= 4 palavras), quebra em 3 linhas
  if (clean.length > 24 && words.length >= 4) {
    const t1 = Math.round(words.length / 3);
    const t2 = Math.round((words.length * 2) / 3);
    const p1 = words.slice(0, t1).join(" ");
    const p2 = words.slice(t1, t2).join(" ");
    const p3 = words.slice(t2).join(" ");
    if (p1 && p2 && p3) return [p1, p2, p3];
  }

  // Divisão equilibrada em 2 linhas
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

interface FlogGnawRows {
  row0: SpotifyArtist[]; // Linha 1 (5 artistas)
  row1: SpotifyArtist[]; // Linha 2 (4 artistas)
  row2: SpotifyArtist[]; // Linha 3 (4 artistas)
  row3: SpotifyArtist[]; // Linha 4 (3 artistas)
  row4: SpotifyArtist[]; // Linha 5 (2 artistas)
  row5: SpotifyArtist[]; // Linha 6 (2 artistas)
  headliner: SpotifyArtist; // Linha 7 (1 Headliner Supremo)
  row7: SpotifyArtist[]; // Linha 8 (4 artistas)
  row8: SpotifyArtist[]; // Linha 9 (2 artistas)
  row9: SpotifyArtist[]; // Linha 10 (4 artistas)
  row10: SpotifyArtist[]; // Linha 11 (5 artistas)
  row11: SpotifyArtist[]; // Linha 12 (5 artistas)
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
 * Organiza exatamente 41 artistas nas 12 fileiras do diamante de Camp Flog Gnaw Carnival:
 * 5 + 4 + 4 + 3 + 2 + 2 + 1 + 4 + 2 + 4 + 5 + 5 = 41 artistas
 */
function buildFlogGnawRows(allArtists: SpotifyArtist[]): FlogGnawRows {
  const pool = allArtists.length > 0 ? allArtists : MOCK_ARTISTS.slice(0, 41);
  return {
    headliner: pool[0] || MOCK_ARTISTS[0],
    row5: getSafeSlice(pool, 1, 2),
    row4: getSafeSlice(pool, 3, 2),
    row3: getSafeSlice(pool, 5, 3),
    row8: getSafeSlice(pool, 8, 2),
    row7: getSafeSlice(pool, 10, 4),
    row2: getSafeSlice(pool, 14, 4),
    row9: getSafeSlice(pool, 18, 4),
    row1: getSafeSlice(pool, 22, 4),
    row0: getSafeSlice(pool, 26, 5),
    row10: getSafeSlice(pool, 31, 5),
    row11: getSafeSlice(pool, 36, 5),
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

  const rows = buildFlogGnawRows(allArtists);

  const rawTitle = (lineup.title || "CAMP FLOG GNAW").trim().toUpperCase();
  const presenter = `${rows.headliner?.name?.toUpperCase() || "FESTIQ"} PRESENTS`;

  return (
    <div
      className="w-full h-full text-white flex flex-col justify-between relative overflow-hidden select-none font-display"
      style={{
        background:
          "linear-gradient(180deg, #FFAEC8 0%, #FFA490 18%, #FF8F5C 36%, #FF7433 54%, #FF5018 74%, #EA2A00 100%)",
        containerType: "inline-size",
      }}
    >
      {/* 1. LUA CHEIA REALISTA SUAVE NO CANTO SUPERIOR DIREITO + NUVENS ETÉREAS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 360 640"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="flog-moon-grad" cx="42%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FED7E2" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#F8A7B9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFAEC8" stopOpacity="0" />
          </radialGradient>
          <filter id="flog-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Lua Cheia Brilhante */}
        <circle
          cx={isSquare ? "440" : "312"}
          cy={isSquare ? "68" : "62"}
          r={isSquare ? "52" : "46"}
          fill="url(#flog-moon-grad)"
          filter="url(#flog-glow)"
        />

        {/* Nuvens suaves e etéreas */}
        <ellipse cx="60" cy="110" rx="90" ry="18" fill="#FFC8D6" fillOpacity="0.3" filter="blur(6px)" />
        <ellipse cx="305" cy="230" rx="100" ry="20" fill="#FFA585" fillOpacity="0.25" filter="blur(8px)" />
        <ellipse cx="45" cy="380" rx="110" ry="22" fill="#FF784A" fillOpacity="0.2" filter="blur(10px)" />
      </svg>

      {/* 2. BORBOLETAS DE CENÁRIO (LOCALIZADAS APENAS NO CÉU SUPERIOR E NA PAISAGEM INFERIOR LIVRE) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Borboleta Monarca sob a Lua (Canto Superior Direito) */}
        <div
          className="absolute"
          style={{
            top: isSquare ? "9%" : "8%",
            right: isSquare ? "6%" : "5%",
            transform: "rotate(16deg)",
          }}
        >
          <MonarchButterfly className="w-5 h-4 opacity-95" />
        </div>

        {/* Borboleta Monarca no Céu Aberto da Paisagem Inferior Direita */}
        <div
          className="absolute"
          style={{
            bottom: isSquare ? "11%" : "12%",
            right: "8%",
            transform: "rotate(-18deg)",
          }}
        >
          <MonarchButterfly className="w-7 h-5.5 opacity-90" />
        </div>

        {/* Borboleta Morpho no Céu Aberto da Paisagem Inferior Esquerda */}
        <div
          className="absolute"
          style={{
            bottom: isSquare ? "8%" : "9%",
            left: "6%",
            transform: "rotate(22deg)",
          }}
        >
          <MorphoButterfly className="w-6 h-5 opacity-90" />
        </div>
      </div>

      {/* 3. CABEÇALHO CARNIVAL: "PRESENTER..." + LOGO 3D BUBBLE AZUL-CLARO + TICKETS E CARNIVAL */}
      <div
        className={`relative z-10 w-full flex flex-col items-center text-center ${
          isSquare ? "pt-2 pb-0.5 px-4" : "pt-3 pb-1 px-3"
        }`}
      >
        {/* Presenter tag vintage */}
        <p
          className="font-sans font-black uppercase text-[#141414] leading-none mb-0.5 tracking-wider"
          style={{
            fontSize: isSquare ? "8.5px" : "7.8px",
            letterSpacing: "0.08em",
          }}
        >
          {presenter}
        </p>

        {/* Logotipo 3D Bubble Azul-Celeste e Branco com Borda Grossa */}
        <h1
          className="font-display font-black uppercase tracking-[0.02em] leading-[0.88] select-none text-center"
          style={{
            fontSize: isSquare ? "clamp(26px, 5.6cqw, 36px)" : "clamp(24px, 6.6cqw, 32px)",
            WebkitTextStroke: "1.4px #000000",
            paintOrder: "stroke fill",
            color: "#E2F6FE",
            textShadow:
              "1.5px 1.5px 0 #000, 2.5px 2.5px 0 #000, 3.5px 3.5px 0 #000, 4.5px 4.5px 0 #000",
          }}
        >
          {rawTitle}
        </h1>

        {/* Bloco CARNIVAL + Tickets Laterais */}
        <div className="flex items-center justify-center gap-1.5 mt-1 w-full max-w-[94%]">
          {/* Ticket 3D Esquerdo */}
          <div className="px-2 py-[2px] bg-[#C2F1FD] border-[1.5px] border-[#0E0E0E] rounded-[4px] shadow-[2px_2.5px_0px_#0E0E0E] leading-none -rotate-[2deg] flex-shrink-0">
            <span className="font-display font-black text-[#0E0E0E] uppercase text-[7.5px] tracking-wider">
              PALCO FESTIQ
            </span>
          </div>

          {/* Letreiro CARNIVAL Extrudado com Borboleta Monarca Pousada na Letra L */}
          <div className="inline-flex items-center relative leading-none px-1">
            <span
              className="font-display font-black uppercase tracking-[0.14em] pl-[0.14em] leading-none"
              style={{
                fontSize: isSquare ? "15.5px" : "14px",
                WebkitTextStroke: "1.2px #0E0E0E",
                paintOrder: "stroke fill",
                color: "#FFFFFF",
                textShadow: "1.5px 2px 0px #0E0E0E",
              }}
            >
              CARNIVAL
            </span>
            <MonarchButterfly className="w-3.5 h-3 -mt-2 -ml-0.5 inline-block rotate-[15deg]" />
          </div>

          {/* Ticket 3D Direito */}
          <div className="px-2 py-[2px] bg-[#C2F1FD] border-[1.5px] border-[#0E0E0E] rounded-[4px] shadow-[2px_2.5px_0px_#0E0E0E] leading-none rotate-[2deg] flex-shrink-0">
            <span className="font-display font-black text-[#0E0E0E] uppercase text-[7.5px] tracking-wider">
              {lineup.timeRange === "short_term"
                ? "4 SEMANAS"
                : lineup.timeRange === "long_term"
                ? "HISTÓRICO"
                : "NOV 22-23"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. CORPO DO LINEUP COM EXATAMENTE 41 ARTISTAS EM 12 FILEIRAS SIMÉTRICAS (FORMATO DIAMANTE) */}
      <div
        className={`relative z-10 flex-1 w-full flex flex-col justify-between items-center text-center overflow-hidden ${
          isSquare ? "px-4 py-0.5" : "px-2.5 py-1"
        }`}
      >
        {/* LINHA 1: 5 ARTISTAS (Undercard Superior) */}
        <div
          className="w-full flex items-center justify-center gap-x-1 leading-none"
          style={{
            fontSize: isSquare ? "clamp(9.8px, 2.2cqw, 12.2px)" : "clamp(8.5px, 2.3cqw, 10.8px)",
          }}
        >
          {rows.row0.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 15 : 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.45px #0E0E0E",
                        textShadow: "1.2px 1.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row0.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 2: 4 ARTISTAS (Undercard Superior) */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 leading-none"
          style={{
            fontSize: isSquare ? "clamp(10.8px, 2.4cqw, 13.2px)" : "clamp(9.5px, 2.5cqw, 11.8px)",
          }}
        >
          {rows.row1.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 18 : 15);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.5px #0E0E0E",
                        textShadow: "1.2px 1.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row1.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 3: 4 ARTISTAS (com Borboletas Monarca Inline como no Original) */}
        <div
          className="w-full flex items-center justify-center gap-x-1 leading-none"
          style={{
            fontSize: isSquare ? "clamp(11.5px, 2.5cqw, 14.0px)" : "clamp(10.2px, 2.6cqw, 12.5px)",
          }}
        >
          {rows.row2.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 18 : 15);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.55px #0E0E0E",
                        textShadow: "1.5px 1.8px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {/* Separador customizado: ponto ou borboleta monarca inline */}
                {aIdx === 1 ? (
                  <MonarchButterfly className="w-3 h-2.5 inline-block mx-1 align-middle" />
                ) : aIdx < rows.row2.length - 1 ? (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                ) : null}
              </React.Fragment>
            );
          })}
          {/* Borboleta Monarca no final da Linha 3 */}
          <MonarchButterfly className="w-3 h-2.5 inline-block ml-1 align-middle rotate-[12deg]" />
        </div>

        {/* LINHA 4: 3 ARTISTAS (com Borboleta Morpho no Início como no Original) */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 leading-none"
          style={{
            fontSize: isSquare ? "clamp(12.8px, 2.9cqw, 15.8px)" : "clamp(11.5px, 3.0cqw, 14.5px)",
          }}
        >
          {/* Borboleta Morpho no Início da Linha 4 */}
          <MorphoButterfly className="w-3.5 h-3 inline-block mr-1 align-middle rotate-[-15deg]" />
          {rows.row3.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 22 : 18);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.6px #0E0E0E",
                        textShadow: "1.5px 2px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row3.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 5: 2 ARTISTAS (Co-Headliners Grandes com Borboletas Monarca) */}
        <div
          className="w-full flex items-center justify-center gap-x-2 leading-none"
          style={{
            fontSize: isSquare ? "clamp(15.0px, 3.4cqw, 19.0px)" : "clamp(13.5px, 3.5cqw, 17.5px)",
          }}
        >
          {/* Borboleta no início da Linha 5 */}
          <MonarchButterfly className="w-3.5 h-3 inline-block mr-1 align-middle rotate-[-10deg]" />
          {rows.row4.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 26 : 22);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.7px #0E0E0E",
                        textShadow: "1.5px 2px 0px #0E0E0E, 2px 2.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row4.length - 1 && (
                  <MonarchButterfly className="w-3.5 h-3 inline-block mx-1.5 align-middle rotate-[10deg]" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 6: 2 CO-HEADLINERS COLOSSAIS (Logo Acima do Headliner Central) */}
        <div
          className="w-full flex items-center justify-center gap-x-2 leading-none"
          style={{
            fontSize: isSquare ? "clamp(17.0px, 3.9cqw, 21.8px)" : "clamp(15.5px, 4.0cqw, 20.0px)",
          }}
        >
          {rows.row5.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 26 : 22);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wider"
                      style={{
                        WebkitTextStroke: "0.85px #0E0E0E",
                        textShadow: "1.8px 2.2px 0px #0E0E0E, 2.5px 3px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row5.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-1 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 7: O CENTRO GRAVITACIONAL · HEADLINER SUPREMO #1 COM BORBOLETA AZUL MORPHO */}
        <div className="w-full flex items-center justify-center leading-none my-0.5">
          {rows.headliner && (
            <div className="inline-flex items-center justify-center text-center leading-none">
              <div className="inline-flex flex-col items-center justify-center leading-none">
                {stackFlogGnawName(rows.headliner.name, isSquare ? 28 : 24).map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className="font-display font-black uppercase text-white whitespace-nowrap tracking-wider"
                    style={{
                      fontSize: isSquare
                        ? "clamp(22.0px, 5.0cqw, 28.5px)"
                        : "clamp(20.0px, 5.2cqw, 26.5px)",
                      WebkitTextStroke: "1.1px #0E0E0E",
                      paintOrder: "stroke fill",
                      textShadow:
                        "1.8px 2.2px 0 #0E0E0E, 2.8px 3.2px 0 #0E0E0E, 3.8px 4.2px 0 #0E0E0E",
                      lineHeight: "0.92",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>
              <MorphoButterfly className="w-4.5 h-4 inline-block ml-1.5 align-middle rotate-[15deg]" />
            </div>
          )}
        </div>

        {/* LINHA 8: 4 CO-HEADLINERS MÉDIOS */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 leading-none"
          style={{
            fontSize: isSquare ? "clamp(12.2px, 2.7cqw, 15.2px)" : "clamp(11.0px, 2.8cqw, 14.0px)",
          }}
        >
          {rows.row7.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 18 : 15);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.6px #0E0E0E",
                        textShadow: "1.5px 2px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row7.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 9: 2 GRANDES DUOS / COLABORAÇÕES */}
        <div
          className="w-full flex items-center justify-center gap-x-2 leading-none"
          style={{
            fontSize: isSquare ? "clamp(15.2px, 3.5cqw, 19.5px)" : "clamp(13.8px, 3.6cqw, 17.8px)",
          }}
        >
          {rows.row8.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 26 : 22);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.75px #0E0E0E",
                        textShadow: "1.5px 2px 0px #0E0E0E, 2.2px 2.8px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row8.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-1 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 10: 4 ARTISTAS (Undercard Médio) */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 leading-none"
          style={{
            fontSize: isSquare ? "clamp(11.8px, 2.5cqw, 14.5px)" : "clamp(10.5px, 2.6cqw, 13.2px)",
          }}
        >
          {rows.row9.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 18 : 15);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.55px #0E0E0E",
                        textShadow: "1.2px 1.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row9.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 11: 5 ARTISTAS (Undercard Inferior) */}
        <div
          className="w-full flex items-center justify-center gap-x-1 leading-none"
          style={{
            fontSize: isSquare ? "clamp(10.2px, 2.2cqw, 12.6px)" : "clamp(9.0px, 2.3cqw, 11.2px)",
          }}
        >
          {rows.row10.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 15 : 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.45px #0E0E0E",
                        textShadow: "1.2px 1.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row10.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 12: 5 ARTISTAS (Undercard Base Final) */}
        <div
          className="w-full flex items-center justify-center gap-x-1 leading-none"
          style={{
            fontSize: isSquare ? "clamp(9.8px, 2.1cqw, 12.0px)" : "clamp(8.5px, 2.2cqw, 10.8px)",
          }}
        >
          {rows.row11.map((artist, aIdx) => {
            const lines = stackFlogGnawName(artist.name, isSquare ? 15 : 12);
            return (
              <React.Fragment key={artist.id}>
                <div className="inline-flex flex-col items-center justify-center text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="font-display font-black uppercase text-white whitespace-nowrap tracking-wide"
                      style={{
                        WebkitTextStroke: "0.45px #0E0E0E",
                        textShadow: "1.2px 1.5px 0px #0E0E0E",
                        lineHeight: lines.length > 1 ? "0.88" : "1.0",
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {aIdx < rows.row11.length - 1 && (
                  <span className="text-[#FF5722] font-black leading-none mx-0.5 select-none drop-shadow-[1px_1px_0_#0E0E0E]">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 5. ILUSTRAÇÃO INFERIOR DO CAMP FLOG GNAW: SILHUETA CARMIM DE PRÉDIOS E PINHEIROS + RODA-GIGANTE CIANO */}
      <div className="relative z-10 w-full mt-auto">
        <svg
          viewBox="0 0 360 88"
          className={`w-full block pointer-events-none select-none ${
            isSquare ? "h-[54px]" : "h-[62px]"
          }`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Silhueta de prédios da cidade ao fundo em vermelho carmim */}
          <path
            d="M 120 45 L 120 30 L 132 30 L 132 25 L 142 25 L 142 35 L 152 35 L 152 20 L 165 20 L 165 38 L 195 38 L 195 18 L 210 18 L 210 32 L 225 32 L 225 45 Z"
            fill="#7B1A1A"
            fillOpacity="0.5"
          />

          {/* RODA-GIGANTE CENTRAL ILUMINADA EM CIANO */}
          <g transform="translate(180, 42)">
            {/* Suporte em A da roda-gigante */}
            <line x1="0" y1="0" x2="-14" y2="38" stroke="#0D6B82" strokeWidth="2" />
            <line x1="0" y1="0" x2="14" y2="38" stroke="#0D6B82" strokeWidth="2" />
            <line x1="-9" y1="24" x2="9" y2="24" stroke="#0D6B82" strokeWidth="1.5" />

            {/* Aros da Roda-Gigante */}
            <circle cx="0" cy="0" r="28" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.9" />
            <circle cx="0" cy="0" r="22" stroke="#38BDF8" strokeWidth="1" fill="none" opacity="0.65" />
            <circle cx="0" cy="0" r="14" stroke="#38BDF8" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="0" cy="0" r="4" fill="#38BDF8" />

            {/* Raios da roda */}
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#38BDF8" strokeWidth="1" opacity="0.75" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#38BDF8" strokeWidth="1" opacity="0.75" />
            <line x1="-20" y1="-20" x2="20" y2="20" stroke="#38BDF8" strokeWidth="1" opacity="0.75" />
            <line x1="-20" y1="20" x2="20" y2="-20" stroke="#38BDF8" strokeWidth="1" opacity="0.75" />

            {/* Cabines amarelas */}
            <circle cx="-28" cy="0" r="2.2" fill="#FDE047" />
            <circle cx="28" cy="0" r="2.2" fill="#FDE047" />
            <circle cx="0" cy="-28" r="2.2" fill="#FDE047" />
            <circle cx="0" cy="28" r="2.2" fill="#FDE047" />
            <circle cx="-20" cy="-20" r="2.2" fill="#FDE047" />
            <circle cx="20" cy="20" r="2.2" fill="#FDE047" />
            <circle cx="-20" cy="20" r="2.2" fill="#FDE047" />
            <circle cx="20" cy="-20" r="2.2" fill="#FDE047" />
          </g>

          {/* Tenda de Circo / Carnaval à Esquerda da Roda */}
          <polygon points="144,48 156,36 168,48" fill="#EF4444" stroke="#0E0E0E" strokeWidth="1" />
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
            fill="#143D1F"
          />
        </svg>

        {/* Rodapé Oficial Festiq Carnival */}
        <div className="w-full bg-[#143D1F] pb-1.5 pt-0.5 px-4 flex items-center justify-between text-[7.5px] font-mono text-white/90 uppercase tracking-widest">
          <span className="font-bold text-[#86EFAC]">FESTIQ CARNIVAL</span>
          <span className="font-black text-white">LINEUP OFICIAL</span>
          <span className="font-bold text-[#FDE047]">{allArtists.length} ARTISTAS</span>
        </div>
      </div>
    </div>
  );
};
