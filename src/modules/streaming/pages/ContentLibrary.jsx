import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Badge from "../../../shared/components/ui/Badge";
import Input from "../../../shared/components/ui/Input";
import ContentCard from "../components/ContentCard";
import { contentTypes } from "../../../shared/data/seedStreaming";
import { useAuth } from "../../auth/store/AuthContext";
import { streamingService } from "../services/streamingService";

export default function ContentLibrary() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    streamingService.listContent({ user, query, type }).then(setItems).finally(() => setLoading(false));
  }, [user, query, type]);

  const updateQuery = (value) => {
    setQuery(value);
    const trimmed = value.trim();
    if (trimmed) setSearchParams({ q: trimmed });
    else setSearchParams({});
  };

  const typeOptions = useMemo(() => [{ value: "all", label: "All" }, ...contentTypes], []);

  return (
    <div className="space-y-7 pt-20 sm:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="success">Content Library</Badge>
          <h1 className="xini-heading-lg mt-4">Browse movies, trailers and creator media</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 xini-muted">
            A LookHu-style discovery layer for XINI8: public browsing, free playback, paid locks, and creator-driven content.
          </p>
        </div>
      </div>

      <div className="rounded-[30px] border border-white/[0.06] bg-white/[0.035] p-4">
        <Input
          label="Search library"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search by title, genre, creator or format"
        />
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
                type === option.value
                  ? "border-xini-green bg-xini-green text-white"
                  : "border-white/[0.08] bg-white/[0.035] text-white/55 hover:border-xini-green/35 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/[0.045]" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => <ContentCard key={item.id} item={item} />)}
        </div>
      )}

      {!loading && !items.length && (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-10 text-center">
          <Search className="mx-auto text-xini-mint" size={32} />
          <h2 className="mt-4 text-xl font-medium">No content found</h2>
          <p className="mt-2 text-sm xini-muted">Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
