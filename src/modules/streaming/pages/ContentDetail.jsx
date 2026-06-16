import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bell, Lock, Play, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import ProgressBar from "../../../shared/components/ui/ProgressBar";
import AnalyticsStrip from "../components/AnalyticsStrip";
import AccessPrompt from "../components/AccessPrompt";
import ContentCard from "../components/ContentCard";
import { useAuth } from "../../auth/store/AuthContext";
import { streamingService } from "../services/streamingService";
import { formatCurrency } from "../../../shared/utils/formatters";

export default function ContentDetail() {
  const { id } = useParams();
  const { user, notify } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const reload = async () => {
    const [content, relatedContent] = await Promise.all([
      streamingService.getContent(id, user),
      streamingService.getRelated(id, user),
    ]);
    setItem(content);
    setRelated(relatedContent);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    reload();
  }, [id, user]);

  const requireLogin = () => {
    notify("Please login or create an account to use follow and notification features.", "warning");
    navigate("/login");
  };

  const follow = async (type, targetId) => {
    if (!user) return requireLogin();
    const response = await streamingService.toggleFollow(user, type, targetId);
    notify(response.message);
    reload();
  };

  const toggleNotify = async (type) => {
    if (!user) return requireLogin();
    const response = await streamingService.toggleNotification(user, item.id, type);
    notify(response.message);
    reload();
  };

  const subscribeAndWatch = async () => {
    if (!user) {
      notify("Login or create an account to subscribe and watch premium content.", "warning");
      navigate("/login");
      return;
    }

    try {
      setSubscribing(true);
      const response = await streamingService.subscribe(user, "premium");
      notify(response.message);
      await reload();
      navigate(`/watch/${item.id}`);
    } finally {
      setSubscribing(false);
    }
  };

  const payAndWatch = async () => {
    if (!user) {
      notify("Login or create an account to pay to watch this title.", "warning");
      navigate("/login");
      return;
    }

    try {
      setPurchasing(true);
      const response = await streamingService.purchaseContent(user, item.id);
      notify(response.message);
      await reload();
      navigate(`/watch/${item.id}`);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-3xl bg-white/[0.045]" />;
  if (!item) return <div className="rounded-3xl bg-white/[0.035] p-10 text-center">Content not found.</div>;

  const fundingProgress = item.funding.goal ? (item.funding.raised / item.funding.goal) * 100 : 0;
  const isLocked = !item.canPlay;

  return (
    <div className="space-y-6 pt-20 sm:pt-24">
      <section className="relative overflow-hidden rounded-[34px] border border-white/[0.06] bg-xini-card">
        <div className="absolute inset-0">
          <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-xini-bg via-xini-bg/86 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-xini-bg via-transparent to-transparent" />
        </div>

        <div className="relative grid min-h-[440px] items-end p-5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">{item.typeLabel}</Badge>
              <Badge tone={item.access === "public" ? "green" : "warning"}>{item.accessLabel}</Badge>
              <Badge tone="default">{item.runtime}</Badge>
            </div>

            <h1 className="xini-heading-xl mt-5">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 xini-muted sm:text-base">{item.synopsis}</p>

            {isLocked && (
              <div className="mt-5 max-w-2xl">
                <AccessPrompt
                  item={item}
                  user={user}
                  subscribing={subscribing}
                  purchasing={purchasing}
                  onSubscribe={subscribeAndWatch}
                  onPurchase={payAndWatch}
                />
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {isLocked ? (
                <Button onClick={subscribeAndWatch} disabled={subscribing || purchasing}>
                  <Lock size={17} />
                  {subscribing ? "Activating..." : purchasing ? "Processing..." : user ? "Subscribe or Pay" : "Login to Watch"}
                </Button>
              ) : (
                <Link to={`/watch/${item.id}`}>
                  <Button><Play size={17} fill="currentColor" />Watch</Button>
                </Link>
              )}

              <Button variant="outline" onClick={() => follow("creator", item.creatorId)}><UserPlus size={16} />{item.isCreatorFollowed ? "Creator Followed" : "Follow Creator"}</Button>
              <Button variant="outline" onClick={() => follow("project", item.projectId)}><UserPlus size={16} />{item.isProjectFollowed ? "Project Followed" : "Follow Project"}</Button>
              <Button variant="secondary" onClick={() => toggleNotify("release")}><Bell size={16} />{item.isReleaseNotificationOn ? "Release On" : "Notify Release"}</Button>
              <Button variant="secondary" onClick={() => toggleNotify("premiere")}><Bell size={16} />{item.isPremiereNotificationOn ? "Premiere On" : "Notify Premiere"}</Button>
            </div>
          </div>
        </div>
      </section>

      <AnalyticsStrip analytics={item.analytics} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <Card>
            <h2 className="xini-heading-md">Synopsis</h2>
            <p className="mt-4 text-sm leading-8 xini-muted">{item.description}</p>
          </Card>

          <Card>
            <h2 className="xini-heading-md">Creator information</h2>
            <div className="mt-5 flex flex-wrap items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-xini-green text-sm font-medium text-white">
                {item.creatorName.split(" ").map((word) => word[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words font-medium">{item.creatorName}</p>
                <p className="text-sm text-xini-mint">{item.creatorRole}</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 xini-muted">This creator profile is connected to XINI8 follow, notification, and project discovery flows for the mocked MVP.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="xini-heading-md">Team information</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {item.team.map((member) => (
                <div key={`${member.name}-${member.role}`} className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                  <p className="break-words font-medium">{member.name}</p>
                  <p className="text-sm text-white/45">{member.role}</p>
                </div>
              ))}
            </div>
          </Card>
        </main>

        <aside className="space-y-6">
          <Card>
            <h2 className="xini-heading-md">Funding information</h2>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm"><span className="text-white/55">Progress</span><span>{Math.round(fundingProgress)}%</span></div>
              <ProgressBar value={fundingProgress} />
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <Row label="Raised" value={formatCurrency(item.funding.raised)} />
              <Row label="Goal" value={formatCurrency(item.funding.goal)} />
              <Row label="Investors" value={item.funding.investors.toLocaleString()} />
              <Row label="Status" value={item.funding.status} />
            </div>
            {item.projectId && <Link to={`/projects/${item.projectId}`}><Button className="mt-6 w-full" variant="outline">Open linked project</Button></Link>}
          </Card>

          <Card>
            <h2 className="xini-heading-md">Related content</h2>
            <div className="mt-5 space-y-4">
              {related.slice(0, 3).map((relatedItem) => <ContentCard key={relatedItem.id} item={relatedItem} />)}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex justify-between gap-4 border-b border-white/[0.05] pb-2"><span className="text-white/45">{label}</span><span className="text-right">{value}</span></div>;
}
