import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import style from "../Styles/applicationrequests.module.css";
import axiosInstance from "../Api/axiosInstance";

const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

const FORWARDING_STATUSES = [
  "APPLIED",
  "CONTACTED_BY_EMAIL",
  "SHORTLISTED",
  "SELECTED",
  "REJECTED",
];

const ApplicationsRequests = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("All");
  const [forwardingFilter, setForwardingFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`/api/applications`);

      setApplications(response.data);

      const drafts = {};

      response.data.forEach((application) => {
        drafts[application.applicationId] = {
          applicationStatus: application.applicationStatus,
          forwardingStatus: application.forwardingStatus,
        };
      });

      setStatusDrafts(drafts);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load application requests");
    } finally {
      setLoading(false);
    }
    console.log(applications);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Search and filter
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        application.applicationId?.toLowerCase().includes(searchValue) ||
        application.studentName?.toLowerCase().includes(searchValue) ||
        application.studentEmail?.toLowerCase().includes(searchValue) ||
        application.jobCode?.toLowerCase().includes(searchValue) ||
        application.companyName?.toLowerCase().includes(searchValue);

      const matchesApplicationStatus =
        applicationFilter === "All" ||
        application.applicationStatus === applicationFilter;

      const matchesForwardingStatus =
        forwardingFilter === "All" ||
        application.forwardingStatus === forwardingFilter;

      return (
        matchesSearch && matchesApplicationStatus && matchesForwardingStatus
      );
    });
  }, [applications, search, applicationFilter, forwardingFilter]);

  // Statistics
  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => application.forwardingStatus === "PENDING",
  ).length;

  const approvedApplications = applications.filter(
    (application) => application.forwardingStatus === "APPROVED",
  ).length;

  // Update draft status
  const handleStatusChange = (applicationId, field, value) => {
    setStatusDrafts((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [field]: value,
      },
    }));
  };

  // Update application status in backend
  const handleUpdateStatus = async (application) => {
    const draft = statusDrafts[application.applicationId];

    if (!draft) return;

    try {
      const response = await axiosInstance.put(
        `/api/applications/${application.applicationId}/status`,
        null,
        {
          params: {
            applicationStatus: draft.applicationStatus,
            forwardingStatus: draft.forwardingStatus,
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.applicationId === application.applicationId
            ? response.data
            : item,
        ),
      );

      toast.success("Application status updated successfully");

      if (selectedApplication?.applicationId === application.applicationId) {
        setSelectedApplication(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to update application status",
      );
    }
  };

  // Quick approve
  const handleApprove = async (application) => {
    try {
      const response = await axiosInstance.put(
        `/api/applications/${application.applicationId}/status`,
        null,
        {
          params: {
            forwardingStatus: application.applicationStatus,
            applicationStatus: "APPROVED",
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.applicationId === application.applicationId
            ? response.data
            : item,
        ),
      );

      setStatusDrafts((prev) => ({
        ...prev,
        [application.applicationId]: {
          ...prev[application.applicationId],
          applicationStatus: "APPROVED",
        },
      }));

      toast.success("Application approved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to approve application");
    }
  };

  // Quick reject
  const handleReject = async (application) => {
    try {
      const response = await axiosInstance.put(
        `/api/applications/${application.applicationId}/status`,
        null,
        {
          params: {
            forwardingStatus: application.forwardingStatus,
            applicationStatus: "REJECTED",
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.applicationId === application.applicationId
            ? response.data
            : item,
        ),
      );

      setStatusDrafts((prev) => ({
        ...prev,
        [application.applicationId]: {
          ...prev[application.applicationId],
          applicationStatus: "REJECTED",
        },
      }));

      toast.success("Application rejected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to reject application");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
      case "SELECTED":
        return style.approved;

      case "REJECTED":
        return style.rejected;

      case "PENDING":
        return style.pending;

      case "SHORTLISTED":
        return style.shortlisted;

      default:
        return style.applied;
    }
  };

  return (
    <div className={style.applicationrequests}>
      <div className={style.pageheader}>
        <div>
          <h2>Application Requests</h2>
          <p>View, approve and manage student application requests.</p>
        </div>

        <button className={style.refreshBtn} onClick={fetchApplications}>
          ↻ Refresh
        </button>
      </div>

      <div className={style.statsgrid}>
        <div className={style.statCard}>
          <div className={style.statIcon}>▤</div>
          <div>
            <p>Total Applications</p>
            <h3>{totalApplications}</h3>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.pendingIcon}>⌛</div>
          <div>
            <p>Pending Applications</p>
            <h3>{pendingApplications}</h3>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.approvedIcon}>✓</div>
          <div>
            <p>Approved Applications</p>
            <h3>{approvedApplications}</h3>
          </div>
        </div>
      </div>

      <div className={style.filterSection}>
        <div className={style.searchBox}>
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by student, email, application ID or job..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              console.log(applications);
            }}
          />
        </div>

        <select
          value={applicationFilter}
          onChange={(e) => setApplicationFilter(e.target.value)}
        >
          <option value="All">All Application Status</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={forwardingFilter}
          onChange={(e) => setForwardingFilter(e.target.value)}
        >
          <option value="All">All Forwarding Status</option>
          {FORWARDING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className={style.tableContainer}>
        {loading ? (
          <p className={style.message}>Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <div className={style.emptyMessage}>
            <h3>No Applications Found</h3>
            <p>There are no applications matching your search or filters.</p>
          </div>
        ) : (
          <table className={style.applicationTable}>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Job ID</th>
                <th>Applied Date</th>
                <th>Application Status</th>
                <th>Forwarding Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application) => {
                const draft = statusDrafts[application.applicationId] || {
                  applicationStatus: application.applicationStatus,
                  forwardingStatus: application.forwardingStatus,
                };

                return (
                  <tr key={application.applicationId}>
                    <td>
                      <strong className={style.applicationId}>
                        {application.applicationId}
                      </strong>
                    </td>

                    <td>
                      <div className={style.studentInfo}>
                        <div>
                          <strong>{application.student.studentId}</strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={style.studentInfo}>
                        <div>
                          <strong>{application.student.name}</strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={style.jobInfo}>
                        <strong>{application.job.jobId}</strong>
                        <span>{application.jobRole}</span>
                        <small>{application.jobCode}</small>
                      </div>
                    </td>

                    <td>
                      {application.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          application.applicationStatus,
                        )}
                      >
                        {application.applicationStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(application.forwardingStatus)}
                      >
                        {application.forwardingStatus}
                      </span>
                    </td>

                    <td>
                      <div className={style.actions}>
                        <button
                          className={style.viewBtn}
                          onClick={() => setSelectedApplication(application)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className={style.resultCount}>
        Showing {filteredApplications.length} of {totalApplications}{" "}
        applications
      </p>

      {selectedApplication && (
        <div
          className={style.modalOverlay}
          onClick={() => setSelectedApplication(null)}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <div>
                <h3>Application Details</h3>
                <p>{selectedApplication.applicationId}</p>
              </div>

              <button onClick={() => setSelectedApplication(null)}>×</button>
            </div>

            <div className={style.modalBody}>
              <h4>Student Information</h4>

              <div className={style.detailsGrid}>
                <div>
                  <span>Student Name</span>
                  <strong>{selectedApplication.student.name}</strong>
                </div>

                <div>
                  <span>Student ID</span>
                  <strong>{selectedApplication.student.studentId}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedApplication.student.email}</strong>
                </div>

                <div>
                  <span>Branch</span>
                  <strong>
                    {selectedApplication.student.studentAcademicDetails
                      .branch || "-"}
                  </strong>
                </div>
              </div>

              <h4>Placement Information</h4>

              <div className={style.detailsGrid}>
                <div>
                  <span>Company</span>
                  <strong>{selectedApplication.job.companyName}</strong>
                </div>

                <div>
                  <span>Job Role</span>
                  <strong>{selectedApplication.job.jobRole}</strong>
                </div>

                <div>
                  <span>Job ID</span>
                  <strong>{selectedApplication.job.jobId}</strong>
                </div>

                <div>
                  <span>Applied Date</span>
                  <strong>
                    {selectedApplication.appliedAt
                      ? new Date(selectedApplication.appliedAt).toLocaleString()
                      : "-"}
                  </strong>
                </div>
              </div>

              <h4>Mock Ratings</h4>
              <div className={style.detailsGrid}>
                {selectedApplication.student.mockRating?.length > 0 ? (
                  selectedApplication.student.mockRating.map((mock, index) => (
                    <div key={index}>
                      <span>{mock.technology}</span>
                      <strong>{mock.rating}</strong>
                    </div>
                  ))
                ) : (
                  <p>No mock ratings available</p>
                )}
              </div>

              <h4>Update Application Status</h4>

              <div className={style.statusForm}>
                <label>Application Status</label>

                <select
                  value={
                    statusDrafts[selectedApplication.applicationId]
                      ?.applicationStatus ||
                    selectedApplication.applicationStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedApplication.applicationId,
                      "applicationStatus",
                      e.target.value,
                    )
                  }
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <label>Forwarding Status</label>

                <select
                  value={
                    statusDrafts[selectedApplication.applicationId]
                      ?.forwardingStatus || selectedApplication.forwardingStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedApplication.applicationId,
                      "forwardingStatus",
                      e.target.value,
                    )
                  }
                >
                  {FORWARDING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  className={style.saveBtn}
                  onClick={() => handleUpdateStatus(selectedApplication)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsRequests;
