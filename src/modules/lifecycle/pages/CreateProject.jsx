import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Save } from "lucide-react";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";
import Badge from "../../../shared/components/ui/Badge";
import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import Textarea from "../../../shared/components/ui/Textarea";
import { lifecycleStages } from "../../../shared/data/seedProjects";
import { useAuth } from "../../auth/store/AuthContext";
import { projectService } from "../services/projectService";

const genres = ["", "Sci-Fi Drama", "Crime Thriller", "Documentary", "Mystery", "Drama", "Action"].map(v=>({value:v,label:v||"Select genre"}));
const languages = ["", "English", "English / Urdu", "Urdu", "Arabic", "Spanish", "French"].map(v=>({value:v,label:v||"Select language"}));
export default function CreateProject() {
  const { user, notify } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", genre:"", language:"", runtime:"", synopsis:"", description:"", targetAudience:"", budget:"", fundingGoal:"", lifecycleStage:"Idea" });
  const [errors,setErrors]=useState({}); const [loading,setLoading]=useState(false);
  const update=(f,v)=>{setForm(p=>({...p,[f]:v})); setErrors(p=>({...p,[f]:""}));};
  const validate=()=>{const e={}; ["title","genre","language","synopsis","budget","fundingGoal"].forEach(k=>{if(!String(form[k]).trim()) e[k]="Required."}); setErrors(e); return Object.keys(e).length===0;};
  const submit=async(e)=>{e.preventDefault(); if(!validate()) return; setLoading(true); const res=await projectService.createProject(user, form); notify(res.message); setLoading(false); navigate(`/projects/${res.project.id}`);};
  return <div className="space-y-6"><div><Badge tone="success">Create Project</Badge><h1 className="xini-heading-lg mt-4">New film project</h1><p className="mt-2 max-w-2xl text-sm xini-muted">Create a structured draft for the lifecycle engine. It can later move through review, funding, production and release.</p></div><Card><form onSubmit={submit} className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><Input label="Project title" value={form.title} onChange={(e)=>update("title",e.target.value)} error={errors.title} placeholder="The Last Horizon"/><Select label="Genre" value={form.genre} onChange={(e)=>update("genre",e.target.value)} options={genres} error={errors.genre}/><Select label="Language" value={form.language} onChange={(e)=>update("language",e.target.value)} options={languages} error={errors.language}/><Input label="Runtime" type="number" value={form.runtime} onChange={(e)=>update("runtime",e.target.value)} placeholder="108"/><Input label="Budget" type="number" value={form.budget} onChange={(e)=>update("budget",e.target.value)} error={errors.budget} placeholder="500000"/><Input label="Funding goal" type="number" value={form.fundingGoal} onChange={(e)=>update("fundingGoal",e.target.value)} error={errors.fundingGoal} placeholder="250000"/><Input label="Target audience" value={form.targetAudience} onChange={(e)=>update("targetAudience",e.target.value)} placeholder="18–45 global audience"/><Select label="Lifecycle stage" value={form.lifecycleStage} onChange={(e)=>update("lifecycleStage",e.target.value)} options={lifecycleStages}/></div><Textarea label="Synopsis" value={form.synopsis} onChange={(e)=>update("synopsis",e.target.value)} error={errors.synopsis} placeholder="Short project synopsis..."/><Textarea label="Description" value={form.description} onChange={(e)=>update("description",e.target.value)} placeholder="Full project description..."/><div className="flex justify-end"><Button type="submit" disabled={loading}><Save size={17}/>{loading?"Creating...":"Create draft"}</Button></div></form></Card></div>;
}
