"use client";
import React from 'react';
import TrendingCard from './TrendingCard';
import SidebarTrending from './SidebarTrending';
import { useArticles } from "../../hooks/useApiData";

export default function TrendingSection() {
  const { articles } = useArticles();
  const trendingNews = articles.slice(0, 4);

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-content">
          <div className="trending-header">
            <h2 className="serif-title">Trending News</h2>
            <span className="header-line"></span>
            <span className="view-all">VIEW ALL</span>
          </div>
          
          <div className="news-list-grid">
            {trendingNews.map((news) => (
              <TrendingCard key={news.id} news={news} />
            ))}
          </div>
        </div>
        
        {/* Sidebar pendamping di sebelah kanan */}
        <SidebarTrending />
      </div>
    </section>
  );
}
