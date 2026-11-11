import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import style from "../Styles/managedrives.module.css";
import axiosInstance from "../Api/axiosInstance";

// const API_URL = "http://localhost:8080/admin/dashboard/managedrives";

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDrives = async () => {
    try {
      const response = await axiosInstance.get("/api/drives");
      setDrives(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load placement drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/admin/dashboard/managedrives/updatedrive/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this placement drive?",
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/drives/delete/${id}`);

      setDrives((prev) => prev.filter((drive) => drive.id !== id));

      toast.success("Placement drive removed successfully");
      fetchDrives();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove placement drive");
    }
  };
  

  return (
    <div className={style.manageDrives}>
      <div className={style.pageHeader}>
        <div>
          <h2>Manage Placement Drives</h2>
          <p>View, update and remove placement opportunities.</p>
        </div>

        <Link
          to="/admin/dashboard/managedrives/adddrive"
          className={style.addDriveBtn}
        >
          + Add Drive
        </Link>
      </div>

      {loading ? (
        <p className={style.loadingText}>Loading placement drives...</p>
      ) : drives.length === 0 ? (
        <div className={style.emptyMessage}>
          <h3>No Placement Drives Found</h3>
          <p>Create your first placement drive using Add Drive.</p>
        </div>
      ) : (
        <>
          <p className={style.driveCount}>Total Drives: {drives.length}</p>

          <div className={style.driveGrid}>
            {drives.map((drive) => (
              <div className={style.driveCard} key={drive.jobId}>
                <div className={style.cardHeader}>
                  <div>
                    <h3>{drive.companyName}</h3>
                    <span>{drive.jobId}</span>
                  </div>

                  <span className={style.salary}>₹{drive.salary} LPA</span>
                </div>

                <div className={style.cardBody}>
                  <p>
                    <strong>Job Role:</strong> {drive.jobRole}
                  </p>

                  <p>
                    <strong>Deadline:</strong> {drive.applicationDate}
                  </p>

                  <p>
                    <strong>Eligible Branches:</strong>
                  </p>

                  <div className={style.branchList}>
                    {drive.eligibleBranches?.map((branch) => (
                      <span key={branch}>{branch}</span>
                    ))}
                  </div>

                  <p className={style.description}>{drive.jobDescription}</p>

                  <div className={style.driveActions}>
                    <button
                      className={style.updateBtn}
                      onClick={() => handleUpdate(drive.jobId)}
                    >
                      Update Drive
                    </button>

                    <button
                      className={style.removeBtn}
                      onClick={() => handleDelete(drive.jobId)}
                    >
                      Remove Drive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDrives;
