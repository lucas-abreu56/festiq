import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SmartArtistName } from "../SmartArtistName";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const RetroPressTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  if (isHorizontal) {
    return (
      <div className="w-full h-full bg-[#F5EBE1] text-[#1C1917] flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden select-none border-8 border-double border-[#1C1917]">
        {/* Moldura Interna Clássica */}
        <div className="absolute inset-2 border border-[#92400E]/40 pointer-events-none" />

        {/* Header Horizontal */}
        <div className="relative z-10 text-center border-b-2 border-[#1C1917] pb-3 pt-1">
          <div className="flex items-center justify-center gap-2 text-xs font-serif italic text-[#7F1D1D] font-bold">
            <span>◆</span>
            <span>{lineup.subtitle}</span>
            <span>◆</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight uppercase leading-tight text-[#1C1917]">
            {lineup.title}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#92400E] mt-1 font-semibold">
            ★ 3 DIAS DE PAZ, AMOR & MÚSICA · EDIÇÃO HISTÓRICA DE COLECIONADOR ★
          </p>
        </div>

        {/* Grid de 3 Colunas Horizontais */}
        <div className="relative z-10 flex-1 grid grid-cols-12 gap-4 py-3 items-start overflow-hidden">
          {/* Coluna 1: Atrações Principais (Headliners) */}
          <div className="col-span-4 border-r border-[#1C1917]/25 pr-4 flex flex-col justify-center h-full text-center">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#7F1D1D] block mb-2 border-b border-[#1C1917]/20 pb-1">
              — ATRAÇÕES PRINCIPAIS —
            </span>
            <div className="space-y-3 py-1">
              {lineup.singleStageHeadliners.map((artist) => (
                <div key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="headliner"
                    horizontal
                    className="font-serif text-[#1C1917]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2: Participações Especiais */}
          <div className="col-span-3 border-r border-[#1C1917]/25 pr-4 flex flex-col justify-center h-full text-center">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#92400E] block mb-2 border-b border-[#1C1917]/20 pb-1">
              — CONVIDADOS ESPECIAIS —
            </span>
            <div className="space-y-1.5 py-1">
              {lineup.singleStageSubHeadliners.map((artist) => (
                <div key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="sub-headliner"
                    horizontal
                    className="font-serif font-bold text-[#7F1D1D]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 3: Undercard Completo */}
          <div className="col-span-5 flex flex-col justify-center h-full text-center pl-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#1C1917]/70 block mb-2 border-b border-[#1C1917]/20 pb-1 font-bold">
              — ELENCO COMPLETO DO FESTIVAL —
            </span>
            <div className="leading-snug">
              {lineup.singleStageUndercard.map((artist, idx) => (
                <React.Fragment key={artist.id}>
                  <SmartArtistName
                    name={artist.name}
                    role="undercard"
                    horizontal
                    className="font-serif text-[#1C1917]/90 font-medium"
                  />
                  {idx < lineup.singleStageUndercard.length - 1 && (
                    <span className="mx-1 text-[#92400E]/70 text-[9px]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé Horizontal */}
        <div className="relative z-10 border-t-2 border-[#1C1917] pt-2 flex items-center justify-between text-[10px] font-mono font-bold text-[#1C1917]/75 uppercase">
          <div>
            <span>IMPRESSÃO TIPOGRÁFICA ORIGINAL</span>
            <span className="mx-1.5">◆</span>
            <span>FESTIQ VINTAGE</span>
          </div>
          <div className="text-right text-[#7F1D1D]">
            <span>FORMATO PANORÂMICO 16:9</span>
            <span className="mx-1">★</span>
            <span>1920×1080 HQ</span>
          </div>
        </div>
      </div>
    );
  }

  // Modo Vertical (9:16)
  return (
    <div className="w-full h-full bg-[#F5EBE1] text-[#1C1917] flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden select-none border-8 border-double border-[#1C1917]">
      {/* Moldura Interna Clássica */}
      <div className="absolute inset-2 border border-[#92400E]/40 pointer-events-none" />

      {/* Header Vintage */}
      <div className="relative z-10 text-center border-b-2 border-[#1C1917] pb-2.5 pt-1">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-serif italic text-[#7F1D1D] mb-0.5 font-bold">
          <span>◆</span>
          <span>{lineup.subtitle}</span>
          <span>◆</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight uppercase leading-tight text-[#1C1917]">
          {lineup.title}
        </h1>
        <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#92400E] mt-0.5 font-semibold">
          <span>★ 3 DIAS DE PAZ, AMOR & MÚSICA ★</span>
        </div>
      </div>

      {/* Lineup Compacto & Calibrado — Tudo Cabe sem Cortes */}
      <div className="relative z-10 flex-1 flex flex-col justify-between py-2 text-center overflow-hidden">
        {/* Headliners de Destaque */}
        <div className="border-b border-[#1C1917]/20 pb-2">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#7F1D1D] block mb-1">
            — ATRAÇÕES PRINCIPAIS —
          </span>
          <div className="space-y-1">
            {lineup.singleStageHeadliners.map((artist) => (
              <div key={artist.id}>
                <SmartArtistName
                  name={artist.name}
                  role="headliner"
                  className="font-serif text-[#1C1917]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Headliners */}
        <div className="border-b border-[#1C1917]/20 py-1.5">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#92400E] block mb-1">
            — PARTICIPAÇÕES ESPECIAIS —
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 px-1">
            {lineup.singleStageSubHeadliners.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <SmartArtistName
                  name={artist.name}
                  role="sub-headliner"
                  className="font-serif font-bold text-[#7F1D1D]"
                />
                {idx < lineup.singleStageSubHeadliners.length - 1 && (
                  <span className="text-[#92400E] font-serif text-xs">◆</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Undercard Completo — Todos os Artistas Visíveis */}
        <div className="pt-1 px-2 leading-tight text-center">
          <span className="text-[8px] font-mono tracking-widest uppercase text-[#1C1917]/60 block mb-1 font-bold">
            E MUITO MAIS
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
            {lineup.singleStageUndercard.map((artist, idx) => (
              <React.Fragment key={artist.id}>
                <SmartArtistName
                  name={artist.name}
                  role="undercard"
                  className="font-serif text-[#1C1917]/85"
                />
                {idx < lineup.singleStageUndercard.length - 1 && (
                  <span className="text-[#92400E]/70 text-[8px]">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé Vintage */}
      <div className="relative z-10 border-t-2 border-[#1C1917] pt-2 flex items-center justify-between text-[9px] font-mono font-bold text-[#1C1917]/75 uppercase">
        <div>
          <span>IMPRESSÃO TIPOGRÁFICA ORIGINAL</span>
          <span className="mx-1">◆</span>
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
