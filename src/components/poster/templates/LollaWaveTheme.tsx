import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";

interface ThemeProps {
  lineup: FestivalLineup;
}

export const LollaWaveTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isHorizontal = lineup.aspectRatio === "16:9";

  // No cartaz oficial real do Lolla, os 10 primeiros são os Headliners principais da coluna esquerda
  const allArtists = [
    ...lineup.singleStageHeadliners,
    ...lineup.singleStageSubHeadliners,
    ...lineup.singleStageUndercard,
  ];

  const headliners = allArtists.slice(0, 10);
  const undercard = allArtists.slice(10); // Todos os demais ~35 artistas

  // Divide o undercard em linhas com 3 ou 4 artistas cada para recriar a grade oficial
  const undercardChunks: (typeof undercard)[] = [];
  const chunkSize = isHorizontal ? 5 : 3;
  for (let i = 0; i < undercard.length; i += chunkSize) {
    undercardChunks.push(undercard.slice(i, i + chunkSize));
  }

  return (
    <div className="w-full h-full bg-[#E51B24] text-black flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Fundo Gráfico Oficial: Textura Graffiti Vermelha + Onda Ciano à Esquerda + Campo Amarelo à Direita */}
      <div className="absolute inset-0 bg-[#E51B24] pointer-events-none">
        {/* Padrão de doodles / flores de fundo */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px]" />
      </div>

      {/* Camada Dividida: Onda Ciano na Esquerda + Campo Amarelo na Direita */}
      <div className="absolute inset-0 flex pointer-events-none">
        {/* Metade Esquerda com Curva Orgânica Ciano */}
        <div
          className="h-full bg-[#00E5FF] transition-all relative"
          style={{
            width: isHorizontal ? "38%" : "44%",
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
          }}
        >
          {/* Ondas / Espirais Estilizadas do Lolla */}
          <div className="absolute -top-12 -left-12 w-64 h-64 border-[12px] border-[#00B4D8]/30 rounded-full pointer-events-none" />
          <div className="absolute top-1/3 -left-8 w-48 h-48 border-[8px] border-[#00B4D8]/30 rounded-full pointer-events-none" />
        </div>

        {/* Metade Direita: Campo Amarelo Vibrante Oficial */}
        <div className="flex-1 h-full bg-[#FFE800]" />
      </div>

      {/* 2. Topo Oficial do Pôster */}
      <div className="relative z-10 p-4 sm:p-6 flex items-start justify-between">
        {/* Info de Data e Local (Canto Superior Esquerdo) */}
        <div className="max-w-[45%] text-[#0D0D0D]">
          <p className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
            OUTUBRO 24, 25 E 26 DE 2026
          </p>
          <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-tight text-black/80 leading-tight mt-0.5">
            AUTÓDROMO DE INTERLAGOS · SÃO PAULO, BR
          </p>
        </div>

        {/* Logo Estilo Oficial Lollapalooza em Caixas Pretas com Contorno Branco */}
        <div className="text-right">
          <div className="inline-block bg-black px-3 py-1.5 rounded-lg border-2 border-white shadow-[3px_3px_0px_#000000]">
            <span className="font-display font-black text-xl sm:text-2xl uppercase tracking-tighter text-white block leading-none">
              {lineup.title}
            </span>
          </div>
          <span className="block font-mono text-[8px] font-black uppercase tracking-widest text-black mt-1">
            BRASIL · LINEUP OFICIAL
          </span>
        </div>
      </div>

      {/* 3. Área Central: Headliners à Esquerda & Undercard à Direita (Composição Fiel da Imagem 2) */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 grid grid-cols-12 gap-3 items-stretch overflow-hidden">
        {/* COLUNA ESQUERDA: OS 10 HEADLINERS (Sobre o fundo Ciano) */}
        <div
          className={`flex flex-col justify-around py-1 ${
            isHorizontal ? "col-span-4 pr-3" : "col-span-5 pr-2"
          }`}
        >
          {headliners.map((artist, idx) => {
            const isTop3 = idx < 3;
            const isMid = idx >= 3 && idx < 6;

            return (
              <div key={artist.id} className="leading-none my-0.5">
                <span
                  className={`block font-display font-black uppercase tracking-tighter text-[#0D0D0D] transition-transform hover:scale-105 origin-left ${
                    isTop3
                      ? "text-lg sm:text-xl md:text-2xl"
                      : isMid
                      ? "text-sm sm:text-base md:text-lg"
                      : "text-xs sm:text-sm md:text-base"
                  }`}
                  style={{
                    lineHeight: "0.92",
                    textShadow: "1px 1px 0px rgba(255,255,255,0.4)",
                  }}
                >
                  {artist.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA: O ELENCO COMPLETO DO UNDERCARD (Sobre o fundo Amarelo) */}
        <div
          className={`flex flex-col justify-around py-1 text-left ${
            isHorizontal ? "col-span-8 pl-3" : "col-span-7 pl-1"
          }`}
        >
          <div className="space-y-1 sm:space-y-1.5">
            {undercardChunks.map((chunk, rowIdx) => (
              <div
                key={rowIdx}
                className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-none"
              >
                {chunk.map((artist, aIdx) => (
                  <React.Fragment key={artist.id}>
                    <span className="font-display font-black uppercase tracking-tight text-[#0D0D0D] text-[10px] sm:text-[11px] md:text-xs hover:text-[#E51B24] transition-colors">
                      {artist.name}
                    </span>
                    {aIdx < chunk.length - 1 && (
                      <span className="text-[#00B4D8] font-black text-[8px] sm:text-[9px]">
                        •
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Rodapé Oficial: Silhueta de Multidão com Mãos ao Alto & Banner de Patrocinadores */}
      <div className="relative z-10 mt-auto">
        {/* Silhueta da Multidão */}
        <div className="w-full h-10 sm:h-12 bg-black relative flex items-end justify-center overflow-hidden">
          {/* Gráfico SVG de Braços Levantados em Sinal de Rock */}
          <svg
            className="w-full h-full text-black fill-current absolute -top-4 inset-x-0"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
          >
            <path d="M0 120 L0 50 Q 80 20, 150 60 Q 220 100, 300 40 Q 380 0, 450 50 Q 550 90, 650 30 Q 750 0, 850 40 Q 920 80, 1000 50 L1000 120 Z" />
          </svg>
          <div className="relative z-10 pb-1 flex items-center justify-center gap-3 text-[9px] font-mono font-bold text-white/90 uppercase tracking-widest">
            <span>🤘 FESTIQ LIVE STAGE 🤘</span>
          </div>
        </div>

        {/* Faixa de Patrocinadores e Metadados do Festival */}
        <div className="bg-[#141414] py-1.5 px-4 flex flex-wrap items-center justify-between border-t border-white/20 text-[8px] sm:text-[9px] font-mono text-white/80 uppercase">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white text-black font-black">
              FESTIQ
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1DB954] text-black font-black">
              SPOTIFY
            </span>
            <span className="hidden sm:inline">LIVE NATION TRIBUTE</span>
          </div>
          <div className="text-right text-white/60 font-semibold">
            <span>{isHorizontal ? "1920 × 1080 PX" : "1080 × 1920 PX"}</span>
            <span className="mx-1">★</span>
            <span>45+ ATRAÇÕES 100% VISÍVEIS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
