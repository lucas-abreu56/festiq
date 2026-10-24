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
        className="flex flex-wrap items-center gap-2"
      >
        {options.map((option) => {
          const isSelected = selected.toLowerCase() === option.toLowerCase();

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                isSelected
                  ? "bg-[#CEFF00] text-[#141414] border-[#CEFF00] shadow-[0_0_12px_rgba(206,255,0,0.35)]"
                  : "bg-[#1E1E1E] text-[#A3A3A3] border-[#2B2B2B] hover:border-[#CEFF00]/60 hover:text-white"
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
