export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-4">
        <div className="inline-block px-3 py-1 bg-brand-surface border border-brand-border rounded-full text-xs font-mono text-brand-muted">
          Festiq v1 · MVP
        </div>
        <h1 className="text-4xl font-display uppercase tracking-wider font-bold">
          Your Taste. Your Festival.
        </h1>
        <p className="text-sm text-brand-muted">
          Transforme seus dados do Spotify em pôsteres de festivais 9:16 prontos para redes sociais.
        </p>
      </div>
    </main>
  );
}
