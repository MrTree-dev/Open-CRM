import { useAuth } from "../../features/auth/context/AuthContext";
import { logout } from "../../firebase/auth";

export const DashboardPage = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <h1>Hello {user?.displayName}</h1>
      <button onClick={handleLogout}>Вийти</button>
    </>
  );
};
