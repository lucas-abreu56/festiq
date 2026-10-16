"use client";

import React, { useState } from "react";
import { Download, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { exportPosterAsPng, downloadDataUrl, sharePosterImage } from "@/lib/exporter";
import { PosterAspectRatio } from "@/lib/lineup-engine";

interface ExportBarProps {
  festivalName: string;
  aspectRatio: PosterAspectRatio;
}

export const ExportBar: React.FC<ExportBarProps> = ({ festivalName, aspectRatio }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const isHorizontal = aspectRatio === "16:9";
  const resolutionText = isHorizontal ? "1920 × 1080 PX (PANORÂMICO)" : "1080 × 1920 PX (STORIES)";

  const handleDownload = async () => {
    const exportNode = document.getElementById("festiq-poster-export-root");
    if (!exportNode) {
      alert("Elemento do pôster não encontrado para renderização.");
      return;
    }

    try {
      setIsExporting(true);
      const dataUrl = await exportPosterAsPng(exportNode);
      const safeName = festivalName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "festiq";
      const formatTag = isHorizontal ? "1920x1080" : "1080x1920";
      downloadDataUrl(dataUrl, `${safeName}-${formatTag}.png`);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      alert("Houve uma falha ao gerar a imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const exportNode = document.getElementById("festiq-poster-export-root");
    if (!exportNode) return;

    try {
      setIsExporting(true);
      const dataUrl = await exportPosterAsPng(exportNode);
      const shared = await sharePosterImage(dataUrl, `${festivalName} — Festiq`);

      if (!shared) {
        const formatTag = isHorizontal ? "1920x1080" : "1080x1920";
        downloadDataUrl(dataUrl, `festiq-lineup-${formatTag}.png`);
        alert("Imagem baixada! Você já pode publicá-la nas suas redes sociais.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full bg-[#0E121D]/90 border border-[#1E2638] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2.5 text-xs font-mono text-brand-muted">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
        <span className="text-white/80 font-bold">{resolutionText}</span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Botão Compartilhar */}
        <button
          onClick={handleShare}
          disabled={isExporting}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#141A29] border border-[#1E2638] hover:border-[#1DB954] text-white font-mono text-xs font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95"
        >
          <Share2 className="w-4 h-4 text-[#1DB954]" />
          <span>Compartilhar</span>
        </button>

        {/* Botão Baixar Pôster */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-7 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs font-black rounded-xl transition-all shadow-[0_0_25px_rgba(29,185,84,0.35)] disabled:opacity-50 active:scale-95"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Renderizando PNG...</span>
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Baixado com Sucesso!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-black" />
              <span>Baixar Pôster em HQ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
