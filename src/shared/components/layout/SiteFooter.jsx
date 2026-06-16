import { Link } from "react-router-dom";
import { Clapperboard, Crown, Film, Mail, Network, ShieldCheck, Users } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Streaming Home", to: "/streaming" },
      { label: "Movies & Shows", to: "/streaming/library" },
      { label: "Projects", to: "/projects" },
      { label: "Distribution", to: "/distribution" },
    ],
  },
  {
    title: "Creator Tools",
    links: [
      { label: "Creator Studio", to: "/studio" },
      { label: "Create Project", to: "/projects/new" },
      { label: "Media Management", to: "/media/manage" },
      { label: "Profile", to: "/account/profile" },
    ],
  },
  {
    title: "Access",
    links: [
      { label: "Login", to: "/login" },
      { label: "Create Account", to: "/register" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Forgot Password", to: "/forgot-password" },
    ],
  },
];

const highlights = [
  { icon: Film, label: "Film lifecycle" },
  { icon: Clapperboard, label: "Streaming MVP" },
  { icon: Crown, label: "Premium access" },
  { icon: Network, label: "Distribution" },
];

export default function SiteFooter({ compact = false }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-[#020c0a]/70 backdrop-blur-xl">
      <div className="xini-shell-container py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.15fr] lg:gap-10">
          <div className="min-w-0">
            <Link to="/streaming" className="inline-flex items-center" aria-label="XINI8 footer home">
              <img
                src="/assets/xini8-logo.png"
                alt="XINI8"
                className="h-9 w-auto max-w-[142px] object-contain sm:h-10"
                loading="lazy"
              />
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
              A cinematic creator economy platform for content discovery, project lifecycle tracking,
              streaming access, premium content, and future distribution opportunities.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3">
                    <Icon size={18} className="text-xini-mint" />
                    <p className="mt-2 text-xs font-medium leading-5 text-white/68">{item.label}</p>
                  </div>
                );
              })}
            </div>

            {!compact && (
              <div className="mt-6 rounded-3xl border border-xini-green/20 bg-xini-green/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 shrink-0 text-xini-mint" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">MVP-ready, API-ready structure</p>
                    <p className="mt-1 text-xs leading-6 text-white/55">
                      Mock flows are separated through modules and services so real auth, payments, media,
                      projects, and distribution APIs can be connected later.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title} className="min-w-0">
                <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                <div className="mt-3 grid gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.to + link.label}
                      to={link.to}
                      className="rounded-xl px-0 py-1 text-sm text-white/52 transition hover:text-xini-mint focus-ring"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} XINI8. Demo MVP for film, streaming, and distribution workflows.</p>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <span className="inline-flex items-center gap-2"><Users size={14} /> Creator · Viewer · Investor · Admin</span>
            <a href="mailto:hello@xini8.com" className="inline-flex items-center gap-2 transition hover:text-xini-mint"><Mail size={14} /> Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
