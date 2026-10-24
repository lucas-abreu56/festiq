import { chromium } from "playwright";
import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve(process.cwd(), "tests", "output", "responsive");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerReady(url)) return true;
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

const VIEWPORTS = [
  { name: "Mobile Compacto (360×740)", width: 360, height: 740, isMobile: true },
  { name: "Mobile Padrão iPhone (390×844)", width: 390, height: 844, isMobile: true },
  { name: "Mobile Android Pixel (412×915)", width: 412, height: 915, isMobile: true },
  { name: "Tablet Portrait iPad (768×1024)", width: 768, height: 1024, isTablet: true },
  { name: "Tablet iPad Air (820×1180)", width: 820, height: 1180, isTablet: true },
  { name: "Desktop Standard (1280×800)", width: 1280, height: 800, isDesktop: true },
  { name: "Desktop Wide (1440×900)", width: 1440, height: 900, isDesktop: true },
];

async function runResponsiveAudit() {
  console.log("=================================================================");
  console.log(" FESTIQ — AUDITORIA DE RESPONSIVIDADE E DESIGN MULTIDISPOSITIVO");
  console.log(" (Mobile 360-412px, Tablet 768-820px, Desktop 1280-1440px)");
  console.log("=================================================================\n");

  const baseUrl = "http://127.0.0.1:3000";
  let serverProcess = null;

  if (!(await isServerReady(baseUrl))) {
    console.log("Iniciando servidor local Next.js...");
    serverProcess = spawn("cmd.exe", ["/c", "npm.cmd", "run", "start"], {
      stdio: "pipe",
      shell: false,
    });

    const ready = await waitForServer(baseUrl, 40000);
    if (!ready) {
      throw new Error("Servidor não subiu a tempo na porta 3000.");
    }
    console.log("Servidor pronto!");
  } else {
    console.log("Servidor já está rodando em http://127.0.0.1:3000");
  }

  const browser = await chromium.launch({ headless: true });
  let totalChecks = 0;
  let passedChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passedChecks++;
    } else {
      console.error(`  ✗ FALHA: ${message}`);
      throw new Error(`FALHA NA VERIFICAÇÃO: ${message}`);
    }
  }

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Testando Viewport: ${vp.name} ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // 1. Verificação de Ausência de Overflow Horizontal (Anti-Corte)
      const hasOverflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return docEl.scrollWidth > docEl.clientWidth + 2; // tolerância mínima de 2px de subpixel
      });
      assert(!hasOverflow, `Sem overflow horizontal (largura útil: ${vp.width}px)`);

      // 2. Verificação do Header
      if (vp.isMobile) {
        // No mobile: Sobre & FAQ deve estar oculto no header para não amassar a navegação
        const sobreHeaderVisible = await page.evaluate(() => {
          const el = document.querySelector('header a[href="/sobre"]');
          if (!el) return false;
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        });
        assert(!sobreHeaderVisible, "Header Mobile: 'Sobre & FAQ' oculto para manter respiro");

        // Botão Conectar Spotify deve estar em 1 linha
        const loginBtnBox = await page.locator('header a[href="/api/auth/login"]').boundingBox();
        assert(loginBtnBox !== null, "Botão 'Conectar Spotify' visível no header");
        if (loginBtnBox) {
          assert(loginBtnBox.height <= 44, `Botão 'Conectar Spotify' com altura adequada de 1 linha (${Math.round(loginBtnBox.height)}px <= 44px)`);
        }
      } else {
        // No tablet e desktop: Sobre & FAQ deve estar visível
        const sobreHeaderVisible = await page.evaluate(() => {
          const el = document.querySelector('header a[href="/sobre"]');
          if (!el) return false;
          const style = window.getComputedStyle(el);
          return style.display !== "none";
        });
        assert(sobreHeaderVisible, "Header Tablet/Desktop: 'Sobre & FAQ' visível");
      }

      // 3. Verificação do Banner CurvedLoop
      const curvedLoopBox = await page.locator('section[aria-label="Banner em curva do festival"]').boundingBox();
      assert(curvedLoopBox !== null, "Banner CurvedLoop presente");
      if (vp.isMobile && curvedLoopBox) {
        assert(curvedLoopBox.height <= 95, `CurvedLoop mobile compacto (${Math.round(curvedLoopBox.height)}px <= 95px)`);
      }

      // 4. Verificação de ausência de 'SPOTIFY API' e jargões técnicos vazados no pôster
      const posterText = await page.locator("#festiq-poster-preview").innerText();
      assert(!posterText.includes("SPOTIFY API"), "Pôster livre de jargão 'SPOTIFY API'");
      assert(posterText.includes("LINEUP OFICIAL") || posterText.includes("FESTIQ"), "Pôster contém branding 'LINEUP OFICIAL' ou 'FESTIQ'");

      // 5. Verificação do subtítulo de preview (livre de menções confusas a 'Festify')
      const previewSubtitle = await page.locator("main").innerText();
      assert(previewSubtitle.includes("Stories e Reels (1080 × 1920)"), "Subtítulo 9:16 limpo e correto ('Stories e Reels')");
      assert(!previewSubtitle.includes("Feed/Festify"), "Subtítulo livre do jargão 'Feed/Festify'");

      // 6. Verificação e Teste de Alternância de Formato para 1:1 Quadrado
      const verticalBtn = page.getByRole("button", { name: /Vertical \(9:16\)/i });
      const squareBtn = page.getByRole("button", { name: /Quadrado \(1:1\)/i });

      const verticalBox = await verticalBtn.boundingBox();
      const squareBox = await squareBtn.boundingBox();
      assert(verticalBox !== null && squareBox !== null, "Botões de proporção (Vertical e Quadrado) renderizados");
      if (verticalBox && squareBox) {
        // Os botões devem estar lado a lado sem sobreposição horizontal
        assert(
          verticalBox.x + verticalBox.width <= squareBox.x + 1,
          `Botões lado a lado sem sobreposição (${Math.round(verticalBox.x + verticalBox.width)}px <= ${Math.round(squareBox.x)}px)`
        );

        // Ícone do smartphone deve estar 100% contido dentro da caixa do botão vertical
        const smartphoneIcon = verticalBtn.locator("svg");
        const iconBox = await smartphoneIcon.boundingBox();
        if (iconBox) {
          assert(
            iconBox.x >= verticalBox.x - 1,
            `Ícone Smartphone contido dentro do botão vertical (${Math.round(iconBox.x)}px >= ${Math.round(verticalBox.x)}px)`
          );
        }
      }

      await squareBtn.click();
      await page.waitForTimeout(400);

      const previewSubtitleSquare = await page.locator("main").innerText();
      assert(previewSubtitleSquare.includes("Feed e Posts (1080 × 1080)"), "Subtítulo 1:1 limpo e correto ('Feed e Posts')");
      assert(!previewSubtitleSquare.includes("Feed/Festify"), "Subtítulo 1:1 livre do jargão 'Feed/Festify'");

      // Verifica ausência de overflow no 1:1
      const overflowSquare = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
      });
      assert(!overflowSquare, "Sem overflow horizontal no formato 1:1");

      // 7. Teste de Seleção de Tema (Planeta Atlântida)
      const planetaBtn = page.locator('button:has-text("Planeta Atlântida")');
      await planetaBtn.click();
      await page.waitForTimeout(500);

      const planetaText = await page.locator("#festiq-poster-preview").innerText();
      assert(!planetaText.includes("SPOTIFY API"), "Tema Planeta livre de jargão 'SPOTIFY API'");
      assert(planetaText.includes("LINEUP OFICIAL"), "Tema Planeta contém 'LINEUP OFICIAL'");

      // 8. Captura de Screenshot para comprovação visual
      const filename = `festiq-${vp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: false,
      });
      console.log(`  📸 Screenshot salvo: tests/output/responsive/${filename}`);

      await context.close();
    }

    console.log("\n=================================================================");
    console.log(` BATERIA RESPONSIVA CONCLUÍDA: ${passedChecks}/${totalChecks} ASSERÇÕES VERIFICADAS COM SUCESSO!`);
    console.log("=================================================================");
  } finally {
    await browser.close();

    if (serverProcess && serverProcess.pid) {
      console.log("Encerrando servidor Next.js...");
      try {
        spawn("taskkill", ["/pid", serverProcess.pid.toString(), "/t", "/f"]);
      } catch {
        // Ignora
      }
    }
  }
}

runResponsiveAudit().catch((err) => {
  console.error("Erro fatal na bateria de auditoria:", err);
  process.exit(1);
});
