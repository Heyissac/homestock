import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { isAuthenticated } from './features/auth/services/auth.service';

function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  function handleSuccess() {
    navigate('/dashboard');
  }

  if (view === 'login') {
    return (
      <LoginForm
        onSuccess={handleSuccess}
        onSwitchToRegister={() => setView('register')}
      />
    );
  }

  return (
    <RegisterForm
      onSuccess={handleSuccess}
      onSwitchToLogin={() => setView('login')}
    />
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-2">Auth is working ✅</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;