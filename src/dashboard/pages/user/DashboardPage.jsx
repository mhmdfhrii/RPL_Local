import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticles, fetchDashboardSummary, normalizeArticle } from "../../services/api";

const pageCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
  }

  .db-page-content {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 30px 32px 48px;
    background: #f7f7f8;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .db-stats-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .db-stat-card {
    min-height: 116px;
    padding: 24px;
    border: 1px solid #eef1f6;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .db-stat-label {
    margin: 0 0 10px;
    color: #697386;
    font-size: 15px;
    font-weight: 500;
  }

  .db-stat-value {
    margin: 0;
    color: #0646a8;
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
  }

  .db-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 48px;
  }

  .db-stat-icon svg {
    width: 22px;
    height: 22px;
  }

  .db-stat-icon-blue { background: #dfe7ff; color: #0646a8; }
  .db-stat-icon-steel { background: #dbe3f0; color: #5f6b7a; }
  .db-stat-icon-coral { background: #ffd8cf; color: #bb4b47; }

  .db-cta-banner {
    min-height: 296px;
    margin-bottom: 32px;
    padding: 56px 32px;
    border-radius: 10px;
    background: linear-gradient(115deg, #0646a8 0%, #0b4eb3 55%, #1f5fb7 100%);
    box-shadow: 0 16px 26px rgba(3, 36, 91, 0.18);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    box-sizing: border-box;
  }

  .db-cta-left {
    width: min(100%, 380px);
  }

  .db-cta-title {
    margin: 0 0 22px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.35;
  }

  .db-cta-desc {
    max-width: 320px;
    margin: 0 0 26px;
    color: rgba(255, 255, 255, 0.86);
    font-size: 16px;
    line-height: 1.52;
  }

  .db-cta-btn {
    min-width: 194px;
    min-height: 48px;
    padding: 0 24px;
    border: 0;
    border-radius: 7px;
    background: #ffffff;
    color: #0646a8;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font: 600 16px/1 'Plus Jakarta Sans', sans-serif;
  }

  .db-cta-btn svg {
    width: 20px;
    height: 20px;
  }

  .db-cta-right {
    width: min(100%, 270px);
    min-height: 72px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.13);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
  }

  .db-cta-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 8px;
    text-align: center;
  }

  .db-cta-stat-label,
  .db-cta-stat-value {
    margin: 0;
    color: #ffffff;
  }

  .db-cta-stat-label {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.88;
  }

  .db-cta-stat-value {
    font-size: 16px;
    font-weight: 700;
  }

  .db-recent-panel {
    overflow: hidden;
    border: 1px solid #edf1f6;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
  }

  .db-recent-header {
    min-height: 72px;
    padding: 0 24px;
    border-bottom: 1px solid #eef1f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-sizing: border-box;
  }

  .db-recent-title {
    margin: 0;
    color: #24272f;
    font-size: 15px;
    font-weight: 500;
  }

  .db-recent-viewall {
    border: 0;
    background: transparent;
    color: #0646a8;
    cursor: pointer;
    font: 500 15px/1 'Plus Jakarta Sans', sans-serif;
  }

  .db-article-row {
    min-height: 128px;
    padding: 24px;
    border-bottom: 1px solid #eef1f6;
    display: grid;
    grid-template-columns: 80px minmax(0, 1fr) 190px;
    align-items: center;
    gap: 24px;
    box-sizing: border-box;
  }

  .db-article-row:last-child {
    border-bottom: 0;
  }

  .db-article-thumb {
    width: 80px;
    height: 80px;
    border-radius: 7px;
    object-fit: cover;
    background: #111827;
    display: block;
  }

  .db-article-meta {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .db-article-category {
    min-height: 20px;
    padding: 3px 10px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
  }

  .cat-technology { background: #e6efff; color: #0646a8; }
  .cat-economics { background: #fff0e8; color: #a83d13; }
  .cat-environment { background: #e7f8ed; color: #0d8b45; }
  .cat-politics { background: #fff5dc; color: #986a0d; }
  .cat-social { background: #fce8f3; color: #a82064; }
  .cat-education { background: #edf0ff; color: #3f46a9; }

  .db-article-date {
    position: relative;
    padding-left: 12px;
    color: #596575;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1;
  }

  .db-article-date::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #596575;
    transform: translateY(-50%);
  }

  .db-article-title-text {
    max-width: 590px;
    margin: 0;
    color: #20242b;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .db-article-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 34px;
  }

  .db-status-badge {
    min-width: 86px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #566171;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .db-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .status-published { color: #2ebd68; }
  .status-pending { color: #ff8c34; }
  .status-draft { color: #566171; }
  .status-rejected { color: #d94848; }

  .db-article-actions {
    display: inline-flex;
    align-items: center;
    gap: 18px;
  }

  .db-action-icon-btn {
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #566171;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .db-action-icon-btn svg {
    width: 20px;
    height: 20px;
  }
`;

const IconArticle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const IconComment = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 3H4a2 2 0 0 0-2 2v15.2a.8.8 0 0 0 1.34.59L7.2 17H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
  </svg>
);

const IconPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

function formatNumber(value = 0) {
  const number = Number(value) || 0;
  if (number >= 1000)
    return `${(number / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(number);
}

function formatCategory(category = "") {
  return category
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCategoryClass(category = "") {
  const c = category.toLowerCase();
  if (c === "technology") return "cat-technology";
  if (c === "economics") return "cat-economics";
  if (c === "environment") return "cat-environment";
  if (c === "politics") return "cat-politics";
  if (c === "social") return "cat-social";
  if (c === "education") return "cat-education";
  return "cat-technology";
}

function getStatusLabel(status = "") {
  const s = status.toLowerCase();
  if (s === "published") return { label: "Published", cls: "status-published" };
  if (s === "pending") return { label: "Pending", cls: "status-pending" };
  if (s === "draft") return { label: "Draft", cls: "status-draft" };
  if (s === "rejected") return { label: "Rejected", cls: "status-rejected" };
  return { label: status || "Draft", cls: "status-draft" };
}

export default function DashboardPage({
  dashboardData,
  user,
  articles,
  onCreateArticle,
  onViewAll,
  onEditArticle,
  onDeleteArticle,
}) {
  const navigate = useNavigate();
  const [databaseData, setDatabaseData] = useState({
    profile: {
      name: "User",
      username: "@user",
      totalArticles: 0,
      totalLikes: 0,
      totalComments: 0,
    },
    articles: [],
    recentArticles: [],
    stats: {
      totalArticles: 0,
      totalLikes: 0,
      totalComments: 0,
      drafts: 0,
      pending: 0,
      published: 0,
      rejected: 0,
    },
    cta: {
      title: "Tulis berita baru untuk dibaca publik.",
      description: "Kelola draft, ajukan artikel, dan pantau status publikasi dari dashboard ini.",
      buttonLabel: "Write News",
    },
    recentLimit: 3,
  });

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetchDashboardSummary().catch(() => null),
      fetchArticles({ author: "me" }).catch(() => []),
    ]).then(([summary, myArticles]) => {
      if (!alive) return;

      const stats = summary?.stats || {};

      setDatabaseData((current) => ({
        ...current,
        articles: myArticles,
        recentArticles: summary?.recent_articles
          ? summary.recent_articles.map(normalizeArticle)
          : myArticles.slice(0, 3),
        stats: {
          totalArticles: stats.total_articles ?? myArticles.length,
          totalLikes: stats.total_likes ?? 0,
          totalComments: stats.total_comments ?? 0,
          drafts: myArticles.filter((article) => article.status === "draft").length,
          pending: myArticles.filter((article) => article.status === "pending").length,
          published: myArticles.filter((article) => article.status === "published").length,
          rejected: myArticles.filter((article) => article.status === "rejected").length,
        },
      }));
    });

    return () => {
      alive = false;
    };
  }, []);

  const resolvedDashboardData = dashboardData || databaseData;
  const dashboardUser = user || resolvedDashboardData.profile;
  const dashboardArticles =
    articles ||
    resolvedDashboardData.recentArticles ||
    resolvedDashboardData.articles ||
    [];
  const dashboardStats = resolvedDashboardData.stats || {};
  const dashboardCta = resolvedDashboardData.cta || {};

  const totalArticles =
    dashboardStats.totalArticles ??
    dashboardUser.totalArticles ??
    dashboardArticles.length;
  const totalLikes = dashboardStats.totalLikes ?? dashboardUser.totalLikes ?? 0;
  const totalComments =
    dashboardStats.totalComments ?? dashboardUser.totalComments ?? 0;

  const drafts = dashboardStats.drafts ?? 0;
  const pending = dashboardStats.pending ?? 0;
  const published = dashboardStats.published ?? 0;
  const recentArticles = dashboardArticles.slice(
    0,
    resolvedDashboardData.recentLimit || 3,
  );

  return (
    <>
      <style>{pageCss}</style>
      <main className="db-page-content">
        <section className="db-stats-row">
          <article className="db-stat-card">
            <div>
              <p className="db-stat-label">Total Articles</p>
              <h2 className="db-stat-value">{totalArticles}</h2>
            </div>
            <div className="db-stat-icon db-stat-icon-blue">
              <IconArticle />
            </div>
          </article>

          <article className="db-stat-card">
            <div>
              <p className="db-stat-label">Likes</p>
              <h2 className="db-stat-value">{formatNumber(totalLikes)}</h2>
            </div>
            <div className="db-stat-icon db-stat-icon-steel">
              <IconHeart />
            </div>
          </article>

          <article className="db-stat-card">
            <div>
              <p className="db-stat-label">Comments</p>
              <h2 className="db-stat-value">{totalComments}</h2>
            </div>
            <div className="db-stat-icon db-stat-icon-coral">
              <IconComment />
            </div>
          </article>
        </section>

        <section className="db-cta-banner">
          <div className="db-cta-left">
            <h2 className="db-cta-title">{dashboardCta.title}</h2>
            <p className="db-cta-desc">{dashboardCta.description}</p>
            <button
              className="db-cta-btn"
              type="button"
              onClick={onCreateArticle || (() => navigate("/write"))}
            >
              <IconPencil />
              {dashboardCta.buttonLabel}
            </button>
          </div>

          <div className="db-cta-right">
            <div className="db-cta-stat">
              <p className="db-cta-stat-label">Drafts</p>
              <h3 className="db-cta-stat-value">{drafts}</h3>
            </div>
            <div className="db-cta-stat">
              <p className="db-cta-stat-label">Pending</p>
              <h3 className="db-cta-stat-value">{pending}</h3>
            </div>
            <div className="db-cta-stat">
              <p className="db-cta-stat-label">Published</p>
              <h3 className="db-cta-stat-value">{published}</h3>
            </div>
          </div>
        </section>

        <section className="db-recent-panel">
          <div className="db-recent-header">
            <h3 className="db-recent-title">Recent Articles</h3>
            <button
              className="db-recent-viewall"
              type="button"
              onClick={onViewAll || (() => navigate("/my-articles"))}
            >
              View all &gt;
            </button>
          </div>

          {recentArticles.map((article) => {
            const status = getStatusLabel(article.status);
            const categoryClass = getCategoryClass(article.category);
            const thumbnail = article.thumbnail || article.image;

            return (
              <article key={article.id} className="db-article-row">
                <img
                  className="db-article-thumb"
                  src={thumbnail}
                  alt={article.title}
                />

                <div>
                  <div className="db-article-meta">
                    <span className={`db-article-category ${categoryClass}`}>
                      {formatCategory(article.category)}
                    </span>
                    <span className="db-article-date">{article.date}</span>
                  </div>
                  <p className="db-article-title-text">{article.title}</p>
                </div>

                <div className="db-article-right">
                  <span className={`db-status-badge ${status.cls}`}>
                    <span className="db-status-dot" />
                    {status.label}
                  </span>

                  <div className="db-article-actions">
                    <button
                      className="db-action-icon-btn"
                      type="button"
                      title="Edit"
                      onClick={() =>
                        onEditArticle
                          ? onEditArticle(article)
                          : navigate(`/edit-article/${article.id}`, {
                              state: { article },
                            })
                      }
                    >
                      <IconPencil />
                    </button>

                    <button
                      className="db-action-icon-btn"
                      type="button"
                      title="Delete"
                      onClick={() =>
                        onDeleteArticle
                          ? onDeleteArticle(article)
                          : console.log("Delete article", article.id)
                      }
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
