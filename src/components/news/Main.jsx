import React from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useApiData";
import "../../styles/mainTrending.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=80";

export default function Main() {
  const { articles } = useArticles();
  const mainArticle = articles[0];
  const sideTopArticle = articles[1];
  const sideBottomArticle = articles[2];

  if (!mainArticle) return null;

  const getImage = (article) =>
    article?.image || article?.thumbnail || article?.cover || FALLBACK_IMAGE;

  const getTitle = (article, fallback) =>
    article?.heroTitle || article?.title || fallback;

  const getDesc = (article) =>
    article?.excerpt ||
    article?.description ||
    "Pemerintah mengumumkan target ambisius untuk mengurangi emisi karbon sebesar 45% pada tahun 2030.";

  return (
    <section className="main-hero-section">
      <div className="main-hero-grid">
        <Link to={`/news/${mainArticle.id}`} className="main-hero-link">
          <article
            className="main-hero-card"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.16) 38%, rgba(0,0,0,0.92) 100%), url("${getImage(
                mainArticle
              )}")`,
            }}
          >
            <div className="main-hero-content">
              <span className="main-special-badge">SPECIAL REPORT</span>

              <h1 className="main-hero-title">
                {getTitle(
                  mainArticle,
                  "PEMERINTAH TETAPKAN TARGET PENGURANGAN EMISI KARBON"
                )}
              </h1>

              <p className="main-hero-desc">{getDesc(mainArticle)}</p>

              <div className="main-hero-footer">
                <span className="main-read-button">Baca Selengkapnya</span>

                <span className="main-hero-meta">
                  {mainArticle.readTime || "4 MIN READ"} · BY{" "}
                  {(mainArticle.author || "REDAKSI PAHAM.ID").toUpperCase()}
                </span>
              </div>
            </div>
          </article>
        </Link>

        <div className="main-side-grid">
          {sideTopArticle && (
            <Link
              to={`/news/${sideTopArticle.id}`}
              className="main-side-link"
            >
              <article
                className="main-side-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.82) 100%), url("${getImage(
                    sideTopArticle
                  )}")`,
                }}
              >
                <div className="main-side-content">
                  <span className="main-side-badge">
                    {sideTopArticle.category || "TECHNOLOGY"}
                  </span>

                  <h3>
                    {getTitle(
                      sideTopArticle,
                      "Teknologi AI Terbaru Mengubah Industri Kesehatan"
                    )}
                  </h3>
                </div>
              </article>
            </Link>
          )}

          {sideBottomArticle && (
            <Link
              to={`/news/${sideBottomArticle.id}`}
              className="main-side-link"
            >
              <article
                className="main-side-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.82) 100%), url("${getImage(
                    sideBottomArticle
                  )}")`,
                }}
              >
                <div className="main-side-content">
                  <span className="main-side-badge">
                    {sideBottomArticle.category || "POLITICS"}
                  </span>

                  <h3>
                    {getTitle(
                      sideBottomArticle,
                      "Parlemen Menyetujui Undang-Undang Perlindungan Privasi Data"
                    )}
                  </h3>
                </div>
              </article>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
