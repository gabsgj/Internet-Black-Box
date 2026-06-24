import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDashboardStore } from './store/useDashboardStore';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { IncidentList } from './pages/IncidentList';
import { IncidentDetail } from './pages/IncidentDetail';

// Protected Route Guard checking if active operator session exists
const ProtectedRoute = () => {
  const currentUser = useDashboardStore(state => state.currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

// Layout wrapping dashboard routes to include the collapsible sidebar navigation
const DashboardLayout = () => {
  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 font-sans w-full">
      <Sidebar />
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard Pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incidents" element={<IncidentList />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
