import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RetroPressTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Divisão em 4 níveis tipográficos densos para eliminar espaços vazios entre seções
  const tier1Headliners = allArtists.slice(0, 3);
  const tier2CoHeadliners = allArtists.slice(3, 9);
  const tier3Featured = allArtists.slice(9, 21);
  const tier4Undercard = allArtists.slice(21, 45);

  return (
    <div
      className={`w-full h-full bg-[#F5EBE1] text-[#1C1917] flex flex-col justify-between relative overflow-hidden select-none border-8 border-double border-[#1C1917] ${
        isSquare ? "p-3.5 sm:p-4" : "p-4 sm:p-5"
      }`}
    >
      {/* Moldura Interna Clássica */}
      <div className="absolute inset-2 border border-[#92400E]/45 pointer-events-none" />

      {/* 1. Cabeçalho Tipográfico Vintage */}
      <div
        className={`relative z-10 text-center border-b-2 border-[#1C1917] ${
          isSquare ? "pb-1 pt-0.5" : "pb-2 pt-0.5"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] font-serif italic text-[#7F1D1D] font-bold">
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
        <div className="flex items-center justify-center gap-2 font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-[#92400E] mt-0.5 font-bold">
          <span>3 DIAS DE MÚSICA AO VIVO · EDIÇÃO ESPECIAL DE COLECIONADOR</span>
        </div>
      </div>

      {/* 2. Corpo do Cartaz — Sem Buracos Vazios: Preenchimento Tipográfico Denso de Prensa */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-evenly text-center overflow-hidden ${
          isSquare ? "py-1 gap-1" : "py-1.5 gap-1.5"
        }`}
      >
        {/* Nível 1: Headliners Supremos (Adaptativo para nomes curtos como SZA e longos como Red Hot) */}
        <div className={`border-b-2 border-[#1C1917]/25 ${isSquare ? "pb-1" : "pb-2"}`}>
          <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.2em] uppercase font-bold text-[#7F1D1D] block mb-0.5">
            — ATRAÇÕES PRINCIPAIS —
          </span>
          <div className={isSquare ? "space-y-0.5" : "space-y-1"}>
            {tier1Headliners.map((artist) => {
              const isShort = artist.name.length <= 8;
              const isVeryLong = artist.name.length > 20;
              return (
                <div key={artist.id} className="leading-none">
                  <span
                    className={`block font-serif font-black uppercase text-[#1C1917] ${
                      isSquare
                        ? isShort
                          ? "text-lg sm:text-xl tracking-widest"
                          : isVeryLong
                          ? "text-sm sm:text-base tracking-tight"
                          : "text-base sm:text-lg tracking-wide"
                        : isShort
                        ? "text-2xl sm:text-3xl tracking-widest"
                        : isVeryLong
                        ? "text-lg sm:text-xl tracking-tight"
                        : "text-xl sm:text-2xl tracking-wide"
                    }`}
                    style={{ lineHeight: "1.02" }}
                  >
                    {artist.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nível 2: Co-Headliners em Carmim de Imprensa */}
        <div className={`border-b border-[#1C1917]/20 ${isSquare ? "py-0.5" : "py-1.5"}`}>
          <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.18em] uppercase font-bold text-[#92400E] block mb-0.5">
            — CONVIDADOS DE HONRA —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 px-1">
            {tier2CoHeadliners.map((artist, idx) => {
              const isShort = artist.name.length <= 6;
              return (
                <React.Fragment key={artist.id}>
                  <span
                    className={`font-serif font-black uppercase text-[#7F1D1D] ${
                      isSquare
                        ? isShort
                          ? "text-[10.5px] sm:text-xs tracking-wider"
                          : "text-[9.5px] sm:text-[11px] tracking-tight"
                        : isShort
                        ? "text-sm sm:text-base tracking-wider"
                        : "text-xs sm:text-sm tracking-tight"
                    }`}
                    style={{ lineHeight: "1.1" }}
                  >
                    {artist.name}
                  </span>
                  {idx < tier2CoHeadliners.length - 1 && (
                    <span className="text-[#92400E] font-serif text-[8px] sm:text-[9px]">
                      ◆
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Nível 3: Destaques Especiais */}
        <div className={`border-b border-[#1C1917]/20 ${isSquare ? "py-0.5" : "py-1.5"}`}>
          <span className="text-[6.5px] sm:text-[7.5px] font-mono tracking-[0.16em] uppercase font-bold text-[#1C1917]/70 block mb-0.5">
            — SESSÕES ESPECIAIS —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 px-1">
            {tier3Featured.map((artist, idx) => {
              const isShort = artist.name.length <= 6;
              return (
                <React.Fragment key={artist.id}>
                  <span
                    className={`font-serif font-bold uppercase text-[#1C1917] ${
                      isSquare
                        ? isShort
                          ? "text-[9px] sm:text-[10px] tracking-wider"
                          : "text-[8px] sm:text-[9px] tracking-normal"
                        : isShort
                        ? "text-[11.5px] sm:text-xs tracking-wider"
                        : "text-[10.5px] sm:text-[11.5px] tracking-normal"
                    }`}
                    style={{ lineHeight: "1.12" }}
                  >
                    {artist.name}
                  </span>
                  {idx < tier3Featured.length - 1 && (
                    <span className="text-[#7F1D1D] font-serif text-[7px] sm:text-[8px]">
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Nível 4: Elenco Completo (24 Artistas Restantes com Corpo Legível e Compacto) */}
        <div className="px-1 text-center">
          <span className="text-[6.5px] sm:text-[7.5px] font-mono tracking-[0.16em] uppercase text-[#92400E] block mb-0.5 font-bold">
            — ELENCO COMPLETO DO FESTIVAL —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
            {tier4Undercard.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <span
                  className={`font-serif font-semibold uppercase text-[#1C1917]/90 ${
                    isSquare
                      ? "text-[7.5px] sm:text-[8.5px]"
                      : "text-[9.5px] sm:text-[10.5px]"
                  }`}
                  style={{ lineHeight: "1.15" }}
                >
                  {artist.name}
                </span>
                {idx < tier4Undercard.length - 1 && (
                  <span className="text-[#92400E]/80 text-[7px]">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Rodapé Vintage */}
      <div className="relative z-10 border-t-2 border-[#1C1917] pt-1.5 flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-mono font-bold text-[#1C1917]/80 uppercase">
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
