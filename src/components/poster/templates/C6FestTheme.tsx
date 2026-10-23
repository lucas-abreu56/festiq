import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

/**
 * Paleta cromática fiel ao cartaz oficial do C6 Fest:
 * Rosa-Carmim, Verde-Menta, Amarelo-Ouro, Azul-Ciano e Malva-Orquídea.
 */
const C6_LINEUP_COLORS = [
  "#E05378", // Rosa Carmim
  "#43B581", // Verde Menta
  "#E6D15A", // Amarelo Ouro Pálido
  "#62B4D6", // Azul Ciano Celeste
  "#C76B9E", // Malva Orquídea
];

/**
 * Calcula a cor de cada ponto na íris concêntrica do topo
 * conforme o ângulo (0..360) e o anel (0 = interno, 6 = externo).
 */
function getIrisDotColor(angleDeg: number, ringIndex: number): string {
  const normAngle = ((angleDeg % 360) + 360) % 360;

  // Os 2 anéis mais internos têm predominância de Azul-Ciano e Turquesa (como no pôster original)
  if (ringIndex === 0) {
    return normAngle > 260 && normAngle < 350 ? "#56CCF2" : "#38D9A9";
  }
  if (ringIndex === 1) {
    if (normAngle >= 240 && normAngle <= 345) return "#64B5D6";
    if (normAngle > 345 || normAngle < 60) return "#C76B9E";
    return "#48B885";
  }

  // Anéis intermediários e externos seguem o ciclo solar/magenta ao redor da circunferência
  if (normAngle >= 135 && normAngle < 235) {
    // Quadrante Esquerdo / Inferior-Esquerdo: Amarelo-Ouro e Âmbar
    return ringIndex >= 4 ? "#F2C94C" : "#E6B84A";
  }
  if (normAngle >= 235 && normAngle < 325) {
    // Quadrante Superior-Esquerdo / Topo: Coral e Laranja-Avermelhado
    return ringIndex % 2 === 0 ? "#EB5757" : "#F2994A";
  }
  if (normAngle >= 325 || normAngle < 55) {
    // Quadrante Direito / Superior-Direito: Rosa-Magenta e Carmim
    return ringIndex >= 4 ? "#E05378" : "#D6336C";
  }
  // Quadrante Inferior-Direito (55° a 135°): Transição Carmim -> Ouro
  return ringIndex >= 5 ? "#F2C94C" : "#E05378";
}

/**
 * Divide o nome do festival em 2 linhas para o centro da íris pontilhada:
 * Linha 1 em peso ultra-black geométrico (ex: "FESTIQ" ou "C6")
 * Linha 2 em peso light espaçado (ex: "FEST" ou "STUDIO")
 */
function formatC6CenterTitle(rawTitle: string): { primary: string; secondary: string } {
  const clean = (rawTitle || "FESTIQ STUDIO").trim().toUpperCase();
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return {
      primary: words[0],
      secondary: words.slice(1).join(" "),
    };
  }

  const single = words[0] || "FESTIQ";
  if (single.endsWith("FEST") && single.length > 4) {
    return {
      primary: single.slice(0, -4),
      secondary: "FEST",
    };
  }
  if (single.endsWith("PALOOZA") && single.length > 7) {
    return {
      primary: single.slice(0, -7),
      secondary: "FEST",
    };
  }
  return {
    primary: single,
    secondary: "FEST",
  };
}

export const C6FestTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Ordenação alfabética estrita (A a Z) fiel ao conceito do C6 Fest
  const sortedArtists = [...allArtists].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
  );

  const { primary, secondary } = formatC6CenterTitle(lineup.title);

  // Geração matemática dos 7 anéis concêntricos de pontos (54 pontos por anel = 378 pontos)
  const rings = [72, 81, 90, 99, 108, 117, 126];
  const dotsPerRing = 54;
  const angleStep = 360 / dotsPerRing;

  return (
    <div
      className={`w-full h-full bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans ${
        isSquare ? "px-6 py-4" : "px-5 py-5"
      }`}
    >
      {/* 1. TOPO: Íris Concêntrica Pontilhada Multicolorida + Logotipo Central */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className={`relative flex items-center justify-center ${isSquare ? "w-48 h-48" : "w-56 h-56"}`}>
          <svg
            viewBox="0 0 280 280"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {rings.map((radius, rIdx) => {
              const dotRadius = 1.15 + rIdx * 0.24;
              const offsetDeg = rIdx % 2 === 1 ? angleStep / 2 : 0;

              return Array.from({ length: dotsPerRing }).map((_, dIdx) => {
                const deg = dIdx * angleStep + offsetDeg;
                const rad = (deg * Math.PI) / 180;
                const cx = 140 + radius * Math.cos(rad);
                const cy = 140 + radius * Math.sin(rad);
                const fill = getIrisDotColor(deg, rIdx);

                return (
                  <circle
                    key={`${rIdx}-${dIdx}`}
                    cx={cx.toFixed(2)}
                    cy={cy.toFixed(2)}
                    r={dotRadius.toFixed(2)}
                    fill={fill}
                  />
                );
              });
            })}
          </svg>

          {/* Núcleo Central com o Nome do Festival (Escala adaptativa sem nunca cortar letras) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-9 pointer-events-none">
            <span
              className={`font-display font-black uppercase text-white leading-[0.88] tracking-tight ${
                primary.length <= 3
                  ? isSquare
                    ? "text-4xl"
                    : "text-4xl"
                  : primary.length <= 6
                  ? isSquare
                    ? "text-xl"
                    : "text-xl"
                  : primary.length <= 10
                  ? isSquare
                    ? "text-sm"
                    : "text-sm"
                  : "text-xs"
              }`}
            >
              {primary}
            </span>
            <span
              className={`font-sans font-light uppercase text-white/95 leading-none tracking-[0.16em] pl-[0.16em] mt-1 ${
                secondary.length > 10
                  ? "text-[10px]"
                  : isSquare
                  ? "text-sm"
                  : "text-sm"
              }`}
            >
              {secondary}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CORPO: Indicador "A a Z" + Bloco Tipográfico Justificado Multicolorido */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full overflow-hidden my-1">
        {/* Indicador A a Z alinhado à esquerda */}
        <div className={isSquare ? "mb-1" : "mb-2"}>
          <span
            className={`font-sans font-normal text-white tracking-[0.2em] ${
              isSquare ? "text-[11px]" : "text-xs"
            }`}
          >
            A a Z
          </span>
        </div>

        {/* Bloco de Artistas Justificado de Ponta a Ponta (Fiel ao C6 Fest, 100% integral sem truncar) */}
        <div
          className={`w-full text-justify [text-align-last:justify] uppercase font-sans font-medium ${
            isSquare
              ? "text-[13px] leading-[1.38] tracking-[0.045em]"
              : "text-[12px] leading-[1.46] tracking-[0.045em]"
          }`}
        >
          {sortedArtists.map((artist, idx) => {
            const color = C6_LINEUP_COLORS[idx % C6_LINEUP_COLORS.length];
            const isShort = artist.name.length <= 13;
            return (
              <React.Fragment key={artist.id}>
                <span
                  style={{ color }}
                  className={isShort ? "whitespace-nowrap" : ""}
                >
                  {artist.name}
                </span>
                {idx < sortedArtists.length - 1 ? " " : ""}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. RODAPÉ: Assinatura Discreta à Esquerda + Ano Grande "2026" à Direita */}
      <div className="relative z-10 w-full flex items-end justify-between pt-1">
        <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40 pb-0.5">
          <span>FESTIQ · {lineup.subtitle.split("·")[0].trim()}</span>
        </div>
        <div
          className={`font-sans font-light text-white leading-none tracking-tight ${
            isSquare ? "text-2xl" : "text-2xl"
          }`}
        >
          2026
        </div>
      </div>
    </div>
  );
};
