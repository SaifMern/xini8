import { Link } from "react-router-dom";
import { ArrowRight, Globe2, RadioTower } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Card from "../../../shared/components/ui/Card";
import ProgressBar from "../../../shared/components/ui/ProgressBar";

function statusTone(status) {
  if (["Deal Closed", "Available"].includes(status)) return "success";
  if (["Negotiating", "Partner Interested"].includes(status)) return "green";
  if (["Reviewing", "Meeting Scheduled"].includes(status)) return "warning";
  return "default";
}

export default function DistributionProjectCard({ project }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-44 overflow-hidden">
        <img src={project.poster} alt={project.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-xini-bg/90 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <Badge tone={statusTone(project.distributionStatus)}>{project.distributionStatus}</Badge>
          <Badge>{project.genre}</Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-medium" title={project.title}>{project.title}</h3>
            <p className="mt-1 text-sm text-white/45">{project.creatorName}</p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint">
            <Globe2 size={18} />
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/50">{project.contentStatus}</p>

        <div className="mt-5 space-y-3">
          <div>
            <div className="mb-2 flex justify-between text-xs text-white/45">
              <span>Distribution readiness</span>
              <span>{project.readinessScore}%</span>
            </div>
            <ProgressBar value={project.readinessScore} />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs text-white/45">
              <span>Material package</span>
              <span>{project.materialProgress}%</span>
            </div>
            <ProgressBar value={project.materialProgress} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/[0.035] p-3">
            <p className="text-xs text-white/42">Partner interest</p>
            <p className="mt-1 font-medium">{project.interestCount}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.035] p-3">
            <p className="text-xs text-white/42">Open requests</p>
            <p className="mt-1 font-medium">{project.openRequests}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.targetMarkets.slice(0, 3).map((market) => (
            <span key={market} className="inline-flex items-center gap-1 rounded-full bg-white/[0.045] px-3 py-1 text-xs text-white/50">
              <RadioTower size={12} /> {market}
            </span>
          ))}
        </div>

        <Link to={`/distribution/projects/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-xini-mint hover:text-xini-neon">
          Open distribution profile <ArrowRight size={15} />
        </Link>
      </div>
    </Card>
  );
}
