import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const fixturePath = path.join(projectRoot, "datalokal.json");
const dataDir = path.join(projectRoot, "backend", "data");
const articlesPath = path.join(dataDir, "articles.json");

function base64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function makeToken(username, type = "access") {
  const payload = {
    sub: username,
    type,
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  return `${base64Url({ alg: "local", typ: "JWT" })}.${base64Url(payload)}.local`;
}

function getUsernameFromLocalToken(token = "") {
  const [, payload] = token.split(".");
  if (!payload) return "";

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.sub || decoded.username || "";
  } catch (error) {
    return "";
  }
}

function verifyDjangoPassword(password, encodedPassword = "") {
  const [algorithm, iterations, salt, hash] = encodedPassword.split("$");

  if (algorithm !== "pbkdf2_sha256" || !iterations || !salt || !hash) {
    return false;
  }

  const derived = crypto.pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    32,
    "sha256",
  ).toString("base64");

  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

function loadFixtureUsers() {
  if (!fs.existsSync(fixturePath)) {
    return [];
  }

  try {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    return fixture
      .filter((item) => item.model === "berita.account")
      .map((item) => ({
        id: item.pk,
        username: item.fields.username,
        email: item.fields.email || "",
        nama_lengkap: item.fields.nama_lengkap || item.fields.username,
        foto_profil: item.fields.foto_profil || "",
        role: item.fields.role || "user",
        passwordHash: item.fields.password,
      }));
  } catch (error) {
    console.warn("[backend] datalokal.json tidak bisa dibaca:", error.message);
    return [];
  }
}

function createSeedUsers() {
  const fixtureUsers = loadFixtureUsers();
  const adminUsername = process.env.LOCAL_ADMIN_USERNAME || "adminpahamid";
  const adminPassword = process.env.LOCAL_ADMIN_PASSWORD || "adminpahamid";
  const userUsername = process.env.LOCAL_USER_USERNAME || "userpahamid";
  const userPassword = process.env.LOCAL_USER_PASSWORD || "userpahamid";

  const seedUsers = [
    {
      id: 999,
      username: adminUsername,
      email: `${adminUsername}@local.test`,
      nama_lengkap: "Admin Paham.ID",
      foto_profil: "",
      role: "admin",
      password: adminPassword,
    },
    {
      id: 1000,
      username: userUsername,
      email: `${userUsername}@local.test`,
      nama_lengkap: "User Paham.ID",
      foto_profil: "",
      role: "user",
      password: userPassword,
    },
  ];

  const knownUsernames = new Set(fixtureUsers.map((user) => user.username));
  return [
    ...fixtureUsers,
    ...seedUsers.filter((user) => !knownUsernames.has(user.username)),
  ];
}

function nowIso() {
  return new Date().toISOString();
}

function loadStoredArticles() {
  if (!fs.existsSync(articlesPath)) {
    return [];
  }

  try {
    const stored = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.warn("[backend] articles.json tidak bisa dibaca:", error.message);
    return [];
  }
}

function saveStoredArticles(articles) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
}

export function createDataStore() {
  const users = createSeedUsers();
  const sessions = new Map();
  const refreshSessions = new Map();
  const categories = [
    {
      id_kategori: 1,
      nama_kategori: "Teknologi",
      slug: "teknologi",
      deskripsi: "Berita teknologi dan kecerdasan buatan.",
      icon: "bi-cpu",
      urutan_tampil: 1,
      tgl_diperbarui: nowIso(),
      jumlah_artikel: 1,
    },
    {
      id_kategori: 2,
      nama_kategori: "Pendidikan",
      slug: "pendidikan",
      deskripsi: "Kabar kampus, belajar, dan literasi digital.",
      icon: "bi-mortarboard",
      urutan_tampil: 2,
      tgl_diperbarui: nowIso(),
      jumlah_artikel: 0,
    },
  ];
  const articles = loadStoredArticles();
  const bookmarks = [];
  const notifications = [];

  function publicUser(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      nama_lengkap: user.nama_lengkap,
      foto_profil: user.foto_profil || "",
    };
  }

  function findUser(username) {
    return users.find((user) => user.username === username || user.email === username);
  }

  function isPasswordValid(user, password) {
    if (typeof user.password === "string") {
      return user.password === password;
    }

    return verifyDjangoPassword(password, user.passwordHash);
  }

  function createSession(user) {
    const access = makeToken(user.username, "access");
    const refresh = makeToken(user.username, "refresh");
    sessions.set(access, user.username);
    refreshSessions.set(refresh, user.username);
    return { access, refresh };
  }

  return {
    users,
    categories,
    articles,
    bookmarks,
    notifications,
    saveArticles() {
      saveStoredArticles(articles);
    },
    nextArticleId() {
      return Math.max(0, ...articles.map((article) => Number(article.id_berita || 0))) + 1;
    },
    publicUser,
    login(username, password) {
      const user = findUser(username);
      if (!user || !isPasswordValid(user, password)) {
        return null;
      }

      return {
        ...createSession(user),
        ...publicUser(user),
      };
    },
    register(payload) {
      const username = String(payload.username || "").trim();
      const email = String(payload.email || "").trim();
      const password = String(payload.password || "");
      const confirmPassword = String(payload.confirm_password || "");

      if (!username || !email || !password) {
        return { error: "Username, email, dan password wajib diisi." };
      }

      if (password !== confirmPassword) {
        return { error: "Password tidak cocok." };
      }

      if (findUser(username) || users.some((user) => user.email === email)) {
        return { error: "Username atau email sudah terdaftar." };
      }

      const user = {
        id: users.length + 1,
        username,
        email,
        nama_lengkap: payload.full_name || username,
        foto_profil: "",
        role: "user",
        password,
      };
      users.push(user);
      return publicUser(user);
    },
    refresh(refreshToken) {
      const username = refreshSessions.get(refreshToken);
      const user = username ? findUser(username) : null;
      return user ? createSession(user) : null;
    },
    findUserByToken(token) {
      const username = sessions.get(token) || getUsernameFromLocalToken(token);
      const user = username ? findUser(username) : null;
      return user || null;
    },
  };
}
