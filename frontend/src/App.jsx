import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import FrameDetail from './pages/FrameDetail';
import BookingFlow from './pages/BookingFlow';
import BookingSuccess from './pages/BookingSuccess';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  return <BusinessDashboard />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardRouter />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/frame/:id" element={
            <ProtectedRoute>
              <Layout>
                <FrameDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/book/:id" element={
            <ProtectedRoute>
              <Layout>
                <BookingFlow />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/booking-success" element={
            <ProtectedRoute>
              <Layout>
                <BookingSuccess />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
