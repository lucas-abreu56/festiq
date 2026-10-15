# Guia de Configuração e Setup — Festiq

Instruções para configurar o ambiente de desenvolvimento local, o painel do Spotify e os fluxos de autenticação.

---

## 1. Configurando o Spotify Developer Dashboard

1. Acesse o **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)** com sua conta Spotify.
2. Clique em **Create app**.
3. Defina:
   - **App name:** `Festiq`
   - **App description:** `Gerador de lineups e pôsteres de festivais de música`
   - **Redirect URIs:**
     - Desenvolvimento: `http://localhost:3000/api/auth/callback`
     - Produção (futuro): `https://seu-dominio.vercel.app/api/auth/callback`
   - **Which API/SDKs are you planning to use?:** Marque `Web API`.
4. Salve o aplicativo.
5. Em **Settings**:
   - Copie o **Client ID**.
   - Clique em **View client secret** e copie o **Client Secret**.
6. Em **User Management** (ou *Users and Access*):
   - Adicione o seu e-mail do Spotify para permitir testes durante o modo de desenvolvimento.

---

## 2. Configurando o Ambiente Local

1. No diretório raiz do projeto, edite o arquivo `.env.local`:
   ```env
   SPOTIFY_CLIENT_ID=<seu-client-id>
   SPOTIFY_CLIENT_SECRET=<seu-client-secret>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
2. Instale as dependências:
   ```powershell
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```powershell
   npm run dev
   ```

---

## 3. Verificação Rápida de Conectividade

Para testar se suas credenciais do Spotify respondem antes de abrir o navegador:
```powershell
# Obter token de Client Credentials (teste de credenciais válidas)
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${env:SPOTIFY_CLIENT_ID}:${env:SPOTIFY_CLIENT_SECRET}"))
Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method POST -Headers @{ Authorization = "Basic $auth" } -Body @{ grant_type = "client_credentials" }
```
Se devolver um JSON com `access_token` e `token_type: "Bearer"`, suas credenciais estão funcionando perfeitamente.
