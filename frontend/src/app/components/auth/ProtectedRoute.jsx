import { Navigate, Outlet } from "react-router";
import { useMockData } from "@/context/MockDataContext";

export function ProtectedRoute({ allowedRoles }) {
  const { currentUser } = useMockData();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their appropriate dashboard if they are logged in but wrong role
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Outlet />;
}
