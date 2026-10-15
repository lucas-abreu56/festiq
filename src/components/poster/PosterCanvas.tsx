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
      // Nó de renderização exato para captura em 1080x1920 (escondido fora da tela durante preview)
      return (
        <div
          ref={ref}
          id="festiq-poster-export-root"
          className="fixed -left-[9999px] top-0 w-[1080px] h-[1920px] overflow-hidden poster-export-node"
          style={{ width: "1080px", height: "1920px" }}
        >
          {renderTheme()}
        </div>
      );
    }

    // Modo de visualização responsiva (9:16) no navegador
    return (
      <div
        ref={ref}
        id="festiq-poster-preview"
        className="w-full max-w-[380px] sm:max-w-[420px] aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-brand-border/60 transition-all duration-300"
      >
        {renderTheme()}
      </div>
    );
  }
);

PosterCanvas.displayName = "PosterCanvas";
