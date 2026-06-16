import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import RoleSelector from "../components/RoleSelector";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Select from "../../../shared/components/ui/Select";
import { useAuth } from "../store/AuthContext";
import { getDashboardPath } from "../../../shared/utils/authHelpers";
const countries = ["", "United States", "United Kingdom", "UAE", "Pakistan", "Canada"].map((v) => ({ value: v, label: v || "Select country" }));
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", country: "", role: "viewer" });
  const [errors, setErrors] = useState({}); const [serverError, setServerError] = useState(""); const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (field, value) => { setForm((p) => ({ ...p, [field]: value })); setErrors((p) => ({ ...p, [field]: "" })); setServerError(""); };
  const validate = () => { const e = {}; if (form.fullName.trim().length < 2) e.fullName = "Full name is required."; if (!form.email.includes("@")) e.email = "Enter a valid email."; if (form.password.length < 8) e.password = "Password must be at least 8 characters."; if (!form.country) e.country = "Country is required."; setErrors(e); return Object.keys(e).length === 0; };
  const handleSubmit = async (event) => { event.preventDefault(); if (!validate()) return; try { setIsSubmitting(true); const res = await register(form); navigate(getDashboardPath(res.user.role), { replace: true }); } catch (error) { setServerError(error.message || "Unable to create account."); } finally { setIsSubmitting(false); } };
  return <AuthLayout badge="Create account" title="Join XINI8" subtitle="Create a role-based account for the mocked MVP."><form onSubmit={handleSubmit} className="space-y-5">{serverError && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{serverError}</div>}<Input label="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full name" error={errors.fullName} /><Input label="Email address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@xini8.com" error={errors.email} /><PasswordInput value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Minimum 8 characters" error={errors.password} /><Select label="Country" value={form.country} onChange={(e) => update("country", e.target.value)} options={countries} error={errors.country} /><RoleSelector value={form.role} onChange={(role) => update("role", role)} /><Button type="submit" className="w-full" size="lg" disabled={isSubmitting}><UserPlus size={18} />{isSubmitting ? "Creating account..." : "Create account"}</Button><p className="text-center text-sm text-white/45">Already have an account? <Link to="/login" className="font-medium text-xini-mint hover:underline">Sign in</Link></p></form></AuthLayout>;
}
