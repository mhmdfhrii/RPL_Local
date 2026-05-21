import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // <--- Ini masuk buat handle upload gambar otomatis ke ImgBB
import { writingTips } from "../../config/staticConfig";
import { fetchCategories, updateArticle } from "../../services/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
  }

  .ea-page *,
  .ea-page *::before,
  .ea-page *::after,
  .rv-page *,
  .rv-page *::before,
  .rv-page *::after {
    box-sizing: border-box;
  }

  .ea-page,
  .rv-page {
    min-height: calc(100vh - var(--dashboard-header-height));
    margin-left: var(--dashboard-sidebar-width);
    margin-top: var(--dashboard-header-height);
    padding: 32px 42px 64px 60px;
    background: #f8f9fb;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
  }

  .ea-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .ea-breadcrumb {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }

  .ea-breadcrumb-link {
    border: 0;
    background: transparent;
    padding: 0;
    color: #1d4ed8;
    font: inherit;
    cursor: pointer;
  }

  .ea-breadcrumb-sep {
    color: #cbd5e1;
  }

  .ea-save-top {
    min-width: 198px;
    height: 48px;
    border: 0;
    border-radius: 999px;
    background: #2f4bc8;
    color: #ffffff;
    font: 800 15px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(47, 75, 200, 0.18);
  }

  .ea-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 326px;
    gap: 26px;
    align-items: start;
  }

  .ea-left,
  .ea-right {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .ea-card {
    background: #ffffff;
    border: 1px solid #dce3ef;
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  }

  .ea-card.compact {
    padding: 22px;
  }

  .ea-title-card {
    min-height: 144px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .ea-synopsis-card {
    min-height: 248px;
  }

  .ea-body-card {
    min-height: 420px;
  }

  .ea-label {
    margin: 0 0 14px;
    color: #96a3b8;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ea-section-title {
    margin: 0 0 5px;
    color: #020617;
    font-size: 18px;
    font-weight: 800;
  }

  .ea-section-subtitle {
    margin: 0 0 18px;
    color: #8b98ad;
    font-size: 14px;
    font-weight: 500;
  }

  .ea-title-input {
    width: 100%;
    min-height: 42px;
    border: 0;
    outline: 0;
    resize: none;
    background: transparent;
    color: #071426;
    font: 800 24px/1.35 'Plus Jakarta Sans', sans-serif;
  }

  .ea-textarea {
    width: 100%;
    border: 0;
    outline: 0;
    resize: none;
    background: transparent;
    color: #142033;
    font: 500 16px/1.75 'Plus Jakarta Sans', sans-serif;
  }

  .ea-title-input::placeholder,
  .ea-textarea::placeholder {
    color: #cbd5e1;
  }

  .ea-synopsis-box {
    width: 100%;
    min-height: 134px;
    border: 1px solid #e6ebf3;
    border-radius: 10px;
    padding: 18px 16px;
    background: #ffffff;
  }

  .ea-synopsis-box .ea-textarea {
    min-height: 96px;
  }

  .ea-body-textarea {
    min-height: 230px;
  }

  .ea-toolbar {
    height: 42px;
    margin: 8px 0 18px;
    padding: 0 12px;
    border-top: 1px solid #eef2f7;
    border-bottom: 1px solid #eef2f7;
    background: #fbfcfe;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ea-tool-btn {
    width: 22px;
    height: 22px;
    border: 0;
    background: transparent;
    color: #64748b;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ea-thumb {
    width: 100%;
    height: 164px;
    border-radius: 10px;
    object-fit: cover;
    display: block;
    margin-bottom: 12px;
    cursor: pointer;
  }

  .ea-thumb-placeholder {
    width: 100%;
    height: 164px;
    border: 2px dashed #cbd5e1;
    border-radius: 10px;
    background: #f8fafc;
    margin-bottom: 12px;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .ea-file-input {
    display: none;
  }

  .ea-upload-btn {
    width: 100%;
    height: 42px;
    border: 1px solid #dce3ef;
    border-radius: 9px;
    background: #ffffff;
    color: #334155;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .ea-category-list {
    min-height: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ea-category-tag {
    min-height: 28px;
    padding: 0 10px;
    border-radius: 7px;
    background: #e7edff;
    color: #2447d8;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    text-transform: uppercase;
  }

  .ea-category-remove {
    border: 0;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    line-height: 1;
  }

  .ea-category-form {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .ea-category-select {
    width: 100%;
    height: 39px;
    border: 1px solid #dce3ef;
    border-radius: 8px;
    background: #f8fafc;
    color: #334155;
    padding: 0 12px;
    font: 500 13px/1 'Plus Jakarta Sans', sans-serif;
    outline: none;
  }

  .ea-check-title {
    margin: 0 0 18px;
    color: #020617;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ea-check-ok {
    color: #22c55e;
    display: inline-flex;
  }

  .ea-metric-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 10px;
  }

  .ea-metric-label {
    color: #8b98ad;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 3px;
  }

  .ea-metric-value {
    color: #22c55e;
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
  }

  .ea-metric-value.red {
    color: #dc2626;
  }

  .ea-metric-sub {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }

  .ea-progress {
    height: 6px;
    border-radius: 999px;
    background: #dbe3ef;
    overflow: hidden;
  }

  .ea-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: #22c55e;
  }

  .ea-progress-fill.red {
    background: #dc2626;
  }

  .ea-warning {
    margin-top: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: #fee2e2;
    color: #dc2626;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ea-action-stack {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ea-primary-btn {
    width: 100%;
    height: 50px;
    border: 0;
    border-radius: 10px;
    font: 800 15px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    cursor: pointer;
  }

  .ea-primary-btn.save {
    background: #3155f6;
    color: #ffffff;
  }

  .ea-primary-btn.submit {
    background: #dfe6f0;
    color: #94a3b8;
    cursor: default;
    pointer-events: none;
  }

  .ea-primary-btn.submit.enabled {
    background: #8f8f8f;
    color: #ffffff;
    cursor: pointer;
    pointer-events: auto;
  }

  .ea-tips-title {
    margin: 0 0 14px;
    color: #111827;
    font-size: 16px;
    font-weight: 800;
  }

  .ea-tip {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 8px;
    color: #4b5563;
    font-size: 11px;
    line-height: 1.35;
    margin-bottom: 11px;
  }

  .ea-tip:last-child {
    margin-bottom: 0;
  }

  .ea-tip-icon {
    width: 15px;
    height: 15px;
    border: 1.8px solid #2563eb;
    color: #2563eb;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .rv-breadcrumb {
    margin-bottom: 18px;
  }

  .rv-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    border-radius: 12px;
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .rv-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 326px;
    gap: 26px;
    align-items: start;
  }

  .rv-main {
    background: #ffffff;
    border: 1px solid #dce3ef;
    border-radius: 14px;
    overflow: hidden;
  }

  .rv-image {
    width: 100%;
    max-height: 330px;
    object-fit: cover;
    display: block;
  }

  .rv-body-label {
    padding: 20px 24px 0;
    color: #0f172a;
    font-size: 15px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rv-body-text {
    padding: 16px 24px 26px;
    color: #334155;
    font-size: 15px;
    line-height: 1.8;
  }

  .rv-body-text p {
    margin: 0 0 14px;
  }

  .rv-body-text p:last-child {
    margin-bottom: 0;
  }

  .rv-side {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .rv-action-title {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 800;
  }

  .rv-action-btn {
    width: 100%;
    height: 44px;
    border: 0;
    border-radius: 10px;
    font: 800 14px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .rv-action-btn.edit {
    background: #eef2ff;
    color: #2447d8;
  }

  .rv-action-btn.delete {
    background: #fee2e2;
    color: #dc2626;
  }

  .ea-toast-wrap {
    position: fixed;
    top: 88px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: none;
  }

  .ea-toast {
    min-width: 220px;
    padding: 12px 18px;
    border-radius: 999px;
    background: #294bd6;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    text-align: center;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
  }

  @media (max-width: 1120px) {
    .ea-page,
    .rv-page {
      margin-left: 0;
      padding: 24px;
    }

    .ea-layout,
    .rv-layout {
      grid-template-columns: 1fr;
    }

    .ea-right,
    .rv-side {
      width: 100%;
    }
  }
`;

const IcSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const IcSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IcImg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IcCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcWarn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IcPen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

const IcTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IcDoc = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);

function countWords(text) {
  return text?.trim() ? text.trim().split(/\s+/).length : 0;
}

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function normalizeArticle(article, id) {
  return {
    id: article?.id || id || `article_${Date.now()}`,
    apiId: article?.apiId || article?.id || id,
    title: article?.title || "",
    synopsis: article?.synopsis || article?.excerpt || "",
    body: article?.body || "",
    thumbnail: article?.thumbnail || article?.image || "",
    image: article?.image || article?.thumbnail || "",
    category: article?.category || "General",
    categoryId: article?.categoryId,
    excerpt: article?.excerpt || article?.synopsis || "",
    wordCount: article?.wordCount || 0,
    readTime: article?.readTime || "0 min",
    status: article?.status || "draft",
    rejectionReason: article?.rejectionReason || null,
    date: article?.date || new Date().toLocaleDateString("id-ID"),
  };
}

function useToast() {
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  return { toast, showToast };
}

export default function EditArticle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const { toast, showToast } = useToast();

  const articleFromRoute = location.state?.article;

  const sourceArticle = useMemo(() => {
    return normalizeArticle(articleFromRoute, id);
  }, [articleFromRoute, id]);

  const [title, setTitle] = useState(sourceArticle.title);
  const [synopsis, setSynopsis] = useState(sourceArticle.synopsis);
  const [body, setBody] = useState(sourceArticle.body);
  const [thumbnail, setThumbnail] = useState(sourceArticle.thumbnail);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [selectedCat, setSelectedCat] = useState(sourceArticle.category);
  const [hasCategory, setHasCategory] = useState(Boolean(sourceArticle.category));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let alive = true;

    fetchCategories()
      .then((items) => {
        if (!alive) return;
        setCategories(items);
        if (!sourceArticle.category && items[0]?.name) {
          setSelectedCat(items[0].name);
          setHasCategory(true);
        }
      })
      .catch(() => {
        if (alive) setCategories([]);
      });

    return () => {
      alive = false;
    };
  }, [sourceArticle.category]);

  const wc = countWords(synopsis);
  const MAX = 400;
  const over = wc > MAX;
  const pct = Math.min(100, (wc / MAX) * 100);
  const readTime = wc === 0 ? 0 : Math.max(1, Math.ceil(wc / 200));
  const canSubmit = !over && wc >= 30 && title.trim().length > 0;

  const handleCategoryChange = (event) => {
    setSelectedCat(event.target.value);
    setHasCategory(true);
  };

  const removeCategory = () => {
    setHasCategory(false);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndSetImage = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showToast("Format gambar harus JPG atau PNG");
      return;
    }

    if (file.size > maxSize) {
      showToast("Ukuran gambar maksimal 2MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setThumbnail(imageUrl);
    setThumbnailFile(file);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    validateAndSetImage(file);
    event.target.value = "";
  };

  const handleImageDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    validateAndSetImage(file);
  };

  const buildPayload = (overrides = {}) => ({
    ...sourceArticle,
    title,
    synopsis,
    body,
    thumbnail,
    image: thumbnail,
    category: hasCategory ? selectedCat : "General",
    excerpt: synopsis.slice(0, 120) || sourceArticle.excerpt || "",
    wordCount: wc,
    readTime: `${readTime} min`,
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  // --- REVISI DI SINI: UBAH PROSES INPUT MENJADI ASYNC BIAR BISA HIT API IMGBB ---
  const saveToDatabase = async (updatedArticle) => {
    const category = categories.find((item) => item.name === updatedArticle.category);

    const formData = new FormData();
    formData.append("judul", updatedArticle.title);
    formData.append("ringkasan", updatedArticle.synopsis);
    formData.append("isi_lengkap", updatedArticle.body);
    formData.append("status", updatedArticle.status);
    formData.append("id_kategori", category?.apiId || sourceArticle.categoryId);
    formData.append("read_time", updatedArticle.readTime);

    let finalImageUrl = thumbnail;

    // Jika user memasukkan file gambar baru dari komputernya
    if (thumbnailFile) {
      const imgData = new FormData();
      imgData.append("image", thumbnailFile);

      try {
        // Otomatis convert gambar mentah ke cloud link string URL via ImgBB
        const res = await axios.post("https://api.imgbb.com/1/upload?key=648f0775a28b62dbba48e4cfd185e58e", imgData);
        finalImageUrl = res.data.data.url; 
      } catch (err) {
        console.error("Gagal otomatis upload ke ImgBB di sisi penulis", err);
        finalImageUrl = await fileToDataUrl(thumbnailFile);
      }
    }

    // Mengirim tautan string teks murni agar lolos CharField di Django lu
    formData.append("gambar_url", finalImageUrl);

    return updateArticle(sourceArticle.apiId || sourceArticle.id, formData);
  };

  const handleSaveDraft = async () => {
    const updatedArticle = buildPayload({
      status: "draft",
      rejectionReason: null,
    });

    try {
      showToast("Menyimpan draft...");
      await saveToDatabase(updatedArticle);
      showToast("Artikel Berhasil Diperbarui");

      setTimeout(() => {
        navigate("/my-articles", {
          state: { updatedArticle },
        });
      }, 800);
    } catch (e) {
      showToast("Gagal menyimpan perubahan");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const updatedArticle = buildPayload({
      status: "pending",
      rejectionReason: null,
    });

    try {
      showToast("Mengirim artikel...");
      await saveToDatabase(updatedArticle);
      showToast("Artikel Berhasil Dikirim");

      setTimeout(() => {
        navigate("/my-articles", {
          state: { updatedArticle },
        });
      }, 800);
    } catch (e) {
      showToast("Gagal mengirim artikel");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div className="ea-toast-wrap">
          <div className="ea-toast">{toast}</div>
        </div>
      )}

      <main className="ea-page">
        <div className="ea-topbar">
          <div className="ea-breadcrumb">
            <button className="ea-breadcrumb-link" type="button" onClick={handleBack}>
              My Articles
            </button>
            <span className="ea-breadcrumb-sep">›</span>
            <span>Edit Article</span>
          </div>

          <button className="ea-save-top" type="button" onClick={handleSaveDraft}>
            <IcSave />
            Save Changes
          </button>
        </div>

        {sourceArticle.rejectionReason && (
          <div className="rv-banner">
            <IcWarn />
            {sourceArticle.rejectionReason}
          </div>
        )}

        <div className="ea-layout">
          <section className="ea-left">
            <div className="ea-card ea-title-card">
              <p className="ea-label">Judul Artikel</p>
              <textarea
                className="ea-title-input"
                rows={2}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Masukkan judul yang menarik..."
              />
            </div>

            <div className="ea-card ea-synopsis-card">
              <h2 className="ea-section-title">Ringkasan (Paham 2 Menit)</h2>
              <p className="ea-section-subtitle">
                Tulis inti berita untuk pembaca cepat.
              </p>

              <div className="ea-synopsis-box">
                <textarea
                  className="ea-textarea"
                  value={synopsis}
                  onChange={(event) => setSynopsis(event.target.value)}
                  placeholder="Tuliskan ringkasan singkat di sini..."
                  style={over ? { color: "#dc2626" } : {}}
                />
              </div>
            </div>

            <div className="ea-card ea-body-card">
              <h2 className="ea-section-title">Artikel Lengkap</h2>
              <p className="ea-section-subtitle">
                Tuliskan versi lengkap artikel di sini.
              </p>

              <div className="ea-toolbar">
                <button className="ea-tool-btn" type="button" style={{ fontWeight: 800 }}>
                  B
                </button>
                <button className="ea-tool-btn" type="button" style={{ fontStyle: "italic" }}>
                  I
                </button>
                <button className="ea-tool-btn" type="button">
                  ≡
                </button>
                <button className="ea-tool-btn" type="button">
                  →
                </button>
                <button className="ea-tool-btn" type="button">
                  “
                </button>
              </div>

              <textarea
                className="ea-textarea ea-body-textarea"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Mulai menulis detail berita..."
              />
            </div>
          </section>

          <aside className="ea-right">
            <div className="ea-card compact">
              <p className="ea-label">Gambar Unggulan</p>

              {thumbnail ? (
                <img
                  className="ea-thumb"
                  src={thumbnail}
                  alt={title}
                  onClick={handleImageButtonClick}
                />
              ) : (
                <button
                  className="ea-thumb-placeholder"
                  type="button"
                  onClick={handleImageButtonClick}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleImageDrop}
                >
                  <IcImg />
                  <span>Klik atau seret gambar ke sini</span>
                  <span style={{ fontSize: 10, color: "#cbd5e1" }}>
                    JPG, PNG (Maks. 2MB)
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                className="ea-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
              />

              <button className="ea-upload-btn" type="button" onClick={handleImageButtonClick}>
                Ganti Gambar
              </button>
            </div>

            <div className="ea-card compact">
              <p className="ea-label">Kategori</p>

              <div className="ea-category-list">
                {hasCategory ? (
                  <span className="ea-category-tag">
                    {selectedCat}
                    <button
                      className="ea-category-remove"
                      type="button"
                      onClick={removeCategory}
                    >
                      ×
                    </button>
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    Belum ada kategori
                  </span>
                )}
              </div>

              <div className="ea-category-form">
                <select
                  className="ea-category-select"
                  value={selectedCat}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ea-card compact">
              <h2 className="ea-check-title">
                Pemeriksaan Publikasi Ringkasan
                {!over && wc > 0 && (
                  <span className="ea-check-ok">
                    <IcCheck />
                  </span>
                )}
              </h2>

              <div className="ea-metric-row">
                <div>
                  <div className="ea-metric-label">Word Count</div>
                  <div className={`ea-metric-value${over ? " red" : ""}`}>
                    {wc} <span className="ea-metric-sub">/ {MAX}</span>
                  </div>
                </div>

                <div>
                  <div className="ea-metric-label">Read Time</div>
                  <div className={`ea-metric-value${over ? " red" : ""}`}>
                    {readTime} <span className="ea-metric-sub">min</span>
                  </div>
                </div>
              </div>

              <div className="ea-progress">
                <div
                  className={`ea-progress-fill${over ? " red" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {over && (
                <div className="ea-warning">
                  <IcWarn />
                  Article exceeds 2-minute reading limit.
                </div>
              )}

              <div className="ea-action-stack">
                <button className="ea-primary-btn save" type="button" onClick={handleSaveDraft}>
                  <IcSave />
                  Save Draft
                </button>

                <button
                  className={`ea-primary-btn submit${canSubmit ? " enabled" : ""}`}
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  <IcSend />
                  Submit to Admin
                </button>
              </div>
            </div>

            <div className="ea-card compact">
              <h2 className="ea-tips-title">Tips Menulis 💡</h2>

              {writingTips.map((tip) => (
                <div className="ea-tip" key={tip.id}>
                  <span className="ea-tip-icon">
                    <IcCheck />
                  </span>
                  <div>
                    <strong>{tip.title}:</strong> {tip.tip}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export function RejectedView({ article, onEdit, onDelete, onBack }) {
  return (
    <>
      <style>{css}</style>

      <main className="rv-page">
        <div className="ea-breadcrumb rv-breadcrumb">
          <button className="ea-breadcrumb-link" type="button" onClick={onBack}>
            My Articles
          </button>
          <span className="ea-breadcrumb-sep">›</span>
          <span>Detail Artikel</span>
        </div>

        <div className="rv-banner">
          <IcWarn />
          {article.rejectionReason || "Artikel Ditolak oleh Admin"}
        </div>

        <div className="rv-layout">
          <section className="rv-main">
            <img
              className="rv-image"
              src={
                article.thumbnail ||
                article.image ||
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
              }
              alt={article.title}
            />

            <div className="rv-body-label">
              <IcDoc />
              Artikel Lengkap
            </div>

            <div className="rv-body-text">
              {(article.body || "").split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <aside className="rv-side">
            <div className="ea-card compact">
              <h2 className="rv-action-title">Quick Action</h2>

              <button
                className="rv-action-btn edit"
                type="button"
                onClick={() => onEdit(article)}
              >
                <IcPen />
                Edit
              </button>

              <button
                className="rv-action-btn delete"
                type="button"
                onClick={() => onDelete(article)}
              >
                <IcTrash />
                Hapus
              </button>
            </div>

            <div className="ea-card compact">
              <h2 className="ea-tips-title">Tips Menulis 💡</h2>

              {writingTips.map((tip) => (
                <div className="ea-tip" key={tip.id}>
                  <span className="ea-tip-icon">
                    <IcCheck />
                  </span>
                  <div>
                    <strong>{tip.title}:</strong> {tip.tip}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
