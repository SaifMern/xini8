import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Film, Plus, ShieldCheck, Wallet, Clock, Clapperboard, Network } from "lucide-react";
import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";
import Badge from "../shared/components/ui/Badge";
import ProgressBar from "../shared/components/ui/ProgressBar";
import { useAuth } from "../modules/auth/store/AuthContext";
import { projectService } from "../modules/lifecycle/services/projectService";
import { streamingService } from "../modules/streaming/services/streamingService";
import { distributionService } from "../modules/distribution/services/distributionService";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [media, setMedia] = useState([]);
  const [distribution, setDistribution] = useState({ projects: [], partners: [], requests: [], interests: [] });
  useEffect(() => { projectService.listProjects({ user }).then(setProjects); streamingService.listContent({ user }).then(setMedia); distributionService.getOverview().then(setDistribution); }, [user]);
  const active = projects.filter((p) => !["Archived", "Released"].includes(p.status)).length;
  const completedMilestones = projects.flatMap((p) => p.milestones || []).filter((m) => m.status === "completed").length;
  const docs = projects.flatMap((p) => p.studio?.documents || []).length;
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><Badge tone="success">Modules 1 + 2 + 3 + 4 + 5</Badge><h1 className="xini-heading-lg mt-4">Welcome, {user.fullName}</h1><p className="mt-2 max-w-2xl text-sm xini-muted">User management, Film Lifecycle Engine, Creator Studio Lite, and Streaming Platform MVP, and Distribution Marketplace Lite are connected in one clean mocked MVP.</p></div>{["creator","admin"].includes(user.role) && <Link to="/projects/new"><Button><Plus size={17}/>Create project</Button></Link>}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7"><Stat icon={Film} label="Projects" value={projects.length}/><Stat icon={Clock} label="Active workflows" value={active}/><Stat icon={BrainCircuit} label="Studio docs" value={docs}/><Stat icon={ShieldCheck} label="Milestones done" value={completedMilestones}/><Stat icon={Wallet} label="Wallet" value={user.walletAddress ? "Connected" : "Not set"}/><Stat icon={Clapperboard} label="Streaming" value={media.length}/><Stat icon={Network} label="Distribution" value={distribution.projects.length}/></div><div className="grid gap-6 lg:grid-cols-[1fr_360px]"><Card><div className="flex items-center justify-between gap-3"><div><h2 className="xini-heading-md">Recent projects</h2><p className="mt-1 text-sm xini-muted">Latest lifecycle activity from your workspace.</p></div><Link to="/projects"><Button variant="secondary" size="sm">View all</Button></Link></div><div className="mt-5 space-y-3">{projects.slice(0,4).map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="block rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4 transition hover:border-xini-green/30"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium">{project.title}</p><p className="text-xs text-white/45">{project.lifecycleStage} · {project.status}</p></div><Badge tone={project.status === "Under Review" ? "warning" : "green"}>{project.status}</Badge></div></Link>)}{projects.length === 0 && <p className="py-10 text-center text-sm xini-muted">No projects yet.</p>}</div></Card><Card><h2 className="xini-heading-md">Profile readiness</h2><p className="mt-2 text-sm xini-muted">Complete profile, verification, and wallet status.</p><div className="mt-6"><div className="mb-2 flex justify-between text-sm"><span className="text-white/55">Completion</span><span>{user.profileCompletion}%</span></div><ProgressBar value={user.profileCompletion}/></div><div className="mt-5 space-y-3 text-sm"><Row label="Role" value={user.role}/><Row label="Verification" value={user.verificationStatus}/><Row label="Account" value={user.accountStatus}/></div><Link to="/account/profile"><Button className="mt-6 w-full" variant="outline">Open profile</Button></Link></Card></div></div>;
}
function Stat({ icon: Icon, label, value }) { return <Card><div className="flex items-center justify-between"><p className="text-sm text-white/55">{label}</p><div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Icon size={18}/></div></div><h3 className="mt-4 text-2xl font-semibold">{value}</h3></Card>; }
function Row({ label, value }) { return <div className="flex justify-between border-b border-white/[0.05] pb-2"><span className="text-white/45">{label}</span><span className="capitalize">{value}</span></div>; }
