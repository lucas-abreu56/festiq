import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const TropicalTheme: React.FC<ThemeProps> = ({ lineup }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#00A896] via-[#028090] to-[#023047] text-white flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none border-4 border-[#F4D35E]/60">
      {/* Elementos Tropicais & Brilho Solar */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6B6B] rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#F4D35E] rounded-full blur-3xl opacity-35 pointer-events-none" />

      {/* Header Litorâneo */}
      <div className="relative z-10 text-center border-b-2 border-white/20 pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F4D35E] text-[#023047] rounded-full font-mono text-xs uppercase tracking-widest font-black mb-2 shadow-md">
          <span>≋</span>
          <span>{lineup.subtitle}</span>
          <span>≋</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight uppercase leading-none drop-shadow-[0_4px_12px_rgba(2,48,71,0.5)]">
          {lineup.title}
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-[#F4D35E] mt-1.5 font-bold">
          EDIÇÃO DE VERÃO · LITORAL · FESTIVAL TROPICAL
        </p>
      </div>

      {/* Lineup Solar em 3 Blocos */}
      <div className="relative z-10 flex-1 flex flex-col justify-around py-4 gap-3">
        {lineup.days.map((day, idx) => {
          const accentColor =
            idx === 0 ? "text-[#F4D35E]" : idx === 1 ? "text-[#FF6B6B]" : "text-[#02C39A]";

          return (
            <div
              key={day.dayLabel}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-5 shadow-lg flex flex-col justify-between"
            >
              {/* Topo do Bloco do Dia */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2">
                <span className={`font-mono text-xs font-black uppercase tracking-wider ${accentColor}`}>
                  {day.dayLabel} · {day.dateLabel}
                </span>
                <span className="font-mono text-xs text-white/60">PALCO SOLAR</span>
              </div>

              {/* Headliner */}
              <div className="py-1">
                <SmartArtistName
                  name={day.headliner.name}
                  role="headliner"
                  className="text-white drop-shadow-md"
                />
              </div>

              {/* Sub-headliners */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1">
                {day.coHeadliners.map((artist, cIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="sub-headliner"
                      className="text-[#F4D35E] font-bold"
                    />
                    {cIdx < day.coHeadliners.length - 1 && (
                      <span className="text-white/40">≋</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Undercard */}
              <div className="text-white/80 pt-1 line-clamp-2 leading-relaxed text-xs">
                {day.undercard.map((artist, uIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      className="text-white/70 font-medium"
                    />
                    {uIdx < day.undercard.length - 1 && (
                      <span className="mx-1 text-[#F4D35E]/60">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Verão */}
      <div className="relative z-10 border-t-2 border-white/20 pt-3 flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-white/75 uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#F4D35E] font-black">FESTIQ TROPICAL</span>
          <span>≋</span>
          <span>EST. 2026</span>
        </div>
        <div className="flex items-center gap-1 text-white/60">
          <span>O MAIOR FESTIVAL DO VERÃO</span>
          <span>★</span>
          <span>1080×1920</span>
        </div>
      </div>
    </div>
  );
};
