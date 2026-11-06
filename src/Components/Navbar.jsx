import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import style from "../Styles/navbar.module.css";

function Navbar({ role, isAuthenticated }) {
  const navigate = useNavigate();

  // Role-based paths
  const homePath = "/home";

  // const dashboardPath =
  //   role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  // const notificationPath =
  //   role === "admin" ? "/admin/notifications" : "/student/notifications";

  // const profilePath = role === "admin" ? "/admin/profile" : "/student/profile";

  // Student

  // const dashboardPath = "/student/dashboard";

  const notificationPath = "/student/dashboard/notifications";

  const profilePath = "/student/dashboard/profile";

  // admin

  const dashboardPath = "/admin/dashboard";

  // const notificationPath = "/admin/dasboard/notifications";

  // const profilePath = "/admin/profile";

  // Navigation links
  const links = [
    {
      name: "Home",
      path: homePath,
    },
    {
      name: "Dashboard",
      path: dashboardPath,
    },
    {
      name: "Notifications",
      path: notificationPath,
    },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className={style.navbar}>
      {/* Logo */}
      <Link to={homePath} className={style.logo}>
        Placement<span>Tracker</span>
      </Link>

      {/* Main Navigation */}
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

      {/* Profile and Authentication */}
      <div className={style.navButtons}>
        {isAuthenticated ? (
          <>
            <NavLink
              to={profilePath}
              className={({ isActive }) =>
                isActive ? style.activeLink : style.profileLink
              }
            >
              Profile
            </NavLink>

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
