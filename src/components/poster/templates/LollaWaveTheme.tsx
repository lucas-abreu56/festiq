import React from "react";
import { FestivalLineup } from "@/lib/lineup-engine";
import { SpotifyArtist } from "@/lib/mock-artists";

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

function getRowCharWeight(row: SpotifyArtist[]): number {
  const letters = row.reduce((acc, a) => acc + a.name.length, 0);
  const dots = Math.max(0, row.length - 1) * 3;
  return letters + dots;
}

/**
 * Distribui os 35 artistas do undercard em exatamente 10 fileiras (em 1:1) ou 11 fileiras (em 9:16),
 * garantindo SEMPRE de 3 a 4 artistas por linha (jamais 1 ou 2 artistas isolados) e equalizando
 * a soma de caracteres entre as fileiras (trocando nomes longos por curtos quando necessário)
 * para que todas as linhas preencham ~90% da largura da coluna amarela com espaçamento uniforme.
 */
function buildLollaUndercardRows(
  undercard: SpotifyArtist[],
  isSquare: boolean
): SpotifyArtist[][] {
  if (undercard.length === 0) return [];

  const targetRows = Math.min(
    10,
    Math.max(1, Math.round(undercard.length / 3.5))
  );

  // 1. Divide inicialmente os 35 artistas em `targetRows` fileiras de 3 a 4 artistas cada
  const rows: SpotifyArtist[][] = [];
  const baseCount = Math.floor(undercard.length / targetRows);
  const extraCount = undercard.length % targetRows;
  let cursor = 0;

  for (let r = 0; r < targetRows; r++) {
    // Intercala fileiras de 4 e 3 artistas
    const count = baseCount + (r < extraCount ? 1 : 0);
    rows.push(undercard.slice(cursor, cursor + count));
    cursor += count;
  }

  // 2. Equaliza a largura de caracteres entre fileiras (evita que 2-3 nomes de 20 letras fiquem juntos
  // na mesma linha enquanto outra linha fica só com nomes de 5 letras)
  for (let iter = 0; iter < 30; iter++) {
    let heaviestIdx = 0;
    let lightestIdx = 0;
    let maxWeight = -Infinity;
    let minWeight = Infinity;

    rows.forEach((row, idx) => {
      const w = getRowCharWeight(row);
      if (w > maxWeight) {
        maxWeight = w;
        heaviestIdx = idx;
      }
      if (w < minWeight) {
        minWeight = w;
        lightestIdx = idx;
      }
    });

    if (maxWeight - minWeight <= 6 || heaviestIdx === lightestIdx) {
      break;
    }

    const heavyRow = rows[heaviestIdx];
    const lightRow = rows[lightestIdx];

    // Procura o par (artista longo na linha pesada, artista curto na linha leve) que melhor equilibra ambas
    const idealDiff = (maxWeight - minWeight) / 2;
    let bestH = -1;
    let bestL = -1;
    let bestScore = Infinity;

    for (let h = 0; h < heavyRow.length; h++) {
      for (let l = 0; l < lightRow.length; l++) {
        const delta = heavyRow[h].name.length - lightRow[l].name.length;
        if (delta > 1) {
          const score = Math.abs(delta - idealDiff);
          if (score < bestScore) {
            bestScore = score;
            bestH = h;
            bestL = l;
          }
        }
      }
    }

    if (bestH !== -1 && bestL !== -1) {
      const temp = heavyRow[bestH];
      heavyRow[bestH] = lightRow[bestL];
      lightRow[bestL] = temp;
    } else {
      break;
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

  // Coluna Esquerda (Ciano): 10 Headliners com altura uniforme e alinhados à direita
  const headliners = allArtists.slice(0, 10);
  // Coluna Direita (Amarelo-Limão): 35 artistas do Undercard em fileiras equalizadas de 3 a 4 nomes
  const undercard = allArtists.slice(10);
  const undercardRows = buildLollaUndercardRows(undercard, isSquare);

  const rawTitle = (lineup.title || "FESTIQ STUDIO").trim();
  const titleLen = rawTitle.length;

  return (
    <div className="w-full h-full bg-[#EB5746] text-[#181818] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Arte Oficial Limpa de Fundo (Moldura "15", Hibiscos, Mão Rock, Espirais Ciano, Campo Amarelo, Pássaro e Crowd-Surfer) */}
      <img
        src="/images/lolla-bg-clean.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
      />

      {/* 2. Cabeçalho Oficial: Data/Local à Esquerda (Ciano) + Wordmark 3D Extrudado à Direita (Amarelo, longe dos hibiscos) */}
      <div
        className={`relative z-10 w-full flex items-center ${
          isSquare ? "pt-[5.5%] pb-1" : "pt-[6.8%] pb-1.5"
        }`}
      >
        {/* Data e Local (Coluna Ciano: 0% a 38.4%, com pl-7 para nunca encostar no "15" do canto superior esquerdo) */}
        <div className="w-[38.4%] text-right pl-7 pr-2">
          <p
            className={`font-sans font-extrabold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            Março 19, 20 e 21 de 2027
          </p>
          <p
            className={`font-sans font-bold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            Autódromo de Interlagos
          </p>
          <p
            className={`font-sans font-bold text-[#161616] tracking-tight leading-[1.12] ${
              isSquare ? "text-[8px] sm:text-[9px]" : "text-[7.5px] sm:text-[8.5px]"
            }`}
          >
            São Paulo, SP
          </p>
        </div>

        {/* Logo Principal 3D Branco/Preto estilo Lollapalooza Brasil (pr-11 para não encostar nos hibiscos do canto direito) */}
        <div className="w-[61.6%] pl-2 pr-10 sm:pr-12 flex flex-col items-center justify-center">
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
                isSquare ? "text-[7px] sm:text-[8px]" : "text-[6.8px] sm:text-[7.8px]"
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
          isSquare ? "pt-0.5 pb-[5.8%]" : "pt-1 pb-[6.8%]"
        }`}
      >
        {/* COLUNA ESQUERDA (38.4%): 10 Headliners com Cap-Height Uniforme e Zero Truncamento */}
        <div className="w-[38.4%] flex flex-col justify-between text-right pl-5 pr-1.5 sm:pr-2 py-0.5">
          {headliners.map((artist) => {
            const lines = formatHeadlinerLines(artist.name);
            const maxEffectiveLen = Math.max(
              ...lines.map(
                (l) => l.main.length + (l.stackedConnector ? 2.5 : 0)
              )
            );

            const sizeClass = isSquare
              ? maxEffectiveLen > 16
                ? "text-[12px] sm:text-[13.5px]"
                : maxEffectiveLen > 13
                ? "text-[14px] sm:text-[15.5px]"
                : maxEffectiveLen > 11
                ? "text-[15.5px] sm:text-[17.5px]"
                : "text-[17px] sm:text-[19px]"
              : maxEffectiveLen > 16
              ? "text-[11px] sm:text-[12.2px]"
              : maxEffectiveLen > 13
              ? "text-[12.8px] sm:text-[14.2px]"
              : maxEffectiveLen > 11
              ? "text-[14.5px] sm:text-[16.2px]"
              : "text-[16.5px] sm:text-[18.5px]";

            return (
              <div
                key={artist.id}
                className="flex flex-col items-end justify-center leading-none"
              >
                {lines.map((lineObj, lIdx) => (
                  <div
                    key={lIdx}
                    className={`inline-flex items-center justify-end font-lolla font-black uppercase text-[#181818] tracking-[-0.02em] whitespace-nowrap ${sizeClass}`}
                    style={{
                      lineHeight: lines.length > 1 ? "0.86" : "0.91",
                      WebkitTextStroke: "0.45px #181818",
                    }}
                  >
                    <span>{lineObj.main}</span>
                    {lineObj.stackedConnector && (
                      <span
                        className="inline-flex flex-col items-start justify-center ml-[3px] text-[0.46em] leading-[0.86] tracking-normal"
                        style={{ WebkitTextStroke: "0.2px #181818" }}
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

        {/* COLUNA DIREITA (61.6%): 35 Artistas do Undercard em Fileiras Equalizadas (3 a 4 Artistas) Justificadas Ponta a Ponta */}
        <div className="w-[61.6%] flex flex-col justify-between text-left pl-2 pr-4 sm:pr-5 py-0.5">
          {undercardRows.map((row, rIdx) => {
            const totalRowWeight = getRowCharWeight(row);

            // Como todas as linhas foram equalizadas para ~36-44 caracteres, o tamanho da fonte é
            // consistente em todo o bloco amarelo, ajustando apenas 1px caso uma linha seja mais densa.
            const rowSizeClass = isSquare
              ? totalRowWeight > 46
                ? "text-[11px] sm:text-[12.2px]"
                : totalRowWeight > 41
                ? "text-[11.8px] sm:text-[13.2px]"
                : "text-[12.6px] sm:text-[14px]"
              : totalRowWeight > 44
              ? "text-[8.8px] sm:text-[9.6px]"
              : totalRowWeight > 39
              ? "text-[9.5px] sm:text-[10.4px]"
              : "text-[10.2px] sm:text-[11.2px]";

            return (
              <div
                key={rIdx}
                className="w-full flex items-center justify-between leading-none whitespace-nowrap"
              >
                {row.map((artist, aIdx) => (
                  <React.Fragment key={artist.id}>
                    <span
                      className={`font-lolla font-black uppercase text-[#181818] tracking-[-0.01em] whitespace-nowrap ${rowSizeClass}`}
                      style={{
                        lineHeight: "0.94",
                        WebkitTextStroke: "0.35px #181818",
                      }}
                    >
                      {artist.name}
                    </span>
                    {aIdx < row.length - 1 && (
                      <span
                        className={`text-[#26B6D4] font-sans font-black leading-none mx-0.5 select-none ${
                          isSquare
                            ? "text-[9px] sm:text-[10px]"
                            : "text-[7.5px] sm:text-[8.5px]"
                        }`}
                      >
                        •
                      </span>
                    )}
                  </React.Fragment>
                ))}
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
