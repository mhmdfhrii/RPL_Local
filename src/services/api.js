// src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

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
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^data:image\//i.test(value)) return value;
  if (/^blob:/i.test(value)) return "";
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

function formatTimeAgo(value) {
  if (!value) return "";

  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.round(diff / 36e5));

  if (hours < 24) return `${hours} jam yang lalu`;
  return `${Math.round(hours / 24)} hari yang lalu`;
}

export function normalizeComment(comment) {
  return {
    id: comment.id_komentar,
    author: comment.user_detail?.nama_lengkap || "User",
    avatar: absoluteMediaUrl(comment.user_detail?.foto_profil),
    text: comment.isi_komentar,
    time: formatTimeAgo(comment.tgl_komentar),
  };
}

export function normalizeArticle(article) {
  if (!article) return null;
  
  const category = article.kategori_detail?.nama_kategori || "General";
  const image = absoluteMediaUrl(article.gambar_url || article.gambar);
  const comments = Array.isArray(article.komentar)
    ? article.komentar.map(normalizeComment)
    : [];
  const reactions = article.reaksi_summary || {};
  const reactionTotal = Object.values(reactions).reduce(
    (total, value) => total + Number(value || 0),
    0,
  );

  return {
    id: article.id_berita,
    apiId: article.id_berita,
    title: article.judul,
    heroTitle: article.judul,
    category,
    image,
    thumbnail: image,
    cover: image,
    author: article.penulis_detail || "Redaksi Paham.ID",
    authorImage: "",
    // FIX TYPO: Membuang karakter Hanzi asing dari penulisan tanggal publikasi
    date: formatDate(article.tanggal_publikasi || article.created_at),
    timeAgo: formatTimeAgo(article.tanggal_publikasi || article.created_at),
    readTime: article.read_time || "2 min read",
    description: article.ringkasan || "",
    excerpt: article.ringkasan || "",
    summary: article.ringkasan || "",
    content: article.isi_lengkap || "",
    status: article.status,
    reads: Number(article.view_count || 0), // Menghubungkan langsung reads ke view_count dinamis Django lu
    likes: reactionTotal,
    comments: comments.length,
    commentItems: comments,
    reactions: {
      clap: Number(reactions.wow || 0),
      light: Number(reactions.idea || 0),
      think: Number(reactions.thinking || 0),
      blueHeart: Number(reactions.blue_heart || reactions.blue || 0),
      heart: Number(reactions.love || 0),
      bookmark: Number(article.share_count || 0),
    },
  };
}

export async function fetchArticles(params = {}) {
  const payload = await apiFetch("/berita/", { 
    params,
    auth: false,
  });
  return unwrapList(payload).map(normalizeArticle);
}

export async function login(identifier, password) {
  const payload = await apiFetch("/auth/login/", {
    method: "POST",
    auth: false, // Login tidak butuh token auth bawaan
    body: JSON.stringify({
      username: identifier,
      password,
    }),
  });

  localStorage.setItem("access", payload.access);
  localStorage.setItem("refresh", payload.refresh);
  localStorage.setItem(
    "pahamUser",
    JSON.stringify({
      username: payload.username,
      email: payload.email,
      role: payload.role,
      nama_lengkap: payload.nama_lengkap,
      foto_profil: payload.foto_profil || "",
    }),
  );

  return payload;
}

export async function register(data) {
  return apiFetch("/auth/register/", {
    method: "POST",
    auth: false, // Registrasi tidak butuh token auth bawaan
    body: JSON.stringify(data),
  });
}

export async function fetchArticle(id) {
  const payload = await apiFetch(`/berita/${id}/`, { auth: false });
  return normalizeArticle(payload);
}

export async function createComment(beritaId, text) {
  return apiFetch("/komentar/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      berita: beritaId,
      isi_komentar: text,
    }),
  });
}

export async function createReaction(beritaId, type) {
  const payload = await apiFetch("/reaksi/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      berita: beritaId,
      tipe_reaksi: type,
    }),
  });

  return normalizeArticle(payload);
}

export async function createBookmark(beritaId) {
  return apiFetch("/bookmark/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      berita: beritaId,
    }),
  });
}

export async function fetchBookmarks() {
  const token = getAccessToken();
  if (!token) return [];

  const payload = await apiFetch("/bookmark/", { auth: true });
  return unwrapList(payload).map((bookmark) => ({
    id: bookmark.id_bookmark,
    archived: bookmark.is_archived,
    beritaId: bookmark.berita,
    ...normalizeArticle(bookmark.berita_detail),
  }));
}

export async function deleteBookmark(id) {
  return apiFetch(`/bookmark/${id}/`, {
    method: "DELETE",
    auth: true,
  });
}

export async function updateBookmark(id, data) {
  return apiFetch(`/bookmark/${id}/`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function fetchNotifications() {
  const token = getAccessToken();
  if (!token) return [];

  const payload = await apiFetch("/notifikasi/", { auth: true });
  return unwrapList(payload).map((item) => ({
    id: item.id_notifikasi,
    title: item.judul,
    excerpt: item.pesan,
    unread: !item.is_read,
    time: formatTimeAgo(item.tgl_notifikasi),
    type: item.tipe,
  }));
}

export async function createArticle(data) {
  let body;

  if (data instanceof FormData) {
    body = data;
    // Otomatis ubah field FE ke field penamaan serializer Django kelompok lu
    if (body.has("judul")) {
      body.append("judul", body.get("judul"));
    }
    if (body.has("isi_lengkap")) {
      body.append("isi_lengkap", body.get("isi_lengkap"));
    }
    if (body.has("gambar_url")) {
      body.append("gambar_url", body.get("gambar_url"));
    }
  } else {
    body = JSON.stringify({
      judul: data.judul,
      ringkasan: data.ringkasan,
      isi_lengkap: data.isi_lengkap,
      status: data.status,
      id_kategori: data.id_kategori,
      read_time: data.read_time,
      gambar_url: data.gambar_url,
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
    if (body.has("judul")) {
      body.append("judul", body.get("judul"));
    }
    if (body.has("isi_lengkap")) {
      body.append("isi_lengkap", body.get("isi_lengkap"));
    }
    if (body.has("gambar_url")) {
      body.append("gambar_url", body.get("gambar_url"));
    }
  } else {
    body = JSON.stringify({
      judul: data.judul,
      ringkasan: data.ringkasan,
      isi_lengkap: data.isi_lengkap,
      status: data.status,
      id_kategori: data.id_kategori,
      read_time: data.read_time,
      gambar_url: data.gambar_url,
    });
  }

  return apiFetch(`/berita/${id}/`, {
    method: "PATCH",
    auth: true,
    body,
  });
}

export async function fetchCategories() {
  const payload = await apiFetch("/kategori/", { auth: false });
  return unwrapList(payload).map((category) => ({
    id: category.id_kategori,
    apiId: category.id_kategori,
    name: category.nama_kategori,
    slug: category.slug,
  }));
}
