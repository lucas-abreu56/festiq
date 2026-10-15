"use client";

import React, { useState } from "react";
import { Download, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { exportPosterAsPng, downloadDataUrl, sharePosterImage } from "@/lib/exporter";

interface ExportBarProps {
  festivalName: string;
}

export const ExportBar: React.FC<ExportBarProps> = ({ festivalName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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
      downloadDataUrl(dataUrl, `${safeName}-lineup-1080x1920.png`);
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
        // Fallback: faz download caso o navegador não suporte compartilhamento nativo de arquivo
        downloadDataUrl(dataUrl, "festiq-lineup-1080x1920.png");
        alert("Imagem baixada! Você já pode publicá-la nos seus Stories.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
      <div className="flex items-center gap-2 text-xs font-mono text-brand-muted">
        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
        <span>FORMATO 9:16 (1080 × 1920 PX)</span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Botão Compartilhar */}
        <button
          onClick={handleShare}
          disabled={isExporting}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-bg border border-brand-border hover:border-brand-accent text-white font-mono text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 text-brand-accent" />
          <span>Compartilhar</span>
        </button>

        {/* Botão Baixar Pôster */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-black font-mono text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] disabled:opacity-50 active:scale-95"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Gerando PNG...</span>
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Baixado!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-black" />
              <span>Baixar Pôster</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
