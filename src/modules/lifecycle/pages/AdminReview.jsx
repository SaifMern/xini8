import { useEffect, useState } from "react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import { projectService } from "../services/projectService";
import { useAuth } from "../../auth/store/AuthContext";
import StatusTimeline from "../components/StatusTimeline";

export default function AdminReview() {
  const { user, notify } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const load = async () => { const data = await projectService.listProjects({ user }); setProjects(data); setSelected(data.find(p => ["Submitted","Under Review"].includes(p.status)) || data[0] || null); };
  useEffect(()=>{ load(); }, []);
  const setStatus = async (status) => { if (!selected) return; const res = await projectService.setStatus(selected.id, status); setSelected(res.project); notify(res.message); const data = await projectService.listProjects({ user }); setProjects(data); };
  return <div className="space-y-6"><div><Badge tone="success">Project Approval</Badge><h1 className="xini-heading-lg mt-4">Review queue</h1><p className="mt-2 max-w-2xl text-sm xini-muted">Admin can approve, reject, or move project lifecycle status for demo governance.</p></div><div className="grid gap-6 xl:grid-cols-[360px_1fr]"><Card><h2 className="xini-heading-md">Pending projects</h2><div className="mt-5 space-y-3">{projects.map(project=><button key={project.id} onClick={()=>setSelected(project)} className={`w-full rounded-3xl border p-4 text-left transition ${selected?.id===project.id ? "border-xini-green/45 bg-xini-green/10" : "border-white/[0.06] bg-white/[0.035] hover:border-xini-green/30"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{project.title}</p><p className="mt-1 text-xs text-white/45">{project.genre}</p></div><Badge tone={project.status === "Under Review" ? "warning" : "green"}>{project.status}</Badge></div></button>)}</div></Card>{selected && <Card><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge tone="green">{selected.status}</Badge><h2 className="xini-heading-md mt-4">{selected.title}</h2><p className="mt-2 text-sm leading-7 xini-muted">{selected.synopsis}</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={()=>setStatus("Under Review")}>Under Review</Button><Button onClick={()=>setStatus("Approved")}>Approve</Button><Button variant="outline" onClick={()=>setStatus("Funding Open")}>Funding Open</Button><Button variant="danger" onClick={()=>setStatus("Draft")}>Send Back</Button></div></div><div className="mt-6"><StatusTimeline status={selected.status}/></div><div className="mt-6 grid gap-4 md:grid-cols-3"><Info label="Budget" value={`$${selected.budget?.toLocaleString()}`}/><Info label="Funding Goal" value={`$${selected.fundingGoal?.toLocaleString()}`}/><Info label="Team" value={`${selected.team?.length || 0} members`}/></div></Card>}</div></div>;
}
function Info({label,value}){return <div className="rounded-2xl bg-white/[0.035] p-4"><p className="text-xs text-white/40">{label}</p><p className="mt-1 font-medium">{value}</p></div>}
