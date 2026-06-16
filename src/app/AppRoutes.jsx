import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../modules/auth/pages/Login";
import Register from "../modules/auth/pages/Register";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import GuestRoute from "../routes/GuestRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import AppLayout from "../shared/components/layout/AppLayout";
import PublicStreamingLayout from "../shared/components/layout/PublicStreamingLayout";
import Dashboard from "./Dashboard";
import Profile from "../modules/account/pages/Profile";
import AdminUsers from "../modules/account/pages/AdminUsers";
import Projects from "../modules/lifecycle/pages/Projects";
import CreateProject from "../modules/lifecycle/pages/CreateProject";
import ProjectDetail from "../modules/lifecycle/pages/ProjectDetail";
import AdminReview from "../modules/lifecycle/pages/AdminReview";
import CreatorStudio from "../modules/creatorStudio/pages/CreatorStudio";
import StreamingHome from "../modules/streaming/pages/StreamingHome";
import ContentLibrary from "../modules/streaming/pages/ContentLibrary";
import ContentDetail from "../modules/streaming/pages/ContentDetail";
import WatchPlayer from "../modules/streaming/pages/WatchPlayer";
import MediaManagement from "../modules/streaming/pages/MediaManagement";
import DistributionMarketplace from "../modules/distribution/pages/DistributionMarketplace";
import DistributionProjectDetail from "../modules/distribution/pages/DistributionProjectDetail";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/streaming" replace />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<PublicStreamingLayout />}>
          <Route path="/streaming" element={<StreamingHome />} />
          <Route path="/streaming/library" element={<ContentLibrary />} />
          <Route path="/streaming/content/:id" element={<ContentDetail />} />
          <Route path="/watch/:id" element={<WatchPlayer />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["creator", "investor", "viewer", "admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/distribution" element={<DistributionMarketplace />} />
            <Route path="/distribution/projects/:id" element={<DistributionProjectDetail />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["creator", "admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/studio" element={<CreatorStudio />} />
            <Route path="/media/manage" element={<MediaManagement />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/review" element={<AdminReview />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
