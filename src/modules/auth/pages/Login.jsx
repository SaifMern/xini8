import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { useAuth } from "../store/AuthContext";
import { getDashboardPath } from "../../../shared/utils/authHelpers";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "creator@xini8.com", password: "12345678" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (field, value) => { setForm((p) => ({ ...p, [field]: value })); setErrors((p) => ({ ...p, [field]: "" })); setServerError(""); };
  const validate = () => { const e = {}; if (!form.email.trim()) e.email = "Email is required."; if (!form.password.trim()) e.password = "Password is required."; setErrors(e); return Object.keys(e).length === 0; };
  const handleSubmit = async (event) => { event.preventDefault(); if (!validate()) return; try { setIsSubmitting(true); const res = await login(form); navigate(getDashboardPath(res.user.role), { replace: true }); } catch (error) { setServerError(error.message || "Unable to login."); } finally { setIsSubmitting(false); } };
  return <AuthLayout title="Welcome back" subtitle="Sign in to access user management and film lifecycle modules."><form onSubmit={handleSubmit} className="space-y-5">{serverError && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{serverError}</div>}<Input label="Email address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@xini8.com" error={errors.email} /><PasswordInput value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" error={errors.password} /><div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-white/45"><input type="checkbox" className="accent-[#20946E]" />Remember me</label><Link to="/forgot-password" className="text-xini-mint hover:underline">Forgot password?</Link></div><Button type="submit" className="w-full" size="lg" disabled={isSubmitting}><LogIn size={18} />{isSubmitting ? "Signing in..." : "Sign in"}</Button><DemoAccounts /><p className="text-center text-sm text-white/45">New to XINI8? <Link to="/register" className="font-medium text-xini-mint hover:underline">Create account</Link></p></form></AuthLayout>;
}
function DemoAccounts() { return <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4 text-xs leading-6 text-white/45"><p className="font-medium text-white/70">Demo accounts</p><p>creator@xini8.com / 12345678</p><p>investor@xini8.com / 12345678</p><p>viewer@xini8.com / 12345678</p><p>admin@xini8.com / 12345678</p></div>; }
