import React from "react";
import { clsx } from "clsx";

interface SmartArtistNameProps {
  name: string;
  role: "headliner" | "sub-headliner" | "undercard";
  className?: string;
  horizontal?: boolean;
}

export const SmartArtistName: React.FC<SmartArtistNameProps> = ({
  name,
  role,
  className,
  horizontal = false,
}) => {
  const len = name.length;

  if (role === "headliner") {
    // Quebra equilibrada em duas linhas para nomes muito longos (ex: Caetano Veloso & Gilberto Gil)
    if (len > 20 && name.includes(" ")) {
      const parts = name.split(" ");
      const mid = Math.ceil(parts.length / 2);
      const line1 = parts.slice(0, mid).join(" ");
      const line2 = parts.slice(mid).join(" ");

      return (
        <span
          className={clsx(
            "block font-display font-black uppercase tracking-tight leading-[0.95] text-center",
            horizontal
              ? len > 30 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              : len > 30 ? "text-lg sm:text-xl" : "text-xl sm:text-2xl",
            className
          )}
        >
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </span>
      );
    }

    // Headliner em linha única
    return (
      <span
        className={clsx(
          "block font-display font-black uppercase tracking-tight leading-none text-center",
          horizontal
            ? len <= 12 ? "text-3xl sm:text-4xl" : len <= 20 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            : len <= 12 ? "text-2xl sm:text-3xl" : len <= 20 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
          className
        )}
      >
        {name}
      </span>
    );
  }

  if (role === "sub-headliner") {
    return (
      <span
        className={clsx(
          "font-display font-bold uppercase tracking-normal leading-tight inline-block",
          horizontal
            ? len > 22 ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            : len > 22 ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm",
          className
        )}
      >
        {name}
      </span>
    );
  }

  // Undercard — compacto e legível para acomodar todo o elenco
  return (
    <span
      className={clsx(
        "font-sans font-semibold uppercase tracking-wider inline-block",
        horizontal ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px] leading-tight",
        className
      )}
    >
      {name}
    </span>
  );
};
