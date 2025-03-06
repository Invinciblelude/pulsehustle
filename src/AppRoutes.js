import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import LoginModal from './components/LoginModal';
import useAuth from './hooks/useAuth';

// Lazy load page components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Save intended destination for redirect after login
      sessionStorage.setItem('authRedirectTo', window.location.pathname);
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Loading fallback for lazy-loaded components
const PageLoading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
    Loading...
  </Box>
);

/**
 * Application Routes
 * Defines all the routes for the application
 */
const AppRoutes = () => {
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <React.Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gigs/create" 
              element={
                <ProtectedRoute>
                  <div>Create Gig Page</div>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </Router>
    </ChakraProvider>
  );
};

export default AppRoutes; 