import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/navbar/HomePage";
import NewsPage from "./pages/navbar/NewsPage";
import NewsDetailPage from "./pages/navbar/NewsDetailPage";
import TrendingPage from "./pages/navbar/TrendingPage";
import SignInPage from "./pages/auth/SignInPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SavedPage from "./pages/navbar/SavedPage";
import ContactPage from "./pages/footer/ContactPage";
import AboutPage from "./pages/footer/AboutPage";
import PrivacyPages from "./pages/footer/PrivacyPages";
import NotificationPages from "./pages/navbar/NotificationPages";
import Header from "./dashboard/component/Header";
import Sidebar from "./dashboard/component/Sidebar";
import Dashboard from "./dashboard/pages/user/DashboardPage";
import EditArticle, { RejectedView } from "./dashboard/pages/user/EditArticle";
import MyArticles from "./dashboard/pages/user/MyArticle";
import WriteNews from "./dashboard/pages/user/WriteNews";
import AdminDashboardPage from "./dashboard/pages/admin/AdminDashboardPage";
import ManageNewsPage from "./dashboard/pages/admin/ManageNewsPage";
import PendingApprovalPage from "./dashboard/pages/admin/PendingApprovalSimple";
import EditNews from "./dashboard/pages/admin/EditNews";
import { fetchArticles } from "./dashboard/services/api";

const defaultUser = {
  name: "User",
  username: "@user",
  avatar: "",
};

function getStoredUser() {
  try {
    const user = JSON.parse(localStorage.getItem("pahamUser") || "{}");

    return {
      name: user.nama_lengkap || user.username || defaultUser.name,
      username: user.username ? `@${user.username}` : defaultUser.username,
      avatar: user.foto_profil || "",
    };
  } catch {
    return defaultUser;
  }
}

const adminPathPrefixes = [
  "/admin",
  "/admin-dashboard",
  "/manage-news",
  "/pending",
  "/edit-news",
];

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/notifications" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/my-articles" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/edit-article") ||
    location.pathname.startsWith("/edit-news") ||
    location.pathname === "/write-news" ||
    location.pathname === "/write" ||
    location.pathname === "/manage-news" ||
    location.pathname === "/pending" ||
    location.pathname === "/admin-activity";
  const hideFooter = hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPages />} />
        <Route path="/notifications" element={<NotificationPages />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-articles" element={<MyArticles />} />
          <Route path="/edit-article/:id" element={<EditArticleRoute />} />
          <Route path="/write" element={<WriteNews />} />
          <Route path="/write-news" element={<WriteNews />} />

          <Route path="/admin-dashboard" element={<AdminDashboardRoute />} />
          <Route path="/admin/manage-news" element={<ManageNewsPage />} />
          <Route path="/manage-news" element={<ManageNewsPage />} />
          <Route path="/admin/edit-news/:id" element={<EditNews />} />
          <Route path="/edit-news/:id" element={<EditNews />} />
          <Route path="/admin/pending" element={<PendingApprovalPage />} />
          <Route path="/pending" element={<PendingApprovalPage />} />
          <Route path="/admin/write" element={<WriteNews />} />
          <Route path="/admin/write-news" element={<WriteNews />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("pahamAccessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  let userRole = "user";
  try {
    const stored = localStorage.getItem("pahamUser");
    if (stored) {
      const u = JSON.parse(stored);
      userRole = String(u.role || "user").toLowerCase();
    }
  } catch (e) {
    // ignore
  }

  const isAdminPath = adminPathPrefixes.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  if (userRole === "admin" && location.pathname === "/dashboard") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (userRole !== "admin" && isAdminPath) {
    return <Navigate to="/dashboard" replace />;
  }

  const currentRole = userRole;

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("pahamUser");
    navigate("/signin");
  };

  return (
    <div
      className="dashboard-app-container"
      style={{ minHeight: "100vh", background: "#f7f7f8" }}
    >
      <Header user={getStoredUser()} />
      <Sidebar role={currentRole} onLogout={handleLogout} />
      <Outlet />
    </div>
  );
}

function AdminDashboardRoute() {
  const navigate = useNavigate();

  return (
    <AdminDashboardPage
      user={getStoredUser()}
      onWriteNews={() => navigate("/admin/write")}
      onPendingApproval={() => navigate("/admin/pending")}
      onManageNews={() => navigate("/admin/manage-news")}
      onLogout={() => navigate("/signin")}
    />
  );
}

function EditArticleRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [databaseArticle, setDatabaseArticle] = useState(null);
  const [loading, setLoading] = useState(!location.state?.article);

  const article = location.state?.article || databaseArticle;

  useEffect(() => {
    if (location.state?.article) return;

    let alive = true;

    fetchArticles({ author: "me" })
      .then((items) => {
        if (!alive) return;
        setDatabaseArticle(
          items.find((item) => String(item.id) === String(params.id)) || null,
        );
      })
      .catch(() => {
        if (alive) setDatabaseArticle(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [location.state?.article, params.id]);

  if (loading) return null;
  if (!article) return <Navigate to="/my-articles" replace />;

  const articleStatus = String(article?.status || "").toLowerCase();
  const shouldShowRejectedDetail =
    location.state?.viewRejected === true &&
    location.state?.forceEdit !== true;

  const handleEditRejected = (selectedArticle) => {
    navigate(`/edit-article/${selectedArticle.id}`, {
      replace: true,
      state: {
        article: selectedArticle,
        viewRejected: false,
        forceEdit: true,
      },
    });
  };

  const handleDeleteRejected = (selectedArticle) => {
    navigate("/my-articles", {
      state: {
        toastType: "deleted",
        deletedArticleId: selectedArticle?.id,
      },
    });
  };

  const handleBackFromEdit = () => {
    if (articleStatus === "rejected") {
      navigate(`/edit-article/${article.id}`, {
        replace: true,
        state: {
          article,
          viewRejected: true,
          forceEdit: false,
        },
      });

      return;
    }

    navigate("/my-articles");
  };

  if (shouldShowRejectedDetail) {
    return (
      <RejectedView
        article={article}
        onEdit={handleEditRejected}
        onDelete={handleDeleteRejected}
        onBack={() => navigate("/my-articles")}
      />
    );
  }

  return (
    <EditArticle
      article={article}
      onBack={handleBackFromEdit}
      onSave={(updatedArticle) =>
        navigate("/my-articles", {
          state: { toastType: "updated", updatedArticle },
        })
      }
      onSubmit={(updatedArticle) =>
        navigate("/my-articles", {
          state: {
            toastType: "submitted",
            updatedArticle: {
              ...updatedArticle,
              status: "pending",
              rejectionReason: null,
            },
          },
        })
      }
      showToast={() => {}}
    />
  );
}

export default App;
