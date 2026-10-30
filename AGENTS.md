# Festiq — Regras & Governança do Projeto

Aplicação web que consome dados da Spotify Web API e gera lineups comemorativos e pôsteres verticais em alta resolução (9:16 / 1080x1920) para redes sociais, sem exigir cadastro de usuário.

---

## 1. Restrições & Obrigações que não quebram build

1. **Termos da Spotify Developer Platform**:
   - Respeitar estritamente as diretrizes de marca e exibição do Spotify.
   - Não armazenar histórico nem credenciais privadas de usuários além do ciclo efêmero de sessão.
   - Tratar tokens de autenticação (OAuth 2.0 PKCE) apenas em rotas protegidas; segredos nunca devem vazar para o cliente.
2. **Propriedade Intelectual dos Temas de Festivais**:
   - Os templates visuais inspirados em festivais consagrados (*Lollapalooza*, *Rock in Rio*, *Planeta Atlântida*) são tributos/homenagens com arte e identidade própria do Festiq.
   - É proibido reproduzir logotipos corporativos oficiais protegidos, marcas de patrocinadores ou sugerir endosso/parceria oficial.
3. **Resolução de Exportação e Integridade de Nomes Obrigatória (`Zero-Truncate Rule`)**:
   - Todos os pôsteres exportados devem suportar as proporções **9:16** (**1080 × 1920 pixels**) e **1:1** (**1080 × 1080 pixels**), sem cortes em nomes de artistas ou vazamento fora da borda útil.
   - **Proibição Absoluta de Truncamento:** É estritamente proibido usar `truncate`, `text-ellipsis` ou cortar caracteres (`.slice()`) em nomes de artistas ou bandas em qualquer pôster. Mesmo bandas com nomes enormes (ex.: *Red Hot Chili Peppers*, *Engenheiros do Hawaii*, *The Rolling Stones*) devem aparecer 100% inteiras por meio de quebra equilibrada de linhas e redução proporcional do tamanho da fonte.

---

## 2. Regra de Handoff (Contexto e Estado)

`docs/NOTES.local.md` é o documento oficial de handoff e estado de sessão (ignorado no git).

**Obrigação**: Ao fim de uma sessão de trabalho, após implementar tarefas, resolver defeitos ou commitar, atualize o arquivo antes de encerrar:
1. **Estado real:** branch, último commit (HEAD), status do build/lint/testes.
2. **O que foi feito:** referenciando commits ou arquivos alterados.
3. **Decisões tomadas e o porquê:** explicitando por que determinado caminho foi escolhido.
4. **Próximo passo:** concreto o suficiente para retomar imediatamente.
5. **Teto de ~400 linhas:** no máximo as 2–3 últimas sessões.

---

## 3. Postura Perante Agentes & Robôs

- **Crawler de Treinamento**: BLOQUEADO (`robots.txt` com `Disallow` para bots de IA/treinamento comercial onde couber, e proteção das rotas de API `/api/*`).
- **Indexação Pública**: Permitida na landing page `/` para SEO de busca orgânica, sem expor dados privados.

---

## 4. Padrões de Interface & Anti-Vibecoding

- **Rolagem Suave**: Utilizar o padrão Lenis configurado de acordo com a skill `lenis-setup`.
- **Anti-Genérico**: Seguir o checklist de `entrar-em-projeto` e `criar-interface`. Proibido kickers/eyebrows acima de títulos, gradientes genéricos roxo-azul, fake terminals ou cards bento repetitivos.
- **Tipografia Adaptativa (Zero-Truncate)**: Headliners recebem prioridade máxima e quebra inteligente em até 2 linhas (ou conectores empilhados `OF / THE`, `DO`, `DE`); undercard tem ajuste dinâmico de tamanho e agrupamento equalizado para nunca cortar letras nem sobrepor elementos.
- **Equalização de Fileiras (`Row Equalizer`) e Proibição de Linhas Órfãs**: Em pôsteres com linhas justificadas (`justify-between`) ou em pirâmide (`LollaWaveTheme`, `FestifyTheme`, `TropicalTheme`), nunca usar agrupamento sequencial cego que deixe 1 ou 2 artistas sozinhos na linha com buracos no meio. Sempre fixar a quantidade de artistas por linha (3–4 no Lolla/Planeta, 4–6 no Festify), empilhar nomes compostos longos em 2 linhas nas fileiras intermediárias e equalizar a soma de caracteres entre fileiras trocando nomes longos por curtos.
- **Irmãos Diretos no Flexbox Vertical**: Todas as fileiras de artistas (do 1º headliner à última linha do undercard) devem ser filhas diretas do mesmo container flex vertical (`justify-between`). Nunca envolver o undercard inteiro em uma `<div>` aninhada dentro de um container `justify-evenly`, pois isso distorce a distribuição vertical.
- **Identidade de Aba, Compartilhamento (WhatsApp/OG) e `humanizer`**: Manter `src/app/icon.svg`, `src/app/apple-icon.png` (`180×180`), `src/app/opengraph-image.jpg` (`1200×630`, `< 300 KB` para preview grande no WhatsApp) + `src/app/opengraph-image.alt.txt`, `metadataBase: new URL("https://festiq.lucasschwingel.com")` e `twitter.card: "summary_large_image"`. Todo texto visível, metadado (`title`, `description`, `og:*`, `alt`) e `README.md` deve seguir a skill `humanizer` em `pt-BR`, com zero travessões (`—`/`–`) em UI e metadados.

---

## 5. Armadilhas deste Projeto

- **Geometria `1:1` (`540 × 540`) vs. `9:16` (`360 × 640`) no `PosterCanvas`**: A base lógica do formato `1:1` tem `540px` de largura (**50% mais larga em pixels** que os `360px` do `9:16`). Reduzir o tamanho da fonte quando `isSquare === true` cria buracos horizontais enormes; no `1:1`, as fontes e o orçamento de caracteres por linha devem ser iguais ou maiores que no `9:16`.
- **Fontes Google no `next build` Offline/Sandbox**: Não adicionar novas fontes em `next/font/google` que exijam download externo durante builds sem rede; reutilizar as variáveis já cacheadas (`--font-oswald`, `--font-inter`, `--font-playfair`, `--font-mono`) aplicando `-webkit-text-stroke` calibrado quando for necessário peso ultra-condensado pesado (`font-lolla`).
- **Spotify Auth em Modo Desenvolvimento e Restrição Quota Mode (5 Usuários):** Desde as atualizações de 2025/2026, novas aplicações da Spotify Web API ficam restritas ao *Development Mode* com limite de até 5 contas autorizadas manualmente no painel em *User Management*. O Spotify encerrou a concessão pública de *Extended Quota Mode* para desenvolvedores individuais ou pessoas físicas (exige organização comercial registrada e 250k MAUs). Para permitir que qualquer pessoa do público geral gere cartazes com suas músicas sem depender de liberação manual da Spotify API, deve-se utilizar a extração de playlists públicas (via embed público sem limite de cota) e/ou integração aberta do Last.fm (`ws.audioscrobbler.com`).
- **Rotas de Autenticação/OAuth no Next.js (`force-dynamic` obrigatório):** Rotas de API como `/api/auth/login` e `/api/auth/logout` que realizam redirects sem acessar explicitamente headers dinâmicos podem ser pré-renderizadas como estáticas (`○`) pelo compilador do Next.js no `next build`, congelando `state`, `code_challenge` e `verifier`. Sempre exportar `export const dynamic = "force-dynamic"` e aplicar `Cache-Control: private, no-store, no-cache, must-revalidate`.
- **Zero-Pollution em Lineups de Contas Reais:** Ao gerar lineups para usuários conectados (OAuth, Playlist ou Last.fm), nunca completar o undercard com `MOCK_ARTISTS` caso a conta tenha menos de 30/45 artistas. Se faltarem posições, ciclar exclusivamente os artistas da própria conta conectada do usuário para evitar vazamento de artistas fictícios no cartaz pessoal.
- **Exportação com `html-to-image`:** Imagens externas e fontes personalizadas precisam estar totalmente embutidas (data-uri ou fontes locais/cacheadas) para evitar que o canvas gere PNG com fontes padrão ou falhas de CORS.
- **`check-ignore` antes de criar arquivos locais:** Sempre valide `git check-ignore -v <arquivo>` para qualquer arquivo `*.local.md`.
- **Microtags de Gênero do Spotify e `Zero-Pollution Rule`:** A Spotify API utiliza dezenas de microtags hiperespecíficas (`melodic hardcore`, `post-punk`, `alternative metal`, `glam rock`). Nunca buscar apenas pela substring literal `"rock"`; utilizar sempre a `GENRE_TAXONOMY`. Além disso, em filtros temáticos, jamais fazer fallback para o mock geral sem filtro: se faltarem artistas, complementar exclusivamente com artistas do mesmo gênero ou ciclar os artistas válidos.
- **Container Queries (`cqw`) para Tipografia em Pôsteres Fixos:** Em telas de celular menores (360px a 390px), classes estáticas de pixel (`text-xs`, `text-[11px]`) no undercard causam corte na lateral direita. Usar sempre `containerType: "inline-size"` no container pai e tipografia com `cqw` + `clamp()`, mantendo proporção matemática idêntica no celular de 360px e no export de 1080px.
- **Proibição de Classes de Viewport (`sm:`) nos Pôsteres:** Nunca usar classes de breakpoint de tela do Tailwind (`sm:text-*`, `md:text-*`) dentro dos templates de pôster. Breakpoints `@media` avaliam a largura da janela do navegador (desktop vs mobile), distorcendo o pôster que possui largura lógica fixa de 360px ou 540px. Usar estritamente `cqw` com `clamp()` e a prop `isSquare`.
- **Escala no `html-to-image` (`canvasWidth` vs `pixelRatio`):** Nunca combinar `canvasWidth: 1080` com `pixelRatio: 3` (ou `2`), pois o motor multiplica ambos gerando imagens redundantes e pesadas de 3240 × 5760 px. Fixar `pixelRatio: 1` quando `canvasWidth` e `canvasHeight` nominais forem informados.
- **Encerramento de Processos Node no Windows (`taskkill`):** Ao executar servidores locais para testes E2E via `child_process.spawn("cmd.exe", ...)`, `process.kill("SIGTERM")` encerra apenas o cmd intermediário e deixa o `node.exe` rodando em segundo plano. Sempre invocar `taskkill /pid <PID> /t /f` para derrubar a árvore inteira de processos e liberar a porta 3000.

