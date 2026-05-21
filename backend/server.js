import http from "node:http";
import { URL } from "node:url";
import { createDataStore } from "./lib/dataStore.js";
import { getBearerToken, sendJson, sendNotFound } from "./lib/http.js";
import { handleArticleRoute } from "./routes/articles.js";
import { handleAuthRoute } from "./routes/auth.js";
import {
  handleBookmarkRoute,
  handleCategoryRoute,
  handleCommentRoute,
  handleDashboardRoute,
  handleNewsletterRoute,
  handleNotificationRoute,
  handleReactionRoute,
} from "./routes/misc.js";

const PORT = Number(process.env.PORT || 8000);
const store = createDataStore();

async function routeRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  req.searchParams = url.searchParams;
  req.token = getBearerToken(req);

  const pathParts = url.pathname
    .replace(/^\/api\/?/, "")
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean);
  const resource = pathParts[0] || "";

  try {
    if (url.pathname === "/api" || url.pathname === "/api/") {
      sendJson(res, 200, {
        name: "Paham.ID local backend",
        routes: [
          "/api/auth/login/",
          "/api/auth/register/",
          "/api/berita/",
          "/api/kategori/",
          "/api/dashboard/summary/",
        ],
      });
      return;
    }

    const handled =
      (resource === "auth" && (await handleAuthRoute(req, res, pathParts, store))) ||
      (resource === "berita" && (await handleArticleRoute(req, res, pathParts, store))) ||
      (resource === "kategori" && (await handleCategoryRoute(req, res, pathParts, store))) ||
      (resource === "dashboard" &&
        pathParts[1] === "summary" &&
        handleDashboardRoute(req, res, store)) ||
      (resource === "bookmark" && (await handleBookmarkRoute(req, res, store))) ||
      (resource === "komentar" && (await handleCommentRoute(req, res, store))) ||
      (resource === "reaksi" && (await handleReactionRoute(req, res, store))) ||
      (resource === "notifikasi" && handleNotificationRoute(req, res, store)) ||
      (resource === "newsletter" && (await handleNewsletterRoute(req, res, store)));

    if (!handled) {
      sendNotFound(res);
    }
  } catch (error) {
    sendJson(res, 500, {
      detail: "Backend lokal error.",
      error: error.message,
    });
  }
}

const server = http.createServer(routeRequest);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[backend] Local API aktif di http://127.0.0.1:${PORT}/api/`);
  console.log("[backend] Admin lokal: adminpahamid / adminpahamid");
});
