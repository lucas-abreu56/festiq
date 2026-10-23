import { chromium } from 'playwright';

// Artistas para validação de layout
const userArtists = [
  { id: 'a1', name: 'Turnstile', genres: ['hardcore punk', 'punk', 'melodic hardcore'], popularity: 75, images: [], external_urls: { spotify: '' } },
  { id: 'a2', name: 'Talking Heads', genres: ['art punk', 'dance rock', 'new wave', 'post-punk', 'rock'], popularity: 78, images: [], external_urls: { spotify: '' } },
  { id: 'a3', name: 'David Bowie', genres: ['art rock', 'glam rock', 'classic rock', 'rock'], popularity: 84, images: [], external_urls: { spotify: '' } },
  { id: 'a4', name: 'FKA twigs', genres: ['art pop', 'indie r&b'], popularity: 72, images: [], external_urls: { spotify: '' } },
  { id: 'a5', name: 'Aphex Twin', genres: ['electronic', 'idm'], popularity: 74, images: [], external_urls: { spotify: '' } },
  { id: 'a6', name: 'SZA', genres: ['r&b', 'pop'], popularity: 90, images: [], external_urls: { spotify: '' } },
  { id: 'a7', name: 'Pink Floyd', genres: ['classic rock', 'progressive rock', 'rock'], popularity: 86, images: [], external_urls: { spotify: '' } },
  { id: 'a8', name: 'Charli xcx', genres: ['hyperpop', 'pop'], popularity: 88, images: [], external_urls: { spotify: '' } },
  { id: 'a9', name: 'Kendrick Lamar', genres: ['conscious hip hop', 'hip hop', 'rap'], popularity: 93, images: [], external_urls: { spotify: '' } },
  { id: 'a10', name: "BK'", genres: ['brazilian hip hop', 'rap nacional'], popularity: 74, images: [], external_urls: { spotify: '' } },
  { id: 'a11', name: 'Sophia Chablau e Uma Enorme Perda de Tempo', genres: ['brazilian rock', 'indie rock'], popularity: 58, images: [], external_urls: { spotify: '' } },
];

async function runMobileE2E() {
  console.log('Iniciando validação Playwright mobile...');

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  await page.route('**/api/spotify/top-artists*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        authenticated: true,
        userName: 'Lucas',
        artists: userArtists,
      }),
    });
  });

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('#festiq-poster-preview');

  // Validação de overflow horizontal no Lolla
  const overflow = await page.evaluate(() => {
    const preview = document.querySelector('#festiq-poster-preview');
    const rightCol = preview?.querySelector('.w-\\[61\\.6\\%\\]');
    const rows = rightCol ? rightCol.querySelectorAll('.w-full.flex') : [];
    let badRows = 0;
    rows.forEach((r) => {
      if (r.scrollWidth > r.clientWidth + 2) badRows++;
    });
    return { badRows, totalRows: rows.length };
  });

  if (overflow.badRows > 0) {
    throw new Error(`Detectado ${overflow.badRows} linhas com corte no undercard!`);
  }

  console.log(`[SUCESSO] ${overflow.totalRows} fileiras testadas no iPhone 14 com zero cortes.`);
  await browser.close();
}

runMobileE2E().catch((err) => {
  console.error('Falha no teste Playwright:', err);
  process.exit(1);
});
