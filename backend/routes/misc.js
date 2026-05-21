import { parseBody, requireUser, sendJson, sendNoContent } from "../lib/http.js";

export async function handleCategoryRoute(req, res, pathParts, store) {
  const id = pathParts[1] ? Number(pathParts[1]) : null;

  if (req.method === "GET" && !id) {
    sendJson(res, 200, store.categories);
    return true;
  }

  if (req.method === "POST" && !id) {
    const user = requireUser(req, res, store);
    if (!user) return true;

    const body = await parseBody(req);
    const category = {
      id_kategori: store.categories.length + 1,
      nama_kategori: body.nama_kategori || body.name || "Kategori Baru",
      slug: body.slug || String(body.nama_kategori || body.name || "kategori-baru").toLowerCase().replace(/\s+/g, "-"),
      deskripsi: body.deskripsi || body.description || "",
      icon: body.icon || "bi-tag",
      urutan_tampil: Number(body.urutan_tampil || body.order || store.categories.length + 1),
      tgl_diperbarui: new Date().toISOString(),
      jumlah_artikel: 0,
    };

    store.categories.push(category);
    sendJson(res, 201, category);
    return true;
  }

  const index = store.categories.findIndex((category) => category.id_kategori === id);
  const category = store.categories[index];

  if (!category) {
    sendJson(res, 404, { detail: "Kategori tidak ditemukan." });
    return true;
  }

  if (req.method === "PATCH") {
    const user = requireUser(req, res, store);
    if (!user) return true;

    const body = await parseBody(req);
    const updated = {
      ...category,
      nama_kategori: body.nama_kategori || body.name || category.nama_kategori,
      slug: body.slug || category.slug,
      deskripsi: body.deskripsi ?? body.description ?? category.deskripsi,
      icon: body.icon || category.icon,
      urutan_tampil: Number(body.urutan_tampil || body.order || category.urutan_tampil),
      tgl_diperbarui: new Date().toISOString(),
    };

    store.categories[index] = updated;
    sendJson(res, 200, updated);
    return true;
  }

  if (req.method === "DELETE") {
    const user = requireUser(req, res, store);
    if (!user) return true;

    store.categories.splice(index, 1);
    sendNoContent(res);
    return true;
  }

  return false;
}

export function handleDashboardRoute(req, res, store) {
  if (req.method !== "GET") return false;

  const user = requireUser(req, res, store);
  if (!user) return true;

  const articles =
    user.role === "admin"
      ? store.articles
      : store.articles.filter((article) => article.username === user.username);

  sendJson(res, 200, {
    stats: {
      total_articles: articles.length,
      pending_articles: store.articles.filter((article) => article.status === "pending").length,
      published_articles: store.articles.filter((article) => article.status === "published").length,
      total_users: store.users.filter((item) => item.role === "user").length,
      total_likes: articles.reduce(
        (total, article) =>
          total +
          Object.values(article.reaksi_summary || {}).reduce((sum, value) => sum + Number(value || 0), 0),
        0,
      ),
      total_comments: articles.reduce((total, article) => total + (article.komentar?.length || 0), 0),
    },
    recent_articles: articles.slice(0, 3),
    recent_activities: [],
  });
  return true;
}

export async function handleBookmarkRoute(req, res, store) {
  const user = requireUser(req, res, store);
  if (!user) return true;

  if (req.method === "GET") {
    sendJson(
      res,
      200,
      store.bookmarks.filter((bookmark) => bookmark.account === user.username),
    );
    return true;
  }

  if (req.method === "POST") {
    const body = await parseBody(req);
    const article = store.articles.find((item) => item.id_berita === Number(body.berita));

    if (!article) {
      sendJson(res, 404, { detail: "Berita tidak ditemukan." });
      return true;
    }

    const existing = store.bookmarks.find(
      (bookmark) =>
        bookmark.account === user.username && bookmark.berita === article.id_berita,
    );

    if (existing) {
      sendJson(res, 200, {
        ...existing,
        already_exists: true,
        bookmark_count: Number(article.share_count || 0),
      });
      return true;
    }

    const bookmark = {
      id_bookmark: store.bookmarks.length + 1,
      account: user.username,
      berita: article.id_berita,
      berita_detail: article,
      tgl_simpan: new Date().toISOString(),
      is_archived: false,
    };

    article.share_count = Number(article.share_count || 0) + 1;
    store.bookmarks.push(bookmark);
    store.saveArticles();
    sendJson(res, 201, {
      ...bookmark,
      already_exists: false,
      bookmark_count: Number(article.share_count || 0),
    });
    return true;
  }

  return false;
}

export function handleNotificationRoute(req, res, store) {
  if (req.method !== "GET") return false;

  const user = requireUser(req, res, store);
  if (!user) return true;

  sendJson(
    res,
    200,
    store.notifications.filter((notification) => notification.user === user.username),
  );
  return true;
}

export async function handleNewsletterRoute(req, res) {
  if (req.method !== "POST") return false;

  await parseBody(req);
  sendJson(res, 201, {
    id: Date.now(),
    tgl_daftar: new Date().toISOString(),
  });
  return true;
}

export async function handleCommentRoute(req, res, store) {
  if (req.method !== "POST") return false;

  const user = requireUser(req, res, store);
  if (!user) return true;

  const body = await parseBody(req);
  const article = store.articles.find((item) => item.id_berita === Number(body.berita));

  if (!article) {
    sendJson(res, 404, { detail: "Berita tidak ditemukan." });
    return true;
  }

  const comment = {
    id_komentar: (article.komentar || []).length + 1,
    account: user.id,
    user_detail: store.publicUser(user),
    isi_komentar: body.isi_komentar || body.text || "",
    tgl_komentar: new Date().toISOString(),
  };

  article.komentar = [...(article.komentar || []), comment];
  store.saveArticles();
  sendJson(res, 201, comment);
  return true;
}

export async function handleReactionRoute(req, res, store) {
  if (req.method !== "POST") return false;

  const user = requireUser(req, res, store);
  if (!user) return true;

  const body = await parseBody(req);
  const article = store.articles.find((item) => item.id_berita === Number(body.berita));
  const reactionType = body.tipe_reaksi || "love";

  if (!article) {
    sendJson(res, 404, { detail: "Berita tidak ditemukan." });
    return true;
  }

  const userReactions = article.user_reactions || {};
  const previousValue = userReactions[user.username];
  const previousReactions = Array.isArray(previousValue)
    ? previousValue
    : previousValue
      ? [previousValue]
      : [];
  article.reaksi_summary = { ...(article.reaksi_summary || {}) };

  if (previousReactions.includes(reactionType)) {
    sendJson(res, 200, article);
    return true;
  }

  article.reaksi_summary[reactionType] =
    Number(article.reaksi_summary[reactionType] || 0) + 1;
  article.user_reactions = {
    ...userReactions,
    [user.username]: [...previousReactions, reactionType],
  };

  store.saveArticles();
  sendJson(res, 201, article);
  return true;
}
