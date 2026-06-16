import { CreditCard, Lock, Play, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Badge from "../../../shared/components/ui/Badge";

export default function AccessPrompt({
  item,
  user,
  mode = "card",
  subscribing = false,
  purchasing = false,
  onSubscribe,
  onPurchase,
}) {
  if (!item) return null;

  const isLoggedIn = Boolean(user);
  const isInvestorOnly = item.access === "investor_only";
  const title = isInvestorOnly
    ? "Investor access required"
    : "Subscribe or pay to watch";

  const message = isInvestorOnly
    ? "This pitch and proof-of-concept media is reserved for verified investors and platform administrators."
    : `${item.title} is premium content. Free members can browse details and watch free titles, while premium titles unlock through subscription or one-time watch access.`;

  const wrapperClass =
    mode === "overlay"
      ? "absolute inset-0 z-20 grid place-items-center bg-black/74 p-4 backdrop-blur-md sm:p-6"
      : "rounded-[28px] border border-xini-green/20 bg-xini-green/8 p-5 sm:p-6";

  return (
    <div className={wrapperClass}>
      <div className="w-full max-w-lg rounded-[30px] border border-white/[0.08] bg-[#03110e]/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,.45)] sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-xini-green/14 text-xini-mint">
            {isInvestorOnly ? <ShieldCheck size={22} /> : <Lock size={22} />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge tone="warning">{item.accessLabel}</Badge>
              <Badge tone="default">{item.typeLabel}</Badge>
            </div>

            <h2 className="mt-4 text-xl font-medium leading-tight text-xini-text sm:text-2xl">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/58">{message}</p>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="mt-5 rounded-3xl border border-white/[0.06] bg-white/[0.04] p-4 text-sm leading-7 text-white/58">
            <div className="mb-2 flex items-center gap-2 text-xini-mint">
              <UserRound size={16} />
              Login required for paid playback
            </div>
            Create a free viewer account or login to subscribe, pay to watch, follow creators, and save watch history.
          </div>
        )}

        {isLoggedIn && !isInvestorOnly && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onSubscribe}
              disabled={subscribing || purchasing}
              className="rounded-3xl border border-xini-green/24 bg-xini-green/12 p-4 text-left transition hover:border-xini-neon/45 hover:bg-xini-green/18 disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-xini-text">Premium Plan</span>
                <Badge tone="success">Demo</Badge>
              </div>
              <p className="mt-2 text-2xl font-medium text-xini-mint">$9/mo</p>
              <p className="mt-2 text-xs leading-6 text-white/48">
                Unlock all premium movies and continue watching across the MVP.
              </p>
            </button>

            <button
              type="button"
              onClick={onPurchase}
              disabled={subscribing || purchasing}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.045] p-4 text-left transition hover:border-xini-green/35 hover:bg-white/[0.065] disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-xini-text">Pay to Watch</span>
                <CreditCard size={16} className="text-xini-mint" />
              </div>
              <p className="mt-2 text-2xl font-medium text-xini-text">$4</p>
              <p className="mt-2 text-xs leading-6 text-white/48">
                One-time mocked access for this title only. No real charge.
              </p>
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="flex-1 sm:flex-none">
                <Button className="w-full"><Play size={16} />Login to Watch</Button>
              </Link>
              <Link to="/register" className="flex-1 sm:flex-none">
                <Button className="w-full" variant="secondary">Create Account</Button>
              </Link>
            </>
          ) : isInvestorOnly ? (
            <>
              {user.role === "investor" || user.role === "admin" ? (
                <Button onClick={onPurchase} disabled={purchasing || subscribing}>
                  {purchasing ? "Opening access..." : "Open Investor Playback"}
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Investor-only content
                </Button>
              )}
            </>
          ) : (
            <Button onClick={onSubscribe} disabled={subscribing || purchasing}>
              {subscribing ? "Activating premium..." : purchasing ? "Processing access..." : "Subscribe & Watch"}
            </Button>
          )}
        </div>

        <p className="mt-4 text-xs leading-6 text-white/38">
          Mock checkout for MVP demo only. Future integration can connect Stripe, wallet payments, subscriptions, and entitlement APIs.
        </p>
      </div>
    </div>
  );
}
