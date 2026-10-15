# Festify — Especificação & Resumo do Projeto

Aplicação web que consome dados de escuta da **Spotify Web API** e gera pôsteres comemorativos e compartilháveis no formato de lineups de festivais de música (como **Lollapalooza Brasil** e **Rock in Rio**), formatados para redes sociais (Instagram Stories 9:16).

---

## 1. Visão Geral & Proposta de Valor

Inspirado em projetos como *Receiptify* e *Instafest*, o **Festify** permite ao usuário autenticar sua conta do Spotify e ver seus artistas mais tocados organizados como as atrações principais de um festival de música.

O grande diferencial do projeto é a **autenticidade visual e a variedade de temas**: em vez de um modelo genérico, o Festify reproduz a estética visual, tipografia e estrutura de dias de festivais consagrados (iniciando com Lollapalooza Brasil e Rock in Rio).

---

## 2. Funcionalidades Principais

### A. Autenticação & Coleta de Dados (Spotify)
* **Login com Spotify (OAuth 2.0):** Autenticação segura solicitando apenas o escopo necessário (`user-top-read` e `user-read-private`).
* **Seleção de Período de Escuta:**
  * **Último Mês** (`short_term` - 4 semanas)
  * **Últimos 6 Meses** (`medium_term`)
  * **Todo o Tempo** (`long_term` - histórico completo de vários anos)

### B. Algoritmo de Composição do Lineup
* Consulta dos 36 a 45 principais artistas do usuário via API.
* **Divisão dos Headliners:** Os artistas #1, #2 e #3 são distribuídos como os fechamentos principais de cada dia (Sexta, Sábado e Domingo).
* **Distribuição Equilibrada:** Artistas subsequentes são alocados como co-headliners e undercard entre os dias, garantindo que cada dia tenha nomes de peso.

### C. Múltiplos Temas de Festivais

1. **Tema Lollapalooza Brasil (Baseado no Print):**
   * **Estrutura:** 3 dias (Sexta, Sábado e Domingo).
   * **Estética:** Fundo multicolorido com faixas onduladas vibrantes (verde-limão, amarelo, azul ciano, vermelho), visual doodle/pop art com stickers.
   * **Tipografia:** Fontes condensadas e ultra pesadas em caixa alta para headliners e sub-headliners, separadores em pontos/estrelas para artistas menores.
   * **Elementos Gráficos:** Badges coloridas indicando os dias (`SEX 19.MAR`, etc.), rodapé com silhueta de multidão e logos fictícios de parceiros.

2. **Tema Rock in Rio:**
   * **Estrutura:** Divisão por palcos (Palco Mundo & Palco Sunset) ou dias temáticos (Dia do Rock, Dia do Pop, etc.).
   * **Estética:** Identidade clássica azul escuro/preto com iluminação de palco, guitarras, globos estilizados ou estética noturna de festival.
   * **Tipografia:** Tipografia sólida, clássica e impactante de festival de estádio.

3. **Arquitetura Modular para Novos Temas:**
   * Código desacoplado permitindo adicionar facilmente novos festivais (ex: *Coachella*, *Primavera Sound*, *Glastonbury*).

### D. Customização & Exportação
* **Nome do Festival Customizável:** Por padrão gerado a partir do nome do usuário (ex: `LUCASPALOOZA`, `FESTIFY BRASIL` ou `LUCAS IN RIO`), com opção de edição livre.
* **Datas Personalizadas:** Exibição da data atual ou de um fim de semana fictício de festival.
* **Download em Alta Resolução:** Geração de arquivo `.png` com proporção exata para **Instagram Stories (9:16 / 1080x1920)** em 1 clique.
* **Compartilhamento Mobile:** Integração com a Web Share API para compartilhamento direto nos apps suportados.

---

## 3. Arquitetura Técnica Recomendada

* **Framework:** Next.js (App Router) + TypeScript.
* **Estilização:** Tailwind CSS (para controle fino de tipografia, cores e grids responsivos).
* **Motor de Renderização de Imagem:** `html-to-image` (captura do DOM no client com resolução 2x/3x para exportação em PNG nítido sem sobrecarregar o servidor).
* **Segurança / OAuth:** Next.js Route Handlers para troca segura de tokens sem expor chaves privadas no cliente.

---

## 4. Fases de Desenvolvimento

1. **Fase 1 (Estrutura & Pôster Mockado):**
   * Inicialização do projeto Next.js + Tailwind no diretório `festify`.
   * Criação do componente do pôster com o tema do Lollapalooza e dados fictícios para ajuste pixel-perfect do design.
   * Implementação do botão de download em `.png`.

2. **Fase 2 (Segundo Tema - Rock in Rio):**
   * Desenvolvimento do seletor de temas e do template visual do Rock in Rio.

3. **Fase 3 (Integração Spotify):**
   * Criação do fluxo de login OAuth 2.0 e endpoints para buscar top artistas.
   * Conexão dos dados reais ao gerador de lineup.

4. **Fase 4 (Polimento & Publicação):**
   * Ajustes de responsividade mobile, estados de carregamento e deploy (Vercel).
