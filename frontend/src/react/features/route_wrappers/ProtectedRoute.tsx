import { Navigate, Outlet } from "react-router";
import useAuth from "../../contexts/AuthProvider.tsx";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
