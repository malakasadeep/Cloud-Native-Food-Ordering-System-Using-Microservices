import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import CusAuthPage from "../../features/customerAuth/components/CusAuthPage";
import HomePage from "../components/pages/HomePage";
import LoginPage from "../../features/partnersManagement/components/LoginPage";
import AdminPage from "../components/pages/AdminPage";
import RegistrationPage from "../../features/partnersManagement/components/RegistrationPage";

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
    </Routes>
  );
}

export default AppRoutes;
