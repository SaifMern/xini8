import { Check } from "lucide-react";
import { PROJECT_STATUSES } from "../../../shared/data/seedProjects";
export default function StatusTimeline({ status }) {
  const currentIndex = PROJECT_STATUSES.indexOf(status);
  return <div className="overflow-x-auto"><div className="flex min-w-max gap-2">{PROJECT_STATUSES.map((item, index) => { const done = index <= currentIndex; return <div key={item} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${done ? "border-xini-green/30 bg-xini-green/12 text-xini-mint" : "border-white/[0.06] bg-white/[0.035] text-white/40"}`}>{done && <Check size={14} />}{item}</div>; })}</div></div>;
}
