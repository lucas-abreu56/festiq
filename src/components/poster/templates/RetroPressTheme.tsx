import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RetroPressTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  return (
    <div
      className={`w-full h-full bg-[#F5EBE1] text-[#1C1917] flex flex-col justify-between relative overflow-hidden select-none border-8 border-double border-[#1C1917] ${
        isSquare ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      {/* Moldura Interna Clássica */}
      <div className="absolute inset-2 border border-[#92400E]/40 pointer-events-none" />

      {/* Header Vintage */}
      <div
        className={`relative z-10 text-center border-b-2 border-[#1C1917] ${
          isSquare ? "pb-1.5 pt-0.5" : "pb-2.5 pt-1"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-serif italic text-[#7F1D1D] font-bold">
          <span>◆</span>
          <span>{lineup.subtitle}</span>
          <span>◆</span>
        </div>
        <h1
          className={`font-serif font-black tracking-tight uppercase leading-none text-[#1C1917] mt-0.5 ${
            isSquare ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-2 font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-widest text-[#92400E] mt-0.5 font-semibold">
          <span>3 DIAS DE PAZ, AMOR & MÚSICA · EDIÇÃO DE COLECIONADOR</span>
        </div>
      </div>

      {/* Lineup Compacto & Calibrado — 100% dos 45 Artistas Visíveis em 9:16 e 1:1 */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-between text-center overflow-hidden ${
          isSquare ? "py-1.5" : "py-2"
        }`}
      >
        {/* Headliners de Destaque */}
        <div className={`border-b border-[#1C1917]/20 ${isSquare ? "pb-1" : "pb-2"}`}>
          <span className="text-[7.5px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#7F1D1D] block mb-0.5">
            — ATRAÇÕES PRINCIPAIS —
          </span>
          <div className={isSquare ? "space-y-0.5" : "space-y-1"}>
            {lineup.singleStageHeadliners.map((artist) => (
              <div key={artist.id}>
                <span
                  className={`block font-serif font-black uppercase tracking-tight text-[#1C1917] leading-tight ${
                    isSquare ? "text-sm sm:text-base" : "text-lg sm:text-xl"
                  }`}
                >
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Headliners */}
        <div className={`border-b border-[#1C1917]/20 ${isSquare ? "py-1" : "py-1.5"}`}>
          <span className="text-[7.5px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#92400E] block mb-0.5">
            — PARTICIPAÇÕES ESPECIAIS —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 px-1">
            {lineup.singleStageSubHeadliners.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <span
                  className={`font-serif font-bold uppercase text-[#7F1D1D] leading-tight ${
                    isSquare
                      ? "text-[9px] sm:text-[10px]"
                      : "text-[10.5px] sm:text-xs"
                  }`}
                >
                  {artist.name}
                </span>
                {idx < lineup.singleStageSubHeadliners.length - 1 && (
                  <span className="text-[#92400E] font-serif text-[8px]">◆</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Undercard Completo — Todos os 34 Artistas Restantes Visíveis */}
        <div className="pt-1 px-1 leading-tight text-center">
          <span className="text-[7px] sm:text-[8px] font-mono tracking-widest uppercase text-[#1C1917]/60 block mb-0.5 font-bold">
            — ELENCO COMPLETO DO FESTIVAL —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
            {lineup.singleStageUndercard.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <span
                  className={`font-serif font-semibold uppercase text-[#1C1917]/90 leading-tight ${
                    isSquare
                      ? "text-[7px] sm:text-[8px]"
                      : "text-[8px] sm:text-[9.5px]"
                  }`}
                >
                  {artist.name}
                </span>
                {idx < lineup.singleStageUndercard.length - 1 && (
                  <span className="text-[#92400E]/70 text-[7px]">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé Vintage */}
      <div className="relative z-10 border-t-2 border-[#1C1917] pt-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono font-bold text-[#1C1917]/75 uppercase">
        <div>
          <span>IMPRESSÃO TIPOGRÁFICA</span>
          <span className="mx-1">◆</span>
          <span>FESTIQ</span>
        </div>
        <div className="text-right text-[#7F1D1D]">
          <span>{isSquare ? "1:1 QUADRADO" : "9:16 VERTICAL"}</span>
          <span className="mx-1">·</span>
          <span>{isSquare ? "1080×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
