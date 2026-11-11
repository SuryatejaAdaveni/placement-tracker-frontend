import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import style from "../Styles/navbar.module.css";
import { toast } from "react-toastify";

function Navbar({ role }) {
  const navigate = useNavigate();

  const isAuthenticated = !!sessionStorage.getItem("studentId");

  // Role-based paths
  const homePath = "/home";

  const dashboardPath =
    role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const notificationPath =
    role === "admin"
      ? "/admin/notifications"
      : "/student/dashboard/notifications";

  const profilePath =
    role === "admin" ? "/admin/profile" : "/student/dashboard/profile";

  const links = [
    { name: "Home", path: homePath },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", path: dashboardPath },
          { name: "Notifications", path: notificationPath },
        ]
      : []),
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  return (
    <nav className={style.navbar}>
      <Link to={homePath} className={style.logo}>
        Placement<span>Tracker</span>
      </Link>

      <div className={style.navLinks}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? style.activeLink : style.navLink
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className={style.navButtons}>
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className={style.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className={style.loginBtn}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
