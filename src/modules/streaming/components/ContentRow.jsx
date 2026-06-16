import ContentCard from "./ContentCard";

export default function ContentRow({ title, items = [], subtitle = "Curated XINI8 content for creators, investors and viewers." }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-medium text-xini-text sm:text-2xl">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm xini-muted">{subtitle}</p>
        </div>
      </div>
      <div className="xini-horizontal-row">
        {items.map((item) => <ContentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
