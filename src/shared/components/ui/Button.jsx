import clsx from "clsx";

const variants = {
  primary: "bg-xini-green text-white shadow-[0_0_24px_rgba(32,148,110,0.32)] hover:bg-xini-neon",
  secondary: "border border-white/[0.08] bg-white/[0.055] text-xini-text hover:bg-white/[0.09]",
  outline: "border border-xini-green/30 text-xini-mint hover:border-xini-neon hover:bg-xini-neon/10",
  ghost: "text-white/62 hover:bg-white/[0.055] hover:text-xini-text",
  danger: "border border-red-500/20 bg-red-500/12 text-red-200 hover:bg-red-500/18",
};

const sizes = { sm: "h-9 px-4 text-xs", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-sm" };

export default function Button({ children, variant = "primary", size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={clsx("focus-ring inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
