import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "../Styles/login.module.css";
import Logobar from "../Components/Logobar";
import axiosInstance from "../Api/axiosInstance";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const response = await axiosInstance.post("/api/login", form);
      const user = response.data;
      sessionStorage.setItem("studentId", user.studentId);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem("role", user.role);
      toast.success("Login Successfull!");
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "STUDENT") {
        navigate("/student/dashboard");
      } else {
        setMessage("Invalid user role");
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(error.response?.data || "Invalid email or password");

      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logobar />
      <div className={style.loginpage}>
        <div className={style.logincontainer}>
          <form className={style.loginform} onSubmit={handleSubmit}>
            <h2>Welcome back</h2>
            <p className={style.loginsubtitle}>Sign in to continue</p>

            <div className={style.formgroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={style.passwordheading}>
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className={style.textbutton}
                onClick={() =>
                  setMessage("Password reset functionality is coming soon.")
                }
              >
                Forgot password?
              </button>
            </div>

            <div className={style.passwordinput}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className={style.showbutton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className={style.loginbutton}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {message && <p className={style.loginmessage}>{message}</p>}

            <p className={style.registertext}>
              Don't have an account?{" "}
              <Link
                to="/register/personaldetails"
                className={style.registerlink}
              >
                Create Account
              </Link>
            </p>
          </form>

          <footer className={style.loginfooter}>
            © 2026 Placement Tracker
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;
