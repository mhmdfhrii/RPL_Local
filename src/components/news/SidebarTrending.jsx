import React from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useApiData";

export default function SidebarTrending() {
  const { articles } = useArticles();

  const topThreePopularNews = articles
    .slice()
    .sort((a, b) => Number(b.reads || 0) - Number(a.reads || 0))
    .slice(0, 3);

  return (
    <aside className="trending-sidebar">
      {/* Sering Dibaca */}
      <div className="sidebar-section popular-box">
        <h4 className="sidebar-title">SERING DIBACA</h4>

        <div className="popular-list">
          {topThreePopularNews.map((news) => (
            <div
              key={news.id}
              className="popular-item"
              style={{ cursor: "pointer" }}
            >
              <div className="pop-circle"></div>

              <div className="pop-info">
                <span className="reads">
                  {Number(news.reads || 0) >= 1000
                    ? `${(Number(news.reads || 0) / 1000).toFixed(1)}K`
                    : Number(news.reads || 0)}{" "}
                  READS
                </span>

                <Link
                  to={`/news/${news.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <p>{news.title}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stay Connected */}
      <div className="sidebar-section social-box">
        <h4 className="sidebar-title">STAY CONNECTED</h4>

        <div
          className="social-icons"
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          <div className="icon-item">
            <img src="/img/mdi_at.png" alt="At" width={24} height={24} />
          </div>

          <div className="icon-item">
            <img src="/img/ri_rss-fill.png" alt="RSS" width={24} height={24} />
          </div>

          <div className="icon-item">
            <img src="/img/share.png" alt="Share" width={24} height={24} />
          </div>

          <div className="icon-item">
            <img src="/img/comment.png" alt="Chat" width={24} height={24} />
          </div>
        </div>
      </div>
    </aside>
  );
}
