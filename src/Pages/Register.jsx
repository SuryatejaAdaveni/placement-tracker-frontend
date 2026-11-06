import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "../Styles/register.module.css";
import Logobar from "../Components/Logobar";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    district: "",
    collegeName: "",
    course: "",
    location: "",
    branch: "",
    backlogs: "",
    cgpa: "",
    passoutYear: "",
    twelfthPercentage: "",
    tenthPercentage: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setIsError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setIsError(true);
      return;
    }

    setMessage("Form validated! Connect your backend API to register.");
    setIsError(false);

    console.log(form);
    // Send form data to your backend API here.
  };

  return (
    <>
      <Logobar />
      <div className={style.registerPage}>
        <div className={style.registerContainer}>
          <form className={style.registerForm} onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p className={style.registerSubtitle}>
              Enter your personal and academic details
            </p>

            {/* Personal Details */}
            <h3 className={style.formSectionTitle}>Personal Details</h3>

            <div className={style.registerGrid}>
              <div className={style.registerField}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  pattern="[0-9]{10}"
                  title="Enter a 10 digit phone number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className={`${style.registerField} ${style.fullWidth}`}>
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="country">Country *</label>
                <input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  autoComplete="country-name"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  autoComplete="address-level1"
                  required
                />
              </div>

              <div className={`${style.registerField} ${style.fullWidth}`}>
                <label htmlFor="district">District *</label>
                <input
                  id="district"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  required
                />
              </div>
            </div>

            {/* Academic Details */}
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

              <div className={`${style.registerField}`}>
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
                  placeholder="Andhra Pradesh"
                  required
                />
              </div>

              <div className={style.registerField}>
                <label htmlFor="backlogs">Backlogs *</label>
                <input
                  id="backlogs"
                  name="backlogs"
                  value={form.backlogs}
                  onChange={handleChange}
                  placeholder="e.g. 0"
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
                  {Array.from(
                    { length: 8 },
                    (_, i) => new Date().getFullYear() + i - 2,
                  ).map((year) => (
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
            </div>

            {/* Account Details */}
            <h3 className={style.formSectionTitle}>Account Details</h3>

            <div className={style.registerGrid}>
              <div className={style.registerField}>
                <label htmlFor="password">Password *</label>
                <div className={style.registerPassword}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className={style.registerField}>
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className={style.registerPassword}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className={`${style.registerField} ${style.fullWidth}`}>
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
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

            <button type="submit" className={style.registerSubmit}>
              <Link to="/">Next</Link>
            </button>

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

export default Register;
