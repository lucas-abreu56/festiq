"use client";

import React, { useState } from "react";
import { Download, Share2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { exportPosterAsPng, downloadDataUrl, sharePosterImage } from "@/lib/exporter";
import { PosterAspectRatio } from "@/lib/lineup-engine";

interface ExportBarProps {
  festivalName: string;
  aspectRatio: PosterAspectRatio;
}

export const ExportBar: React.FC<ExportBarProps> = ({ festivalName, aspectRatio }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const isSquare = aspectRatio === "1:1";
  const resolutionText = isSquare
    ? "1080 × 1080 PX (QUADRADO / FEED)"
    : "1080 × 1920 PX (VERTICAL / STORIES)";

  const effectiveName = festivalName.trim() || "FESTIQ STUDIO";

  const handleDownload = async () => {
    const exportNode = document.getElementById("festiq-poster-export-root");
    if (!exportNode) {
      setExportError("Elemento do pôster não encontrado para renderização.");
      return;
    }

    try {
      setIsExporting(true);
      setExportError(null);
      const dataUrl = await exportPosterAsPng(exportNode);
      const safeName =
        effectiveName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "festiq-studio";
      const formatTag = isSquare ? "1080x1080" : "1080x1920";
      downloadDataUrl(dataUrl, `${safeName}-${formatTag}.png`);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch {
      setExportError("Não foi possível exportar a imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const exportNode = document.getElementById("festiq-poster-export-root");
    if (!exportNode) return;

    try {
      setIsExporting(true);
      setExportError(null);
      const dataUrl = await exportPosterAsPng(exportNode);
      const shared = await sharePosterImage(dataUrl, `${effectiveName} · Festiq`);

      if (!shared) {
        const formatTag = isSquare ? "1080x1080" : "1080x1920";
        downloadDataUrl(dataUrl, `festiq-lineup-${formatTag}.png`);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      }
    } catch (err) {
      console.error(err);
      setExportError("Falha ao preparar imagem para compartilhamento.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full bg-[#161616] border border-[#2B2B2B] p-5 rounded-2xl flex flex-col gap-4 shadow-2xl overflow-hidden">
      {/* Linha Superior: Metadados de Resolução */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CEFF00] flex-shrink-0" />
          <span className="text-[#F7F6EB] font-bold tracking-wide">{resolutionText}</span>
        </div>
        <span className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider">
          PNG Alta Definição · 45 Artistas
        </span>
      </div>

      {/* Linha Inferior: Grid Contido Sem Vazamento Lateral */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
        {/* Botão Compartilhar */}
        <button
          type="button"
          onClick={handleShare}
          disabled={isExporting}
          className="sm:col-span-4 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#FF3EBA] hover:text-[#FF3EBA] text-[#F7F6EB] font-mono text-xs font-bold rounded-xl transition-all disabled:opacity-50 active:scale-[0.97]"
        >
          <Share2 className="w-4 h-4 text-[#FF3EBA] flex-shrink-0" />
          <span className="truncate">Compartilhar</span>
        </button>

        {/* Botão Baixar Pôster em HQ */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="sm:col-span-8 w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#CEFF00] hover:bg-[#b8e600] text-[#141414] font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_8px_24px_rgba(206,255,0,0.25)] disabled:opacity-50 active:scale-[0.97]"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#141414] flex-shrink-0" />
              <span className="truncate">Renderizando PNG...</span>
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#141414] flex-shrink-0" />
              <span className="truncate">Pôster Baixado com Sucesso!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#141414] flex-shrink-0" />
              <span className="truncate">Baixar Pôster em HQ</span>
            </>
          )}
        </button>
      </div>

      {exportError && (
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF5252] bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{exportError}</span>
        </div>
      )}
    </div>
  );
};
