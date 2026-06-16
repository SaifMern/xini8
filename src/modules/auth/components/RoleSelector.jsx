import { CheckCircle2 } from "lucide-react";
import { roleOptions } from "../../../shared/data/seedUsers";
export default function RoleSelector({ value, onChange }) {
  return <div className="space-y-3"><label className="text-sm font-medium text-white/70">Select role</label><div className="grid gap-3">{roleOptions.map((role) => { const active = value === role.value; return <button key={role.value} type="button" onClick={() => onChange(role.value)} className={`rounded-3xl border p-4 text-left transition ${active ? "border-xini-neon/50 bg-xini-green/15" : "border-white/[0.06] bg-white/[0.035] hover:border-xini-green/35"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-medium">{role.label}</h3><p className="mt-1 text-xs leading-6 text-white/45">{role.description}</p></div>{active && <CheckCircle2 className="shrink-0 text-xini-mint" size={19} />}</div></button>; })}</div></div>;
}
