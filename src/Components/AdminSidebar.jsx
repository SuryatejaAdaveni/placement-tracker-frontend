import React, { useEffect, useState } from "react";
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
    {
      name: "Notifications",
      path: "/admin/dashboard/Notifications",
      icon: "📋",
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
            <span>{link.name == "Notifications" ? unreadCount : ""}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;
