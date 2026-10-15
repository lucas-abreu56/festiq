import React from "react";
import { clsx } from "clsx";

interface SmartArtistNameProps {
  name: string;
  role: "headliner" | "sub-headliner" | "undercard";
  className?: string;
}

export const SmartArtistName: React.FC<SmartArtistNameProps> = ({
  name,
  role,
  className,
}) => {
  const len = name.length;

  if (role === "headliner") {
    // Quebra inteligente em duas linhas se o nome for longo e tiver espaço
    if (len > 18 && name.includes(" ")) {
      const parts = name.split(" ");
      const mid = Math.ceil(parts.length / 2);
      const line1 = parts.slice(0, mid).join(" ");
      const line2 = parts.slice(mid).join(" ");

      return (
        <span
          className={clsx(
            "block font-display font-black uppercase tracking-tight leading-[0.95]",
            len > 28 ? "text-2xl sm:text-3xl md:text-4xl" : "text-3xl sm:text-4xl md:text-5xl",
            className
          )}
        >
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </span>
      );
    }

    // Nome longo sem espaço ou abaixo de 18 caracteres
    return (
      <span
        className={clsx(
          "block font-display font-black uppercase tracking-tight leading-none",
          len <= 14 && "text-4xl sm:text-5xl md:text-6xl",
          len > 14 && len <= 22 && "text-3xl sm:text-4xl md:text-5xl",
          len > 22 && "text-2xl sm:text-3xl md:text-4xl tracking-tighter",
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
          len > 24 ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg md:text-xl",
          className
        )}
      >
        {name}
      </span>
    );
  }

  // Undercard
  return (
    <span
      className={clsx(
        "font-sans font-semibold uppercase tracking-wider inline-block text-xs sm:text-sm",
        className
      )}
    >
      {name}
    </span>
  );
};
