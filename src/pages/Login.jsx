
import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      /*
       * login() now returns the logged-in user
       */
      const loggedInUser = await login(
        formData.email,
        formData.password
      );


      /*
       * ADMIN REDIRECT
       */
      if (String(loggedInUser?.role || "").toLowerCase() === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }


      /*
       * NORMAL USER REDIRECT
       */
      const destination =
        location.state?.from;

      navigate(
        destination
          ? `${destination.pathname || "/"}${
              destination.search || ""
            }${destination.hash || ""}`
          : "/",
        {
          replace: true,
        }
      );

    } catch (error) {
      setError(
        error.message ||
          "Login failed."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          {/* HEADER */}
          <div className="auth-header">

            <span className="small-heading">
              WELCOME BACK
            </span>

            <h1>
              Sign in to ShopSphere
            </h1>

            <p>
              Access your account and continue shopping.
            </p>

          </div>


          {/* FORM */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}
            <div className="auth-field">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="auth-input-wrap">

                <Mail size={18} />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="auth-field">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="auth-input-wrap">

                <LockKeyhole size={18} />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {/* OPTIONS */}
            <div className="auth-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setError(
                    "Password recovery will be added later."
                  )
                }
              >
                Forgot password?
              </button>

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>


          {/* DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>


          {/* REGISTER */}
          <div className="auth-register">

            <p>
              Don't have an account?
            </p>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Login;
