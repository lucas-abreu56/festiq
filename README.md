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
6. **Camp Carnival:** pôr do sol californiano, logotipo 3D Carnival, tickets, roda-gigante e hierarquia em diamante inspirada no Camp Flog Gnaw com o headliner supremo ao centro.
7. **Rage Xerox:** estética analógica de fotocópia xerox, brasão caligráfico dark metal cromado, estrelas separadoras `★` e tipografia expandida do rap streetwear.

## Bateria de testes automatizados

O Festiq conta com uma suíte de testes ponta a ponta com Playwright que cobre os 4 pilares de validação:

```bash
# Executa a suíte E2E completa (filtros, espaçamento mobile/desktop e exportação PNG 1080p)
npm run test:suite
```

A suíte valida:
- **Todos os filtros:** modos Meu Gosto, Popularidade e os 9 gêneros musicais sem buracos no cartaz, além dos 3 períodos e do botão de embaralhar.
- **Espaçamento e Zero-Truncate:** ausência de corte horizontal e garantia de zero truncamento (`...`) em Desktop (1440px), iPhone 14 (390px) e celular compacto (360px) em todos os 7 temas nos formatos 9:16 e 1:1.
- **Download e integridade PNG:** renderização e download de arquivos em alta definição com validação dos bytes de cabeçalho e resolução exata de 1080 × 1920 px (Stories) e 1080 × 1080 px (Feed).

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

## Segurança, privacidade e como funciona a API do Spotify

O Festiq foi concebido com privacidade estrita e arquitetura efêmera. A conexão com o Spotify utiliza o protocolo aberto **OAuth 2.0 com PKCE** (Proof Key for Code Exchange), o mesmo padrão de segurança adotado por grandes plataformas e serviços financeiros.

### 1. Sua senha nunca passa pelo Festiq
Ao clicar em "Entrar com Spotify", o usuário é redirecionado diretamente para os servidores oficiais da plataforma (`accounts.spotify.com`). O processo de autenticação ocorre inteiramente no domínio do Spotify. O Festiq nunca tem acesso a senhas, números de cartão, endereço ou dados de faturamento.

### 2. Escopos de leitura restrita (menor privilégio)
A aplicação solicita exclusivamente duas permissões de leitura:
* `user-top-read`: lê a lista dos artistas e músicas mais ouvidos nos períodos selecionados para compor o pôster.
* `user-read-private`: lê o primeiro nome de exibição do usuário para personalizar o título do festival.

O Festiq não solicita permissões de escrita. O aplicativo não pode criar nem apagar playlists, não altera bibliotecas, não controla a reprodução e não executa ações na conta.

### 3. Processamento efêmero sem banco de dados
O Festiq não possui banco de dados relacional, NoSQL ou qualquer armazenamento de histórico de usuários. Os dados retornados pelo Spotify existem apenas na memória durante a montagem do cartaz e na sessão local do navegador. Quando o usuário sai ou fecha a aba, nada fica retido em servidores externos.

### 4. Proteção de sessão com cookies HTTP-Only
O token temporário retornado após a autorização é armazenado em cookie seguro com a flag `httpOnly`, atributo `sameSite: "lax"` e criptografia em trânsito (HTTPS). Isso previne que scripts maliciosos de terceiros no navegador tenham acesso direto ao token de acesso.

### 5. Revogação de acesso
O usuário pode encerrar o acesso de duas formas:
1. **Pelo próprio Festiq:** clicando no botão "Sair" no cabeçalho, que limpa os cookies de sessão de forma imediata.
2. **Pelo painel do Spotify:** acessando a página oficial de [aplicativos conectados do Spotify](https://www.spotify.com/account/apps) e clicando em "Remover acesso". A revogação invalida os tokens instantaneamente nos servidores do Spotify.

## Atribuições e isenção legal

Os dados musicais são consultados em tempo de execução pela Spotify Web API. O Festiq é um projeto independente e não possui afiliação, patrocínio ou endosso da Spotify AB. Todas as marcas, nomes de artistas e dados relacionados pertencem aos seus respectivos titulares.

Os temas visuais são tributos artísticos e paródias gráficas que celebram a estética de festivais históricos, desenvolvidos com código e ilustrações próprias, sem incorporação de logotipos protegidos de patrocinadores ou organizadores. Código distribuído sob a [Licença MIT](LICENSE).
