"use client";

/**
 * Componente: OptionWheel
 * Referência: ReactBits (@react-bits/OptionWheel-JS-CSS)
 * Licença: MIT + Commons Clause
 */

import React, { useRef } from "react";
import { motion } from "motion/react";

interface OptionWheelProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export const OptionWheel: React.FC<OptionWheelProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full relative py-2">
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x"
        style={{ scrollbarWidth: "none" }}
      >
        {options.map((option) => {
          const isSelected = selected.toLowerCase() === option.toLowerCase();

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`snap-center flex-shrink-0 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                isSelected
                  ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_0_15px_rgba(206,255,0,0.4)]"
                  : "bg-[#1A1A1A] text-brand-muted border-[#282828] hover:border-[#F7F6EB]/40 hover:text-white"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
