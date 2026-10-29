"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ListMusic,
  Radio,
  Music,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { SpotifyArtist } from "@/lib/mock-artists";

export type MusicSourceType = "spotify_oauth" | "spotify_playlist" | "lastfm";

interface ConnectMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectPlaylist: (artists: SpotifyArtist[], playlistName: string) => void;
  onConnectLastFm: (artists: SpotifyArtist[], username: string) => void;
  initialTab?: "playlist" | "lastfm" | "oauth";
  noticeMessage?: string | null;
}

export function ConnectMusicModal({
  isOpen,
  onClose,
  onConnectPlaylist,
  onConnectLastFm,
  initialTab = "playlist",
  noticeMessage,
}: ConnectMusicModalProps) {
  const [activeTab, setActiveTab] = useState<"playlist" | "lastfm" | "oauth">(initialTab);
  const [playlistInput, setPlaylistInput] = useState("");
  const [lastfmInput, setLastfmInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handlePlaylistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = playlistInput.trim();
    if (!trimmed) {
      setErrorMessage("Cole o link de uma playlist do Spotify para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/spotify/playlist?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok || !data.authenticated || !data.artists?.length) {
        setErrorMessage(
          data.message ||
            "Não foi possível extrair os artistas dessa playlist. Verifique se o link está correto e público."
        );
        return;
      }

      onConnectPlaylist(data.artists, data.playlistName || "Minha Playlist");
      onClose();
    } catch {
      setErrorMessage("Erro de conexão ao ler a playlist do Spotify. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLastFmSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = lastfmInput.trim();
    if (!trimmed) {
      setErrorMessage("Digite o nome de usuário do Last.fm para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/lastfm/top-artists?user=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok || !data.authenticated || !data.artists?.length) {
        setErrorMessage(
          data.message ||
            "Não foi possível obter os artistas desse usuário no Last.fm. Verifique a grafia."
        );
        return;
      }

      onConnectLastFm(data.artists, data.userName || trimmed);
      onClose();
    } catch {
      setErrorMessage("Erro de conexão com o Last.fm. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-music-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-3xl p-5 sm:p-7 shadow-2xl text-[#F7F6EB] relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-[#282828] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CEFF00] inline-block animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CEFF00] font-bold">
                Conectar sua Música
              </span>
            </div>
            <h2
              id="connect-music-title"
              className="text-xl sm:text-2xl font-frama font-black italic tracking-tight text-[#F7F6EB] uppercase"
            >
              Escolha como carregar seus artistas
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal de conexão"
            className="p-2 rounded-xl text-[#A3A3A3] hover:text-white hover:bg-[#282828] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de Modo de Desenvolvimento da API do Spotify */}
        {noticeMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-[#241A1E] border border-[#FF3EBA]/50 text-xs font-mono text-[#F7F6EB] leading-relaxed flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-[#FF3EBA] flex-shrink-0 mt-0.5" />
            <p className="break-words">{noticeMessage}</p>
          </div>
        )}

        {/* Seleção de Abas */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#121212] border border-[#282828] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("playlist");
              setErrorMessage(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "playlist"
                ? "bg-[#CEFF00] text-[#141414] shadow-md"
                : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
            }`}
          >
            <ListMusic className="w-4 h-4 flex-shrink-0" />
            <span className="text-center sm:text-left text-[11px] sm:text-xs">Playlist</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("lastfm");
              setErrorMessage(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "lastfm"
                ? "bg-[#CEFF00] text-[#141414] shadow-md"
                : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
            }`}
          >
            <Radio className="w-4 h-4 flex-shrink-0" />
            <span className="text-center sm:text-left text-[11px] sm:text-xs">Last.fm</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("oauth");
              setErrorMessage(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "oauth"
                ? "bg-[#CEFF00] text-[#141414] shadow-md"
                : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
            }`}
          >
            <Music className="w-4 h-4 flex-shrink-0" />
            <span className="text-center sm:text-left text-[11px] sm:text-xs">Spotify Login</span>
          </button>
        </div>

        {/* Mensagem de Erro Geral */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono break-words leading-relaxed"
          >
            {errorMessage}
          </div>
        )}

        {/* Conteúdo Aba 1: Playlist Spotify */}
        {activeTab === "playlist" && (
          <form onSubmit={handlePlaylistSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="spotify-playlist-url" className="text-xs font-mono text-[#F7F6EB] font-bold">
                Link da sua Playlist do Spotify
              </label>
              <input
                id="spotify-playlist-url"
                type="text"
                value={playlistInput}
                onChange={(e) => setPlaylistInput(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] focus:border-[#CEFF00] focus:outline-none rounded-xl text-base text-[#F7F6EB] placeholder-[#666666] font-mono transition-colors"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#242424] text-xs font-mono text-[#A3A3A3] leading-relaxed flex flex-col gap-1.5">
              <span className="text-[#CEFF00] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Como pegar o link no app do Spotify:
              </span>
              <p>
                1. No Spotify, abra sua playlist favorita, a playlist automática <strong>No Repeat</strong> (ou <strong>Mais Tocadas</strong>).
              </p>
              <p>
                2. Clique nos <strong>3 pontinhos (…) → Compartilhar → Copiar link</strong> e cole no campo acima.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#CEFF00] hover:bg-[#b8e600] disabled:bg-[#444444] disabled:text-[#888888] text-[#141414] font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_18px_rgba(206,255,0,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando Artistas da Playlist...</span>
                </>
              ) : (
                <>
                  <span>Carregar Artistas no Pôster</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Conteúdo Aba 2: Last.fm */}
        {activeTab === "lastfm" && (
          <form onSubmit={handleLastFmSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastfm-username" className="text-xs font-mono text-[#F7F6EB] font-bold">
                Seu usuário do Last.fm
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#666666] font-mono text-base">@</span>
                <input
                  id="lastfm-username"
                  type="text"
                  value={lastfmInput}
                  onChange={(e) => setLastfmInput(e.target.value)}
                  placeholder="seunome"
                  disabled={isLoading}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] focus:border-[#CEFF00] focus:outline-none rounded-xl text-base text-[#F7F6EB] placeholder-[#666666] font-mono transition-colors"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#242424] text-xs font-mono text-[#A3A3A3] leading-relaxed">
              Puxa seus artistas mais escutados registrados no Last.fm (sincronizados com seu Spotify ou Apple Music). O pôster responderá aos botões de <strong>4 Semanas</strong>, <strong>6 Meses</strong> e <strong>Todo o Tempo</strong> do estúdio.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#CEFF00] hover:bg-[#b8e600] disabled:bg-[#444444] disabled:text-[#888888] text-[#141414] font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_18px_rgba(206,255,0,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consultando Last.fm...</span>
                </>
              ) : (
                <>
                  <span>Conectar Last.fm</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Conteúdo Aba 3: Spotify OAuth */}
        {activeTab === "oauth" && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424] text-xs font-mono text-[#A3A3A3] leading-relaxed flex flex-col gap-2">
              <span className="text-[#F7F6EB] font-bold">Login Oficial com Spotify:</span>
              <p>
                Permite autorizar o Festiq diretamente na sua conta do Spotify. Disponível para contas cadastradas na lista de desenvolvimento ou aprovadas pela plataforma do Spotify.
              </p>
            </div>

            <a
              href="/api/auth/login"
              className="w-full py-3 px-4 bg-[#CEFF00] hover:bg-[#b8e600] text-[#141414] font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_18px_rgba(206,255,0,0.25)] flex items-center justify-center gap-2 text-center"
            >
              <Music className="w-4 h-4 flex-shrink-0" />
              <span>Entrar com Spotify</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
