"use client";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <h1 className="text-page-title text-foreground">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
