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

## 3. Os 4 Temas Visuais do Festiq

### Tema 1 — Indie Waves (`lolla` · Tributo ao Lollapalooza Brasil)
- **Atmosfera**: Arte pop tropical e urbana fiel ao cartaz oficial do Lollapalooza Brasil.
- **Paleta de Cores**:
  - Canto street-art: Vermelho Coral `#F25444` com grafismos pretos `#0D0D0D`.
  - Coluna esquerda (Onda Ciano): `#63CBD8` com espirais `#82D9E4`, estrelas brancas e mão do rock vetorial.
  - Coluna direita (Campo Solar): Amarelo-Limão `#E2F018`.
- **Estrutura**:
  - Esquerda: 10 Headliners principais empilhados e **alinhados à direita** (`text-right`) em peso máximo.
  - Direita: 35 artistas do undercard distribuídos em linhas densas separadas por pontos ciano (`•`).
  - Rodapé: Silhueta vetorial da multidão e barra preta de metadados.

### Tema 2 — Forestfest (`festify` · Tributo ao Festify)
- **Atmosfera**: Pôster diurno clean, solar e ilustrado, inspirado diretamente no clássico *Festify (Forestfest)*.
- **Paleta de Cores**:
  - Topo: Gradiente suave de Amarelo Solar `#FDE05D` para Branco Puro `#FFFFFF`.
  - Tipografia de Cabeçalho e Ilustração: Azul Royal `#2B6EF2`.
  - Nomes dos Artistas: Preto nítido `#0D0D0D` sobre fundo branco.
- **Estrutura**:
  - Pirâmide tipográfica centralizada exibindo todos os 45 artistas: 1 Headliner supremo no topo, 2 Co-Headliners na 2ª linha, 3 Sub-Headliners na 3ª linha e 39 artistas em grade estruturada de colunas com quebra equilibrada.
  - Base: Ilustração vetorial autoral com montanhas amarelas, cabana A-frame azul royal com chaminé soltando fumaça amarela, pinheiros line-art, vasos botânicos com costela-de-adão e flores geométricas, e assinatura `FESTIQ` no rodapé.

### Tema 3 — Planeta Atlântida (`tropical` · Tributo ao Planeta Atlântida)
- **Atmosfera**: Pôster de verão gaúcho/litorâneo com estética pop-art tropical, fiel ao cartaz oficial do Planeta Atlântida.
- **Paleta de Cores**: Gradiente central de Rosa Flamingo Pastel `#F5A3B7` a Amarelo Sol `#FCE373`, globo 3D azul oceano `#0277BD` com anel orbital laranja `#E64A19` e emblema dourado `#FFB300`, moldura ilustrada com Ciano `#00E5FF`, Rosa `#FF4081` e Coral `#FF3D00`.
- **Estrutura**: Globo 3D e raios solares no topo, moldura lateral ilustrada em SVG (coqueiros, globos terrestres, raios, lábios pop-art e ondas do mar) e bloco único centralizado de lineup em preto `#141414` com 3 Headliners separados por raios (`⚡`), 4 Co-Headliners e undercard completo separado por pontos coloridos (`•`).

### Tema 4 — Imprensa Retrô (`retro` · Woodblock / Vintage Letterpress)
- **Atmosfera**: Cartaz histórico dos anos 60/70 impresso em prensa tipográfica sobre papel linho cru.
- **Paleta de Cores**: Papel `#F5EBE1`, Tinta `#1C1917`, Carmim `#7F1D1D` e Ocre `#92400E`.
- **Estrutura**: Moldura dupla clássica, tipografia serifada e divisão hierárquica com 100% dos 45 artistas.
