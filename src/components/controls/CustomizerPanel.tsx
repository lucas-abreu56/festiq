"use client";

import React from "react";
import { FestivalThemeId, CreationMode, TimeRange, PosterAspectRatio } from "@/lib/lineup-engine";
import { Sparkles, Music2, Flame, Shuffle, Smartphone, Monitor } from "lucide-react";
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

const THEMES: { id: FestivalThemeId; name: string; tag: string; bg: string; text: string; badge: string }[] = [
  { id: "lolla", name: "Indie Waves", tag: "Tributo ao Lollapalooza", bg: "bg-[#FFE800]", text: "text-black", badge: "bg-[#00E5FF] text-black" },
  { id: "rock", name: "Stadium Rock", tag: "Tributo ao Rock in Rio", bg: "bg-[#0B0D14]", text: "text-white", badge: "bg-[#ED1C24] text-white" },
  { id: "tropical", name: "Planeta Verão", tag: "Tributo ao Planeta", bg: "bg-[#0B192C]", text: "text-white", badge: "bg-[#FFE600] text-black" },
  { id: "retro", name: "Imprensa Retrô", tag: "Prensa Tipográfica 70s", bg: "bg-[#F5EBE1]", text: "text-[#1C1917]", badge: "bg-[#7F1D1D] text-white" },
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
    `${userName.toUpperCase()}PALOOZA`,
    `FESTIQ IN RIO`,
    `PLANETA ${userName.toUpperCase()}`,
    `${userName.toUpperCase()} SESSIONS`,
  ];

  return (
    <div className="w-full space-y-6 bg-[#161616] border border-[#2B2B2B] p-6 rounded-2xl shadow-2xl">
      {/* 1. Formato do Pôster (9:16 Stories vs 16:9 Panorâmico) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
            Formato de Exportação
          </span>
          <span className="text-[11px] font-mono text-[#CEFF00] font-bold">
            {aspectRatio === "9:16" ? "Vertical (Stories/Reels 1080×1920)" : "Horizontal (Banner 1920×1080)"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all ${
              aspectRatio === "9:16"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_0_20px_rgba(206,255,0,0.3)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Smartphone className={`w-4 h-4 ${aspectRatio === "9:16" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">Vertical (9:16)</span>
              <span className={`block text-[10px] font-mono ${aspectRatio === "9:16" ? "text-black/70" : "text-[#737373]"}`}>
                1080 × 1920 px
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAspectRatioChange("16:9")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all ${
              aspectRatio === "16:9"
                ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_0_20px_rgba(206,255,0,0.3)] font-black"
                : "bg-[#1E1E1E] border-[#2B2B2B] text-[#A3A3A3] hover:text-white hover:border-[#404040]"
            }`}
          >
            <Monitor className={`w-4 h-4 ${aspectRatio === "16:9" ? "text-[#141414]" : "text-[#CEFF00]"}`} />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">Horizontal (16:9)</span>
              <span className={`block text-[10px] font-mono ${aspectRatio === "16:9" ? "text-black/70" : "text-[#737373]"}`}>
                1920 × 1080 px
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Nome do Festival */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Nome do Festival
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={festivalName}
            maxLength={32}
            onChange={(e) => onFestivalNameChange(e.target.value)}
            className="flex-1 bg-[#1E1E1E] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wider text-white placeholder-[#525252] focus:outline-none focus:border-[#CEFF00] transition-colors"
            placeholder="NOME DO SEU FESTIVAL"
          />
          <button
            type="button"
            onClick={onRegenerate}
            title="Sortear nova ordem do lineup"
            className="px-4 bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#CEFF00] hover:text-[#CEFF00] rounded-xl text-[#A3A3A3] transition-all flex items-center justify-center active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
        {/* Sugestões Rápidas em Estilo Ticket Badge */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickSuggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onFestivalNameChange(sug)}
              className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#1E1E1E] border border-[#2B2B2B] rounded-md text-[#A3A3A3] hover:text-[#141414] hover:bg-[#CEFF00] hover:border-[#CEFF00] transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Seleção de Tema Visual */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Tema Visual do Festival
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-[#CEFF00] ring-2 ring-[#CEFF00]/40 bg-[#1E1E1E] scale-[1.02] shadow-xl"
                    : "border-[#2B2B2B] bg-[#1A1A1A] hover:border-[#404040] opacity-80 hover:opacity-100"
                }`}
              >
                <div className={`w-full h-10 rounded-lg ${t.bg} border border-white/10 mb-2 flex items-center justify-center font-display font-black text-xs ${t.text} shadow-inner`}>
                  FESTIQ
                </div>
                <span className="font-display font-black text-sm text-white leading-tight">
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
        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Algoritmo do Lineup
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("taste")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
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
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
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
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
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
        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] font-bold">
          Período das Estatísticas (Spotify)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onTimeRangeChange("short_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
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
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
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
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
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
