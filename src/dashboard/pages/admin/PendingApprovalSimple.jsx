import { useEffect, useMemo, useState } from "react";
import { fetchArticles, updateArticle } from "../../services/api";

const css = `
  .pa-simple {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 32px 48px 56px;
    background: #fbfaf9;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827;
  }

  .pa-simple-shell {
    max-width: 1080px;
    margin: 0 auto;
  }

  .pa-simple-title {
    margin: 0 0 8px;
    color: #162052;
    font-size: 30px;
    font-weight: 800;
  }

  .pa-simple-subtitle {
    margin: 0 0 28px;
    color: #64748b;
    font-size: 15px;
  }

  .pa-simple-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 18px;
  }

  .pa-simple-count,
  .pa-simple-panel {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  }

  .pa-simple-count {
    padding: 18px 22px;
    color: #1f316f;
    font-weight: 800;
  }

  .pa-simple-search {
    width: min(360px, 100%);
    height: 42px;
    border: 1px solid #d8dee8;
    border-radius: 9px;
    padding: 0 14px;
    font: 500 14px/1 'Plus Jakarta Sans', sans-serif;
  }

  .pa-simple-panel {
    overflow: hidden;
  }

  .pa-simple-head,
  .pa-simple-row {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) 170px 150px 210px;
    gap: 18px;
    align-items: center;
  }

  .pa-simple-head {
    padding: 18px 22px;
    background: #263875;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
  }

  .pa-simple-row {
    padding: 20px 22px;
    border-bottom: 1px solid #eef2f7;
  }

  .pa-simple-row:last-child {
    border-bottom: 0;
  }

  .pa-simple-article {
    display: flex;
    gap: 14px;
    align-items: center;
    min-width: 0;
  }

  .pa-simple-thumb {
    width: 72px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    background: #e5e7eb;
    flex: 0 0 72px;
  }

  .pa-simple-article h3 {
    margin: 0 0 6px;
    color: #111827;
    font-size: 15px;
    line-height: 1.35;
  }

  .pa-simple-article p,
  .pa-simple-meta {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  .pa-simple-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .pa-simple-btn {
    height: 36px;
    border: 0;
    border-radius: 8px;
    padding: 0 14px;
    color: #ffffff;
    cursor: pointer;
    font: 800 13px/1 'Plus Jakarta Sans', sans-serif;
  }

  .pa-simple-approve {
    background: #15803d;
  }

  .pa-simple-reject {
    background: #b91c1c;
  }

  .pa-simple-empty {
    padding: 42px 22px;
    color: #64748b;
    text-align: center;
  }

  @media (max-width: 920px) {
    .pa-simple {
      margin-left: 0;
      padding: 24px;
    }

    .pa-simple-head {
      display: none;
    }

    .pa-simple-row {
      grid-template-columns: 1fr;
    }

    .pa-simple-actions {
      justify-content: flex-start;
    }
  }
`;

export default function PendingApprovalSimple() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadPending = () => {
    setLoading(true);
    fetchArticles({ all: "true", status: "pending" })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;

    return items.filter((item) =>
      [item.title, item.author, item.category].join(" ").toLowerCase().includes(needle),
    );
  }, [items, query]);

  const changeStatus = async (article, status) => {
    await updateArticle(article.apiId || article.id, {
      status,
      feedback_admin:
        status === "rejected" ? "Artikel ditolak oleh admin." : null,
    });

    setItems((current) => current.filter((item) => item.id !== article.id));
    setMessage(
      status === "published"
        ? "Artikel berhasil diterbitkan."
        : "Artikel berhasil ditolak.",
    );
    window.setTimeout(() => setMessage(""), 2400);
  };

  return (
    <>
      <style>{css}</style>
      <main className="pa-simple">
        <div className="pa-simple-shell">
          <h1 className="pa-simple-title">Persetujuan Artikel</h1>
          <p className="pa-simple-subtitle">
            Tinjau artikel berstatus pending dari database.
          </p>

          <div className="pa-simple-toolbar">
            <div className="pa-simple-count">
              {loading ? "Memuat..." : `${visibleItems.length} artikel pending`}
            </div>
            <input
              className="pa-simple-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari antrean..."
            />
          </div>

          {message && <div className="pa-simple-count">{message}</div>}

          <section className="pa-simple-panel">
            <div className="pa-simple-head">
              <span>Artikel</span>
              <span>Penulis</span>
              <span>Kategori</span>
              <span>Aksi</span>
            </div>

            {visibleItems.length === 0 ? (
              <div className="pa-simple-empty">
                {loading ? "Memuat antrean..." : "Belum ada artikel pending."}
              </div>
            ) : (
              visibleItems.map((article) => (
                <article className="pa-simple-row" key={article.id}>
                  <div className="pa-simple-article">
                    <img
                      className="pa-simple-thumb"
                      src={article.thumbnail || article.image}
                      alt=""
                    />
                    <div>
                      <h3>{article.title}</h3>
                      <p>{article.excerpt || article.synopsis || "Tanpa ringkasan."}</p>
                    </div>
                  </div>
                  <div className="pa-simple-meta">{article.author}</div>
                  <div className="pa-simple-meta">{article.category}</div>
                  <div className="pa-simple-actions">
                    <button
                      className="pa-simple-btn pa-simple-approve"
                      type="button"
                      onClick={() => changeStatus(article, "published")}
                    >
                      Setujui
                    </button>
                    <button
                      className="pa-simple-btn pa-simple-reject"
                      type="button"
                      onClick={() => changeStatus(article, "rejected")}
                    >
                      Tolak
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </>
  );
}
