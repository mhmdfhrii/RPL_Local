// src/pages/admin/ManageNewsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCategory,
  deleteArticle,
  deleteCategory,
  fetchArticles,
  fetchCategories,
  updateCategory,
} from "../../services/api";

const CATEGORY_PAGE_SIZE = 5;
const NEWS_PAGE_SIZE = 5;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --mn-sidebar: 260px;
    --mn-header: 76px;
    --mn-blue: #263875;
    --mn-action: #0047ab;
    --mn-dark: #142052;
  }

  .mn-page *,
  .mn-page *::before,
  .mn-page *::after {
    box-sizing: border-box;
  }

  .mn-page {
    margin-left: var(--mn-sidebar);
    margin-top: var(--mn-header);
    min-height: calc(100vh - var(--mn-header));
    padding: 62px 48px 60px 64px;
    background: #fbfaf9;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827;
  }

  .mn-page button,
  .mn-page input,
  .mn-page textarea,
  .mn-page select {
    font-family: inherit;
  }

  .mn-shell {
    max-width: 1040px;
    margin: 0 auto;
  }

  .mn-top-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 268px;
    gap: 24px;
    margin-bottom: 24px;
  }

  .mn-stat-card,
  .mn-panel,
  .mn-cat-card,
  .mn-form-card,
  .mn-note-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
  }

  .mn-stat-card {
    min-height: 178px;
    padding: 42px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mn-stat-title {
    font-size: 15px;
    font-weight: 800;
    color: #132052;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .mn-stat-link {
    color: #0047ab;
    font-size: 14px;
    font-weight: 600;
  }

  .mn-stat-metrics {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .mn-stat-metric {
    min-width: 76px;
    text-align: center;
  }

  .mn-stat-metric + .mn-stat-metric {
    border-left: 1px solid #eef2f7;
    padding-left: 28px;
  }

  .mn-stat-label {
    color: #64748b;
    font-size: 12px;
    margin-bottom: 3px;
  }

  .mn-stat-value {
    font-size: 26px;
    font-weight: 800;
    color: #202124;
  }

  .mn-stat-value.orange {
    color: #c2410c;
  }

  .mn-cat-card {
    min-height: 178px;
    padding: 28px 22px;
    background: linear-gradient(145deg, #0047ab 0%, #0f6be8 100%);
    color: #ffffff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  .mn-cat-title {
    font-size: 16px;
    font-weight: 800;
  }

  .mn-cat-sub {
    font-size: 14px;
    line-height: 1.45;
    opacity: 0.9;
  }

  .mn-cat-btn {
    height: 44px;
    border: 0;
    border-radius: 8px;
    background: #ffffff;
    color: #0047ab;
    font: 800 16px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
  }

  .mn-panel {
    overflow: visible;
  }

  .mn-table-top {
    height: 86px;
    padding: 0 24px;
    background: var(--mn-blue);
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mn-tabs {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .mn-tab {
    min-width: 88px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #ffffff;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .mn-tab.active {
    background: #a9bdf0;
    color: #16244f;
  }

  .mn-tools {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mn-tool-wrap {
    position: relative;
  }

  .mn-tool-btn {
    height: 38px;
    padding: 0 18px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    background: transparent;
    color: #ffffff;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
  }

  .mn-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 400px;
    z-index: 30;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
    padding: 28px 28px 26px;
  }

  .mn-dropdown.sort {
    width: 190px;
    padding: 0;
    overflow: hidden;
  }

  .mn-sort-item {
    height: 46px;
    width: 100%;
    border: 0;
    border-bottom: 1px solid #eef2f7;
    background: #ffffff;
    color: #334155;
    text-align: left;
    padding: 0 16px;
    font: 600 14px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .mn-sort-item:hover {
    background: #f8fafc;
  }

  .mn-filter-title {
    font-size: 20px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 24px;
  }

  .mn-filter-label {
    display: block;
    color: #6b7280;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
  }

  .mn-input {
    width: 100%;
    height: 48px;
    border: 1px solid #dbe2ec;
    border-radius: 9px;
    padding: 0 16px;
    color: #334155;
    font: 500 15px/1 'Plus Jakarta Sans', sans-serif;
    outline: none;
    background: #ffffff;
  }

  .mn-input::placeholder {
    color: #94a3b8;
  }

  .mn-filter-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 0;
  }

  .mn-filter-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
    margin-top: 28px;
  }

  .mn-reset-btn,
  .mn-apply-btn {
    height: 44px;
    border: 0;
    border-radius: 8px;
    padding: 0 18px;
    font: 800 14px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .mn-reset-btn {
    background: transparent;
    color: #64748b;
  }

  .mn-apply-btn {
    min-width: 150px;
    background: #5b7db8;
    color: #ffffff;
  }

  .mn-table-head,
  .mn-row {
    display: grid;
    grid-template-columns: minmax(300px, 1.8fr) 150px 120px 120px 86px;
    align-items: center;
    column-gap: 16px;
  }

  .mn-table-head {
    height: 46px;
    padding: 0 28px;
    background: #fbfbfc;
    border-bottom: 1px solid #edf1f6;
    color: #6b7280;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .mn-row {
    min-height: 88px;
    padding: 0 28px;
    border-bottom: 1px solid #edf1f6;
  }

  .mn-article-cell {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .mn-thumb {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .mn-title {
    color: #111827;
    font: 700 14px/1.25 Georgia, serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mn-meta {
    color: #6b7280;
    font-size: 11px;
    margin-top: 4px;
  }

  .mn-author {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #111827;
    font-weight: 600;
  }

  .mn-avatar {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    object-fit: cover;
    background: #e5e7eb;
  }

  .mn-status {
    width: fit-content;
    min-width: 86px;
    height: 20px;
    padding: 0 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
  }

  .mn-status.published {
    background: #dcfce7;
    color: #16a34a;
  }

  .mn-status.pending {
    background: #fff7ed;
    color: #ea580c;
  }

  .mn-date {
    color: #64748b;
    font-size: 14px;
    line-height: 1.25;
  }

  .mn-actions {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .mn-icon-btn {
    width: 24px;
    height: 24px;
    border: 0;
    background: transparent;
    color: #9aa6b7;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mn-icon-btn:hover {
    color: #142052;
  }

  .mn-pagination {
    height: 82px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
    font-size: 14px;
  }

  .mn-page-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mn-page-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #dbe2ec;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    font-weight: 700;
    cursor: pointer;
  }

  .mn-page-btn.active {
    background: #eaf3ff;
    color: #0056d6;
    border-color: #eaf3ff;
  }

  .mn-page-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .mn-toast {
    position: fixed;
    top: 116px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 80;
    height: 46px;
    padding: 0 28px;
    border-radius: 999px;
    color: #ffffff;
    font: 800 14px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
  }

  .mn-toast.success {
    background: #16a34a;
  }

  .mn-toast.error {
    background: #ef4444;
  }

  .mn-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mn-modal {
    width: 530px;
    overflow: hidden;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
    z-index: 10000;
  }

  .mn-modal-body {
    padding: 34px 30px 34px;
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 20px;
    align-items: start;
  }

  .mn-modal-icon {
    width: 52px;
    height: 52px;
    border-radius: 999px;
    background: #fee2e2;
    color: #ef4444;
    display: grid;
    place-items: center;
  }

  .mn-modal-title {
    margin: 0 0 22px;
    color: #111827;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 26px;
    font-weight: 800;
  }

  .mn-modal-text {
    color: #64748b;
    line-height: 1.65;
    font-size: 16px;
    margin: 0;
  }

  .mn-modal-footer {
    height: 92px;
    background: #f8fafc;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
  }

  .mn-modal-btn {
    height: 54px;
    min-width: 104px;
    border-radius: 8px;
    font: 800 18px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .mn-modal-btn.cancel {
    background: #ffffff;
    border: 1px solid #d1d9e6;
    color: #374151;
  }

  .mn-modal-btn.delete {
    background: #e7252d;
    border: 0;
    color: #ffffff;
  }

  .mn-breadcrumb {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 18px;
  }

  .mn-breadcrumb button {
    border: 0;
    background: transparent;
    padding: 0;
    color: #64748b;
    font: inherit;
    cursor: pointer;
  }

  .mn-breadcrumb strong {
    color: #111827;
  }

  .mn-cat-add-panel {
    background: #ffffff;
    border-radius: 12px;
    padding: 26px 24px 24px;
    margin-bottom: 22px;
    box-shadow: 0 16px 28px rgba(15, 23, 42, 0.06);
  }

  .mn-cat-add-title {
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 800;
  }

  .mn-cat-add-sub {
    margin: 0 0 18px;
    color: #64748b;
    font-size: 14px;
  }

  .mn-cat-add-row {
    display: grid;
    grid-template-columns: minmax(0, 448px) 1fr 228px;
    gap: 20px;
    align-items: end;
  }

  .mn-field-label {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #374151;
    margin-bottom: 8px;
  }

  .mn-big-btn {
    height: 50px;
    border: 0;
    border-radius: 7px;
    background: var(--mn-dark);
    color: #ffffff;
    font: 700 16px/1 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    box-shadow: 0 10px 18px rgba(15, 23, 42, 0.16);
  }

  .mn-category-panel {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 28px rgba(15, 23, 42, 0.06);
  }

  .mn-category-header {
    min-height: 80px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mn-category-title {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
  }

  .mn-total-pill {
    height: 22px;
    padding: 0 12px;
    border-radius: 999px;
    background: #dfe7f2;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
  }

  .mn-cat-head,
  .mn-cat-row {
    display: grid;
    grid-template-columns: minmax(260px, 1.4fr) 190px 230px 90px;
    align-items: center;
    column-gap: 16px;
    padding: 0 24px;
  }

  .mn-cat-head {
    height: 50px;
    background: #fbfbfc;
    color: #6b7280;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .mn-cat-row {
    min-height: 94px;
    border-bottom: 1px solid #edf1f6;
  }

  .mn-cat-name {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 800;
  }

  .mn-cat-icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #eef5ff;
    color: #0056d6;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .mn-cat-stat,
  .mn-cat-updated {
    color: #374151;
    font-size: 15px;
  }

  .mn-cat-footer {
    height: 62px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
    font-size: 14px;
  }

  .mn-form-title {
    margin: 0 0 8px;
    font-size: 30px;
    font-weight: 800;
  }

  .mn-form-sub {
    margin: 0 0 26px;
    color: #6b7280;
  }

  .mn-form-grid {
    display: grid;
    grid-template-columns: minmax(0, 602px) 308px;
    gap: 34px;
    align-items: start;
  }

  .mn-form-card {
    padding: 32px;
  }

  .mn-form-group {
    margin-bottom: 22px;
  }

  .mn-form-input,
  .mn-form-textarea,
  .mn-form-select {
    width: 100%;
    border: 1px solid #cfd8e5;
    border-radius: 8px;
    background: #ffffff;
    color: #374151;
    font: 500 15px/1 'Plus Jakarta Sans', sans-serif;
    outline: none;
  }

  .mn-form-input,
  .mn-form-select {
    height: 50px;
    padding: 0 16px;
  }

  .mn-form-textarea {
    min-height: 98px;
    padding: 16px;
    resize: none;
    line-height: 1.55;
  }

  .mn-disabled {
    background: #f8fafc;
    color: #94a3b8;
  }

  .mn-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }

  .mn-secondary-btn,
  .mn-primary-btn {
    height: 46px;
    border-radius: 7px;
    padding: 0 24px;
    font: 700 15px/1 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
  }

  .mn-secondary-btn {
    background: #ffffff;
    border: 1px solid #cfd8e5;
    color: #475569;
  }

  .mn-primary-btn {
    background: var(--mn-dark);
    border: 0;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .mn-note-card {
    padding: 26px;
    background: #dbeafe;
    border-color: #93c5fd;
    box-shadow: none;
    color: #172554;
  }

  .mn-note-top {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .mn-note-icon {
    width: 44px;
    height: 44px;
    border-radius: 11px;
    background: #ffffff;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .mn-note-title {
    font-size: 16px;
    font-weight: 800;
    margin-top: 6px;
  }

  .mn-note-list {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mn-note-list li {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 10px;
    font-size: 14px;
    line-height: 1.55;
  }

  @media (max-width: 1180px) {
    .mn-page {
      margin-left: 0;
      padding: 36px 24px;
    }

    .mn-shell {
      max-width: none;
    }

    .mn-top-grid,
    .mn-form-grid {
      grid-template-columns: 1fr;
    }

    .mn-cat-add-row {
      grid-template-columns: 1fr;
    }

    .mn-table-head,
    .mn-row {
      grid-template-columns: minmax(260px, 1.7fr) 140px 100px 100px 80px;
    }
  }
`;

const IconTipsLightbulb = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8.5 14.5c-1.5-1.1-2.5-2.9-2.5-4.9A6 6 0 0 1 18 9.6c0 2-1 3.8-2.5 4.9-.8.6-1.2 1.4-1.2 2.3H9.7c0-.9-.4-1.7-1.2-2.3Z" />
  </svg>
);

const IconManageCategories = ({ size = 21 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <path d="M15 15h5" />
    <path d="M17.5 12.5v5" />
  </svg>
);

const IconTechnology = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="11" rx="1.8" />
    <path d="M2.5 19h19" />
  </svg>
);

const IconPolitics = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18" />
    <path d="M5 10v9" />
    <path d="M9 10v9" />
    <path d="M15 10v9" />
    <path d="M19 10v9" />
    <path d="M3 19h18" />
    <path d="M12 4 4 8h16l-8-4Z" />
  </svg>
);

const IconEconomics = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6.5 9.5v5" />
    <path d="M17.5 9.5v5" />
  </svg>
);

const IconEducation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-5 9 5-9 5-9-5Z" />
    <path d="M7 12v4c2.8 2 7.2 2 10 0v-4" />
    <path d="M21 9v6" />
  </svg>
);

const IconSocial = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2" />
    <circle cx="16" cy="8" r="2" />
    <path d="M5 18c.6-2 2-3 3-3s2.4 1 3 3" />
    <path d="M13 18c.6-2 2-3 3-3s2.4 1 3 3" />
  </svg>
);

const IconEnvironment = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4c-7.5.4-12 4-12 10 0 3 2 5 5 5 5.7 0 7-6.5 7-15Z" />
    <path d="M4 20c2.7-5 6.2-8.1 11-10" />
  </svg>
);

const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h18" />
    <path d="M7 12h10" />
    <path d="M10 19h4" />
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconArticle = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ marginRight: 7, verticalAlign: -2 }}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const IconCategoryFallback = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#172554" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
);

const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.2 2.2 2.2 4.8-5" />
  </svg>
);

const getCategoryIcon = (categoryName) => {
  const key = String(categoryName || "").toLowerCase();

  if (key.includes("tech") || key.includes("teknologi")) return <IconTechnology />;
  if (key.includes("politic") || key.includes("politik")) return <IconPolitics />;
  if (key.includes("economic") || key.includes("ekonomi")) return <IconEconomics />;
  if (key.includes("education") || key.includes("edukasi") || key.includes("pendidikan")) return <IconEducation />;
  if (key.includes("social") || key.includes("sosial")) return <IconSocial />;
  if (key.includes("environment") || key.includes("lingkungan")) return <IconEnvironment />;

  return <IconCategoryFallback />;
};

const titleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStatus = (article) => {
  const status = String(article?.status || "published").toLowerCase();
  return status === "pending" ? "Pending" : "Published";
};

const buildArticleRows = (sourceArticles = []) =>
  sourceArticles.map((article, index) => ({
    id: article.id || `admin_news_${index}`,
    apiId: article.apiId || article.id,
    title: article.title || "Untitled Article",
    category: titleCase(article.category || "General"),
    readTime: article.readTime || "2 Menit Baca",
    author: article.author || "Redaksi Paham.ID",
    authorAvatar: article.authorAvatar || "",
    status: getStatus(article),
    date: article.date?.split(",")[0] || "24 Okt 2025",
    image:
      article.thumbnail ||
      article.image ||
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=160&q=70",
    synopsis: article.synopsis || article.excerpt || "",
    body: article.body || "",
  }));

const buildCategoryRows = (categories = [], articles = []) =>
  categories.map((category, index) => {
    const name = titleCase(category.name || category.nama_kategori);
    const count = articles.filter((article) => titleCase(article.category) === name).length;

    return {
      id: category.id || category.id_kategori || `cat_${name}`,
      apiId: category.apiId || category.id_kategori || category.id,
      name,
      slug: category.slug || name.toLowerCase().replace(/\s+/g, "-"),
      description: category.description || category.deskripsi || "",
      order: category.order || category.urutan_tampil || index + 1,
      count: category.count ?? category.jumlah_artikel ?? count,
      updatedAt: category.updatedAt || category.tgl_diperbarui || "",
    };
  });

export default function ManageNewsPage() {
  const navigate = useNavigate();

  const initialArticles = useMemo(() => buildArticleRows([]), []);
  const [articles, setArticles] = useState(initialArticles);
  const [categories, setCategories] = useState(() => buildCategoryRows([], initialArticles));

  const [view, setView] = useState("news");
  const [tab, setTab] = useState("All");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const [categoryPage, setCategoryPage] = useState(1);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetchArticles({ all: "true" }).catch(() => []),
      fetchCategories().catch(() => []),
    ]).then(([articleRows, categoryRows]) => {
      if (!alive) return;

      const nextArticles = buildArticleRows(articleRows);
      setArticles(nextArticles);
      setCategories(buildCategoryRows(categoryRows, nextArticles));
    });

    return () => {
      alive = false;
    };
  }, []);

  const filteredArticles = articles.filter((article) => {
    if (tab !== "All" && article.status !== tab) return false;

    if (
      filterAuthor &&
      !article.author.toLowerCase().includes(filterAuthor.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "Terlama") return String(a.id).localeCompare(String(b.id));
    if (sortBy === "Judul (A-Z)") return a.title.localeCompare(b.title);
    if (sortBy === "Judul (Z-A)") return b.title.localeCompare(a.title);

    return String(b.id).localeCompare(String(a.id));
  });

  const totalFilteredArticles = sortedArticles.length;
  const totalNewsPages = Math.max(
    1,
    Math.ceil(totalFilteredArticles / NEWS_PAGE_SIZE),
  );

  const safeNewsPage = Math.min(page, totalNewsPages);
  const articleStartIndex = (safeNewsPage - 1) * NEWS_PAGE_SIZE;
  const articleEndIndex = articleStartIndex + NEWS_PAGE_SIZE;

  const visibleArticles = sortedArticles.slice(articleStartIndex, articleEndIndex);

  const articleStartText =
    totalFilteredArticles === 0 ? 0 : articleStartIndex + 1;

  const articleEndText = Math.min(articleEndIndex, totalFilteredArticles);

  const publishedCount = articles.filter((article) => article.status === "Published").length;
  const pendingCount = articles.filter((article) => article.status === "Pending").length;
  const totalPublication = articles.length;

  const categoryTotalPages = Math.max(1, Math.ceil(categories.length / CATEGORY_PAGE_SIZE));
  const safeCategoryPage = Math.min(categoryPage, categoryTotalPages);
  const categoryStartIndex = (safeCategoryPage - 1) * CATEGORY_PAGE_SIZE;
  const visibleCategories = categories.slice(
    categoryStartIndex,
    categoryStartIndex + CATEGORY_PAGE_SIZE,
  );
  const categoryStartText = categories.length === 0 ? 0 : categoryStartIndex + 1;
  const categoryEndText = Math.min(categoryStartIndex + CATEGORY_PAGE_SIZE, categories.length);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleDeleteArticle = () => {
    if (!deleteTarget) return;

    deleteArticle(deleteTarget.apiId || deleteTarget.id).catch(() => {});

    setArticles((prev) =>
      prev.filter((article) => article.id !== deleteTarget.id),
    );

    setDeleteTarget(null);
    showToast("Artikel Berhasil Dihapus", "error");
  };

  const handleEditNews = (article) => {
    navigate(`/admin/edit-news/${article.id}`, {
      state: {
        article: {
          ...article,
          thumbnail: article.image,
          image: article.image,
          excerpt: article.synopsis,
          date: `${article.date}, 14:20 WIB`,
        },
        authorMeta: {
          name: article.author,
          category: article.category,
          date: `${article.date}, 14:20 WIB`,
        },
      },
    });
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();

    if (!name) return;

    const savedCategory = await createCategory({
      nama_kategori: name,
      deskripsi: newCategoryDescription.trim(),
      urutan_tampil: categories.length + 1,
    });
    const nextCategory = buildCategoryRows([savedCategory], articles)[0];

    setCategories((prev) => [...prev, nextCategory]);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setCategoryPage(Math.ceil((categories.length + 1) / CATEGORY_PAGE_SIZE));
    setView("categories");
    showToast("Kategori Berhasil Ditambahkan", "success");
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name?.trim()) return;

    const savedCategory = await updateCategory(editingCategory.apiId || editingCategory.id, {
      nama_kategori: editingCategory.name,
      deskripsi: editingCategory.description,
      urutan_tampil: editingCategory.order,
    });
    const nextCategory = buildCategoryRows([savedCategory], articles)[0];

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategory.id
          ? nextCategory
          : category,
      ),
    );

    setEditingCategory(null);
    setView("categories");
    showToast("Kategori Berhasil Diperbarui", "success");
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (category) {
      deleteCategory(category.apiId || category.id).catch(() => {});
    }

    const next = categories.filter((category) => category.id !== categoryId);

    setCategories(next);
    setCategoryPage((current) =>
      Math.min(current, Math.max(1, Math.ceil(next.length / CATEGORY_PAGE_SIZE))),
    );
    showToast("Kategori Berhasil Dihapus", "error");
  };

  const goCategories = () => {
    setView("categories");
    setCategoryPage(1);
  };

  const getNewsPaginationItems = () => {
    if (totalNewsPages <= 5) {
      return Array.from({ length: totalNewsPages }, (_, index) => index + 1);
    }

    if (safeNewsPage <= 3) {
      return [1, 2, 3, "dots", totalNewsPages];
    }

    if (safeNewsPage >= totalNewsPages - 2) {
      return [1, "dots", totalNewsPages - 2, totalNewsPages - 1, totalNewsPages];
    }

    return [
      1,
      "dots-start",
      safeNewsPage - 1,
      safeNewsPage,
      safeNewsPage + 1,
      "dots-end",
      totalNewsPages,
    ];
  };

  const renderPagination = () => (
    <div className="mn-pagination">
      <span>
        Menampilkan {articleStartText}-{articleEndText} dari{" "}
        {totalFilteredArticles.toLocaleString()} artikel
      </span>

      <div className="mn-page-controls">
        <button
          className="mn-page-btn"
          type="button"
          disabled={safeNewsPage === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          ‹
        </button>

        {getNewsPaginationItems().map((item, index) => {
          if (String(item).startsWith("dots")) {
            return (
              <span key={`${item}-${index}`} style={{ padding: "0 5px" }}>
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              className={`mn-page-btn${safeNewsPage === item ? " active" : ""}`}
              type="button"
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          );
        })}

        <button
          className="mn-page-btn"
          type="button"
          disabled={safeNewsPage === totalNewsPages}
          onClick={() =>
            setPage((current) => Math.min(totalNewsPages, current + 1))
          }
        >
          ›
        </button>
      </div>
    </div>
  );

  const NewsView = () => (
    <div className="mn-shell">
      <div className="mn-top-grid">
        <section className="mn-stat-card">
          <div>
            <div className="mn-stat-title">Total Publikasi</div>
            <div className="mn-stat-link">{totalPublication.toLocaleString()} Artikel</div>
          </div>

          <div className="mn-stat-metrics">
            <div className="mn-stat-metric">
              <div className="mn-stat-label">Published</div>
              <div className="mn-stat-value">{publishedCount.toLocaleString()}</div>
            </div>

            <div className="mn-stat-metric">
              <div className="mn-stat-label">Menunggu</div>
              <div className="mn-stat-value orange">{pendingCount.toLocaleString()}</div>
            </div>
          </div>
        </section>

        <section className="mn-cat-card">
          <div className="mn-cat-title">Organize News Categories</div>
          <div className="mn-cat-sub">Create and manage news categories easily</div>

          <button className="mn-cat-btn" type="button" onClick={goCategories}>
            <IconManageCategories />
            Manage Categories
          </button>
        </section>
      </div>

      <section className="mn-panel">
        <div className="mn-table-top">
          <div className="mn-tabs">
            {["All", "Pending", "Published"].map((item) => (
              <button
                key={item}
                className={`mn-tab${tab === item ? " active" : ""}`}
                type="button"
                onClick={() => {
                  setTab(item);
                  setPage(1);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mn-tools">
            <div className="mn-tool-wrap">
              <button
                className="mn-tool-btn"
                type="button"
                onClick={() => {
                  setShowFilter((value) => !value);
                  setShowSort(false);
                }}
              >
                <IconFilter /> Filter Lanjut
              </button>

              {showFilter && (
                <div className="mn-dropdown">
                  <div className="mn-filter-title">Filter Lanjut</div>

                  <label className="mn-filter-label">Penulis</label>
                  <input
                    className="mn-input"
                    value={filterAuthor}
                    placeholder="Nama penulis..."
                    onChange={(event) => setFilterAuthor(event.target.value)}
                  />

                  <label className="mn-filter-label" style={{ marginTop: 20 }}>
                    Rentang Tanggal
                  </label>

                  <div className="mn-filter-row">
                    <input
                      className="mn-input"
                      type="date"
                      value={filterStart}
                      onChange={(event) => setFilterStart(event.target.value)}
                    />

                    <input
                      className="mn-input"
                      type="date"
                      value={filterEnd}
                      onChange={(event) => setFilterEnd(event.target.value)}
                    />
                  </div>

                  <div className="mn-filter-actions">
                    <button
                      className="mn-reset-btn"
                      type="button"
                      onClick={() => {
                        setFilterAuthor("");
                        setFilterStart("");
                        setFilterEnd("");
                        setPage(1);
                        setShowFilter(false);
                      }}
                    >
                      Reset
                    </button>

                    <button
                      className="mn-apply-btn"
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setShowFilter(false);
                      }}
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mn-tool-wrap">
              <button
                className="mn-tool-btn"
                type="button"
                onClick={() => {
                  setShowSort((value) => !value);
                  setShowFilter(false);
                }}
              >
                <IconCalendar /> Urutkan
              </button>

              {showSort && (
                <div className="mn-dropdown sort">
                  {["Terbaru", "Terlama", "Judul (A-Z)", "Judul (Z-A)"].map((item) => (
                    <button
                      key={item}
                      className="mn-sort-item"
                      type="button"
                      onClick={() => {
                        setSortBy(item);
                        setShowSort(false);
                        setPage(1);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mn-table-head">
          <span>Judul Artikel</span>
          <span>Penulis</span>
          <span>Status</span>
          <span>Tanggal</span>
          <span>Aksi</span>
        </div>

        {visibleArticles.map((article) => (
          <div className="mn-row" key={article.id}>
            <div className="mn-article-cell">
              <img className="mn-thumb" src={article.image} alt="" />

              <div style={{ minWidth: 0 }}>
                <div className="mn-title">{article.title}</div>
                <div className="mn-meta">
                  {article.category} • {article.readTime}
                </div>
              </div>
            </div>

            <div className="mn-author">
              <img className="mn-avatar" src={article.authorAvatar} alt="" />
              <span>{article.author}</span>
            </div>

            <span className={`mn-status ${article.status.toLowerCase()}`}>
              {article.status}
            </span>

            <span className="mn-date">{article.date}</span>

            <div className="mn-actions">
              <button
                className="mn-icon-btn"
                type="button"
                onClick={() => handleEditNews(article)}
              >
                <IconEdit />
              </button>

              <button
                className="mn-icon-btn"
                type="button"
                onClick={() => setDeleteTarget(article)}
              >
                <IconTrash />
              </button>
            </div>
          </div>
        ))}

        {renderPagination()}
      </section>
    </div>
  );

  const CategoriesView = () => (
    <div className="mn-shell">
      <div className="mn-breadcrumb">
        <button type="button" onClick={() => setView("news")}>
          Manage News
        </button>
        <span>›</span>
        <strong>Manage Categories</strong>
      </div>

      <section className="mn-cat-add-panel">
        <h1 className="mn-cat-add-title">Tambah Kategori Baru</h1>
        <p className="mn-cat-add-sub">Buat kategori baru untuk mengorganisir artikel</p>

        <div className="mn-cat-add-row">
          <label>
            <span className="mn-field-label">Nama Kategori</span>
            <input
              className="mn-input"
              value={newCategoryName}
              placeholder="Masukkan nama kategori (e.g. Gaya Hidup)"
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
          </label>

          <span />

          <button
            className="mn-big-btn"
            type="button"
            onClick={() => setView("addCategory")}
          >
            <IconManageCategories />
            Add New Category
          </button>
        </div>
      </section>

      <section className="mn-category-panel">
        <div className="mn-category-header">
          <h2 className="mn-category-title">Daftar Kategori</h2>
          <span className="mn-total-pill">Total {categories.length} Kategori</span>
        </div>

        <div className="mn-cat-head">
          <span>Kategori</span>
          <span>Statistik</span>
          <span>Terakhir Diperbarui</span>
          <span>Aksi</span>
        </div>

        {visibleCategories.map((category) => (
          <div className="mn-cat-row" key={category.id}>
            <div className="mn-cat-name">
              <span className="mn-cat-icon-box">{getCategoryIcon(category.name)}</span>
              {category.name}
            </div>

            <div className="mn-cat-stat">
              <IconArticle /> {category.count} Artikel
            </div>

            <div className="mn-cat-updated">{category.updatedAt}</div>

            <div className="mn-actions">
              <button
                className="mn-icon-btn"
                type="button"
                onClick={() => {
                  setEditingCategory(category);
                  setView("editCategory");
                }}
              >
                <IconEdit />
              </button>

              <button
                className="mn-icon-btn"
                type="button"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <IconTrash />
              </button>
            </div>
          </div>
        ))}

        <div className="mn-cat-footer">
          <span>
            Menampilkan {categoryStartText}-{categoryEndText} dari{" "}
            {categories.length} kategori
          </span>

          <div className="mn-page-controls">
            <button
              className="mn-page-btn"
              type="button"
              disabled={safeCategoryPage === 1}
              onClick={() => setCategoryPage((current) => Math.max(1, current - 1))}
            >
              ‹
            </button>

            <button
              className="mn-page-btn"
              type="button"
              disabled={safeCategoryPage === categoryTotalPages}
              onClick={() =>
                setCategoryPage((current) => Math.min(categoryTotalPages, current + 1))
              }
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const AddCategoryView = () => (
    <div className="mn-shell">
      <div className="mn-breadcrumb">
        <button type="button" onClick={() => setView("news")}>
          Manage News
        </button>
        <span>›</span>
        <button type="button" onClick={goCategories}>
          Manage Categories
        </button>
        <span>›</span>
        <strong>Add New Category</strong>
      </div>

      <h1 className="mn-form-title">Tambah Kategori Baru</h1>
      <p className="mn-form-sub">
        Buat kategori baru untuk mengorganisir artikel dan memudahkan pembaca menemukan konten yang relevan.
      </p>

      <div className="mn-form-grid">
        <section className="mn-form-card">
          <div className="mn-form-group">
            <label className="mn-field-label">Nama Kategori</label>
            <input
              className="mn-form-input"
              value={newCategoryName}
              placeholder="Masukkan nama kategori, contoh: Teknologi"
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
          </div>

          <div className="mn-form-group">
            <label className="mn-field-label">Slug Kategori</label>
            <input
              className="mn-form-input mn-disabled"
              value={
                newCategoryName
                  ? newCategoryName.toLowerCase().replace(/\s+/g, "-")
                  : "newsportal.com/category/"
              }
              readOnly
            />
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>
              ⓘ Slug dihasilkan secara otomatis dari nama kategori, tetapi dapat diubah secara manual.
            </div>
          </div>

          <div className="mn-form-group">
            <label className="mn-field-label">
              Deskripsi Singkat <span style={{ color: "#94a3b8" }}>(Opsional)</span>
            </label>
            <textarea
              className="mn-form-textarea"
              value={newCategoryDescription}
              placeholder="Berikan deskripsi singkat tentang kategori ini..."
              onChange={(event) => setNewCategoryDescription(event.target.value)}
            />
          </div>

          <div className="mn-form-actions" style={{ justifyContent: "flex-start" }}>
            <button className="mn-primary-btn" type="button" onClick={handleAddCategory}>
              <IconSave />
              Simpan Kategori
            </button>

            <button className="mn-secondary-btn" type="button" onClick={goCategories}>
              Batal
            </button>
          </div>
        </section>

        <aside className="mn-note-card">
          <div className="mn-note-top">
            <span className="mn-note-icon">
              <IconTipsLightbulb />
            </span>
            <div className="mn-note-title">Tips Kategori</div>
          </div>

          <ul className="mn-note-list">
            <li>
              <IconCheckCircle />
              <span>Gunakan nama yang singkat dan deskriptif.</span>
            </li>
            <li>
              <IconCheckCircle />
              <span>Pastikan kategori belum pernah dibuat sebelumnya.</span>
            </li>
            <li>
              <IconCheckCircle />
              <span>Deskripsi membantu mesin pencari memahami topik konten Anda.</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );

  const EditCategoryView = () => (
    <div className="mn-shell">
      <div className="mn-breadcrumb">
        <button type="button" onClick={() => setView("news")}>
          Manage News
        </button>
        <span>›</span>
        <button type="button" onClick={goCategories}>
          Manage Categories
        </button>
        <span>›</span>
        <strong>Edit Category</strong>
      </div>

      <h1 className="mn-form-title">Edit Kategori</h1>
      <p className="mn-form-sub">
        Perbarui informasi kategori berita untuk pengorganisasian konten yang lebih baik.
      </p>

      <div className="mn-form-grid">
        <section className="mn-form-card">
          <div className="mn-form-group">
            <label className="mn-field-label">Nama Kategori</label>
            <input
              className="mn-form-input"
              value={editingCategory?.name || ""}
              onChange={(event) =>
                setEditingCategory((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="mn-form-group">
              <label className="mn-field-label">Slug Kategori (Otomatis)</label>
              <input
                className="mn-form-input mn-disabled"
                value={
                  editingCategory?.name
                    ? editingCategory.name.toLowerCase().replace(/\s+/g, "-")
                    : ""
                }
                readOnly
              />
            </div>

            <div className="mn-form-group">
              <label className="mn-field-label">Urutan Tampil</label>
              <select
                className="mn-form-select"
                value={editingCategory?.order || 1}
                onChange={(event) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    order: Number(event.target.value),
                  }))
                }
              >
                {categories.map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mn-form-group">
            <label className="mn-field-label">Deskripsi Singkat</label>
            <textarea
              className="mn-form-textarea"
              value={editingCategory?.description || ""}
              onChange={(event) =>
                setEditingCategory((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="mn-form-actions">
            <button className="mn-secondary-btn" type="button" onClick={goCategories}>
              Batal
            </button>

            <button className="mn-primary-btn" type="button" onClick={handleSaveCategory}>
              <IconSave />
              Simpan Perubahan
            </button>
          </div>
        </section>

        <aside className="mn-note-card">
          <div className="mn-note-top">
            <span className="mn-note-icon">
              <IconInfo />
            </span>
            <div className="mn-note-title">Catatan Editorial</div>
          </div>

          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
            Perubahan nama kategori akan secara otomatis memperbarui label pada semua
            artikel yang menggunakan kategori ini. Pastikan perubahan sudah sesuai
            dengan pedoman editorial Insight News.
          </p>
        </aside>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>

      <main className="mn-page">
        {toast && (
          <div className={`mn-toast ${toast.type}`}>
            ✓ {toast.message}
          </div>
        )}

        {view === "news" && <NewsView />}
        {view === "categories" && <CategoriesView />}
        {view === "addCategory" && <AddCategoryView />}
        {view === "editCategory" && <EditCategoryView />}
      </main>

      {deleteTarget && (
        <div className="mn-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="mn-modal" onClick={(event) => event.stopPropagation()}>
            <div className="mn-modal-body">
              <div className="mn-modal-icon">
                <IconTrash />
              </div>

              <div>
                <h2 className="mn-modal-title">Hapus Artikel?</h2>
                <p className="mn-modal-text">
                  Apakah Anda yakin ingin menghapus artikel ini?
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mn-modal-footer">
              <button
                className="mn-modal-btn cancel"
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>

              <button
                className="mn-modal-btn delete"
                type="button"
                onClick={handleDeleteArticle}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
