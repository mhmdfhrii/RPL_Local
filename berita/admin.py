from django.contrib import admin
from .models import Account, AdminProfile, UserProfile, Kategori, Berita, Newsletter, Komentar, Reaksi, Notifikasi, LogAktivitas

# --- 1. Admin untuk Akun Utama (Login) ---
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'nama_lengkap', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff')
    search_fields = ('username', 'nama_lengkap', 'email')

# --- 2. Admin untuk Profil (Sesuai Tabel 3.1 & 3.2) ---
@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('id_admin', 'account', 'created_at')
    search_fields = ('account__username', 'account__nama_lengkap')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id_user', 'account', 'created_at')
    search_fields = ('account__username', 'account__nama_lengkap')

# --- 3. Admin untuk Kategori (Tabel 3.3) ---
@admin.register(Kategori)
class KategoriAdmin(admin.ModelAdmin):
    list_display = ('nama_kategori', 'slug', 'urutan_tampil')
    prepopulated_fields = {'slug': ('nama_kategori',)}
    ordering = ('urutan_tampil',)

# --- 4. Admin untuk Berita (Tabel 3.4) ---
@admin.register(Berita)
class BeritaAdmin(admin.ModelAdmin):
    # Menampilkan id_admin atau id_user untuk melihat siapa pembuatnya
    list_display = ('judul', 'id_admin', 'id_user', 'id_kategori', 'status', 'is_featured', 'view_count')
    list_filter = ('status', 'id_kategori', 'is_featured')
    search_fields = ('judul', 'isi_lengkap')
    readonly_fields = ('view_count', 'share_count', 'created_at')

    actions = ['make_published', 'make_rejected']

    @admin.action(description="Terbitkan berita (Published)")
    def make_published(self, request, queryset):
        queryset.update(status='published')
        self.message_user(request, "Berita terpilih berhasil diterbitkan.")

    @admin.action(description="Tolak berita (Rejected)")
    def make_rejected(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, "Berita terpilih telah ditolak.")

# --- 5. Admin untuk Interaksi (Modul 02) ---
@admin.register(Komentar)
class KomentarAdmin(admin.ModelAdmin):
    list_display = ('account', 'berita', 'tgl_komentar')
    list_filter = ('berita',)
    search_fields = ('isi_komentar', 'account__username')

@admin.register(Reaksi)
class ReaksiAdmin(admin.ModelAdmin):
    list_display = ('account', 'berita', 'tipe_reaksi')
    list_filter = ('tipe_reaksi',)

# --- 6. Register Model Lainnya ---
admin.site.register(Newsletter)
admin.site.register(Notifikasi)
admin.site.register(LogAktivitas)