import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileCheck2, Globe2, Handshake, Plus, RadioTower, Send, XCircle } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import ProgressBar from "../../../shared/components/ui/ProgressBar";
import Select from "../../../shared/components/ui/Select";
import Textarea from "../../../shared/components/ui/Textarea";
import { seedPartners } from "../../../shared/data/seedDistribution";
import { distributionService } from "../services/distributionService";

const stageOptions = [
  { value: "Reviewing", label: "Reviewing" },
  { value: "Partner Interested", label: "Partner Interested" },
  { value: "Meeting Scheduled", label: "Meeting Scheduled" },
  { value: "Negotiating", label: "Negotiating" },
  { value: "Deal Closed", label: "Deal Closed" },
];

const requestTypes = [
  { value: "Screening Access", label: "Screening Access" },
  { value: "Rights Confirmation", label: "Rights Confirmation" },
  { value: "Budget Sheet", label: "Budget Sheet" },
  { value: "Pitch Package", label: "Pitch Package" },
  { value: "Distribution Deck", label: "Distribution Deck" },
];

export default function DistributionProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [interestForm, setInterestForm] = useState({ partnerName: seedPartners[0].name, stage: "Partner Interested", note: "Partner requested distribution review access." });
  const [requestForm, setRequestForm] = useState({ partnerName: seedPartners[0].name, requestType: "Screening Access", priority: "Medium" });
  const [busy, setBusy] = useState(false);

  const loadProject = async () => {
    const data = await distributionService.getProject(id);
    setProject(data);
    setLoading(false);
  };

  useEffect(() => { loadProject(); }, [id]);

  const addInterest = async () => {
    if (!interestForm.partnerName.trim()) return;
    setBusy(true);
    const response = await distributionService.addPartnerInterest(project.id, interestForm);
    setProject(response.project);
    setMessage(response.message);
    setBusy(false);
  };

  const createRequest = async () => {
    if (!requestForm.partnerName.trim()) return;
    setBusy(true);
    const response = await distributionService.createRequest(project.id, requestForm);
    setProject(response.project);
    setMessage(response.message);
    setBusy(false);
  };

  const updateRequest = async (requestId, status) => {
    setBusy(true);
    const response = await distributionService.updateRequestStatus(project.id, requestId, status);
    setProject(response.project);
    setMessage(response.message);
    setBusy(false);
  };

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-xini-neon border-t-transparent" /></div>;
  }

  if (!project) {
    return <Card><p className="text-sm xini-muted">Distribution profile not found.</p><Link to="/distribution"><Button className="mt-4">Back to marketplace</Button></Link></Card>;
  }

  return (
    <div className="space-y-6">
      <Link to="/distribution" className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-xini-mint"><ArrowLeft size={16}/>Back to Distribution Marketplace</Link>

      {message && <div className="rounded-3xl border border-xini-green/20 bg-xini-green/10 p-4 text-sm text-xini-mint">{message}</div>}

      <section className="overflow-hidden rounded-[32px] border border-white/[0.06] bg-xini-card">
        <div className="relative h-[320px] overflow-hidden sm:h-[390px]">
          <img src={project.poster} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-xini-bg via-xini-bg/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-xini-bg/95 via-xini-bg/55 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex flex-wrap gap-2"><Badge tone="success">Distribution Profile</Badge><Badge>{project.genre}</Badge><Badge tone="green">{project.distributionStatus}</Badge></div>
            <h1 className="xini-heading-lg mt-5 max-w-3xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">{project.contentStatus}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="xini-heading-md">Distribution readiness</h2><p className="mt-1 text-sm xini-muted">Content status, package materials, rights availability, and current deal flow.</p></div>
              <div className="rounded-3xl bg-white/[0.04] px-4 py-3 text-sm text-xini-mint">{project.readinessScore}% ready</div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <Readiness label="Distribution score" value={project.readinessScore} />
              <Readiness label="Material package" value={project.materialProgress} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(project.materials || {}).map(([key, value]) => <Material key={key} label={key} ready={value} />)}
            </div>
          </Card>

          <Card>
            <h2 className="xini-heading-md">Rights summary</h2>
            <p className="mt-1 text-sm xini-muted">Lite rights view for distribution decisions and partner conversations.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {Object.entries(project.rightsSummary || {}).map(([key, value]) => <RightsRow key={key} label={key} value={value} />)}
            </div>
          </Card>

          <Card>
            <h2 className="xini-heading-md">Partner interest tracking</h2>
            <p className="mt-1 text-sm xini-muted">Track distributors, OTT partners, review stages, and deal notes.</p>
            <div className="mt-5 space-y-3">
              {(project.partnerInterest || []).map((interest) => (
                <div key={interest.id} className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-medium">{interest.partnerName}</p><p className="mt-1 text-xs text-white/42">Updated {formatDate(interest.updatedAt)}</p></div>
                    <Badge tone={interest.stage === "Negotiating" ? "green" : "warning"}>{interest.stage}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/50">{interest.note}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="xini-heading-md">Distribution requests</h2>
            <p className="mt-1 text-sm xini-muted">Manage requested materials, access, and partner follow-ups.</p>
            <div className="mt-5 space-y-3">
              {(project.requests || []).map((request) => (
                <div key={request.id} className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-medium">{request.requestType}</p><p className="mt-1 text-xs text-white/42">{request.partnerName} · {formatDate(request.createdAt)}</p></div>
                    <div className="flex flex-wrap gap-2"><Badge tone={request.priority === "High" ? "warning" : "default"}>{request.priority}</Badge><Badge tone={request.status === "Closed" ? "success" : "green"}>{request.status}</Badge></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => updateRequest(request.id, "Open")}>Open</Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => updateRequest(request.id, "Pending Creator")}>Pending Creator</Button>
                    <Button size="sm" disabled={busy} onClick={() => updateRequest(request.id, "Closed")}>Close</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Handshake size={18}/></div><div><h3 className="font-medium">Add partner interest</h3><p className="text-xs text-white/45">Mock future distributor signal.</p></div></div>
            <div className="mt-5 space-y-4">
              <Select label="Partner" value={interestForm.partnerName} onChange={(event) => setInterestForm((prev) => ({ ...prev, partnerName: event.target.value }))} options={seedPartners.map((partner) => ({ value: partner.name, label: partner.name }))} />
              <Select label="Stage" value={interestForm.stage} onChange={(event) => setInterestForm((prev) => ({ ...prev, stage: event.target.value }))} options={stageOptions} />
              <Textarea label="Note" value={interestForm.note} onChange={(event) => setInterestForm((prev) => ({ ...prev, note: event.target.value }))} />
              <Button className="w-full" disabled={busy} onClick={addInterest}><Plus size={17}/>Add interest</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Send size={18}/></div><div><h3 className="font-medium">Create request</h3><p className="text-xs text-white/45">Mock partner request workflow.</p></div></div>
            <div className="mt-5 space-y-4">
              <Input label="Partner name" value={requestForm.partnerName} onChange={(event) => setRequestForm((prev) => ({ ...prev, partnerName: event.target.value }))} />
              <Select label="Request type" value={requestForm.requestType} onChange={(event) => setRequestForm((prev) => ({ ...prev, requestType: event.target.value }))} options={requestTypes} />
              <Select label="Priority" value={requestForm.priority} onChange={(event) => setRequestForm((prev) => ({ ...prev, priority: event.target.value }))} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]} />
              <Button className="w-full" variant="outline" disabled={busy} onClick={createRequest}><Send size={17}/>Create request</Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium">Target markets</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.targetMarkets.map((market) => <span key={market} className="inline-flex items-center gap-2 rounded-full bg-white/[0.045] px-3 py-2 text-xs text-white/55"><RadioTower size={13}/>{market}</span>)}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Readiness({ label, value }) { return <div><div className="mb-2 flex justify-between text-sm"><span className="text-white/55">{label}</span><span>{value}%</span></div><ProgressBar value={value}/></div>; }
function Material({ label, ready }) { return <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3"><div className="mb-2 text-xini-mint">{ready ? <CheckCircle2 size={18}/> : <XCircle size={18} className="text-yellow-300"/>}</div><p className="text-xs capitalize text-white/55">{label.replace(/([A-Z])/g, " $1")}</p></div>; }
function RightsRow({ label, value }) { return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3"><span className="text-sm capitalize text-white/50">{label}</span><span className="text-right text-sm font-medium">{value}</span></div>; }
function formatDate(value) { if (!value) return "Just now"; return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(value)); }
