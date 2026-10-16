import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const TropicalTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#00A896] via-[#028090] to-[#023047] text-white flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden select-none border-4 border-[#F4D35E]/60">
      {/* Elementos Tropicais & Brilho Solar */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6B6B] rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#F4D35E] rounded-full blur-3xl opacity-35 pointer-events-none" />

      {/* Header Litorâneo */}
      <div className="relative z-10 text-center border-b-2 border-white/20 pb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F4D35E] text-[#023047] rounded-full font-mono text-[10px] uppercase tracking-widest font-black mb-1 shadow-md">
          <span>≋</span>
          <span>{lineup.subtitle}</span>
          <span>≋</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight uppercase leading-none drop-shadow-[0_4px_12px_rgba(2,48,71,0.5)]">
          {lineup.title}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#F4D35E] mt-0.5 font-bold">
          EDIÇÃO DE VERÃO · LITORAL · FESTIVAL TROPICAL
        </p>
      </div>

      {/* Lineup Solar: Lado a Lado no 16:9 ou Empilhado no 9:16 */}
      <div
        className={`relative z-10 flex-1 py-2.5 gap-3 overflow-hidden ${
          isHorizontal
            ? "grid grid-cols-3 items-stretch"
            : "flex flex-col justify-between"
        }`}
      >
        {lineup.days.map((day, idx) => {
          const accentColor =
            idx === 0 ? "text-[#F4D35E]" : idx === 1 ? "text-[#FF6B6B]" : "text-[#02C39A]";

          return (
            <div
              key={day.dayLabel}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 shadow-lg flex flex-col justify-between overflow-hidden"
            >
              {/* Topo do Bloco do Dia */}
              <div className="flex items-center justify-between border-b border-white/15 pb-1 mb-1">
                <span className={`font-mono text-[10px] font-black uppercase tracking-wider ${accentColor}`}>
                  {day.dayLabel} · {day.dateLabel}
                </span>
                <span className="font-mono text-[9px] text-white/60">PALCO SOLAR</span>
              </div>

              {/* Headliner */}
              <div className="py-0.5 text-center">
                <SmartArtistName
                  name={day.headliner.name}
                  role="headliner"
                  horizontal={isHorizontal}
                  className="text-white drop-shadow-md"
                />
              </div>

              {/* Sub-headliners */}
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 py-0.5">
                {day.coHeadliners.map((artist, cIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="sub-headliner"
                      horizontal={isHorizontal}
                      className="text-[#F4D35E] font-bold"
                    />
                    {cIdx < day.coHeadliners.length - 1 && (
                      <span className="text-white/40 text-[10px]">≋</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Undercard */}
              <div className="text-white/80 pt-1 text-center leading-tight">
                {day.undercard.map((artist, uIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      horizontal={isHorizontal}
                      className="text-white/70 font-medium"
                    />
                    {uIdx < day.undercard.length - 1 && (
                      <span className="mx-1 text-[#F4D35E]/60 text-[8px]">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Verão */}
      <div className="relative z-10 border-t-2 border-white/20 pt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-white/75 uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#F4D35E] font-black">FESTIQ TROPICAL</span>
          <span>≋</span>
          <span>EST. 2026</span>
        </div>
        <div className="flex items-center gap-1 text-white/60">
          <span>{isHorizontal ? "16:9 BANNER" : "9:16 STORIES"}</span>
          <span>★</span>
          <span>{isHorizontal ? "1920×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
