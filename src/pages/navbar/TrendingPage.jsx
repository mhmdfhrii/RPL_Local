import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useApiData";

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap");

  .trending-page-container,
  .trending-page-container * {
    box-sizing: border-box;
  }

  .trending-page-container {
    width: 100%;
    background: #f6f9fd;
    color: #071927;
    font-family: "Inter", sans-serif;
    padding: 42px 0 36px;
  }

  .trending-content-wrapper {
    width: min(1180px, calc(100% - 72px));
    margin: 0 auto;
  }

  .trending-page-header {
    margin-bottom: 62px;
  }

  .trending-main-title {
    margin: 0;
    color: #071927;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(56px, 5.2vw, 78px);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.045em;
  }

  .trending-filter-row {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-top: 28px;
    flex-wrap: wrap;
  }

  .filter-pill {
    height: 40px;
    min-width: 116px;
    padding: 0 24px;
    border: 1px solid #dce4ef;
    border-radius: 999px;
    background: #ffffff;
    color: #74839b;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
    transition: 0.2s ease;
  }

  .filter-pill:hover {
    transform: translateY(-1px);
  }

  .filter-pill.active {
    background: #041f39;
    color: #ffffff;
    border-color: #041f39;
    box-shadow: 0 10px 20px rgba(4, 31, 57, 0.22);
  }

  .trending-news-list {
    display: flex;
    flex-direction: column;
  }

  .trending-card-link {
    color: inherit;
    text-decoration: none;
    display: block;
  }

  .trending-news-card {
    display: grid;
    grid-template-columns: 285px minmax(0, 1fr);
    gap: 42px;
    align-items: center;
    padding: 0 0 54px;
    margin-bottom: 54px;
    border-bottom: 1px solid #eadde1;
  }

  /* Ini yang ngilangin garis di atas Load More */
  .trending-card-link.last-visible-card .trending-news-card {
    border-bottom: none;
    margin-bottom: 28px;
    padding-bottom: 28px;
  }

  .trending-image-box {
    position: relative;
    width: 285px;
    height: 150px;
    background: #dbe3ed;
    overflow: hidden;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .trending-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .badge-trending {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    height: 28px;
    padding: 0 14px;
    background: #c8104f;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", sans-serif;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.03em;
    line-height: 1;
    box-shadow: 0 8px 16px rgba(200, 16, 79, 0.18);
  }

  .trending-text-box {
    min-width: 0;
  }

  .trending-news-category {
    display: block;
    margin-bottom: 12px;
    color: #b61d37;
    font-family: "Inter", sans-serif;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .trending-news-headline {
    margin: 0 0 18px;
    max-width: 820px;
    color: #171b22;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(27px, 2.3vw, 35px);
    font-weight: 600;
    line-height: 1.14;
    letter-spacing: -0.035em;
  }

  .trending-news-summary {
    margin: 0;
    max-width: 850px;
    color: #42536b;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.7;
  }

  .load-more-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .load-more-btn {
    height: 42px;
    min-width: 124px;
    border: none;
    border-radius: 7px;
    background: #041f39;
    color: #ffffff;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(4, 31, 57, 0.24);
    transition: 0.2s ease;
  }

  .load-more-btn:hover {
    transform: translateY(-1px);
    background: #0a2744;
  }

  .trending-empty {
    padding: 42px 0;
    color: #64748b;
    text-align: center;
    font-size: 14px;
  }

  /*
    Ini buat bantu ngilangin gap putih sebelum footer.
    Kalau footer kamu punya class lain, tinggal samain background footer-nya ke #e9eef4 / warna footer asli kamu.
  */
  .trending-page-container + footer,
  .trending-page-container + .footer,
  .trending-page-container + .site-footer {
    margin-top: 0 !important;
  }

  @media (max-width: 1100px) {
    .trending-content-wrapper {
      width: calc(100% - 48px);
    }

    .trending-news-card {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 30px;
    }

    .trending-image-box {
      width: 250px;
      height: 135px;
    }

    .trending-news-headline {
      font-size: 28px;
    }

    .trending-news-summary {
      font-size: 13px;
    }
  }

  @media (max-width: 760px) {
    .trending-page-container {
      padding: 30px 0 36px;
    }

    .trending-content-wrapper {
      width: calc(100% - 28px);
    }

    .trending-page-header {
      margin-bottom: 42px;
    }

    .trending-main-title {
      font-size: 42px;
    }

    .trending-filter-row {
      gap: 10px;
      margin-top: 22px;
    }

    .filter-pill {
      height: 34px;
      min-width: 92px;
      padding: 0 16px;
      font-size: 10px;
    }

    .trending-news-card {
      grid-template-columns: 1fr;
      gap: 20px;
      padding-bottom: 38px;
      margin-bottom: 38px;
    }

    .trending-card-link.last-visible-card .trending-news-card {
      padding-bottom: 22px;
      margin-bottom: 22px;
    }

    .trending-image-box {
      width: 100%;
      height: 210px;
    }

    .trending-news-headline {
      font-size: 26px;
      line-height: 1.18;
    }

    .trending-news-summary {
      font-size: 13px;
      line-height: 1.65;
    }
  }
`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

export default function TrendingPage() {
  const { articles } = useArticles();
  const [timeFilter, setTimeFilter] = useState("TODAY");
  const [visibleCount, setVisibleCount] = useState(4);

  const baseData = useMemo(() => {
    const data = Array.isArray(articles) ? articles : [];

    if (timeFilter === "TODAY") {
      return data;
    }

    if (timeFilter === "THIS WEEK") {
      return [...data.slice(2), ...data.slice(0, 2)];
    }

    if (timeFilter === "THIS MONTH") {
      return [...data].sort(
        (a, b) => Number(b.reads || 0) - Number(a.reads || 0)
      );
    }

    return data;
  }, [timeFilter, articles]);

  const visibleNews = baseData.slice(0, visibleCount);
  const hasMore = visibleCount < baseData.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, baseData.length));
  };

  const handleFilterChange = (filter) => {
    setTimeFilter(filter);
    setVisibleCount(4);
  };

  return (
    <>
      <style>{css}</style>

      <div className="trending-page-container">
        <div className="trending-content-wrapper">
          <header className="trending-page-header">
            <h1 className="trending-main-title">What&apos;s Trending Now?</h1>

            <div className="trending-filter-row">
              {["TODAY", "THIS WEEK", "THIS MONTH"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-pill ${
                    timeFilter === filter ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>

          <main className="trending-news-list">
            {visibleNews.length === 0 && (
              <div className="trending-empty">Belum ada berita trending.</div>
            )}

            {visibleNews.map((item, index) => {
              const isLastVisible = index === visibleNews.length - 1;

              return (
                <Link
                  key={item.id || index}
                  to={`/news/${item.id}`}
                  className={`trending-card-link ${
                    isLastVisible ? "last-visible-card" : ""
                  }`}
                >
                  <article className="trending-news-card">
                    <div className="trending-image-box">
                      {index === 0 && (
                        <span className="badge-trending">#1 TRENDING</span>
                      )}

                      <img
                        src={
                          item.image ||
                          item.thumbnail ||
                          item.cover ||
                          FALLBACK_IMAGE
                        }
                        alt={item.title || "Trending news"}
                        className="trending-img"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    <div className="trending-text-box">
                      <span className="trending-news-category">
                        {(item.category || "GENERAL").toUpperCase()}
                      </span>

                      <h2 className="trending-news-headline">
                        {item.title || "Judul berita belum tersedia"}
                      </h2>

                      <p className="trending-news-summary">
                        {item.excerpt ||
                          item.description ||
                          item.synopsis ||
                          "Ringkasan berita belum tersedia."}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}

            {hasMore && (
              <div className="load-more-wrapper">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
