import React from 'react';
import { Clock, Eye, ShieldCheck } from 'lucide-react';
import '../../styles/about.css';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>
          We provide concise <span className="about-highlight">2-minute read</span> news and full articles to help users stay informed quickly and efficiently.
        </p>
      </div>
      
      <div className="about-content">
        <h2 className="about-values-title">Our Core Values</h2>
        
        <div className="about-cards-container">
          <div className="about-card">
            <div className="about-card-icon-wrapper">
              <Clock size={24} color="#1d4ed8" />
            </div>
            <h3>Efficiency</h3>
            <p>
              Every second counts. Our proprietary summarization ensures you get the core facts without the fluff in record time.
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon-wrapper">
              <Eye size={24} color="#1d4ed8" />
            </div>
            <h3>Clarity</h3>
            <p>
              Simple language, profound impact. We strip away jargon to present news that is accessible to everyone, everywhere.
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon-wrapper">
              <ShieldCheck size={24} color="#1d4ed8" />
            </div>
            <h3>Integrity</h3>
            <p>
              Fact-checked and unbiased. Our editorial standards are built on the bedrock of traditional journalistic ethics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
