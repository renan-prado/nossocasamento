import { ReactNode } from "react";

type SnapSectionProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

const baseSectionClasses =
  "snap-start snap-always relative flex items-center justify-center h-screen w-screen";

export function SnapSection({ children, name, className }: SnapSectionProps) {
  return (
    <section
      id={name}
      className={`${baseSectionClasses} ${className ?? ""}`}
      data-section-name={name}
    >
      {children}
    </section>
  );
}

