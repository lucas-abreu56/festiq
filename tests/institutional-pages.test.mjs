import { chromium } from "playwright";
import { spawn } from "child_process";
import http from "http";

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

async function runInstitutionalE2E() {
  console.log("=== INICIANDO VALIDAÇÃO E2E DE PÁGINAS INSTITUCIONAIS COM PLAYWRIGHT ===");

  const appUrl = "http://127.0.0.1:3000";
  let serverProcess = null;

  const serverAlreadyRunning = await isServerReady(appUrl);
  if (!serverAlreadyRunning) {
    console.log("Iniciando servidor local de produção (next start)...");
    const isWindows = process.platform === "win32";
    const cmd = isWindows ? "cmd.exe" : "npm";
    const args = isWindows ? ["/c", "npm", "run", "start"] : ["run", "start"];

    serverProcess = spawn(cmd, args, {
      stdio: "pipe",
      detached: false,
    });

    const ready = await waitForServer(appUrl, 30000);
    if (!ready) {
      throw new Error("O servidor Next.js não inicializou no tempo limite.");
    }
    console.log("Servidor local pronto em http://127.0.0.1:3000.");
  } else {
    console.log("Servidor local já ativo.");
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    // 1. Validar Home -> Sobre pelo Header
    console.log("1. Testando navegação Home -> Sobre pelo Header...");
    await page.goto(appUrl, { waitUntil: "domcontentloaded" });
    const headerAboutLink = page.locator('header a[href="/sobre"]');
    await headerAboutLink.waitFor({ state: "visible" });
    await headerAboutLink.click();
    await page.waitForURL("**/sobre");
    console.log("   ✓ Navegação pelo header funcionou com sucesso.");

    // 2. Validar Conteúdo da Página Sobre
    console.log("2. Validando conteúdo editorial da página Sobre...");
    const titleText = await page.locator("h1").innerText();
    if (!titleText.toLowerCase().includes("gosto musical transformado em festival")) {
      throw new Error(`Título inesperado na página Sobre: ${titleText}`);
    }

    const receiptifyText = await page.locator("text=A inspiração no Receiptify").innerText();
    if (!receiptifyText) {
      throw new Error("Seção do Receiptify não encontrada na página Sobre.");
    }

    const michelleLiuText = await page.locator("text=Michelle Liu").count();
    if (michelleLiuText === 0) {
      throw new Error("Menção à criadora Michelle Liu ausente na página Sobre.");
    }

    const faqItems = await page.locator("text=Perguntas Frequentes (FAQ)").count();
    if (faqItems === 0) {
      throw new Error("Seção de FAQ ausente na página Sobre.");
    }
    console.log("   ✓ História, Receiptify, FAQ e créditos validados.");

    // 3. Testar Responsividade e Anti-Overflow em 360px e 390px na página Sobre
    console.log("3. Testando viewport mobile e ausência de corte horizontal em /sobre...");
    for (const width of [360, 390, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (overflow) {
        throw new Error(`Overflow horizontal detectado na página /sobre com viewport ${width}px!`);
      }
      console.log(`   ✓ Viewport ${width}px: sem overflow lateral (scrollWidth <= clientWidth).`);
    }

    // 4. Validar Navegação Cruzada Sobre -> Privacidade -> Termos -> Home
    console.log("4. Testando navegação cruzada entre páginas institucionais...");
    await page.locator('a[href="/privacidade"]').first().click();
    await page.waitForURL("**/privacidade");
    console.log("   ✓ Sobre -> Privacidade: OK.");

    // Validar ausência de overflow em /privacidade
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 800 });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (overflow) {
        throw new Error(`Overflow horizontal em /privacidade no viewport ${width}px!`);
      }
    }
    console.log("   ✓ /privacidade responsiva em 360px/390px sem overflow.");

    // Ir para Termos
    await page.locator('a[href="/termos"]').first().click();
    await page.waitForURL("**/termos");
    console.log("   ✓ Privacidade -> Termos: OK.");

    // Validar ausência de overflow em /termos
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 800 });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (overflow) {
        throw new Error(`Overflow horizontal em /termos no viewport ${width}px!`);
      }
    }
    console.log("   ✓ /termos responsiva em 360px/390px sem overflow.");

    // Voltar para a Home pelo botão Voltar ao Gerador
    await page.locator('a:has-text("Voltar ao Gerador")').first().click();
    await page.waitForURL("http://127.0.0.1:3000/");
    console.log("   ✓ Retorno para o Gerador principal (Home): OK.");

    // 5. Validar links do Rodapé na Home
    console.log("5. Validando links institucionais no rodapé da Home...");
    await page.setViewportSize({ width: 1280, height: 800 });
    const footerAbout = await page.locator('footer a[href="/sobre"]').count();
    const footerPrivacy = await page.locator('footer a[href="/privacidade"]').count();
    const footerTerms = await page.locator('footer a[href="/termos"]').count();
    const footerGithub = await page.locator('footer a[href*="github.com"]').count();

    if (!footerAbout || !footerPrivacy || !footerTerms || !footerGithub) {
      throw new Error("Algum link institucional obrigatório do rodapé está ausente.");
    }
    console.log("   ✓ Todos os links do rodapé (Sobre, Privacidade, Termos, GitHub) estão presentes e íntegros.");

    console.log("\n=================================================================");
    console.log(" TODAS AS PÁGINAS INSTITUCIONAIS FORAM VALIDADAS COM SUCESSO!");
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
        // Ignora erro se já encerrou
      }
    }
  }
}

runInstitutionalE2E().catch((err) => {
  console.error("\n❌ ERRO NA VALIDAÇÃO INSTITUCIONAL PLAYWRIGHT:", err);
  process.exit(1);
});
