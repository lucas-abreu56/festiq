# Festiq — Especificação de Design & Tokens (`DESIGN.md`)

## 1. Princípios de Design & Direção de Arte

- **Substância sobre Cosmética**: A hierarquia tipográfica e a composição do cartaz contam a história. Sem elementos decorativos aleatórios que não pertençam ao universo de festivais reais.
- **Anti-Genérico Rigoroso**:
  - Sem kickers ou eyebrows artificiais sobre títulos.
  - Sem cards bento idênticos ou janelas de terminal fictícias.
  - Sem gradientes neon artificiais sem significado temático.
  - Sem efeito vidro (`backdrop-blur`) fora de contexto que quebre o contraste ao rolar.
- **Formato Mandatório de Saída**: Proporção **9:16**, canvas renderizado para exportação em **1080 × 1920 pixels**.

---

## 2. Tipografia Global da Aplicação

- **Display / Headliners de Festival**: Fontes condensadas, pesadas, ultra impactantes em caixa alta (`Oswald`, `Impact`, `Bebas Neue` ou `Cabinet Grotesk`).
- **Sub-Headliners & Linhas de Apoio**: Sans-serif geométrica e neutra de excelente legibilidade (`Inter`, `Plus Jakarta Sans`).
- **Tema Retrô / Editorial**: Serifa clássica encorpada e display display woodblock (`Playfair Display`, `Cinzel` ou `Fraunces`).
- **Mono / Dados Técnicos**: Monoespaçada apenas para datas, coordenadas, horários fictícios de palco e badges de edição (`JetBrains Mono` ou `Geist Mono`).

---

## 3. Os 4 Temas Visuais do Festiq

### Tema 1 — Indie Waves (Inspirado no Lollapalooza Brasil)
- **Atmosfera**: Pop-art vibrante, festival de dia com transição para o pôr do sol, estética de stickers e faixas onduladas multicoloridas.
- **Paleta de Cores**:
  - Fundo principal: Amarelo Sol `#FFE800` com faixas dinâmicas em Verde Limão `#D2F800`, Ciano Elétrico `#00E5FF`, Magenta Vibrante `#FF0055` e Laranja Queimado `#FF6B00`.
  - Texto principal (Headliners): Preto profundo `#0D0D0D`.
  - Badges de dias (Sex / Sáb / Dom): Pílulas coloridas de alto contraste com cantos arredondados.
- **Estrutura**: Divisão vertical por 3 dias (Sexta-feira, Sábado e Domingo), cada qual com seu Headliner em destaque absoluto.
- **Separadores**: Estrelas de 4 pontas (✦) e círculos sólidos (●).

### Tema 2 — Stadium Rock (Inspirado no Rock in Rio)
- **Atmosfera**: Noite de festival em estádio, iluminação cênica de palco, holofotes contra o céu escuro, sensação de espetáculo monumental.
- **Paleta de Cores**:
  - Fundo principal: Azul noite profundo `#090D16` com gradiente sutil para preto grafite `#04060A`.
  - Destaques de iluminação: Azul ciano frio `#29B6F6` e Âmbar dourado de holofote `#FFB300`.
  - Texto principal: Branco puro `#FFFFFF` e Prata metálico `#CFD8DC`.
- **Estrutura**: Divisão por palcos (Palco Principal & Palco Alternativo / Sunset) ou dias de estilo musical, com logotipo estilizado e silhueta de palco no rodapé.
- **Separadores**: Barras diagonais (//) e traços fortes (—).

### Tema 3 — Planeta Tropical (Inspirado no Planeta Atlântida)
- **Atmosfera**: Festival litorâneo de verão, clima descontraído, cores quentes e tropicais, ondas e elementos botânicos estilizados.
- **Paleta de Cores**:
  - Fundo principal: Turquesa vibrante `#00A896` e Coral solar `#FF6B6B`.
  - Acentos: Amarelo areia `#F4D35E` e Verde menta `#02C39A`.
  - Texto: Branco nítido `#FFFFFF` e Azul marinho `#023047`.
- **Estrutura**: Fluxo contínuo com badges náuticas/solares de data e nomes dispostos em blocos fluidos.
- **Separadores**: Ondas e pontos solares (≋ / •).

### Tema 4 — Festival Retrô (Woodblock / Vintage Letterpress)
- **Atmosfera**: Cartaz histórico dos anos 60/70 (estilo Woodstock / Isle of Wight), tipografia impressa em prensa tipográfica sobre papel encorpado.
- **Paleta de Cores**:
  - Fundo: Papel envelhecido / linho cru `#F5EBE1` com textura fina de ruído/grão.
  - Tinta tipográfica: Preto carvão desbotado `#1C1917` e Vermelho escuro de imprensa `#7F1D1D`.
  - Linhas e ornamentos: Ocre terroso `#92400E`.
- **Estrutura**: Moldura ornamental com bordas duplas, alinhamento centralizado estrito, tipografia com serifas marcantes e hierarquia compacta.
- **Separadores**: Losangos (◆) e florões tipográficos (❦).

---

## 4. Regras do Motor Tipográfico (Prevenção de Quebras)

1. **Headliners**:
   - Até 18 caracteres: Tamanho `clamp(2.5rem, 6vw, 4.5rem)` em 1 linha.
   - De 19 a 30 caracteres: Redução gradual de fonte e quebra permitida em até 2 linhas balanceadas.
   - Mais de 30 caracteres: Compressão de `letter-spacing` e redução até limite mínimo de legibilidade.
2. **Sub-Headliners**:
   - Espaçamento uniforme, peso `font-bold`, tamanho intermediário.
3. **Undercard**:
   - Organização em parágrafo justificado/centralizado contínuo com separadores consistentes, evitando órfãos solitários.
