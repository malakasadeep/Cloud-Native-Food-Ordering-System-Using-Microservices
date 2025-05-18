import React, { useState } from "react";
import AdminSidebar from "../../organisms/Partners/Sidebar";
import { Routes, Route } from "react-router-dom";

const RiderDashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div>
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <Routes></Routes>
    </div>
  );
};

export default RiderDashboard;

//              <Route path="/orders" element={<Orders />} />
//<Route path="/orders/start" element={<OrderStartPage />} />
