# Festiq (iq) — Your Taste. Your Festival.

Aplicação web responsiva que transforma preferências musicais e estatísticas de escuta do Spotify em lineups customizados e cartazes de festivais de música de alta fidelidade visual, formatados para compartilhamento em redes sociais (9:16 / 1080 × 1920 pixels).

---

## Recursos Principais

- **Conexão Segura com Spotify (OAuth 2.0 PKCE):** Coleta dados dos artistas mais tocados nos períodos de 4 semanas, 6 meses ou todo o histórico.
- **5 Temas Visuais Exclusivos (Tributos Criativos):**
  1. *Indie Waves* (homenagem gráfica ao Lollapalooza Brasil, com divisão bicromática e undercard equalizado)
  2. *Planeta Tropical* (homenagem ao Planeta Atlântida com tipografia oficial, colunas ilustradas e letra 3D dinâmica A–Z)
  3. *Forestfest* (estética de floresta inspirada no Festify com balanceamento por comprimento de nomes)
  4. *Impresso '85* (grade de 10 dias jornalística estilo Rock in Rio 1985 / vintage letterpress)
  5. *C6 Minimal* (íris concêntrica multicolorida de 378 pontos com lineup A a Z contínuo)
- **Formatos Duplos:** Suporte nativo para **9:16 (Stories/Reels - 1080 × 1920 px)** e **1:1 (Feed/Quadrado - 1080 × 1080 px)**.
- **Motor Tipográfico Adaptativo (Zero-Truncate Rule):** Algoritmo que quebra e equaliza nomes longos em 2 linhas sem nunca cortar caracteres (`truncate`/`...`), mantendo 100% dos nomes das bandas íntegros.
- **Retratos Reais de Artistas:** Integração com a API da Deezer para exibir fotos reais dos artistas do topo do lineup.
- **Exportação em Alta Resolução:** Renderização local instantânea em PNG e suporte à Web Share API nativa.
- **Sem Cadastro:** Não exige criação de conta para criar ou baixar o pôster.

---

## Como Rodar Localmente

### 1. Pré-requisitos
- Node.js 18+ ou 20+
- Conta de desenvolvedor no [Spotify for Developers](https://developer.spotify.com/dashboard)

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha suas credenciais:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

> No painel do Spotify Developer Dashboard, adicione a Redirect URI (o Spotify exige o IP explícito 127.0.0.1 em vez de localhost):  
> `http://127.0.0.1:3000/api/auth/callback`

### 3. Instalar Dependências e Executar
```bash
npm install
npm run dev
```
Acesse `http://127.0.0.1:3000`.

---

## Atribuições, Privacidade e Isenção Legal

- **Spotify Web API**: Dados musicais consumidos exclusivamente em tempo de execução via Spotify Web API. O Festiq não é afiliado, patrocinado ou endossado pelo Spotify AB. Todas as marcas e marcas registradas relacionadas ao Spotify pertencem aos seus respectivos proprietários.
- **Privacidade e Dados Efêmeros**: O Festiq não possui banco de dados persistente e não armazena históricos de escuta ou credenciais. O token OAuth PKCE é mantido estritamente em cookies protegidos de sessão temporária no cliente.
- **Identidades Visuais & Propriedade Intelectual**: Os modelos visuais são homenagens e paródias de design inspiradas na cultura de grandes festivais de música. Não utilizam logotipos oficiais de patrocinadores nem sugerem parceria comercial.
- **Licença de Código Aberto**: Distribuído sob a [Licença MIT](LICENSE). Consulte o arquivo `LICENSE` para termos completos de isenção de responsabilidade.
