// src/pages/NewsDetailPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useArticle, useArticles } from "../../hooks/useApiData";
import {
  createBookmark,
  createComment,
  createReaction,
  getAccessToken,
  normalizeComment,
} from "../../services/api"; // <--- Mengimpor fungsi pembaca token dinamis
import "../../styles/articleDetail.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

function getImage(article) {
  return article?.image || article?.thumbnail || article?.cover || FALLBACK_IMAGE;
}

function getText(value, fallback) {
  return value && String(value).trim() !== "" ? value : fallback;
}

function PopularSidebar({ articles, currentId }) {
  const popularItems = articles
    .filter((item) => String(item.id) !== String(currentId))
    .slice(0, 3);

  return (
    <section className="detail-sidebar-box popular-today-box">
      <h4 className="detail-sidebar-title">
        <span className="sidebar-title-line" />
        POPULAR TODAY
      </h4>

      <div className="popular-detail-list">
        {popularItems.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="popular-detail-item"
          >
            <span className="popular-detail-category">
              {item.category || "General"}
            </span>

            <h5>{item.title}</h5>

            <small>{item.readTime || "2 MIN READ"}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AuthSidebar() {
  return (
    <section className="detail-auth-sidebar">
      <h3>Menyelam Lebih Dalam di Paham.id?</h3>

      <p>Dapatkan pemberitahuan langsung setiap berita baru</p>

      <Link to="/register" className="detail-auth-sidebar-btn">
        DAFTAR SEKARANG
      </Link>
    </section>
  );
}

function SidebarMore({ articles, category, currentId }) {
  const relatedNews = articles
    .filter(
      (item) =>
        String(item.id) !== String(currentId) &&
        item.category?.toLowerCase() === category?.toLowerCase()
    )
    .slice(0, 3);

  const fallbackNews = articles
    .filter((item) => String(item.id) !== String(currentId))
    .slice(0, 3);

  const data = relatedNews.length > 0 ? relatedNews : fallbackNews;

  return (
    <section className="detail-more-section">
      <h4 className="detail-more-label">
        MORE FROM {category || "ENVIRONMENT"}
      </h4>

      <div className="detail-more-list">
        {data.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="detail-more-item"
          >
            <img
              src={getImage(item)}
              alt={item.title}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            <div>
              <h5>{item.title}</h5>
              <span>{item.date || "12 Januari 2026"}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AuthFooter() {
  return (
    <div className="detail-auth-footer">
      <h3>Want to join the conversation?</h3>

      <div className="detail-auth-footer-actions">
        <Link to="/signin" className="detail-auth-login">
          Login
        </Link>

        <Link to="/register" className="detail-auth-register">
          Register
        </Link>
      </div>
    </div>
  );
}

function CommentSection({
  comments = [],
  commentText,
  isLoggedIn,
  isPosting,
  onCommentChange,
  onPostComment,
}) {
  return (
    <section className="comment-section">
      <div className="comment-header-row">
        <h2 className="comment-title">Komentar</h2>

        <span className="comment-badge">{comments.length} Comments</span>
      </div>

      <div className="comment-input-card">
        <div className="comment-input-top">
          <img
            src="/img/author.png"
            className="comment-avatar"
            alt="User"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_AVATAR;
            }}
          />

          <textarea
            className="comment-textarea"
            placeholder={isLoggedIn ? "Add to the conversation..." : "Please login to comment..."}
            disabled={!isLoggedIn}
            value={commentText}
            onChange={(event) => onCommentChange(event.target.value)}
          />
        </div>

        <div className="comment-input-bottom">
          {isLoggedIn ? (
            <button
              type="button"
              className="comment-post-btn"
              onClick={onPostComment}
              disabled={isPosting || !commentText.trim()}
            >
              {isPosting ? "Posting..." : "Post Comment"}
            </button>
          ) : (
            <Link to="/signin" className="comment-post-btn">
              Login to Comment
            </Link>
          )}
        </div>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item-row">
            <img
              src={comment.avatar || "/img/author.png"}
              className="comment-avatar"
              alt={comment.author || "User"}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_AVATAR;
              }}
            />

            <div className="comment-bubble">
              <div className="comment-meta">
                <strong>{comment.author || "User"}</strong>
                <span>•</span>
                <span>{comment.time || "2 hours ago"}</span>
              </div>

              <p>{comment.text || "Komentar belum tersedia."}</p>
            </div>
          </div>
        ))}
      </div>

      {!isLoggedIn && <AuthFooter />}
    </section>
  );
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const { article: fetchedArticle, loading } = useArticle(id);
  const { articles } = useArticles();
  const [isFullArticle, setIsFullArticle] = useState(false);
  const [localArticle, setLocalArticle] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [interactionMessage, setInteractionMessage] = useState("");

  // LOGIC BARU: Deteksi status login secara dinamis dari token asli, bukan hardcoded true
  const isLoggedIn = Boolean(getAccessToken());

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsFullArticle(false);
    setCommentText("");
    setInteractionMessage("");
  }, [id]);

  useEffect(() => {
    setLocalArticle(fetchedArticle);
  }, [fetchedArticle]);

  if (loading) {
    return (
      <main className="article-detail-wrapper">
        <div className="article-error-box">Memuat artikel...</div>
      </main>
    );
  }

  if (!fetchedArticle) {
    return (
      <main className="article-detail-wrapper">
        <div className="article-error-box">Artikel Tidak Ditemukan</div>
      </main>
    );
  }

  const article = localArticle || fetchedArticle;
  const reactions = article.reactions || {};
  const articleId = article.apiId || article.id;

  const requireLogin = () => {
    if (isLoggedIn) return true;
    setInteractionMessage("Silakan login terlebih dahulu.");
    return false;
  };

  const handleReaction = async (type) => {
    if (!requireLogin()) return;

    try {
      setPendingAction(type);
      const updatedArticle = await createReaction(articleId, type);
      setLocalArticle(updatedArticle);
      setInteractionMessage("Reaction tersimpan.");
    } catch (error) {
      setInteractionMessage(error.message || "Gagal menyimpan reaction.");
    } finally {
      setPendingAction("");
    }
  };

  const handleBookmark = async () => {
    if (!requireLogin()) return;

    try {
      setPendingAction("bookmark");
      const bookmark = await createBookmark(articleId);
      setLocalArticle((current) => ({
        ...current,
        reactions: {
          ...(current.reactions || {}),
          bookmark: Number(
            bookmark.bookmark_count ??
              current.reactions?.bookmark ??
              0,
          ),
        },
      }));
      setInteractionMessage(
        bookmark.already_exists
          ? "Berita sudah ada di saved."
          : "Berita berhasil disimpan.",
      );
    } catch (error) {
      setInteractionMessage(error.message || "Gagal menyimpan bookmark.");
    } finally {
      setPendingAction("");
    }
  };

  const handlePostComment = async () => {
    if (!requireLogin()) return;
    const text = commentText.trim();
    if (!text) return;

    try {
      setIsPostingComment(true);
      const comment = await createComment(articleId, text);
      setLocalArticle((current) => ({
        ...current,
        comments: Number(current.comments || 0) + 1,
        commentItems: [...(current.commentItems || []), normalizeComment(comment)],
      }));
      setCommentText("");
      setInteractionMessage("Komentar terkirim.");
    } catch (error) {
      setInteractionMessage(error.message || "Gagal mengirim komentar.");
    } finally {
      setIsPostingComment(false);
    }
  };

  return (
    <main className="article-detail-wrapper">
      <div className="article-detail-container">
        <section className="article-main-column">
          <article className="article-detail-card">
            <div className="article-hero-box">
              <span className="article-floating-badge">
                {article.category || "General"}
              </span>

              <img
                src={getImage(article)}
                alt={article.title}
                className="article-hero-image"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <h1 className="article-detail-title">
              {getText(article.title, "Untitled Article")}
            </h1>

            <div className="article-meta-row">
              <div className="article-author-box">
                <img
                  src={article.authorAvatar || "/img/author.png"}
                  alt={article.author || "Author"}
                  className="article-author-avatar"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_AVATAR;
                  }}
                />

                <div>
                  <h4 className="article-author-name">
                    {article.author || "Redaksi Paham.ID"}
                  </h4>

                  <p className="article-author-role">
                    {article.role || "Jurnalis"}
                  </p>
                </div>
              </div>

              <div className="article-date-box">
                <span className="article-date">
                  {article.date}
                </span>

                <span className="article-read-summary">
                  {article.readTime}
                </span>
              </div>
            </div>

            <div className="article-body">
              {/* REVISI LOGIC: Menampilkan teks berita dinamis sesuai state View Full atau Summary */}
              {!isFullArticle ? (
                <p style={{ whiteSpace: "pre-line" }}>
                  {article.synopsis || article.excerpt || "Ringkasan berita belum tersedia."}
                </p>
              ) : (
                <div className="article-full-text" style={{ whiteSpace: "pre-line" }}>
                  <p>
                    {article.body || article.content || "Isi berita lengkap belum tersedia."}
                  </p>
                </div>
              )}

              <div className="article-view-full-wrap">
                <button
                  type="button"
                  className="article-view-full-btn"
                  onClick={() => setIsFullArticle((prev) => !prev)}
                >
                  {isFullArticle ? "SHOW SUMMARY" : "VIEW FULL ARTICLE"}
                </button>
              </div>
            </div>

            <div className="article-interaction-section">
              <div className="article-reactions-row">
                <span className="article-reaction-label">REACTIONS:</span>

                <button
                  type="button"
                  className="article-reaction-pill"
                  onClick={() => handleReaction("wow")}
                  disabled={pendingAction === "wow"}
                >
                  👏 {reactions.clap || 0}
                </button>

                <button
                  type="button"
                  className="article-reaction-pill"
                  onClick={() => handleReaction("idea")}
                  disabled={pendingAction === "idea"}
                >
                  💡 {reactions.light || 0}
                </button>

                <button
                  type="button"
                  className="article-reaction-pill"
                  onClick={() => handleReaction("thinking")}
                  disabled={pendingAction === "thinking"}
                >
                  🤔 {reactions.think || reactions.idea || 0}
                </button>

                <button
                  type="button"
                  className="article-reaction-pill"
                  onClick={() => handleReaction("blue_heart")}
                  disabled={pendingAction === "blue_heart"}
                >
                  💙 {reactions.blueHeart || 0}
                </button>

                <button
                  type="button"
                  className="article-reaction-pill"
                  onClick={() => handleReaction("love")}
                  disabled={pendingAction === "love"}
                >
                  ❤️ {reactions.heart || article.likes || 0}
                </button>
              </div>
            </div>

            {interactionMessage && (
              <p className="article-share-label" style={{ marginTop: 12 }}>
                {interactionMessage}
              </p>
            )}

            <div className="article-share-section">
              <span className="article-share-label">SHARE THIS STORY:</span>

              <div className="article-share-actions">
                <button type="button" className="article-icon-round">
                  <img src="/img/share.png" alt="Share" />
                </button>

                <button
                  type="button"
                  className="article-icon-round"
                  onClick={handleBookmark}
                  disabled={pendingAction === "bookmark"}
                >
                  <img src="/img/simpan.png" alt="Save" />
                </button>
              </div>
            </div>

            <CommentSection
              comments={article.commentItems || []}
              commentText={commentText}
              isLoggedIn={isLoggedIn}
              isPosting={isPostingComment}
              onCommentChange={setCommentText}
              onPostComment={handlePostComment}
            />
          </article>
        </section>

        <aside className="article-sidebar-column">
          <PopularSidebar articles={articles} currentId={article.id} />

          {!isLoggedIn && <AuthSidebar />}

          <SidebarMore
            articles={articles}
            category={article.category}
            currentId={article.id}
          />
        </aside>
      </div>
    </main>
  );
}
