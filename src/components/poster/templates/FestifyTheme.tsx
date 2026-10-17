import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const FestifyTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  // Garante que TODOS os 45 artistas estejam presentes
  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Estrutura em pirâmide fiel ao Festify (Forestfest)
  const mainHeadliner = allArtists[0];
  const row2CoHeadliners = allArtists.slice(1, 3); // 2 artistas grandes
  const row3SubHeadliners = allArtists.slice(3, 6); // 3 artistas médios-grandes
  const row4MidTier = allArtists.slice(6, 18); // 12 artistas intermediários (2 linhas de 6)
  const remainingUndercard = allArtists.slice(18); // Demais ~27 artistas para completar 100% (45)

  // Divide row4MidTier em linhas de 6 (no quadrado) ou 4 (no vertical)
  const midCols = isSquare ? 6 : 4;
  const midRows: (typeof row4MidTier)[] = [];
  for (let i = 0; i < row4MidTier.length; i += midCols) {
    midRows.push(row4MidTier.slice(i, i + midCols));
  }

  // Divide remainingUndercard em linhas densas e organizadas
  const underCols = isSquare ? 7 : 5;
  const underRows: (typeof remainingUndercard)[] = [];
  for (let i = 0; i < remainingUndercard.length; i += underCols) {
    underRows.push(remainingUndercard.slice(i, i + underCols));
  }

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
          height: isSquare ? "27%" : "24%",
          background:
            "linear-gradient(180deg, #FDE05D 0%, #FEE882 48%, #FFF7CC 78%, #FFFFFF 100%)",
        }}
      />

      {/* Detalhes Celestes Laterais (Lua Crescente e Estrelas Amarelas em SVG) */}
      <svg
        className="absolute inset-x-0 pointer-events-none z-10"
        style={{ top: isSquare ? "21%" : "18%", height: "90px" }}
        viewBox="0 0 600 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lua crescente à esquerda */}
        <path
          d="M44 18C36.5 18 30.5 24 30.5 31.5C30.5 39 36.5 45 44 45C46.5 45 48.8 44.3 50.8 43.1C48.3 44.1 45.5 44.3 42.8 43.3C36.8 41.1 33.7 34.4 35.9 28.4C37.5 24 41.3 20.9 45.8 20.3C45.2 18.9 44.6 18 44 18Z"
          fill="#FDE05D"
        />
        <circle cx="168" cy="10" r="2.2" fill="#FDE05D" />
        <circle cx="24" cy="74" r="3" fill="#FDE05D" />

        {/* Estrelas e pontos à direita */}
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
          isSquare ? "pt-6 pb-1" : "pt-8 pb-2"
        }`}
      >
        <p className="font-sans font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.08em] text-[#2B6EF2] leading-tight">
          {presenterLabel}
        </p>
        <h1
          className={`font-sans font-black uppercase tracking-[0.03em] text-[#2B6EF2] leading-none mt-0.5 ${
            isSquare ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {lineup.title}
        </h1>
      </div>

      {/* 3. Pirâmide de Artistas (100% dos 45 Artistas Visíveis no Centro Branco) */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 ${
          isSquare ? "gap-1 py-0.5" : "gap-2 py-2"
        }`}
      >
        {/* Nível 1: Headliner Supremo (Ex: LANA DEL REY) */}
        {mainHeadliner && (
          <div className="text-center w-full">
            <span
              className={`block font-sans font-bold uppercase tracking-[0.06em] text-[#0D0D0D] leading-none ${
                isSquare ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              }`}
            >
              {mainHeadliner.name}
            </span>
          </div>
        )}

        {/* Nível 2: 2 Co-Headliners (Ex: ROBYN / SOFI TUKKER) */}
        <div className="w-full max-w-[90%] flex items-center justify-around gap-4 text-center">
          {row2CoHeadliners.map((artist) => (
            <span
              key={artist.id}
              className={`font-sans font-bold uppercase tracking-[0.05em] text-[#0D0D0D] leading-tight ${
                isSquare ? "text-sm sm:text-base" : "text-base sm:text-lg"
              }`}
            >
              {artist.name}
            </span>
          ))}
        </div>

        {/* Nível 3: 3 Sub-Headliners (Ex: THE INTERNET / 6IX9INE / DRAM) */}
        <div className="w-full max-w-[95%] flex items-center justify-between gap-2 text-center px-2">
          {row3SubHeadliners.map((artist) => (
            <span
              key={artist.id}
              className={`font-sans font-semibold uppercase tracking-[0.04em] text-[#0D0D0D] leading-tight ${
                isSquare ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
              }`}
            >
              {artist.name}
            </span>
          ))}
        </div>

        {/* Nível 4: Artistas Intermediários em Colunas Alinhadas */}
        <div className={`w-full ${isSquare ? "space-y-0.5 mt-0.5" : "space-y-1.5 mt-1"}`}>
          {midRows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="w-full flex items-center justify-between gap-1.5 text-center"
            >
              {row.map((artist) => (
                <span
                  key={artist.id}
                  className={`flex-1 font-sans font-semibold uppercase tracking-[0.03em] text-[#0D0D0D] leading-[1.05] ${
                    isSquare ? "text-[7.5px] sm:text-[8.5px]" : "text-[8.5px] sm:text-[9.5px]"
                  }`}
                >
                  {artist.name}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Nível 5: Undercard Completo (Todos os artistas restantes até 45) */}
        <div className={`w-full ${isSquare ? "space-y-0.5 pt-0.5" : "space-y-1 pt-1"}`}>
          {underRows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="w-full flex items-center justify-around gap-1 text-center"
            >
              {row.map((artist) => (
                <span
                  key={artist.id}
                  className={`flex-1 font-sans font-medium uppercase tracking-[0.02em] text-[#1A1A1A] leading-[1.05] ${
                    isSquare ? "text-[6.8px] sm:text-[7.5px]" : "text-[7.5px] sm:text-[8.5px]"
                  }`}
                >
                  {artist.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Ilustração Vetorial Inferior Fiel ao Festify (Cabana, Floresta, Montanhas e Vasos) */}
      <div className="relative z-10 w-full mt-auto pt-1 bg-white">
        <svg
          viewBox="0 0 600 185"
          className={`w-full block ${isSquare ? "h-[118px] sm:h-[132px]" : "h-[155px] sm:h-[175px]"}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYBottom meet"
        >
          {/* Nuvens Contornadas em Amarelo */}
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

          {/* Fumaça Amarela Saindo da Chaminé */}
          <path
            d="M310 34V18C310 11.3726 315.373 6 322 6H401C405.971 6 410 10.0294 410 15C410 19.9706 405.971 24 401 24H326V34H310Z"
            fill="#FDE05D"
          />
          <rect x="422" y="6" width="46" height="18" rx="9" fill="#FDE05D" />

          {/* Montanhas e Colinas Amarelas ao Fundo */}
          <path
            d="M0 144H600V165H0V144Z"
            fill="#FDE05D"
          />
          <path
            d="M8 165L37 64L55 122L63 94L78 165H8Z"
            fill="#FDE05D"
          />
          <path
            d="M70 128C110 128 145 138 175 148L182 92L196 146L216 105L228 152L248 112L258 155H375L380 120L390 155L418 96L435 155L538 118L556 155L582 98L596 155L600 165H0V142C20 132 45 128 70 128Z"
            fill="#FDE05D"
          />

          {/* Pinheiros Amarelos Estilizados à Direita */}
          <polygon points="549,92 536,110 562,110" fill="#FDE05D" />
          <polygon points="549,105 533,126 565,126" fill="#FDE05D" />
          <rect x="546" y="126" width="6" height="25" fill="#FDE05D" />

          {/* Pinheiro Line-Art Azul à Esquerda */}
          <polygon
            points="81,96 63,154 99,154"
            fill="none"
            stroke="#2B6EF2"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line x1="81" y1="96" x2="81" y2="165" stroke="#2B6EF2" strokeWidth="2.2" />

          {/* Vaso Botânico Esquerdo com Folhas de Costela-de-Adão */}
          <g>
            {/* Folha Esquerda */}
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

            {/* Folha Direita */}
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

            {/* Pescoço e Corpo do Vaso Esquerdo */}
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
            {/* Faixa Azul Interna do Vaso */}
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

          {/* Pinheiros Duplos Entre Vaso e Cabana */}
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

          {/* Cabana Central A-Frame (Azul Royal & Branco) */}
          <g>
            {/* Chaminé */}
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

            {/* Telhado Esquerdo e Direito */}
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
            {/* Aba lateral direita do telhado principal */}
            <polygon
              points="284,64 294,64 342,165 332,165"
              fill="#2B6EF2"
            />

            {/* Janela Triangular do Sótão */}
            <polygon
              points="284,83 270,112 298,112"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Porta da Cabana */}
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

            {/* Anexo Lateral Direito da Cabana */}
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
            {/* Duas Janelas Brancas no Anexo */}
            <rect x="353" y="141" width="10" height="12" fill="white" />
            <rect x="369" y="141" width="10" height="12" fill="white" />
          </g>

          {/* Pinheiros Duplos à Direita da Cabana */}
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

          {/* Vaso Botânico Direito com Flores Geométricas */}
          <g>
            {/* Hastes e Flores */}
            <line x1="495" y1="30" x2="495" y2="95" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="495" cy="22" r="8" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 45L483 37" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 62L507 52" stroke="#2B6EF2" strokeWidth="2.2" />
            <path d="M495 76L483 68" stroke="#2B6EF2" strokeWidth="2.2" />

            {/* Haste Esquerda */}
            <path d="M487 95L476 70" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="473" cy="63" r="6.5" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />

            {/* Haste Direita */}
            <path d="M503 95L513 60" stroke="#2B6EF2" strokeWidth="2.2" />
            <circle cx="515" cy="52" r="6.5" fill="white" stroke="#2B6EF2" strokeWidth="2.2" />

            {/* Corpo do Vaso Direito (Ânfora) */}
            <path
              d="M484 95H506L502 112C518 112 528 122 525 138C522 152 511 165 495 165C479 165 468 152 465 138C462 122 472 112 488 112L484 95Z"
              fill="white"
              stroke="#2B6EF2"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Onda Azul Interna do Vaso Direito */}
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

          {/* Linha de Solo Azul Royal Contínua */}
          <line x1="0" y1="165" x2="600" y2="165" stroke="#2B6EF2" strokeWidth="2.5" />
        </svg>

        {/* Assinatura Centralizada no Rodapé Branco (Estilo "FESTIFY") */}
        <div
          className={`w-full bg-white flex items-center justify-center relative px-6 ${
            isSquare ? "pb-2.5 pt-0.5" : "pb-4 pt-1"
          }`}
        >
          <span className="font-sans font-black text-sm sm:text-base uppercase tracking-[0.06em] text-[#2B6EF2]">
            FESTIQ
          </span>
          <span className="absolute right-8 font-sans font-bold text-[7px] sm:text-[8px] uppercase tracking-widest text-black/25">
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
