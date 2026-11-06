import React from "react";
import Sidebar from "../Components/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
        <Sidebar role="admin" />

      <main>
        <h2>Admin Dashboard</h2>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
