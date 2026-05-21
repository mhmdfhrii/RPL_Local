export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

export function sendNoContent(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  });
  res.end();
}

export function sendNotFound(res) {
  sendJson(res, 404, { detail: "Route tidak ditemukan." });
}

export function parseBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      const contentType = req.headers["content-type"] || "";
      if (contentType.includes("multipart/form-data")) {
        resolve(parseMultipartBody(rawBody, contentType));
        return;
      }

      if (contentType.includes("application/x-www-form-urlencoded")) {
        resolve(Object.fromEntries(new URLSearchParams(rawBody)));
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("Body request harus berupa JSON valid."));
      }
    });

    req.on("error", reject);
  });
}

function parseMultipartBody(rawBody, contentType) {
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] ||
    contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];

  if (!boundary) {
    return {};
  }

  return rawBody
    .split(`--${boundary}`)
    .reduce((fields, part) => {
      const name = part.match(/name="([^"]+)"/)?.[1];
      if (!name) return fields;

      const [, value = ""] = part.split(/\r?\n\r?\n/);
      fields[name] = value.replace(/\r?\n--$/, "").replace(/\r?\n$/, "");
      return fields;
    }, {});
}

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" ? token : "";
}

export function requireUser(req, res, store) {
  const token = getBearerToken(req);
  const user = store.findUserByToken(token);

  if (!user) {
    sendJson(res, 401, { detail: "Token tidak valid atau belum login." });
    return null;
  }

  return user;
}
