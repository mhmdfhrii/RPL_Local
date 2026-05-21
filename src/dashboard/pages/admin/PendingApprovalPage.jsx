// src/pages/admin/PendingApprovalPage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchArticles, updateArticle } from "../../services/api";

const ICON_WORD_COUNT =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAKCAYAAABv7tTEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAQ9JREFUeAGFkbFNA1EQRGf2zjEuwXRwVAAERmRAYInMJkAyIRUgKrDIyCzHBPhCuvh0cHTg3Hc77DeyMx+brP7ujHb0PseT+czAqYCKwBBgApDkqmm8AXQR71HsN9zN8WZhWML1LbSXjvYsxK+Sk4bPECNEz9zq1KQ7MIyGRZkXhYrF18f7D/4qXd/PkzpMO/mqMC5lcQPcyL0mWZXoqbJE07Z6ICOe1OSe7dZn8i2rAnyhMArhzORD/GeygRLIuMDzgHJySNBnQpvj+Cp6E8pMsDqYukLrq8nTaI88CDZ5LgRy4haDPfKyydNSQjJ47ezWyiRRVEF8ih2wEAdy65QYlxyaxV/oaLLx5LE6tvsF35t05V60pakAAAAASUVORK5CYII=";

const ICON_TARGET =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAqtJREFUeAGdVV1OWkEUPjN4r7faB3fQ64tI0qSwgsIK6g7EFQhJEZI+VJ8q8iCuANgBrkBcgTRpQiVNZQk8tfx47+n5ZhiKCDbpJHpnzpzf73xnULRi3RVo55Xv5ZVS7+WYlr8Q8mR1ougfa2NZ0Ct5ea3pkkjt0H8svXjol71LrVUDzhRxh5mLsdK7LzlANbQqQzhjUgUiHjLrs+TFpG5vpnRf9tc629r0b/pl7uxVp8W5Q5TpnKmYcsnauAvl175/HCs6oDVr2/NCJg5he3/i30oSbVOylPkZXzEu7tWm3V6FQol8J+dTsk15lhl0oItqjFBRA3KN7OQYArPU+bRphOzfkO3sIFZxblWZ0MF+/2Jch61cCTM2paFafYBipKiFL4TO2a/xViZ1/thZdLjz9xMGvl8wlTFd2yw5q11JUURdm3l8aMuPjzL14fDHiXfonAlOB7t1GuIO54Ri8JRYJ9rWlt7pWTb0VvCwUZQJ4DKLlDqdpyc44ROMHo2uNCNrdUeDmUb4hIfLWNkdL/JsiH/Icp0dHA6w+fkpeGPt2UQPgo20LZ2KVoelVDYd7X3cyM6CGd1+yXNMGICHEIbjSYRuNmNS1xIlrVmDBhl0HvLFzHVCN2bBrgws0DcQ0Fct43ULYUKTAT+YmAlB1oaLLhvDPdlDRjMWzILNbVlxWz2I4mTTezCPgeZ88su01asEoebYcXHVEn7qHJphHxPMPw3kNdrVlgYGJ9RQ/yZ4QBGXgtmRw9ThK7pnlp+jQb8kpZqXCaYW3/n79r3sCePVsWyHcczFVM2Ws26BnzIMdVQm83y1X50WnjhcckoYpyimlgDedRztFYKQvCgLzBwHF509c2iMKoIJm8cipBcXG6hcY9Y6XHKMOZ//BJDtfhfM+D3ZbmI0l+3+AI1TO7HNklc1AAAAAElFTkSuQmCC";

const ICON_TOTAL_PENDING =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAZlJREFUeAGtVdFRwkAQfXdYACWECsQKjBXovzMCFQgVOFYgVBCgAaUBjRWYDowd2ACJb28vickkAhnfTI7L7u1jd293Y9CGMBpynQKDSyAfcx94TQqYBNjvEM/WbaamhYxE9om7If5GCmSPTWJbJ9uSyEZKlsc0mPEZIZ4Y9yC7UJnoxGuedTZtHjpFPufum0aLrpDaIzFLxHeLilCVkSe7IlmCYxBGzK99U1J6Tic84eZTQ1AhTkHdmZFVgZCZ+GQygbOhrV7ilJcyuFbNfoPeKG1D6+tMoHkTj9XrCodlsf7YcymbwLueVPmQcvCHj5HFs9QTB/U6/AeY8obtWYDX26/Si98XdEim5fPBt5SE22fm8aZXydTIJQXZjiHv31U6mKA3StsXyeEarijzkOGfTuq8o60MC0ZouWjvKpaaj6PJxr6f4SYPimnjcpet4KqdvdmsuVYyiaboY6yK/JvGPy556F5fpJ1cByTlsAijQFbNmQsTSjaZFxRdA/YB1ZTuQuuYM53HHbFhn5vGJyCnt7lUxlrzX8cPDpizWWS+8IMAAAAASUVORK5CYII=";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
    --pa-blue: #0047ab;
    --pa-dark: #182552;
    --pa-bg: #fbfaf9;
  }

  .pa-page *,
  .pa-page *::before,
  .pa-page *::after {
    box-sizing: border-box;
  }

  .pa-page {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 28px 54px 56px;
    background: var(--pa-bg);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827;
  }

  .pa-page button,
  .pa-page input,
  .pa-page textarea {
    font-family: inherit;
  }

  .pa-shell {
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
  }

  .pa-title {
    margin: 0 0 10px;
    color: #162052;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .pa-subtitle {
    margin: 0 0 38px;
    color: #64748b;
    font-size: 16px;
    line-height: 1.5;
  }

  .pa-stats {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 304px;
    gap: 28px;
    margin-bottom: 44px;
  }

  .pa-stat-card {
    min-height: 110px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
    padding: 30px 32px;
    display: flex;
    align-items: center;
  }

  .pa-pending-icon {
    width: 54px;
    height: 54px;
    border-radius: 9px;
    background: #dbeafe;
    color: #0056d6;
    display: grid;
    place-items: center;
    margin-right: 20px;
    flex-shrink: 0;
  }

  .pa-pending-icon img {
    width: 20px;
    height: 20px;
    display: block;
    object-fit: contain;
  }

  .pa-stat-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .pa-stat-value {
    color: #202124;
    font-size: 24px;
    font-weight: 800;
  }

  .pa-target-card {
    min-height: 110px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
    padding: 24px 24px 24px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pa-target-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .pa-target-value {
    color: #202124;
    font-size: 24px;
    font-weight: 800;
  }

  .pa-target-progress {
    width: 136px;
    height: 5px;
    margin-top: 18px;
    border-radius: 999px;
    background: #e5edf7;
    overflow: hidden;
  }

  .pa-target-fill {
    width: 80%;
    height: 100%;
    background: #2563eb;
    border-radius: inherit;
  }

  .pa-target-icon {
    width: 58px;
    height: 58px;
    border-radius: 14px;
    background: #fff7ed;
    color: #f59e0b;
    display: grid;
    place-items: center;
  }

  .pa-target-icon img {
    width: 20px;
    height: 20px;
    display: block;
    object-fit: contain;
  }

  .pa-table-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #edf1f6;
    overflow: hidden;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
  }

  .pa-table-top {
    min-height: 62px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pa-table-title {
    margin: 0;
    color: #111827;
    font-size: 15px;
    font-weight: 800;
  }

  .pa-search {
    width: 192px;
    height: 30px;
    border: 1px solid #dbe2ec;
    border-radius: 7px;
    padding: 0 12px 0 36px;
    color: #334155;
    font-size: 12px;
    outline: none;
    background: #ffffff;
  }

  .pa-search-wrap {
    position: relative;
  }

  .pa-search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .pa-table-head,
  .pa-row {
    display: grid;
    grid-template-columns: minmax(260px, 1.7fr) 140px 130px 120px 190px;
    align-items: center;
    column-gap: 20px;
  }

  .pa-table-head {
    height: 64px;
    padding: 0 24px;
    border-top: 1px solid #edf1f6;
    border-bottom: 1px solid #edf1f6;
    background: #ffffff;
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .pa-row {
    min-height: 96px;
    padding: 0 24px;
    border-bottom: 1px solid #edf1f6;
  }

  .pa-article-cell {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .pa-thumb {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    background: #e5e7eb;
    border: 1px solid #9ca3af;
    flex-shrink: 0;
  }

  .pa-article-title {
    color: #111827;
    font: 700 14px/1.35 Georgia, 'Times New Roman', serif;
    max-width: 220px;
  }

  .pa-author {
    color: #111827;
    font-size: 14px;
    font-weight: 800;
  }

  .pa-username {
    margin-top: 3px;
    color: #64748b;
    font-size: 12px;
  }

  .pa-date {
    color: #475569;
    font-size: 14px;
    line-height: 1.4;
  }

  .pa-stat-line {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #475569;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .pa-word-icon {
    width: 13px;
    height: 10px;
    display: inline-block;
    object-fit: contain;
    flex-shrink: 0;
  }

  .pa-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
  }

  .pa-view-btn {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 7px;
    color: #475569;
    background: #f1f5f9;
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .pa-approve-btn,
  .pa-reject-btn {
    height: 34px;
    border: 0;
    border-radius: 7px;
    padding: 0 18px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .pa-approve-btn {
    background: var(--pa-blue);
    color: #ffffff;
  }

  .pa-reject-btn {
    background: #f1f5f9;
    color: #475569;
  }

  .pa-footer {
    min-height: 58px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
    font-size: 12px;
  }

  .pa-pagination {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pa-page-btn {
    min-width: 30px;
    height: 30px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #1e293b;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .pa-page-btn.active {
    background: var(--pa-blue);
    color: #ffffff;
  }

  .pa-page-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .pa-show-all {
    border: 0;
    background: transparent;
    color: var(--pa-blue);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    margin-left: 12px;
  }

  .pa-toast {
    position: fixed;
    top: 58px;
    left: 50%;
    z-index: 9999;
    transform: translateX(-50%);
    min-height: 44px;
    padding: 0 28px;
    border-radius: 999px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.2);
  }

  .pa-toast.success {
    background: #10b981;
  }

  .pa-toast.error {
    background: #ef4444;
  }

  .pa-alert {
    margin-bottom: 28px;
    min-height: 46px;
    border-radius: 8px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 700;
  }

  .pa-alert.success {
    background: #ecfdf5;
    border: 1px solid #86efac;
    color: #166534;
  }

  .pa-alert.error {
    background: #fff1f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  .pa-alert-close {
    margin-left: auto;
    border: 0;
    background: transparent;
    color: currentColor;
    cursor: pointer;
  }

  .pa-preview-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .pa-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 14px;
  }

  .pa-breadcrumb button {
    border: 0;
    background: transparent;
    padding: 0;
    color: #64748b;
    font: inherit;
    cursor: pointer;
  }

  .pa-breadcrumb strong {
    color: #0056d6;
    font-weight: 500;
  }

  .pa-preview-title {
    margin: 0 0 12px;
    font: 700 15px/1.4 Georgia, 'Times New Roman', serif;
    color: #111827;
  }

  .pa-preview-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    color: #64748b;
    margin-bottom: 24px;
  }

  .pa-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .pa-meta-chip {
    padding: 7px 16px;
    border-radius: 999px;
    background: #e8eef7;
    color: #64748b;
  }

  .pa-preview-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pa-preview-reject,
  .pa-preview-approve {
    height: 40px;
    min-width: 104px;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .pa-preview-reject {
    border: 1px solid #ef4444;
    background: #fff1f2;
    color: #b91c1c;
  }

  .pa-preview-approve {
    border: 0;
    background: var(--pa-blue);
    color: #ffffff;
    box-shadow: 0 8px 14px rgba(0, 71, 171, 0.22);
  }

  .pa-preview-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 256px;
    gap: 34px;
    align-items: start;
  }

  .pa-preview-image {
    width: 100%;
    height: 342px;
    border-radius: 10px;
    object-fit: cover;
    display: block;
    margin-bottom: 22px;
  }

  .pa-content-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
  }

  .pa-content-title {
    margin: 0 0 24px;
    color: #0056d6;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pa-content-card p {
    margin: 0 0 22px;
    color: #1f2937;
    font-size: 15px;
    line-height: 1.75;
  }

  .pa-summary-card {
    background: #172554;
    color: #ffffff;
    border-radius: 12px;
    padding: 22px 22px 24px;
    margin-bottom: 24px;
  }

  .pa-summary-title {
    margin: 0 0 18px;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pa-summary-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
  }

  .pa-metadata-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 22px;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
  }

  .pa-metadata-title {
    margin: 0 0 20px;
    color: #111827;
    font-size: 15px;
    font-weight: 600;
  }

  .pa-metadata-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .pa-metadata-row strong {
    color: #111827;
    font-weight: 800;
  }

  .pa-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(15, 23, 42, 0.56);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pa-modal {
    width: 448px;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
  }

  .pa-modal-body {
    padding: 28px 24px 24px;
  }

  .pa-modal-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .pa-modal-title {
    margin: 0;
    color: #111827;
    font-size: 20px;
    font-weight: 800;
  }

  .pa-modal-desc {
    margin: 0 0 26px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
  }

  .pa-modal-label {
    display: block;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .pa-modal-textarea {
    width: 100%;
    height: 114px;
    border: 1px solid #d1d9e6;
    border-radius: 8px;
    padding: 14px;
    outline: none;
    resize: none;
    color: #334155;
    font-size: 14px;
    line-height: 1.5;
  }

  .pa-modal-textarea::placeholder {
    color: #94a3b8;
  }

  .pa-modal-footer {
    min-height: 72px;
    padding: 0 24px;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .pa-modal-cancel,
  .pa-modal-confirm {
    height: 40px;
    border-radius: 7px;
    padding: 0 22px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .pa-modal-cancel {
    border: 0;
    background: transparent;
    color: #64748b;
  }

  .pa-modal-confirm {
    border: 0;
    background: #c9181f;
    color: #ffffff;
    box-shadow: 0 8px 14px rgba(201, 24, 31, 0.18);
  }

  @media (max-width: 1120px) {
    .pa-page {
      margin-left: 0;
      padding: 24px;
    }

    .pa-stats,
    .pa-preview-grid {
      grid-template-columns: 1fr;
    }

    .pa-table-head,
    .pa-row {
      grid-template-columns: minmax(220px, 1.7fr) 130px 120px 110px 180px;
    }
  }
`;

const FallbackThumb = () => <div className="pa-thumb" />;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const countWords = (text = "") =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

const mapPendingArticle = (article) => ({
  id: article.id,
  apiId: article.apiId || article.id,
  title: article.title,
  author: article.author,
  username: "",
  category: article.category,
  submitDate: article.date,
  fullDate: article.date,
  wordCount: countWords(article.synopsis || article.excerpt || article.body),
  readTime: article.readTime,
  assetMedia: article.image ? "1 Pict" : "0 Pict",
  image: article.image,
  summary: article.synopsis || article.excerpt,
  body: [article.body || article.content || ""].filter(Boolean),
});

export default function PendingApprovalPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    let alive = true;

    fetchArticles({ all: "true", status: "pending" })
      .then((articles) => {
        if (alive) setItems(articles.map(mapPendingArticle));
      })
      .catch(() => {
        if (alive) setItems([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const pageSize = showAll ? items.length || 1 : 5;

  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return items;

    return items.filter((item) =>
      [item.title, item.author, item.username, item.category]
        .join(" ")
        .toLowerCase()
        .includes(cleanQuery),
    );
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2600);
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setPreviewArticle(null);
    setRejectTarget(null);
    setRejectReason("");
  };

  const handleApprove = (article) => {
    updateArticle(article.apiId || article.id, { status: "published" }).catch(() => {});
    removeItem(article.id);
    showToast("Artikel Berhasil Disetujui & Diterbitkan!", "success");
  };

  const handleOpenReject = (article) => {
    setRejectTarget(article);
    setRejectReason("");
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;

    updateArticle(rejectTarget.apiId || rejectTarget.id, {
      status: "rejected",
      feedback_admin: rejectReason,
    }).catch(() => {});

    removeItem(rejectTarget.id);
    showToast("Artikel Berhasil Ditolak & Dikembalikan Ke Penulis!", "error");
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const renderPagination = () => {
    const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className="pa-pagination">
        <button
          className="pa-page-btn"
          type="button"
          disabled={safePage === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          ??        </button>

        {numbers.map((number) => (
          <button
            key={number}
            className={`pa-page-btn${safePage === number ? " active" : ""}`}
            type="button"
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="pa-page-btn"
          type="button"
          disabled={safePage === totalPages}
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
        >
          ??        </button>

        <button
          className="pa-show-all"
          type="button"
          onClick={() => {
            setShowAll((current) => !current);
            setPage(1);
          }}
        >
          {showAll ? "Tampilkan Sedikit" : "Tampilkan Semua"}
        </button>
      </div>
    );
  };

  const ListView = () => (
    <div className="pa-shell">
      <h1 className="pa-title">Persetujuan Artikel</h1>
      <p className="pa-subtitle">
        Tinjau dan validasi kiriman artikel terbaru dari kontributor.
      </p>

      <section className="pa-stats">
        <div className="pa-stat-card">
          <div className="pa-pending-icon">
            <img src={ICON_TOTAL_PENDING} alt="Total Pending" />
          </div>

          <div>
            <div className="pa-stat-label">Total Pending</div>
            <div className="pa-stat-value">{items.length} Artikel</div>
          </div>
        </div>

        <div className="pa-target-card">
          <div>
            <div className="pa-target-label">Target Harian</div>
            <div className="pa-target-value">8/10 Artikel</div>
            <div className="pa-target-progress">
              <div className="pa-target-fill" />
            </div>
          </div>

          <div className="pa-target-icon">
            <img src={ICON_TARGET} alt="Target Harian" />
          </div>
        </div>
      </section>

      <section className="pa-table-card">
        <div className="pa-table-top">
          <h2 className="pa-table-title">Antrean Persetujuan</h2>

          <div className="pa-search-wrap">
            <span className="pa-search-icon">
              <IconSearch />
            </span>
            <input
              className="pa-search"
              value={query}
              onChange={handleSearch}
              placeholder="Cari antrean..."
            />
          </div>
        </div>

        <div className="pa-table-head">
          <span>Judul Artikel</span>
          <span>Penulis</span>
          <span>Tanggal Submit</span>
          <span>Statistik</span>
          <span>Aksi</span>
        </div>

        {visibleItems.map((article) => (
          <div className="pa-row" key={article.id}>
            <div className="pa-article-cell">
              {article.image ? (
                <img className="pa-thumb" src={article.image} alt="" />
              ) : (
                <FallbackThumb />
              )}

              <div className="pa-article-title">{article.title}</div>
            </div>

            <div>
              <div className="pa-author">{article.author}</div>
              <div className="pa-username">{article.username}</div>
            </div>

            <div className="pa-date">{article.submitDate}</div>

            <div>
              <div className="pa-stat-line">
                <img
                  className="pa-word-icon"
                  src={ICON_WORD_COUNT}
                  alt="Word Count"
                />
                {article.wordCount} kata
              </div>
              <div className="pa-stat-line">
                <IconClock /> {article.readTime.replace(" ", "\n")}
              </div>
            </div>

            <div className="pa-actions">
              <button
                type="button"
                className="pa-view-btn"
                onClick={() => setPreviewArticle(article)}
              >
                <IconEye />
              </button>

              <button
                type="button"
                className="pa-approve-btn"
                onClick={() => handleApprove(article)}
              >
                Setujui
              </button>

              <button
                type="button"
                className="pa-reject-btn"
                onClick={() => handleOpenReject(article)}
              >
                Tolak
              </button>
            </div>
          </div>
        ))}

        <div className="pa-footer">
          <span>
            Menampilkan {visibleItems.length} dari {filteredItems.length} artikel masuk
          </span>

          {renderPagination()}
        </div>
      </section>
    </div>
  );

  const PreviewView = ({ article }) => (
    <div className="pa-shell">
      {toast && (
        <div className={`pa-alert ${toast.type}`}>
          <IconCheckCircle size={18} />
          {toast.message}
          <button
            className="pa-alert-close"
            type="button"
            onClick={() => setToast(null)}
          >
            <IconX />
          </button>
        </div>
      )}

      <div className="pa-preview-top">
        <div>
          <div className="pa-breadcrumb">
            <button type="button" onClick={() => setPreviewArticle(null)}>
              Pending Approval
            </button>
            <span>/</span>
            <strong>Article Preview</strong>
          </div>

          <h1 className="pa-preview-title">{article.title}</h1>

          <div className="pa-preview-meta">
            <span className="pa-meta-item">
              <IconUser /> {article.author}
            </span>
            <span>|</span>
            <span className="pa-meta-chip">{article.category}</span>
            <span>|</span>
            <span className="pa-meta-item">
              <IconCalendar /> {article.fullDate}
            </span>
          </div>
        </div>

        <div className="pa-preview-actions">
          <button
            type="button"
            className="pa-preview-reject"
            onClick={() => handleOpenReject(article)}
          >
            <IconX /> Tolak
          </button>

          <button
            type="button"
            className="pa-preview-approve"
            onClick={() => handleApprove(article)}
          >
            <IconCheckCircle size={16} /> Setujui
          </button>
        </div>
      </div>

      <section className="pa-preview-grid">
        <div>
          <img className="pa-preview-image" src={article.image || FALLBACK_IMAGE} alt="" />

          <article className="pa-content-card">
            <h2 className="pa-content-title">
              <IconArticle /> Artikel Lengkap
            </h2>

            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        </div>

        <aside>
          <section className="pa-summary-card">
            <h2 className="pa-summary-title">
              <IconArticle /> Ringkasan Artikel
            </h2>
            <p className="pa-summary-text">{article.summary}</p>
          </section>

          <section className="pa-metadata-card">
            <h2 className="pa-metadata-title">Metadata Status</h2>

            <div className="pa-metadata-row">
              <span>Word Count</span>
              <strong>{article.wordCount} Words</strong>
            </div>

            <div className="pa-metadata-row">
              <span>Read Time</span>
              <strong>{article.readTime.replace(" read", "")}</strong>
            </div>

            <div className="pa-metadata-row">
              <span>Aset Media</span>
              <strong>{article.assetMedia}</strong>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );

  return (
    <>
      <style>{css}</style>

      <main className="pa-page">
        {!previewArticle && toast && (
          <div className={`pa-toast ${toast.type}`}>
            <IconCheckCircle size={18} />
            {toast.message}
          </div>
        )}

        {previewArticle ? (
          <PreviewView article={previewArticle} />
        ) : (
          <ListView />
        )}
      </main>

      {rejectTarget && (
        <div className="pa-overlay" onClick={() => setRejectTarget(null)}>
          <div className="pa-modal" onClick={(event) => event.stopPropagation()}>
            <div className="pa-modal-body">
              <div className="pa-modal-title-row">
                <IconWarn />
                <h2 className="pa-modal-title">Konfirmasi Penolakan</h2>
              </div>

              <p className="pa-modal-desc">
                Harap berikan alasan penolakan agar penulis dapat melakukan
                perbaikan yang diperlukan.
              </p>

              <label className="pa-modal-label">Alasan Penolakan</label>
              <textarea
                className="pa-modal-textarea"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Contoh: Kualitas gambar kurang baik atau konten memerlukan referensi tambahan..."
              />
            </div>

            <div className="pa-modal-footer">
              <button
                type="button"
                className="pa-modal-cancel"
                onClick={() => setRejectTarget(null)}
              >
                Batal
              </button>

              <button
                type="button"
                className="pa-modal-confirm"
                onClick={handleConfirmReject}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
