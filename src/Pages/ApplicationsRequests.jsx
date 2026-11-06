import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import style from "../Styles/applicationrequests.module.css";

const API_URL = "http://localhost:8080/api/applications";

// Change these values if your Java enums use different constants.
const FORWARDING_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

const APPLICATION_STATUSES = [
  "APPLIED",
  "SHORTLISTED",
  "REJECTED",
  "SELECTED",
  "CONTACTED_BY_EMAIL",
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

      const response = await axios.get(API_URL);

      setApplications(response.data);

      const drafts = {};

      response.data.forEach((application) => {
        drafts[application.id] = {
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
  const handleStatusChange = (id, field, value) => {
    setStatusDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Update application status in backend
  const handleUpdateStatus = async (application) => {
    const draft = statusDrafts[application.id];

    if (!draft) return;

    try {
      const response = await axios.put(
        `${API_URL}/${application.id}/status`,
        null,
        {
          params: {
            applicationStatus: draft.applicationStatus,
            forwardingStatus: draft.forwardingStatus,
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) => (item.id === application.id ? response.data : item)),
      );

      toast.success("Application status updated successfully");

      if (selectedApplication?.id === application.id) {
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
      const response = await axios.put(
        `${API_URL}/${application.id}/status`,
        null,
        {
          params: {
            applicationStatus: application.applicationStatus,
            forwardingStatus: "APPROVED",
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) => (item.id === application.id ? response.data : item)),
      );

      setStatusDrafts((prev) => ({
        ...prev,
        [application.id]: {
          ...prev[application.id],
          forwardingStatus: "APPROVED",
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
      const response = await axios.put(
        `${API_URL}/${application.id}/status`,
        null,
        {
          params: {
            applicationStatus: application.applicationStatus,
            forwardingStatus: "REJECTED",
          },
        },
      );

      setApplications((prev) =>
        prev.map((item) => (item.id === application.id ? response.data : item)),
      );

      setStatusDrafts((prev) => ({
        ...prev,
        [application.id]: {
          ...prev[application.id],
          forwardingStatus: "REJECTED",
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
      {/* Page Header */}
      <div className={style.pageheader}>
        <div>
          <h2>Application Requests</h2>
          <p>View, approve and manage student application requests.</p>
        </div>

        <button className={style.refreshBtn} onClick={fetchApplications}>
          ↻ Refresh
        </button>
      </div>

      {/* Statistics */}
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

      {/* Search and Filters */}
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

      {/* Applications Table */}
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
                const draft = statusDrafts[application.id] || {
                  applicationStatus: application.applicationStatus,
                  forwardingStatus: application.forwardingStatus,
                };

                return (
                  <tr key={application.id}>
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

                        {application.forwardingStatus === "PENDING" && (
                          <>
                            <button
                              className={style.approveBtn}
                              onClick={() => handleApprove(application)}
                            >
                              Approve
                            </button>

                            <button
                              className={style.rejectBtn}
                              onClick={() => handleReject(application)}
                            >
                              Reject
                            </button>
                          </>
                        )}
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

      {/* Application Details Modal */}
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
                  <strong>{selectedApplication.studentName}</strong>
                </div>

                <div>
                  <span>Student ID</span>
                  <strong>{selectedApplication.studentId}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedApplication.studentEmail}</strong>
                </div>

                <div>
                  <span>Branch</span>
                  <strong>{selectedApplication.studentBranch || "-"}</strong>
                </div>
              </div>

              <h4>Placement Information</h4>

              <div className={style.detailsGrid}>
                <div>
                  <span>Company</span>
                  <strong>{selectedApplication.companyName}</strong>
                </div>

                <div>
                  <span>Job Role</span>
                  <strong>{selectedApplication.jobRole}</strong>
                </div>

                <div>
                  <span>Job ID</span>
                  <strong>{selectedApplication.jobCode}</strong>
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

              <h4>Update Application Status</h4>

              <div className={style.statusForm}>
                <label>Application Status</label>

                <select
                  value={
                    statusDrafts[selectedApplication.id]?.applicationStatus ||
                    selectedApplication.applicationStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedApplication.id,
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
                    statusDrafts[selectedApplication.id]?.forwardingStatus ||
                    selectedApplication.forwardingStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedApplication.id,
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
