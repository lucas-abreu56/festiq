"use client";

/**
 * Componente: CircularCarousel
 * Referência: ReactBits (@react-bits/CircularCarousel-JS-CSS)
 * Licença: MIT + Commons Clause
 */

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { SpotifyArtist } from "@/lib/mock-artists";

interface CircularCarouselProps {
  artists: SpotifyArtist[];
  radius?: number;
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({
  artists,
  radius = 120,
}) => {
  const topArtists = artists.slice(0, 6);
  const count = topArtists.length;
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotação contínua sutil quando não pausado
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.4) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative w-full h-[280px] flex items-center justify-center select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Centro Decorativo Estilo Vinil / Stage */}
      <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border-2 border-[#CEFF00]/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(206,255,0,0.2)] z-10">
        <span className="font-display font-black text-xs text-[#CEFF00] tracking-tighter">
          TOP {count}
        </span>
        <span className="font-mono text-[8px] text-brand-muted uppercase">HEADLINERS</span>
      </div>

      {/* Artistas Orbitando em Anel Circular 3D */}
      {topArtists.map((artist, idx) => {
        const angle = (idx * (360 / count) + rotation) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * (radius * 0.45); // Elipse de perspectiva
        const scale = 0.75 + (Math.sin(angle) + 1) * 0.25; // Efeito de profundidade Z
        const zIndex = Math.round(scale * 10);
        const imageUrl = artist.images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200";

        return (
          <motion.div
            key={artist.id}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              zIndex,
            }}
            whileHover={{ scale: scale * 1.15 }}
          >
            {/* Foto do Artista */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#F7F6EB]/30 group-hover:border-[#CEFF00] shadow-xl bg-black transition-colors relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Nome do Artista */}
            <span className="mt-1 px-2 py-0.5 rounded-md bg-[#141414]/90 border border-[#282828] text-[9px] font-display font-black uppercase text-white tracking-wider text-center max-w-[90px] truncate shadow-md group-hover:text-[#CEFF00] transition-colors">
              {artist.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
