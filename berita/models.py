from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

# --- ACCOUNT DASAR (SISTEM LOGIN) ---
class Account(AbstractUser):
    nama_lengkap = models.CharField(max_length=255)
    foto_profil = models.ImageField(upload_to='profiles/', null=True, blank=True)
    # Role menentukan apakah dia masuk ke profil Admin atau User (M-01)
    role = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('user', 'User')], default='user')

# --- TABEL ADMIN (Tabel 3.1) ---
class AdminProfile(models.Model):
    id_admin = models.AutoField(primary_key=True)
    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='admin_info')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Admin: {self.account.username}"

# --- TABEL USER (Tabel 3.2) ---
class UserProfile(models.Model):
    id_user = models.AutoField(primary_key=True)
    account = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='user_info')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.account.username}"

# --- TABEL KATEGORI (Tabel 3.3) ---
class Kategori(models.Model):
    id_kategori = models.AutoField(primary_key=True)
    nama_kategori = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    deskripsi = models.TextField(blank=True, null=True) 
    icon = models.CharField(max_length=50, default='bi-tag') 
    urutan_tampil = models.IntegerField(default=1) 
    tgl_diperbarui = models.DateTimeField(auto_now=True) 

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nama_kategori)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['urutan_tampil', 'nama_kategori']

    def __str__(self):
        return self.nama_kategori

# --- TABEL BERITA (Tabel 3.4) ---
class Berita(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('published', 'Published'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
    ]

    id_berita = models.AutoField(primary_key=True)
    id_admin = models.ForeignKey(AdminProfile, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_admin')
    id_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_user')
    id_kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE, db_column='id_kategori')
    
    judul = models.CharField(max_length=255)
    ringkasan = models.TextField(null=True, blank=True)
    isi_lengkap = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    gambar_url = models.ImageField(upload_to='news/', null=True, blank=True)
    
    tanggal_publikasi = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    feedback_admin = models.TextField(null=True, blank=True) 
    is_featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    read_time = models.CharField(max_length=50, default="2 min read")
    share_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.judul

# --- TABEL BOOKMARK (Fitur Saved) ---
class Bookmark(models.Model):
    id_bookmark = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='bookmarks')
    berita = models.ForeignKey(Berita, on_delete=models.CASCADE, db_column='id_berita')
    tgl_simpan = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)

    class Meta:
        unique_together = ('account', 'berita')

# --- INTERAKSI (KOMENTAR & REAKSI) ---
class Komentar(models.Model):
    id_komentar = models.AutoField(primary_key=True)
    berita = models.ForeignKey(Berita, on_delete=models.CASCADE, related_name='komentar_list', db_column='id_berita')
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    isi_komentar = models.TextField()
    tgl_komentar = models.DateTimeField(auto_now_add=True)

class Reaksi(models.Model):
    id_reaksi = models.AutoField(primary_key=True)
    REACTION_TYPES = [
        ('wow', 'Wow'), ('idea', 'Idea'), ('thinking', 'Thinking'),
        ('sad', 'Sad'), ('down', 'Down'), ('love', 'Love'),
    ]
    berita = models.ForeignKey(Berita, on_delete=models.CASCADE, related_name='reaksi_list', db_column='id_berita')
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    tipe_reaksi = models.CharField(max_length=10, choices=REACTION_TYPES)

# --- NOTIFIKASI & LOG AKTIVITAS ---
class Notifikasi(models.Model):
    id_notifikasi = models.AutoField(primary_key=True)
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='notifikasi')
    tipe = models.CharField(max_length=50)
    judul = models.CharField(max_length=255)
    pesan = models.TextField()
    is_read = models.BooleanField(default=False)
    tgl_notifikasi = models.DateTimeField(auto_now_add=True)

class LogAktivitas(models.Model):
    id_log = models.AutoField(primary_key=True)
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    aksi = models.CharField(max_length=255)
    waktu = models.DateTimeField(auto_now_add=True)

# --- NEWSLETTER ---
class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    tgl_daftar = models.DateTimeField(auto_now_add=True)