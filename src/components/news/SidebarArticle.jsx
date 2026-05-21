export default function PopularSidebar() {
  const popularData = [
    { category: "POLITICS", title: "Presiden Prabowo Sibuk Rayakan Ulang Tahun Hana Teddy", time: "3 MIN READ" },
    { category: "TECHNOLOGY", title: "Neural Architecture: The Next Phase of AI", time: "2 MIN READ" },
    { category: "CULTURE", title: "Rahasia Tradisi Malam Jum'at Kliwon di Kota Batang", time: "3 MIN READ" }
  ];

  return (
    <div className="sidebar-section">
      <h4 className="sidebar-title">POPULAR TODAY</h4>
      <div className="popular-list">
        {popularData.map((item, index) => (
          <div key={index} className="popular-item">
            <span className="mini-category">{item.category}</span>
            <h5>{item.title}</h5>
            <small>{item.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}