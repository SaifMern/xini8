import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { createWalletAddress } from "../../../shared/utils/authHelpers";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => { authService.getSession().then((session) => { if (session?.user) setUser(session.user); }).finally(() => setIsSessionLoading(false)); }, []);
  const notify = (message, type = "success") => setToast({ message, type, id: Date.now() });
  const login = async (payload) => { const res = await authService.login(payload); setUser(res.user); notify(res.message); return res; };
  const register = async (payload) => { const res = await authService.register(payload); setUser(res.user); notify(res.message); return res; };
  const logout = async () => { const res = await authService.logout(); setUser(null); notify(res.message); return res; };
  const forgotPassword = async (email) => { const res = await authService.forgotPassword(email); notify(res.message); return res; };
  const updateProfile = async (payload) => { if (!user) return null; const res = await authService.updateProfile(user.id, payload); setUser(res.user); notify(res.message); return res; };
  const connectWallet = async () => { if (!user) return null; const res = await authService.connectWallet(user.id, createWalletAddress()); setUser(res.user); notify(res.message); return res; };
  const disconnectWallet = async () => { if (!user) return null; const res = await authService.disconnectWallet(user.id); setUser(res.user); notify(res.message); return res; };
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isSessionLoading, toast, setToast, login, register, logout, forgotPassword, updateProfile, connectWallet, disconnectWallet, notify }), [user, isSessionLoading, toast]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
