import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy loaded components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

import axiosInstance from './utils/axiosConfig';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, setUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Hit the logout endpoint to clear the HTTP-only cookies
      if (user?.role === 'teacher' || user?.role === 'admin') {
        await axiosInstance.post('/faculty/logout');
      } else {
        await axiosInstance.post('/students/logout');
      }
    } catch (e) {
      console.error('Logout error', e);
    }
    useAuthStore.getState().logout();
  };

  // Generic loading fallback
  const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Header user={user} onLogout={handleLogout} />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage user={user} />} />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route
                  path="/student-dashboard"
                  element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/teacher-dashboard"
                  element={(user?.role === 'teacher' || user?.role === 'admin') ? <TeacherDashboard user={user} /> : <Navigate to="/login" />}
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
