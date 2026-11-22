import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export const GuestLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Завантаження...</p>;

  return user ? (
    <Navigate
      to="/dashboard"
      replace
    />
  ) : (
    <Outlet />
  );
};
