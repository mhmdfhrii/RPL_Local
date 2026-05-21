import React from 'react';
import { 
  HeartHandshake, 
  Database, 
  User, 
  FileText, 
  BarChart2, 
  Settings, 
  ShieldCheck, 
  Share2, 
  Users, 
  History 
} from 'lucide-react';
import '../../styles/privacy.css';

const PrivacyPages = () => {
  return (
    <div className="privacy-page-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>
          Privasi Anda adalah prioritas kami. Kami berkomitmen untuk melindungi data pribadi Anda dengan standar keamanan editorial tertinggi.
        </p>
      </div>
      
      <div className="privacy-content">
        
        {/* Section 1 */}
        <div className="privacy-section">
          <div className="privacy-section-title">
            <HeartHandshake size={20} />
            <h3>1. Pendahuluan</h3>
          </div>
          <p className="privacy-text">
            Insight Editorial sangat menghargai kepercayaan Anda. Bagian ini menjelaskan komitmen kami dalam menjaga dan memproses data pribadi Anda dengan integritas dan transparansi penuh sesuai dengan standar industri media global.
          </p>
        </div>

        {/* Section 2 */}
        <div className="privacy-section">
          <div className="privacy-section-title">
            <Database size={20} />
            <h3>2. Informasi yang Kami Kumpulkan</h3>
          </div>
          
          <div className="privacy-subcard">
            <User size={18} className="privacy-subcard-icon" />
            <div className="privacy-subcard-content">
              <h4>Data Akun</h4>
              <p>Informasi dasar seperti alamat email, nama pengguna, dan preferensi akun yang Anda berikan saat pendaftaran.</p>
            </div>
          </div>

          <div className="privacy-subcard">
            <FileText size={18} className="privacy-subcard-icon" />
            <div className="privacy-subcard-content">
              <h4>Konten Buatan Pengguna</h4>
              <p>Semua artikel, draf, komentar, dan aset media yang Anda unggah ke dalam platform Insight Editorial.</p>
            </div>
          </div>

          <div className="privacy-subcard">
            <BarChart2 size={18} className="privacy-subcard-icon" />
            <div className="privacy-subcard-content">
              <h4>Data Penggunaan</h4>
              <p>Informasi tentang bagaimana Anda berinteraksi dengan layanan kami, termasuk log akses, perangkat yang digunakan, dan durasi sesi.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="privacy-section">
          <div className="privacy-section-title">
            <Settings size={20} />
            <h3>3. Penggunaan Informasi</h3>
          </div>
          <p className="privacy-text">Kami menggunakan informasi yang dikumpulkan untuk tujuan-tujuan berikut:</p>
          <ul className="privacy-list">
            <li>Mengelola dan memverifikasi akun pengguna Anda.</li>
            <li>Meningkatkan fungsionalitas layanan dan pengalaman pengguna melalui analitik.</li>
            <li>Menampilkan dan mendistribusikan konten sesuai dengan pengaturan privasi Anda.</li>
            <li>Mengirimkan notifikasi penting terkait keamanan dan pembaruan sistem.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="privacy-highlight-card">
          <div className="privacy-section-title">
            <ShieldCheck size={20} />
            <h3>4. Perlindungan Data</h3>
          </div>
          <p>
            Keamanan data Anda adalah prioritas utama. Kami menggunakan enkripsi kelas industri untuk menyimpan kata sandi (hashed) dan menerapkan protokol akses yang ketat untuk mencegah akses tidak sah, perubahan, atau kebocoran data.
          </p>
        </div>

        {/* Section 5 */}
        <div className="privacy-section">
          <div className="privacy-section-title">
            <Share2 size={20} />
            <h3>5. Berbagi Informasi</h3>
          </div>
          <p className="privacy-text">
            Kami memiliki kebijakan ketat: <strong>Insight Editorial tidak pernah menjual data pribadi Anda kepada pihak ketiga.</strong><br/>
            Informasi hanya akan dibagikan kepada pihak berwenang jika diwajibkan oleh hukum yang berlaku atau untuk melindungi hak-hak hukum kami.
          </p>
        </div>

        {/* Section 6 & 7 */}
        <div className="privacy-grid">
          <div className="privacy-border-card">
            <div className="privacy-section-title">
              <Users size={20} />
              <h3>6. Hak Pengguna</h3>
            </div>
            <p className="privacy-text" style={{ margin: 0 }}>
              Anda memiliki hak penuh untuk mengakses, memperbarui, atau menambahkan artikel berita Anda kapan saja melalui dashboard pengguna.
            </p>
          </div>

          <div className="privacy-border-card">
            <div className="privacy-section-title">
              <History size={20} />
              <h3>7. Perubahan Kebijakan</h3>
            </div>
            <p className="privacy-text" style={{ margin: 0 }}>
              Kebijakan ini dapat diperbarui secara berkala. Kami akan memberikan notifikasi melalui platform jika terdapat perubahan signifikan yang mempengaruhi hak-hak Anda.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPages;
