import type { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ colorScheme: "light" }}>
      {children}
    </div>
  );
}
