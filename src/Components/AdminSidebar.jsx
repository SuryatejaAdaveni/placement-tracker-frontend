import React from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/sidebar.module.css";

function AdminSidebar() {
  const links = [
    {
      name: "Manage Students",
      path: "/admin/dashboard/managestudents",
      icon: "👨‍🎓",
    },
    {
      name: "Manage Drives",
      path: "/admin/dashboard/managedrives",
      icon: "💼",
    },
    {
      name: "Manage Mock Rating",
      path: "/admin/dashboard/managemockrating",
      icon: "📄",
    },
    {
      name: "Applications Requests",
      path: "/admin/dashboard/applicationsrequests",
      icon: "📋",
    },
  ];

  return (
    <aside className={style.sidebar}>
      <h3>Admin Panel</h3>

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

export default AdminSidebar;
