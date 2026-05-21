import React from "react";
import { Link } from "react-router-dom";

export default function AuthSidebar() {
  return (
    <section className="detail-auth-sidebar">
      <h3>Menyelam Lebih Dalam di Paham.id?</h3>

      <p>Dapatkan pemberitahuan langsung setiap berita baru</p>

      <Link to="/register" className="detail-auth-sidebar-btn">
        DAFTAR SEKARANG
      </Link>
    </section>
  );
}