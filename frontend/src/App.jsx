import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogPage from "./pages/LogPage";
import Profile from "./pages/Profile";
import PublicDashboard from "./pages/PublicDashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-bg-base p-6 text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <Toaster position="top-right" />
      <div key={location.pathname} className="animate-fadeIn">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public/:slug" element={<PublicDashboard />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log/:date" element={<ProtectedRoute><LogPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}
