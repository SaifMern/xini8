import { Link } from "react-router-dom";
import { Bell, Lock, Play, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import ProgressBar from "../../../shared/components/ui/ProgressBar";

export default function ContentCard({ item }) {
  if (!item) return null;
  const isPaid = item.access !== "public";

  return (
    <Link
      to={`/streaming/content/${item.id}`}
      className="group block overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-xini-green/35 hover:bg-white/[0.055]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-xini-card">
        <img
          src={item.thumbnail || item.poster}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/12 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone={isPaid ? "warning" : "green"}>{item.accessLabel}</Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-xini-green text-white shadow-[0_0_20px_rgba(32,148,110,.32)]">
            {isPaid && !item.canPlay ? <Lock size={15} /> : <Play size={16} fill="currentColor" />}
          </div>
          <div className="flex gap-2 text-white/75">
            {item.isCreatorFollowed && <UserPlus size={16} />}
            {(item.isReleaseNotificationOn || item.isPremiereNotificationOn) && <Bell size={16} />}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="default">{item.typeLabel}</Badge>
          <span className="rounded-full bg-white/[0.045] px-3 py-1 text-[11px] text-white/45">{item.runtime}</span>
        </div>
        <h3 className="xini-line-1 mt-3 text-sm font-medium text-xini-text" title={item.title}>{item.title}</h3>
        <p className="xini-line-1 mt-1 text-xs text-white/45" title={`${item.genre} · ${item.creatorName}`}>
          {item.genre} · {item.creatorName}
        </p>
        {item.watchProgress > 0 && (
          <div className="mt-3">
            <ProgressBar value={item.watchProgress} />
            <p className="mt-1 text-[11px] text-white/42">Continue watching · {Math.round(item.watchProgress)}%</p>
          </div>
        )}
      </div>
    </Link>
  );
}
