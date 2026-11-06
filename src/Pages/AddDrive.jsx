import React, { useState, useEffect } from "react";
import style from "../Styles/adddrive.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import backArrow from "../assets/image.png";

const AddDrive = () => {
  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    salary: "",
    jobDescription: "",
    criteria: "",
    eligibleBranches: "",
    applicationDate: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      companyName: form.companyName.trim(),
      jobRole: form.jobRole.trim(),
      salary: Number(form.salary),
      jobDescription: form.jobDescription.trim(),
      criteria: form.criteria.trim(),
      eligibleBranches: form.eligibleBranches
        .split(",")
        .map((branch) => branch.trim())
        .filter((branch) => branch !== ""),
      applicationDate: form.applicationDate,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/admin/dashboard/managedrives/updatedrive/${id}`,
          jobData,
        );

        toast.success("Drive updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8080/admin/dashboard/managedrives/adddrive",
          jobData,
        );

        toast.success("Drive added successfully!");
      }

      navigate("/admin/dashboard/managedrives");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save placement drive");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/admin/dashboard/managedrives/updatedrive/${id}`);
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/admin/dashboard/managedrives/${id}`)
        .then((response) => {
          const drive = response.data;

          setForm({
            companyName: drive.companyName,
            jobRole: drive.jobRole,
            salary: drive.salary,
            jobDescription: drive.jobDescription,
            criteria: drive.criteria,
            eligibleBranches: drive.eligibleBranches.join(", "),
            applicationDate: drive.applicationDate,
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Unable to fetch drive details");
        });
    }
  }, [id]);

  return (
    <div className={style.drivePage}>
      <div className={style.backButton}>
        <Link to={"/admin/dashboard/managedrives"}>
          <button>
            {" "}
            <img src={backArrow} alt="" /> Back
          </button>
        </Link>
      </div>

      <form className={style.driveForm} onSubmit={handleSubmit}>
        <div className={style.formHeader}>
          <h2>
            {isEditMode
              ? "Update Placement Drive"
              : "Create New Placement Drive"}
          </h2>
          <p>Enter the company and job details to create a placement drive.</p>
        </div>

        {/* Drive Details */}
        <h3 className={style.formSectionTitle}>Drive Details</h3>

        <div className={style.formGrid}>
          <div className={style.driveField}>
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className={style.driveField}>
            <label htmlFor="jobRole">Job Role *</label>
            <input
              type="text"
              id="jobRole"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              placeholder="Enter job role"
              required
            />
          </div>

          <div className={style.driveField}>
            <label htmlFor="salary">Salary (LPA) *</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary in LPA"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={style.driveField}>
            <label htmlFor="applicationDate">Application Deadline *</label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={form.applicationDate}
              onChange={handleChange}
              min={new Date().toLocaleDateString("en-CA")}
              required
            />
          </div>
        </div>

        <h3 className={style.formSectionTitle}>Job Information</h3>

        <div className={style.driveField}>
          <label htmlFor="jobDescription">Job Description *</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            placeholder="Enter job description (50-5000 characters)"
            minLength={50}
            maxLength={5000}
            rows={5}
            required
          />
          <small>{form.jobDescription.length}/5000 characters</small>
        </div>

        <div className={style.driveField}>
          <label htmlFor="criteria">Additional Criteria *</label>
          <textarea
            id="criteria"
            name="criteria"
            value={form.criteria}
            onChange={handleChange}
            placeholder="Enter eligibility criteria, required skills, CGPA requirements, etc."
            rows={4}
            required
          />
        </div>

        <h3 className={style.formSectionTitle}>Eligibility Details</h3>

        <div className={style.driveField}>
          <label htmlFor="eligibleBranches">Eligible Branches *</label>
          <input
            type="text"
            id="eligibleBranches"
            name="eligibleBranches"
            value={form.eligibleBranches}
            onChange={handleChange}
            placeholder="Example: CSE, ECE, EEE, IT"
            required
          />
          <small>Enter multiple branches separated by commas.</small>
        </div>

        <div className={style.formActions}>
          <button
            type="reset"
            className={style.resetBtn}
            onClick={() =>
              setForm({
                companyName: "",
                jobRole: "",
                salary: "",
                jobDescription: "",
                criteria: "",
                eligibleBranches: "",
                applicationDate: "",
              })
            }
          >
            Reset
          </button>

          <button type="submit" className={style.submitBtn}>
            {isEditMode ? "Update Drive" : "Add Drive"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDrive;
