import Link from "next/link";
import { Heart } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50 font-light">
            Obrigado pelo presente
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            Que presente lindo!
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Seu pagamento foi confirmado. Danielle e Renan agradecem de coração pelo carinho e pela
            presença especial na nossa vida.
          </p>
        </div>

        <div className="w-16 h-px bg-white/20" />

        <Link
          href="/danielle-e-renan"
          className="rounded-full bg-white text-neutral-900 px-8 py-3 text-sm font-semibold hover:bg-white/90 transition-all hover:shadow-xl active:scale-95"
        >
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
