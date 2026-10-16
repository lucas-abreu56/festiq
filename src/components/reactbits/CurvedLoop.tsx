"use client";

/**
 * Componente: CurvedLoop
 * Referência: ReactBits (reactbits.dev/text-animations/curved-loop)
 * Licença: MIT + Commons Clause
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
  const repeatedText = `${text} ★ ${text} ★ ${text} ★ ${text} ★ `.toUpperCase();

  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none py-2 ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        className="w-full h-16 sm:h-20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="curved-path"
          d="M0 60 C 300 10, 600 110, 900 60 C 1050 35, 1150 45, 1200 60"
          stroke="transparent"
        />
        <text className="font-frama uppercase text-base sm:text-lg font-black fill-[#CEFF00] tracking-widest opacity-80">
          <textPath href="#curved-path" startOffset="0%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur="20s"
              repeatCount="indefinite"
            />
          </textPath>
          <textPath href="#curved-path" startOffset="100%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="100%"
              to="0%"
              dur="20s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
};
