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
import OrderTrackingPage from "../components/pages/customer/OrderTrackingPage";
import Orders from "../components/pages/deliveryRider/Orders";
import OrderStartPage from "../components/pages/deliveryRider/OrderStartPage";
import RiderDashboard from "../components/pages/deliveryRider/Dashboard";
import Layout from "../components/pages/deliveryRider/layout";
import DashboardPage from "../components/pages/deliveryRider/Dashboard/page";
import CustomerOrders from "../components/pages/customer/CistomerOrders";
import ProfilePage from "../../features/customerProfile/components/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customer-auth" element={<CusAuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      {/* <Route path="/restaurants" element={<AllRestaurants />} /> */}

      {/* <Route
        path="/restaurant-details/:id"
        element={<RestaurantDetailsPage />}
      /> */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Routes>
              <Route path="/orders" element={<CustomerOrders />} />
              {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
              <Route path="order/success" element={<SuccessPage />} />
              <Route
                path="order/confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/profilee" element={<ProfilePage />} />
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
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/start" element={<OrderStartPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
