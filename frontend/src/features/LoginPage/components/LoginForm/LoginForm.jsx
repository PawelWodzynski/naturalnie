import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";

// Import subcomponents
import FormHeader from "./components/FormHeader";
import ErrorMessage from "./components/ErrorMessage";
import UsernameField from "./components/UsernameField";
import PasswordField from "./components/PasswordField";
import LoginButton from "./components/LoginButton";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Użyj fetch zamiast axios, z pełnym URL
      const response = await fetch("http://localhost:8080/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          login,
          password
        })
      });

      // Sprawdź status odpowiedzi
      if (!response.ok) {
        // Spróbuj odczytać szczegóły błędu jeśli serwer je zwrócił
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Błąd logowania (status: ${response.status})`
        );
      }

      // Przekształć odpowiedź na JSON
      const data = await response.json();
      console.log("Login response:", data);

      // Zapisz token w localStorage
      const { token } = data;
      if (!token) {
        throw new Error("Otrzymano nieprawidłową odpowiedź - brak tokenu");
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        setError("Błąd sieci. Sprawdź połączenie internetowe.");
      } else if (error.name === 'SyntaxError') {
        setError("Otrzymano nieprawidłową odpowiedź z serwera.");
      } else {
        setError(error.message || "Nieprawidłowy login lub hasło");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginForm}>
      <FormHeader title="Logowanie" />
      <ErrorMessage message={error} />
      <UsernameField 
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <PasswordField 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoginButton type="submit">
        Zaloguj się
      </LoginButton>
    </form>
  );
};

export default LoginForm;