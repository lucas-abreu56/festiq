# Festiq — Especificação de Design & Tokens (`DESIGN.md`)

## 1. Princípios de Design & Direção de Arte

- **Design Read**: Console de estúdio musical de alto contraste (*Design Bomb* `#141414` + `#CEFF00` + `PP Frama`) para geração instantânea de pôsteres comemorativos de festivais a partir do Spotify.
- **Substância sobre Cosmética**: A hierarquia tipográfica e a composição gráfica do cartaz contam a história. Sem elementos decorativos aleatórios que não pertençam ao universo de festivais reais.
- **Anti-Genérico Rigoroso**:
  - Sem kickers ou eyebrows artificiais sobre títulos.
  - Sem cards bento idênticos ou janelas de terminal fictícias.
  - Sem emojis substituindo ícones ou ilustrações vetoriais (`SVG` autoral obrigatório).
- **Formatos Mandatórios de Saída (100% dos 45 artistas visíveis)**:
  - **Vertical (Stories / Reels)**: Proporção **9:16**, exportado em **1080 × 1920 pixels**.
  - **Quadrado (Feed / Pôster Oficial)**: Proporção **1:1**, exportado em **1080 × 1080 pixels**.

---

## 2. Identidade do Estúdio (Design Bomb Tokens) & Tipografia

- **Superfícies**: Matte Black `#141414`, Surface `#1A1A1A`, Border `#282828`, Off-White Chalk `#F7F6EB`.
- **Acentos de Estúdio**: Acid Lime `#CEFF00` (ação primária e destaque), Hot Pink `#FF3EBA` (badges secundárias), Electric Blue `#4A60FF`.
- **Tipografia Auto-Hospedada (`/public/fonts/`)**:
  - **Display do Estúdio (`PP Frama`)**: `PP Frama Black Italic`, `PP Frama Extrabold Italic`, `PP Frama Bold`.
  - **Display de Cartaz**: `Oswald` / `PP Frama Bold` (condensada pesada em caixa alta).
  - **Corpo & Pirâmide Geométrica**: `Inter` (`--font-inter`).
  - **Tema Retrô / Editorial**: `Playfair Display` (`--font-playfair`).
  - **Dados Técnicos**: `JetBrains Mono` (`--font-mono`).

---

## 3. Os 6 Temas Visuais do Festiq

### Tema 1 · Indie Waves (`lolla` · Tributo ao Lollapalooza Brasil)
- **Atmosfera**: Arte pop tropical e urbana fiel ao cartaz oficial do Lollapalooza Brasil.
- **Paleta de Cores**:
  - Canto street-art: Vermelho Coral `#F25444` com grafismos pretos `#0D0D0D`.
  - Coluna esquerda (Onda Ciano): `#63CBD8` com espirais `#82D9E4`, estrelas brancas e mão do rock vetorial.
  - Coluna direita (Campo Solar): Amarelo-Limão `#E2F018`.
- **Estrutura**:
  - Esquerda (`38%`): 10 Headliners principais empilhados e **alinhados à direita** (`text-right`) em peso máximo sem invadir o campo amarelo.
  - Direita (`62%`): 35 artistas do undercard distribuídos em linhas densas separadas por pontos ciano (`•`).

### Tema 2 · Forestfest (`festify` · Tributo ao Festify)
- **Atmosfera**: Pôster diurno clean, solar e ilustrado, inspirado diretamente no clássico *Festify (Forestfest)*.
- **Paleta de Cores**:
  - Topo: Gradiente suave de Amarelo Solar `#FDE05D` para Branco Puro `#FFFFFF`.
  - Tipografia de Cabeçalho e Ilustração: Azul Royal `#2B6EF2`.
  - Nomes dos Artistas: Preto nítido `#0D0D0D` sobre fundo branco.
- **Estrutura**:
  - Pirâmide tipográfica centralizada exibindo todos os 45 artistas.
  - Base: Ilustração vetorial autoral com montanhas amarelas, cabana A-frame azul royal com chaminé soltando fumaça amarela, pinheiros line-art e vasos botânicos.

### Tema 3 · Planeta Atlântida (`tropical` · Tributo ao Planeta Atlântida)
- **Atmosfera**: Pôster de verão gaúcho/litorâneo com estética Neo-Pop Surf, fiel ao cartaz oficial do Planeta Atlântida.
- **Paleta de Cores**: Gradiente central de Rosa Flamingo Pastel `#F69FB5` a Amarelo Sol `#FCE46E`, globo 3D azul oceano `#0288D1` com anel orbital entrelaçado e **monograma 3D dinâmico em ouro solar (`#FFB300`)** estilizado para a letra inicial do festival escolhido (`A–Z` / `0–9`).
- **Estrutura**: Globo 3D com letra dinâmica e faixa marinho de data no topo, moldura lateral Neo-Pop Surf contida nas bordas externas (`x <= 48` e `x >= 552`) e bloco único centralizado de lineup em preto `#141414` com 3 Headliners separados por raios (`⚡`) e undercard separado por pontos coloridos (`•`).

### Tema 4 · Impresso '85 (`retro` · Tributo ao Jornal Rock in Rio 1985)
- **Atmosfera**: Cartaz histórico de programação de jornal de 1985 (`<NOME DO FESTIVAL> FESTIVAL.` / `PROGRAMAÇÃO®`).
- **Paleta de Cores**: Papel jornal envelhecido `#E4D8C1` com manchas sutis de época `#CFC0A3` e tinta preta de rotativa `#1F1C19`.
- **Estrutura**: Cabeçalho monumental estonado com o nome do festival, faixa `PROGRAMAÇÃO®` entre fios duplos e **grade de 10 dias (2 fileiras × 5 colunas: `SEXTA-FEIRA 11 JANEIRO/85` a `DOMINGO 20 JANEIRO/85`)** comportando todos os 45 artistas (com moldura carimbada nos dias `11`, `15`, `16` e `19`) e rodapé clássico de abertura dos portões.

### Tema 5 · C6 Minimal (`c6fest` · Tributo ao C6 Fest)
- **Atmosfera**: Minimalismo noturno contemporâneo sobre preto absoluto com íris pontilhada multicolorida e tipografia justificada.
- **Paleta de Cores**: Fundo `#000000`, íris concêntrica de 7 anéis pontilhados e lineup alternando 5 tons: Rosa Carmim `#E05378`, Verde Menta `#43B581`, Amarelo Ouro `#E6D15A`, Azul Ciano `#62B4D6` e Malva `#C76B9E`.
- **Estrutura**: Íris pontilhada com o nome do festival em branco no centro superior, marcador `A a Z` à esquerda, bloco tipográfico justificado de ponta a ponta (`text-justify`) com os 45 artistas em ordem alfabética e ano `2026` no canto inferior direito.

### Tema 6 · Camp Carnival (`floggnaw` · Tributo ao Camp Flog Gnaw)
- **Atmosfera**: Estética de parque de diversões vintage/carnival e hip hop alternativo com tipografia monumental curva, listras de circo e cores quentes retrô.
- **Paleta de Cores**:
  - Fundo: Céu de parque ao entardecer com gradiente de Rosa Chiclete `#FFAEC8` a Laranja Queimado `#FF7433` e Vermelho Carmim `#EA2A00`.
  - Tipografia de Cabeçalho: Azul Céu Pastel `#E2F6FE` com drop-shadow profundo e traço escuro.
  - Undercard: Amarelo Sol `#FFE259` e Branco Puro `#FFFFFF`.
- **Estrutura**:
  - Topo: Faixa de balão com estrelas, nome do festival em arco ondulado monumental com sombras 3D e subtítulo `LINEUP OFICIAL`.
  - Corpo: Bloco centralizado e equalizado com os 45 artistas distribuídos em faixas com hierarquia de tamanho e separadores circulares.
  - Base: Tenda de circo retrô / roda gigante com contagem oficial de artistas e ano `2026`.

---

## 4. Especificação de UI do Console de Estúdio (Studio Console)

- **Grid de Temas (Zero-Truncate)**:
  - Mobile (360px a 412px): 2 colunas (`grid-cols-2`), com largura útil confortável para cada card (~160px).
  - Tablet e Desktop (768px a 1440px): 3 colunas (`sm:grid-cols-3`), divididas em 2 linhas equilibradas.
  - Zero truncamento (`truncate` proibido): todos os títulos e descrições dos temas são exibidos integralmente.
  - Miniaturas Gráficas Autorais: cada card possui um swatch ilustrado (`LOLLA`, `FOREST`, `SURF`, `1985`, `C6`, `CAMP`) acompanhado do badge numérico com contagem de artistas (`45 ART`, `24 ART`, etc.).
  - Feedback Ativo: anel luminoso `#CEFF00`, borda iluminada e fundo com gradiente sutil de ativação.
- **Nome do Festival**:
  - Cabeçalho minimalista com rótulo à esquerda e contador de caracteres dinâmico (`0/20`) à direita.
  - Campo de digitação em caixa alta com botão de limpar (`×`) quando preenchido.
  - Chips de sugestão/presets com estado ativo real: fundo e borda `#CEFF00` com texto preto quando o nome atual corresponde ao preset.
- **Proporção do Pôster**:
  - Dois seletores com cards de acabamento técnico: `Stories e Reels (1080×1920)` e `Feed e Posts (1080×1080)`.
  - `whitespace-nowrap` em rótulos e dimensões para prevenir quebra órfã de `px` em telas estreitas.
- **Critério do Lineup & Embaralhar Artistas**:
  - Três opções em 1 linha contínua: `Meu Gosto`, `Por Gênero` e `Popularidade`.
  - Botão `Embaralhar Artistas` (`Shuffle`) promovido para o cabeçalho da seção com ícone e rótulo claro, agrupando a ação ao contexto de ordenação.
- **Seleção de Gêneros (`OptionWheel`)**:
  - Disposição em flex wrap com os 9 gêneros musicais visíveis simultaneamente sem scrollbar horizontal.
- **Estabilidade do Layout (Zero Jump)**:
  - Palco do pôster e console fixados em proporções complementares (`lg:col-span-5` e `lg:col-span-7`), impedindo que a alternância entre `9:16` e `1:1` redimensione o painel de controles.
- **Rodapé e Header Limpos**:
  - Removidos termos de infraestrutura interna ou dependência de API (`Spotify Web API`, `Modo Demonstração`).
  - Navegação do header limpa e focada no mobile, ocultando links secundários para manter o botão `Conectar Spotify` em 1 linha.

