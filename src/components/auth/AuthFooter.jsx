import React from "react";
import { Link } from "react-router-dom";

export default function AuthFooter() {
  return (
    <div className="detail-auth-footer">
      <h3>Want to join the conversation?</h3>

      <div className="detail-auth-footer-actions">
        <Link to="/signin" className="detail-auth-login">
          Login
        </Link>

        <Link to="/register" className="detail-auth-register">
          Register
        </Link>
      </div>
    </div>
  );
}