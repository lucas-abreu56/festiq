import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";

interface ThemeProps {
  lineup: FestivalLineup;
}

interface ScheduleDaySlot {
  weekday: string;
  dayNumber: string;
  monthYear: string;
  boxed: "solid" | "faint" | "none";
  artists: SpotifyArtist[];
}

const ROCK_85_DAYS: Omit<ScheduleDaySlot, "artists">[] = [
  { weekday: "SEXTA-FEIRA", dayNumber: "11", monthYear: "JANEIRO/85", boxed: "solid" },
  { weekday: "SÁBADO", dayNumber: "12", monthYear: "JANEIRO/85", boxed: "none" },
  { weekday: "DOMINGO", dayNumber: "13", monthYear: "JANEIRO/85", boxed: "none" },
  { weekday: "SEGUNDA-FEIRA", dayNumber: "14", monthYear: "JANEIRO/85", boxed: "none" },
  { weekday: "TERÇA-FEIRA", dayNumber: "15", monthYear: "JANEIRO/85", boxed: "faint" },
  { weekday: "QUARTA-FEIRA", dayNumber: "16", monthYear: "JANEIRO/85", boxed: "solid" },
  { weekday: "QUINTA-FEIRA", dayNumber: "17", monthYear: "JANEIRO/85", boxed: "none" },
  { weekday: "SEXTA-FEIRA", dayNumber: "18", monthYear: "JANEIRO/85", boxed: "none" },
  { weekday: "SÁBADO", dayNumber: "19", monthYear: "JANEIRO/85", boxed: "solid" },
  { weekday: "DOMINGO", dayNumber: "20", monthYear: "JANEIRO/85", boxed: "none" },
];

/**
 * Formata o título principal para sempre finalizar como "<NOME> FESTIVAL."
 * exatamente como "ROCK IN RIO FESTIVAL." no impresso original de 1985.
 */
function formatRock85Header(rawTitle: string): string {
  const clean = (rawTitle || "FESTIQ STUDIO").trim().toUpperCase().replace(/\.+$/, "");
  if (clean.endsWith("FESTIVAL")) {
    return `${clean}.`;
  }
  return `${clean} FESTIVAL.`;
}

/**
 * Quebra nomes compostos longos (> 15 caracteres, ex: "RED HOT CHILI PEPPERS",
 * "ENGENHEIROS DO HAWAII", "THE ROLLING STONES") em 2 linhas equilibradas dentro
 * da coluna do dia, garantindo 100% do nome visível sem jamais usar truncate.
 */
function splitScheduleArtistLines(name: string): string[] {
  const clean = name.trim();
  if (clean.length <= 11 || !clean.includes(" ")) {
    return [clean];
  }
  const words = clean.split(/\s+/);
  let bestIdx = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(" ").length;
    const l2 = words.slice(i).join(" ").length;
    const diff = Math.abs(l1 - l2);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(" "), words.slice(bestIdx).join(" ")];
}

export const RetroPressTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Distribui todos os 45 artistas pelos 10 dias do festival (5 dias com 5 artistas + 5 dias com 4 artistas = 45)
  // Os 10 primeiros artistas (Headliners) encerram cada coluna no rodapé do dia, como Queen, AC/DC, Rod Stewart e Yes em 1985.
  const top10Headliners = allArtists.slice(0, 10);
  const remaining35 = allArtists.slice(10, 45);

  const openersPerDay = [4, 4, 4, 3, 3, 3, 3, 4, 4, 3];
  let cursor = 0;

  const scheduleDays: ScheduleDaySlot[] = ROCK_85_DAYS.map((dayMeta, idx) => {
    const count = openersPerDay[idx];
    const dayOpeners = remaining35.slice(cursor, cursor + count);
    cursor += count;
    const dayHeadliner = top10Headliners[idx];
    return {
      ...dayMeta,
      artists: dayHeadliner ? [...dayOpeners, dayHeadliner] : dayOpeners,
    };
  });

  const row1Days = scheduleDays.slice(0, 5);
  const row2Days = scheduleDays.slice(5, 10);
  const headerTitle = formatRock85Header(lineup.title);

  return (
    <div
      className={`w-full h-full text-[#1F1C19] flex flex-col justify-between relative overflow-hidden select-none font-display ${
        isSquare ? "px-3.5 py-2.5" : "px-3 py-3"
      }`}
      style={{
        backgroundColor: "#E4D8C1",
        backgroundImage: `
          radial-gradient(circle at 12% 28%, rgba(168, 138, 94, 0.24) 0%, transparent 32%),
          radial-gradient(circle at 88% 18%, rgba(160, 130, 88, 0.18) 0%, transparent 28%),
          radial-gradient(circle at 22% 76%, rgba(156, 124, 82, 0.20) 0%, transparent 35%),
          radial-gradient(circle at 78% 82%, rgba(175, 148, 106, 0.22) 0%, transparent 38%),
          linear-gradient(180deg, #EAE0CC 0%, #E1D4BB 52%, #DACBAEFF 100%)
        `,
      }}
    >
      {/* Textura sutil de granulação de jornal de época e marcas de dobra */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="452" x2="600" y2="450" stroke="#8C7A5B" strokeWidth="0.8" strokeDasharray="6 4" />
        <line x1="300" y1="0" x2="300" y2="900" stroke="#8C7A5B" strokeWidth="0.5" strokeDasharray="8 6" />
        <rect x="3" y="3" width="594" height="894" fill="none" stroke="#221F1D" strokeWidth="1.2" strokeOpacity="0.35" />
      </svg>

      {/* 1. CABEÇALHO MONUMENTAL ESTILO "ROCK IN RIO FESTIVAL. / PROGRAMAÇÃO®" (Sem cortar nenhuma letra) */}
      <div className="relative z-10 w-full text-center">
        <h1
          className={`font-display font-black uppercase leading-[0.88] tracking-[-0.02em] text-[#423B34] mx-auto ${
            isSquare
              ? headerTitle.length > 28
                ? "text-[18px]"
                : headerTitle.length > 21
                ? "text-[23px]"
                : "text-[28px]"
              : headerTitle.length > 28
              ? "text-[19px]"
              : headerTitle.length > 21
              ? "text-[23px]"
              : "text-[29px]"
          }`}
          style={{
            WebkitTextStroke: "1.2px #1A1715",
            textShadow: "1px 1px 0px rgba(26, 23, 21, 0.25)",
          }}
        >
          {headerTitle}
        </h1>

        {/* Faixa PROGRAMAÇÃO® entre fios duplos de tinta preta */}
        <div
          className={`w-full border-t-[1.5px] border-b-[1.5px] border-[#221F1D] flex items-center justify-center ${
            isSquare ? "mt-1 py-0.5" : "mt-1.5 py-1"
          }`}
        >
          <div className="relative inline-flex items-start justify-center">
            <span
              className={`font-display font-bold uppercase text-[#1F1C19] leading-none tracking-[0.26em] pl-[0.26em] ${
                isSquare ? "text-base" : "text-lg"
              }`}
            >
              PROGRAMAÇÃO
            </span>
            <span className="text-[7px] font-mono font-black text-[#1F1C19] -ml-0.5 -mt-0.5">
              ®
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRADE DE 10 DIAS (2 FILEIRAS × 5 COLUNAS = TODOS OS 45 ARTISTAS 100% INTEIROS) */}
      <div
        className={`relative z-10 flex-1 grid grid-rows-2 w-full overflow-hidden ${
          isSquare ? "py-1.5 gap-2" : "py-1.5 gap-2"
        }`}
      >
        {[row1Days, row2Days].map((rowDays, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-1.5 items-stretch w-full h-full">
            {rowDays.map((slot) => {
              const boxClass =
                slot.boxed === "solid"
                  ? "border-[1.4px] border-[#221F1D] bg-[#DFD1B5]/55 shadow-[inset_0_0_8px_rgba(120,95,60,0.12)]"
                  : slot.boxed === "faint"
                  ? "border border-[#221F1D]/35 bg-[#EBE2CE]/45"
                  : "border border-transparent";

              return (
                <div
                  key={slot.dayNumber}
                  className={`flex flex-col items-center justify-between text-center px-1 ${
                    isSquare ? "py-1.5" : "py-1"
                  } ${boxClass}`}
                >
                  {/* Cabeçalho do Dia: Dia da Semana + Número Gigante + JANEIRO/85 */}
                  <div className="w-full flex flex-col items-center leading-none">
                    <span
                      className={`font-display font-bold uppercase tracking-tighter text-[#221F1D] w-full ${
                        slot.weekday.length > 11
                          ? isSquare
                            ? "text-[7.5px]"
                            : "text-[6.8px]"
                          : isSquare
                          ? "text-[8.2px]"
                          : "text-[7.6px]"
                      }`}
                    >
                      {slot.weekday}
                    </span>

                    <span
                      className={`font-display font-black text-[#1A1715] leading-[0.86] ${
                        isSquare ? "text-2xl my-0.5" : "text-2xl my-0.5"
                      }`}
                    >
                      {slot.dayNumber}
                    </span>

                    <span
                      className={`font-display font-bold uppercase tracking-tight text-[#221F1D] ${
                        isSquare ? "text-[7.6px]" : "text-[7.2px]"
                      }`}
                    >
                      {slot.monthYear}
                    </span>
                  </div>

                  {/* Lista Vertical de Artistas do Dia Distribuída Uniformemente na Altura da Caixa */}
                  <div
                    className={`flex-1 w-full flex flex-col items-center justify-evenly ${
                      isSquare ? "py-1" : "py-1.5"
                    }`}
                  >
                    {slot.artists.map((artist, aIdx) => {
                      const isDayHeadliner = aIdx === slot.artists.length - 1;
                      const lines = splitScheduleArtistLines(artist.name);
                      const maxLineLen = Math.max(...lines.map((l) => l.length));

                      return (
                        <div
                          key={`${slot.dayNumber}-${artist.id}`}
                          className="w-full text-center leading-none"
                        >
                          {lines.map((line, lIdx) => (
                            <span
                              key={lIdx}
                              className={`block w-full text-center font-display uppercase ${
                                isDayHeadliner
                                  ? "font-black text-[#110F0D]"
                                  : "font-bold text-[#26221E]"
                              } ${
                                isSquare
                                  ? maxLineLen > 12
                                    ? "text-[7.2px] tracking-tighter"
                                    : isDayHeadliner
                                    ? "text-[8.8px] tracking-tight"
                                    : "text-[8px] tracking-tight"
                                  : maxLineLen > 12
                                  ? "text-[6.6px] tracking-tighter"
                                  : isDayHeadliner
                                  ? "text-[8.2px] tracking-tight"
                                  : "text-[7.4px] tracking-tight"
                              }`}
                              style={{ lineHeight: lines.length > 1 ? "0.92" : "1.02" }}
                            >
                              {line}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. RODAPÉ HISTÓRICO DE JORNAL (Fiel ao Cartaz de 1985) */}
      <div
        className={`relative z-10 w-full text-center border-t border-[#221F1D]/40 ${
          isSquare ? "pt-0.5" : "pt-1"
        }`}
      >
        <p
          className={`font-sans font-bold text-[#1F1C19] leading-tight ${
            isSquare ? "text-[7.5px]" : "text-[8px]"
          }`}
        >
          Os portões serão abertos a partir das 12 horas.
        </p>
        <p
          className={`font-sans font-bold text-[#1F1C19] leading-tight ${
            isSquare ? "text-[7.5px]" : "text-[8px]"
          }`}
        >
          Os shows começam às 18 horas, diariamente, e às 16 horas, aos domingos.
        </p>
      </div>
    </div>
  );
};
