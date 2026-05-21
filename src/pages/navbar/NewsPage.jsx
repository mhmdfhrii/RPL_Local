// src/pages/NewsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useApiData";
import { fetchCategories, getAccessToken } from "../../services/api"; // <--- Ambil kurir pembaca token kelompok lu
import NewsletterBox from "../../components/Newsletter";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const pageCss = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&display=swap");

  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    background: #f5f8fc;
  }

  .news-page-wrapper,
  .news-page-wrapper * {
    box-sizing: border-box;
  }

  .news-page-wrapper {
    width: 100%;
    background: #f5f8fc;
    color: #111827;
    font-family: "Inter", sans-serif;
    margin: 0 !important;
    padding: 0 !important;
  }

  .news-page-wrapper a {
    color: inherit;
    text-decoration: none;
  }

  .category-nav-wrapper {
    width: 100%;
    background: #f5f8fc;
    border-top: 1px solid #d7dde6;
    border-bottom: 1px solid #cfd6df;
    margin: 0;
  }

  .category-nav-content {
    width: min(1180px, calc(100% - 72px));
    height: 46px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 22px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .category-nav-content::-webkit-scrollbar {
    display: none;
  }

  .sections-label {
    color: #7b8796;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    white-space: nowrap;
  }

  .category-link {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    padding: 0;
    padding-bottom: 8px;
    color: #6b7280;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    box-shadow: none;
  }

  .category-link.active {
    color: #061e34;
  }

  .category-link.active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    height: 2px;
    background: #061e34;
  }

  .news-container {
    width: min(1180px, calc(100% - 72px));
    margin: 0 auto !important;
    padding: 58px 0 42px !important;
    background: #f5f8fc;
  }

  .featured-article {
    margin-bottom: 72px;
  }

  .featured-link-wrapper {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 42px;
    color: inherit;
    text-decoration: none;
    align-items: center;
  }

  .featured-image-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 28px;
    box-shadow: 0 18px 35px rgba(15, 23, 42, 0.1);
  }

  .headline-img-large {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
  }

  .featured-content .category-tag {
    display: inline-block;
    margin-bottom: 14px;
    color: #004da3;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .featured-content h1 {
    margin: 0 0 18px;
    color: #111827;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 44px;
    line-height: 1.08;
    font-weight: 500;
    letter-spacing: -0.035em;
  }

  .featured-content p {
    margin: 0 0 26px;
    color: #4b5563;
    font-size: 15px;
    line-height: 1.75;
  }

  .author-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .author-avatar {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    object-fit: cover;
  }

  .meta-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .author-name {
    color: #111827;
    font-size: 12px;
    font-weight: 800;
  }

  .post-date {
    margin: 0 !important;
    color: #6b7280 !important;
    font-size: 10px !important;
    line-height: 1.2 !important;
    text-transform: uppercase;
  }

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 58px 44px;
  }

  .article-card {
    min-width: 0;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .card-cat {
    color: #061e34 !important;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: -0.02em;
    text-transform: capitalize;
  }

  .lihat-semua {
    appearance: none;
    -webkit-appearance: none;
    border: 0 !important;
    outline: 0 !important;
    background: transparent !important;
    padding: 0;
    margin: 0;
    color: #0072df;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: none !important;
  }

  .lihat-semua:hover {
    text-decoration: underline;
  }

  .article-card-link {
    color: inherit;
    text-decoration: none;
    display: block;
  }

  .article-card-link:visited,
  .article-card-link:hover,
  .article-card-link:active {
    color: inherit;
    text-decoration: none;
  }

  .article-img-standard {
    width: 100%;
    height: 210px;
    object-fit: cover;
    display: block;
    border-radius: 18px;
    background: #dbe3ed;
  }

  .article-card-title {
    margin: 28px 0 16px;
    color: #111827 !important;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 26px;
    line-height: 1.16;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .article-card-desc {
    margin: 0;
    color: #374151;
    font-size: 15px;
    line-height: 1.65;
  }

  .news-list-vertical {
    width: 100%;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }

  .category-list-item {
    border-bottom: 1px solid #d8dee7;
    padding: 0 0 42px;
    margin-bottom: 42px;
  }

  .category-list-item:last-of-type {
    margin-bottom: 0;
  }

  .list-item-link {
    display: grid;
    grid-template-columns: 292px minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    color: inherit;
    text-decoration: none;
  }

  .list-item-link:visited,
  .list-item-link:hover,
  .list-item-link:active {
    color: inherit;
    text-decoration: none;
  }

  .list-image-container {
    width: 292px;
    height: 210px;
    overflow: hidden;
    background: #dbe3ed;
  }

  .list-image-container .article-img-standard {
    width: 292px;
    height: 210px;
    border-radius: 0;
  }

  .list-content-container {
    min-width: 0;
  }

  .list-date {
    display: block;
    margin-bottom: 12px;
    color: #0f4c81;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .list-title {
    margin: 0 0 14px;
    color: #171b22;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 34px;
    line-height: 1.08;
    font-weight: 500;
    letter-spacing: -0.035em;
  }

  .list-desc {
    max-width: 760px;
    margin: 0 0 18px;
    color: #536173;
    font-size: 14px;
    line-height: 1.65;
    font-weight: 500;
  }

  .list-footer-meta {
    display: flex;
    align-items: center;
    gap: 18px;
    color: #111827;
    font-size: 10px;
    font-weight: 700;
  }

  .list-footer-meta .author-name,
  .list-footer-meta .read-time {
    color: #111827;
    font-size: 10px;
    font-weight: 700;
  }

  .pagination-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    padding-top: 34px;
    padding-bottom: 70px;
    margin-bottom: 0;
  }

  .page-number,
  .btn-next {
    height: 34px;
    min-width: 34px;
    border: 1px solid #ccd4df;
    background: #ffffff;
    color: #6b7280;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .page-number.active {
    background: #10275b;
    color: #ffffff;
    border-color: #10275b;
  }

  .page-number:disabled,
  .btn-next:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .page-dots {
    color: #6b7280;
    font-size: 12px;
    padding: 0 4px;
  }

  .btn-next {
    min-width: 118px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .newsletter-wrapper {
    margin-top: 92px;
    margin-bottom: 0 !important;
  }

  .news-page-wrapper + footer,
  .news-page-wrapper + .footer,
  .news-page-wrapper + .site-footer,
  .news-page-wrapper ~ footer,
  .news-page-wrapper ~ .footer,
  .news-page-wrapper ~ .site-footer {
    margin-top: 0 !important;
  }

  footer,
  .footer,
  .site-footer {
    margin-top: 0 !important;
  }

  @media (max-width: 1024px) {
    .category-nav-content,
    .news-container {
      width: calc(100% - 44px);
    }

    .featured-link-wrapper {
      grid-template-columns: 1fr;
    }

    .headline-img-large {
      height: 320px;
    }

    .articles-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .list-item-link {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 26px;
    }

    .list-image-container,
    .list-image-container .article-img-standard {
      width: 250px;
      height: 180px;
    }

    .list-title {
      font-size: 28px;
    }
  }

  @media (max-width: 720px) {
    .category-nav-content,
    .news-container {
      width: calc(100% - 28px);
    }

    .news-container {
      padding-top: 38px !important;
      padding-bottom: 32px !important;
    }

    .articles-grid {
      grid-template-columns: 1fr;
    }

    .article-img-standard {
      height: 220px;
    }

    .list-item-link {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .list-image-container,
    .list-image-container .article-img-standard {
      width: 100%;
      height: 220px;
    }

    .list-title {
      font-size: 25px;
    }

    .pagination-container {
      justify-content: center;
      padding-bottom: 56px;
      flex-wrap: wrap;
    }
  }
`;

export default function NewsPage() {
  const { articles, loading, error } = useArticles();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categoryTabs, setCategoryTabs] = useState(["ALL"]);

  // REVISI SENSOR LOGIN: Otomatis mendeteksi status akses dari token asli di localStorage kelompok lu
  const isLoggedIn = Boolean(getAccessToken());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const isAll = activeCategory === "ALL";

  useEffect(() => {
    let alive = true;

    fetchCategories()
      .then((items) => {
        if (!alive) return;

        const dynamicCategories = items
          .map((item) => item.name)
          .filter(Boolean);

        setCategoryTabs(["ALL", ...dynamicCategories]);
      })
      .catch(() => {
        if (!alive) return;

        const categoriesFromArticles = Array.from(
          new Set(articles.map((item) => item.category).filter(Boolean)),
        );
        setCategoryTabs(["ALL", ...categoriesFromArticles]);
      });

    return () => {
      alive = false;
    };
  }, [articles]);

  const filteredData = useMemo(() => {
    if (isAll) return articles;

    return articles.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, isAll, articles]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const categoryArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const featuredArticle = filteredData[0];
  const gridArticles = filteredData.slice(1, 7);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageError = (event) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const getPaginationNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3];
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <>
      <style>{pageCss}</style>

      <div className="news-page-wrapper">
        <nav className="category-nav-wrapper">
          <div className="category-nav-content">
            <span className="sections-label">SECTIONS:</span>

            {categoryTabs.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`category-link ${
                  activeCategory === cat ? "active" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        <main className="news-container">
          {loading && <div className="trending-empty">Memuat berita...</div>}
          {!loading && error && (
            <div className="trending-empty">{error}</div>
          )}
          {!loading && !error && filteredData.length === 0 && (
            <div className="trending-empty">Belum ada berita dari database.</div>
          )}

          {!loading && !error && filteredData.length > 0 && isAll ? (
            <>
              {featuredArticle && (
                <section className="featured-article">
                  <Link
                    to={`/news/${featuredArticle.id}`}
                    className="featured-link-wrapper"
                  >
                    <div className="featured-image-wrapper">
                      <img
                        src={
                          featuredArticle.image ||
                          featuredArticle.thumbnail ||
                          featuredArticle.cover ||
                          FALLBACK_IMAGE
                        }
                        alt={featuredArticle.title}
                        className="headline-img-large"
                        onError={handleImageError}
                      />
                    </div>

                    <div className="featured-content">
                      <span className="category-tag">
                        {featuredArticle.category}
                      </span>

                      <h1>{featuredArticle.title}</h1>

                      <p>
                        {featuredArticle.description ||
                          featuredArticle.excerpt ||
                          featuredArticle.summary ||
                          "Deskripsi artikel belum tersedia."}
                      </p>

                      <div className="author-meta">
                        <img
                          src={
                            featuredArticle.authorImage ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                          }
                          alt={featuredArticle.author || "Author"}
                          className="author-avatar"
                          onError={handleImageError}
                        />

                        <div className="meta-text">
                          <strong className="author-name">
                            {featuredArticle.author || "Redaksi Paham.ID"}
                          </strong>

                          <p className="post-date">
                            {featuredArticle.date || "12 Mei 2024"} •{" "}
                            {featuredArticle.readTime || "4 MIN READ"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              <div className="articles-grid">
                {gridArticles.map((article) => (
                  <article key={article.id} className="article-card">
                    <div className="card-top">
                      <span className="card-cat">{article.category}</span>

                      <button
                        type="button"
                        className="lihat-semua"
                        onClick={() =>
                          handleCategoryChange(article.category || "ALL")
                        }
                      >
                        LIHAT SEMUA
                      </button>
                    </div>

                    <Link
                      to={`/news/${article.id}`}
                      className="article-card-link"
                    >
                      <img
                        src={
                          article.image ||
                          article.thumbnail ||
                          article.cover ||
                          FALLBACK_IMAGE
                        }
                        alt={article.title}
                        className="article-img-standard"
                        onError={handleImageError}
                      />

                      <h3 className="article-card-title">{article.title}</h3>
                    </Link>

                    <p className="article-card-desc">
                      {article.description ||
                        article.excerpt ||
                        article.summary ||
                        "Deskripsi artikel belum tersedia."}
                    </p>
                  </article>
                ))}
              </div>

              {!isLoggedIn && <NewsletterBox />}
            </>
          ) : !loading && !error && filteredData.length > 0 ? (
            <>
              <div className="news-list-vertical">
                {categoryArticles.map((article) => (
                  <div key={article.id} className="category-list-item">
                    <Link to={`/news/${article.id}`} className="list-item-link">
                      <div className="list-image-container">
                        <img
                          src={
                            article.image ||
                            article.thumbnail ||
                            article.cover ||
                            FALLBACK_IMAGE
                          }
                          alt={article.title}
                          className="article-img-standard"
                          onError={handleImageError}
                        />
                      </div>

                      <div className="list-content-container">
                        <span className="list-date">
                          {article.date || "08 OKT 2025"}
                        </span>

                        <h2 className="list-title">{article.title}</h2>

                        <p className="list-desc">
                          {article.description ||
                            article.excerpt ||
                            article.summary ||
                            "Deskripsi artikel belum tersedia."}
                        </p>

                        <div className="list-footer-meta">
                          <span className="author-name">
                            ♙ {article.author || "Redaksi Paham.ID"}
                          </span>

                          <span className="read-time">
                            ◷ {article.readTime || "2 min read"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                {isLoggedIn && (
                  <div className="pagination-container">
                    <button
                      type="button"
                      className="btn-next"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      ←
                    </button>

                    {getPaginationNumbers().map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`page-number ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <span className="page-dots">...</span>
                    )}

                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <button
                        type="button"
                        className="page-number"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-next"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      BERIKUTNYA →
                    </button>
                  </div>
                )}
              </div>

              {!isLoggedIn && <NewsletterBox />}
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}
