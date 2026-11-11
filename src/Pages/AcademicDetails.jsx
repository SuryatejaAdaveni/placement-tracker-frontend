import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "../Styles/register.module.css";
import Logobar from "../Components/Logobar";
import axiosInstance from "../Api/axiosInstance";
import { toast } from "react-toastify";

const AcademicDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const personalDetails = location.state?.personalDetails;

  const [form, setForm] = useState({
    collegeName: "",
    course: "",
    location: "",
    branch: "",
    backlogs: "",
    cgpa: "",
    passoutYear: "",
    twelfthPercentage: "",
    tenthPercentage: "",
  });

  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Prevent opening academic page without personal details
  if (!personalDetails) {
    return (
      <div>
        <p>Please complete your personal details first.</p>
        <button onClick={() => navigate("/register/personaldetails")}>
          Go to Personal Details
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setIsError(false);
  };

  const handleBack = () => {
    navigate("/register/personaldetails", {
      state: {
        personalDetails,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registrationData = {
      name: personalDetails.fullName,
      email: personalDetails.email,
      phone: personalDetails.phone,
      password: personalDetails.password,
      country: personalDetails.country,
      state: personalDetails.state,
      district: personalDetails.district,

      studentAcademicDetails: {
        collegeName: form.collegeName,
        course: form.course,
        location: form.location,
        branch: form.branch,
        backlogs: Number(form.backlogs),
        cgpa: Number(form.cgpa),
        graduationYear: Number(form.passoutYear),
        twelthPrecentage: Number(form.twelfthPercentage),
        tenthPercentage: Number(form.tenthPercentage),
      },
    };

    console.log("Registration Data:", registrationData);
    const formData = new FormData();

    formData.append(
      "student",
      new Blob([JSON.stringify(registrationData)], {
        type: "application/json",
      }),
    );

    formData.append("resume", resume);

    setIsError(false);

    // Send registrationData to your backend API here.

    try {
      await axiosInstance.post("/api/register", formData);

      toast.success("Student registered successfully!");

      navigate("/student/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <>
      <Logobar />

      <div className={style.registerPage}>
        <div className={style.registerContainer}>
          <form className={style.registerForm} onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            <p className={style.registerSubtitle}>
              Step 2 of 2 - Academic Details
            </p>

            <h3 className={style.formSectionTitle}>Academic Details</h3>

            <div className={style.registerGrid}>
              <div className={`${style.registerField} ${style.fullWidth}`}>
                <label htmlFor="collegeName">College Name *</label>
                <input
                  id="collegeName"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  placeholder="Enter college or university name"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="course">Course *</label>
                <select
                  id="course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="B.Sc.">B.Sc.</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={style.registerField}>
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter college location"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="branch">Branch *</label>
                <input
                  id="branch"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="backlogs">Backlogs *</label>
                <input
                  id="backlogs"
                  name="backlogs"
                  type="number"
                  min="0"
                  step="1"
                  value={form.backlogs}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="cgpa">CGPA *</label>
                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.25"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="passoutYear">Passout Year *</label>
                <select
                  id="passoutYear"
                  name="passoutYear"
                  value={form.passoutYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select year</option>

                  {Array.from({ length: 8 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.registerField}>
                <label htmlFor="twelfthPercentage">12th Percentage *</label>
                <input
                  id="twelfthPercentage"
                  name="twelfthPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.twelfthPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="tenthPercentage">10th Percentage *</label>
                <input
                  id="tenthPercentage"
                  name="tenthPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.tenthPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 90"
                  required
                />
              </div>
              <div className={`${style.registerField} ${style.fullWidth}`}>
                <label htmlFor="resume">Upload Resume (PDF) *</label>

                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setResume(e.target.files[0] || null)}
                  required
                />

                {resume && <p>Selected file: {resume.name}</p>}
              </div>
            </div>

            {message && (
              <p
                className={`${style.registerMessage} ${
                  isError ? style.error : ""
                }`}
                role="status"
              >
                {message}
              </p>
            )}

            <div className={style.registerGrid}>
              <button
                type="button"
                className={style.registerSubmit}
                onClick={handleBack}
              >
                Back
              </button>

              <button type="submit" className={style.registerSubmit}>
                Submit Registration
              </button>
            </div>

            <p className={style.registerLogin}>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>

          <footer className={style.registerFooter}>
            © 2026 Placement Tracker
          </footer>
        </div>
      </div>
    </>
  );
};

export default AcademicDetails;
