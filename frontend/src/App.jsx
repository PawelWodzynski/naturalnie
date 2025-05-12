import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./features/LandingPage";
import LoginPage from "./features/LoginPage";
import Dashboard from "./features/Dashboard";
import ShopPage from "./features/ShopPage"; // Import the new ShopPage component
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login-page" element={<LoginPage />} />
        <Route
          path="/sklep"
          element={<ProtectedRoute element={<ShopPage />} />}
        />
        {/* Add the new protected route for ShopPage */}
        <Route
          path="/sklep"
          element={<ProtectedRoute element={<ShopPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

