import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RetroPressTheme: React.FC<ThemeProps> = ({ lineup }) => {
  return (
    <div className="w-full h-full bg-[#F5EBE1] text-[#1C1917] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none border-8 border-double border-[#1C1917]">
      {/* Moldura Interna Clássica */}
      <div className="absolute inset-2 border border-[#92400E]/40 pointer-events-none" />

      {/* Header Vintage Prensa Tipográfica */}
      <div className="relative z-10 text-center border-b-2 border-[#1C1917] pb-4 sm:pb-6 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs font-serif italic text-[#7F1D1D] mb-1 font-bold">
          <span>◆</span>
          <span>{lineup.subtitle}</span>
          <span>◆</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight uppercase leading-tight text-[#1C1917]">
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#92400E] mt-2 font-semibold">
          <span>★ 3 DIAS DE PAZ, AMOR & MÚSICA ★</span>
        </div>
      </div>

      {/* Lineup Centralizado em Prensa Clássica */}
      <div className="relative z-10 flex-1 flex flex-col justify-around py-4 text-center">
        {/* Headliners de Destaque */}
        <div className="space-y-2 py-2 border-b border-[#1C1917]/20 pb-4">
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7F1D1D]">
            — ATRAÇÕES PRINCIPAIS —
          </span>
          {lineup.singleStageHeadliners.map((artist) => (
            <div key={artist.id} className="py-1">
              <SmartArtistName
                name={artist.name}
                role="headliner"
                className="font-serif text-[#1C1917]"
              />
            </div>
          ))}
        </div>

        {/* Sub-Headliners */}
        <div className="py-2 border-b border-[#1C1917]/20 pb-3">
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#92400E] block mb-2">
            — COM AS PARTICIPAÇÕES ESPECIAIS DE —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 px-2">
            {lineup.singleStageSubHeadliners.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <SmartArtistName
                  name={artist.name}
                  role="sub-headliner"
                  className="font-serif font-bold text-[#7F1D1D]"
                />
                {idx < lineup.singleStageSubHeadliners.length - 1 && (
                  <span className="text-[#92400E] font-serif text-sm">◆</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Undercard em Prensa Tipográfica Justificada */}
        <div className="pt-2 px-4 leading-relaxed text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#1C1917]/60 block mb-1">
            E MUITO MAIS
          </span>
          {lineup.singleStageUndercard.map((artist, idx) => (
            <React.Fragment key={artist.id}>
              <SmartArtistName
                name={artist.name}
                role="undercard"
                className="font-serif text-[#1C1917]/85"
              />
              {idx < lineup.singleStageUndercard.length - 1 && (
                <span className="mx-1.5 text-[#92400E]/70 text-xs">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Rodapé Vintage */}
      <div className="relative z-10 border-t-2 border-[#1C1917] pt-3 flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-[#1C1917]/75 uppercase">
        <div>
          <span>IMPRESSÃO TIPOGRÁFICA ORIGINAL</span>
          <span className="mx-1.5">◆</span>
          <span>FESTIQ</span>
        </div>
        <div className="text-right text-[#7F1D1D]">
          <span>ED. HISTÓRICA</span>
          <span className="mx-1">★</span>
          <span>1080×1920</span>
        </div>
      </div>
    </div>
  );
};
