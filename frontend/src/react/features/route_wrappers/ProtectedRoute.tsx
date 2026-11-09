import { Navigate, Outlet } from "react-router";
import useAuth from "../../contexts/AuthProvider.tsx";
import links from "../../config/navigation_links.tsx";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={links.auth.login} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
