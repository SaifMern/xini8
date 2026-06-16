import { BarChart3, Eye, Timer, Users } from "lucide-react";
import Card from "../../../shared/components/ui/Card";

export default function AnalyticsStrip({ analytics }) {
  const items = [
    { label: "Views", value: Number(analytics?.views || 0).toLocaleString(), icon: Eye },
    { label: "Watch Time", value: `${Number(analytics?.watchTimeHours || 0).toLocaleString()} hrs`, icon: Timer },
    { label: "Engagement", value: `${analytics?.engagementRate || 0}%`, icon: Users },
    { label: "Completion", value: `${analytics?.completionRate || 0}%`, icon: BarChart3 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-white/55">{item.label}</p>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint"><Icon size={18} /></div>
            </div>
            <p className="mt-4 text-2xl font-medium">{item.value}</p>
          </Card>
        );
      })}
    </div>
  );
}
