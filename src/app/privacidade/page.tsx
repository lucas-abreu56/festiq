import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Festiq",
  description: "Conheça as diretrizes de segurança, privacidade e uso de dados da API do Spotify no Festiq.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#141414] text-[#F7F6EB] px-4 sm:px-6 py-12 selection:bg-[#CEFF00] selection:text-black">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Barra superior de navegação */}
        <div className="flex items-center justify-between pb-6 border-b border-[#282828]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#A3A3A3] hover:text-[#CEFF00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Gerador</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono text-[#A3A3A3]">
            <Link href="/sobre" className="hover:text-[#CEFF00] transition-colors">
              Sobre & FAQ
            </Link>
            <span>·</span>
            <span className="text-white font-bold">Privacidade</span>
            <span>·</span>
            <Link href="/termos" className="hover:text-[#CEFF00] transition-colors">
              Termos
            </Link>
          </div>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-frama font-black italic uppercase text-white">
            Política de Privacidade
          </h1>
          <p className="text-xs font-mono text-[#A3A3A3]">
            Transparência e segurança no consumo da Spotify Web API
          </p>
        </header>

        <div className="space-y-6 text-sm text-[#D4D4D4] leading-relaxed">
          <p>
            O <strong>Festiq</strong> foi construído sob o princípio de privacidade por padrão. A aplicação não realiza cadastro prévio, não solicita senhas pessoais e não armazena o histórico musical dos usuários em bancos de dados.
          </p>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">1. Autenticação Segura via OAuth 2.0 com PKCE</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              O acesso à sua conta utiliza o protocolo <strong>OAuth 2.0 com PKCE</strong> (Proof Key for Code Exchange). O login é realizado inteiramente dentro dos servidores oficiais do Spotify (<code className="text-[#CEFF00]">accounts.spotify.com</code>).
            </p>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              O Festiq nunca recebe, processa ou armazena suas credenciais de acesso, senhas ou dados financeiros.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">2. Dados Acessados e Escopos de Leitura</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Solicitamos exclusivamente duas permissões de leitura durante a autorização:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#A3A3A3] leading-relaxed">
              <li>
                <code className="text-[#CEFF00]">user-top-read</code>: leitura dos artistas e músicas mais ouvidos nos períodos selecionados (4 semanas, 6 meses ou histórico completo) para compor a grade do cartaz.
              </li>
              <li>
                <code className="text-[#CEFF00]">user-read-private</code>: leitura do nome de exibição para sugerir o título comemorativo do evento.
              </li>
            </ul>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              O Festiq não solicita permissões de escrita ou modificação. O aplicativo não pode alterar suas músicas salvas, criar ou excluir playlists, nem controlar a reprodução do seu aplicativo Spotify.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">3. Processamento Efêmero e Cookies HTTP-Only</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Não mantemos banco de dados relacional ou armazenamento persistente. Os dados consultados existem apenas na memória durante a geração visual do pôster.
            </p>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Os tokens temporários de sessão ficam guardados em cookies do navegador protegidos com a bandeira <code className="text-[#CEFF00]">httpOnly</code>, atributo <code className="text-[#CEFF00]">SameSite=Lax</code> e transmissão criptografada em HTTPS. Isso impede a leitura indevida por scripts maliciosos de terceiros.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">4. Revogação e Controle pelo Usuário</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Você tem controle total sobre o acesso à sua conta a qualquer momento:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#A3A3A3] leading-relaxed">
              <li>
                <strong>Pelo Festiq:</strong> clique no botão de desconexão no topo da tela para encerrar a sessão e excluir os cookies locais imediatamente.
              </li>
              <li>
                <strong>Pelo Spotify:</strong> acesse a página oficial de{" "}
                <a
                  href="https://www.spotify.com/account/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CEFF00] underline hover:text-white"
                >
                  aplicativos conectados do Spotify
                </a>{" "}
                e clique em &quot;Remover acesso&quot;. Os tokens existentes são invalidados instantaneamente nos servidores do Spotify.
              </li>
            </ul>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">5. Isenção Legal</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              O Festiq é uma ferramenta independente que consome a Spotify Web API de acordo com os termos da plataforma. Não temos vínculo societário, patrocínio ou endosso da Spotify AB.
            </p>
          </section>
        </div>

        <footer className="text-center pt-8 border-t border-[#282828] text-xs font-mono text-[#737373]">
          <p>Festiq Studio · Privacidade por padrão e transparência com seus dados musicais.</p>
        </footer>
      </div>
    </main>
  );
}
