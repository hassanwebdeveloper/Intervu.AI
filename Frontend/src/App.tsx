
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import { ThemeProvider } from "./components/providers/ThemeProvider";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewResults from "./pages/InterviewResults";
import ScheduledInterviews from "./pages/ScheduledInterviews";
import InterviewParticipant from "./pages/InterviewParticipant";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Auth guard component
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <InterviewProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/interview/:id" element={<InterviewParticipant />} />
                
                {/* Protected routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/interviews/new" element={
                    <ProtectedRoute>
                      <CreateInterview />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/interviews/scheduled" element={
                    <ProtectedRoute>
                      <ScheduledInterviews />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/interviews/results" element={
                    <ProtectedRoute>
                      <InterviewResults />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/interviews/:id" element={
                    <ProtectedRoute>
                      <InterviewDetail />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
