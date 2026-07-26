import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level — keeps the document outline logical on every page. */
  as?: "h2" | "h3";
  id?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow, title, description, align = "center", className, as: Tag = "h2", id, action,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3",
        centered ? "items-center text-center" : "items-start text-left",
        action ? "sm:flex-row sm:items-end sm:justify-between" : undefined,
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", centered && "items-center")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag id={id} className={cn("text-display-md", centered && "max-w-2xl")}>
          {title}
        </Tag>
        {description && (
          <p className={cn("text-lg text-slate", centered ? "max-w-2xl" : "max-w-xl")}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
