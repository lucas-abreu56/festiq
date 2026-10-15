"use client";

import React from "react";
import { FestivalThemeId, CreationMode, TimeRange } from "@/lib/lineup-engine";
import { Sparkles, Music2, Flame, Layers, Shuffle } from "lucide-react";

interface CustomizerPanelProps {
  festivalName: string;
  onFestivalNameChange: (name: string) => void;
  themeId: FestivalThemeId;
  onThemeChange: (theme: FestivalThemeId) => void;
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
  { id: "lolla", name: "Indie Waves", tag: "Inspirado no Lolla", bg: "bg-[#FFE800]", text: "text-black" },
  { id: "rock", name: "Stadium Rock", tag: "Inspirado no Rock in Rio", bg: "bg-[#090D16]", text: "text-white" },
  { id: "tropical", name: "Planeta Tropical", tag: "Inspirado no Planeta", bg: "bg-[#00A896]", text: "text-white" },
  { id: "retro", name: "Festival Retrô", tag: "Vintage Letterpress", bg: "bg-[#F5EBE1]", text: "text-[#1C1917]" },
];

const GENRES = ["rock", "pop", "indie", "hip hop", "electronic", "sertanejo", "mpb"];

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  festivalName,
  onFestivalNameChange,
  themeId,
  onThemeChange,
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
    `${userName.toUpperCase()} FEST`,
    `PLANETA ${userName.toUpperCase()}`,
  ];

  return (
    <div className="w-full max-w-xl space-y-6 bg-brand-surface border border-brand-border p-5 sm:p-6 rounded-2xl shadow-xl">
      {/* 1. Nome do Festival */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Nome do Festival
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={festivalName}
            maxLength={32}
            onChange={(e) => onFestivalNameChange(e.target.value)}
            className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wider text-white focus:outline-none focus:border-brand-accent transition-colors"
            placeholder="NOME DO SEU FESTIVAL"
          />
          <button
            onClick={onRegenerate}
            title="Sortear novo lineup"
            className="px-3.5 bg-brand-bg border border-brand-border hover:border-brand-accent hover:text-brand-accent rounded-xl text-brand-muted transition-colors flex items-center justify-center"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
        {/* Sugestões Rápidas */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => onFestivalNameChange(sug)}
              className="text-[11px] font-mono px-2.5 py-1 bg-brand-bg/80 border border-brand-border/60 rounded-md text-brand-muted hover:text-white hover:border-brand-muted transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Seleção de Tema Visual */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Estilo Visual & Tema
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {THEMES.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-brand-accent ring-2 ring-brand-accent/30 shadow-lg scale-[1.02]"
                    : "border-brand-border hover:border-brand-muted/60 opacity-80 hover:opacity-100"
                }`}
              >
                <div className={`w-full h-8 rounded-lg ${t.bg} border border-black/10 mb-2 flex items-center justify-center font-display font-bold text-xs ${t.text}`}>
                  Aa
                </div>
                <span className="font-display font-bold text-sm tracking-wide text-white leading-tight">
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

      {/* 3. Modo de Criação */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Modo do Lineup
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onModeChange("taste")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "taste"
                ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meu Gosto</span>
          </button>
          <button
            onClick={() => onModeChange("genre")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "genre"
                ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Por Gênero</span>
          </button>
          <button
            onClick={() => onModeChange("popularity")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
              mode === "popularity"
                ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popularidade</span>
          </button>
        </div>

        {/* Seletor de Gênero quando aplicável */}
        {mode === "genre" && (
          <div className="pt-2 animate-fadeIn">
            <span className="block text-[11px] font-mono text-brand-muted mb-1.5 font-semibold">
              Selecione o Gênero Musical:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => onTargetGenreChange(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold border transition-colors ${
                    targetGenre === g
                      ? "bg-brand-accent text-black border-brand-accent"
                      : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Período de Escuta */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted font-bold">
          Período das Estatísticas
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onTimeRangeChange("short_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "short_term"
                ? "bg-brand-border border-white/40 text-white font-bold"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            4 Semanas
          </button>
          <button
            onClick={() => onTimeRangeChange("medium_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "medium_term"
                ? "bg-brand-border border-white/40 text-white font-bold"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            6 Meses
          </button>
          <button
            onClick={() => onTimeRangeChange("long_term")}
            className={`py-2 px-2 text-center rounded-xl border text-xs font-mono transition-all ${
              timeRange === "long_term"
                ? "bg-brand-border border-white/40 text-white font-bold"
                : "bg-brand-bg border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            Todo o Tempo
          </button>
        </div>
      </div>
    </div>
  );
};
