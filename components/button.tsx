import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "gold";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const styles = {
  solid:
    "bg-ink text-white hover:bg-black",
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-white",
  gold: "bg-gold text-ink hover:bg-gold-soft",
};

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-sm px-5 py-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:px-7 sm:tracking-[0.22em] ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
