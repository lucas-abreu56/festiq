import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | Festiq",
  description: "Conheça as diretrizes de segurança, privacidade e uso de dados da API do Spotify no Festiq.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 text-brand-text">
      <Link href="/" className="inline-block text-xs font-mono text-brand-accent hover:underline mb-8">
        ← Voltar ao Festiq
      </Link>
      <h1 className="text-3xl font-display font-black uppercase text-white mb-6">
        Política de Privacidade
      </h1>
      <div className="space-y-6 text-sm text-brand-muted leading-relaxed">
        <p>
          O <strong>Festiq</strong> foi construído sob o princípio de privacidade por padrão. A aplicação não realiza cadastro prévio, não solicita senhas pessoais e não armazena o histórico musical dos usuários em bancos de dados.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Autenticação Segura via OAuth 2.0 com PKCE</h2>
          <p>
            O acesso à sua conta utiliza o protocolo <strong>OAuth 2.0 com PKCE</strong> (Proof Key for Code Exchange). O login é realizado inteiramente dentro dos servidores oficiais do Spotify (<code className="text-brand-accent">accounts.spotify.com</code>).
          </p>
          <p>
            O Festiq nunca recebe, processa ou armazena suas credenciais de acesso, senhas ou dados financeiros.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Dados Acessados e Escopos de Leitura</h2>
          <p>
            Solicitamos exclusivamente duas permissões de leitura durante a autorização:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="text-brand-accent">user-top-read</code>: leitura dos 45 artistas e músicas mais ouvidos nos períodos selecionados (4 semanas, 6 meses ou histórico completo) para compor a grade do cartaz.
            </li>
            <li>
              <code className="text-brand-accent">user-read-private</code>: leitura do nome de exibição para sugerir o título comemorativo do evento.
            </li>
          </ul>
          <p>
            O Festiq não solicita permissões de escrita ou modificação. O aplicativo não pode alterar suas músicas salvas, criar ou excluir playlists, nem controlar a reprodução do seu aplicativo Spotify.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Processamento Efêmero e Cookies HTTP-Only</h2>
          <p>
            Não mantemos banco de dados relacional ou armazenamento persistente. Os dados consultados existem apenas na memória durante a geração visual do pôster.
          </p>
          <p>
            Os tokens temporários de sessão ficam guardados em cookies do navegador protegidos com a bandeira <code className="text-brand-accent">httpOnly</code>, atributo <code className="text-brand-accent">SameSite=Lax</code> e transmissão criptografada em HTTPS. Isso impede a leitura indevida por scripts maliciosos de terceiros.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Revogação e Controle pelo Usuário</h2>
          <p>
            Você tem controle total sobre o acesso à sua conta a qualquer momento:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Pelo Festiq:</strong> clique no botão de desconexão no topo da tela para encerrar a sessão e excluir os cookies locais imediatamente.
            </li>
            <li>
              <strong>Pelo Spotify:</strong> acesse a página oficial de{" "}
              <a
                href="https://www.spotify.com/account/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent underline hover:text-white"
              >
                aplicativos conectados do Spotify
              </a>{" "}
              e clique em &quot;Remover acesso&quot;. Os tokens existentes são invalidados instantaneamente nos servidores do Spotify.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Isenção Legal</h2>
          <p>
            O Festiq é uma ferramenta independente que consome a Spotify Web API de acordo com os termos da plataforma. Não temos vínculo societário, patrocínio ou endosso da Spotify AB.
          </p>
        </section>
      </div>
    </main>
  );
}
