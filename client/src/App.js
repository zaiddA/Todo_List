import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TodoList from "./pages/TodoList";
import UserList from "./pages/UserList";
import AdminTodoList from "./pages/AdminTodoList";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.role === 0;

  // If trying to access admin routes without admin privileges, redirect to appropriate page
  if (isAuthenticated && !isAdmin && location.pathname.startsWith("/admin")) {
    return <Navigate to="/todos" replace />;
  }

  // If accessing /client, redirect based on role
  if (location.pathname === "/client") {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/todos"} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              {isAdmin ? (
                <>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserList />} />
                  <Route path="/admin/todos" element={<AdminTodoList />} />
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                </>
              ) : (
                <>
                  {/* Client Routes */}
                  <Route path="/todos" element={<TodoList />} />
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/todos" replace />}
                  />
                </>
              )}

              {/* Handle /client route */}
              <Route
                path="/client"
                element={
                  <Navigate
                    to={isAdmin ? "/admin/dashboard" : "/todos"}
                    replace
                  />
                }
              />
            </>
          )}

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/">
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
