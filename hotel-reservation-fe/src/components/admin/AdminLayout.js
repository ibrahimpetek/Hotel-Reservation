import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin/reservations", label: "Rezervasyonlar", icon: "bi-calendar-check", adminOnly: false },
  { to: "/admin/room-types", label: "Oda Tipleri", icon: "bi-door-open", adminOnly: true },
  { to: "/admin/price-rules", label: "Fiyatlandırma", icon: "bi-currency-exchange", adminOnly: true },
  { to: "/admin/availability", label: "Müsaitlik / Stok", icon: "bi-grid-3x3-gap", adminOnly: true },
  { to: "/admin/staff", label: "Personel", icon: "bi-people", adminOnly: true },
];

export default function AdminLayout({ children }) {
  const { staff, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside className="bg-white border-end" style={{ width: 240, flexShrink: 0 }}>
        <div className="p-4 border-bottom">
          <span className="navbar-brand-text fs-5">GRAND RESERVE</span>
          <div className="text-muted small mt-1">Yönetim Paneli</div>
        </div>
        <nav className="p-3">
          {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none ${
                  isActive ? "bg-dark text-white" : "text-dark"
                }`
              }
              style={({ isActive }) => (isActive ? { backgroundColor: "var(--brand-navy)" } : {})}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-grow-1 bg-cream">
        <header className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-3">
          <div />
          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <div className="fw-semibold small">{staff?.fullName}</div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                {staff?.role === "ADMIN" ? "Yönetici" : "Resepsiyonist"}
              </div>
            </div>
            <button className="btn btn-outline-brand btn-sm" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
