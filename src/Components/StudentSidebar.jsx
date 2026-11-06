import React from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/sidebar.module.css";

function StudentSidebar() {
  const links = [
    {
      name: "My Applications",
      path: "/student/dashboard/myapplications",
      icon: "📋",
    },
    {
      name: "Drives",
      path: "/student/dashboard/drives",
      icon: "🏢",
    },
    {
      name: "Profile",
      path: "/student/dashboard/profile",
      icon: "👤",
    },
    {
      name: "Notifications",
      path: "/student/dashboard/notifications",
      icon: "🔔",
    },
    {
      name: "Reports & Analytics",
      path: "/student/dashboard/reports",
      icon: "📈",
    },
  ];

  return (
    <aside className={style.sidebar}>
      <h3>Student Panel</h3>

      <div className={style.sidebarLinks}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? style.activeSidebarLink : style.sidebarLink
            }
          >
            <span>{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default StudentSidebar;
