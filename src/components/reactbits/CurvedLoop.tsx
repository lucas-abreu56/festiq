"use client";

/**
 * Componente: CurvedLoop
 * Referência: ReactBits (reactbits.dev/text-animations/curved-loop)
 * Licença: MIT + Commons Clause (Copyright (c) 2026 David Haz)
 */

import React from "react";

interface CurvedLoopProps {
  text: string;
  className?: string;
}

export const CurvedLoop: React.FC<CurvedLoopProps> = ({
  text,
  className = "",
}) => {
  const cleanText = (text || "FESTIQ STUDIO").trim().toUpperCase();
  const unit = `${cleanText} ★ `;
  const repeatedText = unit.repeat(8);

  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none py-3 sm:py-5 bg-[#0E0E0E] relative ${className}`}
    >
      <svg
        viewBox="0 0 1440 220"
        className="w-full h-28 sm:h-36 md:h-44 block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Curva Guia Sutil de Estúdio */}
        <path
          d="M -100 135 C 320 25, 720 215, 1120 105 C 1320 55, 1440 85, 1600 125"
          stroke="#222222"
          strokeWidth="2"
          strokeDasharray="8 8"
        />

        {/* Caminho Principal da Onda Tipográfica */}
        <path
          id="festiq-curved-path"
          d="M -100 125 C 320 15, 720 205, 1120 95 C 1320 45, 1440 75, 1600 115"
          stroke="transparent"
        />

        {/* Texto Monumental em PP Frama Black Italic */}
        <text
          fontSize="68"
          className="font-frama uppercase font-black italic fill-[#CEFF00]"
          style={{ letterSpacing: "0.06em" }}
        >
          <textPath href="#festiq-curved-path" startOffset="0%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-50%"
              dur="22s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
};
