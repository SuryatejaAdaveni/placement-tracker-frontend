import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/sidebar.module.css";
import axiosInstance from "../Api/axiosInstance";

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
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const role = sessionStorage.getItem("role");
      const studentId = sessionStorage.getItem("studentId");

      const endpoint =
        role === "ADMIN"
          ? `/api/admin/notifications`
          : `/api/student/notifications/${studentId}`;
      const response = await axiosInstance.get(endpoint);

      setNotifications(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.viewed,
  ).length;

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
            <span>{link.name == "Notifications" ? unreadCount : ""}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default StudentSidebar;
