import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from '@/lib/ThemeContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import SectionPage from '@/pages/SectionPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import StageDetail from '@/pages/StageDetail';
import Departments from '@/pages/Departments';
import DealScenarios from '@/pages/DealScenarios';
import ScenarioDetail from '@/pages/ScenarioDetail';
import Glossary from '@/pages/Glossary';
import DepartmentDetail from '@/pages/DepartmentDetail';
import Documents from '@/pages/Documents';
import Systems from '@/pages/Systems';
import Controls from '@/pages/Controls';
import Locations from '@/pages/Locations';
import Roles from '@/pages/Roles';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sourcing" element={<SectionPage sectionId="sourcing" />} />
          <Route path="/transport" element={<SectionPage sectionId="transport" />} />
          <Route path="/receiving" element={<SectionPage sectionId="receiving" />} />
          <Route path="/reconditioning" element={<SectionPage sectionId="reconditioning" />} />
          <Route path="/inventory" element={<SectionPage sectionId="inventory" />} />
          <Route path="/auction" element={<SectionPage sectionId="auction" />} />
          <Route path="/sales" element={<SectionPage sectionId="sales" />} />
          <Route path="/collections" element={<SectionPage sectionId="collections" />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/onboarding" element={<SectionPage sectionId="onboarding" />} />
          <Route path="/stages/:number" element={<StageDetail />} />
          <Route path="/deal-scenarios" element={<DealScenarios />} />
          <Route path="/deal-scenarios/:code" element={<ScenarioDetail />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/systems" element={<Systems />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/roles" element={<Roles />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App