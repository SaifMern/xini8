import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BrainCircuit,
  FileText,
  FolderKanban,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import Textarea from "../../../shared/components/ui/Textarea";
import { useAuth } from "../../auth/store/AuthContext";
import { projectService } from "../../lifecycle/services/projectService";
import { studioService } from "../services/studioService";
import StudioReadiness from "../components/StudioReadiness";
import { formatDate } from "../../../shared/utils/formatters";

const documentTypes = [
  { value: "pitch_deck", label: "Pitch Deck" },
  { value: "script", label: "Script" },
  { value: "budget", label: "Budget" },
  { value: "investor_documents", label: "Investor Documents" },
];

export default function CreatorStudio() {
  const { user, notify } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("project") || "");
  const [project, setProject] = useState(null);
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const list = await projectService.listProjects({ user });
      setProjects(list);
      const defaultProject = searchParams.get("project") || list[0]?.id || "";
      setSelectedProjectId(defaultProject);
    }

    loadProjects();
  }, [user]);

  useEffect(() => {
    if (!selectedProjectId) {
      setLoading(false);
      return;
    }

    async function loadPackage() {
      setLoading(true);
      const data = await studioService.getProjectPackage(selectedProjectId);
      setProject(data?.project || null);
      setStudio(data?.studio || null);
      setLoading(false);
      setSearchParams({ project: selectedProjectId });
    }

    loadPackage();
  }, [selectedProjectId]);

  const projectOptions = useMemo(
    () => projects.map((item) => ({ value: item.id, label: item.title })),
    [projects]
  );

  const refreshPackage = (response) => {
    setProject(response.project);
    setStudio(response.studio);
    notify(response.message);
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white/[0.045]" />;
  }

  if (!projects.length) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card className="text-center">
          <FolderKanban className="mx-auto text-xini-mint" size={34} />
          <h2 className="xini-heading-md mt-4">No project found</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm xini-muted">
            Create a film project first, then use Creator Studio Lite to build
            the brief, synopsis, pitch, and documents package.
          </p>
          <Link to="/projects/new">
            <Button className="mt-6">Create project</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <Select
              label="Select project package"
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              options={projectOptions}
            />
            <p className="mt-3 text-xs leading-6 text-white/42">
              Creator Studio works on top of the Film Lifecycle Engine. All
              changes update the selected project package and remain saved in
              localStorage for the mocked MVP.
            </p>
          </div>
          <StudioReadiness studio={studio} />
        </div>
      </Card>

      {project && studio && (
        <div className="grid gap-6 xl:grid-cols-[1fr_370px]">
          <main className="space-y-6">
            <BriefBuilder project={project} studio={studio} onChange={refreshPackage} />
            <SynopsisBuilder project={project} studio={studio} onChange={refreshPackage} />
            <DescriptionBuilder project={project} studio={studio} onChange={refreshPackage} />
            <AIAssistance project={project} studio={studio} onChange={refreshPackage} />
          </main>

          <aside className="space-y-6">
            <PackageSummary project={project} studio={studio} />
            <DocumentationPanel project={project} studio={studio} onChange={refreshPackage} />
          </aside>
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Badge tone="success">Module 3 · Creator Studio Lite</Badge>
        <h1 className="xini-heading-lg mt-4">Creator Studio</h1>
        <p className="mt-2 max-w-2xl text-sm xini-muted">
          Build investor-ready project material with brief creation, synopsis,
          project description, AI-style pitch generation, and documents.
        </p>
      </div>
      <Link to="/projects/new">
        <Button variant="secondary">Create new project</Button>
      </Link>
    </div>
  );
}

function BriefBuilder({ project, studio, onChange }) {
  const [form, setForm] = useState(studio.brief);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(studio.brief), [studio.brief]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const response = await studioService.saveBrief(project.id, form);
    setSaving(false);
    onChange(response);
  };

  return (
    <Card>
      <SectionTitle
        title="Project brief creation"
        description="Define the core positioning of the film package before moving into pitch and documents."
      />
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
        <Input
          label="Logline"
          value={form.logline || ""}
          onChange={(event) => update("logline", event.target.value)}
          placeholder="One clear sentence about the project"
        />
        <Input
          label="Tone"
          value={form.tone || ""}
          onChange={(event) => update("tone", event.target.value)}
          placeholder="Premium cinematic, grounded, atmospheric"
        />
        <Input
          label="Target audience"
          value={form.audience || ""}
          onChange={(event) => update("audience", event.target.value)}
          placeholder="18–45 global streaming audience"
        />
        <Input
          label="Positioning"
          value={form.positioning || ""}
          onChange={(event) => update("positioning", event.target.value)}
          placeholder="Investor-ready independent feature"
        />
        <Textarea
          label="Creative hook"
          className="md:col-span-2"
          value={form.creativeHook || ""}
          onChange={(event) => update("creativeHook", event.target.value)}
          placeholder="What makes this project immediately compelling?"
        />
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save brief"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SynopsisBuilder({ project, studio, onChange }) {
  const [value, setValue] = useState(studio.synopsisDraft || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => setValue(studio.synopsisDraft || ""), [studio.synopsisDraft]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const response = await studioService.saveSynopsis(project.id, value);
    setSaving(false);
    onChange(response);
  };

  return (
    <Card>
      <SectionTitle
        title="Synopsis builder"
        description="Write a clean synopsis that explains the story, emotional promise, and marketplace angle."
      />
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Textarea
          label="Project synopsis"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write a clear project synopsis..."
          rows={7}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save synopsis"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function DescriptionBuilder({ project, studio, onChange }) {
  const [value, setValue] = useState(studio.projectDescription || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => setValue(studio.projectDescription || ""), [studio.projectDescription]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const response = await studioService.saveDescription(project.id, value);
    setSaving(false);
    onChange(response);
  };

  return (
    <Card>
      <SectionTitle
        title="Project description builder"
        description="Shape a longer investor-facing description for project detail, marketplace, and review pages."
      />
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Textarea
          label="Project description"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write the full project description..."
          rows={8}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save description"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function AIAssistance({ project, studio, onChange }) {
  const [working, setWorking] = useState("");

  const generateDescription = async () => {
    setWorking("description");
    const response = await studioService.generateProjectDescription(project.id);
    setWorking("");
    onChange(response);
  };

  const generatePitch = async () => {
    setWorking("pitch");
    const response = await studioService.generatePitchSummary(project.id);
    setWorking("");
    onChange(response);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title="AI assistance"
          description="Mocked AI helpers create polished content from the project brief and lifecycle data."
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={generateDescription} disabled={Boolean(working)}>
            <BrainCircuit size={16} />
            {working === "description" ? "Generating..." : "Generate description"}
          </Button>
          <Button onClick={generatePitch} disabled={Boolean(working)}>
            <RefreshCw size={16} />
            {working === "pitch" ? "Generating..." : "Generate pitch"}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <PreviewBox title="AI project description" value={studio.projectDescription} />
        <PreviewBox title="AI pitch summary" value={studio.pitchSummary} />
      </div>
    </Card>
  );
}

function DocumentationPanel({ project, studio, onChange }) {
  const [uploading, setUploading] = useState("");

  const upload = async (documentType, file) => {
    if (!file) return;
    setUploading(documentType);
    const response = await studioService.uploadDocument(project.id, documentType, file);
    setUploading("");
    onChange(response);
  };

  const remove = async (documentId) => {
    const response = await studioService.removeDocument(project.id, documentId);
    onChange(response);
  };

  return (
    <Card>
      <SectionTitle
        title="Documentation"
        description="Upload mocked document metadata for the investor package."
      />

      <div className="mt-5 space-y-3">
        {documentTypes.map((doc) => {
          const uploaded = (studio.documents || []).find((item) => item.documentType === doc.value);

          return (
            <div key={doc.value} className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{doc.label}</p>
                  <p className="mt-1 text-xs text-white/42">
                    {uploaded ? `${uploaded.fileName} · ${uploaded.fileSize}` : "No file uploaded"}
                  </p>
                </div>
                {uploaded ? <Badge tone="success">Uploaded</Badge> : <Badge>Missing</Badge>}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 text-xs font-medium text-white/70 transition hover:border-xini-green/35 hover:text-white">
                  <UploadCloud size={15} />
                  {uploading === doc.value ? "Uploading..." : uploaded ? "Replace" : "Upload"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={(event) => upload(doc.value, event.target.files?.[0])}
                  />
                </label>
                {uploaded && (
                  <Button variant="danger" size="sm" onClick={() => remove(uploaded.id)}>
                    <Trash2 size={14} />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PackageSummary({ project, studio }) {
  const docs = studio.documents || [];

  return (
    <Card>
      <Badge tone="green">Project package</Badge>
      <h2 className="xini-heading-md mt-4">{project.title}</h2>
      <p className="mt-2 text-sm leading-7 xini-muted">{studio.brief?.logline || project.synopsis}</p>

      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="Genre" value={project.genre} />
        <SummaryRow label="Lifecycle" value={project.lifecycleStage} />
        <SummaryRow label="Status" value={project.status} />
        <SummaryRow label="Documents" value={`${docs.length}/4 uploaded`} />
        <SummaryRow label="Last AI update" value={studio.lastGeneratedAt ? formatDate(studio.lastGeneratedAt) : "Not generated"} />
      </div>

      <Link to={`/projects/${project.id}`}>
        <Button className="mt-6 w-full" variant="outline">
          Open project dashboard
        </Button>
      </Link>
    </Card>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="xini-heading-md">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 xini-muted">{description}</p>
    </div>
  );
}

function PreviewBox({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText size={16} className="text-xini-mint" />
        {title}
      </div>
      <p className="mt-3 min-h-24 text-sm leading-7 text-white/55">
        {value || "Generate content to preview it here."}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/[0.05] pb-2">
      <span className="text-white/42">{label}</span>
      <span className="text-right capitalize">{value}</span>
    </div>
  );
}
