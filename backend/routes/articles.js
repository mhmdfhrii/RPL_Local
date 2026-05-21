import { parseBody, requireUser, sendJson, sendNoContent } from "../lib/http.js";

function toArticlePayload(article, store) {
  const category =
    store.categories.find((item) => item.id_kategori === Number(article.id_kategori)) ||
    store.categories[0];

  return {
    ...article,
    kategori_detail: category,
    komentar: article.komentar || [],
    reaksi_summary: article.reaksi_summary || {},
  };
}

function filterArticles(req, articles, user) {
  const params = req.searchParams;
  const author = params.get("author");
  const all = params.get("all");
  const status = params.get("status");

  let result = articles;

  if (author === "me" && user?.role !== "admin") {
    result = result.filter((article) => article.username === user.username);
  } else if (all !== "true" && user?.role !== "admin") {
    result = result.filter((article) => article.status === "published");
  }

  if (status) {
    result = result.filter((article) => article.status === status);
  }

  return result;
}

export async function handleArticleRoute(req, res, pathParts, store) {
  const id = pathParts[1] ? Number(pathParts[1]) : null;

  if (req.method === "GET" && !id) {
    const tokenUser = store.findUserByToken(req.token);
    const articles = filterArticles(req, store.articles, tokenUser).map((article) =>
      toArticlePayload(article, store),
    );
    sendJson(res, 200, articles);
    return true;
  }

  if (req.method === "POST" && !id) {
    const user = requireUser(req, res, store);
    if (!user) return true;

    const body = await parseBody(req);
    const article = {
      id_berita: store.nextArticleId(),
      judul: body.judul || body.judul_berita || "Untitled Article",
      ringkasan: body.ringkasan || "",
      isi_lengkap: body.isi_lengkap || body.isi_berita || body.content || "",
      status: user.role === "admin" ? body.status || "published" : body.status || "pending",
      gambar_url: body.gambar_url || body.gambar || "",
      view_count: 0,
      share_count: 0,
      read_time: body.read_time || "2 min read",
      is_featured: Boolean(body.is_featured),
      id_admin: user.role === "admin" ? user.id : null,
      id_user: user.role === "user" ? user.id : null,
      id_kategori: Number(body.id_kategori || 1),
      created_at: new Date().toISOString(),
      tanggal_publikasi: null,
      feedback_admin: null,
      penulis_detail: user.nama_lengkap || user.username,
      username: user.username,
      komentar: [],
      reaksi_summary: {},
    };

    store.articles.unshift(article);
    store.saveArticles();
    sendJson(res, 201, toArticlePayload(article, store));
    return true;
  }

  if (!id) {
    return false;
  }

  const index = store.articles.findIndex((article) => article.id_berita === id);
  const article = store.articles[index];

  if (!article) {
    sendJson(res, 404, { detail: "Berita tidak ditemukan." });
    return true;
  }

  if (req.method === "GET") {
    sendJson(res, 200, toArticlePayload(article, store));
    return true;
  }

  if (req.method === "PATCH") {
    const user = requireUser(req, res, store);
    if (!user) return true;

    const body = await parseBody(req);
    const updated = {
      ...article,
      judul: body.judul || body.judul_berita || article.judul,
      ringkasan: body.ringkasan ?? article.ringkasan,
      isi_lengkap: body.isi_lengkap || body.isi_berita || article.isi_lengkap,
      status: body.status || article.status,
      gambar_url: body.gambar_url || body.gambar || article.gambar_url,
      id_kategori: Number(body.id_kategori || article.id_kategori),
      read_time: body.read_time || article.read_time,
      feedback_admin: body.feedback_admin ?? article.feedback_admin,
      tanggal_publikasi:
        body.status === "published" ? new Date().toISOString() : article.tanggal_publikasi,
    };

    store.articles[index] = updated;
    store.saveArticles();
    sendJson(res, 200, toArticlePayload(updated, store));
    return true;
  }

  if (req.method === "DELETE") {
    const user = requireUser(req, res, store);
    if (!user) return true;

    store.articles.splice(index, 1);
    store.saveArticles();
    sendNoContent(res);
    return true;
  }

  return false;
}
