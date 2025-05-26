import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import TaskForm from "./pages/TaskForm";
import TaskDetail from "./pages/TaskDetail";
// Note: Login and Register pages will be implemented by you
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import PrivateRoute from "./components/PrivateRoute";

import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ToastProvider from "./components/ToastProvider";
import AIAssistant from "./pages/AIAssistant";

// Context
// Note: AuthContext will be implemented by you
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Note: Wrap the entire application with AuthContext Provider */}
        <ToastProvider />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/task/new"
            element={
              <PrivateRoute>
                <TaskForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/task/edit/:id"
            element={
              <PrivateRoute>
                <TaskForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/task/:id"
            element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <AnalyticsDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <PrivateRoute>
                <AIAssistant />
              </PrivateRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
