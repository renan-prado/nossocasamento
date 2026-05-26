import {
  MapPin,
  VolumeX,
  Mail,
  Cake,
  Clock,
  Home,
  Gem,
  MessageCircleOff,
  Shirt,
  GlassWater,
  Camera,
  Heart,
} from "lucide-react";

const items = [
  { icon: MapPin, label: "Confirme sua presença!" },
  { icon: VolumeX, label: "Na cerimônia deixe seu celular guardado e no modo silencioso" },
  { icon: Clock, label: "Não se atrase, se organize para chegar no horário" },
  { icon: Cake, label: "Aguarde a liberação da mesa de doces" },
  { icon: Mail, label: "Convidado não convida!" },
  { icon: Home, label: " É proibido levar parte da decoração para casa" },
  { icon: Shirt, label: "Dress code: esporte fino!" },
  { icon: Gem, label: "Branco é a cor da noiva!" },
  { icon: MessageCircleOff, label: "Não faça comentários negativos" },
  { icon: GlassWater, label: "Experimente vários pratos e coma a vontade" },
  { icon: Camera, label: "Não atrapalhe os fotógrafos e filmakers" },
  { icon: Heart, label: "Não vá embora sem se despedir dos noivos" },
];

export function GuestManualSection() {
  return (
    <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl w-full px-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-bege/80 font-light text-center">
          Manual dos
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl text-bege text-center leading-tight italic">
          Convidados
        </h2>
        <div className="w-12 h-px bg-bege/40 mt-2" />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-4 min-h-14">
            <Icon className="h-7 w-7 text-bege/80 shrink-0" strokeWidth={1.5} />
            <span className="text-base sm:text-lg text-bege/90 font-light leading-snug pt-0.5">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs uppercase tracking-[0.4em] text-bege/70 font-light text-center mt-2">
        Esperamos vocês!
      </p>
    </div>
  );
}
