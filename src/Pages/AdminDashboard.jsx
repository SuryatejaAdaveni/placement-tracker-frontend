import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";

const AdminDashboard = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(sessionStorage.getItem("role"));
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar role={role} />

      <main>
        <h2>{role === "ADMIN" ? "Admin Dashboard" : "Student Dashboard"}</h2>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
