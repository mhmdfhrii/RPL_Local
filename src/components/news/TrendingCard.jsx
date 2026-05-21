import React from "react";

// Catatan: TrendingCard TIDAK boleh punya <Link> di dalamnya
// karena sudah dibungkus <Link> di MainTrending.jsx
export default function TrendingCard({ news }) {
  return (
    <article className="trending-card">
      <div className="trending-img-wrapper">
        <img src={news.image} alt={news.title} />
      </div>

      <span className="cat-pink">{news.category}</span>

      <h3>{news.title}</h3>

      <p>{news.excerpt || news.description}</p>

      <div className="meta-footer">
        <span className="bold-meta">{news.readTime || "5 MIN READ"}</span>
        <span>•</span>
        <span>{news.date}</span>
      </div>
    </article>
  );
}