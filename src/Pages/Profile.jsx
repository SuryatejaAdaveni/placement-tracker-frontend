import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../Api/axiosInstance";
import style from "../Styles/profile.module.css";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/students/${sessionStorage.getItem("studentId")}`,
      );

      setStudent(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profileDetails();
  }, []);

  const downloadResume = () => {
    if (!student?.resumeFile) {
      toast.error("Resume not available");
      return;
    }

    const byteCharacters = atob(student.resumeFile);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${student.name}-Resume.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className={style.loading}>Loading Profile...</div>;
  }

  if (!student) {
    return <div className={style.loading}>Profile not found</div>;
  }

  const academic = student.studentAcademicDetails || {};

  return (
    <div className={style.profileContainer}>
      <div className={style.profileCard}>
        <div className={style.profileTop}>
          <div className={style.profileImageWrapper}>
            {student.profilePicUrl ? (
              <img src={student.profilePicUrl} alt="Profile" />
            ) : (
              <div className={style.profilePlaceholder}>
                {student.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <label htmlFor="profilePic" className={style.uploadIcon}>
              +
            </label>
          </div>

          <div className={style.profileInfo}>
            <h2>{student.name}</h2>
            <p>{student.email}</p>
            <span className={style.roleBadge}>{student.role}</span>
          </div>

          <div className={style.verifiedBadge}>
            {student.verified ? "✓ Verified" : "Not Verified"}
          </div>
        </div>

        <section className={style.profileSection}>
          <h3>Personal Information</h3>

          <div className={style.detailsGrid}>
            <div>
              <span>Student ID</span>
              <strong>{student.studentId}</strong>
            </div>

            <div>
              <span>Full Name</span>
              <strong>{student.name}</strong>
            </div>

            <div>
              <span>Email Address</span>
              <strong>{student.email}</strong>
            </div>

            <div>
              <span>Phone Number</span>
              <strong>{student.phone}</strong>
            </div>

            <div>
              <span>Country</span>
              <strong>{student.country}</strong>
            </div>

            <div>
              <span>State</span>
              <strong>{student.state}</strong>
            </div>

            <div>
              <span>District</span>
              <strong>{student.district}</strong>
            </div>
          </div>
        </section>

        <section className={style.profileSection}>
          <h3>Academic Information</h3>

          <div className={style.detailsGrid}>
            <div>
              <span>College Name</span>
              <strong>{academic.collegeName || "-"}</strong>
            </div>

            <div>
              <span>Course</span>
              <strong>{academic.course || "-"}</strong>
            </div>

            <div>
              <span>Branch</span>
              <strong>{academic.branch || "-"}</strong>
            </div>

            <div>
              <span>CGPA</span>
              <strong>{academic.cgpa ?? "-"}</strong>
            </div>

            <div>
              <span>Backlogs</span>
              <strong>{academic.backlogs ?? "-"}</strong>
            </div>

            <div>
              <span>Graduation Year</span>
              <strong>{academic.graduationYear ?? "-"}</strong>
            </div>

            <div>
              <span>10th Percentage</span>
              <strong>{academic.tenthPercentage ?? "-"}</strong>
            </div>

            <div>
              <span>12th Percentage</span>
              <strong>{academic.twelthPrecentage ?? "-"}</strong>
            </div>
          </div>
        </section>

        <section className={style.profileSection}>
          <h3>Resume</h3>
          {student.resumeUrl ? (
            <button className={style.resumeButton} onClick={downloadResume}>
              Download Resume
            </button>
          ) : (
            <p className={style.emptyText}>No resume uploaded</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
