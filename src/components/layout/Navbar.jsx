import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.toLowerCase();

  // Cek apakah user sudah login
  const isLoggedIn = !!(
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("pahamAccessToken")
  );

  // Memastikan navbar hilang di halaman auth sesuai route App.jsx
  const isAuthPage = currentPath === "/signin" || currentPath === "/register";
  if (isAuthPage) return null;

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    try {
      const stored = localStorage.getItem("pahamUser");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.role === "admin") {
          navigate("/admin-dashboard");
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    navigate("/dashboard");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/" className="logo-icon">
            <img src="/img/Group2.png" className="logo-img" alt="Logo" />
          </Link>
        </div>

        <ul className="navbar-menu">
          {/* Perbaikan: to="/" sesuai dengan HomePage */}
          <li className={`menu-item ${currentPath === "/" ? "active" : ""}`}>
            <Link to="/">Home</Link>
          </li>

          {/* Perbaikan: to="/news" bukan path folder */}
          <li
            className={`menu-item ${currentPath === "/news" ? "active" : ""}`}
          >
            <Link to="/news">News</Link>
          </li>

          {/* Perbaikan: to="/trending" sesuai route */}
          <li
            className={`menu-item ${currentPath === "/trending" ? "active" : ""}`}
          >
            <Link to="/trending">Trending</Link>
          </li>

          {/* Perbaikan: to="/saved" sesuai route */}
          <li
            className={`menu-item ${currentPath === "/saved" ? "active" : ""}`}
          >
            <Link to="/saved">Saved</Link>
          </li>
        </ul>

        {/* ACTIONS */}
        <div className="navbar-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button
              type="button"
              className="search-icon-wrapper"
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/img/search.png"
                className="search-icon-img icon-black"
                alt="search"
              />
            </button>
          </div>

          <div className="icon-group">
            <Link to="/notifications" style={{ display: "flex" }}>
              <button className="icon-btn">
                <img src="/img/notif.png" className="icon-img" alt="notif" />
              </button>
            </Link>

            <button
              className="icon-btn profile-btn"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src="/img/acc.png"
                className="icon-img account-img"
                alt="account"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
