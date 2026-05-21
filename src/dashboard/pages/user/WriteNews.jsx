// src/dashboard/pages/user/WriteNews.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // <--- Mengurus konversi gambar otomatis ke cloud
import { createArticle, fetchCategories } from "../../../services/api";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MAX_WORDS = 400;

const WRITING_TIPS = [
  {
    id: 1,
    title: "Gunakan Kalimat Aktif",
    tip: "Hindari pemborosan kata dengan struktur kalimat yang langsung pada intinya.",
  },
  {
    id: 2,
    title: "Satu Paragraf, Satu Ide",
    tip: "Pastikan setiap paragraf tetap pendek dan fokus agar lebih mudah dipindai pembaca.",
  },
  {
    id: 3,
    title: "Potong Kata yang Tidak Perlu",
    tip: "Hapus kata keterangan atau penghubung yang berlebihan untuk menghemat waktu baca.",
  },
  {
    id: 4,
    title: "Fokus pada Inti Berita",
    tip: "Sampaikan informasi terpenting di awal artikel (metode piramida terbalik).",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const countWords = (text) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .wn-wrap *, .wn-wrap *::before, .wn-wrap *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .wn-wrap {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8f9fb;
    min-height: 100vh;
    padding: 24px 28px 60px;
  }

  .wn-content-area {
    margin-left: 240px;
    margin-top: 64px;
    flex: 1;
    min-width: 0;
  }

  .wn-layout {
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }

  .wn-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }

  .wn-right {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .wn-card,
  .wn-side-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 22px;
  }

  .wn-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .wn-sublabel {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 14px;
  }

  .wn-title-input {
    width: 100%;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    background: transparent;
    resize: none;
    line-height: 1.4;
  }

  .wn-title-input::placeholder {
    color: #cbd5e1;
    font-weight: 700;
  }

  .wn-textarea {
    width: 100%;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 14px;
    color: #334155;
    background: transparent;
    resize: none;
    line-height: 1.7;
    min-height: 110px;
  }

  .wn-textarea::placeholder {
    color: #cbd5e1;
  }

  .wn-body-area {
    min-height: 270px;
  }

  .wn-toolbar {
    display: flex;
    gap: 14px;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf2f7;
  }

  .wn-tool-btn {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: serif;
    font-size: 14px;
    font-weight: 700;
    color: #334155;
    transition: background 0.1s;
    padding: 0;
  }

  .wn-tool-btn:hover {
    background: #f1f5f9;
  }

  .wn-thumb-placeholder {
    width: 100%;
    height: 160px;
    border-radius: 12px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #94a3b8;
    font-family: inherit;
    font-size: 13px;
    margin-bottom: 12px;
    border: 2px dashed #cbd5e1;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-align: center;
  }

  .wn-thumb-placeholder:hover {
    border-color: #2347c5;
    background: #eef2ff;
  }

  .wn-thumb-preview {
    width: 100%;
    height: 160px;
    border-radius: 12px;
    object-fit: cover;
    display: block;
    margin-bottom: 12px;
    background: #e2e8f0;
    cursor: pointer;
  }

  .wn-file-input {
    display: none;
  }

  .wn-upload-btn {
    width: 100%;
    padding: 10px 0;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    background: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    text-align: center;
    transition: background 0.1s, border-color 0.1s;
  }

  .wn-upload-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .wn-category-block {
    margin-top: 26px;
  }

  .wn-cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .wn-cat-plus-mini {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .wn-cat-plus-mini:hover {
    background: #f8fafc;
    color: #2347c5;
    border-color: #cbd5e1;
  }

  .wn-cat-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 24px;
  }

  .wn-cat-empty {
    font-size: 13px;
    color: #94a3b8;
  }

  .wn-cat-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eef2ff;
    color: #2f4fd0;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 700;
  }

  .wn-cat-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    font-size: 14px;
    line-height: 1;
    padding: 0;
  }

  .wn-cat-remove:hover {
    color: #dc2626;
  }

  .wn-cat-menu {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }

  .wn-cat-select {
    flex: 1;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-family: inherit;
    font-size: 13px;
    padding: 9px 10px;
    outline: none;
    color: #334155;
    background: #fff;
  }

  .wn-cat-add-btn {
    width: 42px;
    border: none;
    border-radius: 9px;
    background: #2347c5;
    color: #fff;
    font-family: inherit;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
  }

  .wn-pub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .wn-wc-row {
    display: flex;
    gap: 28px;
  }

  .wn-wc-col {
    flex: 1;
  }

  .wn-wc-label {
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 4px;
  }

  .wn-wc-val {
    font-size: 22px;
    font-weight: 800;
  }

  .wn-wc-val.green {
    color: #16a34a;
  }

  .wn-wc-val.red {
    color: #dc2626;
  }

  .wn-wc-sub {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
  }

  .wn-progress {
    height: 5px;
    border-radius: 999px;
    background: #e2e8f0;
    margin-top: 12px;
    overflow: hidden;
  }

  .wn-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: #16a34a;
    transition: width 0.3s ease;
  }

  .wn-progress-fill.red {
    background: #dc2626;
  }

  .wn-over-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fef2f2;
    border: 1.5px solid #fca5a5;
    color: #dc2626;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 600;
    margin-bottom: 16px;
    animation: wnAlertIn 0.25s ease;
  }

  @keyframes wnAlertIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .wn-over-alert svg {
    flex-shrink: 0;
  }

  .wn-submit-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .wn-primary-btn {
    width: 100%;
    padding: 13px 0;
    border-radius: 10px;
    border: none;
    font-family: inherit;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, background 0.15s;
  }

  .wn-primary-btn:hover {
    opacity: 0.9;
  }

  .wn-primary-btn.draft {
    background: #294bd6;
    color: #fff;
  }

  .wn-primary-btn.submit {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: default;
    pointer-events: none;
  }

  .wn-primary-btn.submit.on {
    background: #1e293b;
    color: #fff;
    cursor: pointer;
    pointer-events: auto;
  }

  .wn-tip-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 11.5px;
    color: #64748b;
    line-height: 1.45;
    margin-bottom: 9px;
  }

  .wn-tip-item:last-child {
    margin-bottom: 0;
  }

  .wn-tip-check {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #e0f2fe;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    color: #2563eb;
  }

  .wn-toast-wrap {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }

  .wn-toast {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.14);
    animation: wnToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .wn-toast.saved {
    background: #475569;
    color: #fff;
  }

  .wn-toast.submitted {
    background: #2347c5;
    color: #fff;
  }

  @keyframes wnToastIn {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.92);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes wnToastOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
  }

  .wn-toast.hiding {
    animation: wnToastOut 0.25s ease forwards;
  }

  @media (max-width: 1100px) {
    .wn-content-area {
      margin-left: 0;
      margin-top: 64px;
    }

    .wn-layout {
      flex-direction: column;
    }

    .wn-right {
      width: 100%;
    }
  }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IcSave = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const IcSend = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IcImg = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IcCheck = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcWarn = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "saved") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type, hiding: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, hiding: true } : toast,
        ),
      );

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300);
    }, 2800);
  };

  return { toasts, show };
}

// ─── WRITE NEWS PAGE ──────────────────────────────────────────────────────────
export default function WriteNews() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { toasts, show: showToast } = useToast();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [body, setBody] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [cats, setCats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [showCatMenu, setShowCatMenu] = useState(false);
  const currentRole = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("pahamUser") || "{}");
      return String(user.role || "user").toLowerCase();
    } catch {
      return "user";
    }
  })();

  useEffect(() => {
    let alive = true;

    fetchCategories()
      .then((items) => {
        if (!alive) return;
        setCategories(items);
        setSelectedCat(items[0]?.name || "");
      })
      .catch(() => {
        if (alive) setCategories([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const wc = countWords(synopsis);
  const over = wc > MAX_WORDS;
  const pct = Math.min(100, (wc / MAX_WORDS) * 100);
  const readTime = Math.max(1, Math.ceil(wc / 200));
  const canSave = title.trim().length > 0 && Boolean(cats[0] || selectedCat);
  const canSubmit = !over && wc >= 30 && canSave;

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const validateAndSetImage = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showToast("Format gambar harus JPG atau PNG", "saved");
      return;
    }

    if (file.size > maxSize) {
      showToast("Ukuran gambar maksimal 2MB", "saved");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setThumbnail(imageUrl);
    setThumbnailFile(file);
    showToast("Gambar berhasil dipilih", "submitted");
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

  const addCat = () => {
    if (!selectedCat) return;

    if (!cats.includes(selectedCat)) {
      setCats([...cats, selectedCat]);
    }

    setShowCatMenu(false);
  };

  const removeCat = (category) => {
    setCats(cats.filter((item) => item !== category));
  };

  const buildPayload = (status) => ({
    id: `user_${Date.now()}`,
    title,
    synopsis,
    body,
    thumbnail,
    image: thumbnail,
    category: cats[0] || "General",
    excerpt:
      synopsis.slice(0, 120) || "Tulis ringkasan singkat artikel di sini",
    wordCount: wc,
    readTime: `${readTime} min`,
    status,
    likes: 0,
    comments: 0,
    rejectionReason: null,
    date: new Date().toLocaleDateString("id-ID"),
  });

  const saveArticle = async (status) => {
    const payload = buildPayload(status);
    const category = categories.find((item) => item.name === payload.category);

    if (!category?.apiId) {
      throw new Error("Pilih kategori terlebih dahulu");
    }

    const formData = new FormData();
    formData.append("judul", payload.title);
    formData.append("ringkasan", payload.synopsis);
    formData.append("isi_lengkap", payload.body);
    formData.append("status", payload.status);
    formData.append("id_kategori", category?.apiId);
    formData.append("read_time", payload.readTime);

    let finalImageUrl = thumbnail;

    if (thumbnailFile) {
      const imgData = new FormData();
      imgData.append("image", thumbnailFile);

      try {
        const res = await axios.post("https://api.imgbb.com/1/upload?key=648f0775a28b62dbba48e4cfd185e58e", imgData);
        finalImageUrl = res.data.data.url;
      } catch (err) {
        console.error("Gagal otomatis upload ke ImgBB pas bikin berita", err);
        finalImageUrl = await fileToDataUrl(thumbnailFile);
      }
    }

    formData.append("gambar_url", finalImageUrl);

    return createArticle(formData);
  };

  const handleSaveDraft = async () => {
    if (!canSave) {
      showToast("Judul dan kategori wajib diisi", "saved");
      return;
    }

    try {
      showToast("Menyimpan draft...");
      await saveArticle("draft");
      showToast("Draft Tersimpan", "saved");

      setTimeout(() => {
        navigate("/my-articles");
      }, 1000);
    } catch (error) {
      showToast(error.message || "Gagal menyimpan draft", "saved");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      showToast("Mengirim artikel...");
      await saveArticle(currentRole === "admin" ? "published" : "pending");
      showToast(
        currentRole === "admin"
          ? "Artikel Berhasil Dipublikasikan"
          : "Artikel Berhasil Dikirim",
        "submitted",
      );

      setTimeout(() => {
        navigate(currentRole === "admin" ? "/admin/manage-news" : "/my-articles");
      }, 1000);
    } catch (error) {
      showToast(error.message || "Gagal mengirim artikel", "saved");
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="wn-toast-wrap">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`wn-toast ${toast.type}${toast.hiding ? " hiding" : ""}`}
          >
            <IcCheck /> {toast.message}
          </div>
        ))}
      </div>

      <div className="wn-content-area">
        <div className="wn-wrap">
          {over && (
            <div className="wn-over-alert">
              <IcWarn />
              Ringkasan melebihi batas {MAX_WORDS} kata! Harap kurangi agar
              artikel bisa dikirim ke admin.
            </div>
          )}

          <div className="wn-layout">
            <div className="wn-left">
              <div className="wn-card">
                <div className="wn-label">Judul Artikel</div>
                <textarea
                  className="wn-title-input"
                  rows={2}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Masukkan judul yang menarik..."
                />
              </div>

              <div className="wn-card">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                  Ringkasan (Paham 2 Menit)
                </div>
                <div className="wn-sublabel">
                  Tulis inti berita untuk pembaca cepat. Maks. {MAX_WORDS} kata.
                </div>
                <textarea
                  className="wn-textarea"
                  rows={5}
                  value={synopsis}
                  onChange={(event) => setSynopsis(event.target.value)}
                  placeholder="Tuliskan ringkasan singkat di sini..."
                  style={over ? { color: "#dc2626" } : {}}
                />
              </div>

              <div className="wn-card">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                  Artikel Lengkap
                </div>
                <div className="wn-sublabel">
                  Tuliskan versi lengkap artikel di sini.
                </div>

                <div className="wn-toolbar">
                  {[
                    { label: "B", style: { fontWeight: "bold" } },
                    { label: "I", style: { fontStyle: "italic" } },
                    { label: "≡", style: {} },
                    { label: "⇒", style: {} },
                    { label: "❝", style: {} },
                  ].map((tool, index) => (
                    <button
                      key={index}
                      type="button"
                      className="wn-tool-btn"
                      style={tool.style}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="wn-textarea wn-body-area"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Mulai menulis detail berita..."
                />
              </div>
            </div>

            <div className="wn-right">
              <div className="wn-side-card">
                <div className="wn-label">Gambar Unggulan</div>

                <input
                  ref={fileInputRef}
                  className="wn-file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                />

                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="thumb"
                    className="wn-thumb-preview"
                    onClick={handlePickImage}
                    onError={(event) => {
                      event.target.style.display = "none";
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="wn-thumb-placeholder"
                    onClick={handlePickImage}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleImageDrop}
                  >
                    <IcImg />
                    <span>Klik atau seret gambar ke sini</span>
                    <span style={{ fontSize: 11, color: "#cbd5e1" }}>
                      JPG, PNG (Maks. 2MB)
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  className="wn-upload-btn"
                  onClick={handlePickImage}
                >
                  Ganti Gambar
                </button>

                <div className="wn-category-block">
                  <div className="wn-cat-header">
                    <div className="wn-label" style={{ marginBottom: 0 }}>
                      Kategori
                    </div>

                    <button
                      type="button"
                      className="wn-cat-plus-mini"
                      onClick={() => setShowCatMenu((prev) => !prev)}
                    >
                      +
                    </button>
                  </div>

                  <div className="wn-cat-wrap">
                    {cats.map((category) => (
                      <span key={category} className="wn-cat-tag">
                        {category}
                        <button
                          type="button"
                          className="wn-cat-remove"
                          onClick={() => removeCat(category)}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {cats.length === 0 && (
                      <span className="wn-cat-empty">Belum ada kategori</span>
                    )}
                  </div>

                  {showCatMenu && (
                    <div className="wn-cat-menu">
                      <select
                        className="wn-cat-select"
                        value={selectedCat}
                        onChange={(event) => setSelectedCat(event.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="wn-cat-add-btn"
                        onClick={addCat}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="wn-side-card">
                <div className="wn-pub-header">
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    Pemeriksaan Publikasi
                  </span>

                  {!over && wc > 0 && (
                    <span style={{ color: "#16a34a" }}>
                      <IcCheck />
                    </span>
                  )}

                  {over && (
                    <span style={{ color: "#dc2626" }}>
                      <IcWarn />
                    </span>
                  )}
                </div>

                <div className="wn-wc-row">
                  <div className="wn-wc-col">
                    <div className="wn-wc-label">Word Count</div>
                    <div className={`wn-wc-val ${over ? "red" : "green"}`}>
                      {wc} <span className="wn-wc-sub">/ {MAX_WORDS}</span>
                    </div>
                  </div>

                  <div className="wn-wc-col">
                    <div className="wn-wc-label">Read Time</div>
                    <div className={`wn-wc-val ${over ? "red" : "green"}`}>
                      {wc === 0 ? 0 : readTime}{" "}
                      <span className="wn-wc-sub">min</span>
                    </div>
                  </div>
                </div>

                <div className="wn-progress">
                  <div
                    className={`wn-progress-fill${over ? " red" : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {over && (
                  <div
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: 8,
                      padding: "7px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IcWarn /> Article exceeds 2-minute reading limit.
                  </div>
                )}

                <div className="wn-submit-area">
                  <button
                    type="button"
                    className="wn-primary-btn draft"
                    onClick={handleSaveDraft}
                    disabled={!canSave}
                  >
                    <IcSave /> Save Draft
                  </button>

                  <button
                    type="button"
                    className={`wn-primary-btn submit${canSubmit ? " on" : ""}`}
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <IcSend /> Submit to Admin
                  </button>
                </div>
              </div>

              <div className="wn-side-card">
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
                  Tips Menulis 💡
                </div>

                {WRITING_TIPS.map((tip) => (
                  <div key={tip.id} className="wn-tip-item">
                    <div className="wn-tip-check">
                      <IcCheck />
                    </div>
                    <div>
                      <strong>{tip.title}:</strong> {tip.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
