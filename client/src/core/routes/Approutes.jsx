import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import CusAuthPage from "../../features/customerAuth/components/CusAuthPage";
import HomePage from "../components/pages/HomePage";
import LoginPage from "../../features/partnersManagement/components/LoginPage";
import AdminPage from "../components/pages/AdminPage";
import RegistrationPage from "../../features/partnersManagement/components/RegistrationPage";
import RestaurantPage from "../components/pages/RestaurantPage";
// import CheckoutPage from '../components/pages/CheckoutPage';
import SuccessPage from "../components/pages/SuccessPage";
import OrderConfirmation from "../components/pages/OrderConfirmation";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customer-auth" element={<CusAuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Routes>
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
              <Route path="order/success" element={<SuccessPage />} />
              <Route
                path="order/confirmation"
                element={<OrderConfirmation />}
              />
            </Routes>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Routes>
              <Route path="/*" element={<AdminPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/*"
        element={
          <ProtectedRoute allowedRoles={["restaurant_owner"]}>
            <Routes>
              <Route path="/*" element={<RestaurantPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/*"
        element={
          <ProtectedRoute allowedRoles={["delivery_rider"]}>
            <Routes>
              <Route path="/*" element={<AdminPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
