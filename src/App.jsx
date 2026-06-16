import { AuthProvider } from "./modules/auth/store/AuthContext";
import AppRoutes from "./app/AppRoutes";
import Toast from "./shared/components/layout/Toast";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toast />
    </AuthProvider>
  );
}
