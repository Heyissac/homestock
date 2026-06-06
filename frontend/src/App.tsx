import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { isAuthenticated } from './features/auth/services/auth.service';
import { SpacesPage } from './features/spaces/components/SpacesPage';
import { ProductsPage } from './features/inventory/components/ProductsPage';

function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  function handleSuccess() {
    navigate('/spaces');
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
          path="/spaces"
          element={
            <ProtectedRoute>
              <SpacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spaces/:spaceId/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;