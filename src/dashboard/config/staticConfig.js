export const TABS = ["All", "Draft", "Pending", "Published", "Rejected"];

export const writingTips = [
  "Gunakan judul yang jelas dan faktual.",
  "Pastikan ringkasan memuat inti berita.",
  "Tambahkan sumber atau konteks penting sebelum publikasi.",
];

export const dashboardNavigation = {
  user: {
    title: "DASHBOARD",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        match: ["/dashboard"],
        iconKey: "grid",
      },
      {
        key: "my-articles",
        label: "My Articles",
        path: "/my-articles",
        match: ["/my-articles", "/edit-article"],
        iconKey: "file",
      },
      {
        key: "write",
        label: "Write News",
        path: "/write-news",
        match: ["/write", "/write-news"],
        iconKey: "edit",
      },
    ],
  },
  admin: {
    title: "ADMIN",
    items: [
      {
        key: "admin-dashboard",
        label: "Dashboard",
        path: "/admin-dashboard",
        match: ["/admin-dashboard"],
        iconKey: "grid",
      },
      {
        key: "manage-news",
        label: "Manage News",
        path: "/admin/manage-news",
        match: ["/admin/manage-news", "/manage-news", "/admin/edit-news", "/edit-news"],
        iconKey: "folder",
      },
      {
        key: "pending",
        label: "Pending Approval",
        path: "/admin/pending",
        match: ["/admin/pending", "/pending"],
        iconKey: "check",
      },
      {
        key: "write",
        label: "Write News",
        path: "/admin/write-news",
        match: ["/admin/write", "/admin/write-news"],
        iconKey: "edit",
      },
    ],
  },
};
