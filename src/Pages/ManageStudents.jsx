import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import style from "../Styles/manageStudents.module.css";
import axiosInstance from "../Api/axiosInstance";

// const API_URL = "http://localhost:8080/admin/managestudents";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  // const [students, setStudents] = useState([
  //   {
  //     id: 1,
  //     studentId: "STU12345678",
  //     name: "Rahul Kumar",
  //     email: "rahul@gmail.com",
  //     phone: "9876543210",
  //     branch: "CSE",
  //     cgpa: 8.5,
  //     graduationYear: 2026,
  //     collegeName: "ABC Engineering College",
  //     backlogs: 0,
  //     verified: false,

  //     studentAcademicDetails: {
  //       id: 101,
  //       cgpa: 8.5,
  //       collegeName: "Bharath University",
  //       location: "Chennai",
  //       backlogs: 0,
  //       tenthPercentage: 92.5,
  //       twelthPrecentage: 89.5,
  //       course: "B.Tech",
  //       branch: "Computer Science and Engineering",
  //       graduationYear: 2026,
  //     },
  //   },
  // ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/managestudents");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    console.log(students);
  }, []);

  const branches = [
    "All",
    ...new Set(students.map((student) => student.branch).filter(Boolean)),
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        student.name?.toLowerCase().includes(searchValue) ||
        student.email?.toLowerCase().includes(searchValue);

      const matchesBranch =
        branchFilter === "All" || student.branch === branchFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Verified" && student.verified === true) ||
        (statusFilter === "Pending" && student.verified !== true);

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [students, search, branchFilter, statusFilter]);

  const handleVerify = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/managestudents/verify/${id}`);

      setStudents((prev) =>
        prev.map((student) =>
          student.id === id ? { ...student, verified: true } : student,
        ),
      );

      toast.success("Student verified successfully");
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Unable to verify student");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student?",
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/admin/managestudents/delete/${id}`);

      setStudents((prev) => prev.filter((student) => student.id !== id));

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }

      toast.success("Student removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to remove student");
    }
  };

  const totalStudents = students.length;

  const verifiedStudents = students.filter(
    (student) => student.verified === true,
  ).length;

  const pendingStudents = totalStudents - verifiedStudents;

  return (
    <div className={style.manageStudents}>
      {/* Page Header */}
      <div className={style.pageHeader}>
        <div>
          <h2>Manage Students</h2>
          <p>View, verify and manage registered students.</p>
        </div>

        <button className={style.refreshBtn} onClick={fetchStudents}>
          ↻ Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statIcon}>👨‍🎓</div>
          <div>
            <p>Total Students</p>
            <h3>{totalStudents}</h3>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIcon}>✓</div>
          <div>
            <p>Verified Students</p>
            <h3>{verifiedStudents}</h3>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIcon}>⌛</div>
          <div>
            <p>Pending Verification</p>
            <h3>{pendingStudents}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={style.filterSection}>
        <div className={style.searchBox}>
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch === "All" ? "All Branches" : branch}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Students Table */}
      <div className={style.tableContainer}>
        {loading ? (
          <p className={style.message}>Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <div className={style.emptyMessage}>
            <h3>No Students Found</h3>
            <p>There are no students matching your search or filters.</p>
          </div>
        ) : (
          <table className={style.studentTable}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Graduation Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>
                    <div className={style.studentInfo}>
                      <div className={style.avatar}>
                        {student.name?.charAt(0).toUpperCase() || "S"}
                      </div>

                      <strong>{student.name}</strong>
                    </div>
                  </td>

                  <td>{student.email}</td>
                  <td>{student.branch || "-"}</td>
                  <td>{student.cgpa ?? "-"}</td>
                  <td>{student.graduationYear ?? "-"}</td>

                  <td>
                    <span
                      className={
                        student.verified ? style.verified : style.pending
                      }
                    >
                      {student.verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  <td>
                    <div className={style.actions}>
                      <button
                        className={style.viewBtn}
                        onClick={() => setSelectedStudent(student)}
                      >
                        View
                      </button>

                      {!student.verified && (
                        <button
                          className={style.verifyBtn}
                          onClick={() => handleVerify(student.studentId)}
                        >
                          Verify
                        </button>
                      )}

                      <button
                        className={style.deleteBtn}
                        onClick={() => handleDelete(student.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className={style.resultCount}>
        Showing {filteredStudents.length} of {totalStudents} students
      </p>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          className={style.modalOverlay}
          onClick={() => setSelectedStudent(null)}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>Student Details</h3>

              <button onClick={() => setSelectedStudent(null)}>×</button>
            </div>

            <div className={style.modalBody}>
              <div className={style.modalAvatar}>
                {selectedStudent.name?.charAt(0).toUpperCase() || "S"}
              </div>

              <h3>{selectedStudent.name}</h3>
              <p>{selectedStudent.email}</p>

              <div className={style.detailsGrid}>
                <div>
                  <span>Branch</span>
                  <strong>{selectedStudent.branch || "-"}</strong>
                </div>

                <div>
                  <span>CGPA</span>
                  <strong>{selectedStudent.cgpa ?? "-"}</strong>
                </div>

                <div>
                  <span>Graduation Year</span>
                  <strong>{selectedStudent.graduationYear ?? "-"}</strong>
                </div>

                <div>
                  <span>Verification</span>
                  <strong>
                    {selectedStudent.verified ? "Verified" : "Pending"}
                  </strong>
                </div>
              </div>
            </div>

            <button
              className={style.closeBtn}
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
