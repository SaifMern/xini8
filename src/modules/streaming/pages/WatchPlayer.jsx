import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Maximize, Play } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import AnalyticsStrip from "../components/AnalyticsStrip";
import AccessPrompt from "../components/AccessPrompt";
import ContentCard from "../components/ContentCard";
import PlayerControls from "../components/PlayerControls";
import { useAuth } from "../../auth/store/AuthContext";
import { streamingService } from "../services/streamingService";

function isYouTubeUrl(url = "", provider = "") {
  return provider === "youtube" || url.includes("youtube.com/embed") || url.includes("youtu.be") || url.includes("youtube-nocookie.com");
}

export default function WatchPlayer() {
  const { id } = useParams();
  const { user, notify } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const reload = async () => {
    const [content, relatedContent] = await Promise.all([
      streamingService.getContent(id, user),
      streamingService.getRelated(id, user),
    ]);
    setItem(content);
    setRelated(relatedContent);
    setProgress(content?.watchProgress || 0);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    reload();
    setIsPlaying(false);
  }, [id, user]);

  useEffect(() => {
    if (!item?.canPlay) return;

    const youtube = isYouTubeUrl(item.videoUrl, item.videoProvider);
    if (!youtube) return;

    const timer = window.setTimeout(() => {
      const nextProgress = Math.max(progress || 0, 18);
      setProgress(nextProgress);
      streamingService.trackView(user, item.id, {
        progress: nextProgress,
        watchTime: 180,
        completed: false,
      });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [item?.id, item?.canPlay, item?.videoUrl, item?.videoProvider, user]);

  useEffect(() => {
    return () => {
      if (item?.canPlay) {
        streamingService.trackView(user, item.id, {
          progress,
          watchTime: 120,
          completed: progress > 92,
        });
      }
    };
  }, [item, progress, user]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || !item?.canPlay) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        notify("Tap play again if browser blocked autoplay.", "warning");
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const nextProgress = (video.currentTime / video.duration) * 100;
    setProgress(nextProgress);
    setCurrentTime(formatTime(video.currentTime));
    setDuration(formatTime(video.duration));
  };

  const onLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(formatTime(video.duration));
    if (item?.watchProgress && video.duration) {
      video.currentTime = (item.watchProgress / 100) * video.duration;
    }
  };

  const onSeek = (value) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  };

  const onSkip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const onMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const onFullscreen = () => {
    const wrapper = playerWrapperRef.current;
    if (wrapper?.requestFullscreen) wrapper.requestFullscreen();
  };

  const subscribeAndPlay = async () => {
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
    } finally {
      setSubscribing(false);
    }
  };

  const payAndPlay = async () => {
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
    } finally {
      setPurchasing(false);
    }
  };

  const saveProgress = async () => {
    const response = await streamingService.trackView(user, item.id, {
      progress: Math.max(progress, 22),
      watchTime: 180,
      completed: progress > 92,
    });
    notify(response.message);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-3xl bg-white/[0.045]" />;
  if (!item) return <div className="rounded-3xl bg-white/[0.035] p-10 text-center">Video not found.</div>;

  const youtubePlayback = item.canPlay && isYouTubeUrl(item.videoUrl, item.videoProvider);

  return (
    <div className="space-y-6 pt-20 sm:pt-24">
      <div ref={playerWrapperRef} id="xini-player-wrapper" className="overflow-hidden rounded-[34px] border border-white/[0.06] bg-black">
        <div className="relative aspect-video bg-black">
          <Link to={`/streaming/content/${item.id}`} className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs text-white/75 backdrop-blur-md transition hover:text-white">
            <ArrowLeft size={15} /> Back to detail
          </Link>

          {youtubePlayback ? (
            <iframe
              title={item.title}
              src={item.videoUrl}
              className="h-full w-full bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={item.videoUrl || item.fallbackVideoUrl}
              poster={item.poster}
              className="h-full w-full bg-black object-contain"
              onClick={togglePlay}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoaded}
              onEnded={() => setIsPlaying(false)}
              playsInline
              preload="metadata"
            />
          )}

          {!item.canPlay ? (
            <AccessPrompt
              item={item}
              user={user}
              mode="overlay"
              subscribing={subscribing}
              purchasing={purchasing}
              onSubscribe={subscribeAndPlay}
              onPurchase={payAndPlay}
            />
          ) : youtubePlayback ? (
            <button
              type="button"
              onClick={onFullscreen}
              className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs text-white/75 backdrop-blur-md transition hover:text-white"
            >
              <Maximize size={15} /> Fullscreen
            </button>
          ) : (
            <>
              {!isPlaying && (
                <button onClick={togglePlay} className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/14 text-white backdrop-blur-md transition hover:bg-xini-green sm:h-20 sm:w-20">
                  <Play size={32} fill="currentColor" />
                </button>
              )}
              <PlayerControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                currentTime={currentTime}
                duration={duration}
                progress={progress}
                onPlay={togglePlay}
                onMute={onMute}
                onSeek={onSeek}
                onSkip={onSkip}
                onFullscreen={onFullscreen}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">{item.typeLabel}</Badge>
                <Badge tone={item.access === "public" ? "green" : "warning"}>{item.accessLabel}</Badge>
              </div>
              <h1 className="xini-heading-lg mt-4 break-words">{item.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 xini-muted">{item.description}</p>
            </div>
            {item.canPlay && <Button variant="secondary" onClick={saveProgress}>Save watch progress</Button>}
          </div>
          <AnalyticsStrip analytics={item.analytics} />
        </main>

        <aside>
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

function formatTime(time) {
  if (!time || Number.isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
