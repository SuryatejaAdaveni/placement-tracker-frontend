import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./Components/Home";
import StudentLayout from "./Layouts/StudentLayout";
import AdminLayout from "./Layouts/AdminLayout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AcademicRegister from "./Pages/AcademicRegister";
import MyApplications from "./Pages/MyApplications";
import Reports from "./Pages/Reports";
import Drives from "./Pages/Drives";
import Profile from "./Pages/Profile";
import ApplicationsRequests from "./Pages/ApplicationsRequests";
import ManageStudents from "./Pages/ManageStudents";
import ManageMockRating from "./Pages/ManageMockRating";
import ManageDrives from "./Pages/ManageDrives";
import Notifications from "./Pages/Notifications";
import AddDrive from "./Pages/AddDrive";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register/personaldetails" element={<Register />} />

          <Route
            path="/register/academicdetails"
            element={<AcademicRegister />}
          />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentLayout />}>
            <Route path="myapplications" element={<MyApplications />} />

            <Route path="drives" element={<Drives />} />

            <Route path="profile" element={<Profile />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route
              path="applicationsrequests"
              element={<ApplicationsRequests />}
            />
            <Route path="managestudents" element={<ManageStudents />} />

            <Route path="managemockrating" element={<ManageMockRating />} />

            <Route path="managedrives" element={<ManageDrives />} />
            <Route path="managedrives/adddrive" element={<AddDrive />} />
            <Route path="managedrives/updatedrive/:id" element={<AddDrive />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
