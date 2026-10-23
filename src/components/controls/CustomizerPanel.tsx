"use client";

import React from "react";
import { FestivalThemeId, CreationMode, TimeRange, PosterAspectRatio } from "@/lib/lineup-engine";
import { Sparkles, Music2, Flame, Shuffle, Smartphone, Square } from "lucide-react";
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

const THEMES: { id: FestivalThemeId; name: string; tag: string; bg: string; text: string }[] = [
  {
    id: "lolla",
    name: "Indie Waves",
    tag: "Tributo ao Lollapalooza",
    bg: "bg-gradient-to-r from-[#63CBD8] to-[#E2F018]",
    text: "text-[#0D0D0D]",
  },
  {
    id: "festify",
    name: "Forestfest",
    tag: "Tributo ao Festify",
    bg: "bg-gradient-to-b from-[#FDE05D] to-white",
    text: "text-[#2B6EF2]",
  },
  {
    id: "tropical",
    name: "Planeta Atlântida",
    tag: "Letra 3D + Surf Pop",
    bg: "bg-gradient-to-b from-[#F69FB5] to-[#FCE46E]",
    text: "text-[#141414]",
  },
  {
    id: "retro",
    name: "Impresso '85",
    tag: "Jornal Rock in Rio 85",
    bg: "bg-[#E4D8C1]",
    text: "text-[#1F1C19]",
  },
  {
    id: "c6fest",
    name: "C6 Minimal",
    tag: "Tributo ao C6 Fest",
    bg: "bg-[#000000] ring-1 ring-inset ring-[#E05378]/60",
    text: "text-[#E6D15A]",
  },
  {
    id: "floggnaw",
    name: "Camp Carnival",
    tag: "Tributo ao Flog Gnaw",
    bg: "bg-gradient-to-b from-[#2E0854] via-[#DE5B3E] to-[#FBB040]",
    text: "text-[#FFE600]",
  },
  {
    id: "underground",
    name: "Rage Xerox",
    tag: "Tributo Rap Brutalista",
    bg: "bg-[#0A0A0A] ring-1 ring-inset ring-[#E0E0E0]/30",
    text: "text-[#E0E0E0]",
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
  userName = "MEU",
}) => {
  const quickSuggestions = [
    "FESTIQ STUDIO",
    "C6 FEST",
    "ROCK IN RIO",
    `PLANETA ${userName.toUpperCase()}`,
    `${userName.toUpperCase()}PALOOZA`,
  ];

  return (
    <div className="w-full space-y-6 bg-[#161616] border border-[#2B2B2B] p-6 rounded-2xl shadow-2xl">
      {/* 1. Formato do Pôster (9:16 Stories vs 1:1 Quadrado / Feed) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
            Proporção do Pôster
          </span>
          <span className="text-[11px] font-mono text-[#CEFF00] font-bold">
            {aspectRatio === "9:16"
              ? "Vertical · Stories/Reels (1080×1920)"
              : "Quadrado · Feed/Festify (1080×1080)"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all active:scale-[0.97] ${
              aspectRatio === "9:16"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_8px_20px_rgba(206,255,0,0.25)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Smartphone className={`w-4 h-4 ${aspectRatio === "9:16" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">
                Vertical (9:16)
              </span>
              <span className={`block text-[10px] font-mono ${aspectRatio === "9:16" ? "text-black/75" : "text-[#8A8A8A]"}`}>
                1080 × 1920 px
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAspectRatioChange("1:1")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all active:scale-[0.97] ${
              aspectRatio === "1:1"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_8px_20px_rgba(206,255,0,0.25)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Square className={`w-4 h-4 ${aspectRatio === "1:1" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">
                Quadrado (1:1)
              </span>
              <span className={`block text-[10px] font-mono ${aspectRatio === "1:1" ? "text-black/75" : "text-[#8A8A8A]"}`}>
                1080 × 1080 px
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Nome do Festival */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="festival-name-input"
            className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold"
          >
            Nome do Festival
          </label>
          <div className="flex items-center gap-2">
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
            <span className="text-[10px] font-mono text-[#737373]">
              · Padrão: FESTIQ STUDIO
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            id="festival-name-input"
            type="text"
            value={festivalName}
            maxLength={20}
            onChange={(e) => onFestivalNameChange(e.target.value.slice(0, 20))}
            className="flex-1 bg-[#1E1E1E] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wider text-white placeholder-[#737373] focus:outline-none focus:border-[#CEFF00] transition-colors"
            placeholder="FESTIQ STUDIO (DIGITE PARA ALTERAR)"
          />
          <button
            type="button"
            onClick={onRegenerate}
            title="Sortear nova ordem do lineup"
            className="px-4 bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#CEFF00] hover:text-[#CEFF00] rounded-xl text-[#A3A3A3] transition-all flex items-center justify-center active:scale-[0.97]"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
        {/* Sugestões Rápidas em Estilo Ticket Badge */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickSuggestions.map((sug) => {
            const isDefault = sug === "FESTIQ STUDIO";
            return (
              <button
                key={sug}
                type="button"
                onClick={() => onFestivalNameChange(isDefault ? "" : sug)}
                className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#1E1E1E] border border-[#2B2B2B] rounded-md text-[#A3A3A3] hover:text-[#141414] hover:bg-[#CEFF00] hover:border-[#CEFF00] transition-all active:scale-[0.97]"
              >
                {sug}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Seleção de Tema Visual */}
      <div className="space-y-2.5">
        <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Tema Visual do Festival
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
          {THEMES.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden active:scale-[0.97] ${
                  isSelected
                    ? "border-[#CEFF00] ring-2 ring-[#CEFF00]/40 bg-[#1E1E1E] shadow-xl"
                    : "border-[#2B2B2B] bg-[#1A1A1A] hover:border-[#404040] opacity-85 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-full h-9 rounded-lg ${t.bg} border border-white/10 mb-2 flex items-center justify-center font-display font-black text-xs ${t.text} shadow-inner`}
                >
                  FESTIQ
                </div>
                <span className="font-display font-black text-xs sm:text-sm text-white leading-tight truncate w-full">
                  {t.name}
                </span>
                <span className="text-[10px] font-mono text-[#A3A3A3] line-clamp-1 mt-0.5">
                  {t.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Modo do Lineup & ReactBits OptionWheel */}
      <div className="space-y-2.5">
        <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Algoritmo do Lineup
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("taste")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all active:scale-[0.97] ${
              mode === "taste"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meu Gosto</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("genre")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all active:scale-[0.97] ${
              mode === "genre"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Por Gênero</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("popularity")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all active:scale-[0.97] ${
              mode === "popularity"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] font-black shadow-md"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popularidade</span>
          </button>
        </div>

        {/* Seletor com ReactBits OptionWheel */}
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
      </div>

      {/* 5. Período das Estatísticas */}
      <div className="space-y-2">
        <span className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Período das Estatísticas (Spotify)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onTimeRangeChange("short_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all active:scale-[0.97] ${
              timeRange === "short_term"
                ? "bg-[#282828] border-[#CEFF00] text-[#CEFF00] font-bold"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            4 Semanas
          </button>
          <button
            type="button"
            onClick={() => onTimeRangeChange("medium_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all active:scale-[0.97] ${
              timeRange === "medium_term"
                ? "bg-[#282828] border-[#CEFF00] text-[#CEFF00] font-bold"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            6 Meses
          </button>
          <button
            type="button"
            onClick={() => onTimeRangeChange("long_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all active:scale-[0.97] ${
              timeRange === "long_term"
                ? "bg-[#282828] border-[#CEFF00] text-[#CEFF00] font-bold"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white"
            }`}
          >
            Todo o Tempo
          </button>
        </div>
      </div>
    </div>
  );
};
