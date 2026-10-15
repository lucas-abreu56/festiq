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
3. **Resolução de Exportação Obrigatória**:
   - Todos os pôsteres exportados devem ter exatamente a proporção **9:16** e dimensões de **1080 × 1920 pixels**, sem cortes em nomes de artistas ou vazamento fora da borda útil.

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
- **Tipografia Adaptativa**: Headliners recebem prioridade máxima e quebra inteligente em até 2 linhas; undercard tem ajuste dinâmico de tamanho para nunca sobrepor elementos.

---

## 5. Armadilhas deste Projeto

- **Spotify Auth em Modo Desenvolvimento:** Contas de teste precisam estar adicionadas na aba *User Management* do dashboard do Spotify, caso contrário o login retorna erro de permissão.
- **Exportação com `html-to-image`:** Imagens externas e fontes personalizadas precisam estar totalmente embutidas (data-uri ou fontes carregadas) para evitar que o canvas gere PNG com fontes padrão ou falhas de CORS.
- **`check-ignore` antes de criar arquivos locais:** Sempre valide `git check-ignore -v <arquivo>` para qualquer arquivo `*.local.md`.
