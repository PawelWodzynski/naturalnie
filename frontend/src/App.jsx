import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./features/LandingPage"; // Import the new Landing Page
import LoginPage from "./features/LoginPage"; // Re-add LoginPage import
import Dashboard from "./features/Dashboard";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login-page" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        {/* Update root path to show LandingPage */}
      </Routes>
    </Router>
  );
}

export default App;

