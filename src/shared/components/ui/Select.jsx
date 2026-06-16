import clsx from "clsx";
export default function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <div className={clsx("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      <select className={clsx("focus-ring h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 text-sm text-xini-text outline-none transition focus:border-xini-neon/60 focus:bg-white/[0.065]", error && "border-red-400/50")} {...props}>
        {options.map((option) => <option key={option.value} value={option.value} className="bg-xini-section text-xini-text">{option.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
