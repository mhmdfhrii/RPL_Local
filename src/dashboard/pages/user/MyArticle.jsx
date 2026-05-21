import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TABS } from "../../config/staticConfig";
import {
  deleteArticle,
  fetchArticles,
  updateArticle,
} from "../../services/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
  }

  .ma-page {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 30px 85px 56px;
    background: #f8f8f9;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ma-shell {
    width: 1074px;
    max-width: 100%;
    box-sizing: border-box;
  }

  .ma-top {
    width: 1074px;
    max-width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 36px;
  }

  .ma-heading {
    width: 360px;
    flex: 0 0 360px;
  }

  .ma-title {
    margin: 0 0 10px;
    color: #171923;
    font-size: 15px;
    font-weight: 500;
  }

  .ma-subtitle {
    margin: 0;
    color: #5f6b7a;
    font-size: 15px;
    line-height: 1.5;
  }

  .ma-tabs {
    width: 600px;
    height: 48px;
    margin-left: auto;
    padding: 4px;
    border: 1px solid #d8dee8;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    box-sizing: border-box;
    flex: 0 0 600px;
  }

  .ma-tab {
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #566171;
    cursor: pointer;
    font: 500 14px/1 'Plus Jakarta Sans', sans-serif;
  }

  .ma-tab.active {
    background: #0646a8;
    color: #ffffff;
  }

  .ma-grid {
    width: 1074px;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 342px);
    gap: 30px 24px;
    align-items: start;
    justify-content: start;
  }

  .ma-card,
  .ma-new-card {
    width: 342px;
    height: 456px;
    box-sizing: border-box;
  }

  .ma-card {
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.07);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ma-thumb {
    position: relative;
    height: 190px;
    background: #e5e7eb;
    overflow: hidden;
    flex-shrink: 0;
  }

  .ma-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ma-badge {
    position: absolute;
    top: 14px;
    right: 16px;
    min-height: 28px;
    padding: 5px 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .ma-badge.draft {
    background: #e9f0ff;
    color: #0646d8;
  }

  .ma-badge.pending {
    background: #fff1c9;
    color: #cf7100;
  }

  .ma-badge.published {
    background: #d9f8e2;
    color: #168a3a;
  }

  .ma-badge.rejected {
    background: #ffe0df;
    color: #e1272d;
  }

  .ma-body {
    padding: 22px 24px 14px;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }

  .ma-card-title {
    height: 48px;
    margin: 0 0 12px;
    color: #161923;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ma-excerpt {
    height: 60px;
    margin: 0 0 15px;
    color: #5f6b7a;
    font-size: 14px;
    line-height: 1.48;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ma-meta {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    color: #465464;
    font-size: 12px;
    margin-bottom: 14px;
  }

  .ma-meta span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ma-footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #eef1f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .ma-actions {
    display: inline-flex;
    align-items: center;
    gap: 16px;
  }

  .ma-icon-btn {
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #465464;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ma-icon-btn:hover {
    color: #0646a8;
  }

  .ma-icon-btn.danger {
    color: #e1272d;
  }

  .ma-status-btn {
    min-width: 120px;
    height: 40px;
    padding: 0 14px;
    border: 0;
    border-radius: 8px;
    color: #4b5563;
    background: #e6edf8;
    font: 500 14px/1 'Plus Jakarta Sans', sans-serif;
    cursor: default;
  }

  .ma-status-btn.submit {
    color: #ffffff;
    background: #064fe0;
    cursor: pointer;
  }

  .ma-status-btn.live {
    background: #f0eeee;
    color: #4b5563;
  }

  .ma-new-card {
    border: 2px dashed #c6cfdf;
    border-radius: 8px;
    background: transparent;
    color: #111827;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .ma-new-inner {
    width: 210px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ma-new-icon {
    width: 62px;
    height: 62px;
    margin-bottom: 18px;
    border-radius: 50%;
    background: #ececec;
    color: #0646a8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ma-new-title {
    margin: 0 0 12px;
    color: #171923;
    font-size: 16px;
    font-weight: 500;
  }

  .ma-new-text {
    margin: 0;
    color: #5f6b7a;
    font-size: 14px;
    line-height: 1.45;
  }

  .ma-modal-layer {
    position: fixed;
    inset: 0;
    z-index: 300;
    background: rgba(17, 24, 39, 0.48);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ma-modal {
    width: min(560px, calc(100vw - 40px));
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
    overflow: hidden;
  }

  .ma-modal-body {
    padding: 32px 30px 36px;
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }

  .ma-modal-icon {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: #fee2e2;
    color: #e1272d;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ma-modal-title {
    margin: 0 0 28px;
    color: #111827;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 26px;
    font-weight: 800;
  }

  .ma-modal-text {
    margin: 0;
    color: #566171;
    font-size: 18px;
    line-height: 1.6;
  }

  .ma-modal-footer {
    padding: 22px 30px 20px;
    background: #f8fafc;
    display: flex;
    justify-content: flex-end;
    gap: 14px;
  }

  .ma-modal-btn {
    min-width: 110px;
    min-height: 56px;
    border-radius: 8px;
    font: 700 18px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .ma-modal-btn.cancel {
    border: 1px solid #cfd6df;
    background: #ffffff;
    color: #374151;
  }

  .ma-modal-btn.delete {
    border: 0;
    background: #e1272d;
    color: #ffffff;
  }

  .ma-toast-wrap {
    position: fixed;
    top: 86px;
    left: 50%;
    z-index: 400;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .ma-toast {
    min-height: 46px;
    padding: 0 24px;
    border-radius: 999px;
    color: #ffffff;
    background: #16a34a;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.25);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 800;
  }

  .ma-toast.deleted {
    background: #ef4444;
  }

  .ma-toast.submitted {
    background: #1d9bf0;
  }

  .ma-toast.updated {
    background: #16a34a;
  }

  @media (max-width: 1120px) {
    .ma-page {
      margin-left: 0;
      padding: 24px;
    }

    .ma-shell,
    .ma-top,
    .ma-grid {
      width: 100%;
      max-width: 100%;
    }

    .ma-top {
      flex-direction: column;
    }

    .ma-heading {
      width: 100%;
      flex-basis: auto;
    }

    .ma-tabs {
      width: min(600px, 100%);
      flex-basis: auto;
      margin-left: 0;
    }

    .ma-grid {
      grid-template-columns: repeat(2, 342px);
      justify-content: start;
    }
  }

  @media (max-width: 760px) {
    .ma-grid {
      grid-template-columns: 1fr;
    }

    .ma-card,
    .ma-new-card {
      width: 100%;
    }
  }
`;

const IconEdit = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconLike = () => (
  <svg
    viewBox="0 0 26 26"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 11v10" />
    <path d="M8 11H5.5A1.8 1.8 0 0 0 3.7 12.8v6.4A1.8 1.8 0 0 0 5.5 21H8" />
    <path d="M8 11l4.4-6.4c.6-.8 1.9-.4 1.9.7V10h5.2c1.3 0 2.2 1.1 1.9 2.4L20 18.8A2.7 2.7 0 0 1 17.4 21H8" />
  </svg>
);

const IconComment = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconPlus = () => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.3 2.2 2.2 4.8-5" />
  </svg>
);

function normalizeArticle(article) {
  const status = String(article.status || "draft").toLowerCase();
  const isRejected = status === "rejected";

  return {
    ...article,
    status,
    thumbnail:
      article.thumbnail ||
      article.image ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    image:
      article.image ||
      article.thumbnail ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    likes: Number(article.likes ?? article.reactions?.likes ?? 0),
    comments: Number(article.comments ?? article.reactions?.comments ?? 0),
    excerpt: article.excerpt || article.synopsis || "",
    rejectionReason: isRejected
      ? article.rejectionReason || "Artikel Terlalu Panjang Dan Bertele-tele"
      : null,
  };
}

function statusButtonLabel(status) {
  if (status === "draft") return "Submit to Admin";
  if (status === "published") return "Live on Site";
  if (status === "rejected") return "Rejected";
  return "Reviewing";
}

function toastText(type) {
  if (type === "deleted") return "Artikel Berhasil Dihapus";
  if (type === "submitted") return "Artikel Berhasil Dikirim";
  return "Artikel Berhasil Diperbarui";
}

function ArticleCard({
  article,
  onEdit,
  onDelete,
  onSubmit,
  onRejectedDetail,
}) {
  const isDraft = article.status === "draft";
  const isRejected = article.status === "rejected";
  const isPublished = article.status === "published";

  return (
    <article className="ma-card">
      <div
        className="ma-thumb"
        onClick={() => isRejected && onRejectedDetail(article)}
        style={{ cursor: isRejected ? "pointer" : "default" }}
      >
        <img src={article.thumbnail} alt={article.title} />
        <span className={`ma-badge ${article.status}`}>{article.status}</span>
      </div>

      <div className="ma-body">
        <h3 className="ma-card-title">{article.title}</h3>
        <p className="ma-excerpt">{article.excerpt}</p>

        <div className="ma-meta">
          <span>
            <IconLike />
            {article.likes}
          </span>
          <span>
            <IconComment />
            {article.comments}
          </span>
        </div>

        <div className="ma-footer">
          <div className="ma-actions">
            <button
              className="ma-icon-btn"
              type="button"
              onClick={() => onEdit(article)}
              title="Edit"
            >
              <IconEdit />
            </button>

            <button
              className="ma-icon-btn danger"
              type="button"
              onClick={() => onDelete(article)}
              title="Delete"
            >
              <IconTrash />
            </button>
          </div>

          <button
            className={`ma-status-btn${
              isDraft ? " submit" : isPublished ? " live" : ""
            }`}
            type="button"
            onClick={() => isDraft && onSubmit(article)}
          >
            {statusButtonLabel(article.status)}
          </button>
        </div>
      </div>
    </article>
  );
}

function NewArticleCard({ onClick }) {
  return (
    <button className="ma-new-card" type="button" onClick={onClick}>
      <span className="ma-new-inner">
        <span className="ma-new-icon">
          <IconPlus />
        </span>
        <span className="ma-new-title">Write New Article</span>
        <span className="ma-new-text">
          Draft a fresh story and reach your audience today.
        </span>
      </span>
    </button>
  );
}

export default function MyArticles() {
  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredArticles = useMemo(() => {
    if (activeTab === "All") return articles;

    return articles.filter(
      (article) => article.status === activeTab.toLowerCase(),
    );
  }, [activeTab, articles]);

  const showToast = (type) => {
    setToast(type);
    window.setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    let alive = true;

    fetchArticles({ author: "me" })
      .then((items) => {
        if (alive) setArticles(items.map(normalizeArticle));
      })
      .catch(() => {
        if (alive) setArticles([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const state = location.state || {};
    const hasState =
      state.toastType || state.updatedArticle || state.deletedArticleId;

    if (!hasState) return;

    if (state.updatedArticle) {
      const updatedArticle = normalizeArticle(state.updatedArticle);

      setArticles((current) => {
        const exists = current.some(
          (article) => article.id === updatedArticle.id,
        );

        if (!exists) return [updatedArticle, ...current];

        return current.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article,
        );
      });
    }

    if (state.deletedArticleId) {
      setArticles((current) =>
        current.filter((article) => article.id !== state.deletedArticleId),
      );
    }

    if (state.toastType) {
      showToast(state.toastType);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const openRejectedDetail = (article) => {
    navigate(`/edit-article/${article.id}`, {
      state: {
        article,
        viewRejected: true,
        forceEdit: false,
      },
    });
  };

  const openEditForm = (article) => {
    navigate(`/edit-article/${article.id}`, {
      state: {
        article,
        viewRejected: false,
        forceEdit: true,
      },
    });
  };

  const handleEdit = (article) => {
    if (article.status === "rejected") {
      openRejectedDetail(article);
      return;
    }

    openEditForm(article);
  };

  const handleRejectedDetail = (article) => {
    openRejectedDetail(article);
  };

  const handleSubmit = (article) => {
    updateArticle(article.apiId || article.id, { status: "pending" }).catch(() => {});

    setArticles((current) =>
      current.map((item) =>
        item.id === article.id ? { ...item, status: "pending" } : item,
      ),
    );

    showToast("submitted");
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteArticle(deleteTarget.apiId || deleteTarget.id).catch(() => {});

    setArticles((current) =>
      current.filter((article) => article.id !== deleteTarget.id),
    );

    setDeleteTarget(null);
    showToast("deleted");
  };

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div className="ma-toast-wrap">
          <div className={`ma-toast ${toast}`}>
            <IconCheck />
            {toastText(toast)}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="ma-modal-layer" onClick={() => setDeleteTarget(null)}>
          <div
            className="ma-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ma-modal-body">
              <div className="ma-modal-icon">
                <IconTrash />
              </div>

              <div>
                <h2 className="ma-modal-title">Hapus Artikel?</h2>
                <p className="ma-modal-text">
                  Apakah Anda yakin ingin menghapus artikel ini?
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="ma-modal-footer">
              <button
                className="ma-modal-btn cancel"
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>

              <button
                className="ma-modal-btn delete"
                type="button"
                onClick={handleDeleteConfirm}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="ma-page">
        <div className="ma-shell">
          <section className="ma-top">
            <div className="ma-heading">
              <h1 className="ma-title">My Articles</h1>
              <p className="ma-subtitle">
                Manage and track your editorial contributions.
              </p>
            </div>

            <div className="ma-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`ma-tab${activeTab === tab ? " active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="ma-grid">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onSubmit={handleSubmit}
                onRejectedDetail={handleRejectedDetail}
              />
            ))}

            <NewArticleCard onClick={() => navigate("/write-news")} />
          </section>
        </div>
      </main>
    </>
  );
}
