import React from "react";
import { Link } from "react-router-dom";
import SidebarTrending from "./SidebarTrending";
import { useArticles } from "../../hooks/useApiData";
import "../../styles/mainTrending.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

export default function MainTrending() {
  const { articles } = useArticles();
  const trendingNews = articles.slice(3, 7);

  const getImage = (news) =>
    news?.image || news?.thumbnail || news?.cover || FALLBACK_IMAGE;

  return (
    <section className="main-trending-section">
      <div className="main-trending-layout">
        <div className="main-trending-left">
          <div className="main-trending-header">
            <h2 className="main-trending-title">Trending News</h2>
            <div className="main-trending-line" />

            <Link to="/trending" className="main-view-all">
              VIEW ALL
            </Link>
          </div>

          <div className="main-trending-grid">
            {trendingNews.length === 0 && (
              <div className="main-trending-empty">
                Belum ada artikel trending. Upload dan publish artikel baru dulu.
              </div>
            )}

            {trendingNews.map((news) => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="main-trending-card-link"
              >
                <article className="main-trending-card">
                  <img
                    src={getImage(news)}
                    alt={news.title}
                    className="main-trending-card-img"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <span className="main-trending-category">
                    {news.category || "ENVIRONMENT"}
                  </span>

                  <h3 className="main-trending-card-title">{news.title}</h3>

                  <p className="main-trending-card-desc">
                    {news.description ||
                      news.excerpt ||
                      "Mengulas peran penting hutan lintang tinggi dalam siklus karbon global seiring meningkatnya suhu bumi."}
                  </p>

                  <div className="main-trending-meta">
                    <span>{news.readTime || "2 MIN READ"}</span>
                    <span>·</span>
                    <span>{news.timeAgo || "2 hours ago"}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <aside className="main-trending-right">
          <SidebarTrending />
        </aside>
      </div>
    </section>
  );
}
