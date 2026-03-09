import Link from "next/link";
import { Gift, Users, MessageSquare, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Admin · Menu",
};

const pages = [
  {
    href: "/admin/presentes",
    icon: Gift,
    label: "Presentes",
    description: "Cadastrar, editar e remover presentes da lista",
  },
  {
    href: "/admin/cadastrar-convidado",
    icon: Users,
    label: "Convidados",
    description: "Gerenciar convidados do casamento",
  },
  {
    href: "/admin/mensagens",
    icon: MessageSquare,
    label: "Mensagens",
    description: "Ver mensagens deixadas pelos convidados",
  },
];

export default function AdminMenuPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Painel Admin</h1>
          <p className="text-sm text-neutral-400">Selecione uma seção para gerenciar</p>
        </div>

        <div className="flex flex-col gap-2">
          {pages.map(({ href, icon: Icon, label, description }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl bg-white border border-neutral-200 px-5 py-4 hover:border-neutral-400 hover:shadow-sm active:scale-[0.99] transition-all"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 shrink-0">
                <Icon className="w-5 h-5 text-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{label}</p>
                <p className="text-xs text-neutral-400 truncate">{description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
