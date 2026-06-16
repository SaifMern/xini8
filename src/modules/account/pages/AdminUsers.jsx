import { useEffect, useState } from "react";
import Badge from "../../../shared/components/ui/Badge";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import { authService } from "../../auth/services/authService";
import { useAuth } from "../../auth/store/AuthContext";

export default function AdminUsers() {
  const { notify } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => authService.listUsers().then(setUsers).finally(() => setLoading(false));
  useEffect(()=>{ load(); }, []);
  const update = async (id, payload) => { const updated = await authService.updateUserStatus(id, payload); setUsers(updated); notify("User status updated."); };
  return <div className="space-y-6"><div><Badge tone="success">Admin Control</Badge><h1 className="xini-heading-lg mt-4">User management</h1><p className="mt-2 max-w-2xl text-sm xini-muted">Review users, verification status, roles and account access.</p></div><Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="bg-white/[0.035] text-white/45"><tr><th className="px-5 py-4">User</th><th>Role</th><th>Verification</th><th>Account</th><th>Wallet</th><th className="pr-5">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="px-5 py-10 text-center xini-muted">Loading users...</td></tr> : users.map(user => <tr key={user.id} className="border-t border-white/[0.05]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-xini-green text-xs font-medium">{user.avatarInitials}</div><div><p className="font-medium">{user.fullName}</p><p className="text-xs text-white/45">{user.email}</p></div></div></td><td className="capitalize text-white/65">{user.role}</td><td><Badge tone={user.verificationStatus === "verified" ? "success" : user.verificationStatus === "rejected" ? "danger" : "warning"}>{user.verificationStatus}</Badge></td><td><Badge tone={user.accountStatus === "active" ? "success" : "danger"}>{user.accountStatus}</Badge></td><td className="text-white/45">{user.walletAddress || "Not connected"}</td><td className="pr-5"><div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={()=>update(user.id,{verificationStatus:user.verificationStatus === "verified" ? "pending" : "verified"})}>{user.verificationStatus === "verified" ? "Set pending" : "Verify"}</Button><Button size="sm" variant={user.accountStatus === "active" ? "danger" : "outline"} onClick={()=>update(user.id,{accountStatus:user.accountStatus === "active" ? "suspended" : "active"})}>{user.accountStatus === "active" ? "Suspend" : "Activate"}</Button></div></td></tr>)}</tbody></table></div></Card></div>;
}
