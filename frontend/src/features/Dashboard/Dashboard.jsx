import React from "react";
import styles from "./Dashboard.module.css";
import { useDashboardLogic } from "./Dashboard";

// Import Section Components
import DashboardHeader from "./components/DashboardHeader";
import TailwindSection from "./components/TailwindSection";
import RechartsSection from "./components/RechartsSection";
import ReactIconsSection from "./components/ReactIconsSection";
import I18nextSection from "./components/I18nextSection";
import AxiosSection from "./components/AxiosSection";
import ApiAuthorizationSection from "./components/ApiAuthorizationSection";

const Dashboard = () => {
  const {
    libraryStatus,
    apiAuthStatus,
    chartData,
    testApiAuthorization,
  } = useDashboardLogic();

  // Optional: Add a loading state based on library checks if needed
  const isLoadingChecks = Object.values(libraryStatus).some(status => status === null);

  return (
    // Restore Tailwind classes for dark theme and layout from original Dashboard.js
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 ${styles.dashboardContainer}`}>
      <DashboardHeader />

      {/* Add a loading indicator while checks run - Use Tailwind for styling */}
      {isLoadingChecks && (
        <div className="text-center py-4 text-gray-400">Checking library status...</div>
      )}

      {/* Render sections once checks are done - Use Tailwind for layout */}
      {!isLoadingChecks && (
        <main className={`max-w-4xl mx-auto space-y-6 ${styles.dashboardContent}`}> {/* Restore Tailwind layout & add module style */}
          <TailwindSection libraryStatus={libraryStatus.tailwind} />
          <RechartsSection 
            libraryStatus={libraryStatus.recharts} 
            chartData={chartData} 
          />
          <ReactIconsSection libraryStatus={libraryStatus.reactIcons} />
          <I18nextSection libraryStatus={libraryStatus.i18next} />
          <AxiosSection libraryStatus={libraryStatus.axios} />
          <ApiAuthorizationSection 
            apiAuthStatus={apiAuthStatus} 
            onTestApi={testApiAuthorization} 
          />
        </main>
      )}
    </div>
  );
};

export default Dashboard;

