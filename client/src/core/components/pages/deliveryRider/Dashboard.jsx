import React, { useState } from "react";
import AdminSidebar from "../../organisms/Partners/Sidebar";
import { Routes, Route } from "react-router-dom";
import Orders from "./Orders";
import OrderStartPage from "./OrderStartPage";
import Overview from "./Overview";

const RiderDashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div>
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <Routes>
        <Route
          path="/"
          element={<Overview isSidebarCollapsed={isSidebarCollapsed} />}
        />
        <Route
          path="/orders"
          element={<Orders isSidebarCollapsed={isSidebarCollapsed} />}
        />
        <Route
          path="/orders/start"
          element={<OrderStartPage isSidebarCollapsed={isSidebarCollapsed} />}
        />
      </Routes>
    </div>
  );
};

export default RiderDashboard;

//              <Route path="/orders" element={<Orders />} />
//<Route path="/orders/start" element={<OrderStartPage />} />
