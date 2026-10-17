import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Quebra nomes compostos em 2 linhas compactas para as 2 primeiras fileiras de Headliners
 * do Planeta Atlântida (ex: "VINTAGE / CULTURE", "RED HOT / CHILI PEPPERS").
 */
function stackPlanetaHeadliner(name: string): string[] {
  const clean = name.trim();
  if (clean.length <= 10 || !clean.includes(" ")) {
    return [clean];
  }
  const words = clean.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
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

  // Estrutura fiel ao pôster real do Planeta Atlântida:
  // Linha 1: 3 Headliners principais separados por raios (⚡)
  const row1Headliners = allArtists.slice(0, 3);
  // Linha 2: 4 Co-Headliners em destaque
  const row2CoHeadliners = allArtists.slice(3, 7);
  // Linha 3: 3 Sub-Headliners médios
  const row3SubA = allArtists.slice(7, 10);
  // Linha 4: 3 Sub-Headliners médios
  const row4SubB = allArtists.slice(10, 13);
  // Demais 32 artistas distribuídos em linhas centralizadas de 3 a 4 artistas
  const remainingUndercard = allArtists.slice(13);

  const undercardRows: (typeof remainingUndercard)[] = [];
  const perRow = isSquare ? 4 : 4;
  for (let i = 0; i < remainingUndercard.length; i += perRow) {
    undercardRows.push(remainingUndercard.slice(i, i + perRow));
  }

  const dotColors = ["text-[#00B8D4]", "text-[#FF5722]", "text-[#00C853]"];

  return (
    <div
      className="w-full h-full text-[#141414] flex flex-col justify-between relative overflow-hidden select-none font-sans"
      style={{
        background:
          "linear-gradient(180deg, #F5A3B7 0%, #F6B0B2 38%, #F9CA92 68%, #FCE373 100%)",
      }}
    >
      {/* 1. Moldura Ilustrada Pop-Art Tropical (Coqueiros, Raios, Globos, Lábios e Ondas do Mar) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Raios de Sol Amarelos Irradiando Atrás do Globo Central */}
        <g fill="#FFE600" stroke="#141414" strokeWidth="1.5">
          <polygon points="300,115 95,45 125,85 75,95 145,128 85,155 165,165 110,210 235,175" />
          <polygon points="300,115 505,45 475,85 525,95 455,128 515,155 435,165 490,210 365,175" />
        </g>

        {/* Coqueiros e Folhagens Tropicais — Canto Superior Esquerdo */}
        <g stroke="#141414" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M-10 95 Q 65 85 115 145 Q 55 125 -10 135 Z" fill="#FFE600" />
          <path d="M15 -10 Q 95 25 145 105 Q 75 65 15 35 Z" fill="#00E5FF" />
          <path d="M85 -10 Q 155 15 195 95 Q 135 35 125 -10 Z" fill="#00E5FF" />
          <path d="M-10 35 Q 55 45 95 115 Q 35 85 -10 75 Z" fill="#FF4081" />
          <circle cx="28" cy="48" r="22" fill="#FFFFFF" />
          <circle cx="28" cy="48" r="7" fill="#FFE600" />
        </g>

        {/* Coqueiros e Folhagens Tropicais — Canto Superior Direito */}
        <g stroke="#141414" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M610 95 Q 535 85 485 145 Q 545 125 610 135 Z" fill="#FFE600" />
          <path d="M585 -10 Q 505 25 455 105 Q 525 65 585 35 Z" fill="#00E5FF" />
          <path d="M515 -10 Q 445 15 405 95 Q 465 35 475 -10 Z" fill="#00E5FF" />
          <path d="M610 35 Q 545 45 505 115 Q 565 85 610 75 Z" fill="#FF4081" />
          <circle cx="572" cy="48" r="22" fill="#FFFFFF" />
          <circle cx="572" cy="48" r="7" fill="#FFE600" />
        </g>

        {/* Globos Terrestres Turquesa nas Laterais Superiores */}
        <g stroke="#141414" strokeWidth="2.5">
          <circle cx="22" cy="235" r="64" fill="#26C6DA" />
          <path
            d="M-15 195 Q 15 205 35 185 Q 55 215 28 245 Q 5 265 -10 280 Z"
            fill="#66BB6A"
          />
          <circle cx="578" cy="235" r="64" fill="#26C6DA" />
          <path
            d="M615 195 Q 585 205 565 185 Q 545 215 572 245 Q 595 265 610 280 Z"
            fill="#66BB6A"
          />
        </g>

        {/* Raios Pop-Art Laterais (Meio-Superior) */}
        <g stroke="#141414" strokeWidth="2.5" strokeLinejoin="round">
          <polygon
            points="-5,310 75,275 45,335 85,325 15,410 32,350 -5,360"
            fill="#FF5722"
          />
          <polygon
            points="-5,420 55,390 28,445 62,440 5,515 18,460 -5,468"
            fill="#FFE600"
          />
          <polygon
            points="605,310 525,275 555,335 515,325 585,410 568,350 605,360"
            fill="#FF5722"
          />
          <polygon
            points="605,420 545,390 572,445 538,440 595,515 582,460 605,468"
            fill="#FFE600"
          />
        </g>

        {/* Bocas / Lábios Pop-Art nas Laterais Médias */}
        <g stroke="#141414" strokeWidth="2.5">
          {/* Esquerda */}
          <path
            d="M-10 555 C 25 535, 65 565, 68 615 C 65 665, 25 685, -10 670 Z"
            fill="#FF3D00"
          />
          <path
            d="M-5 575 C 22 565, 48 585, 50 615 C 48 645, 22 660, -5 650 Z"
            fill="#141414"
          />
          <path d="M-5 575 Q 20 572 38 586 L -5 588 Z" fill="#FFFFFF" />
          <path d="M-5 630 Q 25 615 44 636 Q 22 655 -5 648 Z" fill="#FF7043" />

          {/* Direita */}
          <path
            d="M610 555 C 575 535, 535 565, 532 615 C 535 665, 575 685, 610 670 Z"
            fill="#FF3D00"
          />
          <path
            d="M605 575 C 578 565, 552 585, 550 615 C 552 645, 578 660, 605 650 Z"
            fill="#141414"
          />
          <path d="M605 575 Q 580 572 562 586 L 605 588 Z" fill="#FFFFFF" />
          <path d="M605 630 Q 575 615 556 636 Q 578 655 605 648 Z" fill="#FF7043" />
        </g>

        {/* Ondas do Mar com Espuma Branca nos Cantos Inferiores */}
        <g stroke="#141414" strokeWidth="2.5" strokeLinejoin="round">
          {/* Onda Inferior Esquerda */}
          <path
            d="M-10 735 Q 65 730 118 795 Q 135 825 115 855 L 85 835 Q 65 865 45 905 L -10 905 Z"
            fill="#26C6DA"
          />
          <path
            d="M-10 725 Q 72 720 128 795 Q 142 825 122 860 Q 105 840 92 820 Q 65 765 -10 755 Z"
            fill="#FFFFFF"
          />
          {/* Onda Inferior Direita */}
          <path
            d="M610 735 Q 535 730 482 795 Q 465 825 485 855 L 515 835 Q 535 865 555 905 L 610 905 Z"
            fill="#26C6DA"
          />
          <path
            d="M610 725 Q 528 720 472 795 Q 458 825 478 860 Q 495 840 508 820 Q 535 765 610 755 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>

      {/* 2. Topo Central: Globo 3D do Planeta + Data na Saba em Atlântida */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-12 ${
          isSquare ? "pt-2 pb-0.5" : "pt-3 pb-1"
        }`}
      >
        {/* Emblema SVG do Globo 3D com o "a" Orbital */}
        <svg
          viewBox="0 0 220 135"
          className={isSquare ? "w-28 sm:w-32 h-auto" : "w-36 sm:w-40 h-auto"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="planeta-globe" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#29B6F6" />
              <stop offset="55%" stopColor="#0277BD" />
              <stop offset="100%" stopColor="#002F56" />
            </radialGradient>
            <path
              id="planeta-arc-text"
              d="M 48 92 A 62 62 0 1 1 172 92"
            />
          </defs>

          {/* Globo Azul */}
          <circle
            cx="110"
            cy="76"
            r="50"
            fill="url(#planeta-globe)"
            stroke="#012A4A"
            strokeWidth="2"
          />

          {/* Texto Arqueado ao Redor do Globo */}
          <text
            fill="#FFFFFF"
            fontSize="11.5"
            fontWeight="900"
            letterSpacing="1.2"
          >
            <textPath href="#planeta-arc-text" startOffset="50%" textAnchor="middle">
              {lineup.title.slice(0, 22)}
            </textPath>
          </text>

          {/* Anel Orbital Vermelho-Laranja */}
          <path
            d="M 48 96 C 42 78, 82 58, 132 52 C 168 48, 178 62, 162 76"
            stroke="#E64A19"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />

          {/* Letra "a" 3D Dourada Central Fiel ao Logo do Planeta */}
          <g transform="translate(76, 36)">
            {/* Sombra 3D Laranja Escura */}
            <path
              d="M48 26 C48 10, 12 10, 10 24 L24 26 C25 20, 35 20, 35 26 L35 30 L20 32 C6 34, 4 50, 18 54 C26 56, 33 52, 36 48 L36 54 L50 54 L50 26 Z M35 38 C35 44, 22 46, 20 40 C19 36, 28 35, 35 35 Z"
              fill="#BF360C"
              transform="translate(-3, 4)"
            />
            {/* Face Frontal Amarelo-Ouro */}
            <path
              d="M48 26 C48 10, 12 10, 10 24 L24 26 C25 20, 35 20, 35 26 L35 30 L20 32 C6 34, 4 50, 18 54 C26 56, 33 52, 36 48 L36 54 L50 54 L50 26 Z M35 38 C35 44, 22 46, 20 40 C19 36, 28 35, 35 35 Z"
              fill="#FFB300"
              stroke="#E65100"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Subtítulo de Data e Local em Branco Bold (como "3 E 4 DE FEVEREIRO / NA SABA, EM ATLÂNTIDA") */}
        <div className="leading-none -mt-1">
          <p className="font-sans font-black text-[9px] sm:text-[10.5px] uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
            3 E 4 DE FEVEREIRO
          </p>
          <p className="font-sans font-black text-[8px] sm:text-[9.5px] uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
            NA SABA, EM ATLÂNTIDA · {lineup.subtitle.split("·")[0].trim()}
          </p>
        </div>
      </div>

      {/* 3. Bloco Central Único de Lineup (100% dos 45 Artistas em Preto Forte Sobre o Gradiente Solar) */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-evenly items-center text-center px-10 sm:px-14 overflow-hidden ${
          isSquare ? "py-0.5 gap-0.5" : "py-1.5 gap-1"
        }`}
      >
        {/* LINHA 1: 3 Headliners Principais Lado a Lado Separados por Raios (⚡) */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-3">
          {row1Headliners.map((artist, idx) => {
            const lines = stackPlanetaHeadliner(artist.name);
            const isShort = artist.name.length <= 7;
            return (
              <React.Fragment key={artist.id}>
                <div className="text-center leading-none">
                  {lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className={`block font-sans font-black uppercase text-[#141414] ${
                        isSquare
                          ? isShort
                            ? "text-sm sm:text-base tracking-wide"
                            : "text-[11px] sm:text-xs tracking-tight"
                          : isShort
                          ? "text-base sm:text-lg tracking-wide"
                          : "text-xs sm:text-sm tracking-tight"
                      }`}
                      style={{ lineHeight: "0.94" }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                {idx < row1Headliners.length - 1 && (
                  <svg
                    viewBox="0 0 16 24"
                    className={`${isSquare ? "w-2.5 h-3.5" : "w-3 h-4"} flex-shrink-0`}
                    fill={idx === 0 ? "#FF5722" : "#00B8D4"}
                  >
                    <polygon points="10,0 0,14 7,14 4,24 16,9 9,9" />
                  </svg>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* LINHA 2: 4 Co-Headliners Lado a Lado Separados por Pontos Coloridos */}
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap">
          {row2CoHeadliners.map((artist, idx) => {
            const isShort = artist.name.length <= 6;
            return (
              <React.Fragment key={artist.id}>
                <span
                  className={`font-sans font-black uppercase text-[#141414] ${
                    isSquare
                      ? isShort
                        ? "text-xs sm:text-[13px] tracking-wider"
                        : "text-[9.5px] sm:text-[11px] tracking-tight"
                      : isShort
                      ? "text-sm sm:text-[15px] tracking-wider"
                      : "text-[11px] sm:text-xs tracking-tight"
                  }`}
                  style={{ lineHeight: "0.98" }}
                >
                  {artist.name}
                </span>
                {idx < row2CoHeadliners.length - 1 && (
                  <span
                    className={`font-black text-[10px] leading-none ${
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

        {/* LINHAS 3 e 4: Sub-Headliners Médios (Ex: JÃO • DILSINHO • GLORIA GROOVE) */}
        {[row3SubA, row4SubB].map((subRow, sIdx) => (
          <div
            key={sIdx}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap leading-none"
          >
            {subRow.map((artist, idx) => {
              const isShort = artist.name.length <= 6;
              return (
                <React.Fragment key={artist.id}>
                  <span
                    className={`font-sans font-extrabold uppercase text-[#141414] ${
                      isSquare
                        ? isShort
                          ? "text-[10px] sm:text-[11px] tracking-wider"
                          : "text-[9px] sm:text-[10px] tracking-tight"
                        : isShort
                        ? "text-xs sm:text-[13px] tracking-wider"
                        : "text-[10px] sm:text-[11.5px] tracking-tight"
                    }`}
                  >
                    {artist.name}
                  </span>
                  {idx < subRow.length - 1 && (
                    <span
                      className={`font-black text-[9px] leading-none ${
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

        {/* LINHAS 5 A 12: Undercard Completo (Todos os 32 artistas restantes até 45) */}
        <div className={`w-full ${isSquare ? "space-y-0.5 pt-0.5" : "space-y-1 pt-0.5"}`}>
          {undercardRows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="w-full flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0 leading-none"
            >
              {row.map((artist, aIdx) => {
                const isShort = artist.name.length <= 6;
                return (
                  <React.Fragment key={artist.id}>
                    <span
                      className={`font-sans font-extrabold uppercase text-[#141414] ${
                        isSquare
                          ? isShort
                            ? "text-[8px] sm:text-[9px] tracking-wider"
                            : "text-[7.2px] sm:text-[8px] tracking-tight"
                          : isShort
                          ? "text-[9px] sm:text-[10px] tracking-wider"
                          : "text-[8px] sm:text-[9px] tracking-tight"
                      }`}
                      style={{ lineHeight: "1.06" }}
                    >
                      {artist.name}
                    </span>
                    {aIdx < row.length - 1 && (
                      <span
                        className={`font-black text-[7px] sm:text-[8px] leading-none ${
                          dotColors[(rIdx + aIdx) % dotColors.length]
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
        </div>
      </div>

      {/* 4. Rodapé Oficial Planeta Atlântida: Slogan + Pílula Coral-Laranja */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-8 ${
          isSquare ? "pb-2 pt-0.5" : "pb-3 pt-1"
        }`}
      >
        {/* Linha Divisória Ciano */}
        <div className="w-36 h-[2px] bg-[#00B8D4] mb-1" />

        <p
          className={`font-sans font-black uppercase tracking-wider text-[#141414] leading-none ${
            isSquare ? "text-[9.5px] sm:text-[11px]" : "text-[11px] sm:text-xs"
          }`}
        >
          O PLANETA VOLTA A GIRAR
        </p>
        <p className="font-sans font-bold text-[6.5px] sm:text-[7.5px] uppercase tracking-widest text-[#141414]/80 mt-0.5">
          PLANETAFESTIQ.COM.BR
        </p>

        {/* Pílula Coral de Assinatura (como a barra vermelha inferior do cartaz oficial) */}
        <div
          className={`mt-1 px-5 rounded-full bg-[#F4511E] text-white flex items-center justify-center gap-3 font-sans font-black uppercase tracking-wider shadow-sm ${
            isSquare
              ? "py-1 text-[7px] sm:text-[8px]"
              : "py-1.5 text-[8px] sm:text-[9px]"
          }`}
        >
          <span className="px-1.5 py-0.5 bg-[#D50000] rounded text-white">
            FESTIQ
          </span>
          <span>SPOTIFY API</span>
          <span>•</span>
          <span>{isSquare ? "1080×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
