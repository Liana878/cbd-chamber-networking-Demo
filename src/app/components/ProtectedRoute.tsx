import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStaff?: boolean;
}

export function ProtectedRoute({ children, requireStaff = false }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireStaff && userRole !== "staff") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
