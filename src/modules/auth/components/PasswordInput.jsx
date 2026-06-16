import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
export default function PasswordInput({ label = "Password", error, className = "", ...props }) {
  const [show, setShow] = useState(false);
  return <div className={clsx("space-y-2", className)}><label className="text-sm font-medium text-white/70">{label}</label><div className={clsx("flex h-12 items-center rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 transition focus-within:border-xini-neon/60 focus-within:bg-white/[0.065]", error && "border-red-400/50")}><input type={show ? "text" : "password"} className="w-full bg-transparent text-sm text-xini-text outline-none placeholder:text-white/30" {...props} /><button type="button" onClick={() => setShow(!show)} className="ml-3 text-white/45 hover:text-xini-mint">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <p className="text-xs text-red-300">{error}</p>}</div>;
}
