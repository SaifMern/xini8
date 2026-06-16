import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Film, LayoutDashboard, Menu, Search, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../../modules/auth/store/AuthContext";
import FAQSection from "./FAQSection";
import SiteFooter from "./SiteFooter";

const publicLinks = [
  { to: "/streaming", label: "Home" },
  { to: "/streaming/library", label: "Movies & Shows" },
  { to: "/projects", label: "Projects" },
  { to: "/distribution", label: "Distribution" },
];

export default function PublicStreamingLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/streaming/library?q=${encodeURIComponent(query)}` : "/streaming/library");
    setOpen(false);
  };

  return (
    <div className="xini-page min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-xini-bg/82 backdrop-blur-2xl">
        <div className="xini-shell-container flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link to="/streaming" className="flex shrink-0 items-center gap-3" aria-label="XINI8 home">
              <img
                src="/assets/xini8-logo.png"
                alt="XINI8"
                className="h-8 w-auto max-w-[122px] object-contain sm:h-9"
              />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {publicLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/streaming"}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition ${
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/58 hover:bg-white/[0.055] hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <form
            onSubmit={submitSearch}
            className="hidden min-w-[260px] max-w-[380px] flex-1 items-center rounded-full border border-white/[0.07] bg-white/[0.045] px-4 py-2 text-white/70 transition focus-within:border-xini-green/50 md:flex"
          >
            <Search size={16} className="shrink-0 text-white/42" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search movies, trailers, creators"
              className="ml-2 w-full bg-transparent text-xs text-white outline-none placeholder:text-white/42"
              aria-label="Search streaming library"
            />
          </form>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="sm"><LayoutDashboard size={16} />Dashboard</Button>
                </Link>
                <Link to="/account/profile">
                  <Button variant="secondary" size="sm">
                    <UserCircle2 size={16} /> Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.045] text-white/70 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-[88%] max-w-sm border-l border-white/[0.08] bg-xini-bg p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/streaming" onClick={() => setOpen(false)} className="flex items-center gap-3" aria-label="XINI8 home">
            <img src="/assets/xini8-logo.png" alt="XINI8" className="h-8 w-auto max-w-[128px] object-contain" />
          </Link>
          <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.055] text-white/70">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submitSearch} className="mt-6 flex items-center rounded-full border border-white/[0.07] bg-white/[0.045] px-4 py-3 text-white/70 focus-within:border-xini-green/50">
          <Search size={16} className="shrink-0 text-white/42" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search XINI8"
            className="ml-2 w-full bg-transparent text-xs text-white outline-none placeholder:text-white/42"
            aria-label="Search XINI8"
          />
        </form>

        <nav className="mt-7 space-y-2">
          {publicLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/streaming"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? "bg-xini-green text-white" : "text-white/60 hover:bg-white/[0.055]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 grid gap-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}><Button className="w-full"><LayoutDashboard size={16} />Dashboard</Button></Link>
              <Link to="/account/profile" onClick={() => setOpen(false)}><Button className="w-full" variant="secondary">Profile</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}><Button className="w-full" variant="secondary">Login</Button></Link>
              <Link to="/register" onClick={() => setOpen(false)}><Button className="w-full">Sign up</Button></Link>
            </>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4 text-sm leading-7 text-white/50">
          <Film className="mb-3 text-xini-mint" size={20} />
          Browse free trailers and project media without login. Premium content unlocks with mocked subscription.
        </div>
      </aside>

      <main className="xini-shell-container">
        <Outlet />
      </main>
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
