import django_filters
from django.db.models import Q
from .models import Berita

class BeritaFilter(django_filters.FilterSet):
    # Filter pencarian nama penulis (di Admin atau User)
    penulis = django_filters.CharFilter(method='filter_penulis')
    
    # Filter rentang tanggal berdasarkan created_at
    tgl_awal = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    tgl_akhir = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Berita
        fields = ['penulis', 'tgl_awal', 'tgl_akhir', 'status']

    def filter_penulis(self, queryset, name, value):
        return queryset.filter(
            Q(id_user__account__nama_lengkap__icontains=value) |
            Q(id_admin__account__nama_lengkap__icontains=value)
        )