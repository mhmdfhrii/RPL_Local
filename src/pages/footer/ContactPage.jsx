import React from 'react';
import { Mail } from 'lucide-react';
import '../../styles/contact.css';

const ContactPage = () => {
  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any questions, feedback, or collaboration.</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-card">
          <div className="contact-icon-wrapper">
            <Mail size={32} color="#0ea5e9" />
          </div>
          <h3>EMAIL REDAKSI</h3>
          <a href="mailto:paham.id@gmail.com" className="contact-email-text">
            paham.id@gmail.com
          </a>
        </div>

        <div className="contact-card">
          <h3>IKUTI KAMI</h3>
          <div className="social-icons-container">
            <div className="social-item">
              <div className="social-icon-circle">
                <Mail size={20} />
              </div>
              <a href="https://instagram.com/paham.id" className="social-link" target="_blank" rel="noopener noreferrer">
                @paham.id
              </a>
            </div>
            <div className="social-item">
              <div className="social-icon-circle">
                <Mail size={20} />
              </div>
              <a href="https://twitter.com/id_paham" className="social-link" target="_blank" rel="noopener noreferrer">
                @id_paham
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
