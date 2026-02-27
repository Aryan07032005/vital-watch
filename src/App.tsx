import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ThresholdSettings from "./pages/ThresholdSettings";
import AlertsPage from "./pages/AlertsPage";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Redirect root based on role */}
      <Route path="/" element={
        <Navigate to={`/${user!.role}/dashboard`} replace />
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/thresholds" element={<ThresholdSettings />} />
      <Route path="/admin/alerts" element={<AlertsPage />} />

      {/* Doctor routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/patients" element={<DoctorDashboard />} />
      <Route path="/doctor/alerts" element={<AlertsPage />} />

      {/* Patient routes */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/alerts" element={<AlertsPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
