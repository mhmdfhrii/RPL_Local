import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles, fetchCategories, fetchDashboardSummary } from "../../services/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root { --dashboard-sidebar-width: 260px; --dashboard-header-height: 76px; }

  .adp-page *, .adp-page *::before, .adp-page *::after { box-sizing: border-box; }

  .adp-page {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 72px 60px 58px 74px;
    background: #f8f9fb;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827;
  }

  .adp-page button { font-family: inherit; }
  .adp-shell { width: 100%; }

  .adp-title { margin: 0 0 8px; font-size: 30px; line-height: 1.18; font-weight: 800; color: #202124; }
  .adp-subtitle { margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563; font-weight: 500; }

  .adp-summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;
    margin: 32px 0 30px;
  }

  .adp-stat-card {
    min-height: 164px;
    background: #fff;
    border: 1px solid #dce3ef;
    border-radius: 14px;
    padding: 24px 25px;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
  }

  .adp-stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .adp-stat-icon { width: 42px; height: 42px; border-radius: 11px; display: grid; place-items: center; }

  .adp-badge {
    height: 24px;
    padding: 0 11px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 800;
  }

  .adp-badge.green { background: #dcfce7; color: #16a34a; }
  .adp-badge.red { background: #ffe4e8; color: #e11d48; }
  .adp-badge.gray { background: #f1f5f9; color: #94a3b8; }

  .adp-stat-label { margin-bottom: 8px; color: #4b5563; font-size: 14px; font-weight: 500; }
  .adp-stat-value { color: #202124; font-size: 24px; line-height: 1; font-weight: 800; }

  .adp-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 382px;
    gap: 30px;
    align-items: start;
  }

  .adp-panel, .adp-topics, .adp-quick {
    border-radius: 14px;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
  }

  .adp-panel {
    background: #fff;
    border: 1px solid #dce3ef;
    overflow: hidden;
  }

  .adp-panel-header {
    min-height: 80px;
    padding: 0 24px;
    border-bottom: 1px solid #edf1f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .adp-panel-title { margin: 0; font-size: 22px; font-weight: 800; color: #202124; }
  .adp-panel-link { border: 0; background: transparent; color: #0047ab; font-size: 13px; font-weight: 800; cursor: pointer; }

  .adp-activity-item {
    min-height: 92px;
    padding: 18px 24px;
    border-bottom: 1px solid #edf1f6;
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 16px;
    align-items: center;
  }

  .adp-activity-item:last-child { border-bottom: 0; }
  .adp-activity-dot { width: 40px; height: 40px; border-radius: 999px; display: grid; place-items: center; }

  .dot-blue { background: #eef5ff; color: #0056d6; }
  .dot-green { background: #ecfdf5; color: #16a34a; }
  .dot-red { background: #fee2e2; color: #dc2626; }
  .dot-indigo { background: #eef2ff; color: #4f46e5; }

  .adp-activity-text { color: #202124; font-size: 15px; line-height: 1.45; font-weight: 500; }
  .adp-activity-time { margin-top: 4px; color: #64748b; font-size: 13px; font-weight: 500; }
  .adp-empty { padding: 34px 24px; color: #94a3b8; font-size: 14px; }

  .adp-right { display: flex; flex-direction: column; gap: 30px; }

  .adp-topics { background: #fff; border: 1px solid #dce3ef; padding: 24px; }
  .adp-topics-title { margin-bottom: 14px; color: #202124; font-size: 15px; font-weight: 800; }
  .adp-topic-grid { display: flex; flex-wrap: wrap; gap: 10px; }

  .adp-topic-pill {
    height: 28px;
    padding: 0 13px;
    border: 1px solid #d8e0eb;
    border-radius: 999px;
    background: #e9eef6;
    color: #334155;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .adp-quick { background: #0047ab; padding: 26px 24px 24px; color: #fff; }
  .adp-quick-title { margin: 0 0 8px; font-size: 24px; line-height: 1.15; font-weight: 800; }
  .adp-quick-sub { margin: 0 0 18px; color: rgba(255,255,255,.9); font-size: 14px; font-weight: 500; }

  .adp-quick-btn {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    padding: 0 15px;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 7px;
    background: rgba(255,255,255,.1);
    color: #fff;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
  }

  .adp-quick-btn:hover { background: rgba(255,255,255,.18); }
  .adp-quick-btn:last-child { margin-bottom: 0; }

  .adp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 56px;
    color: #64748b;
    font-size: 14px;
  }

  .adp-breadcrumb-btn {
    border: 0;
    background: transparent;
    padding: 0;
    color: #64748b;
    font: inherit;
    cursor: pointer;
  }

  .adp-breadcrumb-current { color: #0047ab; font-weight: 700; }
  .adp-full-panel { max-width: 900px; }

  @media (max-width: 1180px) { .adp-main-grid { grid-template-columns: 1fr; } }
  @media (max-width: 980px) { .adp-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 640px) {
    .adp-page { margin-left: 0; padding: 32px 18px; }
    .adp-summary { grid-template-columns: 1fr; }
  }
`;

const IconArticle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h6" />
  </svg>
);

const IconPending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconPublished = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-5" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconWrite = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const IconAdd = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const toArray = (value) => (Array.isArray(value) ? value : []);

const getStatus = (article) =>
  String(article?.status || "published").toLowerCase();

const formatCategory = (category) => {
  if (!category) return "";
  return String(category).charAt(0).toUpperCase() + String(category).slice(1).toLowerCase();
};

const uniqueById = (items) => {
  const map = new Map();

  items.forEach((item, index) => {
    if (!item) return;
    const key = item.id || `${item.title}-${index}`;
    if (!map.has(key)) map.set(key, item);
  });

  return Array.from(map.values());
};

const getComputedStats = (articles = []) => ({
  totalArticles: articles.length,
  pending: articles.filter((article) => getStatus(article) === "pending").length,
  published: articles.filter((article) => getStatus(article) === "published").length,
  totalUsers: 0,
});

const preferredTopics = ["Technology", "Politics", "Economics", "Environment", "Social", "Education"];

const getTopics = (categories = []) => {
  const databaseTopics = toArray(categories).map((category) => formatCategory(category.name || category)).filter(Boolean);
  const ordered = preferredTopics.filter((topic) => databaseTopics.includes(topic));
  const rest = databaseTopics.filter((topic) => !ordered.includes(topic));
  return [...ordered, ...rest];
};

const activityConfig = {
  edit: { dotClass: "dot-blue", Icon: IconWrite },
  published: { dotClass: "dot-green", Icon: IconUpload },
  deleted: { dotClass: "dot-red", Icon: IconTrash },
  category: { dotClass: "dot-indigo", Icon: IconAdd },
};

function ActivityText({ item }) {
  if (item.type === "category") {
    return (
      <>
        {item.action}: <b>{item.title}</b>
      </>
    );
  }

  if (item.type === "published") {
    return (
      <>
        Artikel <b>"{item.title}"</b> telah diterbitkan oleh Admin
      </>
    );
  }

  if (item.type === "deleted") {
    return (
      <>
        Artikel <b>"{item.title}"</b> telah dihapus oleh Admin
      </>
    );
  }

  return (
    <>
      {item.action} <b>"{item.title}"</b>
    </>
  );
}

function ActivityList({ activities, limit }) {
  const list = limit ? activities.slice(0, limit) : activities;

  if (list.length === 0) {
    return <div className="adp-empty">Belum ada aktivitas.</div>;
  }

  return list.map((item) => {
    const config = activityConfig[item.type] || activityConfig.category;
    const Icon = config.Icon;

    return (
      <div className="adp-activity-item" key={item.id}>
        <div className={`adp-activity-dot ${config.dotClass}`}>
          <Icon />
        </div>
        <div>
          <div className="adp-activity-text">
            <ActivityText item={item} />
          </div>
          <div className="adp-activity-time">{item.time}</div>
        </div>
      </div>
    );
  });
}

export default function AdminDashboardPage({
  stats,
  activities,
  topics,
  onWriteNews,
  onPendingApproval,
  onManageNews,
}) {
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetchDashboardSummary().catch(() => null),
      fetchArticles({ all: "true" }).catch(() => []),
      fetchCategories().catch(() => []),
    ]).then(([summary, articleRows, categoryRows]) => {
      if (!alive) return;

      setSummaryStats(summary?.stats || null);
      setArticles(uniqueById(articleRows));
      setCategories(categoryRows);
    });

    return () => {
      alive = false;
    };
  }, []);

  const computedStats = getComputedStats(articles);
  const resolvedStats = {
    totalArticles: stats?.totalArticles ?? summaryStats?.total_articles ?? computedStats.totalArticles ?? 0,
    pending: stats?.pending ?? summaryStats?.pending_articles ?? computedStats.pending ?? 0,
    published: stats?.published ?? summaryStats?.published_articles ?? computedStats.published ?? 0,
    totalUsers: stats?.totalUsers ?? summaryStats?.total_users ?? computedStats.totalUsers ?? 0,
  };

  const resolvedActivities = toArray(activities);
  const resolvedTopics = topics || getTopics(categories);

  const handleWriteNews = () => (onWriteNews ? onWriteNews() : navigate("/admin/write"));
  const handlePendingApproval = () => (onPendingApproval ? onPendingApproval() : navigate("/admin/pending"));
  const handleManageNews = () => (onManageNews ? onManageNews() : navigate("/admin/manage-news"));

  return (
    <>
      <style>{css}</style>

      <main className="adp-page">
        {view === "activity" ? (
          <>
            <div className="adp-breadcrumb">
              <button className="adp-breadcrumb-btn" type="button" onClick={() => setView("dashboard")}>
                Dashboard
              </button>
              <span>›</span>
              <span className="adp-breadcrumb-current">Ringkasan Aktivitas</span>
            </div>

            <section className="adp-panel adp-full-panel">
              <div className="adp-panel-header">
                <h1 className="adp-panel-title">Ringkasan Aktivitas</h1>
              </div>
              <ActivityList activities={resolvedActivities} />
            </section>
          </>
        ) : (
          <div className="adp-shell">
            <section>
              <h1 className="adp-title">Ringkasan Dashboard</h1>
              <p className="adp-subtitle">
                Selamat datang kembali. Berikut adalah status publikasi hari ini.
              </p>
            </section>

            <section className="adp-summary">
              <div className="adp-stat-card">
                <div className="adp-stat-top">
                  <div className="adp-stat-icon" style={{ background: "#eef5ff", color: "#0056d6" }}>
                    <IconArticle />
                  </div>
                  <span className="adp-badge green">+{resolvedStats.totalArticles}</span>
                </div>
                <div className="adp-stat-label">Total Artikel</div>
                <div className="adp-stat-value">{resolvedStats.totalArticles.toLocaleString()}</div>
              </div>

              <div className="adp-stat-card">
                <div className="adp-stat-top">
                  <div className="adp-stat-icon" style={{ background: "#fff1f2", color: "#e11d48" }}>
                    <IconPending />
                  </div>
                  <span className="adp-badge red">Penting</span>
                </div>
                <div className="adp-stat-label">Artikel Menunggu</div>
                <div className="adp-stat-value">{resolvedStats.pending.toLocaleString()}</div>
              </div>

              <div className="adp-stat-card">
                <div className="adp-stat-top">
                  <div className="adp-stat-icon" style={{ background: "#eef5ff", color: "#0056d6" }}>
                    <IconPublished />
                  </div>
                  <span className="adp-badge gray">Stabil</span>
                </div>
                <div className="adp-stat-label">Artikel Terbit</div>
                <div className="adp-stat-value">{resolvedStats.published.toLocaleString()}</div>
              </div>

              <div className="adp-stat-card">
                <div className="adp-stat-top">
                  <div className="adp-stat-icon" style={{ background: "#eef5ff", color: "#2563eb" }}>
                    <IconUsers />
                  </div>
                  <span className="adp-badge green">+{resolvedStats.totalUsers}</span>
                </div>
                <div className="adp-stat-label">Total Pengguna</div>
                <div className="adp-stat-value">{resolvedStats.totalUsers.toLocaleString()}</div>
              </div>
            </section>

            <section className="adp-main-grid">
              <div className="adp-panel">
                <div className="adp-panel-header">
                  <h2 className="adp-panel-title">Ringkasan Aktivitas</h2>
                  <button className="adp-panel-link" type="button" onClick={() => setView("activity")}>
                    Lihat Semua
                  </button>
                </div>
                <ActivityList activities={resolvedActivities} limit={4} />
              </div>

              <aside className="adp-right">
                <div className="adp-topics">
                  <div className="adp-topics-title">Topics</div>
                  <div className="adp-topic-grid">
                    {resolvedTopics.length > 0 ? (
                      resolvedTopics.map((topic) => (
                        <button className="adp-topic-pill" type="button" key={topic}>
                          {topic}
                        </button>
                      ))
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Belum ada topic.</span>
                    )}
                  </div>
                </div>

                <div className="adp-quick">
                  <h2 className="adp-quick-title">Quick Actions</h2>
                  <p className="adp-quick-sub">Quickly access important features</p>

                  <button className="adp-quick-btn" type="button" onClick={handleWriteNews}>
                    <IconAdd />
                    Write News
                  </button>
                  <button className="adp-quick-btn" type="button" onClick={handlePendingApproval}>
                    <IconPending />
                    Pending Approval
                  </button>
                  <button className="adp-quick-btn" type="button" onClick={handleManageNews}>
                    <IconArticle />
                    Manage News
                  </button>
                </div>
              </aside>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
