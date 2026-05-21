const headerCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --dashboard-sidebar-width: 260px;
    --dashboard-header-height: 76px;
  }

  .pa-header {
    position: fixed;
    top: 0;
    left: var(--dashboard-sidebar-width);
    right: 0;
    height: var(--dashboard-header-height);
    background: #ffffff;
    border-bottom: 1px solid #eef2f7;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 34px;
    z-index: 90;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .pa-header-logo {
    display: inline-flex;
    align-items: center;
    min-width: 132px;
    text-decoration: none;
  }

  .pa-header-logo img {
    width: auto;
    height: 46px;
    display: block;
    object-fit: contain;
  }

  .pa-header-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    background: #f1f5ff;
    color: #1f3164;
    border: 1.5px solid #c7d3f0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s, box-shadow 0.18s;
    white-space: nowrap;
  }

  .pa-header-back-btn:hover {
    background: #e0e8ff;
    box-shadow: 0 2px 8px rgba(31,49,100,0.10);
  }

  .pa-header-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 34px;
    border-left: 1px solid #eef2f7;
  }

  .pa-header-user {
    min-width: 88px;
    text-align: right;
  }

  .pa-header-name {
    margin: 0;
    color: #111827;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.18;
  }

  .pa-header-username {
    margin: 3px 0 0;
    color: #4b5563;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
  }

  .pa-header-avatar {
    width: 42px;
    height: 42px;
    border: 2px solid #1f3164;
    border-radius: 50%;
    background: #f8fafc;
    color: #1f3164;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 800;
  }

  .pa-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Header({
  user = { name: "Faiz Sani", username: "@faizzini12", avatar: "" },
}) {
  const initials = getInitials(user.name) || "U";

  return (
    <>
      <style>{headerCss}</style>
      <header className="pa-header">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/dashboard" className="pa-header-logo">
            <img src="/img/Group2.png" alt="Paham.ID" />
          </a>
          <a href="/" className="pa-header-back-btn">
            &#8592; Back to Home
          </a>
        </div>

        <div className="pa-header-profile">
          <div className="pa-header-user">
            <p className="pa-header-name">{user.name}</p>
            <p className="pa-header-username">{user.username}</p>
          </div>

          <div className="pa-header-avatar">
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
          </div>
        </div>
      </header>
    </>
  );
}
