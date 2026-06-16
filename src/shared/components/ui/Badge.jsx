import clsx from "clsx";
const tones = {
  default: "border-white/[0.08] bg-white/[0.055] text-white/70",
  success: "border-xini-neon/20 bg-xini-neon/10 text-xini-mint",
  warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
  danger: "border-red-500/20 bg-red-500/10 text-red-200",
  green: "border-xini-green/25 bg-xini-green/10 text-xini-mint",
  muted: "border-white/[0.06] bg-white/[0.035] text-white/45",
};
export default function Badge({ children, tone = "default", className = "" }) {
  return <span className={clsx("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", tones[tone], className)}>{children}</span>;
}
