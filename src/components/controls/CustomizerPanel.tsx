"use client";

import React from "react";
import { FestivalThemeId, CreationMode, TimeRange, PosterAspectRatio } from "@/lib/lineup-engine";
import { Sparkles, Music2, Flame, Shuffle, Smartphone, Monitor } from "lucide-react";

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

const THEMES: { id: FestivalThemeId; name: string; tag: string; bg: string; text: string; accent: string }[] = [
  { id: "lolla", name: "Indie Waves", tag: "Tributo ao Lollapalooza", bg: "bg-[#FFE800]", text: "text-black", accent: "#00E5FF" },
  { id: "rock", name: "Stadium Rock", tag: "Tributo ao Rock in Rio", bg: "bg-[#090D16]", text: "text-white", accent: "#29B6F6" },
  { id: "tropical", name: "Planeta Tropical", tag: "Tributo ao Planeta", bg: "bg-[#00A896]", text: "text-white", accent: "#FF6B6B" },
  { id: "retro", name: "Festival Retrô", tag: "Prensa Tipográfica 60s/70s", bg: "bg-[#F5EBE1]", text: "text-[#1C1917]", accent: "#7F1D1D" },
];

const GENRES = ["rock", "pop", "indie", "hip hop", "electronic", "sertanejo", "mpb"];

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
    <div className="w-full space-y-6 bg-[#0E121D]/90 border border-[#1E2638] p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
      {/* 1. Formato do Pôster (9:16 Stories vs 16:9 Panorâmico) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
            Formato do Pôster
          </span>
          <span className="text-[11px] font-mono text-[#1DB954] font-semibold">
            {aspectRatio === "9:16" ? "Vertical (Stories/Reels)" : "Horizontal (Banner/Feed)"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all ${
              aspectRatio === "9:16"
                ? "bg-[#1DB954]/15 border-[#1DB954] text-white ring-1 ring-[#1DB954]/40 shadow-lg"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white hover:border-brand-muted/40"
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#1DB954]" />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">Vertical (9:16)</span>
              <span className="block text-[10px] font-mono text-brand-muted">1080 × 1920 px</span>
            </div>
          </button>

          <button
            onClick={() => onAspectRatioChange("16:9")}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border transition-all ${
              aspectRatio === "16:9"
                ? "bg-[#1DB954]/15 border-[#1DB954] text-white ring-1 ring-[#1DB954]/40 shadow-lg"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white hover:border-brand-muted/40"
            }`}
          >
            <Monitor className="w-4 h-4 text-[#1DB954]" />
            <div className="text-left">
              <span className="block text-xs font-display font-bold uppercase tracking-wider">Horizontal (16:9)</span>
              <span className="block text-[10px] font-mono text-brand-muted">1920 × 1080 px</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Nome do Festival */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Nome do Festival
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={festivalName}
            maxLength={32}
            onChange={(e) => onFestivalNameChange(e.target.value)}
            className="flex-1 bg-[#141A29] border border-[#1E2638] rounded-xl px-4 py-3 text-sm font-display font-bold uppercase tracking-wider text-white placeholder-brand-muted/40 focus:outline-none focus:border-[#1DB954] transition-colors"
            placeholder="NOME DO SEU FESTIVAL"
          />
          <button
            onClick={onRegenerate}
            title="Sortear nova ordem do lineup"
            className="px-4 bg-[#141A29] border border-[#1E2638] hover:border-[#1DB954] hover:text-[#1DB954] rounded-xl text-brand-muted transition-all flex items-center justify-center active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
        {/* Sugestões Rápidas */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {quickSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => onFestivalNameChange(sug)}
              className="text-[11px] font-mono px-2.5 py-1 bg-[#141A29] border border-[#1E2638] rounded-lg text-brand-muted hover:text-white hover:border-brand-muted/60 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Seleção de Tema Visual */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Tema Visual do Festival
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-[#1DB954] ring-2 ring-[#1DB954]/30 bg-[#161D2E] scale-[1.02] shadow-xl"
                    : "border-[#1E2638] bg-[#141A29]/70 hover:border-brand-muted/50 opacity-80 hover:opacity-100"
                }`}
              >
                <div className={`w-full h-10 rounded-lg ${t.bg} border border-black/10 mb-2 flex items-center justify-center font-display font-black text-sm ${t.text} shadow-inner`}>
                  FESTIQ
                </div>
                <span className="font-display font-bold text-sm text-white leading-tight">
                  {t.name}
                </span>
                <span className="text-[10px] font-mono text-brand-muted line-clamp-1 mt-0.5">
                  {t.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Modo do Lineup */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Algoritmo do Lineup
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onModeChange("taste")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "taste"
                ? "bg-[#1DB954]/15 border-[#1DB954] text-[#1DB954]"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meu Gosto</span>
          </button>
          <button
            onClick={() => onModeChange("genre")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "genre"
                ? "bg-[#1DB954]/15 border-[#1DB954] text-[#1DB954]"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Por Gênero</span>
          </button>
          <button
            onClick={() => onModeChange("popularity")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "popularity"
                ? "bg-[#1DB954]/15 border-[#1DB954] text-[#1DB954]"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popularidade</span>
          </button>
        </div>

        {/* Seletor de Gênero quando ativo */}
        {mode === "genre" && (
          <div className="pt-2 animate-fadeIn">
            <span className="block text-[11px] font-mono text-brand-muted mb-1.5 font-semibold">
              Gênero Musical Principal:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => onTargetGenreChange(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold border transition-colors ${
                    targetGenre === g
                      ? "bg-[#1DB954] text-black border-[#1DB954]"
                      : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Período das Estatísticas */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Período das Estatísticas
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onTimeRangeChange("short_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "short_term"
                ? "bg-[#1E2638] border-white/50 text-white font-bold"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            4 Semanas
          </button>
          <button
            onClick={() => onTimeRangeChange("medium_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "medium_term"
                ? "bg-[#1E2638] border-white/50 text-white font-bold"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            6 Meses
          </button>
          <button
            onClick={() => onTimeRangeChange("long_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "long_term"
                ? "bg-[#1E2638] border-white/50 text-white font-bold"
                : "bg-[#141A29] border-[#1E2638] text-brand-muted hover:text-white"
            }`}
          >
            Todo o Tempo
          </button>
        </div>
      </div>
    </div>
  );
};
