import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";
import { LOLLA_BG_DATA_URI } from "@/lib/assets/lolla-bg";

interface ThemeProps {
  lineup: FestivalLineup;
}

interface HeadlinerLine {
  main: string;
  stackedConnector?: string[];
}

/**
 * Formata o nome do headliner seguindo a tipografia oficial do Lollapalooza Brasil:
 * - Nomes até 14 caracteres ficam em 1 linha única com altura uniforme (ex: "TRAVIS SCOTT", "FONTAINES D.C.", "SOMBR").
 * - Nomes com conectores ("QUEENS OF THE STONE AGE", "SYSTEM OF A DOWN", "ENGENHEIROS DO HAWAII")
 *   empilham o conector em meia-altura ao lado da primeira linha, exatamente como no pôster oficial.
 * - Nomes longos quebram em 2 linhas equilibradas ("THE / NEIGHBOURHOOD", "RED HOT / CHILI PEPPERS")
 *   sem jamais truncar nenhuma letra (Zero-Truncate Rule).
 */
function formatHeadlinerLines(name: string): HeadlinerLine[] {
  const clean = name.trim().toUpperCase();

  // Caso 1: Cabe em 1 linha padrão do Lollapalooza (até 14 chars, ex: "FONTAINES D.C.", "TRAVIS SCOTT")
  if (clean.length <= 14 || !clean.includes(" ")) {
    return [{ main: clean }];
  }

  // Caso 2: Padrões com conectores duplos ("OF THE", "OF A", "+ THE", "& THE")
  const doubleConnectors: [string, [string, string]][] = [
    [" OF THE ", ["OF", "THE"]],
    [" OF A ", ["OF", "A"]],
    [" + THE ", ["+", "THE"]],
    [" & THE ", ["&", "THE"]],
    [" AND THE ", ["AND", "THE"]],
  ];
  for (const [pattern, stacked] of doubleConnectors) {
    const idx = clean.indexOf(pattern);
    if (idx > 0) {
      const firstPart = clean.slice(0, idx).trim();
      const secondPart = clean.slice(idx + pattern.length).trim();
      if (firstPart && secondPart) {
        return [
          { main: firstPart, stackedConnector: stacked },
          { main: secondPart },
        ];
      }
    }
  }

  // Caso 3: Padrões com conector simples em nomes longos ("DO", "DA", "DE", "DOS", "DAS")
  const singleConnectors = [" DO ", " DA ", " DE ", " DOS ", " DAS "];
  for (const conn of singleConnectors) {
    const idx = clean.indexOf(conn);
    if (idx > 0 && clean.length > 15) {
      const firstPart = clean.slice(0, idx).trim();
      const secondPart = clean.slice(idx + conn.length).trim();
      if (firstPart && secondPart) {
        return [
          { main: firstPart, stackedConnector: [conn.trim()] },
          { main: secondPart },
        ];
      }
    }
  }

  // Caso 4: Quebra equilibrada em 2 linhas (ex: "THE / NEIGHBOURHOOD", "RED HOT / CHILI PEPPERS")
  const words = clean.split(/\s+/);
  if (words.length === 2) {
    return [{ main: words[0] }, { main: words[1] }];
  }

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

  return [
    { main: words.slice(0, bestIdx).join(" ") },
    { main: words.slice(bestIdx).join(" ") },
  ];
}

/**
 * Agrupa os 35 artistas do undercard em linhas contínuas de 2 a 4 artistas (ou 1 solo para nomes muito longos),
 * mantendo cada artista 100% inteiro em uma única linha (sem quebrar nomes como "TRAVIS SCOTT" em 2 andares).
 * Em 9:16 gera ~14 a 16 linhas densas com texto ampliado e coeso, e em 1:1 gera ~10 a 12 linhas equilibradas.
 */
function buildLollaUndercardRows(
  undercard: SpotifyArtist[],
  isSquare: boolean
): SpotifyArtist[][] {
  if (undercard.length === 0) return [];

  const targetChars = isSquare ? 48 : 34;
  const soloThreshold = isSquare ? 32 : 26;

  const rows: SpotifyArtist[][] = [];
  let currentRow: SpotifyArtist[] = [];
  let currentChars = 0;

  for (const artist of undercard) {
    const clean = artist.name.trim().toUpperCase();
    const len = clean.length;

    // Se o nome for longo demais para caber com outro artista, dá uma linha solo
    if (len >= soloThreshold) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        currentChars = 0;
      }
      rows.push([artist]);
      continue;
    }

    const addedChars = currentRow.length > 0 ? len + 3 : len;
    if (currentChars + addedChars <= targetChars) {
      currentRow.push(artist);
      currentChars += addedChars;
    } else {
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [artist];
      currentChars = len;
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  // Equalização: se a última linha ficou com 1 artista muito curto e a anterior tem 3+, redistribui
  if (rows.length >= 2) {
    const lastRow = rows[rows.length - 1];
    const prevRow = rows[rows.length - 2];
    if (lastRow.length === 1 && prevRow.length >= 3 && lastRow[0].name.length < soloThreshold) {
      const moved = prevRow.pop();
      if (moved) lastRow.unshift(moved);
    }
  }

  return rows;
}

export const LollaWaveTheme: React.FC<ThemeProps> = ({ lineup }) => {
  const isSquare = lineup.aspectRatio === "1:1";

  const allArtists =
    lineup.allArtists && lineup.allArtists.length > 0
      ? lineup.allArtists
      : [
          ...lineup.singleStageHeadliners,
          ...lineup.singleStageSubHeadliners,
          ...lineup.singleStageUndercard,
        ];

  // Coluna Esquerda (Ciano): 10 Headliners com cap-height uniforme e alinhados à direita
  const headliners = allArtists.slice(0, 10);
  // Coluna Direita (Amarelo-Limão): 35 artistas do Undercard em fileiras densas e agrupadas
  const undercard = allArtists.slice(10);
  const undercardRows = buildLollaUndercardRows(undercard, isSquare);

  const rawTitle = (lineup.title || "FESTIQ STUDIO").trim();
  const titleLen = rawTitle.length;

  return (
    <div className="w-full h-full bg-[#EB5746] text-[#181818] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Arte Oficial Limpa de Fundo embutida como Data URI (zero falhas no html-to-image e offline) */}
      <img
        src={LOLLA_BG_DATA_URI}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
      />

      {/* 2. Cabeçalho Oficial: Data/Local à Esquerda (Ciano) + Wordmark 3D Extrudado à Direita (Amarelo) */}
      <div
        className={`relative z-10 w-full flex items-center ${
          isSquare ? "pt-[5.5%] pb-1" : "pt-[6.8%] pb-1.5"
        }`}
      >
        {/* Data e Local (Coluna Ciano: 0% a 38.4%, com pl-6 para nunca encostar no "15" do canto superior esquerdo) */}
        <div className="w-[38.4%] text-right pl-6 sm:pl-7 pr-2">
          <p
            className={`font-sans font-extrabold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9.5px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            Março 19, 20 e 21 de 2027
          </p>
          <p
            className={`font-sans font-bold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9.5px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            Autódromo de Interlagos
          </p>
          <p
            className={`font-sans font-bold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9.5px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            São Paulo, SP
          </p>
        </div>

        {/* Logo Principal 3D Branco/Preto estilo Lollapalooza Brasil (pr-10 para não encostar nos hibiscos do canto direito) */}
        <div className="w-[61.6%] pl-2 pr-9 sm:pr-11 flex flex-col items-center justify-center">
          <div className="relative inline-flex flex-col items-center -rotate-[1.5deg]">
            <span
              className={`font-lolla uppercase text-white tracking-[0.03em] leading-[0.88] select-none text-center whitespace-nowrap ${
                isSquare
                  ? titleLen > 16
                    ? "text-lg sm:text-xl"
                    : titleLen > 12
                    ? "text-xl sm:text-2xl"
                    : "text-2xl sm:text-[28px]"
                  : titleLen > 16
                  ? "text-base sm:text-lg"
                  : titleLen > 12
                  ? "text-lg sm:text-xl"
                  : "text-xl sm:text-2xl"
              }`}
              style={{
                WebkitTextStroke: "2px #141414",
                paintOrder: "stroke fill",
                textShadow:
                  "1px 1px 0 #141414, 2px 2px 0 #141414, 3px 3px 0 #141414, 4px 4px 0 #141414",
              }}
            >
              {rawTitle}
            </span>
            <span
              className={`bg-[#141414] text-white font-lolla uppercase tracking-[0.22em] px-2.5 py-[1px] rounded-full mt-1 shadow-[1.5px_2px_0px_#141414] ${
                isSquare ? "text-[7px] sm:text-[8.5px]" : "text-[6.8px] sm:text-[7.8px]"
              }`}
            >
              BRASIL
            </span>
          </div>
        </div>
      </div>

      {/* 3. Corpo Principal do Lineup: Coluna Esquerda (38.4% Ciano) + Coluna Direita (61.6% Amarelo) */}
      <div
        className={`relative z-10 flex-1 w-full flex items-stretch overflow-hidden ${
          isSquare ? "pt-1 pb-[5.8%]" : "pt-1 pb-[6.8%]"
        }`}
      >
        {/* COLUNA ESQUERDA (38.4%): 10 Headliners com Cap-Height Uniforme, Grande Destaque e Zero Truncamento */}
        <div className="w-[38.4%] flex flex-col justify-between text-right pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-0.5">
          {headliners.map((artist) => {
            const lines = formatHeadlinerLines(artist.name);
            const maxEffectiveLen = Math.max(
              ...lines.map(
                (l) => l.main.length + (l.stackedConnector ? 2.5 : 0)
              )
            );

            const sizeStyle = isSquare
              ? maxEffectiveLen > 15
                ? "clamp(13.5px, 2.9cqw, 16.5px)"
                : maxEffectiveLen > 12
                ? "clamp(15px, 3.3cqw, 18.5px)"
                : "clamp(17px, 3.8cqw, 21.5px)"
              : maxEffectiveLen > 15
                ? "clamp(12px, 3.6cqw, 15px)"
                : maxEffectiveLen > 12
                ? "clamp(13.5px, 4.0cqw, 17px)"
                : "clamp(15.5px, 4.5cqw, 19.5px)";

            return (
              <div
                key={artist.id}
                className="flex flex-col items-end justify-center leading-none"
              >
                {lines.map((lineObj, lIdx) => (
                  <div
                    key={lIdx}
                    className="inline-flex items-center justify-end font-lolla font-black uppercase text-[#181818] tracking-[-0.02em] whitespace-nowrap"
                    style={{
                      fontSize: sizeStyle,
                      lineHeight: lines.length > 1 ? "0.86" : "0.92",
                      WebkitTextStroke: "0.5px #181818",
                    }}
                  >
                    <span>{lineObj.main}</span>
                    {lineObj.stackedConnector && (
                      <span
                        className="inline-flex flex-col items-start justify-center ml-[3px] text-[0.46em] leading-[0.86] tracking-normal"
                        style={{ WebkitTextStroke: "0.25px #181818" }}
                      >
                        {lineObj.stackedConnector.map((cWord, cIdx) => (
                          <span key={cIdx}>{cWord}</span>
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA (61.6%): 35 Artistas do Undercard em Fileiras Coesas, Nomes Maiores e Agrupados com Bullet */}
        <div className="w-[61.6%] flex flex-col justify-between text-center pl-1 sm:pl-1.5 pr-2.5 sm:pr-3 py-0.5 overflow-hidden">
          {undercardRows.map((row, rIdx) => {
            const totalChars =
              row.reduce((acc, a) => acc + a.name.length, 0) +
              (row.length - 1) * 3;

            // Escala adaptativa geométrica calibrada via cqw (container query width):
            const fontSizeStyle = isSquare
              ? totalChars > 45
                ? "clamp(11.5px, 2.3cqw, 14px)"
                : totalChars > 36
                ? "clamp(12.5px, 2.5cqw, 15.5px)"
                : "clamp(13.5px, 2.7cqw, 17px)"
              : totalChars > 34
                ? "clamp(10.2px, 2.7cqw, 12.5px)"
                : totalChars > 26
                ? "clamp(11.2px, 2.95cqw, 13.6px)"
                : "clamp(12px, 3.15cqw, 14.5px)";

            return (
              <div
                key={rIdx}
                className="w-full flex items-center justify-center flex-nowrap leading-none overflow-hidden"
                style={{ fontSize: fontSizeStyle }}
              >
                {row.map((artist, aIdx) => {
                  const upperName = artist.name.trim().toUpperCase();
                  return (
                    <React.Fragment key={artist.id}>
                      <span
                        className="font-lolla font-black uppercase text-[#181818] tracking-[-0.01em] whitespace-nowrap"
                        style={{
                          WebkitTextStroke: "0.32px #181818",
                        }}
                      >
                        {upperName}
                      </span>
                      {aIdx < row.length - 1 && (
                        <span
                          className={`text-[#26B6D4] font-sans font-black leading-none mx-1 sm:mx-1.5 select-none ${
                            isSquare
                              ? "text-[8px] sm:text-[9.5px]"
                              : "text-[7.5px] sm:text-[8.5px]"
                          }`}
                        >
                          •
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Barra Compacta de Assinatura Festiq no Rodapé (Sem Logos Corporativos de Terceiros) */}
      <div
        className={`relative z-10 w-full bg-[#181512] px-3.5 flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-white/85 uppercase ${
          isSquare ? "py-1" : "py-1.5"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-[1px] rounded-sm bg-[#E2F018] text-[#141414] font-black">
            FESTIQ
          </span>
          <span className="px-1.5 py-[1px] rounded-sm bg-[#63CBD8] text-[#141414] font-black">
            SPOTIFY API
          </span>
          <span className="text-white/60 hidden sm:inline">
            {lineup.subtitle}
          </span>
        </div>
        <div className="text-right text-white/75 font-bold tracking-wider">
          <span>{isSquare ? "1080 × 1080 PX" : "1080 × 1920 PX"}</span>
          <span className="mx-1 text-[#E2F018]">•</span>
          <span>{allArtists.length} ARTISTAS</span>
        </div>
      </div>
    </div>
  );
};
