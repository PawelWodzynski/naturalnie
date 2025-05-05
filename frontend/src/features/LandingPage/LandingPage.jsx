import React from "react";
import styles from "./LandingPage.module.css";
import LoginButton from "./components/LoginButton"; // Placeholder for the button component

const LandingPage = () => {
  return (
    <div className={styles.landingPageContainer}>
      <header className={styles.header}>
        <LoginButton />
      </header>
      {/* Main content area can be added here if needed later */}
    </div>
  );
};

export default LandingPage;

