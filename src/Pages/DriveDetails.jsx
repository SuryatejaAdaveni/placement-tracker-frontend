import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../Api/axiosInstance";
import style from "../Styles/drivedetails.module.css";

const DriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDrive = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`/api/drives/${id}`);

      setDrive(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load drive details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();
  }, [id]);

  if (loading) {
    return <p className={style.message}>Loading drive details...</p>;
  }

  if (!drive) {
    return (
      <div className={style.message}>
        <h3>Drive Not Found</h3>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={style.driveContainer}>
      <div className={style.pageHeader}>
        <button
          className={style.backBtn}
          onClick={() => navigate("/student/dashboard/drives")}
        >
          ← Back to Drives
        </button>

        <span className={style.driveId}>{drive.jobId}</span>
      </div>

      <div className={style.driveCard}>
        <div className={style.companyHeader}>
          <div>
            <h2>{drive.companyName}</h2>
            <p>{drive.jobRole}</p>
          </div>

          <div className={style.salary}>₹{drive.salary} LPA</div>
        </div>

        <div className={style.detailsGrid}>
          <div className={style.detailItem}>
            <span>Company Name</span>
            <strong>{drive.companyName}</strong>
          </div>

          <div className={style.detailItem}>
            <span>Job Role</span>
            <strong>{drive.jobRole}</strong>
          </div>

          <div className={style.detailItem}>
            <span>Job ID</span>
            <strong>{drive.jobId}</strong>
          </div>

          <div className={style.detailItem}>
            <span>Salary</span>
            <strong>₹{drive.salary} LPA</strong>
          </div>

          <div className={style.detailItem}>
            <span>Application Deadline</span>
            <strong>
              {drive.applicationDate
                ? new Date(drive.applicationDate).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>
        </div>

        <div className={style.section}>
          <h3>Job Description</h3>
          <p>{drive.jobDescription || "Not provided"}</p>
        </div>

        <div className={style.section}>
          <h3>Eligibility Criteria</h3>
          <p>{drive.criteria || "Not provided"}</p>
        </div>

        <div className={style.section}>
          <h3>Eligible Branches</h3>

          <div className={style.branchList}>
            {drive.eligibleBranches?.length > 0 ? (
              drive.eligibleBranches.map((branch) => (
                <span key={branch}>{branch}</span>
              ))
            ) : (
              <p>No eligible branches specified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
