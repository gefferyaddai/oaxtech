import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Narrower measure for reading-heavy sections. */
  narrow?: boolean;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}

/** Shared page container — the single source of horizontal rhythm. */
export function Container({ children, className, narrow, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={cn("container-page", narrow && "max-w-container-narrow", className)}>
      {children}
    </Tag>
  );
}
