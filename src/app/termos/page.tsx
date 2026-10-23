import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Festiq",
  description: "Termos de uso, isenções legais e diretrizes para compartilhamento dos cartazes gerados no Festiq.",
};

export default function TermsPage() {
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
            <Link href="/privacidade" className="hover:text-[#CEFF00] transition-colors">
              Privacidade
            </Link>
            <span>·</span>
            <span className="text-white font-bold">Termos</span>
          </div>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-frama font-black italic uppercase text-white">
            Termos de Uso
          </h1>
          <p className="text-xs font-mono text-[#A3A3A3]">
            Diretrizes de utilização, homenagens gráficas e uso recreativo
          </p>
        </header>

        <div className="space-y-6 text-sm text-[#D4D4D4] leading-relaxed">
          <p>
            O <strong>Festiq</strong> é uma aplicação web experimental e recreativa desenvolvida para permitir que usuários transformem seus históricos musicais do Spotify em pôsteres comemorativos no formato de festivais de música.
          </p>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">1. Homenagens Artísticas e Isenção de Marcas</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Os temas visuais disponibilizados no Festiq (como Indie Waves, Impresso 85, Planeta Atlântida e Camp Carnival) constituem tributos gráficos e homenagens autorais à rica história e cultura dos festivais de música.
            </p>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              O Festiq não utiliza logotipos oficiais registrados, nomes corporativos como marcas de produto nem insígnias de patrocinadores oficiais. O projeto não possui vínculo societário, patrocínio ou endosso por parte do Spotify AB ou das produtoras dos eventos citados.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">2. Uso Pessoal e Compartilhamento Social</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Os cartazes gerados destinam-se exclusivamente para entretenimento e compartilhamento pessoal em redes sociais (como Stories, Reels e Feed). É proibida a utilização comercial dos pôsteres gerados ou a venda de impressos com fins lucrativos.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-xl bg-[#181818] border border-[#282828]">
            <h2 className="text-base font-bold text-white">3. Disponibilidade do Serviço</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Como o Festiq depende do fornecimento de dados pela Spotify Web API e pela API de fotos da Deezer, a disponibilidade ininterrupta do serviço está condicionada à operação dos serviços de terceiros.
            </p>
          </section>
        </div>

        <footer className="text-center pt-8 border-t border-[#282828] text-xs font-mono text-[#737373]">
          <p>Festiq Studio · Código aberto sob Licença MIT para fins recreativos e culturais.</p>
        </footer>
      </div>
    </main>
  );
}
