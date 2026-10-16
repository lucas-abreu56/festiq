import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RockStadiumTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  return (
    <div className="w-full h-full bg-[#090D16] text-white flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden select-none border-4 border-[#1F293D]">
      {/* Luzes de Palco & Holofotes */}
      <div className="absolute top-0 left-1/4 w-96 h-[500px] bg-gradient-to-b from-[#29B6F6]/25 to-transparent -rotate-12 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-[500px] bg-gradient-to-b from-[#FFB300]/20 to-transparent rotate-12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Header Monumental */}
      <div className="relative z-10 text-center border-b border-[#29B6F6]/40 pb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#1F293D]/80 border border-[#29B6F6]/50 rounded-full font-mono text-[10px] uppercase tracking-widest text-[#29B6F6] mb-1">
          <span>⚡</span>
          <span>{lineup.subtitle}</span>
          <span>⚡</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-wider uppercase text-white drop-shadow-[0_0_25px_rgba(41,182,246,0.6)]">
          {lineup.title}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#CFD8DC] mt-0.5 font-semibold">
          CIDADE DO ROCK · PALCO PRINCIPAL & PALCO SUNSET
        </p>
      </div>

      {/* Conteúdo: Layout Horizontal (Grid 12 colunas) ou Vertical (Empilhado) */}
      {isHorizontal ? (
        <div className="relative z-10 flex-1 grid grid-cols-12 gap-4 py-3 items-center overflow-hidden">
          {/* Palco Principal */}
          <div className="col-span-5 border-r border-[#1F293D] pr-4 text-center">
            <span className="inline-block px-3 py-0.5 bg-[#FFB300] text-black font-display font-black text-[10px] uppercase tracking-widest rounded-sm mb-2 shadow-[0_0_15px_rgba(255,179,0,0.5)]">
              PALCO PRINCIPAL · HEADLINERS
            </span>
            <div className="space-y-2 py-1">
              {lineup.singleStageHeadliners.map((artist) => (
                <div key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="headliner"
                    horizontal
                    className="text-white hover:text-[#FFB300]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Palco Sunset & Undercard */}
          <div className="col-span-7 flex flex-col justify-around h-full pl-2 text-center">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#29B6F6] uppercase font-bold block mb-1.5">
                // PALCO SUNSET & CONVIDADOS //
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                {lineup.singleStageSubHeadliners.map((artist, idx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="sub-headliner"
                      horizontal
                      className="text-[#CFD8DC]"
                    />
                    {idx < lineup.singleStageSubHeadliners.length - 1 && (
                      <span className="text-[#29B6F6] font-mono text-xs font-black">//</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1F293D] pt-2">
              <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-1">
                LINEUP COMPLETO DOS PALCOS
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 leading-snug">
                {lineup.singleStageUndercard.map((artist, idx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      horizontal
                      className="text-[#94A3B8]"
                    />
                    {idx < lineup.singleStageUndercard.length - 1 && (
                      <span className="text-[#29B6F6]/40 text-[9px]">—</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vertical 9:16 */
        <div className="relative z-10 flex-1 flex flex-col justify-between py-2 overflow-hidden">
          {/* Palco Principal */}
          <div className="text-center border-b border-[#1F293D] pb-2">
            <span className="inline-block px-2.5 py-0.5 bg-[#FFB300] text-black font-display font-black text-[9px] uppercase tracking-widest rounded-sm mb-1 shadow-[0_0_12px_rgba(255,179,0,0.4)]">
              PALCO PRINCIPAL · HEADLINERS
            </span>
            <div className="space-y-1">
              {lineup.singleStageHeadliners.map((artist) => (
                <div key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="headliner"
                    className="text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Palco Sunset */}
          <div className="text-center py-1.5 border-b border-[#1F293D]">
            <span className="text-[9px] font-mono tracking-widest text-[#29B6F6] uppercase font-bold block mb-1">
              // PALCO SUNSET & DESTAQUES //
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 px-2">
              {lineup.singleStageSubHeadliners.map((artist, idx) => (
                <React.Fragment key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="sub-headliner"
                    className="text-[#CFD8DC]"
                  />
                  {idx < lineup.singleStageSubHeadliners.length - 1 && (
                    <span className="text-[#29B6F6] font-mono text-[10px]">//</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Undercard em Parágrafo Contínuo */}
          <div className="pt-1.5 px-3 text-center leading-tight">
            <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
              {lineup.singleStageUndercard.map((artist, idx) => (
                <React.Fragment key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="undercard"
                    className="text-[#94A3B8]"
                  />
                  {idx < lineup.singleStageUndercard.length - 1 && (
                    <span className="text-[#29B6F6]/40 text-[8px]">—</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rodapé Estádio */}
      <div className="relative z-10 border-t border-[#1F293D] pt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
        <div className="flex items-center gap-2">
          <span className="text-white font-black">FESTIQ STADIUM</span>
          <span>//</span>
          <span>EST. 2026</span>
        </div>
        <div className="text-right text-[#CFD8DC]">
          <span>{isHorizontal ? "16:9 BANNER" : "9:16 STORIES"}</span>
          <span className="mx-1">★</span>
          <span>{isHorizontal ? "1920×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
