import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginButton.module.css";

const LoginButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {

  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard")
  }else{
    navigate("/login-page");
  }

  };

  return (
    <button onClick={handleClick} className={styles.loginButton}>
      Login
    </button>
  );
};

export default LoginButton;

