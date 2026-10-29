"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
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
import { CurvedLoop } from "@/components/reactbits/CurvedLoop";
import { CircularCarousel } from "@/components/reactbits/CircularCarousel";
import {
  ConnectMusicModal,
  MusicSourceType,
} from "@/components/controls/ConnectMusicModal";
import {
  Music,
  LogOut,
  CheckCircle,
  Disc3,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  X,
  ListMusic,
  Radio,
} from "lucide-react";

const STORAGE_KEY = "festiq_session_v1";

export default function HomePage() {
  const [themeId, setThemeId] = useState<FestivalThemeId>("lolla");
  const [mode, setMode] = useState<CreationMode>("taste");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [aspectRatio, setAspectRatio] = useState<PosterAspectRatio>("9:16");
  const [targetGenre, setTargetGenre] = useState<string>("rock");
  // Por padrão vazio -> exibe sempre "FESTIQ STUDIO" até o usuário digitar um nome próprio
  const [festivalName, setFestivalName] = useState<string>("");
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Estado de Autenticação e Dados de Música
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [musicSource, setMusicSource] = useState<MusicSourceType | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [spotifyArtists, setSpotifyArtists] = useState<SpotifyArtist[]>([]);
  const [, setIsLoadingData] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Controle do Modal de Conexão
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [modalInitialTab, setModalInitialTab] = useState<"playlist" | "lastfm" | "oauth">("playlist");

  // Consulta de artistas na API do Spotify OAuth
  const fetchSpotifyData = useCallback(async (range: TimeRange) => {
    // Se o usuário estiver conectado via Playlist ou Last.fm, não substitui pela API do Spotify
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.source === "spotify_playlist" || parsed.source === "lastfm") {
            return;
          }
        }
      } catch {
        // Ignora erro no parse do storage
      }
    }

    setIsLoadingData(true);
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const justConnected = params?.get("connected") === "true";
    const authError = params?.get("auth_error");

    if (typeof window !== "undefined" && (justConnected || authError)) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (authError) {
      setAuthNotice(
        "Não foi possível concluir a autorização com o Spotify. Você pode conectar pela sua playlist do Spotify ou pelo Last.fm."
      );
      setModalInitialTab("playlist");
      setIsConnectModalOpen(true);
    }

    try {
      const res = await fetch(`/api/spotify/top-artists?time_range=${range}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
        setMusicSource("spotify_oauth");
        setSpotifyArtists(Array.isArray(data.artists) ? data.artists : []);
        setUserName(data.userName || "Conectado");
        setAuthNotice(null);
      } else {
        setIsAuthenticated(false);
        setMusicSource(null);
        setSpotifyArtists([]);

        if (data.errorCode === "SPOTIFY_USER_NOT_ALLOWED") {
          setAuthNotice(
            "O seu login no Spotify conectou, mas o app está em Modo de Desenvolvimento na API. Você pode carregar seus artistas instantaneamente pela aba Playlist do Spotify ou pelo Last.fm logo abaixo."
          );
          setModalInitialTab("playlist");
          setIsConnectModalOpen(true);
        } else if (justConnected && data.message) {
          setAuthNotice(data.message);
        }
      }
    } catch (err) {
      console.warn("Utilizando Modo Demo offline:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Inicialização com restauração de sessão do sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.authenticated && Array.isArray(parsed.artists) && parsed.artists.length > 0) {
            setIsAuthenticated(true);
            setMusicSource(parsed.source || "spotify_playlist");
            setUserName(parsed.userName || "");
            setSpotifyArtists(parsed.artists);
            return;
          }
        }
      } catch {
        // Fallback para Spotify OAuth
      }
    }
    fetchSpotifyData(timeRange);
  }, [fetchSpotifyData, timeRange]);

  // Sincronização de período com Last.fm quando ativo
  useEffect(() => {
    if (musicSource === "lastfm" && userName) {
      setIsLoadingData(true);
      fetch(`/api/lastfm/top-artists?user=${encodeURIComponent(userName)}&time_range=${timeRange}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.authenticated && Array.isArray(data.artists) && data.artists.length > 0) {
            setSpotifyArtists(data.artists);
            if (typeof window !== "undefined") {
              sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  authenticated: true,
                  source: "lastfm",
                  userName,
                  artists: data.artists,
                })
              );
            }
          }
        })
        .catch((err) => console.warn("Erro ao sincronizar Last.fm:", err))
        .finally(() => setIsLoadingData(false));
    }
  }, [musicSource, userName, timeRange]);

  // Manipuladores de conexão de novas fontes
  function handleConnectPlaylist(artists: SpotifyArtist[], playlistName: string) {
    setIsAuthenticated(true);
    setMusicSource("spotify_playlist");
    setUserName(playlistName);
    setSpotifyArtists(artists);
    setAuthNotice(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          authenticated: true,
          source: "spotify_playlist",
          userName: playlistName,
          artists,
        })
      );
    }
  }

  function handleConnectLastFm(artists: SpotifyArtist[], username: string) {
    setIsAuthenticated(true);
    setMusicSource("lastfm");
    setUserName(username);
    setSpotifyArtists(artists);
    setAuthNotice(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          authenticated: true,
          source: "lastfm",
          userName: username,
          artists,
        })
      );
    }
  }

  function handleDisconnect() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setMusicSource(null);
    setUserName("");
    setSpotifyArtists([]);
    if (musicSource === "spotify_oauth") {
      window.location.href = "/api/auth/logout";
    }
  }

  // Artistas base (do Spotify autenticado ou mock padrão)
  const activeArtists = useMemo(() => {
    return isAuthenticated && spotifyArtists.length > 0 ? spotifyArtists : MOCK_ARTISTS;
  }, [isAuthenticated, spotifyArtists]);

  // Nome ativo: sempre "FESTIQ STUDIO" salvo quando o usuário digitar algo
  const activeFestivalName = festivalName.trim() || "FESTIQ STUDIO";

  // Constrói o Lineup inteligente
  const lineup = useMemo(() => {
    return buildFestivalLineup({
      artists: activeArtists,
      festivalName: activeFestivalName,
      themeId,
      mode,
      timeRange,
      aspectRatio,
      targetGenre,
      shuffleSeed,
    });
  }, [activeArtists, activeFestivalName, themeId, mode, timeRange, aspectRatio, targetGenre, shuffleSeed]);

  return (
    <div className="min-h-screen bg-[#141414] text-[#F7F6EB] flex flex-col selection:bg-[#CEFF00] selection:text-black relative overflow-x-hidden font-sans">
      {/* 1. Header Global Design Bomb Style */}
      <header className="border-b border-[#282828] bg-[#141414]/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[64px] flex items-center justify-between py-2.5 sm:py-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Logo Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#CEFF00] text-[#141414] font-frama font-black italic text-xl sm:text-2xl flex items-center justify-center shadow-[0_6px_18px_rgba(206,255,0,0.28)] flex-shrink-0">
              iq
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-frama font-black italic tracking-tight text-xl sm:text-2xl uppercase text-[#F7F6EB] block leading-none">
                  Festiq
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FF3EBA] text-[#141414] text-[9px] sm:text-[10px] font-frama font-black italic uppercase tracking-wider">
                  STUDIO
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">
                Seu Spotify em cartaz de festival
              </span>
            </div>
          </div>

          {/* Navegação e Status de Conexão Spotify */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/sobre"
              className="hidden sm:inline-flex px-2 py-1.5 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-mono text-[#A3A3A3] hover:text-[#CEFF00] hover:bg-[#1E1E1E] transition-colors items-center gap-1"
              title="Sobre o Festiq, tecnologia e FAQ"
            >
              <span>Sobre & FAQ</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#1E1E1E] border border-[#CEFF00]/50 rounded-full text-[11px] sm:text-xs font-mono text-[#CEFF00] font-bold whitespace-nowrap">
                  {musicSource === "lastfm" ? (
                    <Radio className="w-3.5 h-3.5 text-[#CEFF00] flex-shrink-0" />
                  ) : musicSource === "spotify_playlist" ? (
                    <ListMusic className="w-3.5 h-3.5 text-[#CEFF00] flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-[#CEFF00] flex-shrink-0" />
                  )}
                  <span className="hidden sm:inline">
                    {musicSource === "lastfm"
                      ? "Last.fm:"
                      : musicSource === "spotify_playlist"
                      ? "Playlist:"
                      : "Spotify:"}
                  </span>
                  <span>{musicSource === "lastfm" ? `@${userName}` : userName || "Conectado"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab("playlist");
                    setIsConnectModalOpen(true);
                  }}
                  className="p-2 sm:px-2.5 sm:py-1.5 text-[#A3A3A3] hover:text-[#CEFF00] rounded-xl hover:bg-[#1E1E1E] border border-transparent hover:border-[#282828] transition-colors text-xs font-mono flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  title="Trocar fonte de música"
                >
                  <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden md:inline">Trocar</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-2 text-[#A3A3A3] hover:text-white rounded-xl hover:bg-[#1E1E1E] border border-transparent hover:border-[#282828] transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
                  title="Desconectar música"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab("playlist");
                    setIsConnectModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-[#CEFF00] hover:bg-[#b8e600] text-[#141414] font-display font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_18px_rgba(206,255,0,0.25)] active:scale-[0.97] whitespace-nowrap cursor-pointer"
                >
                  <Music className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Conectar Música</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. ReactBits CurvedLoop Monumental: Exibe sempre FESTIQ STUDIO até o usuário digitar um nome */}
      <section aria-label="Banner em curva do festival" className="border-b border-[#282828] bg-[#0E0E0E]">
        <CurvedLoop text={activeFestivalName} />
      </section>

      {/* 3. Conteúdo Principal · Console de Criação & Palco */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {authNotice && (
          <div
            role="alert"
            data-testid="spotify-auth-alert"
            className="mb-6 p-4 rounded-2xl bg-[#1E1E1E] border border-[#FF3EBA]/60 text-[#F7F6EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF3EBA] flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-mono leading-relaxed break-words text-[#F7F6EB]">
                {authNotice}
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setModalInitialTab("playlist");
                  setIsConnectModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#CEFF00] hover:bg-[#b8e600] text-[#141414] font-display font-black text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
              >
                Conectar Playlist ou Last.fm
              </button>
              <button
                type="button"
                onClick={() => setAuthNotice(null)}
                aria-label="Fechar aviso"
                className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#282828] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-frama font-black italic tracking-tight text-[#F7F6EB] uppercase leading-none">
            Crie seu festival dos sonhos a partir da sua música.
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 leading-relaxed">
            Monte pôsteres nos formatos vertical (9:16) e quadrado (1:1) com os artistas mais ouvidos do seu Spotify, sempre legíveis e sem cortes.
          </p>
        </div>

        {/* Orbit dos Headliners (ReactBits CircularCarousel com fotos quadradas maiores) */}
        <section className="mb-10 p-4 sm:p-6 rounded-2xl bg-[#1A1A1A] border border-[#282828] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#282828] pb-3 mb-2 px-1 sm:px-2 gap-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CEFF00]" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#F7F6EB]">
                Headliners em Destaque no seu Spotify
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#FF3EBA] font-bold">
              Toque ou passe o mouse para destacar
            </span>
          </div>
          <CircularCarousel artists={lineup.allArtists} />
        </section>

        {/* Layout do Estúdio: Palco de Preview à Esquerda e Painel de Mixagem à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Palco do Pôster */}
          <div className="flex flex-col items-center justify-center lg:sticky lg:top-24 lg:col-span-5">
            <div className="w-full flex justify-center py-2 relative">
              <PosterCanvas lineup={lineup} />
            </div>

            <div className="flex items-center gap-2 mt-3 text-center text-[11px] font-mono text-[#A3A3A3]">
              <Disc3 className="w-3.5 h-3.5 text-[#CEFF00] animate-spin" style={{ animationDuration: "8s" }} />
              <span>
                {aspectRatio === "9:16"
                  ? "Pré-visualização ao vivo · Stories e Reels (1080 × 1920)"
                  : "Pré-visualização ao vivo · Feed e Posts (1080 × 1080)"}
              </span>
            </div>
          </div>

          {/* Painel de Controles & Exportação */}
          <div className="flex flex-col gap-6 w-full lg:col-span-7">
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
            <ExportBar
              festivalName={activeFestivalName}
              aspectRatio={aspectRatio}
              artistCount={lineup.allArtists.length}
            />
          </div>
        </div>
      </main>

      {/* Nó Oculto de Exportação em Resolução Nativa Máxima (1080x1920 ou 1080x1080) */}
      <PosterCanvas lineup={lineup} exportMode />

      {/* 4. Rodapé Editorial Design Bomb Style */}
      <footer className="border-t border-[#282828] bg-[#0E0E0E] py-8 sm:py-10 mt-12 sm:mt-20 text-xs font-mono text-[#A3A3A3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-frama font-black italic text-[#F7F6EB] text-sm">FESTIQ STUDIO</span>
            <span className="hidden sm:inline">·</span>
            <p>Seus artistas mais ouvidos transformados em cartazes de festival.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-4 text-[11px]">
            <Link
              href="/sobre"
              className="text-[#A3A3A3] hover:text-[#CEFF00] transition-colors underline-offset-4 hover:underline"
            >
              Sobre & FAQ
            </Link>
            <span>•</span>
            <Link
              href="/privacidade"
              className="text-[#A3A3A3] hover:text-[#CEFF00] transition-colors underline-offset-4 hover:underline"
            >
              Privacidade
            </Link>
            <span>•</span>
            <Link
              href="/termos"
              className="text-[#A3A3A3] hover:text-[#CEFF00] transition-colors underline-offset-4 hover:underline"
            >
              Termos
            </Link>
            <span>•</span>
            <a
              href="https://github.com/lucas-abreu56/festiq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A3A3A3] hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* 5. Modal de Conexão Musical (Playlist Spotify, Last.fm, OAuth) */}
      <ConnectMusicModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectPlaylist={handleConnectPlaylist}
        onConnectLastFm={handleConnectLastFm}
        initialTab={modalInitialTab}
        noticeMessage={authNotice}
      />
    </div>
  );
}
