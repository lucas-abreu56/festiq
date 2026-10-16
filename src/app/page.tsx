"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FestivalThemeId,
  CreationMode,
  TimeRange,
  PosterAspectRatio,
  buildFestivalLineup,
} from "@/lib/lineup-engine";
import { MOCK_ARTISTS, SpotifyArtist } from "@/lib/mock-artists";
import { PosterCanvas } from "@/components/poster/PosterCanvas";
import { CustomizerPanel } from "@/components/controls/CustomizerPanel";
import { ExportBar } from "@/components/controls/ExportBar";
import { Music, LogOut, CheckCircle, Info, Disc3, Radio } from "lucide-react";

export default function HomePage() {
  const [themeId, setThemeId] = useState<FestivalThemeId>("lolla");
  const [mode, setMode] = useState<CreationMode>("taste");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [aspectRatio, setAspectRatio] = useState<PosterAspectRatio>("9:16");
  const [targetGenre, setTargetGenre] = useState<string>("rock");
  const [festivalName, setFestivalName] = useState<string>("MEUPALOOZA");
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Estado de Autenticação e Dados do Spotify
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Lucas");
  const [spotifyArtists, setSpotifyArtists] = useState<SpotifyArtist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Consulta de artistas na API do Spotify
  const fetchSpotifyData = useCallback(async (range: TimeRange) => {
    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/spotify/top-artists?time_range=${range}`);
      const data = await res.json();

      if (data.authenticated && data.artists && data.artists.length > 0) {
        setIsAuthenticated(true);
        setSpotifyArtists(data.artists);
        if (data.userName) {
          setUserName(data.userName);
          setFestivalName(`${data.userName.toUpperCase()}PALOOZA`);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn("Utilizando Modo Demo offline:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchSpotifyData(timeRange);
  }, [fetchSpotifyData, timeRange]);

  // Artistas finais
  const activeArtists = useMemo(() => {
    let base = isAuthenticated && spotifyArtists.length > 0 ? spotifyArtists : MOCK_ARTISTS;

    if (shuffleSeed > 0) {
      const headliners = base.slice(0, 3);
      const rest = [...base.slice(3)].sort(() => Math.random() - 0.5);
      return [...headliners, ...rest];
    }
    return base;
  }, [isAuthenticated, spotifyArtists, shuffleSeed]);

  // Constrói o Lineup inteligente
  const lineup = useMemo(() => {
    return buildFestivalLineup({
      artists: activeArtists,
      festivalName: festivalName || "FESTIQ",
      themeId,
      mode,
      timeRange,
      aspectRatio,
      targetGenre,
    });
  }, [activeArtists, festivalName, themeId, mode, timeRange, aspectRatio, targetGenre]);

  // Cores de iluminação cênica de fundo baseadas no tema ativo
  const getThemeGlow = () => {
    switch (themeId) {
      case "lolla":
        return "from-[#FFE800]/15 via-[#00E5FF]/10 to-transparent";
      case "rock":
        return "from-[#29B6F6]/15 via-[#FFB300]/10 to-transparent";
      case "tropical":
        return "from-[#00A896]/20 via-[#FF6B6B]/15 to-transparent";
      case "retro":
        return "from-[#92400E]/15 via-[#7F1D1D]/10 to-transparent";
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col selection:bg-[#1DB954] selection:text-black relative overflow-x-hidden">
      {/* Luzes de Palco Ambientais */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-gradient bg-gradient-to-b ${getThemeGlow()} blur-3xl pointer-events-none transition-all duration-700`}
      />

      {/* 1. Header Global com Acabamento de Estúdio */}
      <header className="border-b border-[#1A2234] bg-[#0A0D15]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1DB954] text-black font-display font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(29,185,84,0.4)]">
              iq
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black tracking-wider text-xl uppercase text-white block leading-none">
                  Festiq
                </span>
                <span className="px-2 py-0.5 rounded bg-[#141A29] border border-[#1E2638] text-[9px] font-mono text-[#1DB954] font-bold">
                  STUDIO
                </span>
              </div>
              <span className="text-[10px] font-mono text-brand-muted tracking-widest uppercase">
                Your Taste. Your Festival.
              </span>
            </div>
          </div>

          {/* Status de Conexão Spotify */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1DB954]/15 border border-[#1DB954]/40 rounded-full text-xs font-mono text-[#1DB954] font-bold shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Spotify Conectado ({userName})
                </span>
                <a
                  href="/api/auth/logout"
                  className="p-2 text-brand-muted hover:text-white rounded-xl hover:bg-[#141A29] border border-transparent hover:border-[#1E2638] transition-colors text-xs font-mono flex items-center gap-1"
                  title="Desconectar Spotify"
                >
                  <LogOut className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141A29] border border-[#1E2638] rounded-full text-[11px] font-mono text-brand-muted">
                  <Radio className="w-3 h-3 text-[#1DB954] animate-pulse" />
                  Modo Demonstração (45 Artistas)
                </span>
                <a
                  href="/api/auth/login"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] active:scale-95"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Conectar Spotify</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal — Console de Criação & Palco */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
            Crie seu festival dos sonhos a partir da sua música.
          </h1>
          <p className="text-base text-brand-muted mt-2 leading-relaxed">
            Gere pôsteres comemorativos autênticos nos formatos vertical e panorâmico, sem cortes e prontos para publicar nas suas redes.
          </p>
        </div>

        {/* Layout do Estúdio: Palco de Preview à Esquerda e Painel de Mixagem à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Palco do Pôster */}
          <div
            className={`flex flex-col items-center justify-center sticky top-24 ${
              aspectRatio === "16:9" ? "lg:col-span-12 xl:col-span-7" : "lg:col-span-5"
            }`}
          >
            <div className="w-full flex justify-center py-2 relative">
              <PosterCanvas lineup={lineup} />
            </div>

            <div className="flex items-center gap-2 mt-3 text-center text-[11px] font-mono text-brand-muted">
              <Disc3 className="w-3.5 h-3.5 text-[#1DB954] animate-spin" style={{ animationDuration: "8s" }} />
              <span>
                {aspectRatio === "9:16"
                  ? "Pré-visualização ao vivo · Vertical 9:16 (Stories/Reels)"
                  : "Pré-visualização ao vivo · Panorâmico 16:9 (Banner/Desktop)"}
              </span>
            </div>
          </div>

          {/* Painel de Controles & Exportação */}
          <div
            className={`flex flex-col gap-6 w-full ${
              aspectRatio === "16:9" ? "lg:col-span-12 xl:col-span-5" : "lg:col-span-7"
            }`}
          >
            {/* Painel Customizer */}
            <CustomizerPanel
              festivalName={festivalName}
              onFestivalNameChange={setFestivalName}
              themeId={themeId}
              onThemeChange={setThemeId}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              mode={mode}
              onModeChange={setMode}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              targetGenre={targetGenre}
              onTargetGenreChange={setTargetGenre}
              onRegenerate={() => setShuffleSeed((s) => s + 1)}
              userName={userName}
            />

            {/* Barra de Ação de Download */}
            <ExportBar festivalName={festivalName} aspectRatio={aspectRatio} />
          </div>
        </div>
      </main>

      {/* Nó Oculto de Exportação em Resolução Máxima (1080x1920 ou 1920x1080) */}
      <PosterCanvas lineup={lineup} exportMode />

      {/* 3. Rodapé Editorial */}
      <footer className="border-t border-[#1A2234] bg-[#0A0D15] py-8 mt-16 text-xs font-mono text-brand-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-sm">FESTIQ STUDIO</span>
            <span>—</span>
            <p>Dados de áudio e artistas consumidos via Spotify Web API.</p>
          </div>
          <div className="flex items-center gap-5 text-[11px]">
            <a href="/privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <span>•</span>
            <a href="/termos" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
