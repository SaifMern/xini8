import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../../modules/auth/store/AuthContext";
export default function Toast() {
  const { toast, setToast } = useAuth();
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 2800); return () => clearTimeout(timer); }, [toast, setToast]);
  if (!toast) return null;
  return <div className="fixed right-4 top-4 z-[100] w-[calc(100%-32px)] max-w-sm rounded-3xl border border-xini-green/20 bg-xini-section/95 p-4 text-sm text-xini-text shadow-2xl backdrop-blur-xl"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 text-xini-mint" size={19} /><p className="flex-1">{toast.message}</p><button onClick={() => setToast(null)} className="text-white/45 hover:text-white"><X size={17} /></button></div></div>;
}
