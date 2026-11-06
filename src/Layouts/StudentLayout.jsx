import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import StudentSidebar from "../Components/StudentSidebar";
import style from "../Styles/dashboardLayout.module.css";
import AddDrive from "../Pages/AddDrive";

function StudentLayout() {
  return (
    <div>
      <Navbar role="student" />

      <div className={style.dashboardLayout}>
        <StudentSidebar />

        <main className={style.dashboardContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
