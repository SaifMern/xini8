import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "What is XINI8?",
    answer:
      "XINI8 is a premium film and creator platform MVP where viewers can discover content, watch free titles, unlock premium content, follow projects, and explore creator-led film opportunities.",
  },
  {
    question: "Can viewers watch content without login?",
    answer:
      "Yes. Visitors can browse public content and watch free titles. Premium movies show a Subscribe or Pay to Watch gate before playback.",
  },
  {
    question: "What modules are included in this MVP?",
    answer:
      "The MVP includes User Management, Film Lifecycle Engine, Creator Studio Lite, Streaming Platform MVP, and Distribution Marketplace Lite.",
  },
  {
    question: "Is this ready for future backend/API integration?",
    answer:
      "Yes. The frontend is organized module-wise with services, reusable UI components, protected routes, mock data, and local persistence so real APIs can replace mock services later.",
  },
  {
    question: "How does premium content work right now?",
    answer:
      "Premium access is mocked for demo purposes. The UI gives a production-level subscription/pay-to-watch flow, while real payment, billing, and subscription APIs can be connected later.",
  },
];

export default function FAQSection({ compact = false }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className={`${compact ? "mt-10" : "mt-14 sm:mt-18"} border-t border-white/[0.06] bg-gradient-to-b from-white/[0.025] to-transparent`}>
      <div className="xini-shell-container py-10 sm:py-12 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-xini-green/18 text-xini-mint">
                <HelpCircle size={21} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-xini-mint/80">FAQ</p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">Common XINI8 questions</h2>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/58">
              Quick answers about streaming access, premium movies, module coverage, and future API/backend integration.
            </p>
            <Link
              to="/streaming/library"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-xs font-medium text-white/70 transition hover:border-xini-green/40 hover:bg-xini-green/10 hover:text-white"
            >
              <Sparkles size={14} /> Explore XINI8 library
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06] overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.035] shadow-2xl shadow-black/20">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="block w-full text-left transition hover:bg-white/[0.025] focus:outline-none focus-visible:bg-white/[0.04]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-6 text-white sm:text-[15px]">{item.question}</p>
                      <div
                        className={`grid transition-all duration-300 ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="pt-2 text-sm leading-7 text-white/58">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`mt-1 shrink-0 text-white/48 transition-transform ${isOpen ? "rotate-180 text-xini-mint" : ""}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
