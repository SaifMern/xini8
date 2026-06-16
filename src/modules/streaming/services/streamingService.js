import { seedCreators, seedMedia } from "../../../shared/data/seedStreaming";
import { delay } from "../../../shared/utils/delay";

const MEDIA_KEY = "xini8_mock_streaming_media_v3";
const FOLLOW_KEY = "xini8_mock_follows_v3";
const WATCH_KEY = "xini8_mock_watch_history_v3";
const NOTIFY_KEY = "xini8_mock_notifications_v3";
const SUBSCRIPTION_KEY = "xini8_mock_subscription_v3";
const PURCHASE_KEY = "xini8_mock_content_purchases_v3";
const GUEST_KEY = "xini8_mock_guest_id";

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readMedia() {
  const saved = localStorage.getItem(MEDIA_KEY);
  if (!saved) {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(seedMedia));
    return seedMedia;
  }
  return safeParse(saved, seedMedia);
}

function writeMedia(media) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
}

function readJson(key, fallback = []) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return safeParse(saved, fallback);
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getViewerId(user) {
  if (user?.id) return user.id;
  const saved = localStorage.getItem(GUEST_KEY);
  if (saved) return saved;
  const id = uid("guest");
  localStorage.setItem(GUEST_KEY, id);
  return id;
}

function getAccessLabel(access) {
  const labels = {
    public: "Free",
    premium: "Premium",
    investor_only: "Investor Access",
    private: "Private",
  };
  return labels[access] || "Free";
}

function getTypeLabel(type) {
  const labels = {
    movie: "Movie",
    short_film: "Short Film",
    trailer: "Trailer",
    teaser: "Teaser",
    proof_of_concept: "Proof-of-Concept",
  };
  return labels[type] || "Content";
}

function readSubscription(user) {
  const viewerId = getViewerId(user);
  const subscriptions = readJson(SUBSCRIPTION_KEY, []);
  const active = subscriptions.find(
    (sub) => sub.viewerId === viewerId && sub.status === "active"
  );
  return active || null;
}

function readPurchase(user, mediaId) {
  const viewerId = getViewerId(user);
  const purchases = readJson(PURCHASE_KEY, []);
  return purchases.find(
    (purchase) =>
      purchase.viewerId === viewerId &&
      purchase.mediaId === mediaId &&
      purchase.status === "active"
  ) || null;
}

function hasPlaybackAccess(item, user) {
  if (!item) return false;
  if (item.access === "public") return true;
  if (user?.role === "admin") return true;
  if (user?.role === "creator" && item.creatorName === user.fullName) return true;
  if (item.access === "investor_only" && user?.role === "investor") return true;
  if (readPurchase(user, item.id)) return true;
  return Boolean(readSubscription(user));
}

function enrichItem(item, user) {
  const viewerId = getViewerId(user);
  const follows = readJson(FOLLOW_KEY, []);
  const notifications = readJson(NOTIFY_KEY, []);
  const watchHistory = readJson(WATCH_KEY, []);
  const watchRecord = watchHistory.find(
    (record) => record.viewerId === viewerId && record.mediaId === item.id
  );
  const subscription = readSubscription(user);
  const purchase = readPurchase(user, item.id);
  const canPlay = hasPlaybackAccess(item, user);

  return {
    ...item,
    accessLabel: getAccessLabel(item.access),
    typeLabel: getTypeLabel(item.contentType),
    canPlay,
    requiresSubscription: !canPlay,
    activeSubscription: subscription,
    activePurchase: purchase,
    isCreatorFollowed: follows.some(
      (follow) => follow.viewerId === viewerId && follow.type === "creator" && follow.targetId === item.creatorId
    ),
    isProjectFollowed: follows.some(
      (follow) => follow.viewerId === viewerId && follow.type === "project" && follow.targetId === item.projectId
    ),
    isReleaseNotificationOn: notifications.some(
      (note) => note.viewerId === viewerId && note.type === "release" && note.mediaId === item.id
    ),
    isPremiereNotificationOn: notifications.some(
      (note) => note.viewerId === viewerId && note.mediaId === item.id && note.type === "premiere"
    ),
    watchProgress: watchRecord?.progress || 0,
    watchedAt: watchRecord?.watchedAt || null,
  };
}

export const streamingService = {
  getViewerId,

  async listContent({ user, query = "", type = "all" } = {}) {
    await delay(360);
    const media = readMedia();
    const visible = media.filter((item) => {
      if (user?.role === "admin") return true;
      if (user?.role === "creator") {
        return item.status === "published" || item.creatorName === user.fullName || item.creatorId === "crt_001";
      }
      return item.status === "published" && item.access !== "private";
    });

    const normalized = query.trim().toLowerCase();
    const filtered = visible.filter((item) => {
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.genre} ${item.creatorName} ${item.contentType}`
          .toLowerCase()
          .includes(normalized);
      const matchesType = type === "all" || item.contentType === type;
      return matchesQuery && matchesType;
    });

    return filtered.map((item) => enrichItem(item, user));
  },

  async getContent(mediaId, user) {
    await delay(280);
    const item = readMedia().find((media) => media.id === mediaId);
    return item ? enrichItem(item, user) : null;
  },

  async getStreamingHome(user) {
    await delay(420);
    const media = await this.listContent({ user });
    const published = media.filter((item) => item.status === "published");
    const continueWatching = published.filter((item) => item.watchProgress > 0).slice(0, 8);

    return {
      featured: published[0] || media[0],
      rows: [
        { title: "Featured Movies", key: "featured", items: published.filter((item) => item.contentType === "movie").slice(0, 8) },
        { title: "Trending Now", key: "trending", items: [...published].sort((a, b) => b.analytics.views - a.analytics.views).slice(0, 8) },
        { title: "Free to Watch", key: "free", items: published.filter((item) => item.access === "public").slice(0, 8) },
        { title: "Premium & Investor Access", key: "premium", items: published.filter((item) => item.access !== "public").slice(0, 8) },
        { title: "New Releases", key: "new", items: [...published].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8) },
        { title: "Trailers, Teasers & Proofs", key: "clips", items: published.filter((item) => ["trailer", "teaser", "proof_of_concept"].includes(item.contentType)).slice(0, 8) },
        { title: "Continue Watching", key: "continue", items: continueWatching },
      ].filter((row) => row.items.length > 0),
      creators: seedCreators,
      subscription: readSubscription(user),
    };
  },

  async getRelated(mediaId, user) {
    await delay(220);
    const selected = readMedia().find((item) => item.id === mediaId);
    if (!selected) return [];
    return readMedia()
      .filter((item) => item.id !== mediaId && item.status === "published" && item.access !== "private")
      .filter((item) => item.genre === selected.genre || item.creatorId === selected.creatorId || item.contentType === selected.contentType)
      .slice(0, 5)
      .map((item) => enrichItem(item, user));
  },

  async trackView(user, mediaId, payload = {}) {
    await delay(220);
    const viewerId = getViewerId(user);
    const watchHistory = readJson(WATCH_KEY, []);
    const nextRecord = {
      id: uid("watch"),
      viewerId,
      userId: user?.id || null,
      mediaId,
      progress: Math.min(100, Math.max(0, Number(payload.progress) || 0)),
      watchTime: Number(payload.watchTime) || 0,
      completed: Boolean(payload.completed),
      deviceType: "desktop",
      watchedAt: new Date().toISOString(),
    };

    writeJson(WATCH_KEY, [
      nextRecord,
      ...watchHistory.filter((record) => !(record.viewerId === viewerId && record.mediaId === mediaId)),
    ]);

    const media = readMedia().map((item) => {
      if (item.id !== mediaId) return item;
      return {
        ...item,
        analytics: {
          ...item.analytics,
          views: item.analytics.views + 1,
          watchTimeHours: item.analytics.watchTimeHours + Math.max(1, Math.round((Number(payload.watchTime) || 60) / 60)),
          engagementRate: Math.min(98, item.analytics.engagementRate + 1),
        },
      };
    });
    writeMedia(media);

    return { message: user ? "Watch history updated." : "Guest watch progress saved." };
  },

  async subscribe(user, plan = "premium") {
    await delay(800);
    const viewerId = getViewerId(user);
    const subscriptions = readJson(SUBSCRIPTION_KEY, []);
    const nextSubscription = {
      id: uid("sub"),
      viewerId,
      userId: user?.id || null,
      plan,
      status: "active",
      price: plan === "vip" ? 19 : 9,
      startedAt: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const next = [
      nextSubscription,
      ...subscriptions.filter((sub) => sub.viewerId !== viewerId),
    ];
    writeJson(SUBSCRIPTION_KEY, next);
    return { subscription: nextSubscription, message: "Premium plan activated. Paid movies are now unlocked in this demo." };
  },

  async purchaseContent(user, mediaId) {
    await delay(720);
    if (!user) throw new Error("Login required to pay to watch.");
    const media = readMedia().find((item) => item.id === mediaId);
    if (!media) throw new Error("Content not found.");
    const viewerId = getViewerId(user);
    const purchases = readJson(PURCHASE_KEY, []);
    const nextPurchase = {
      id: uid("purchase"),
      viewerId,
      userId: user.id,
      mediaId,
      title: media.title,
      status: "active",
      amount: 4,
      currency: "USD",
      purchasedAt: new Date().toISOString(),
    };
    writeJson(PURCHASE_KEY, [
      nextPurchase,
      ...purchases.filter((purchase) => !(purchase.viewerId === viewerId && purchase.mediaId === mediaId)),
    ]);
    return { purchase: nextPurchase, message: "Pay-to-watch access activated for this title." };
  },

  async getSubscription(user) {
    await delay(150);
    return readSubscription(user);
  },

  async toggleFollow(user, type, targetId) {
    await delay(320);
    if (!user) throw new Error("Login required to follow creators or projects.");
    const viewerId = getViewerId(user);
    const follows = readJson(FOLLOW_KEY, []);
    const exists = follows.some((item) => item.viewerId === viewerId && item.type === type && item.targetId === targetId);
    const next = exists
      ? follows.filter((item) => !(item.viewerId === viewerId && item.type === type && item.targetId === targetId))
      : [{ id: uid("follow"), viewerId, userId: user.id, type, targetId, createdAt: new Date().toISOString() }, ...follows];
    writeJson(FOLLOW_KEY, next);
    return { followed: !exists, message: exists ? "Follow removed." : type === "creator" ? "Creator followed." : "Project followed." };
  },

  async toggleNotification(user, mediaId, type) {
    await delay(320);
    if (!user) throw new Error("Login required to enable notifications.");
    const viewerId = getViewerId(user);
    const notifications = readJson(NOTIFY_KEY, []);
    const exists = notifications.some((item) => item.viewerId === viewerId && item.mediaId === mediaId && item.type === type);
    const next = exists
      ? notifications.filter((item) => !(item.viewerId === viewerId && item.mediaId === mediaId && item.type === type))
      : [{ id: uid("notify"), viewerId, userId: user.id, mediaId, type, createdAt: new Date().toISOString() }, ...notifications];
    writeJson(NOTIFY_KEY, next);
    return { active: !exists, message: exists ? "Notification removed." : type === "release" ? "Release notification enabled." : "Premiere notification enabled." };
  },

  async createMedia(user, payload) {
    await delay(850);
    if (!user || !["creator", "admin"].includes(user.role)) throw new Error("Permission denied.");
    const media = readMedia();
    const item = {
      id: uid("med"),
      projectId: payload.projectId || uid("prj"),
      title: payload.title,
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      contentType: payload.contentType,
      access: payload.access,
      status: payload.status || "draft",
      genre: payload.genre || "Drama",
      runtime: payload.runtime || "3m",
      year: "2026",
      creatorId: payload.creatorId || "crt_custom",
      creatorName: user.fullName,
      creatorRole: user.role === "admin" ? "Platform Admin" : "Creator",
      poster: payload.poster || "/assets/movies/neon-province-poster.jpg",
      thumbnail: payload.thumbnail || payload.poster || "/assets/movies/neon-province-thumb.jpg",
      videoProvider: payload.videoProvider || "youtube",
      videoUrl: payload.videoUrl || "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0&modestbranding=1&playsinline=1",
      trailerUrl: payload.trailerUrl || payload.videoUrl || "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0&modestbranding=1&playsinline=1",
      synopsis: payload.synopsis || "Short content package prepared for XINI8 streaming presentation.",
      description: payload.description || "Creator uploaded content for presentation, investor review, and audience discovery.",
      team: payload.team || [{ name: user.fullName, role: "Creator" }],
      funding: payload.funding || { goal: 0, raised: 0, investors: 0, status: "Draft" },
      analytics: { views: 0, watchTimeHours: 0, engagementRate: 0, completionRate: 0 },
      releaseStatus: "Notify on Release",
      premiereStatus: "No premiere date",
      tags: [getTypeLabel(payload.contentType)],
      createdAt: new Date().toISOString(),
    };
    writeMedia([item, ...media]);
    return { media: item, message: "Content uploaded to media library." };
  },

  async updateMedia(mediaId, payload) {
    await delay(650);
    let saved = null;
    const media = readMedia().map((item) => {
      if (item.id !== mediaId) return item;
      saved = { ...item, ...payload, updatedAt: new Date().toISOString() };
      return saved;
    });
    writeMedia(media);
    return { media: saved, message: "Content updated." };
  },

  async deleteMedia(mediaId) {
    await delay(450);
    writeMedia(readMedia().filter((item) => item.id !== mediaId));
    return { message: "Content removed from library." };
  },
};
