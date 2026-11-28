import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Bu sayfaya erişim icin ADMIN yetkisi gereklidir.
        </div>
      </div>
    );
  }

  return children;
}
