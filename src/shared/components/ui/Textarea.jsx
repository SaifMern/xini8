import clsx from "clsx";
export default function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className={clsx("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      <textarea className={clsx("focus-ring min-h-28 w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3 text-sm text-xini-text outline-none transition placeholder:text-white/30 focus:border-xini-neon/60 focus:bg-white/[0.065]", error && "border-red-400/50")} {...props} />
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
