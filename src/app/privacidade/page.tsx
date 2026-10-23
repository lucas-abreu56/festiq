import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 text-brand-text">
      <Link href="/" className="inline-block text-xs font-mono text-brand-accent hover:underline mb-8">
        ← Voltar ao Festiq
      </Link>
      <h1 className="text-3xl font-display font-black uppercase text-white mb-6">
        Política de Privacidade
      </h1>
      <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
        <p>
          O <strong>Festiq</strong> foi desenvolvido com privacidade em primeiro lugar. Nós não solicitamos nem armazenamos cadastro de usuário, senhas ou histórico de escutas em bancos de dados permanentes.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">1. Dados do Spotify</h2>
        <p>
          Ao conectar sua conta do Spotify via OAuth 2.0, solicitamos apenas a permissão para ler seus artistas mais tocados (<code className="text-brand-accent">user-top-read</code>) e seu perfil público (<code className="text-brand-accent">user-read-private</code>).
        </p>
        <p>
          Esses dados são processados temporariamente durante a sua sessão no navegador para compor o cartaz e sugerir o nome do evento.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">2. Armazenamento e Revogação</h2>
        <p>
          Os tokens de autenticação são mantidos em cookies protegidos de sessão e expiram automaticamente. Você pode desconectar sua conta a qualquer momento clicando no botão de desconexão no cabeçalho ou revogando o acesso no painel oficial do Spotify.
        </p>
      </div>
    </main>
  );
}
