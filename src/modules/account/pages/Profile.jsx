import { useState } from "react";
import { Save, ShieldCheck, Wallet } from "lucide-react";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";
import Badge from "../../../shared/components/ui/Badge";
import Input from "../../../shared/components/ui/Input";
import ProgressBar from "../../../shared/components/ui/ProgressBar";
import { useAuth } from "../../auth/store/AuthContext";
import { getVerificationLabel } from "../../../shared/utils/authHelpers";

export default function Profile() {
  const { user, updateProfile, connectWallet, disconnectWallet } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName,
    country: user.country,
  });
  const [loading, setLoading] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setLoading(true);
    await updateProfile(form);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <Badge tone="success">User Management</Badge>
        <h1 className="xini-heading-lg mt-4 break-words">Profile & access</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 xini-muted">
          Manage your role identity, profile information, verification status and wallet connection.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-xini-green text-xl font-medium text-white xini-shadow">
              {user.avatarInitials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-medium leading-tight">{user.fullName}</h2>
              <p className="mt-1 break-all text-sm xini-muted">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="green">{user.role}</Badge>
                <Badge tone={user.verificationStatus === "verified" ? "success" : "warning"}>
                  {getVerificationLabel(user.verificationStatus)}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={save} className="mt-8 grid gap-4 md:grid-cols-2">
            <Input
              label="Full name"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(event) => setForm({ ...form, country: event.target.value })}
            />
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                <Save size={17} />
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium">Verification</h3>
                <p className="break-words text-sm xini-muted">{getVerificationLabel(user.verificationStatus)}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between gap-4 text-sm">
                <span className="text-white/55">Profile completion</span>
                <span>{user.profileCompletion}%</span>
              </div>
              <ProgressBar value={user.profileCompletion} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-xini-green/10 text-xini-mint">
                <Wallet size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium">Wallet connection</h3>
                <p className="text-sm xini-muted">Ownership-ready placeholder.</p>
              </div>
            </div>

            {user.walletAddress ? (
              <div className="mt-5 space-y-4">
                <div className="break-all rounded-2xl bg-white/[0.045] p-4 text-sm">{user.walletAddress}</div>
                <Button variant="secondary" onClick={disconnectWallet}>Disconnect wallet</Button>
              </div>
            ) : (
              <Button className="mt-5 w-full" onClick={connectWallet}>
                <Wallet size={17} />
                Connect wallet
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
