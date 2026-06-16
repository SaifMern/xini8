import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Film, Lock, Play, Search, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import ContentRow from "../components/ContentRow";
import { useAuth } from "../../auth/store/AuthContext";
import { streamingService } from "../services/streamingService";

export default function StreamingHome() {
  const { user, notify } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const load = async () => {
    const next = await streamingService.getStreamingHome(user);
    setData(next);
  };

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [user]);

  const requireLogin = () => {
    notify("Please login or create an account to use follow and notification features.", "warning");
    navigate("/login");
  };

  const toggleFollow = async (type, targetId) => {
    if (!user) return requireLogin();
    const response = await streamingService.toggleFollow(user, type, targetId);
    notify(response.message);
    await load();
  };

  const toggleNotify = async (mediaId, type) => {
    if (!user) return requireLogin();
    const response = await streamingService.toggleNotification(user, mediaId, type);
    notify(response.message);
    await load();
  };

  const subscribe = async () => {
    if (!user) {
      notify("Login or create a free account to activate premium access.", "warning");
      navigate("/login");
      return;
    }

    try {
      setSubscribing(true);
      const response = await streamingService.subscribe(user, "premium");
      notify(response.message);
      await load();
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pt-20 sm:pt-24">
        <div className="h-[520px] animate-pulse rounded-[34px] bg-white/[0.045]" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/[0.045]" />)}
        </div>
      </div>
    );
  }

  const featured = data?.featured;

  return (
    <div className="space-y-10 pt-20 sm:pt-24">
      {featured && (
        <section className="relative overflow-hidden rounded-[34px] border border-white/[0.06] bg-xini-card xini-soft-shadow">
          <div className="absolute inset-0">
            <img src={featured.poster} alt={featured.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/42" />
            <div className="absolute inset-0 bg-gradient-to-r from-xini-bg via-xini-bg/82 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-xini-bg via-transparent to-transparent" />
          </div>

          <div className="relative grid min-h-[540px] items-end p-5 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">XINI8 Streaming</Badge>
                <Badge tone="default">{featured.typeLabel}</Badge>
                <Badge tone={featured.access === "public" ? "green" : "warning"}>{featured.accessLabel}</Badge>
              </div>

              <h1 className="xini-heading-xl mt-5 max-w-3xl">{featured.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 xini-muted sm:text-base">{featured.synopsis}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {featured.canPlay ? (
                  <Link to={`/watch/${featured.id}`}>
                    <Button><Play size={17} fill="currentColor" />Watch now</Button>
                  </Link>
                ) : (
                  <Button onClick={subscribe} disabled={subscribing}>
                    <Lock size={17} />{subscribing ? "Activating..." : "Subscribe & Watch"}
                  </Button>
                )}
                <Link to={`/streaming/content/${featured.id}`}><Button variant="secondary">Details</Button></Link>
                <Button variant="outline" onClick={() => toggleFollow("project", featured.projectId)}>
                  <UserPlus size={16} />{featured.isProjectFollowed ? "Following" : "Follow Project"}
                </Button>
                <Button variant="outline" onClick={() => toggleNotify(featured.id, "release")}>
                  <Bell size={16} />{featured.isReleaseNotificationOn ? "Release On" : "Notify Release"}
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/50">
                <span className="rounded-full bg-white/[0.06] px-3 py-1">Free content works without login</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-1">Paid content unlocks through mocked subscription</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-1">Watch history saves automatically</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <QuickCard title="Watch Free" text="Browse trailers and free content without signing in." to="/streaming/library" icon={Play} />
        <QuickCard title="Premium Access" text="Unlock paid movies and investor media with a mocked subscription." to="/streaming/library" icon={Lock} />
        <QuickCard title="Library" text="Movies, short films, trailers, teasers and proof-of-concept content." to="/streaming/library" icon={Search} />
        {user && ["creator", "admin"].includes(user.role) ? (
          <QuickCard title="Creator Media" text="Upload, organize and manage streaming content." to="/media/manage" icon={Film} />
        ) : (
          <button onClick={subscribe} disabled={subscribing} className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 text-left transition hover:border-xini-green/30 hover:bg-white/[0.055]">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Lock size={19} /></div>
            <h3 className="mt-4 font-medium">{data?.subscription ? "Premium Active" : "Start Premium"}</h3>
            <p className="mt-1 text-sm leading-6 text-white/45">{data?.subscription ? "Paid content is unlocked in this session." : subscribing ? "Activating access..." : "Login required. Mock checkout only, no real payment charged."}</p>
          </button>
        )}
      </div>

      <div className="space-y-11">
        {data?.rows?.map((row) => (
          <ContentRow
            key={row.key}
            title={row.title}
            items={row.items}
            subtitle={row.key === "free" ? "No login required. Start playback instantly." : row.key === "premium" ? "Premium and investor media with clean subscribe or pay-to-watch gating." : undefined}
          />
        ))}
      </div>

      <section className="space-y-4 pb-8">
        <div>
          <h2 className="text-xl font-medium sm:text-2xl">Creator Spotlight</h2>
          <p className="mt-1 text-sm xini-muted">Follow creators and stay updated on releases, project updates and premieres.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data?.creators?.map((creator) => (
            <Card key={creator.id} className="h-full">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-xini-green text-sm font-medium text-white">{creator.avatar}</div>
                <div className="min-w-0">
                  <h3 className="xini-safe-text font-medium">{creator.name}</h3>
                  <p className="text-xs text-xini-mint">{creator.role}</p>
                  <p className="mt-2 text-xs leading-6 text-white/45">{creator.bio}</p>
                  <p className="mt-3 text-xs text-white/45">{creator.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <Button className="mt-5 w-full" variant="secondary" size="sm" onClick={() => toggleFollow("creator", creator.id)}>
                <UserPlus size={15} /> Follow creator
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickCard({ title, text, to, icon: Icon }) {
  return (
    <Link to={to} className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 transition hover:border-xini-green/30 hover:bg-white/[0.055]">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Icon size={19} /></div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-white/45">{text}</p>
    </Link>
  );
}
