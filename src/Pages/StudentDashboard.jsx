import React from "react";

const StudentDashboard = () => {
  return (
    <div>
      <Sidebar role="student" />
      <main>
        <h2>Student Dashboard</h2>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;
