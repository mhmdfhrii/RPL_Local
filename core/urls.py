from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Jalur utama API Paham.ID yang mengarah ke app berita
    path('api/', include('berita.urls')), 
]

# PENTING: Agar foto_profil dan gambar_url bisa muncul di browser
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)