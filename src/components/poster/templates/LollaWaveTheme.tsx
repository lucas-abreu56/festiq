import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const LollaWaveTheme: React.FC<ThemeProps> = ({ lineup }) => {
  return (
    <div className="w-full h-full bg-[#FFE800] text-[#0D0D0D] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none">
      {/* Elementos Gráficos de Fundo — Faixas Onduladas */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00E5FF] rounded-full blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-[#D2F800] rounded-full blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-[#FF0055] rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Header do Festival */}
      <div className="relative z-10 text-center border-b-4 border-black pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE800] rounded-full font-mono text-xs uppercase tracking-widest font-black mb-2 shadow-sm">
          <span>✦</span>
          <span>{lineup.subtitle}</span>
          <span>✦</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none text-black drop-shadow-[2px_2px_0px_#00E5FF]">
          {lineup.title}
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-black/70 mt-1 font-bold">
          AUTÓDROMO DE INTERLAGOS · SÃO PAULO · BRASIL
        </p>
      </div>

      {/* Grade de 3 Dias do Festival */}
      <div className="relative z-10 flex-1 flex flex-col justify-around py-4 gap-4">
        {lineup.days.map((day, idx) => {
          const badgeBg =
            idx === 0
              ? "bg-[#FF0055] text-white"
              : idx === 1
              ? "bg-[#00E5FF] text-black"
              : "bg-[#D2F800] text-black";

          return (
            <div
              key={day.dayLabel}
              className="border-2 border-black/80 rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-[4px_4px_0px_#000000] flex flex-col justify-between"
            >
              {/* Badge do Dia */}
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-black uppercase tracking-wider ${badgeBg}`}>
                  {day.dayLabel}
                </span>
                <span className="font-mono text-xs font-bold text-black/60">
                  {day.dateLabel}
                </span>
              </div>

              {/* Headliner */}
              <div className="py-1">
                <SmartArtistName
                  name={day.headliner.name}
                  role="headliner"
                  className="text-black"
                />
              </div>

              {/* Co-Headliners */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1 text-black/90">
                {day.coHeadliners.map((artist, cIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="sub-headliner"
                      className="text-black/90 font-black"
                    />
                    {cIdx < day.coHeadliners.length - 1 && (
                      <span className="text-black/40 font-black">✦</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Undercard em Linha Contínua */}
              <div className="text-black/75 pt-1 line-clamp-2 leading-relaxed">
                {day.undercard.map((artist, uIdx) => (
                  <React.Fragment key={artist.id}>
                    <SmartArtistName
                      name={artist.name}
                      role="undercard"
                      className="text-black/70 font-semibold"
                    />
                    {uIdx < day.undercard.length - 1 && (
                      <span className="mx-1 text-black/30 font-bold">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Estilizado */}
      <div className="relative z-10 border-t-4 border-black pt-3 flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-black/70 uppercase">
        <div className="flex items-center gap-2">
          <span className="font-black text-black">FESTIQ.APP</span>
          <span>//</span>
          <span>YOUR TASTE. YOUR FESTIVAL.</span>
        </div>
        <div className="flex items-center gap-1 text-black/50">
          <span>NO APPS NEEDED</span>
          <span>★</span>
          <span>9:16 1080×1920</span>
        </div>
      </div>
    </div>
  );
};
