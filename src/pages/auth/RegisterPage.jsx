import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { register } from "../../services/api";
import "../../styles/auth.css";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await register(form);
      setMessage("Akun berhasil dibuat. Silakan sign in.");
    } catch (error) {
      setMessage(error.message || "Register gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-bg-full" />

      <div className="register-container">
        {/* SISI KIRI: Tetap branding logo + tulisan gambar */}
        <div className="register-left-branding">
          <div className="branding-stack">
            <img 
              src="/img/logoregist.png" 
              alt="Paham.ID Logo" 
              className="logo-square-style" 
            />
            <img 
              src="/img/tulisanregist.png" 
              alt="Paham.ID Text" 
              className="branding-text-img" 
            />
          </div>
        </div>

        {/* SISI KANAN: Form dengan teks "Create Account" */}
        <div className="register-right-form">
          <div className="register-box">
            {/* Ganti gambar jadi teks biasa */}
            <h1 className="register-header-text">Create Account</h1>
            <p className="register-sub">Please fill the details below</p>

            <form className="form-content" onSubmit={handleSubmit}>
              <div className="input-field-group">
                <label>Full name <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <User size={18} className="icon-left" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={updateField("full_name")}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Username <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <AtSign size={18} className="icon-left" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={updateField("username")}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Email <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <Mail size={18} className="icon-left" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={updateField("email")}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Password <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="icon-left" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={updateField("password")}
                    required
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="input-field-group">
                <label>Confirm Password <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="icon-left" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirm_password}
                    onChange={updateField("confirm_password")}
                    required
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {message && <p className="login-footer">{message}</p>}

              <button type="submit" className="submit-btn-orange" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="login-footer">
              Already have an account? <Link to="/signin" className="signin-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
