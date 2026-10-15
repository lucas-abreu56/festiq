import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RockStadiumTheme: React.FC<ThemeProps> = ({ lineup }) => {
  return (
    <div className="w-full h-full bg-[#090D16] text-white flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none border-4 border-[#1F293D]">
      {/* Luzes de Palco & Holofotes */}
      <div className="absolute top-0 left-1/4 w-96 h-[500px] bg-gradient-to-b from-[#29B6F6]/25 to-transparent -rotate-12 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-[500px] bg-gradient-to-b from-[#FFB300]/20 to-transparent rotate-12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Header Monumental */}
      <div className="relative z-10 text-center border-b border-[#29B6F6]/40 pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F293D]/80 border border-[#29B6F6]/50 rounded-full font-mono text-[11px] uppercase tracking-widest text-[#29B6F6] mb-2">
          <span>⚡</span>
          <span>{lineup.subtitle}</span>
          <span>⚡</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-wider uppercase text-white drop-shadow-[0_0_25px_rgba(41,182,246,0.6)]">
          {lineup.title}
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-[#CFD8DC] mt-1 font-semibold">
          CIDADE DO ROCK · PALCO PRINCIPAL & PALCO SUNSET
        </p>
      </div>

      {/* Palco Principal / Headliners */}
      <div className="relative z-10 space-y-4 py-2">
        <div className="text-center">
          <span className="inline-block px-3 py-0.5 bg-[#FFB300] text-black font-display font-black text-xs uppercase tracking-widest rounded-sm mb-2 shadow-[0_0_15px_rgba(255,179,0,0.5)]">
            PALCO PRINCIPAL · HEADLINERS
          </span>
          <div className="space-y-2 py-1">
            {lineup.singleStageHeadliners.map((artist) => (
              <div key={artist.id} className="py-0.5">
                <SmartArtistName
                  name={artist.name}
                  role="headliner"
                  className="text-white hover:text-[#FFB300] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divisor Iluminado */}
        <div className="flex items-center justify-center gap-2 text-[#29B6F6] text-xs font-mono font-bold py-1">
          <span className="w-12 h-px bg-[#29B6F6]/40" />
          <span>// PALCO ALTERNATIVO & DESTAQUES //</span>
          <span className="w-12 h-px bg-[#29B6F6]/40" />
        </div>

        {/* Palco Sunset / Sub-Headliners */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 px-2 text-center">
          {lineup.singleStageSubHeadliners.map((artist, idx) => (
            <React.Fragment key={artist.id}>
              <SmartArtistName
                name={artist.name}
                role="sub-headliner"
                className="text-[#CFD8DC] hover:text-white"
              />
              {idx < lineup.singleStageSubHeadliners.length - 1 && (
                <span className="text-[#29B6F6] font-mono text-xs font-black">//</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Undercard em Parágrafo Contínuo */}
        <div className="border-t border-[#1F293D] pt-3 px-4 text-center leading-relaxed">
          {lineup.singleStageUndercard.map((artist, idx) => (
            <React.Fragment key={artist.id}>
              <SmartArtistName
                name={artist.name}
                role="undercard"
                className="text-[#94A3B8]"
              />
              {idx < lineup.singleStageUndercard.length - 1 && (
                <span className="mx-1.5 text-[#29B6F6]/50 text-xs">—</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Rodapé Estádio */}
      <div className="relative z-10 border-t border-[#1F293D] pt-3 flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-[#94A3B8] uppercase">
        <div className="flex items-center gap-2">
          <span className="text-white font-black">FESTIQ STADIUM</span>
          <span>//</span>
          <span>EST. 2026</span>
        </div>
        <div className="text-right text-[#CFD8DC]">
          <span>LIVE RECORDING</span>
          <span className="mx-1">★</span>
          <span>1080×1920 HQ</span>
        </div>
      </div>
    </div>
  );
};
