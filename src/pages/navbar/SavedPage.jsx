// src/pages/SavedPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBookmark, getAccessToken, updateBookmark } from "../../services/api";
import { useBookmarks } from "../../hooks/useApiData";

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&display=swap");

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
    background: #f6f9fd;
  }

  .saved-page,
  .saved-page * {
    box-sizing: border-box;
  }

  .saved-page {
    background: #f6f9fd;
    font-family: "Inter", sans-serif;
    color: #111827;
    margin: 0;
  }

  .saved-page a {
    text-decoration: none;
  }

  .saved-inner {
    width: min(980px, calc(100% - 64px));
    margin: 0 auto;
  }

  .saved-page + footer,
  .saved-page + .footer,
  .saved-page + .site-footer {
    margin-top: 0 !important;
  }

  /* =========================
      BELUM LOGIN
  ========================= */

  .saved-auth-page {
    min-height: calc(100vh - 72px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 32px 120px;
  }

  .saved-auth-card {
    width: min(920px, 100%);
    min-height: 165px;
    border-radius: 38px;
    background: linear-gradient(100deg, #152657 0%, #7281b5 100%);
    box-shadow: 0 8px 10px rgba(15, 23, 42, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .saved-auth-title {
    margin: 0 0 24px;
    color: #ffffff;
    font-size: clamp(26px, 2.4vw, 36px);
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0.01em;
    text-align: center;
  }

  .saved-auth-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .saved-auth-btn {
    height: 31px;
    min-width: 78px;
    border: 0;
    border-radius: 999px;
    padding: 0 20px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .saved-auth-btn:hover {
    transform: translateY(-1px);
  }

  .saved-login-btn {
    background: #edf4ff;
    color: #172554;
  }

  .saved-register-btn {
    background: #e94b82;
    color: #ffffff;
  }

  /* =========================
      LOGIN TAPI KOSONG
  ========================= */

  .saved-empty-page {
    min-height: calc(100vh - 72px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 150px 24px 90px;
  }

  .saved-empty-content {
    width: min(680px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .saved-oops-img {
    width: min(350px, 70vw);
    height: auto;
    display: block;
    margin-bottom: 36px;
  }

  .saved-hand-img {
    width: min(360px, 70vw);
    height: auto;
    display: block;
    margin-bottom: 38px;
  }

  .saved-empty-title {
    margin: 0 0 30px;
    color: #18245a;
    font-size: clamp(25px, 2.8vw, 38px);
    line-height: 1.15;
    font-weight: 900;
    letter-spacing: -0.03em;
    text-shadow: 0 4px 3px rgba(24, 36, 90, 0.18);
  }

  .saved-add-btn {
    width: min(280px, 70vw);
    height: 70px;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(90deg, #5ca5c4 0%, #b9deed 100%);
    color: #ffffff;
    font-size: clamp(26px, 2.8vw, 38px);
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 5px 4px rgba(15, 23, 42, 0.3);
    transition: transform 0.2s ease;
  }

  .saved-add-btn:hover {
    transform: translateY(-2px);
  }

  /* =========================
      ADA SAVED NEWS
  ========================= */

  .saved-list-page {
    min-height: calc(100vh - 72px);
    padding: 54px 0 70px;
  }

  .saved-title {
    margin: 0 0 48px;
    color: #172252;
    font-size: clamp(42px, 4vw, 58px);
    line-height: 1;
    font-weight: 900;
    letter-spacing: -0.075em;
    text-shadow: 0 5px 4px rgba(23, 34, 82, 0.22);
  }

  .saved-tabs {
    display: flex;
    align-items: center;
    gap: 34px;
    padding-left: 12px;
    margin-bottom: 13px;
  }

  .saved-tab {
    position: relative;
    border: 0;
    background: transparent;
    padding: 0 0 13px;
    color: #5d4b4b;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.17em;
    cursor: pointer;
  }

  .saved-tab.active {
    color: #9b1c24;
  }

  .saved-tab.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 36px;
    height: 2px;
    background: #9b1c24;
  }

  .saved-top-line {
    height: 1px;
    background: #8b9bb1;
    opacity: 0.75;
    margin-bottom: 26px;
  }

  .saved-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .saved-item {
    display: grid;
    grid-template-columns: 245px minmax(0, 1fr);
    gap: 30px;
    align-items: start;
    padding: 0 0 60px;
  }

  .saved-item:last-child {
    padding-bottom: 20px;
  }

  .saved-item-img {
    width: 245px;
    height: 118px;
    object-fit: cover;
    display: block;
    background: #e2e8f0;
  }

  .saved-item-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: #8b7c7f;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .saved-item-category {
    color: #b12a3a;
  }

  .saved-item-dot {
    color: #b6aaad;
  }

  .saved-item-title {
    margin: 0 0 15px;
    max-width: 620px;
    color: #252529;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(22px, 2vw, 29px);
    line-height: 1.08;
    font-weight: 500;
    letter-spacing: -0.035em;
  }

  .saved-item-desc {
    margin: 0 0 24px;
    max-width: 560px;
    color: #625f64;
    font-size: 12.5px;
    line-height: 1.55;
    font-weight: 600;
  }

  .saved-item-actions {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .saved-small-action {
    border: 0;
    background: transparent;
    color: #8d8588;
    padding: 0;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .saved-small-action:hover {
    color: #172252;
  }

  .saved-action-icon {
    width: 10px;
    height: 10px;
    display: inline-block;
  }

  .saved-list-empty {
    padding: 70px 0;
    color: #64748b;
    font-size: 14px;
    text-align: center;
  }

  @media (max-width: 900px) {
    .saved-inner {
      width: calc(100% - 40px);
    }

    .saved-list-page {
      padding-top: 44px;
    }

    .saved-title {
      font-size: 48px;
      margin-bottom: 42px;
    }

    .saved-item {
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 24px;
      padding-bottom: 52px;
    }

    .saved-item-img {
      width: 220px;
      height: 112px;
    }

    .saved-item-title {
      font-size: 25px;
    }
  }

  @media (max-width: 680px) {
    .saved-inner {
      width: calc(100% - 28px);
    }

    .saved-list-page {
      padding-top: 34px;
      padding-bottom: 48px;
    }

    .saved-title {
      font-size: 40px;
      margin-bottom: 34px;
    }

    .saved-tabs {
      gap: 24px;
      padding-left: 0;
    }

    .saved-tab {
      font-size: 12px;
    }

    .saved-item {
      grid-template-columns: 1fr;
      gap: 17px;
      padding-bottom: 44px;
    }

    .saved-item-img {
      width: 100%;
      height: 200px;
    }

    .saved-item-title {
      font-size: 25px;
    }

    .saved-item-desc {
      font-size: 13px;
    }

    .saved-auth-page {
      padding: 110px 18px 120px;
    }

    .saved-auth-card {
      min-height: 160px;
      border-radius: 28px;
      padding: 28px 18px;
    }

    .saved-auth-title {
      font-size: 25px;
      margin-bottom: 20px;
    }

    .saved-empty-page {
      padding-top: 120px;
      padding-bottom: 80px;
    }

    .saved-oops-img {
      margin-bottom: 30px;
    }

    .saved-hand-img {
      margin-bottom: 34px;
    }

    .saved-add-btn {
      height: 64px;
    }
  }
`;

const IconTrash = () => (
  <svg
    className="saved-action-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 15H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const IconArchive = () => (
  <svg
    className="saved-action-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8v13H3V8" />
    <path d="M1 3h22v5H1z" />
    <path d="M10 13h4" />
  </svg>
);

export default function SavedPage() {
  const { bookmarks, setBookmarks } = useBookmarks();
  const [isLoggedIn] = useState(Boolean(getAccessToken()));
  const [activeTab, setActiveTab] = useState("all");
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    setSavedItems(bookmarks);
  }, [bookmarks]);

  const hasSavedNews = savedItems.length > 0;

  const visibleNews = useMemo(() => {
    if (activeTab === "archived") {
      return savedItems.filter((item) => item.archived === true);
    }

    return savedItems;
  }, [activeTab, savedItems]);

  const handleRemove = async (id) => {
    const nextItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(nextItems);
    setBookmarks(nextItems);
    await deleteBookmark(id);
  };

  const handleArchive = async (id) => {
    const nextItems = savedItems.map((item) =>
      item.id === id ? { ...item, archived: true } : item
    );

    setSavedItems(nextItems);
    setBookmarks(nextItems);
    await updateBookmark(id, { is_archived: true });

    setActiveTab("archived");
  };

  const handleUnarchive = async (id) => {
    const nextItems = savedItems.map((item) =>
      item.id === id ? { ...item, archived: false } : item
    );

    setSavedItems(nextItems);
    setBookmarks(nextItems);
    await updateBookmark(id, { is_archived: false });

    setActiveTab("all");
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{css}</style>

        <main className="saved-page saved-auth-page">
          <section className="saved-auth-card">
            <h1 className="saved-auth-title">
              Ingin Menambahkan Daftar Bacaan?
            </h1>

            <div className="saved-auth-actions">
              <Link to="/signin" className="saved-auth-btn saved-login-btn">
                Login
              </Link>

              <Link to="/register" className="saved-auth-btn saved-register-btn">
                Register
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (!hasSavedNews) {
    return (
      <>
        <style>{css}</style>

        <main className="saved-page saved-empty-page">
          <section className="saved-empty-content">
            <img
              src="/img/Oooopsss!!.png"
              alt="Oooopsss!!"
              className="saved-oops-img"
            />

            <img
              src="/img/tangan.png"
              alt="Ilustrasi tangan dan buku"
              className="saved-hand-img"
            />

            <h1 className="saved-empty-title">
              Anda Belum Memiliki Daftar Bacaan
            </h1>

            <button
              type="button"
              className="saved-add-btn"
              onClick={() => setActiveTab("all")}
            >
              Tambah
            </button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <main className="saved-page saved-list-page">
        <div className="saved-inner">
          <h1 className="saved-title">Saved News</h1>

          <div className="saved-tabs">
            <button
              type="button"
              className={`saved-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              ALL
            </button>

            <button
              type="button"
              className={`saved-tab ${
                activeTab === "archived" ? "active" : ""
              }`}
              onClick={() => setActiveTab("archived")}
            >
              ARCHIVED
            </button>
          </div>

          <div className="saved-top-line" />

          <section className="saved-list">
            {visibleNews.length === 0 ? (
              <div className="saved-list-empty">
                Belum ada artikel pada tab ini.
              </div>
            ) : (
              visibleNews.map((item) => (
                <article className="saved-item" key={item.id}>
                  <img
                    src={item.image || item.thumbnail}
                    alt={item.title}
                    className="saved-item-img"
                  />

                  <div className="saved-item-body">
                    <div className="saved-item-meta">
                      <span className="saved-item-category">
                        {item.category}
                      </span>
                      <span className="saved-item-dot">•</span>
                      <span>{item.date}</span>
                    </div>

                    <h2 className="saved-item-title">{item.title}</h2>

                    {/* REVISI DI SINI: Membaca dari data hasil normalisasi yang pas */}
                    <p className="saved-item-desc">{item.excerpt || item.synopsis || "Deskripsi tidak tersedia."}</p>

                    <div className="saved-item-actions">
                      <button
                        type="button"
                        className="saved-small-action"
                        onClick={() => handleRemove(item.id)}
                      >
                        <IconTrash />
                        Remove
                      </button>

                      {item.archived ? (
                        <button
                          type="button"
                          className="saved-small-action"
                          onClick={() => handleUnarchive(item.id)}
                        >
                          <IconArchive />
                          Unarchive
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="saved-small-action"
                          onClick={() => handleArchive(item.id)}
                        >
                          <IconArchive />
                          Archive
                        </button>
                      )}
                    </div>
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