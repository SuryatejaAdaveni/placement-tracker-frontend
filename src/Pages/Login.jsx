import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "../Styles/login.module.css";
import Logobar from "../Components/Logobar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    setMessage(`Signing in as ${email}...`);
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
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Sign In
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
