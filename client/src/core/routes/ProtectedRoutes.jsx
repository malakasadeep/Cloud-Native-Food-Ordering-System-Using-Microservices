import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }


  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "restaurant_owner") {
      return <Navigate to="/restaurant" replace />;
    } else if (user.role === "delivery_rider") {
      return <Navigate to="/delivery" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
