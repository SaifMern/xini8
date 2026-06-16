import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, FileCheck2, Globe2, Handshake, Search, Send, TrendingUp } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import DistributionProjectCard from "../components/DistributionProjectCard";
import PartnerCard from "../components/PartnerCard";
import { distributionStatuses } from "../../../shared/data/seedDistribution";
import { distributionService } from "../services/distributionService";

const partnerTypes = [
  { value: "all", label: "All partners" },
  { value: "OTT Partner", label: "OTT Partners" },
  { value: "Streaming Partner", label: "Streaming Partners" },
  { value: "Distributor", label: "Distributors" },
];

export default function DistributionMarketplace() {
  const [overview, setOverview] = useState({ projects: [], partners: [], requests: [], interests: [] });
  const [projectQuery, setProjectQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [partnerType, setPartnerType] = useState("all");
  const [partnerQuery, setPartnerQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    distributionService.getOverview().then((data) => {
      setOverview(data);
      setLoading(false);
    });
  }, []);

  const projects = useMemo(() => {
    const normalized = projectQuery.trim().toLowerCase();
    return overview.projects.filter((project) => {
      const matchesStatus = status === "all" || project.distributionStatus === status;
      const matchesQuery = !normalized || `${project.title} ${project.genre} ${project.creatorName} ${project.targetMarkets.join(" ")}`.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [overview.projects, projectQuery, status]);

  const partners = useMemo(() => {
    const normalized = partnerQuery.trim().toLowerCase();
    return overview.partners.filter((partner) => {
      const matchesType = partnerType === "all" || partner.type === partnerType;
      const matchesQuery = !normalized || `${partner.name} ${partner.type} ${partner.region} ${partner.focus}`.toLowerCase().includes(normalized);
      return matchesType && matchesQuery;
    });
  }, [overview.partners, partnerType, partnerQuery]);

  const avgReadiness = Math.round(overview.projects.reduce((total, project) => total + project.readinessScore, 0) / Math.max(overview.projects.length, 1));

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-xini-neon border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-xini-card p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-xini-green/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <Badge tone="success">Module 5 · Distribution Marketplace Lite</Badge>
            <h1 className="xini-heading-lg mt-5">Distribution opportunities and partner interest tracking.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 xini-muted">Show future content distribution capabilities with available projects, OTT partners, streaming partners, distributors, rights summaries, readiness scoring, and partner requests.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#available-projects"><Button><Globe2 size={17} />View projects</Button></a>
              <a href="#partner-directory"><Button variant="secondary"><Building2 size={17} />Partner directory</Button></a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MiniStat icon={FileCheck2} label="Avg readiness" value={`${avgReadiness}%`} />
            <MiniStat icon={Handshake} label="Partner interests" value={overview.interests.length} />
            <MiniStat icon={Send} label="Open requests" value={overview.requests.filter((request) => request.status !== "Closed").length} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Globe2} label="Available projects" value={overview.projects.length} />
        <Stat icon={Building2} label="Partners" value={overview.partners.length} />
        <Stat icon={TrendingUp} label="Negotiations" value={overview.interests.filter((item) => item.stage === "Negotiating").length} />
        <Stat icon={FileCheck2} label="Requests" value={overview.requests.length} />
      </div>

      <section id="available-projects" className="space-y-5 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="xini-heading-md">Available projects</h2>
            <p className="mt-1 text-sm xini-muted">Distribution-ready projects with rights summaries and partner activity.</p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[260px_220px]">
            <Input value={projectQuery} onChange={(event) => setProjectQuery(event.target.value)} placeholder="Search projects" />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: "all", label: "All statuses" }, ...distributionStatuses.map((item) => ({ value: item, label: item }))]} />
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => <DistributionProjectCard key={project.id} project={project} />)}
        </div>
      </section>

      <section id="partner-directory" className="space-y-5 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="xini-heading-md">Partner directory</h2>
            <p className="mt-1 text-sm xini-muted">OTT partner directory, streaming partner directory, and distributor directory in one marketplace.</p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[260px_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
              <Input value={partnerQuery} onChange={(event) => setPartnerQuery(event.target.value)} placeholder="Search partners" inputClassName="pl-10" />
            </div>
            <Select value={partnerType} onChange={(event) => setPartnerType(event.target.value)} options={partnerTypes} />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="xini-heading-md">Distribution requests</h2>
          <p className="mt-1 text-sm xini-muted">Partner requests that creators or admins need to handle.</p>
          <div className="mt-5 space-y-3">
            {overview.requests.map((request) => (
              <Link key={request.id} to={`/distribution/projects/${request.projectId}`} className="block rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4 transition hover:border-xini-green/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{request.requestType}</p>
                    <p className="mt-1 text-xs text-white/45">{request.projectTitle} · {request.partnerName}</p>
                  </div>
                  <Badge tone={request.priority === "High" ? "warning" : "default"}>{request.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="xini-heading-md">Partner interest tracking</h2>
          <p className="mt-1 text-sm xini-muted">Live-style deal flow from interested distributors and streaming partners.</p>
          <div className="mt-5 space-y-3">
            {overview.interests.map((interest) => (
              <Link key={interest.id} to={`/distribution/projects/${interest.projectId}`} className="block rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4 transition hover:border-xini-green/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{interest.partnerName}</p>
                    <p className="mt-1 text-xs text-white/45">{interest.projectTitle}</p>
                  </div>
                  <Badge tone={interest.stage === "Negotiating" ? "green" : "warning"}>{interest.stage}</Badge>
                </div>
                <p className="mt-3 text-sm text-white/50">{interest.note}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return <Card><div className="flex items-center justify-between"><p className="text-sm text-white/55">{label}</p><div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Icon size={18}/></div></div><h3 className="mt-4 text-2xl font-semibold">{value}</h3></Card>;
}
function MiniStat({ icon: Icon, label, value }) {
  return <div className="rounded-3xl border border-white/[0.06] bg-white/[0.04] p-4"><div className="flex items-center justify-between"><p className="text-xs text-white/45">{label}</p><Icon className="text-xini-mint" size={17}/></div><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
