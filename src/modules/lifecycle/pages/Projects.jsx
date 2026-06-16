import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import Badge from "../../../shared/components/ui/Badge";
import Input from "../../../shared/components/ui/Input";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../../auth/store/AuthContext";
import { projectService } from "../services/projectService";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { projectService.listProjects({ user }).then(setProjects).finally(() => setLoading(false)); }, [user]);
  const filtered = useMemo(() => projects.filter((p) => `${p.title} ${p.genre} ${p.status}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><Badge tone="success">Film Lifecycle Engine</Badge><h1 className="xini-heading-lg mt-4">Projects</h1><p className="mt-2 max-w-2xl text-sm xini-muted">Create, review, track, and manage projects across the complete workflow.</p></div>{["creator","admin"].includes(user.role) && <Link to="/projects/new"><Button><Plus size={17}/>Create project</Button></Link>}</div><div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4"><div className="flex items-center gap-3"><Search size={18} className="text-white/40"/><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search projects by title, genre, or status..." className="flex-1" inputClassName="border-0 bg-transparent px-0 focus:bg-transparent" /></div></div>{loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-64 animate-pulse rounded-3xl bg-white/[0.045]" />)}</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project)=><ProjectCard key={project.id} project={project}/>)}</div>}{!loading && filtered.length === 0 && <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-12 text-center"><p className="text-sm xini-muted">No projects found.</p></div>}</div>;
}
