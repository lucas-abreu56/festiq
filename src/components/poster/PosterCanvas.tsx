import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { LollaWaveTheme } from "./templates/LollaWaveTheme";
import { FestifyTheme } from "./templates/FestifyTheme";
import { TropicalTheme } from "./templates/TropicalTheme";
import { RetroPressTheme } from "./templates/RetroPressTheme";
import { C6FestTheme } from "./templates/C6FestTheme";
import { FlogGnawTheme } from "./templates/FlogGnawTheme";
import { UndergroundTheme } from "./templates/UndergroundTheme";

interface PosterCanvasProps {
  lineup: FestivalLineup;
  exportMode?: boolean;
}

export const PosterCanvas = React.forwardRef<HTMLDivElement, PosterCanvasProps>(
  ({ lineup, exportMode = false }, ref) => {
    const isSquare = lineup.aspectRatio === "1:1";

    const renderTheme = () => {
      switch (lineup.themeId) {
        case "lolla":
          return <LollaWaveTheme lineup={lineup} />;
        case "festify":
          return <FestifyTheme lineup={lineup} />;
        case "tropical":
          return <TropicalTheme lineup={lineup} />;
        case "retro":
          return <RetroPressTheme lineup={lineup} />;
        case "c6fest":
          return <C6FestTheme lineup={lineup} />;
        case "floggnaw":
          return <FlogGnawTheme lineup={lineup} />;
        case "underground":
          return <UndergroundTheme lineup={lineup} />;
        default:
          return <LollaWaveTheme lineup={lineup} />;
      }
    };

    if (exportMode) {
      // Base lógica proporcional ao preview que escala perfeitamente para 1080x1920 (3x) ou 1080x1080 (2x)
      const baseWidth = isSquare ? 540 : 360;
      const baseHeight = isSquare ? 540 : 640;

      return (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 pointer-events-none select-none overflow-hidden opacity-0 -z-50"
          style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
        >
          <div
            ref={ref}
            id="festiq-poster-export-root"
            data-aspect-ratio={lineup.aspectRatio}
            className="relative overflow-hidden poster-export-node"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px`, containerType: "inline-size" }}
          >
            {renderTheme()}
          </div>
        </div>
      );
    }

    // Modo de visualização no navegador (9:16 Vertical ou 1:1 Quadrado)
    return (
      <div
        ref={ref}
        id="festiq-poster-preview"
        style={{ containerType: "inline-size" }}
        className={`w-full transition-all duration-300 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-brand-border/80 ${
          isSquare
            ? "max-w-[480px] sm:max-w-[540px] aspect-square"
            : "max-w-[360px] sm:max-w-[390px] aspect-[9/16]"
        }`}
      >
        {renderTheme()}
      </div>
    );
  }
);

PosterCanvas.displayName = "PosterCanvas";
