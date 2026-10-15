export default function TermsPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 text-brand-text">
      <a href="/" className="inline-block text-xs font-mono text-brand-accent hover:underline mb-8">
        ← Voltar ao Festiq
      </a>
      <h1 className="text-3xl font-display font-black uppercase text-white mb-6">
        Termos de Uso
      </h1>
      <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
        <p>
          O <strong>Festiq</strong> é uma aplicação de geração de pôsteres comemorativos e de entretenimento baseada em hábitos musicais pessoais.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">1. Direitos e Marcas de Terceiros</h2>
        <p>
          O Festiq não possui vínculo comercial, endosso ou afiliação oficial com o Spotify AB nem com os organizadores de festivais mencionados de forma artística ou descritiva (como Lollapalooza, Rock in Rio ou Planeta Atlântida).
        </p>
        <p>
          Os temas visuais representam homenagens criativas originais e paródias de design cultural para celebração de gostos musicais individuais.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">2. Uso Pessoal e Redes Sociais</h2>
        <p>
          Os pôsteres gerados destinam-se exclusivamente ao compartilhamento pessoal e recreativo em redes sociais.
        </p>
      </div>
    </main>
  );
}
