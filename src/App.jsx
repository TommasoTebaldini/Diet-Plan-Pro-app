import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DietitianApp from './pages/DietitianApp';
import PatientApp from './pages/patient/PatientApp';

function AppRoutes() {
  const { session } = useAuth();

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (session.role === 'dietitian') {
    return (
      <Routes>
        <Route path="/dietitian/*" element={<DietitianApp />} />
        <Route path="*" element={<Navigate to="/dietitian" replace />} />
      </Routes>
    );
  }

  if (session.role === 'patient') {
    return (
      <Routes>
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="*" element={<Navigate to="/patient" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
