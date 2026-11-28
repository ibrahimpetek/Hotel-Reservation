import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchStaffReservations, cancelReservation } from "../../api/adminApi";
import { formatCurrency, formatDate } from "../../utils/format";

const STATUS_OPTIONS = [
  { value: "PENDING_PAYMENT", label: "Odeme Bekliyor" },
  { value: "CONFIRMED", label: "Onaylandi" },
  { value: "CANCELLED", label: "Iptal Edildi" },
  { value: "COMPLETED", label: "Tamamlandi" },
  { value: "NO_SHOW", label: "Gelmedi" },
];

const STATUS_BADGE = {
  PENDING_PAYMENT: "bg-warning-subtle text-warning-emphasis",
  CONFIRMED: "bg-success-subtle text-success-emphasis",
  CANCELLED: "bg-danger-subtle text-danger-emphasis",
  COMPLETED: "bg-secondary-subtle text-secondary-emphasis",
  NO_SHOW: "bg-dark-subtle text-dark-emphasis",
};

export default function AdminDashboardPage() {
  const [status, setStatus] = useState("CONFIRMED");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const load = () => {
    setLoading(true);
    fetchStaffReservations(status)
      .then(setReservations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setError("");
    load();
  }, [status]);

  const handleCancel = async (id) => {
    if (!window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    setActionError("");
    try {
      await cancelReservation(id);
      load();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Rezervasyonlar</h3>
        <select
          className="form-select"
          style={{ width: 220 }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {actionError && <div className="alert alert-danger">{actionError}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-soft p-0 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Kod</th>
              <th>Misafir</th>
              <th>Oda Tipi</th>
              <th>Giriş - Çıkış</th>
              <th>Pansiyon</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  Yükleniyor...
                </td>
              </tr>
            )}
            {!loading && reservations.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  Bu durumda rezervasyon bulunamadı.
                </td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="fw-semibold">{r.reservationCode}</td>
                <td>
                  {r.leadGuestFullName}
                  <div className="text-muted small">{r.leadGuestEmail}</div>
                </td>
                <td>{r.roomTypeName}</td>
                <td className="small">
                  {formatDate(r.checkIn)} <br /> {formatDate(r.checkOut)}
                </td>
                <td className="small">{r.boardTypeDisplayName}</td>
                <td className="fw-semibold">{formatCurrency(r.totalPrice)}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[r.status] || "bg-secondary"}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === "CONFIRMED" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancel(r.id)}
                    >
                      İptal Et
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
