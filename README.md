# Festiq (iq) — Your Taste. Your Festival.

Aplicação web responsiva que transforma preferências musicais e estatísticas de escuta do Spotify em lineups customizados e cartazes de festivais de música de alta fidelidade visual, formatados para compartilhamento em redes sociais (9:16 / 1080 × 1920 pixels).

---

## Recursos Principais

- **Conexão Segura com Spotify (OAuth 2.0 PKCE):** Coleta dados dos artistas mais tocados nos períodos de 4 semanas, 6 meses ou todo o histórico.
- **Modos de Lineup:**
  - *Meu Gosto Musical:* Ranking fiel com headliners, sub-headliners e undercard.
  - *Por Gênero Musical:* Lineups temáticos dedicados (Rock, Pop, Indie, Eletrônica, Sertanejo, etc.).
  - *Por Popularidade:* Destaques ordenados pelo índice de popularidade musical.
- **4 Temas Visuais Exclusivos:**
  1. *Planeta Tropical* (inspirado no Planeta Atlântida)
  2. *Indie Waves* (inspirado no Lollapalooza Brasil)
  3. *Stadium Rock* (inspirado no Rock in Rio)
  4. *Festival Retrô* (estética tipográfica vintage / letterpress)
- **Exportação em Alta Resolução:** Geração instantânea de imagem PNG (1080x1920) e suporte à Web Share API nativa.
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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> No painel do Spotify Developer Dashboard, adicione a Redirect URI:  
> `http://localhost:3000/api/auth/callback`

### 3. Instalar Dependências e Executar
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

---

## Atribuições e Licenças

- **Spotify Web API**: Dados musicais fornecidos pela Spotify Web API sob seus termos de desenvolvedor. O Festiq não é afiliado, patrocinado ou endossado pelo Spotify AB.
- **Temas de Festivais**: As identidades visuais são tributos criativos originais da equipe Festiq. Nomes de festivais e palcos de terceiros são mencionados de forma puramente descritiva/homenagem cultural.
- **Licença**: MIT.
