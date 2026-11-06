import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const isAdmin = role === "admin";

  const basePath = isAdmin ? "/admindashboard" : "/studentdashboard";

  return (
    <aside className="sidebar">
      <h3>{isAdmin ? "Admin Panel" : "Student Panel"}</h3>

      {/* Common Home link */}
      <Link to={`${basePath}/home`}>Home</Link>

      {isAdmin ? (
        <>
          <Link to="/admin/dashboard">Admin Dashboard</Link>

          <Link to="/admin/applicationsrequests">Applications Requests</Link>

          <Link to="/admin/managestudents">Manage Students</Link>
        </>
      ) : (
        <>
          <Link to="/student/dashboard">Student Dashboard</Link>

          <Link to="/student/myapplications">My Applications</Link>

          <Link to="/student/drives">Drives</Link>
          <Link to="student/profile">Profile</Link>
        </>
      )}
      <hr />

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
