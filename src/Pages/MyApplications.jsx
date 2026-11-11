import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/axiosInstance";
import { toast } from "react-toastify";
import style from "../Styles/myapplications.module.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const studentId = sessionStorage.getItem("studentId");

      const response = await axiosInstance.get(
        `/api/applications/student/${studentId}`,
      );

      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    console.log(applications);
  }, []);

  const getStatus = (status) => {
    return (status || "PENDING").toString().toUpperCase();
  };

  const getStatusClass = (status) => {
    const value = getStatus(status);

    if (value === "ACCEPTED") return style.accepted;
    if (value === "REJECTED") return style.rejected;

    return style.pending;
  };

  const getInterviewProgress = (application) => {
    const interviewProgess = application.forwardingStatus;
    if (interviewProgess == "APPLIED") return 1;
    if (interviewProgess == "CONTACTED_BY_EMAIL") return 2;
    if (interviewProgess == "SHORTLISTED") return 3;
    if (interviewProgess == "SELECTED") return 4;
    if (interviewProgess == "REJECTED") return 5;
    return 1;
  };
  const getApplicationProgress = (application) => {
    const applicationStatus = application.applicationStatus;

    if (applicationStatus == "PENDING") return 1;
    if (applicationStatus == "APPROVED") return 2;
    if (applicationStatus == "REJECTED") return 3;
    return 1;
  };

  const applicationStages = ["PENDING", "APPROVED", "REJECTED"];
  const interviewStages = [
    "APPLIED",
    "CONTACTED_BY_EMAIL",
    "SHORTLISTED",
    "SELECTED",
    "REJECTED",
  ];

  return (
    <div className={style.applicationsPage}>
      <div className={style.pageHeader}>
        <h2>My Applications</h2>
        <p>Track your placement applications and interview progress.</p>
      </div>

      {loading ? (
        <p className={style.message}>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div className={style.emptyState}>
          <h3>No Applications Yet</h3>
          <p>You haven't applied for any placement drives yet.</p>
        </div>
      ) : (
        <>
          <div className={style.summary}>
            <div>
              <h3>{applications.length}</h3>
              <p>Total Applications</p>
            </div>
            <div>
              <h3>
                {
                  applications.filter(
                    (app) => getStatus(app.applicationStatus) === "PENDING",
                  ).length
                }
              </h3>
              <p>Pending</p>
            </div>
            <div>
              <h3>
                {
                  applications.filter(
                    (app) => getStatus(app.applicationStatus) === "ACCEPTED",
                  ).length
                }
              </h3>
              <p>Accepted</p>
            </div>
            <div>
              <h3>
                {
                  applications.filter(
                    (app) => getStatus(app.applicationStatus) === "REJECTED",
                  ).length
                }
              </h3>
              <p>Rejected</p>
            </div>
          </div>

          <div className={style.applicationList}>
            {applications.map((application, index) => {
              // Adjust these relationships to match your Application entity.
              const drive = application.job;
              const applicationProgress = getApplicationProgress(application);
              const interviewProgress = getInterviewProgress(application);
              const status = getStatus(application.applicationStatus);

              return (
                <div
                  className={style.applicationCard}
                  key={application.id || application.applicationId || index}
                >
                  <div className={style.cardHeader}>
                    <div>
                      <h3>{drive.companyName || "Company"}</h3>
                      <p>{drive.jobRole || "Placement Opportunity"}</p>
                      <span>{drive.jobId || ""}</span>
                    </div>

                    <span className={getStatusClass(status)}>{status}</span>
                  </div>

                  <div className={style.applicationDetails}>
                    <p>
                      <strong>Application Status:</strong> {status}
                    </p>
                    <p>
                      <strong>Forwarding Status:</strong>{" "}
                      {getStatus(application.forwardingStatus)}
                    </p>
                  </div>

                  <div className={style.progressSection}>
                    <h4>Application Progress</h4>

                    <div className={style.progressTrack}>
                      {applicationStages.map((stage, stageIndex) => {
                        const completed = stageIndex < applicationProgress;
                        const current = stageIndex === applicationProgress - 1;

                        return (
                          <div className={style.progressStep} key={stage}>
                            <div
                              className={`${style.progressCircle} ${
                                completed ? style.completed : ""
                              } ${current ? style.current : ""}`}
                            >
                              {completed ? "✓" : stageIndex + 1}
                            </div>

                            <span>{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={style.progressSection}>
                    <h4>Interview Progress</h4>

                    <div className={style.progressTrack}>
                      {interviewStages.map((stage, stageIndex) => {
                        const completed = stageIndex < interviewProgress;
                        const current = stageIndex === interviewProgress - 1;

                        return (
                          <div className={style.progressStep} key={stage}>
                            <div
                              className={`${style.progressCircle} ${
                                completed ? style.completed : ""
                              } ${current ? style.current : ""}`}
                            >
                              {completed ? "✓" : stageIndex + 1}
                            </div>

                            <span>{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {status === "ACCEPTED" && (
                    <p className={style.successMessage}>
                      Congratulations! Your application has been accepted.
                    </p>
                  )}

                  {status === "REJECTED" && (
                    <p className={style.errorMessage}>
                      Unfortunately, your application was rejected.
                    </p>
                  )}

                  {status === "PENDING" && (
                    <p className={style.pendingMessage}>
                      Your application is being processed.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyApplications;
