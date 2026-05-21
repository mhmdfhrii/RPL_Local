from rest_framework import serializers
from .models import Account, AdminProfile, UserProfile, Kategori, Berita, Komentar, Newsletter, Reaksi, Bookmark, Notifikasi, LogAktivitas
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Mengambil model Account yang sudah diatur di settings.AUTH_USER_MODEL
UserAccount = get_user_model()

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        # Menggunakan model Account (Tabel User Dasar)
        model = UserAccount
        fields = ['id', 'username', 'nama_lengkap', 'foto_profil', 'role']

# --- KATEGORI (Versi Detail) ---
class KategoriSerializer(serializers.ModelSerializer):
    jumlah_artikel = serializers.SerializerMethodField()

    class Meta:
        model = Kategori
        fields = [
            'id_kategori', 'nama_kategori', 'slug', 
            'deskripsi', 'icon', 'urutan_tampil', 
            'tgl_diperbarui', 'jumlah_artikel'
        ]

    def get_jumlah_artikel(self, obj):
        # Relasi ke tabel Berita 
        return obj.berita_set.count()

# --- LOG AKTIVITAS ---
class LogAktivitasSerializer(serializers.ModelSerializer):
    user_detail = AccountSerializer(source='user', read_only=True)
    
    class Meta:
        model = LogAktivitas
        fields = ['id_log', 'user', 'user_detail', 'aksi', 'waktu']

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'tgl_daftar']

# --- REAKSI ---
class ReaksiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaksi
        fields = ['id_reaksi', 'account', 'berita', 'tipe_reaksi']

class KomentarSerializer(serializers.ModelSerializer):
    user_detail = AccountSerializer(source='account', read_only=True)

    class Meta:
        model = Komentar
        fields = ['id_komentar', 'account', 'user_detail', 'isi_komentar', 'tgl_komentar']

class NotifikasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifikasi
        fields = ['id_notifikasi', 'user', 'tipe', 'judul', 'pesan', 'is_read', 'tgl_notifikasi']

class BeritaSerializer(serializers.ModelSerializer):
    # Diubah ke CharField biar nerima string teks link URL gambar dari frontend, bukan file mentah upload
    gambar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    # Detail penulis bisa dari AdminProfile atau UserProfile 
    penulis_detail = serializers.SerializerMethodField()
    kategori_detail = KategoriSerializer(source='id_kategori', read_only=True)
    komentar = KomentarSerializer(many=True, read_only=True, source='komentar_list')
    reaksi_summary = serializers.SerializerMethodField()

    class Meta:
        model = Berita
        fields = [
            'id_berita', 'judul', 'ringkasan', 'isi_lengkap', 
            'created_at', 'status', 'gambar_url', 'view_count', 
            'share_count', 'read_time', 'is_featured', 
            'id_admin', 'id_user', 'id_kategori', 'penulis_detail', 
            'kategori_detail', 'komentar', 'reaksi_summary',
            'feedback_admin'
        ]
        read_only_fields = ['view_count', 'share_count']

    def get_penulis_detail(self, obj):
        # Proteksi try-except biar gak meledak Error 500 kalau data profile-nya belum dibuat di DB
        try:
            if obj.id_admin and obj.id_admin.account:
                return obj.id_admin.account.nama_lengkap
        except Exception:
            pass

        try:
            if obj.id_user and obj.id_user.account:
                return obj.id_user.account.nama_lengkap
        except Exception:
            pass
            
        return "Anonim"

    def get_reaksi_summary(self, obj):
        from django.db.models import Count
        counts = obj.reaksi_list.values('tipe_reaksi').annotate(total=Count('tipe_reaksi'))
        return {item['tipe_reaksi']: item['total'] for item in counts}

# --- BOOKMARK (Update field 'user' menjadi 'account') ---
class BookmarkSerializer(serializers.ModelSerializer):
    berita_detail = BeritaSerializer(source='berita', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id_bookmark', 'account', 'berita', 'berita_detail', 'tgl_simpan', 'is_archived']
        read_only_fields = ['account']

class RegisterSerializer(serializers.ModelSerializer):
    # Mapping full_name ke field nama_lengkap di model Account
    full_name = serializers.CharField(source='nama_lengkap') 
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ['full_name', 'email', 'username', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Password tidak cocok!"})
        return data

    def create(self, validated_data):
        # Membuat user baru pada sistem autentikasi
        nama_lengkap = validated_data.pop('nama_lengkap')
        user = UserAccount.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            nama_lengkap=nama_lengkap,
            password=make_password(validated_data['password'])
        )
        return user

# --- CUSTOM SERIALIZER LOGIN JWT (BIAR RESPONSES NGIRIM DATA ROLE) ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Nyisipin data role ke payload token JWT-nya
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Nambahin response body biar frontend dapet info user & role pas login sukses
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role  # Otomatis ngambil string 'admin' atau 'user' dari database
        return data