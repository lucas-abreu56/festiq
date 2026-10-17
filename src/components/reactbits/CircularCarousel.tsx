"use client";

/**
 * Componente: CircularCarousel
 * Referência: ReactBits (@react-bits/CircularCarousel-JS-CSS)
 * Licença: MIT + Commons Clause (Copyright (c) 2026 David Haz)
 */

import React, { useState, useEffect, useRef } from "react";
import { SpotifyArtist } from "@/lib/mock-artists";

interface CircularCarouselProps {
  artists: SpotifyArtist[];
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({ artists }) => {
  const topArtists = artists.slice(0, 8);
  const count = topArtists.length;
  const [rotation, setRotation] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [radiusX, setRadiusX] = useState(260);

  // Busca automaticamente fotos reais via /api/artists/photos (Deezer API) caso algum artista venha sem imagem
  useEffect(() => {
    let active = true;
    topArtists.forEach(async (artist) => {
      const existingUrl = artist.images?.[0]?.url;
      if (existingUrl && !existingUrl.includes("unsplash.com")) return;
      if (resolvedImages[artist.id]) return;

      try {
        const res = await fetch(`/api/artists/photos?name=${encodeURIComponent(artist.name)}`);
        const data = await res.json();
        if (active && data?.imageUrl) {
          setResolvedImages((prev) => ({ ...prev, [artist.id]: data.imageUrl }));
        }
      } catch {
        // Silencia falha de rede individual
      }
    });
    return () => {
      active = false;
    };
  }, [topArtists, resolvedImages]);

  // Ajusta o raio horizontal da órbita 3D responsivamente
  useEffect(() => {
    const updateRadius = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const computed = Math.min(Math.max(width * 0.34, 130), 340);
      setRadiusX(computed);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // Rotação contínua suave a 60fps via requestAnimationFrame (pausa apenas quando um card está em foco)
  useEffect(() => {
    if (hoveredId !== null) return;
    let frameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + dt * 0.012) % 360);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hoveredId]);

  const radiusY = Math.round(radiusX * 0.34);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[340px] sm:h-[390px] flex items-center justify-center select-none overflow-hidden"
    >
      {/* Anel Guia de Órbita em Perspectiva */}
      <div
        className="absolute rounded-full border border-dashed border-[#282828] pointer-events-none"
        style={{
          width: `${radiusX * 2}px`,
          height: `${radiusY * 2}px`,
        }}
      />

      {/* Centro Estilo Palco / Monólito Quadrado */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#141414] border-2 border-[#CEFF00]/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(206,255,0,0.15)] z-20 pointer-events-none">
        <span className="font-mono text-[9px] text-[#A3A3A3] uppercase tracking-widest">
          HEADLINERS
        </span>
        <span className="font-frama font-black italic text-xl sm:text-2xl text-[#CEFF00] tracking-tight leading-none my-0.5">
          TOP {count}
        </span>
        <span className="font-mono text-[8px] text-[#F7F6EB]/80 uppercase tracking-widest">
          FOTOS REAIS
        </span>
      </div>

      {/* Artistas Orbitando em Anel 3D com Molduras Quadradas Maiores */}
      {topArtists.map((artist, idx) => {
        const angleDeg = idx * (360 / count) + rotation;
        const angleRad = angleDeg * (Math.PI / 180);

        const x = Math.cos(angleRad) * radiusX;
        const y = Math.sin(angleRad) * radiusY;

        // Profundidade Z: sin(angle) varia de -1 (fundo) a +1 (frente)
        const depth = (Math.sin(angleRad) + 1) / 2; // 0 a 1
        const scale = 0.72 + depth * 0.34;
        const isCurrentHovered = hoveredId === artist.id;
        const zIndex = isCurrentHovered ? 60 : Math.round(10 + depth * 30);

        const imageUrl =
          resolvedImages[artist.id] ||
          artist.images?.[0]?.url ||
          "https://cdn-images.dzcdn.net/images/artist/238f5524a401dfdd5cac685f0f7989bd/500x500-000000-80-0-0.jpg";

        return (
          <div
            key={artist.id}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) scale(${scale.toFixed(3)})`,
              zIndex,
              willChange: "transform",
            }}
            onMouseEnter={() => setHoveredId(artist.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Card Interno Quadrado (Anima o hover separadamente sem tocar no translate3d da órbita!) */}
            <div
              className="flex flex-col items-center transition-transform duration-200"
              style={{
                transitionTimingFunction: "var(--ease-out)",
                transform: isCurrentHovered ? "scale(1.14) translateY(-6px)" : "scale(1)",
              }}
            >
              {/* Foto Quadrada Grande do Artista */}
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-none overflow-hidden border-2 transition-colors duration-200 bg-[#0E0E0E] relative shadow-[0_14px_30px_rgba(0,0,0,0.85)] ${
                  isCurrentHovered
                    ? "border-[#CEFF00] shadow-[0_0_25px_rgba(206,255,0,0.45)]"
                    : "border-[#F7F6EB]/35"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  draggable={false}
                />
                {/* Badge de Posição no Canto Superior Esquerdo */}
                <span className="absolute top-0 left-0 px-1.5 py-0.5 bg-[#141414]/90 border-r border-b border-[#282828] font-mono text-[9px] font-bold text-[#CEFF00]">
                  #{idx + 1}
                </span>
              </div>

              {/* Plaqueta Retangular com o Nome do Artista */}
              <div
                className={`w-24 sm:w-28 md:w-32 px-2 py-1 border-x-2 border-b-2 transition-colors duration-200 text-center ${
                  isCurrentHovered
                    ? "bg-[#CEFF00] border-[#CEFF00] text-[#141414]"
                    : "bg-[#141414] border-[#F7F6EB]/35 text-[#F7F6EB]"
                }`}
              >
                <span className="block text-[9px] sm:text-[10px] font-display font-black uppercase tracking-wider truncate">
                  {artist.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
