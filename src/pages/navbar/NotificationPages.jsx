// src/pages/NotificationPages.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  BookOpen, 
  Globe, 
  Landmark, 
  User, 
  MessageSquare 
} from 'lucide-react';
import { useNotifications } from '../../hooks/useApiData';
import '../../styles/notifications.css';

const NotificationPages = () => {
  const navigate = useNavigate();
  const { notifications: databaseNotifications, loading } = useNotifications();

  // Helper function to get icon based on category
  const getIcon = (category) => {
    const iconMap = {
      ENVIRONMENT: BookOpen,
      TECHNOLOGY: Globe,
      POLITICS: Landmark,
      SOCIAL: User,
    };
    const key = String(category || "").toUpperCase();
    return iconMap[key] || BookOpen;
  };

  // Memetakan seluruh data notification dari database secara dinamis tanpa potongan kaku
  const notifications = (databaseNotifications || []).map((notification, index) => {
    const isComment = notification.type === "comment" || notification.category?.toLowerCase() === "comment";
    return {
      ...notification,
      id: notification.id || `notif_${index}_${Date.now()}`,
      title: notification.title || "Notifikasi Baru",
      excerpt: notification.excerpt || notification.message || "Detail notifikasi baru telah masuk.",
      time: notification.time || notification.date || "Baru saja",
      icon: isComment ? MessageSquare : getIcon(notification.type || notification.category),
      bgClass: ['bg-red-light', 'bg-yellow-light', 'bg-green-light', 'bg-blue-light', 'bg-purple-light'][index % 5]
    };
  });

  // Memisahkan kategori komentar dan berita secara dinamis agar tidak memotong jumlah data asli
  const commentNotifications = notifications.filter(n => n.type === "comment" || n.category?.toLowerCase() === "comment");
  const generalNotifications = notifications.filter(n => n.type !== "comment" && n.category?.toLowerCase() !== "comment");

  return (
    <div className="notifications-page-container">
      {/* Header */}
      <div className="notifications-header">
        <button className="back-button" onClick={() => navigate(-1)} type="button">
          <ChevronLeft size={32} />
        </button>
        <div className="notifications-title-container">
          <h1>Notifications</h1>
          {notifications.length > 0 && (
            <span className="notifications-badge">+{notifications.length}</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="notifications-section">
          <div className="notification-item">
            <div className="notification-content">
              <p>Memuat notifikasi terbaru...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hari Ini / Berita Baru Section */}
          <div className="notifications-section">
            <div className="notifications-section-title">BERITA & INFORMASI BARU</div>

            {generalNotifications.length === 0 && (
              <div className="notification-item">
                <div className="notification-content">
                  <h4>Belum ada notifikasi baru</h4>
                  <p>Pemberitahuan artikel atau update kategori akan muncul di sini.</p>
                </div>
              </div>
            )}
            
            {generalNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className={`notification-icon-wrapper ${notification.bgClass}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.excerpt}</p>
                  </div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              );
            })}
          </div>

          {/* Aktivitas Komentar Section */}
          <div className="notifications-section">
            <div className="notifications-section-title">AKTIVITAS KOMENTAR</div>
            
            {commentNotifications.length === 0 && (
              <div className="notification-item">
                <div className="notification-content">
                  <h4>Belum ada interaksi komentar</h4>
                  <p>Notifikasi balasan atau komentar baru pada artikel lu akan tampil di sini.</p>
                </div>
              </div>
            )}

            {commentNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className={`notification-icon-wrapper ${notification.bgClass}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="notification-content">
                    <h4>Komentar Baru: {notification.title}</h4>
                    <p>{notification.excerpt}</p>
                  </div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPages;