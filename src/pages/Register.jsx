
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    /* PASSWORD MATCH */
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    /* PASSWORD LENGTH */
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    /* NAME */
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    /* EMAIL */
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * AuthContext.register expects:
       * register(name, email, password)
       */

      const registeredUser = await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );

      console.log(
        "Registered user:",
        registeredUser
      );

      if (String(registeredUser?.role || "").toLowerCase() === "admin") {
        navigate("/admin", {
          replace: true,
        });
        return;
      }

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
          "Registration failed."
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
              JOIN SHOPSPHERE
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Sign up to discover products and manage
              your orders.
            </p>

          </div>


          {/* FORM */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}
            <div className="auth-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="auth-input-wrap">

                <UserRound size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="auth-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="auth-input-wrap">

                <Mail size={18} />

                <input
                  id="register-email"
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

              <label htmlFor="register-password">
                Password
              </label>

              <div className="auth-input-wrap">

                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
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


            {/* CONFIRM PASSWORD */}
            <div className="auth-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="auth-input-wrap">

                <LockKeyhole size={18} />

                <input
                  id="confirmPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {/* TERMS */}
            <label className="terms-row">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and privacy policy.
              </span>

            </label>


            {/* SUBMIT */}
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>


          {/* LOGIN */}
          <div className="auth-register">

            <p>
              Already have an account?
            </p>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Register;
