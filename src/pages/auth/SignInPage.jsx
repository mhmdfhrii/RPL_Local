import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../../services/api";
import "../../styles/auth.css";

export default function SignInPage() {
  const [showPass, setShowPass] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const user = await login(identifier, password);
      window.location.href = "/";
    } catch (error) {
      setMessage(error.message || "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signin-page">
      <div className="signin-bg-container" />

      <div className="signin-form-wrapper">
        {/* Kontainer logo dengan class baru untuk styling bulat */}
        <div className="signin-logo-container">
          <img 
            src="/img/logoregist.png" 
            alt="Paham.ID" 
            className="signin-logo-circle-custom" 
          />
        </div>

        <h1 className="signin-title">Sign In</h1>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-input-group">
            <label>Username <span className="req">*</span></label>
            <div className="signin-input-wrap">
              <Mail size={18} className="signin-icon" />
              <input
                type="text"
                placeholder="Enter your username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="signin-input-group">
            <label>Password <span className="req">*</span></label>
            <div className="signin-input-wrap">
              <Lock size={18} className="signin-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="signin-eye-btn"
                onClick={() => setShowPass(v => !v)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {message && <p className="signin-footer">{message}</p>}

          <button type="submit" className="signin-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signin-footer">
          Don't have an account? <Link to="/register">Register Now</Link>
        </p>
      </div>
    </main>
  );
}
