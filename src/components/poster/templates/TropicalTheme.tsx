import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const TropicalTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0B192C] via-[#023E8A] to-[#0077B6] text-white flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden select-none border-4 border-[#00E5FF]">
      {/* Ondas Solares & Atmosfera Litorânea do Planeta */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#FFE600] rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#FF2E63] rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#03071E] via-[#0B192C]/80 to-transparent pointer-events-none" />

      {/* Header Planeta Atlântida */}
      <div className="relative z-10 text-center border-b-2 border-[#00E5FF]/40 pb-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#FFE600] text-[#0B192C] rounded-full font-mono text-[10px] uppercase tracking-widest font-black mb-1 shadow-md">
          <span>≋</span>
          <span>{lineup.subtitle}</span>
          <span>≋</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,229,255,0.4)] text-white">
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#00E5FF] mt-0.5 font-bold">
          <span>★ O MAIOR FESTIVAL DO VERÃO</span>
          <span>·</span>
          <span className="text-[#FFE600]">PALCO PLANETA & PALCO ATLÂNTIDA</span>
          <span>·</span>
          <span>PRAIA DE ATLÂNTIDA ★</span>
        </div>
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
            idx === 0 ? "text-[#FFE600]" : idx === 1 ? "text-[#00E5FF]" : "text-[#FF2E63]";
          const badgeBg =
            idx === 0 ? "bg-[#FFE600] text-[#0B192C]" : idx === 1 ? "bg-[#00E5FF] text-[#0B192C]" : "bg-[#FF2E63] text-white";

          return (
            <div
              key={day.dayLabel}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 shadow-lg flex flex-col justify-between overflow-hidden"
            >
              {/* Topo do Dia */}
              <div className="flex items-center justify-between border-b border-white/20 pb-1 mb-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${badgeBg}`}>
                  {day.dayLabel} · {day.dateLabel}
                </span>
                <span className="font-mono text-[9px] text-[#00E5FF] font-bold">PALCO PLANETA</span>
              </div>

              {/* Headliner do Dia */}
              <div className="py-1 text-center">
                <SmartArtistName
                  name={day.headliner.name}
                  role="headliner"
                  horizontal={isHorizontal}
                  className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Palco Atlântida / Co-Headliners */}
              <div className="border-t border-b border-white/10 py-1 my-0.5">
                <span className="text-[8px] font-mono tracking-widest text-[#FFE600] uppercase font-bold block text-center mb-0.5">
                  PALCO ATLÂNTIDA
                </span>
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
                  {day.coHeadliners.map((artist, cIdx) => (
                    <React.Fragment key={artist.id}>
                      <SmartArtistName
                        name={artist.name}
                        role="sub-headliner"
                        horizontal={isHorizontal}
                        className={`${accentColor} font-bold`}
                      />
                      {cIdx < day.coHeadliners.length - 1 && (
                        <span className="text-white/40 text-[9px]">≋</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Undercard / E-Music / Rap */}
              <div className="text-white/85 pt-1 text-center leading-tight">
                {day.undercard.map((artist, uIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      horizontal={isHorizontal}
                      className="text-white/80 font-medium"
                    />
                    {uIdx < day.undercard.length - 1 && (
                      <span className="mx-1 text-[#FFE600]/60 text-[8px]">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Planeta Atlântida */}
      <div className="relative z-10 border-t-2 border-[#00E5FF]/40 pt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-white/80 uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#FFE600] font-black">PLANETA FESTIQ</span>
          <span>≋</span>
          <span>ATLÂNTIDA RS</span>
          <span>≋</span>
          <span>EST. 2026</span>
        </div>
        <div className="flex items-center gap-1 text-[#00E5FF]">
          <span>{isHorizontal ? "16:9 BANNER" : "9:16 STORIES"}</span>
          <span>★</span>
          <span>{isHorizontal ? "1920×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
