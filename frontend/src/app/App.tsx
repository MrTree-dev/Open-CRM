import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage/AuthPage";
import { GuestLayout } from "./layouts/GuestLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";

// Test comment

export const App = () => {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route
          path="/"
          element={<AuthPage />}
        />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};
