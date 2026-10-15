"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FestivalThemeId,
  CreationMode,
  TimeRange,
  buildFestivalLineup,
} from "@/lib/lineup-engine";
import { MOCK_ARTISTS, SpotifyArtist } from "@/lib/mock-artists";
import { PosterCanvas } from "@/components/poster/PosterCanvas";
import { CustomizerPanel } from "@/components/controls/CustomizerPanel";
import { ExportBar } from "@/components/controls/ExportBar";
import { Music, LogIn, LogOut, CheckCircle, Info, Sparkles } from "lucide-react";

export default function HomePage() {
  const [themeId, setThemeId] = useState<FestivalThemeId>("lolla");
  const [mode, setMode] = useState<CreationMode>("taste");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
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

  // Artistas finais: usa os reais do Spotify se logado, senão usa o Mock Dataset
  const activeArtists = useMemo(() => {
    let base = isAuthenticated && spotifyArtists.length > 0 ? spotifyArtists : MOCK_ARTISTS;

    // Se o usuário clicar em sortear, embaralha levemente as atrações mantendo headliners
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
      targetGenre,
    });
  }, [activeArtists, festivalName, themeId, mode, timeRange, targetGenre]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      {/* 1. Header Global */}
      <header className="border-b border-brand-border bg-brand-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-accent text-black font-display font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.3)]">
              iq
            </div>
            <div>
              <span className="font-display font-black tracking-wider text-lg uppercase text-white block leading-none">
                Festiq
              </span>
              <span className="text-[10px] font-mono text-brand-muted tracking-widest uppercase">
                Your Taste. Your Festival.
              </span>
            </div>
          </div>

          {/* Status de Conexão Spotify */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent/15 border border-brand-accent/40 rounded-full text-xs font-mono text-brand-accent font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Spotify Conectado ({userName})
                </span>
                <a
                  href="/api/auth/logout"
                  className="p-2 text-brand-muted hover:text-white rounded-xl hover:bg-brand-bg border border-transparent hover:border-brand-border transition-colors text-xs font-mono flex items-center gap-1"
                  title="Desconectar Spotify"
                >
                  <LogOut className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-bg border border-brand-border rounded-full text-[11px] font-mono text-brand-muted">
                  <Info className="w-3 h-3 text-brand-accent" />
                  Modo Demo Ativo
                </span>
                <a
                  href="/api/auth/login"
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs font-black rounded-xl transition-all shadow-[0_0_15px_rgba(29,185,84,0.25)] active:scale-95"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Conectar Spotify</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Preview do Pôster 9:16 */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center sticky top-24">
            <div className="w-full flex justify-center">
              <PosterCanvas lineup={lineup} />
            </div>
            <p className="text-[11px] font-mono text-brand-muted mt-3 text-center">
              Pré-visualização ao vivo · Proporção exata para Instagram Stories (9:16)
            </p>
          </div>

          {/* Coluna Direita: Controles e Exportação */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start gap-6 w-full">
            <div className="w-full max-w-xl text-left">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase">
                Personalize seu Festival
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                Escolha o tema visual, ajuste o nome e alterne entre períodos de escuta para gerar um cartaz único.
              </p>
            </div>

            {/* Painel de Controles */}
            <CustomizerPanel
              festivalName={festivalName}
              onFestivalNameChange={setFestivalName}
              themeId={themeId}
              onThemeChange={setThemeId}
              mode={mode}
              onModeChange={setMode}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              targetGenre={targetGenre}
              onTargetGenreChange={setTargetGenre}
              onRegenerate={() => setShuffleSeed((s) => s + 1)}
              userName={userName}
            />

            {/* Barra de Download e Compartilhamento */}
            <ExportBar festivalName={festivalName} />
          </div>
        </div>
      </main>

      {/* Nó Oculto de Exportação 1080x1920 em Alta Definição */}
      <PosterCanvas lineup={lineup} exportMode />

      {/* 3. Rodapé & Governança */}
      <footer className="border-t border-brand-border bg-brand-surface py-6 mt-12 text-center text-xs font-mono text-brand-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 Festiq. Todos os direitos reservados. Dados fornecidos via Spotify Web API.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <span>•</span>
            <a href="/termos" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
