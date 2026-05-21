from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    Berita, Kategori, Komentar, Reaksi, Newsletter, 
    Bookmark, Notifikasi, LogAktivitas, AdminProfile, UserProfile
)
from .serializers import (
    BeritaSerializer, KategoriSerializer, KomentarSerializer, 
    ReaksiSerializer, NewsletterSerializer, BookmarkSerializer, 
    NotifikasiSerializer, RegisterSerializer, LogAktivitasSerializer,
    CustomTokenObtainPairSerializer 
)
from .filters import BeritaFilter 
UserAccount = get_user_model()

class BeritaPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- AUTENTIKASI (Modul 01) ---
class RegisterView(generics.CreateAPIView):
    queryset = UserAccount.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer 

# --- DASHBOARD SUMMARY (MODUL 03 & 04) ---
class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            return Response({
                'stats': {
                    'total_articles': Berita.objects.count(),
                    'pending_articles': Berita.objects.filter(status='pending').count(),
                    'published_articles': Berita.objects.filter(status='published').count(),
                    'total_users': UserAccount.objects.filter(role='user').count(),
                },
                'recent_activities': LogAktivitasSerializer(LogAktivitas.objects.all()[:5], many=True).data
            })
        
        # Dialokasikan pengaman getattr agar tidak crash 500 jika profil user_info kosong
        user_profile = getattr(user, 'user_info', None)
        if user_profile:
            my_berita = Berita.objects.filter(id_user=user_profile)
            total_articles = my_berita.count()
            total_likes = Reaksi.objects.filter(berita__id_user=user_profile).count()
            total_comments = Komentar.objects.filter(berita__id_user=user_profile).count()
            recent_articles = BeritaSerializer(my_berita.order_by('-created_at')[:3], many=True).data
        else:
            total_articles = 0
            total_likes = 0
            total_comments = 0
            recent_articles = []

        return Response({
            'stats': {
                'total_articles': total_articles,
                'total_likes': total_likes,
                'total_comments': total_comments,
            },
            'recent_articles': recent_articles
        })

# --- VIEWSETS KATEGORI (M-04.5) ---
class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# --- VIEWSETS BERITA (M-02, M-03, M-04) ---
class BeritaViewSet(viewsets.ModelViewSet):
    serializer_class = BeritaSerializer
    queryset = Berita.objects.all()
    pagination_class = BeritaPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = BeritaFilter
    search_fields = ['judul', 'ringkasan'] 
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        author_filter = self.request.query_params.get('author')
        if author_filter == 'me' and user.is_authenticated:
            if user.role == 'admin':
                # FIX ADMIN: Langsung tampilin semua berita di dashboard tanpa filter per ID individu
                return Berita.objects.all()
            
            user_profile = getattr(user, 'user_info', None)
            if user_profile:
                return Berita.objects.filter(id_user=user_profile)
            return Berita.objects.none()
        return Berita.objects.filter(status='published')

    def perform_create(self, serializer):
        user = self.request.user
        status_input = self.request.data.get('status', 'draft')
        
        # Menggunakan getattr untuk mengantisipasi object profile belum di-generate di DB
        admin_ref = getattr(user, 'admin_info', None) if user.role == 'admin' else None
        user_ref = getattr(user, 'user_info', None) if user.role == 'user' else None
        
        if user.role != 'admin' and status_input == 'published':
            status_input = 'pending'
            
        # Pengecekan tambahan: Jika front-end mengirimkan object file mentah alih-alih string URL,
        # kita kosongkan nilainya agar tidak memicu crash OSError Read-only di Vercel.
        gambar_input = self.request.data.get('gambar_url', None)
        if not isinstance(gambar_input, str):
            gambar_input = None

        berita = serializer.save(
            id_admin=admin_ref, 
            id_user=user_ref, 
            status=status_input,
            gambar_url=gambar_input
        )
        LogAktivitas.objects.create(user=user, aksi=f"menambahkan artikel '{berita.judul}'")

# --- VIEWSETS INTERAKSI ---
class KomentarViewSet(viewsets.ModelViewSet):
    queryset = Komentar.objects.all()
    serializer_class = KomentarSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(account=self.request.user)

class ReaksiViewSet(viewsets.ModelViewSet):
    queryset = Reaksi.objects.all()
    serializer_class = ReaksiSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(account=self.request.user)

    def perform_create(self, serializer):
        serializer.save(account=self.request.user)

# --- VIEWSETS SISTEM ---
class NotifikasiViewSet(viewsets.ModelViewSet):
    serializer_class = NotifikasiSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notifikasi.objects.filter(user=self.request.user)

class LogAktivitasViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LogAktivitas.objects.all()
    serializer_class = LogAktivitasSerializer
    permission_classes = [permissions.IsAdminUser]

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [permissions.AllowAny]