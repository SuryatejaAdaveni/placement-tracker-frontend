import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/axiosInstance";
import { toast } from "react-toastify";
import style from "../Styles/notifications.module.css";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleView = async (id) => {
    try {
      const studentId = sessionStorage.getItem("studentId");
      const role = sessionStorage.getItem("role");

      const endpoint =
        role === "ADMIN"
          ? `/api/admin/notifications/updateview/${id}`
          : `/api/student/notifications/updateview/${id}`;

      await axiosInstance.put(endpoint, null, {
        params: { studentId },
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, viewed: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to mark notification as viewed");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.viewed) {
      await handleView(notification.id);
    }

    if (notification.notificationType === "DRIVE") {
      navigate("/student/dashboard/drives");
    } else if (notification.notificationType === "STATUS_UPDATE") {
      navigate("/student/dashboard/myapplications");
    } else if (
      notification.notificationType === "APPLICATION" &&
      notification.role === "ADMIN"
    ) {
      navigate("/admin/dashboard/applicationsrequests");
    } else if (notification.notificationType === "APPLICATION") {
      navigate("/student/dashboard/myapplications");
    } else if (notification.notificationType === "REGISTRATION") {
      navigate("/admin/dashboard/managestudents");
    }
  };

  const handleRemoveNotification = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/notifications/delete/${id}`);
      toast.success("Notification Removed Successfully..");
      fetchNotifications();
    } catch (error) {
      toast.error("Error while Removing the Notification.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.viewed,
  ).length;

  return (
    <div className={style.notificationPage}>
      <div className={style.pageHeader}>
        <h2>Notifications</h2>
        <p>You have {unreadCount} unread notifications</p>
      </div>

      {loading ? (
        <p>Loading your notifications...</p>
      ) : notifications.length === 0 ? (
        <div className={style.emptyState}>
          <h3>No Notifications Yet</h3>
          <p>You haven't received any notifications.</p>
        </div>
      ) : (
        <div className={style.notificationList}>
          {notifications.map((notification) => (
            <div
              className={`${style.notification} ${
                !notification.viewed ? style.unread : ""
              }`}
              key={notification.id}
              onClick={() => {
                if (!notification.viewed) {
                  handleView(notification.id);
                }
                handleNotificationClick(notification);
              }}
            >
              <div className={style.titlewithcross}>
                <h3>{notification.title}</h3>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNotification(notification.id);
                  }}
                >
                  X
                </p>
              </div>

              <p>{notification.message}</p>

              <span>{notification.viewed ? "Viewed" : "Unread"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
