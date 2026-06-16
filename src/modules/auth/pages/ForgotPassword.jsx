import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { useAuth } from "../store/AuthContext";
export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); if (!email.includes("@")) { setError("Enter a valid email address."); return; } setLoading(true); setError(""); const res = await forgotPassword(email); setSuccess(res.message); setLoading(false); };
  return <AuthLayout badge="Password recovery" title="Reset password" subtitle="Enter your email and we will show a mocked recovery confirmation.">{success ? <div className="space-y-5"><div className="rounded-3xl border border-xini-green/20 bg-xini-green/10 p-5 text-sm leading-7 text-xini-mint">{success}</div><Link to="/login"><Button className="w-full" size="lg">Back to login</Button></Link></div> : <form onSubmit={submit} className="space-y-5"><Input label="Email address" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@xini8.com" error={error} /><Button type="submit" className="w-full" size="lg" disabled={loading}><MailCheck size={18} />{loading ? "Sending link..." : "Send reset link"}</Button><p className="text-center text-sm text-white/45">Remember password? <Link to="/login" className="font-medium text-xini-mint hover:underline">Sign in</Link></p></form>}</AuthLayout>;
}
