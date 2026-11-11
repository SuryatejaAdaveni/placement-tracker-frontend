import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import style from "../Styles/managedrives.module.css";
import axiosInstance from "../Api/axiosInstance";

const StudentDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get(
        `api/applications/student/${sessionStorage.getItem("studentId")}`,
      );
      setApplications(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDrives = async () => {
    try {
      const response = await axiosInstance.get("/api/drives");

      const data = response.data;

      setDrives(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load placement drives");
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (jobId) => {
    return applications.some((application) => application.job?.jobId === jobId);
  };

  useEffect(() => {
    fetchDrives();
    fetchApplications();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      const response = await axiosInstance.post(
        "/api/applications/addapplication",
        null,
        {
          params: {
            studentId: sessionStorage.getItem("studentId"),
            jobId: jobId,
          },
        },
      );
      toast.success("Applied for the job successfully");
      await fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Unable to Apply for this drive");
    } finally {
      setApplyingJobId(null);
    }
  };

  const showDriveDetails = (id) => {
    navigate(`/admin/dashboard/managedrives/updatedrive/${id}`);
  };

  return (
    <div className={style.manageDrives}>
      <div className={style.pageHeader}>
        <div>
          <h2>Placement Opportunities</h2>
          <p>Explore available placement drives and apply for jobs.</p>
        </div>
      </div>

      {loading ? (
        <p className={style.loadingText}>Loading placement drives...</p>
      ) : drives.length === 0 ? (
        <div className={style.emptyMessage}>
          <h3>No Placement Drives Available</h3>
          <p>There are currently no placement opportunities.</p>
        </div>
      ) : (
        <>
          <p className={style.driveCount}>Available Drives: {drives.length}</p>

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
                    <strong>Application Deadline:</strong>{" "}
                    {drive.applicationDate}
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
                      onClick={() => showDriveDetails(drive.jobId)}
                    >
                      View Details
                    </button>

                    <button
                      className={style.updateBtn}
                      onClick={() => handleApply(drive.jobId)}
                      disabled={
                        hasApplied(drive.jobId) || applyingJobId === drive.jobId
                      }
                    >
                      {hasApplied(drive.jobId)
                        ? "Already Applied"
                        : applyingJobId === drive.jobId
                          ? "Applying..."
                          : "Apply"}
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

export default StudentDrives;
