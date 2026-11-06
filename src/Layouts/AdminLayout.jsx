import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import AdminSidebar from "../Components/AdminSidebar";
import style from "../Styles/dashboardLayout.module.css";

function AdminLayout() {
  return (
    <div>
      <Navbar role="admin" />

      <div className={style.dashboardLayout}>
        <AdminSidebar />

        <main className={style.dashboardContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
