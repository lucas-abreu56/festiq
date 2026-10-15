import { toPng } from "html-to-image";

/**
 * Exporta o nó do pôster em resolução 1080x1920 como PNG de alta definição.
 */
export async function exportPosterAsPng(node: HTMLElement): Promise<string> {
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 1, // O nó já possui 1080 × 1920 px fixos
      quality: 0.98,
      cacheBust: true,
      skipFonts: false,
    });
    return dataUrl;
  } catch (error) {
    console.error("Erro ao gerar imagem com html-to-image:", error);
    throw new Error("Não foi possível renderizar a imagem do pôster.");
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
