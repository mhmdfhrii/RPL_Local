// src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

export function getAccessToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("pahamAccessToken") ||
    ""
  );
}

function buildUrl(path, params = {}) {
  const origin = globalThis.location?.origin || "http://127.0.0.1:8000";
  const url = new URL(`${API_BASE_URL}${path}`, origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Default auth diubah menjadi true agar seluruh request dashboard otomatis membawa token
async function apiFetch(path, { params, auth = true, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (auth && !token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, params), {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Tidak memiliki akses.");
  }

  if (!response.ok) {
    throw new Error(`API gagal: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function absoluteMediaUrl(value) {
  if (!value) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^data:image\//i.test(value)) return value;
  if (/^blob:/i.test(value)) return FALLBACK_IMAGE;
  return `${MEDIA_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function normalizeArticle(article = {}) {
  // Menyesuaikan pembacaan respons dari backend Django yang menggunakan key baru
  const image = absoluteMediaUrl(article.gambar || article.gambar_url || article.image || article.thumbnail);
  const comments = Array.isArray(article.komentar) ? article.komentar.length : Number(article.comments || 0);
  const reactions = article.reaksi_summary || {};
  const likes = Object.values(reactions).reduce(
    (total, value) => total + Number(value || 0),
    Number(article.likes || 0),
  );

  return {
    id: article.id_berita || article.id,
    apiId: article.id_berita || article.apiId || article.id,
    title: article.judul_berita || article.judul || article.title || "Untitled Article",
    category: article.kategori_detail?.nama_kategori || article.category || "General",
    categoryId: article.id_kategori || article.categoryId,
    excerpt: article.ringkasan || article.excerpt || article.synopsis || "",
    synopsis: article.ringkasan || article.synopsis || article.excerpt || "",
    body: article.isi_berita || article.isi_lengkap || article.body || article.content || "",
    content: article.isi_berita || article.isi_lengkap || article.content || article.body || "",
    image,
    thumbnail: image,
    readTime: article.read_time || article.readTime || "2 min read",
    status: String(article.status || "draft").toLowerCase(),
    author: article.penulis_detail || article.author || "Redaksi Paham.ID",
    authorAvatar: article.authorAvatar || "",
    date: formatDate(article.tanggal_publikasi || article.created_at || article.date),
    likes,
    comments,
    rejectionReason: article.feedback_admin || article.rejectionReason || null,
  };
}

export function normalizeCategory(category = {}) {
  return {
    id: category.id_kategori,
    apiId: category.id_kategori,
    name: category.nama_kategori,
    slug: category.slug,
    description: category.deskripsi || "",
    order: category.urutan_tampil || 1,
    count: category.jumlah_artikel || 0,
    updatedAt: formatDate(category.tgl_diperbarui),
  };
}

export async function fetchArticles(params = {}) {
  // Dipaksa selalu true agar halaman list writer & admin tidak terkena eror 401 akibat bypass token
  const payload = await apiFetch("/berita/", {
    params,
    auth: true,
  });
  return unwrapList(payload).map(normalizeArticle);
}

export async function fetchCategories() {
  const payload = await apiFetch("/kategori/", { auth: true });
  return unwrapList(payload).map(normalizeCategory);
}

export async function fetchDashboardSummary() {
  const payload = await apiFetch("/dashboard/summary/", { auth: true });
  return payload && !Array.isArray(payload) ? payload : null;
}

export async function deleteArticle(id) {
  return apiFetch(`/berita/${id}/`, { method: "DELETE", auth: true });
}

export async function createArticle(data) {
  let body;

  if (data instanceof FormData) {
    body = data;
    // Remap data FE agar match dengan field yang didefinisikan di Django serializer lu
    if (body.has("judul")) {
      body.append("judul_berita", body.get("judul"));
      body.delete("judul");
    }
    if (body.has("isi_lengkap")) {
      body.append("isi_berita", body.get("isi_lengkap"));
      body.delete("isi_lengkap");
    }
    if (body.has("gambar_url")) {
      body.append("gambar", body.get("gambar_url"));
      body.delete("gambar_url");
    }
  } else {
    body = JSON.stringify({
      judul_berita: data.judul || data.judul_berita,
      ringkasan: data.ringkasan,
      isi_berita: data.isi_lengkap || data.isi_berita,
      status: data.status,
      id_kategori: data.id_kategori,
      read_time: data.read_time,
      gambar: data.gambar_url || data.gambar,
    });
  }

  return apiFetch("/berita/", {
    method: "POST",
    auth: true,
    body,
  });
}

export async function updateArticle(id, data) {
  let body;

  if (data instanceof FormData) {
    body = data;
    // Remap data FE agar match dengan field yang didefinisikan di Django serializer lu
    if (body.has("judul")) {
      body.append("judul_berita", body.get("judul"));
      body.delete("judul");
    }
    if (body.has("isi_lengkap")) {
      body.append("isi_berita", body.get("isi_lengkap"));
      body.delete("isi_lengkap");
    }
    if (body.has("gambar_url")) {
      body.append("gambar", body.get("gambar_url"));
      body.delete("gambar_url");
    }
  } else {
    body = JSON.stringify({
      judul_berita: data.judul || data.judul_berita,
      ringkasan: data.ringkasan,
      isi_berita: data.isi_lengkap || data.isi_berita,
      status: data.status,
      id_kategori: data.id_kategori,
      read_time: data.read_time,
      gambar: data.gambar_url || data.gambar,
    });
  }

  return apiFetch(`/berita/${id}/`, {
    method: "PATCH",
    auth: true,
    body,
  });
}

export async function createCategory(data) {
  return apiFetch("/kategori/", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id, data) {
  return apiFetch(`/kategori/${id}/`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id) {
  return apiFetch(`/kategori/${id}/`, { method: "DELETE", auth: true });
}
