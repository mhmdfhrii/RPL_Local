import React from "react";
import { useLocation, Link } from "react-router-dom";
import '../../styles/footer.css';

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Sembunyikan footer di halaman register atau signin atau dashboard
  const isAuthPage = currentPath.includes("register") || currentPath.includes("signin") || currentPath.includes("dashboard");
  if (isAuthPage) return null;

  return (
    <footer className="footer-container-custom">
      <div className="footer-content-wrapper">
        {/* LOGO BOX - Sesuai gambar referensi */}
        <div className="footer-logo-box">
          <img
            src="/img/logoregist.png"
            className="footer-icon-final"
            alt="Icon"
          />
          <img
            src="/img/Group 2.png"
            className="footer-text-final"
            alt="Paham.ID"
          />
        </div>

        {/* LINKS ROW - Kapital dan minimalis */}
        <div className="footer-links-row">
          <Link to="/about">ABOUT US</Link>
          <Link to="/privacy">PRIVACY POLICY</Link>
          <Link to="/contact">CONTACT</Link>
        </div>

        {/* COPYRIGHT TEXT */}
        <p className="footer-copyright-text">
          © 2026 THE EDITORIAL AUTHORITY. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;