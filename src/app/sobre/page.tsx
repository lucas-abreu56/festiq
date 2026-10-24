import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, HelpCircle, Code2, Disc3 } from "lucide-react";

export const metadata = {
  title: "Sobre o Festiq | História, Tecnologia e FAQ",
  description:
    "Conheça a história do Festiq Studio, a inspiração no Receiptify, o motor tipográfico Zero-Truncate e respostas para dúvidas frequentes.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#141414] text-[#F7F6EB] px-4 sm:px-6 py-12 selection:bg-[#CEFF00] selection:text-black">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Barra superior de navegação */}
        <div className="flex items-center justify-between pb-6 border-b border-[#282828]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#A3A3A3] hover:text-[#CEFF00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Gerador</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <span>·</span>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos
            </Link>
          </div>
        </div>

        {/* Cabeçalho Editorial */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E1E] border border-[#282828] text-[11px] font-mono text-[#CEFF00]">
            <Sparkles className="w-3 h-3" />
            <span>FESTIQ STUDIO · HISTÓRIA E TECNOLOGIA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-frama font-black italic uppercase tracking-tight text-[#F7F6EB]">
            Seu gosto musical transformado em festival
          </h1>

          <p className="text-base sm:text-lg text-[#A3A3A3] leading-relaxed">
            O Festiq é uma ferramenta web independente que lê seus artistas mais ouvidos no Spotify e organiza uma escalação completa de festival em cartazes comemorativos em alta definição.
          </p>
        </header>

        {/* 1. Origem e Inspiração no Receiptify */}
        <section className="space-y-4 bg-[#1A1A1A] border border-[#282828] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#CEFF00] text-black flex items-center justify-center font-bold">
              <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <h2 className="text-xl sm:text-2xl font-frama font-black italic uppercase text-white">
              A inspiração no Receiptify
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[#D4D4D4] leading-relaxed">
            <p>
              Em 2020, a desenvolvedora Michelle Liu criou o <strong className="text-white">Receiptify</strong>, um projeto que transformava o histórico do Spotify em cupons fiscais estilizados de compras em papel térmico. O projeto viralizou pelo mundo e provou algo especial: as pessoas amam celebrar e compartilhar suas identidades musicais em formatos visuais autênticos.
            </p>
            <p>
              O Festiq nasceu desse mesmo entusiasmo pela cultura musical, mas trazendo o conceito para o universo dos palcos lendários. Em vez de recibos de supermercado, transformamos seus dados de streaming na arte gráfica de grandes festivais de música como Lollapalooza, Rock in Rio e Camp Flog Gnaw.
            </p>
          </div>
        </section>

        {/* 2. Engenharia e Diferenciais Técnicos */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-frama font-black italic uppercase text-white">
            Engenharia tipográfica e diferenciais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <span className="text-[11px] font-mono text-[#CEFF00] uppercase font-bold tracking-wider">
                01 · Zero-Truncate Rule
              </span>
              <h3 className="font-bold text-white text-base">Nomes 100% inteiros</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Diferente de geradores que cortam bandas longas com reticências, nosso motor tipográfico divide nomes compostos de forma balanceada e equaliza o peso visual para que nenhum artista seja mutilado.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <span className="text-[11px] font-mono text-[#CEFF00] uppercase font-bold tracking-wider">
                02 · Resolução Nativa 1080p
              </span>
              <h3 className="font-bold text-white text-base">Stories 9:16 e Feed 1:1</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                A exportação gera imagens PNG em resolução exata de 1080×1920 pixels para Stories e 1080×1080 pixels para o Feed, sem compressão destrutiva e prontas para compartilhar.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <span className="text-[11px] font-mono text-[#CEFF00] uppercase font-bold tracking-wider">
                03 · Retratos Fotográficos
              </span>
              <h3 className="font-bold text-white text-base">Headliners com fotos reais</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Integração inteligente com a API aberta da Deezer para buscar retratos fotográficos em alta definição dos principais headliners do seu cartaz.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <span className="text-[11px] font-mono text-[#CEFF00] uppercase font-bold tracking-wider">
                04 · Privacidade Efêmera
              </span>
              <h3 className="font-bold text-white text-base">Zero banco de dados</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Não exigimos cadastro de e-mail nem salvamos seu histórico musical. Todo o processamento dos dados ocorre de maneira efêmera e temporária no seu próprio navegador.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Perguntas Frequentes (FAQ) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#CEFF00]" />
            <h2 className="text-xl sm:text-2xl font-frama font-black italic uppercase text-white">
              Perguntas Frequentes (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <h3 className="font-bold text-white text-sm">É seguro conectar minha conta do Spotify?</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Sim, totalmente seguro. A autenticação utiliza o protocolo aberto OAuth 2.0 com PKCE. Você faz login diretamente nos servidores do Spotify, e o Festiq nunca tem acesso a suas senhas, mensagens ou dados de pagamento.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <h3 className="font-bold text-white text-sm">
                Por que uma música ou artista que ouvi hoje não apareceu no cartaz?
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                A Spotify Web API calcula os artistas mais ouvidos com base em três períodos consolidados: 4 semanas (recente), 6 meses (médio prazo) e todo o histórico da conta. O Spotify aplica uma fórmula própria de afinidade ponderada que pode levar alguns dias para refletir faixas tocadas hoje.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <h3 className="font-bold text-white text-sm">Posso usar o Festiq sem fazer login?</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Sim. Ao abrir o aplicativo sem conectar o Spotify, o Festiq ativa o Modo Demonstração com uma seleção curada de artistas representativos para você explorar todos os temas, filtros e exportações livremente.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <h3 className="font-bold text-white text-sm">Como faço para desconectar minha conta?</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Basta clicar no botão de logout no cabeçalho da página principal para limpar sua sessão local, ou acessar a central de aplicativos conectados do Spotify em seu perfil para revogar a permissão a qualquer momento.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
              <h3 className="font-bold text-white text-sm">O Festiq cobra pelo download das imagens?</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Não. O Festiq é 100% gratuito e não cobra por nenhuma funcionalidade de geração ou exportação de pôsteres.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Créditos do Desenvolvedor e Código Aberto */}
        <section className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-4">
          <div className="flex items-center gap-2 text-[#CEFF00]">
            <Code2 className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              Desenvolvimento e Código Aberto
            </h2>
          </div>

          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            O Festiq Studio foi idealizado e desenvolvido por <strong className="text-white">Lucas Schwingel</strong>. O projeto tem código aberto sob a Licença MIT e respeita as diretrizes de desenvolvimento da Spotify Developer Platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <a
              href="https://github.com/lucas-abreu56/festiq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242424] text-white hover:bg-[#CEFF00] hover:text-black transition-colors font-bold"
            >
              <span>GitHub do Repositório</span>
              <span>↗</span>
            </a>
            <Link
              href="/privacidade"
              className="text-[#A3A3A3] hover:text-[#CEFF00] transition-colors underline-offset-4 hover:underline"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-[#A3A3A3] hover:text-[#CEFF00] transition-colors underline-offset-4 hover:underline"
            >
              Termos de Uso
            </Link>
          </div>
        </section>

        {/* Rodapé da página sobre */}
        <footer className="text-center pt-8 border-t border-[#282828] text-xs font-mono text-[#737373]">
          <p>Festiq Studio · Tributos artísticos e celebração da cultura dos festivais de música.</p>
        </footer>
      </div>
    </main>
  );
}
