import { Building2, MapPin, Star } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Card from "../../../shared/components/ui/Card";

export default function PartnerCard({ partner }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge tone="green">{partner.type}</Badge>
          <h3 className="mt-4 truncate text-lg font-medium" title={partner.name}>{partner.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/45"><MapPin size={15} /> {partner.region}</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint">
          <Building2 size={19} />
        </div>
      </div>
      <p className="mt-4 min-h-[48px] text-sm leading-6 text-white/50">{partner.focus}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-white/[0.035] p-3">
          <p className="text-xs text-white/42">Active deals</p>
          <p className="mt-1 font-medium">{partner.activeDeals}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.035] p-3">
          <p className="text-xs text-white/42">Rating</p>
          <p className="mt-1 flex items-center gap-1 font-medium"><Star size={14} className="text-xini-mint" /> {partner.rating}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
        <p className="text-xs text-white/42">Contact</p>
        <p className="mt-1 text-sm font-medium">{partner.contact}</p>
      </div>
    </Card>
  );
}
