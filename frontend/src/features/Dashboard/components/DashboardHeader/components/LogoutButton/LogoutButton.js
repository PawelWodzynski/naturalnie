import { useNavigate } from "react-router-dom";

export const useLogoutButtonLogic = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Use navigate for client-side routing without full page reload
    navigate("/"); 
  };

  return {
    handleLogout,
  };
};

