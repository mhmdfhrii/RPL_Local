// src/hooks/useApiData.js
import { useEffect, useMemo, useState } from "react";
import { fetchArticle, fetchArticles, fetchBookmarks, fetchNotifications } from "../services/api";

export function useArticles(params = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Menggunakan useMemo agar alamat memori objek params dikunci 
  // dan gak memicu useEffect jalan terus-menerus pas re-render
  const MemoizedParams = useMemo(() => {
    return params;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    // Timer timeout 10 detik
    const timer = window.setTimeout(() => {
      if (alive) {
        setArticles([]);
        setError("Koneksi API terlalu lama merespons.");
        setLoading(false);
      }
    }, 10000);

    const loadArticles = async () => {
      try {
        const data = await fetchArticles(MemoizedParams);
        if (!alive) return;
        
        window.clearTimeout(timer);
        setArticles(data);
        setError("");
      } catch (err) {
        if (!alive) return;
        window.clearTimeout(timer);
        setArticles([]);
        setError(err.message || "Gagal memuat berita.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadArticles();

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [MemoizedParams]); // <--- Dikunci pake MemoizedParams yang stabil

  return { articles, loading, error };
}

export function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let alive = true;

    setLoading(true);
    fetchArticle(id)
      .then((data) => {
        if (alive) {
          setArticle(data);
          setError("");
        }
      })
      .catch((err) => {
        if (alive) {
          setArticle(null);
          setError(err.message || "Artikel tidak ditemukan.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  return { article, loading, error };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchBookmarks()
      .then((data) => {
        if (alive) setBookmarks(data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { bookmarks, setBookmarks, loading };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchNotifications()
      .then((data) => {
        if (alive) setNotifications(data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { notifications, loading };
}