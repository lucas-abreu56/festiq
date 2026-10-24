"use client";

import React from "react";
import { FestivalThemeId, CreationMode, TimeRange, PosterAspectRatio } from "@/lib/lineup-engine";
import { Sparkles, Music2, Flame, Shuffle, Smartphone, Square, X } from "lucide-react";
import { OptionWheel } from "@/components/reactbits/OptionWheel";

interface CustomizerPanelProps {
  festivalName: string;
  onFestivalNameChange: (name: string) => void;
  themeId: FestivalThemeId;
  onThemeChange: (theme: FestivalThemeId) => void;
  aspectRatio: PosterAspectRatio;
  onAspectRatioChange: (ratio: PosterAspectRatio) => void;
  mode: CreationMode;
  onModeChange: (mode: CreationMode) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  targetGenre: string;
  onTargetGenreChange: (genre: string) => void;
  onRegenerate: () => void;
  userName?: string;
}

interface ThemeMeta {
  id: FestivalThemeId;
  name: string;
  tag: string;
  artistCount: number;
  previewBg: string;
  renderMiniature: () => React.ReactNode;
}

const THEMES: ThemeMeta[] = [
  {
    id: "lolla",
    name: "Indie Waves",
    tag: "Tributo ao Lollapalooza",
    artistCount: 45,
    previewBg: "bg-gradient-to-r from-[#63CBD8] via-[#63CBD8] to-[#E2F018]",
    renderMiniature: () => (
      <div className="flex items-center gap-1.5 z-10 font-frama font-black italic text-[11px] text-[#0D0D0D]">
        <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
        <span className="tracking-tight uppercase">INDIE WAVES</span>
      </div>
    ),
  },
  {
    id: "festify",
    name: "Forestfest",
    tag: "Tributo ao Festify",
    artistCount: 24,
    previewBg: "bg-gradient-to-b from-[#FDE05D] via-[#FFF194] to-white",
    renderMiniature: () => (
      <div className="flex items-center gap-1.5 z-10 font-sans font-black text-[11px] text-[#2B6EF2]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2B6EF2]" />
        <span className="tracking-wider uppercase">FORESTFEST</span>
      </div>
    ),
  },
  {
    id: "tropical",
    name: "Planeta Atlântida",
    tag: "Letra 3D + Surf Pop",
    artistCount: 34,
    previewBg: "bg-gradient-to-b from-[#F69FB5] via-[#F8BC95] to-[#FCE46E]",
    renderMiniature: () => (
      <div className="flex items-center gap-1.5 z-10 font-sans font-black text-[11px] text-[#141414]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] border border-amber-300 flex-shrink-0" />
        <span className="tracking-tight uppercase">PLANETA</span>
      </div>
    ),
  },
  {
    id: "retro",
    name: "Impresso '85",
    tag: "Jornal Rock in Rio 85",
    artistCount: 45,
    previewBg: "bg-[#E4D8C1]",
    renderMiniature: () => (
      <div className="flex items-center gap-1.5 z-10 font-display font-black text-[11px] text-[#1F1C19] border-y border-[#1F1C19]/40 py-0.5">
        <span className="tracking-widest uppercase">PROGRAMAÇÃO®</span>
      </div>
    ),
  },
  {
    id: "c6fest",
    name: "C6 Minimal",
    tag: "Tributo ao C6 Fest",
    artistCount: 45,
    previewBg: "bg-black ring-1 ring-inset ring-[#E05378]/50",
    renderMiniature: () => (
      <div className="flex items-center gap-1 z-10 font-sans font-medium text-[10px] text-[#E6D15A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E05378]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#62B4D6]" />
        <span className="tracking-widest uppercase ml-1">C6 MINIMAL</span>
      </div>
    ),
  },
  {
    id: "floggnaw",
    name: "Camp Carnival",
    tag: "Tributo ao Flog Gnaw",
    artistCount: 41,
    previewBg: "bg-gradient-to-b from-[#FFAEC8] via-[#FF7433] to-[#EA2A00]",
    renderMiniature: () => (
      <div className="flex items-center gap-1.5 z-10 font-display font-black text-[11px] text-[#E2F6FE] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        <span className="w-2 h-2 rounded-full bg-pink-100" />
        <span className="tracking-wider uppercase">CARNIVAL</span>
      </div>
    ),
  },
];

const GENRES = ["rock", "pop", "indie", "hip hop", "electronic", "sertanejo", "mpb", "reggae", "metal"];

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  festivalName,
  onFestivalNameChange,
  themeId,
  onThemeChange,
  aspectRatio,
  onAspectRatioChange,
  mode,
  onModeChange,
  timeRange,
  onTimeRangeChange,
  targetGenre,
  onTargetGenreChange,
  onRegenerate,
}) => {
  const quickSuggestions = [
    "FESTIQ STUDIO",
    "FESTIQ PALOOZA",
    "PLANETA FESTIQ",
    "FESTIQ FOREST",
    "FESTIQ '85",
    "FESTIQ CARNIVAL",
  ];

  const activeEffectiveName = (festivalName.trim() || "FESTIQ STUDIO").toUpperCase();

  return (
    <div className="w-full space-y-6 bg-[#161616] border border-[#2B2B2B] p-4 sm:p-6 rounded-2xl shadow-2xl">
      {/* 01 · TEMA VISUAL DO FESTIVAL (Grade 2x3 no Mobile, 3x2 no Tablet e Desktop, Sem Truncamento) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
            01 · Tema Visual do Festival
          </span>
          <span className="text-[11px] font-mono text-[#CEFF00] font-bold">
            6 Estilos Oficiais
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {THEMES.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                className={`group flex flex-col items-start p-2.5 sm:p-3 rounded-xl border text-left transition-all relative overflow-hidden active:scale-[0.98] ${
                  isSelected
                    ? "border-[#CEFF00] ring-2 ring-[#CEFF00]/40 bg-[#1E1E1E] shadow-xl"
                    : "border-[#2B2B2B] bg-[#181818] hover:border-[#404040] hover:bg-[#1C1C1C]"
                }`}
              >
                {/* Miniatura Gráfica Autoral do Tema */}
                <div
                  className={`w-full h-11 sm:h-12 rounded-lg relative overflow-hidden mb-2 border border-white/10 shadow-inner flex items-center justify-between px-2.5 ${t.previewBg}`}
                >
                  {t.renderMiniature()}
                  <span className="relative z-10 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono font-bold text-[#CEFF00] border border-white/10 shadow-sm flex-shrink-0">
                    {t.artistCount} ART
                  </span>
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#CEFF00] shadow-[0_0_8px_#CEFF00]" />
                  )}
                </div>

                {/* Nome do Tema (Zero Truncate) */}
                <span className="font-display font-black text-xs sm:text-sm text-white leading-tight block w-full">
                  {t.name}
                </span>
                {/* Descrição do Tema (Zero Truncate) */}
                <span className="text-[10px] font-mono text-[#A3A3A3] leading-snug mt-0.5 block w-full">
                  {t.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 02 · NOME DO FESTIVAL & PRESETS (Input com Botão Limpar e Presets com Estado Ativo) */}
      <div className="space-y-2.5 pt-2 border-t border-[#262626]">
        <div className="flex items-center justify-between">
          <label
            htmlFor="festival-name-input"
            className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold"
          >
            02 · Nome do Festival
          </label>
          <span
            className={`text-[11px] font-mono font-bold ${
              festivalName.length >= 20
                ? "text-[#FF3EBA]"
                : festivalName.length >= 16
                ? "text-[#CEFF00]"
                : "text-[#A3A3A3]"
            }`}
          >
            {festivalName.length}/20
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            id="festival-name-input"
            type="text"
            value={festivalName}
            maxLength={20}
            onChange={(e) => onFestivalNameChange(e.target.value.slice(0, 20))}
            className="w-full bg-[#1E1E1E] border border-[#2B2B2B] rounded-xl pl-4 pr-10 py-3 text-sm font-display font-bold uppercase tracking-wider text-white placeholder-[#737373] focus:outline-none focus:border-[#CEFF00] transition-colors"
            placeholder="FESTIQ STUDIO (PADRÃO)"
          />
          {festivalName.length > 0 && (
            <button
              type="button"
              onClick={() => onFestivalNameChange("")}
              title="Restaurar padrão FESTIQ STUDIO"
              className="absolute right-3 p-1 rounded-md text-[#737373] hover:text-white hover:bg-[#2B2B2B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sugestões Rápidas em Estilo Ticket Badge com Estado Ativo Real */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
          {quickSuggestions.map((sug) => {
            const isDefault = sug === "FESTIQ STUDIO";
            const isActive = activeEffectiveName === sug;

            return (
              <button
                key={sug}
                type="button"
                onClick={() => onFestivalNameChange(isDefault ? "" : sug)}
                className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-md border transition-all active:scale-[0.97] ${
                  isActive
                    ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-[0_2px_10px_rgba(206,255,0,0.25)]"
                    : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
                }`}
              >
                {sug}
              </button>
            );
          })}
        </div>
      </div>

      {/* 03 · PROPORÇÃO DO PÔSTER (Sem quebra de 'px' órfão no Mobile) */}
      <div className="space-y-2.5 pt-2 border-t border-[#262626]">
        <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          03 · Proporção do Pôster
        </span>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex items-center justify-center gap-2 sm:gap-2.5 py-3 px-2.5 sm:px-4 rounded-xl border transition-all active:scale-[0.97] ${
              aspectRatio === "9:16"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_8px_20px_rgba(206,255,0,0.25)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Smartphone className={`w-4 h-4 flex-shrink-0 ${aspectRatio === "9:16" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap">
                Vertical (9:16)
              </span>
              <span className={`block text-[10px] font-mono whitespace-nowrap ${aspectRatio === "9:16" ? "text-black/80 font-bold" : "text-[#8A8A8A]"}`}>
                Stories e Reels · 1080×1920
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAspectRatioChange("1:1")}
            className={`flex items-center justify-center gap-2 sm:gap-2.5 py-3 px-2.5 sm:px-4 rounded-xl border transition-all active:scale-[0.97] ${
              aspectRatio === "1:1"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_8px_20px_rgba(206,255,0,0.25)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Square className={`w-4 h-4 flex-shrink-0 ${aspectRatio === "1:1" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap">
                Quadrado (1:1)
              </span>
              <span className={`block text-[10px] font-mono whitespace-nowrap ${aspectRatio === "1:1" ? "text-black/80 font-bold" : "text-[#8A8A8A]"}`}>
                Feed e Posts · 1080×1080
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 04 · CRITÉRIO DO LINEUP & PERÍODO MUSICAL (Com Botão Embaralhar Artistas Integrado) */}
      <div className="space-y-2.5 pt-2 border-t border-[#262626]">
        <div className="flex items-center justify-between">
          <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
            04 · Critério do Lineup
          </span>
          <button
            type="button"
            onClick={onRegenerate}
            aria-label="Embaralhar Artistas"
            title="Embaralhar ordem dos artistas do festival"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#CEFF00] hover:text-[#CEFF00] text-[10px] font-mono text-[#A3A3A3] transition-all active:scale-[0.97]"
          >
            <Shuffle className="w-3 h-3 text-[#CEFF00]" />
            <span>Embaralhar Artistas</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("taste")}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
              mode === "taste"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Meu Gosto</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("genre")}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
              mode === "genre"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Music2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Por Gênero</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("popularity")}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
              mode === "popularity"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Popularidade</span>
          </button>
        </div>

        {/* Seletor com ReactBits OptionWheel em Grade Flexível */}
        {mode === "genre" && (
          <div className="pt-2">
            <span className="block text-[11px] font-mono text-[#A3A3A3] mb-1 font-semibold uppercase">
              Gênero Musical Principal:
            </span>
            <OptionWheel
              options={GENRES}
              selected={targetGenre}
              onSelect={onTargetGenreChange}
            />
          </div>
        )}

        {/* Período Musical */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
            Período Musical (Spotify)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onTimeRangeChange("short_term")}
              className={`py-2 px-1 sm:px-2 text-center rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
                timeRange === "short_term"
                  ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-md font-black"
                  : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
              }`}
            >
              4 Semanas
            </button>
            <button
              type="button"
              onClick={() => onTimeRangeChange("medium_term")}
              className={`py-2 px-1 sm:px-2 text-center rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
                timeRange === "medium_term"
                  ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-md font-black"
                  : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
              }`}
            >
              6 Meses
            </button>
            <button
              type="button"
              onClick={() => onTimeRangeChange("long_term")}
              className={`py-2 px-1 sm:px-2 text-center rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-[0.97] ${
                timeRange === "long_term"
                  ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-md font-black"
                  : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
              }`}
            >
              Todo o Tempo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
