import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "dark" | "outline" | "neutral" | "ghost" | "onDark";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  dark: "btn-dark",
  outline: "btn-outline",
  neutral: "btn-neutral",
  ghost: "btn-ghost",
  onDark: "btn-on-dark",
};

const sizeClass: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label. */
  iconRight?: string;
  fullWidth?: boolean;
}

interface LinkButtonProps extends BaseProps {
  href: string;
  /** External links always get target=_blank + rel="noopener noreferrer". */
  external?: boolean;
}

interface ActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    BaseProps {
  loading?: boolean;
  loadingLabel?: string;
}

function content(children: React.ReactNode, iconLeft?: string, iconRight?: string) {
  return (
    <>
      {iconLeft && <Icon name={iconLeft} className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} className="h-4 w-4 shrink-0" />}
    </>
  );
}

/** Link styled as a button. Use for navigation. */
export function ButtonLink({
  href, children, variant = "primary", size = "md", className, iconLeft, iconRight,
  fullWidth, external,
}: LinkButtonProps) {
  const classes = cn("btn", variantClass[variant], sizeClass[size], fullWidth && "w-full", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content(children, iconLeft, iconRight)}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content(children, iconLeft, iconRight)}
    </Link>
  );
}

/** Button element. Use for actions and form submission. */
export function Button({
  children, variant = "primary", size = "md", className, iconLeft, iconRight,
  fullWidth, loading, loadingLabel = "Working…", type = "button", disabled, ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn("btn", variantClass[variant], sizeClass[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {loading ? (
        <>
          <Icon name="Loader2" className="h-4 w-4 shrink-0 animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        content(children, iconLeft, iconRight)
      )}
    </button>
  );
}

/** Named aliases required by the brief. */
export function PrimaryButton(props: Omit<LinkButtonProps, "variant">) {
  return <ButtonLink {...props} variant="primary" />;
}
export function SecondaryButton(props: Omit<LinkButtonProps, "variant">) {
  return <ButtonLink {...props} variant="outline" />;
}
