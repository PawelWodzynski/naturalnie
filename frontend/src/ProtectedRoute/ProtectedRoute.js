import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      console.log("ProtectedRoute - Token from localStorage:", token);

      if (!token) {
        console.log("ProtectedRoute - No token found, setting unauthenticated.");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log(`ProtectedRoute - Validating token: ${token}`);
        
        // Użyj fetch API z pełnym URL - podobnie jak w curl
        const encodedToken = encodeURIComponent(token);
        const response = await fetch(`http://localhost:8080/validate-token?token=${encodedToken}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        // Sprawdź status odpowiedzi
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        // Przekształć odpowiedź na JSON
        const data = await response.json();
        console.log("ProtectedRoute - Validation response:", data);

        // Sprawdź wynik walidacji
        if (data && data.tokenValidity === true) {
          console.log("ProtectedRoute - Token is valid, setting authenticated. Roles:", data.roles);
          
          // Zapisz role użytkownika do localStorage, jeśli są dostępne
          if (data.roles && Array.isArray(data.roles)) {
            localStorage.setItem("userRoles", JSON.stringify(data.roles));
          }
          
          setIsAuthenticated(true);
        } else {
          console.log("ProtectedRoute - Token is invalid, setting unauthenticated.");
          localStorage.removeItem("token");
          localStorage.removeItem("userRoles");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("ProtectedRoute - Error validating token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRoles");
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    validateToken();
  }, []);

  if (isLoading) {
    console.log("ProtectedRoute - Loading...");
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    console.log("ProtectedRoute - User not authenticated, redirecting to login.");
    return <Navigate to="/login-page" replace />;
  }

  if (isAuthenticated === true) {
    console.log("ProtectedRoute - User authenticated, rendering element.");
    return element;
  }

  console.log("ProtectedRoute - Fallback, redirecting to login.");
  return <Navigate to="/login-page" replace />;
};

export default ProtectedRoute;