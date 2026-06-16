import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Edit3, Plus, Trash2, UploadCloud } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import Textarea from "../../../shared/components/ui/Textarea";
import AnalyticsStrip from "../components/AnalyticsStrip";
import { contentTypes } from "../../../shared/data/seedStreaming";
import { useAuth } from "../../auth/store/AuthContext";
import { streamingService } from "../services/streamingService";

const accessOptions = [
  { value: "public", label: "Public" },
  { value: "premium", label: "Premium" },
  { value: "investor_only", label: "Investor Only" },
  { value: "private", label: "Private" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "processing", label: "Processing" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const initialForm = {
  title: "",
  contentType: "trailer",
  access: "public",
  status: "draft",
  genre: "Drama",
  runtime: "3m",
  poster: "",
  videoUrl: "",
  synopsis: "",
  description: "",
};

export default function MediaManagement() {
  const { user, notify } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const typeOptions = useMemo(() => contentTypes, []);
  const canManage = ["creator", "admin"].includes(user.role);

  const load = async () => {
    const list = await streamingService.listContent({ user });
    setItems(list);
    setSelected((prev) => prev ? list.find((item) => item.id === prev.id) || list[0] : list[0]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const response = await streamingService.createMedia(user, form);
    setSaving(false);
    setForm(initialForm);
    setShowForm(false);
    notify(response.message);
    load();
  };

  const changeStatus = async (item, status) => {
    const response = await streamingService.updateMedia(item.id, { status });
    notify(response.message);
    load();
  };

  const remove = async (item) => {
    const response = await streamingService.deleteMedia(item.id);
    notify(response.message);
    load();
  };

  if (!canManage) {
    return (
      <Card className="text-center">
        <h1 className="xini-heading-md">Media management is creator-only</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm xini-muted">Use a creator or admin account to upload and manage streaming content.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="success">Creator Media Management</Badge>
          <h1 className="xini-heading-lg mt-4">Upload, organize and manage content</h1>
          <p className="mt-2 max-w-2xl text-sm xini-muted">Manage movies, short films, trailers, teasers, proof-of-concept content, statuses, access and analytics.</p>
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)}><Plus size={16} />{showForm ? "Close form" : "Upload content"}</Button>
      </div>

      {showForm && (
        <Card>
          <div className="flex items-center gap-3"><UploadCloud className="text-xini-mint" size={22} /><h2 className="text-xl font-medium">Upload content package</h2></div>
          <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Official trailer or short film title" />
            <Input label="Genre" value={form.genre} onChange={(e) => update("genre", e.target.value)} placeholder="Sci-Fi Drama" />
            <Select label="Content type" value={form.contentType} onChange={(e) => update("contentType", e.target.value)} options={typeOptions} />
            <Select label="Access" value={form.access} onChange={(e) => update("access", e.target.value)} options={accessOptions} />
            <Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)} options={statusOptions} />
            <Input label="Runtime" value={form.runtime} onChange={(e) => update("runtime", e.target.value)} placeholder="2m 30s" />
            <Input label="Poster URL" value={form.poster} onChange={(e) => update("poster", e.target.value)} placeholder="Optional image URL" />
            <Input label="Video URL" value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder="Optional MP4 URL" />
            <Textarea label="Synopsis" value={form.synopsis} onChange={(e) => update("synopsis", e.target.value)} className="md:col-span-2" />
            <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className="md:col-span-2" />
            <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Uploading..." : "Save content"}</Button></div>
          </form>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="xini-heading-md">Content library management</h2>
              <p className="mt-1 text-sm xini-muted">Organize content and update publishing status.</p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            {loading ? <div className="h-72 animate-pulse rounded-3xl bg-white/[0.045]" /> : (
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="text-white/45"><tr className="border-b border-white/[0.06]"><th className="py-3">Content</th><th>Type</th><th>Access</th><th>Status</th><th>Views</th><th className="text-right">Actions</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.045]">
                      <td className="py-4"><button onClick={() => setSelected(item)} className="flex items-center gap-3 text-left"><img src={item.thumbnail || item.poster} className="h-12 w-20 rounded-xl object-cover" /><span><span className="block font-medium">{item.title}</span><span className="text-xs text-white/42">{item.genre} · {item.runtime}</span></span></button></td>
                      <td>{item.typeLabel}</td>
                      <td><Badge tone={item.access === "public" ? "success" : "warning"}>{item.accessLabel}</Badge></td>
                      <td><Select value={item.status} onChange={(e) => changeStatus(item, e.target.value)} options={statusOptions} /></td>
                      <td>{item.analytics.views.toLocaleString()}</td>
                      <td className="text-right"><div className="flex justify-end gap-2"><Link to={`/streaming/content/${item.id}`}><Button variant="secondary" size="sm"><Edit3 size={14} />View</Button></Link><Button variant="danger" size="sm" onClick={() => remove(item)}><Trash2 size={14} /></Button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <aside className="space-y-6">
          <Card>
            <div className="flex items-center gap-3"><BarChart3 className="text-xini-mint" size={20} /><h2 className="text-xl font-medium">Selected analytics</h2></div>
            {selected ? (
              <div className="mt-5 space-y-4">
                <img src={selected.thumbnail || selected.poster} alt={selected.title} className="h-40 w-full rounded-3xl object-cover" />
                <div><p className="font-medium">{selected.title}</p><p className="text-sm text-white/45">{selected.typeLabel} · {selected.status}</p></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Mini label="Views" value={selected.analytics.views.toLocaleString()} />
                  <Mini label="Watch time" value={`${selected.analytics.watchTimeHours} hrs`} />
                  <Mini label="Engagement" value={`${selected.analytics.engagementRate}%`} />
                  <Mini label="Completion" value={`${selected.analytics.completionRate}%`} />
                </div>
              </div>
            ) : <p className="mt-5 text-sm xini-muted">Select content to preview analytics.</p>}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return <div className="rounded-2xl bg-white/[0.035] p-3"><p className="text-xs text-white/42">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}
