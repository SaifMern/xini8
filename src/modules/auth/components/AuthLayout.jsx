import { Link } from "react-router-dom";
import Badge from "../../../shared/components/ui/Badge";

export default function AuthLayout({ badge = "Secure Access", title, subtitle, children }) {
  return (
    <div className="xini-page min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[1fr_500px]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-xini-bg via-xini-bg/88 to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
            <Brand />
            <div className="max-w-2xl pb-8">
              <Badge tone="success">Mocked MVP · Real app behavior</Badge>
              <h1 className="xini-heading-xl mt-6 max-w-2xl">Manage film projects from identity to lifecycle.</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">Role-based access, profiles, wallet connection, verification, project creation, milestones, teams, updates and workflow tracking.</p>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                <Metric value="2" label="Modules" /><Metric value="4" label="Roles" /><Metric value="9" label="Workflow stages" />
              </div>
            </div>
          </div>
        </section>
        <section className="flex min-h-screen items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden"><Brand /></div>
            <div className="xini-glass rounded-[28px] p-6 xini-soft-shadow sm:p-8">
              <Badge tone="green">{badge}</Badge>
              <h2 className="xini-heading-lg mt-5">{title}</h2>
              <p className="mt-3 text-sm leading-7 xini-muted">{subtitle}</p>
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="XINI8 home">
      <img src="/assets/xini8-logo.png" alt="XINI8" className="h-9 w-auto max-w-[136px] object-contain" />
    </Link>
  );
}
function Metric({ label, value }) { return <div className="rounded-3xl border border-white/[0.06] bg-white/[0.04] p-4"><div className="text-lg font-semibold text-xini-mint">{value}</div><div className="mt-1 text-xs text-white/45">{label}</div></div>; }
