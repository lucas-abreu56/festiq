import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const TropicalTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  return (
    <div
      className={`w-full h-full bg-gradient-to-b from-[#0B192C] via-[#023E8A] to-[#0077B6] text-white flex flex-col justify-between relative overflow-hidden select-none border-4 border-[#00E5FF] ${
        isSquare ? "p-3.5 sm:p-4" : "p-4 sm:p-6"
      }`}
    >
      {/* Ondas Solares & Atmosfera Litorânea do Planeta */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#FFE600] rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-[#FF2E63] rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#03071E] via-[#0B192C]/80 to-transparent pointer-events-none" />

      {/* Header Planeta Atlântida */}
      <div
        className={`relative z-10 text-center border-b border-[#00E5FF]/40 ${
          isSquare ? "pb-1.5" : "pb-2"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#FFE600] text-[#0B192C] rounded-full font-mono text-[8px] sm:text-[9px] uppercase tracking-widest font-black mb-0.5 shadow-sm">
          <span>{lineup.subtitle}</span>
        </div>
        <h1
          className={`font-display font-black tracking-tight uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,229,255,0.4)] text-white ${
            isSquare ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
          }`}
        >
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-2 font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-widest text-[#00E5FF] mt-0.5 font-bold">
          <span>PALCO PLANETA & PALCO ATLÂNTIDA</span>
          <span>·</span>
          <span className="text-[#FFE600]">PRAIA DE ATLÂNTIDA</span>
        </div>
      </div>

      {/* Lineup Solar: 3 Dias Completos (45 Artistas Visíveis Sem Cortes) */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-between overflow-hidden ${
          isSquare ? "py-1.5 gap-1.5" : "py-2 gap-2"
        }`}
      >
        {lineup.days.map((day, idx) => {
          const accentColor =
            idx === 0
              ? "text-[#FFE600]"
              : idx === 1
              ? "text-[#00E5FF]"
              : "text-[#FF7597]";
          const badgeBg =
            idx === 0
              ? "bg-[#FFE600] text-[#0B192C]"
              : idx === 1
              ? "bg-[#00E5FF] text-[#0B192C]"
              : "bg-[#FF2E63] text-white";

          return (
            <div
              key={day.dayLabel}
              className={`bg-[#071324]/70 rounded-xl border border-white/15 flex flex-col justify-between ${
                isSquare ? "px-3 py-1.5" : "px-3.5 py-2.5"
              }`}
            >
              {/* Topo do Dia + Headliner + Co-Headliners */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[7.5px] sm:text-[8.5px] font-mono font-black uppercase tracking-wider ${badgeBg}`}
                >
                  {day.dayLabel} · {day.dateLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  {day.coHeadliners.map((artist, cIdx) => (
                    <React.Fragment key={artist.id}>
                      <span
                        className={`font-display font-bold uppercase tracking-tight ${accentColor} ${
                          isSquare
                            ? "text-[9.5px] sm:text-[10.5px]"
                            : "text-[11px] sm:text-xs"
                        }`}
                      >
                        {artist.name}
                      </span>
                      {cIdx < day.coHeadliners.length - 1 && (
                        <span className="text-white/40 text-[8px]">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Headliner Principal do Dia */}
              <div className={isSquare ? "py-0.5 text-center" : "py-1 text-center"}>
                <span
                  className={`block font-display font-black uppercase tracking-tight text-white leading-none ${
                    isSquare ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
                  }`}
                >
                  {day.headliner.name}
                </span>
              </div>

              {/* Undercard Completo do Dia (12 Artistas por Dia = 36 no Undercard) */}
              <div className="text-center leading-tight pt-0.5 border-t border-white/10">
                <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
                  {day.undercard.map((artist, uIdx) => (
                    <React.Fragment key={artist.id}>
                      <span
                        className={`font-sans font-semibold uppercase tracking-wide text-white/90 ${
                          isSquare
                            ? "text-[7px] sm:text-[8px]"
                            : "text-[8px] sm:text-[9px]"
                        }`}
                      >
                        {artist.name}
                      </span>
                      {uIdx < day.undercard.length - 1 && (
                        <span className="text-[#FFE600]/70 text-[7px]">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Planeta Atlântida */}
      <div className="relative z-10 border-t border-[#00E5FF]/40 pt-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono font-bold text-white/80 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="text-[#FFE600] font-black">PLANETA FESTIQ</span>
          <span>·</span>
          <span>ATLÂNTIDA RS</span>
        </div>
        <div className="flex items-center gap-1 text-[#00E5FF]">
          <span>{isSquare ? "1:1 FEED" : "9:16 STORIES"}</span>
          <span>·</span>
          <span>{isSquare ? "1080×1080" : "1080×1920"}</span>
        </div>
      </div>
    </div>
  );
};
