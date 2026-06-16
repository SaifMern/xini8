import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/store/AuthContext";
import { getDashboardPath } from "../shared/utils/authHelpers";
export default function GuestRoute() {
  const { user, isSessionLoading } = useAuth();
  if (isSessionLoading) return <Loader text="Checking session..." />;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;
  return <Outlet />;
}
function Loader({ text }) { return <div className="xini-page grid min-h-screen place-items-center"><div className="text-center"><div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-xini-neon border-t-transparent" /><p className="mt-4 text-sm xini-muted">{text}</p></div></div>; }
