import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { LollaWaveTheme } from "./templates/LollaWaveTheme";
import { RockStadiumTheme } from "./templates/RockStadiumTheme";
import { TropicalTheme } from "./templates/TropicalTheme";
import { RetroPressTheme } from "./templates/RetroPressTheme";

interface PosterCanvasProps {
  lineup: FestivalLineup;
  exportMode?: boolean;
}

export const PosterCanvas = React.forwardRef<HTMLDivElement, PosterCanvasProps>(
  ({ lineup, exportMode = false }, ref) => {
    const isHorizontal = lineup.aspectRatio === "16:9";

    const renderTheme = () => {
      switch (lineup.themeId) {
        case "lolla":
          return <LollaWaveTheme lineup={lineup} />;
        case "rock":
          return <RockStadiumTheme lineup={lineup} />;
        case "tropical":
          return <TropicalTheme lineup={lineup} />;
        case "retro":
          return <RetroPressTheme lineup={lineup} />;
        default:
          return <LollaWaveTheme lineup={lineup} />;
      }
    };

    if (exportMode) {
      // Nó de exportação exato para captura em alta resolução
      const width = isHorizontal ? 1920 : 1080;
      const height = isHorizontal ? 1080 : 1920;

      return (
        <div
          ref={ref}
          id="festiq-poster-export-root"
          className="fixed -left-[9999px] top-0 overflow-hidden poster-export-node"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {renderTheme()}
        </div>
      );
    }

    // Modo de visualização no navegador (9:16 ou 16:9)
    return (
      <div
        ref={ref}
        id="festiq-poster-preview"
        className={`w-full transition-all duration-300 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-brand-border/80 ${
          isHorizontal
            ? "max-w-[680px] aspect-[16/9]"
            : "max-w-[360px] sm:max-w-[390px] aspect-[9/16]"
        }`}
      >
        {renderTheme()}
      </div>
    );
  }
);

PosterCanvas.displayName = "PosterCanvas";
