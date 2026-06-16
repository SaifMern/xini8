import { Link } from "react-router-dom";
import Badge from "../../../shared/components/ui/Badge";
import Card from "../../../shared/components/ui/Card";
import ProgressBar from "../../../shared/components/ui/ProgressBar";
import { formatCurrency } from "../../../shared/utils/formatters";
export default function ProjectCard({ project }) {
  const progress = project.fundingGoal ? (project.currentFunding / project.fundingGoal) * 100 : 0;
  const tone = project.status === "Draft" ? "muted" : project.status === "Under Review" ? "warning" : project.status === "Released" ? "success" : "green";
  return <Link to={`/projects/${project.id}`}><Card className="h-full transition hover:border-xini-green/35"><div className="flex items-start justify-between gap-3"><div><Badge tone={tone}>{project.status}</Badge><h3 className="mt-4 text-lg font-medium">{project.title}</h3><p className="mt-1 text-sm xini-muted">{project.genre} · {project.language}</p></div><div className="rounded-2xl bg-white/[0.045] px-3 py-2 text-xs text-white/45">{project.lifecycleStage}</div></div><p className="mt-4 line-clamp-2 text-sm leading-7 text-white/55">{project.synopsis}</p><div className="mt-5"><div className="mb-2 flex justify-between text-xs text-white/45"><span>{formatCurrency(project.currentFunding)}</span><span>{formatCurrency(project.fundingGoal)}</span></div><ProgressBar value={progress} /></div><div className="mt-5 grid grid-cols-3 gap-2 text-xs"><Stat label="Team" value={project.team?.length || 0} /><Stat label="Milestones" value={project.milestones?.length || 0} /><Stat label="Updates" value={project.updates?.length || 0} /></div></Card></Link>;
}
function Stat({ label, value }) { return <div className="rounded-2xl bg-white/[0.035] p-3"><p className="text-white/40">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
