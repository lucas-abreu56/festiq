# Festiq Studio (`iq`)

Aplicação web que transforma os seus 45 artistas mais ouvidos no Spotify em lineups e cartazes de festival para compartilhamento em Stories (`9:16`, `1080 × 1920 px`) e Feed (`1:1`, `1080 × 1080 px`).

## O que o projeto faz

O Festiq conecta via OAuth 2.0 PKCE à Spotify Web API para ler os artistas mais tocados nas últimas 4 semanas, nos últimos 6 meses ou em todo o histórico da conta. Quem quiser testar sem login pode usar o modo de demonstração com 45 artistas já carregados.

O motor tipográfico distribui os 45 nomes sem truncar caracteres (`...`), quebrando nomes compostos em até duas linhas balanceadas e buscando retratos reais dos headliners na API pública da Deezer. A exportação gera o PNG localmente no navegador em resolução nativa e integra com a Web Share API no celular.

### Temas visuais (tributos gráficos)

1. **Indie Waves:** divisão bicromática inspirada no Lollapalooza Brasil com undercard equalizado.
2. **Planeta Atlântida:** colunas ilustradas, estética surf pop e letra 3D dinâmica (`A` a `Z`).
3. **Forestfest:** inspirado no Festify, com balanceamento por comprimento de nomes.
4. **Impresso '85:** grade jornalística de 10 dias inspirada no Rock in Rio de 1985.
5. **C6 Minimal:** íris concêntrica multicolorida de 378 pontos com lineup contínuo de `A` a `Z`.

## Como rodar localmente

### 1. Pré-requisitos
- Node.js 18+ ou 20+
- Aplicação criada no [Spotify for Developers](https://developer.spotify.com/dashboard)

### 2. Variáveis de ambiente
Copie o arquivo de exemplo e preencha suas credenciais:
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

No painel do Spotify Developer Dashboard, cadastre a Redirect URI usando o IP explícito `127.0.0.1` (exigência do Spotify no lugar de `localhost`):
```text
http://127.0.0.1:3000/api/auth/callback
```

### 3. Instalação e execução
```bash
npm install
npm run dev
```
Acesse `http://127.0.0.1:3000`.

## Atribuições, privacidade e isenção legal

Os dados musicais são lidos em tempo de execução pela Spotify Web API. O Festiq não é afiliado, patrocinado nem endossado pelo Spotify AB; todas as marcas relacionadas pertencem aos seus respectivos proprietários.

A aplicação não usa banco de dados e não armazena histórico de escuta nem credenciais. O token OAuth PKCE fica restrito a cookies `HttpOnly` de sessão temporária no navegador do usuário.

Os temas visuais são homenagens e paródias gráficas inspiradas na cultura de festivais de música, sem uso de logotipos oficiais de patrocinadores nem vínculo comercial. Código distribuído sob a [Licença MIT](LICENSE).
