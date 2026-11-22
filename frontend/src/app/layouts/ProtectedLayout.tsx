import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export const ProtectedLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Завантаження...</p>;

  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/"
      replace
    />
  );
};
