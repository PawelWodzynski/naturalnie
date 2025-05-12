import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css"; 
import LoginHeader from "./components/LoginHeader"; 
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterSection from "./components/Register/RegisterSection"; 

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Sprawdź autentykację przy montowaniu komponentu
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = token !== null;
    
    if (isAuthenticated) {
      navigate("/sklep");
    }
  }, [navigate]); // Dodaj navigate jako zależność useEffect

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <LoginHeader />
        <LoginForm />
        <RegisterSection />
      </div>
    </div>
  );
};

export default LoginPage;