import { parseBody, sendJson } from "../lib/http.js";

export async function handleAuthRoute(req, res, pathParts, store) {
  const action = pathParts[1];

  if (req.method === "POST" && action === "login") {
    const body = await parseBody(req);
    const payload = store.login(body.username, body.password);

    if (!payload) {
      sendJson(res, 401, { detail: "Username atau password salah." });
      return true;
    }

    sendJson(res, 200, payload);
    return true;
  }

  if (req.method === "POST" && action === "register") {
    const body = await parseBody(req);
    const payload = store.register(body);

    if (payload.error) {
      sendJson(res, 400, { detail: payload.error });
      return true;
    }

    sendJson(res, 201, payload);
    return true;
  }

  if (req.method === "POST" && action === "token" && pathParts[2] === "refresh") {
    const body = await parseBody(req);
    const payload = store.refresh(body.refresh);

    if (!payload) {
      sendJson(res, 401, { detail: "Refresh token tidak valid." });
      return true;
    }

    sendJson(res, 200, payload);
    return true;
  }

  return false;
}
