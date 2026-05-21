from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    BeritaViewSet, 
    KategoriViewSet, 
    KomentarViewSet, 
    NewsletterViewSet, 
    ReaksiViewSet,
    BookmarkViewSet,
    NotifikasiViewSet,
    RegisterView,
    LoginView,
    DashboardSummaryView,
    LogAktivitasViewSet
)

# 1. Router otomatis untuk ViewSets (CRUD standar)
router = DefaultRouter()
router.register(r'berita', BeritaViewSet, basename='berita')
router.register(r'kategori', KategoriViewSet)
router.register(r'komentar', KomentarViewSet)
router.register(r'reaksi', ReaksiViewSet)
router.register(r'newsletter', NewsletterViewSet)
router.register(r'bookmark', BookmarkViewSet, basename='bookmark')
router.register(r'notifikasi', NotifikasiViewSet, basename='notifikasi')
router.register(r'log-aktivitas', LogAktivitasViewSet, basename='log-aktivitas')

# 2. Gabungkan Router dengan URL Custom (Auth & Dashboard)
urlpatterns = [
    # Jalur Router
    path('', include(router.urls)),
    
    # Jalur Autentikasi (Register & Login)
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Jalur Khusus Dashboard
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]