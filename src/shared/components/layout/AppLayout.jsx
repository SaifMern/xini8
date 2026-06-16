import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BrainCircuit,
  Clapperboard,
  Film,
  FolderKanban,
  LayoutDashboard,
  Library,
  LogOut,
  Network,
  Menu,
  Settings,
  Shield,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../../modules/auth/store/AuthContext";
import FAQSection from "./FAQSection";
import SiteFooter from "./SiteFooter";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/projects", label: "Projects", icon: Film, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/streaming", label: "Streaming", icon: Clapperboard, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/streaming/library", label: "Library", icon: Library, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/distribution", label: "Distribution", icon: Network, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/projects/new", label: "Create Project", icon: FolderKanban, roles: ["creator", "admin"] },
  { to: "/studio", label: "Creator Studio", icon: BrainCircuit, roles: ["creator", "admin"] },
  { to: "/media/manage", label: "Media", icon: Clapperboard, roles: ["creator", "admin"] },
  { to: "/account/profile", label: "Profile", icon: UserCircle2, roles: ["creator", "investor", "viewer", "admin"] },
  { to: "/admin/users", label: "Users", icon: Users, roles: ["admin"] },
  { to: "/admin/review", label: "Review", icon: Shield, roles: ["admin"] },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const filtered = links.filter((link) => link.roles.includes(user?.role));

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="xini-page min-h-screen">
      <DesktopSidebar user={user} links={filtered} onLogout={handleLogout} />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-xini-bg/88 backdrop-blur-2xl lg:hidden">
        <div className="xini-shell-container flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.045] text-white/75"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <Brand compact />
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green text-xs font-medium text-white">
            {user?.avatarInitials || "U"}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/62 backdrop-blur-sm transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[60] h-full w-[86%] max-w-[320px] border-r border-white/[0.08] bg-xini-bg p-5 shadow-2xl transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.055] text-white/70"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <UserBlock user={user} className="mt-7" />

        <nav className="mt-6 space-y-2">
          {filtered.map((item) => (
            <SideLink key={item.to} item={item} onClick={() => setIsSidebarOpen(false)} />
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <button className="mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/[0.055] hover:text-white">
            <Settings size={17} /> Settings
          </button>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-200/80 hover:bg-red-500/10">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="xini-shell-container py-5 sm:py-7 lg:py-8">
          <Outlet />
        </div>
        <FAQSection compact />
        <SiteFooter compact />
      </main>
    </div>
  );
}

function DesktopSidebar({ user, links, onLogout }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/[0.06] bg-xini-bg/92 p-5 backdrop-blur-xl lg:block">
      <Brand />
      <nav className="mt-8 space-y-2">
        {links.map((item) => (
          <SideLink key={item.to} item={item} />
        ))}
      </nav>
      <div className="absolute bottom-5 left-5 right-5">
        <UserBlock user={user} />
        <button className="mb-1 mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/[0.055] hover:text-white">
          <Settings size={17} /> Settings
        </button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-200/80 hover:bg-red-500/10">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}

function Brand({ compact = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img
        src="/assets/xini8-logo.png"
        alt="XINI8"
        className={`${compact ? "h-7 max-w-[112px]" : "h-8 max-w-[132px]"} w-auto object-contain`}
      />
    </div>
  );
}

function UserBlock({ user, className = "" }) {
  return (
    <div className={`w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.035] p-3 ${className}`}>
      <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green text-sm font-medium text-white">
          {user?.avatarInitials || "U"}
        </div>
        <div className="min-w-0 overflow-hidden">
          <p className="block max-w-full truncate whitespace-nowrap text-sm font-medium leading-5" title={user?.fullName || "User"}>{user?.fullName || "User"}</p>
          <p className="block max-w-full truncate whitespace-nowrap text-xs capitalize leading-5 text-white/42" title={user?.role || "role"}>{user?.role || "role"}</p>
        </div>
      </div>
    </div>
  );
}

function SideLink({ item, onClick }) {
  const Icon = item.icon;
  const location = useLocation();
  const isActive =
    location.pathname === item.to ||
    (item.to === "/projects" && location.pathname.startsWith("/projects/") && location.pathname !== "/projects/new") ||
    (item.to === "/streaming" && location.pathname === "/streaming") ||
    (item.to === "/streaming/library" && location.pathname.startsWith("/streaming/library")) ||
    (item.to === "/distribution" && location.pathname.startsWith("/distribution"));

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
        isActive ? "bg-xini-green text-white" : "text-white/55 hover:bg-white/[0.055] hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}
