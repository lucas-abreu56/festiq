import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RockStadiumTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  return (
    <div className="w-full h-full bg-[#0B0D14] text-white flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden select-none border-4 border-[#ED1C24]">
      {/* Holofotes & Lasers de Estádio / Rock in Rio Vibe */}
      <div className="absolute -top-10 left-1/6 w-80 h-[550px] bg-gradient-to-b from-[#ED1C24]/30 via-[#ED1C24]/10 to-transparent -rotate-25 blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-1/6 w-80 h-[550px] bg-gradient-to-b from-[#29B6F6]/30 via-[#29B6F6]/10 to-transparent rotate-25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Header Cidade do Rock */}
      <div className="relative z-10 text-center border-b-2 border-[#ED1C24] pb-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#ED1C24] text-white font-mono text-[10px] uppercase tracking-widest font-black rounded-sm mb-1 shadow-[0_0_15px_rgba(237,28,36,0.6)]">
          <span>🎸</span>
          <span>{lineup.subtitle}</span>
          <span>🎸</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter uppercase text-white drop-shadow-[0_0_30px_rgba(237,28,36,0.7)] leading-tight">
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#E2E8F0] mt-0.5 font-bold">
          <span>★ CIDADE DO ROCK</span>
          <span>·</span>
          <span className="text-[#ED1C24]">PALCO MUNDO & PALCO SUNSET</span>
          <span>·</span>
          <span>RIO DE JANEIRO ★</span>
        </div>
      </div>

      {/* Conteúdo: 16:9 Horizontal ou 9:16 Vertical */}
      {isHorizontal ? (
        <div className="relative z-10 flex-1 grid grid-cols-12 gap-5 py-3 items-stretch overflow-hidden">
          {/* Palco Mundo (Headliners) */}
          <div className="col-span-5 bg-gradient-to-b from-[#ED1C24]/15 to-transparent border-r-2 border-[#ED1C24]/40 pr-4 flex flex-col justify-around text-center rounded-l-lg p-2">
            <div>
              <span className="inline-block px-3 py-1 bg-[#ED1C24] text-white font-display font-black text-[11px] uppercase tracking-widest rounded-sm mb-2 shadow-[0_0_15px_rgba(237,28,36,0.5)]">
                PALCO MUNDO · HEADLINERS
              </span>
              <div className="space-y-3 py-1">
                {lineup.singleStageHeadliners.map((artist) => (
                  <div key={artist.id} className="py-0.5">
                    <SmartArtistName
                      name={artist.name}
                      role="headliner"
                      horizontal
                      className="text-white hover:text-[#ED1C24] drop-shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#ED1C24] tracking-widest font-black uppercase border-t border-[#ED1C24]/30 pt-2">
              ★ NOITES HISTÓRICAS NO ESTÁDIO ★
            </div>
          </div>

          {/* Palco Sunset & Undercard */}
          <div className="col-span-7 flex flex-col justify-between h-full pl-2 text-center">
            {/* Palco Sunset */}
            <div className="bg-[#FFB300]/10 border border-[#FFB300]/30 rounded-lg p-2.5">
              <span className="inline-block px-2.5 py-0.5 bg-[#FFB300] text-black font-display font-black text-[10px] uppercase tracking-widest rounded-sm mb-2 shadow-[0_0_10px_rgba(255,179,0,0.4)]">
                PALCO SUNSET · GRANDES ENCONTROS
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                {lineup.singleStageSubHeadliners.map((artist, idx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="sub-headliner"
                      horizontal
                      className="text-white font-bold hover:text-[#FFB300]"
                    />
                    {idx < lineup.singleStageSubHeadliners.length - 1 && (
                      <span className="text-[#FFB300] font-mono text-xs font-black">//</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Espaço Favela & Undercard */}
            <div className="border-t border-white/20 pt-2">
              <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-1 font-bold">
                NEW DANCE ORDER · ESPAÇO FAVELA · ROCK DISTRICT
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 leading-snug">
                {lineup.singleStageUndercard.map((artist, idx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      horizontal
                      className="text-[#CBD5E1]"
                    />
                    {idx < lineup.singleStageUndercard.length - 1 && (
                      <span className="text-[#ED1C24]/60 text-[9px] font-bold">★</span>
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
          {/* Palco Mundo (Headliners) */}
          <div className="text-center bg-gradient-to-b from-[#ED1C24]/20 via-[#ED1C24]/5 to-transparent border-b-2 border-[#ED1C24]/50 pb-2.5 pt-1 rounded-t-lg">
            <span className="inline-block px-3 py-0.5 bg-[#ED1C24] text-white font-display font-black text-[9px] uppercase tracking-widest rounded-sm mb-1.5 shadow-[0_0_12px_rgba(237,28,36,0.5)]">
              PALCO MUNDO · HEADLINERS
            </span>
            <div className="space-y-1.5">
              {lineup.singleStageHeadliners.map((artist) => (
                <div key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="headliner"
                    className="text-white drop-shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Palco Sunset */}
          <div className="text-center py-2 border-b border-white/20 bg-white/5 rounded-md px-2 my-1">
            <span className="inline-block px-2.5 py-0.5 bg-[#FFB300] text-black font-mono font-black text-[9px] uppercase tracking-widest rounded-sm mb-1.5 shadow-[0_0_10px_rgba(255,179,0,0.3)]">
              PALCO SUNSET · ENCONTROS & SHOWS ESPECIAIS
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5">
              {lineup.singleStageSubHeadliners.map((artist, idx) => (
                <React.Fragment key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="sub-headliner"
                    className="text-[#E2E8F0] font-bold"
                  />
                  {idx < lineup.singleStageSubHeadliners.length - 1 && (
                    <span className="text-[#FFB300] font-mono text-[10px] font-black">//</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Undercard / Outros Palcos */}
          <div className="pt-1.5 px-2 text-center leading-tight">
            <span className="text-[8px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-1 font-bold">
              ESPAÇO FAVELA · NEW DANCE ORDER · ROCK DISTRICT
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
              {lineup.singleStageUndercard.map((artist, idx) => (
                <React.Fragment key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="undercard"
                    className="text-[#94A3B8]"
                  />
                  {idx < lineup.singleStageUndercard.length - 1 && (
                    <span className="text-[#ED1C24]/50 text-[8px]">★</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rodapé Rock in Rio Vibe */}
      <div className="relative z-10 border-t-2 border-[#ED1C24] pt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#ED1C24] font-black">FESTIQ ROCK</span>
          <span>//</span>
          <span>CIDADE DO ROCK</span>
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
