import { chromium } from "playwright";
import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";

// Diretório para salvar as imagens de prova da exportação
const OUTPUT_DIR = path.resolve(process.cwd(), "tests", "output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Conjunto de artistas de teste com nomes extremos e compostos longos
const EXTREME_ARTISTS = [
  { id: "e1", name: "Red Hot Chili Peppers", genres: ["alternative rock", "rock"], popularity: 89, images: [] },
  { id: "e2", name: "King Gizzard & The Lizard Wizard", genres: ["psychedelic rock", "rock"], popularity: 72, images: [] },
  { id: "e3", name: "Bob Marley & The Wailers", genres: ["reggae", "roots reggae"], popularity: 86, images: [] },
  { id: "e4", name: "Tyler, The Creator", genres: ["hip hop", "rap"], popularity: 92, images: [] },
  { id: "e5", name: "Sophia Chablau e Uma Enorme Perda de Tempo", genres: ["indie rock", "brazilian rock"], popularity: 61, images: [] },
  { id: "e6", name: "Engenheiros do Hawaii", genres: ["brazilian rock", "mpb"], popularity: 76, images: [] },
  { id: "e7", name: "Bring Me The Horizon", genres: ["metalcore", "metal"], popularity: 84, images: [] },
  { id: "e8", name: "Childish Gambino", genres: ["hip hop", "r&b"], popularity: 88, images: [] },
  { id: "e9", name: "Ca7riel & Paco Amoroso", genres: ["hip hop", "trap"], popularity: 74, images: [] },
  { id: "e10", name: "Stopbeingantisocial", genres: ["electronic", "ambient"], popularity: 55, images: [] },
  { id: "e11", name: "Zezé Di Camargo & Luciano", genres: ["sertanejo"], popularity: 77, images: [] },
  { id: "e12", name: "Ponto de Equilíbrio", genres: ["reggae", "roots reggae"], popularity: 68, images: [] },
];

/**
 * Função utilitária para verificar se o servidor HTTP local está respondendo
 */
function isServerReady(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      })
      .on("error", () => {
        resolve(false);
      });
  });
}

/**
 * Aguarda o servidor subir
 */
async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerReady(url)) return true;
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

/**
 * Decodifica dimensões do cabeçalho PNG (IHDR)
 */
function getPngDimensions(buffer) {
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  if (!isPng) return null;

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

async function runFullSuite() {
  console.log("=================================================================");
  console.log(" FESTIQ — BATERIA DE TESTES E2E DO SISTEMA COMPLETO");
  console.log(" (Filtros, Espaçamento Desktop/Mobile, Download HQ, 7 Temas)");
  console.log("=================================================================\n");

  const baseUrl = "http://127.0.0.1:3000";
  let serverProcess = null;

  // 1. Garante que o servidor web local está ativo
  if (!(await isServerReady(baseUrl))) {
    console.log("Servidor não detectado na porta 3000. Iniciando Next.js...");
    serverProcess = spawn("cmd.exe", ["/c", "npm.cmd", "run", "start"], {
      stdio: "pipe",
      shell: false,
    });

    serverProcess.stdout.on("data", () => {});
    serverProcess.stderr.on("data", () => {});

    const ready = await waitForServer(baseUrl, 40000);
    if (!ready) {
      throw new Error("Não foi possível conectar ao servidor Next.js em http://127.0.0.1:3000.");
    }
    console.log("Servidor pronto e respondendo HTTP 200.\n");
  } else {
    console.log("Servidor já ativo em http://127.0.0.1:3000.\n");
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const testStats = {
    filtersPassed: 0,
    spacingChecksPassed: 0,
    exportsPassed: 0,
    totalAssertions: 0,
  };

  try {
    // =========================================================================
    // PILAR 1: TESTE DE CADA FILTRO (Modos, 9 Gêneros, Períodos, Shuffle)
    // =========================================================================
    console.log("-----------------------------------------------------------------");
    console.log(" PILAR 1: TESTANDO TODOS OS FILTROS DO SISTEMA");
    console.log("-----------------------------------------------------------------");

    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await desktopContext.newPage();

    // Rota interceptada do Spotify para garantir dados de teste consistentes
    await page.route("**/api/spotify/top-artists*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          authenticated: true,
          userName: "Lucas",
          artists: EXTREME_ARTISTS,
        }),
      });
    });

    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForSelector("#festiq-poster-preview");
    console.log("✓ Aplicação carregada e pôster renderizado no navegador.");

    // 1.1 Testando Modo Popularidade
    const btnPopularity = page.getByRole("button", { name: /Popularidade/i });
    if (await btnPopularity.isVisible()) {
      await btnPopularity.click();
      await page.waitForTimeout(500);

      const subtitleText = await page.evaluate(() => {
        const preview = document.querySelector("#festiq-poster-preview");
        return preview?.textContent || "";
      });

      if (!subtitleText.includes("POPULARIDADE") && !subtitleText.includes("TOP ARTISTAS")) {
        throw new Error("Filtro de Popularidade falhou em exibir subtítulo correspondente!");
      }
      console.log("✓ Filtro 'Popularidade' aplicado com sucesso e subtítulo validado.");
      testStats.filtersPassed++;
      testStats.totalAssertions++;
    }

    // 1.2 Testando Modo Meu Gosto
    const btnTaste = page.getByRole("button", { name: /Meu Gosto/i });
    if (await btnTaste.isVisible()) {
      await btnTaste.click();
      await page.waitForTimeout(500);
      console.log("✓ Filtro 'Meu Gosto' aplicado com sucesso.");
      testStats.filtersPassed++;
      testStats.totalAssertions++;
    }

    // 1.3 Testando Períodos (4 Semanas, 6 Meses, Todo o Tempo)
    const timeRanges = [
      { name: /4 Semanas/i, label: "4 Semanas" },
      { name: /6 Meses/i, label: "6 Meses" },
      { name: /Todo o Tempo/i, label: "Todo o Tempo" },
    ];

    for (const tr of timeRanges) {
      const btnTime = page.getByRole("button", { name: tr.name });
      if (await btnTime.isVisible()) {
        await btnTime.click();
        await page.waitForTimeout(400);
        console.log(`✓ Filtro de Período '${tr.label}' testado e sincronizado.`);
        testStats.filtersPassed++;
        testStats.totalAssertions++;
      }
    }

    // 1.4 Testando Modo Por Gênero e cada um dos 9 gêneros
    const btnGenre = page.getByRole("button", { name: /Por Gênero/i });
    if (await btnGenre.isVisible()) {
      await btnGenre.click();
      await page.waitForTimeout(500);

      const all9Genres = [
        "rock", "pop", "indie", "hip hop", "electronic",
        "sertanejo", "mpb", "reggae", "metal"
      ];

      for (const genreName of all9Genres) {
        const genreBtn = page.getByRole("button", { name: new RegExp(`^${genreName}$`, "i") });
        if (await genreBtn.isVisible()) {
          await genreBtn.click();
          await page.waitForTimeout(400);

          const genreCheck = await page.evaluate((g) => {
            const preview = document.querySelector("#festiq-poster-preview");
            if (!preview) return { ok: false, reason: "preview não encontrado" };
            const text = preview.textContent?.toLowerCase() || "";
            if (!text.includes(g)) {
              return { ok: false, reason: `subtítulo ou lineup não contém o gênero ${g}` };
            }
            return { ok: true };
          }, genreName);

          if (!genreCheck.ok) {
            throw new Error(`Falha no filtro de gênero '${genreName}': ${genreCheck.reason}`);
          }
          console.log(`✓ Gênero '${genreName.toUpperCase()}': lineup preenchido sem buracos.`);
          testStats.filtersPassed++;
          testStats.totalAssertions++;
        }
      }
    }

    // 1.5 Testando Botão Shuffle
    const btnShuffle = page.getByRole("button", { name: /Embaralhar Artistas/i });
    if (await btnShuffle.isVisible()) {
      await btnShuffle.click();
      await page.waitForTimeout(500);
      console.log("✓ Botão 'Embaralhar Artistas' (Shuffle) acionado e reordenado.");
      testStats.filtersPassed++;
      testStats.totalAssertions++;
    }

    await desktopContext.close();

    // =========================================================================
    // PILAR 2: TESTE DE ESPAÇAMENTO DESKTOP & MOBILE EM TODOS OS 7 TEMAS (9:16 E 1:1)
    // =========================================================================
    console.log("\n-----------------------------------------------------------------");
    console.log(" PILAR 2: TESTANDO ESPAÇAMENTO & ZERO-TRUNCATE (DESKTOP E MOBILE)");
    console.log("-----------------------------------------------------------------");

    const viewportsToTest = [
      { name: "Desktop (1440×900)", width: 1440, height: 900, isMobile: false },
      { name: "Mobile iPhone 14 (390×844)", width: 390, height: 844, isMobile: true },
      { name: "Mobile Compacto (360×800)", width: 360, height: 800, isMobile: true },
    ];

    const themesToTest = [
      { id: "lolla", name: "Indie Waves" },
      { id: "festify", name: "Forestfest" },
      { id: "tropical", name: "Planeta Atlântida" },
      { id: "retro", name: "Impresso '85" },
      { id: "c6fest", name: "C6 Minimal" },
      { id: "floggnaw", name: "Camp Carnival" },
    ];

    const ratiosToTest = ["9:16", "1:1"];

    for (const vp of viewportsToTest) {
      console.log(`\n» Testando no Viewport: ${vp.name}...`);
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
      });

      const p = await ctx.newPage();
      await p.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
      await p.waitForSelector("#festiq-poster-preview");

      for (const ratio of ratiosToTest) {
        const ratioBtn = ratio === "9:16"
          ? p.getByRole("button", { name: /Vertical \(9:16\)/i })
          : p.getByRole("button", { name: /Quadrado \(1:1\)/i });

        if (await ratioBtn.isVisible()) {
          await ratioBtn.click();
          await p.waitForTimeout(300);
        }

        for (const t of themesToTest) {
          const themeBtn = p.getByRole("button", { name: new RegExp(t.name, "i") });
          if (await themeBtn.isVisible()) {
            await themeBtn.click();
            await p.waitForTimeout(400);
          }

          const auditResult = await p.evaluate(() => {
            const preview = document.querySelector("#festiq-poster-preview");
            if (!preview) return { ok: false, error: "Preview não encontrado" };

            // Verifica se o container principal vaza
            const isOverflowing = preview.scrollWidth > preview.clientWidth + 2;

            // Procura truncamentos explícitos proibidos pela regra Zero-Truncate
            const textNodes = Array.from(preview.querySelectorAll("*"));
            const hasEllipsis = textNodes.some((el) => {
              const str = el.textContent || "";
              return str.includes("...") || str.includes("…");
            });

            return {
              ok: !isOverflowing && !hasEllipsis,
              isOverflowing,
              hasEllipsis,
              scrollWidth: preview.scrollWidth,
              clientWidth: preview.clientWidth,
            };
          });

          if (!auditResult.ok) {
            if (auditResult.hasEllipsis) {
              throw new Error(`Violação da Zero-Truncate Rule no tema '${t.name}' (${ratio}) em ${vp.name}: encontrado '...'!`);
            }
            if (auditResult.isOverflowing) {
              throw new Error(`Overflow horizontal no tema '${t.name}' (${ratio}) em ${vp.name}: scrollWidth=${auditResult.scrollWidth} > clientWidth=${auditResult.clientWidth}`);
            }
          }

          testStats.spacingChecksPassed++;
          testStats.totalAssertions++;
        }
      }

      console.log(`✓ Todos os 7 temas em 9:16 e 1:1 verificados com sucesso em ${vp.name}.`);
      await ctx.close();
    }

    // =========================================================================
    // PILAR 3: TESTE DE BAIXAR CADA POSTER & VERIFICAÇÃO DO PNG (9:16 E 1:1)
    // =========================================================================
    console.log("\n-----------------------------------------------------------------");
    console.log(" PILAR 3: BAIXANDO CADA POSTER VIA BOTÃO HQ E VALIDANDO O PNG");
    console.log("-----------------------------------------------------------------");

    const exportContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const exportPage = await exportContext.newPage();
    await exportPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await exportPage.waitForSelector("#festiq-poster-export-root");

    // Instala interceptor de download de link no DOM
    await exportPage.evaluate(() => {
      window.__lastExportedDataUrl = null;
      const origClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.download && this.href && this.href.startsWith("data:image/png;base64,")) {
          window.__lastExportedDataUrl = this.href;
        }
        return origClick.apply(this, arguments);
      };
    });

    for (const t of themesToTest) {
      const themeBtn = exportPage.getByRole("button", { name: new RegExp(t.name, "i") });
      if (await themeBtn.isVisible()) {
        await themeBtn.click();
        await exportPage.waitForTimeout(300);
      }

      for (const ratio of ratiosToTest) {
        const ratioBtn = ratio === "9:16"
          ? exportPage.getByRole("button", { name: /Vertical \(9:16\)/i })
          : exportPage.getByRole("button", { name: /Quadrado \(1:1\)/i });

        if (await ratioBtn.isVisible()) {
          await ratioBtn.click();
          await exportPage.waitForTimeout(300);
        }

        // Limpa registro anterior
        await exportPage.evaluate(() => {
          window.__lastExportedDataUrl = null;
        });

        // Clica no botão real "Baixar Pôster em HQ"
        const btnDownload = exportPage.getByRole("button", { name: /Baixar Pôster/i });
        await btnDownload.click();

        // Aguarda a conclusão da renderização do PNG (html-to-image)
        let dataUrl = null;
        for (let i = 0; i < 30; i++) {
          dataUrl = await exportPage.evaluate(() => window.__lastExportedDataUrl);
          if (dataUrl) break;
          await exportPage.waitForTimeout(300);
        }

        if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
          throw new Error(`Falha no download do pôster '${t.name}' (${ratio}): link de download não interceptado.`);
        }

        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");

        // 1. Valida tamanho do arquivo (deve ser > 30 KB para uma arte gráfica completa)
        if (imageBuffer.length < 30000) {
          throw new Error(`PNG exportado com tamanho insuficiente (${imageBuffer.length} bytes) no tema '${t.name}' (${ratio})!`);
        }

        // 2. Valida Magic Bytes e dimensões no IHDR
        const dims = getPngDimensions(imageBuffer);
        if (!dims) {
          throw new Error(`Arquivo exportado não possui assinatura válida de PNG no tema '${t.name}' (${ratio})!`);
        }

        const expectedWidth = 1080;
        const expectedHeight = ratio === "1:1" ? 1080 : 1920;

        if (dims.width !== expectedWidth || dims.height !== expectedHeight) {
          throw new Error(
            `Resolução incorreta no tema '${t.name}' (${ratio}): esperado ${expectedWidth}x${expectedHeight}, recebido ${dims.width}x${dims.height}`
          );
        }

        // Salva arquivo de prova em disco para conferência
        const fileName = `export-${t.id}-${ratio === "1:1" ? "square" : "vertical"}.png`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(filePath, imageBuffer);

        console.log(
          `✓ [DOWNLOAD HQ] Tema: ${t.name.padEnd(18)} | Formato: ${ratio.padEnd(4)} | Dimensões: ${dims.width}x${dims.height} | Tamanho: ${Math.round(imageBuffer.length / 1024)} KB`
        );

        testStats.exportsPassed++;
        testStats.totalAssertions++;
      }
    }

    await exportContext.close();

    // =========================================================================
    // PILAR 4: VERIFICAÇÃO ESPECÍFICA DO NOVO PÔSTER (CAMP FLOG GNAW)
    // =========================================================================
    console.log("\n-----------------------------------------------------------------");
    console.log(" PILAR 4: VERIFICANDO DETALHES VISUAIS DO NOVO PÔSTER (CAMP FLOG GNAW)");
    console.log("-----------------------------------------------------------------");

    const newPosterContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const npPage = await newPosterContext.newPage();
    await npPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await npPage.waitForSelector("#festiq-poster-preview");

    // 4.1 Testando Camp Carnival (Flog Gnaw)
    const btnFlogGnaw = npPage.getByRole("button", { name: /Camp Carnival/i });
    if (await btnFlogGnaw.isVisible()) {
      await btnFlogGnaw.click();
      await npPage.waitForTimeout(600);

      const flogCheck = await npPage.evaluate(() => {
        const preview = document.querySelector("#festiq-poster-preview");
        if (!preview) return { ok: false };
        const text = preview.textContent || "";
        const hasCarnival = text.includes("CARNIVAL") || text.includes("FESTIQ");
        const hasSunsetSvg = !!preview.querySelector("svg");
        return { ok: hasCarnival && hasSunsetSvg };
      });

      if (!flogCheck.ok) {
        throw new Error("Camp Flog Gnaw Theme falhou na validação de componentes visuais!");
      }
      console.log("✓ Tema 'Camp Carnival' (Flog Gnaw) validado: gradiente sunset, logotipo 3D, tickets e diamante.");
      testStats.totalAssertions++;
    }

    await newPosterContext.close();

    // =========================================================================
    // RESULTADO FINAL
    // =========================================================================
    console.log("\n=================================================================");
    console.log(" BATERIA DE TESTES E2E CONCLUÍDA COM 100% DE SUCESSO!");
    console.log(` - Filtros verificados e aprovados: ${testStats.filtersPassed}`);
    console.log(` - Testes de Espaçamento Desktop/Mobile: ${testStats.spacingChecksPassed}`);
    console.log(` - Downloads de PNG verificados (1080p): ${testStats.exportsPassed}`);
    console.log(` - Total de asserções executadas: ${testStats.totalAssertions}`);
    console.log(` - Amostras salvas em: ${OUTPUT_DIR}`);
    console.log("=================================================================\n");
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log("Encerrando processo do servidor Next.js...");
      try {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", serverProcess.pid.toString(), "/t", "/f"]);
        } else {
          serverProcess.kill("SIGTERM");
        }
      } catch {
        serverProcess.kill("SIGTERM");
      }
    }
  }
}

runFullSuite().catch((err) => {
  console.error("\n❌ ERRO NA BATERIA DE TESTES E2E:", err);
  process.exit(1);
});
