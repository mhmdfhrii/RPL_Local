import React from "react";
import Main from "../../components/news/Main";
import MainTrending from "../../components/news/MainTrending";
import Newsletter from "../../components/Newsletter";
import { getAccessToken } from "../../services/api";
import "../../styles/mainTrending.css";

export default function HomePage() {
  const isLoggedIn = Boolean(getAccessToken());

  return (
    <main className="homepage">
      <Main />

      <section className="homepage-content">
        <MainTrending />
      </section>

      {!isLoggedIn && (
        <section className="homepage-newsletter">
          <Newsletter />
        </section>
      )}
    </main>
  );
}
