import { Link } from "react-router-dom";
import "../styles/newsletter.css";

export default function NewsletterBox() {
  return (
    <section className="newsletter-wrapper">
      <div className="newsletter-card">
        {/* Ikon Amplop */}
        <div className="newsletter-icon">
          <img src="/img/mail.png" alt="Newsletter" />
        </div>

        {/* Konten Teks */}
        <h2 className="newsletter-title">The Monday Briefing</h2>
        <p className="newsletter-desc">
          Join 150,000+ subscribers who start their week with our curated 
          analysis of global affairs, culture, and innovation.
        </p>

        {/* Tombol Sign Up */}
        <Link to="/register">
          <button className="btn-signup">SIGN UP</button>
        </Link>
      </div>
    </section>
  );
}