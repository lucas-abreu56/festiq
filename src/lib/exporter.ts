import { toPng } from "html-to-image";

/**
 * Exporta o nó do pôster em resolução 1080x1920 (9:16) ou 1080x1080 (1:1) como PNG de alta definição.
 */
export async function exportPosterAsPng(node: HTMLElement): Promise<string> {
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continua mesmo se document.fonts falhar
    }
  }

  // Garante que todas as imagens (inclusive data-URIs e background assets) estejam decodificadas
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      if (img.decode) {
        try {
          await img.decode();
        } catch {
          // ignora falha de decode
        }
      }
    })
  );

  const aspectRatio = node.getAttribute("data-aspect-ratio") || "9:16";
  const isSquare = aspectRatio === "1:1";

  const baseWidth = isSquare ? 540 : 360;
  const baseHeight = isSquare ? 540 : 640;
  const targetWidth = 1080;
  const targetHeight = isSquare ? 1080 : 1920;
  const ratio = isSquare ? 2 : 3;

  const baseOptions = {
    width: baseWidth,
    height: baseHeight,
    canvasWidth: targetWidth,
    canvasHeight: targetHeight,
    pixelRatio: ratio,
    quality: 1,
    cacheBust: false,
    style: {
      transform: "none",
      left: "0px",
      top: "0px",
      position: "relative",
      visibility: "visible",
      opacity: "1",
    },
  };

  try {
    const dataUrl = await toPng(node, {
      ...baseOptions,
      skipFonts: false,
    });

    if (dataUrl && dataUrl.length > 1000) {
      return dataUrl;
    }
    throw new Error("PNG gerado vazio, tentando fallback de fontes.");
  } catch (firstErr) {
    console.warn("Tentando fallback de exportação:", firstErr);
    try {
      return await toPng(node, {
        ...baseOptions,
        skipFonts: true,
      });
    } catch (error) {
      console.error("Erro ao gerar imagem com html-to-image:", error);
      throw new Error("Não foi possível renderizar a imagem do pôster.");
    }
  }
}

/**
 * Dispara o download automático do PNG gerado.
 */
export function downloadDataUrl(dataUrl: string, fileName = "festiq-lineup.png"): void {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Tenta compartilhar o pôster nativamente pelo Web Share API no mobile.
 */
export async function sharePosterImage(
  dataUrl: string,
  title = "Meu Festival Festiq"
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.canShare) {
    return false;
  }

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], "festiq-festival.png", { type: "image/png" });

    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text: "Veja o lineup do meu festival criado no Festiq! #Festiq #Lineup",
        files: [file],
      });
      return true;
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("Falha no compartilhamento nativo:", err);
    }
  }

  return false;
}
