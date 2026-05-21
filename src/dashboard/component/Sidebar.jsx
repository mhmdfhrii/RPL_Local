import { useLocation, useNavigate } from "react-router-dom";
import { dashboardNavigation } from "../config/staticConfig";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
  }

  .dh-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--dashboard-sidebar-width);
    height: 100vh;
    background: #ffffff;
    border-right: 1px solid #edf1f6;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    z-index: 100;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .dh-sidebar-title {
    margin: 112px 24px 48px 28px;
    color: #14245b;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.1;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dh-nav {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    padding: 0 0 0 24px;
    box-sizing: border-box;
  }

  .dh-nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #566171;
    cursor: pointer;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
    text-align: left;
  }

  .dh-nav-item:hover {
    background: #f4f8fd;
    color: #14245b;
  }

  .dh-nav-item.active {
    background: #edf5ff;
    color: #14245b;
    font-weight: 800;
  }

  .dh-nav-item.active::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
    background: #1f316f;
  }

  .dh-nav-item svg {
    width: 19px;
    height: 19px;
    flex: 0 0 19px;
    color: currentColor;
  }

  .dh-logout-wrapper {
    padding: 0 26px 28px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dh-logout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    min-height: 56px;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(135deg, #23326d 0%, #3154c9 100%);
    color: #ffffff;
    cursor: pointer;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
  }

  .dh-logout svg {
    width: 18px;
    height: 18px;
  }

  .dh-back-home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    border: 1px solid #edf1f6;
    border-radius: 999px;
    background: #ffffff;
    color: #566171;
    cursor: pointer;
    font: 700 14px/1 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s ease;
  }

  .dh-back-home:hover {
    background: #f4f8fd;
    color: #14245b;
    border-color: #14245b;
  }

  .dh-back-home svg {
    width: 18px;
    height: 18px;
  }
`;

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8.2L10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
    <path d="M12 12h5" />
    <path d="M14.5 9.5v5" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const iconMap = {
  grid: <IconGrid />,
  file: <IconFile />,
  edit: <IconEdit />,
  folder: <IconFolder />,
  check: <IconCheck />,
};

export default function Sidebar({ role = "user", onLogout = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedRole = String(role).toLowerCase();
  const navigation =
    dashboardNavigation[normalizedRole] || dashboardNavigation.user;
  const navItems = navigation.items;

  const isActive = (item) =>
    (item.match || [item.path]).some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`),
    );

  return (
    <>
      <style>{css}</style>
      <aside className="dh-sidebar">
        <div className="dh-sidebar-title">{navigation.title}</div>

        <nav className="dh-nav">
          {navItems.map((item) => {
            const active = isActive(item);

            return (
              <button
                key={item.key}
                className={`dh-nav-item${active ? " active" : ""}`}
                type="button"
                onClick={() =>
                  navigate(item.path, { state: { role: normalizedRole } })
                }
              >
                {iconMap[item.iconKey]}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="dh-logout-wrapper">
          <button className="dh-back-home" type="button" onClick={() => navigate("/")}>
            <IconHome />
            Back to Homepage
          </button>
          <button className="dh-logout" type="button" onClick={onLogout}>
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
