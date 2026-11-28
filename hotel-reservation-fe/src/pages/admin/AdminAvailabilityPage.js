import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchRoomTypes } from "../../api/hotelApi";
import { bulkSetAvailability, fetchAvailabilityRange } from "../../api/adminApi";
import { addDaysIso, formatDate, todayIsoDate } from "../../utils/format";

export default function AdminAvailabilityPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");

  const [bulkForm, setBulkForm] = useState({
    startDate: todayIsoDate(),
    endDate: addDaysIso(todayIsoDate(), 30),
    totalRooms: 5,
  });
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [viewRange, setViewRange] = useState({
    startDate: todayIsoDate(),
    endDate: addDaysIso(todayIsoDate(), 14),
  });
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    fetchRoomTypes().then((data) => {
      setRoomTypes(data);
      if (data.length > 0) setSelectedRoomTypeId(String(data[0].id));
    });
  }, []);

  const loadView = () => {
    if (!selectedRoomTypeId) return;
    setLoading(true);
    setViewError("");
    fetchAvailabilityRange(selectedRoomTypeId, viewRange.startDate, viewRange.endDate)
      .then(setDays)
      .catch((err) => setViewError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadView();
  }, [selectedRoomTypeId]);

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkError("");
    setBulkSuccess("");
    setSaving(true);

    try {
      await bulkSetAvailability({
        roomTypeId: Number(selectedRoomTypeId),
        startDate: bulkForm.startDate,
        endDate: bulkForm.endDate,
        totalRooms: Number(bulkForm.totalRooms),
      });
      setBulkSuccess("Stok başarıyla güncellendi.");
      loadView();
    } catch (err) {
      setBulkError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h3 className="fw-bold mb-4">Müsaitlik / Stok Yönetimi</h3>

      <div className="mb-4" style={{ maxWidth: 320 }}>
        <label className="form-label small fw-semibold">Oda Tipi</label>
        <select
          className="form-select"
          value={selectedRoomTypeId}
          onChange={(e) => setSelectedRoomTypeId(e.target.value)}
        >
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>{rt.name}</option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card card-soft p-4">
            <h5 className="fw-bold mb-3">Toplu Stok Tanımla</h5>
            <p className="text-muted small">
              Seçilen tarih aralığındaki HER güne, girilen toplam oda sayısını yazar.
              Mevcut rezervasyonlar (dolu oda sayısı) korunur.
            </p>
            <form onSubmit={handleBulkSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Başlangıç</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bulkForm.startDate}
                    onChange={(e) => setBulkForm({ ...bulkForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Bitiş</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bulkForm.endDate}
                    onChange={(e) => setBulkForm({ ...bulkForm, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Toplam Oda Sayısı</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={bulkForm.totalRooms}
                    onChange={(e) => setBulkForm({ ...bulkForm, totalRooms: e.target.value })}
                    required
                  />
                </div>
              </div>

              {bulkError && <p className="text-danger small mt-3">{bulkError}</p>}
              {bulkSuccess && <p className="text-success small mt-3">{bulkSuccess}</p>}

              <button type="submit" className="btn btn-brand w-100 mt-4" disabled={saving}>
                {saving ? "Kaydediliyor..." : "Stogu Güncelle"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card card-soft p-4">
            <h5 className="fw-bold mb-3">Günlük Doluluk</h5>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Baslangıç</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={viewRange.startDate}
                  onChange={(e) => setViewRange({ ...viewRange, startDate: e.target.value })}
                />
              </div>
              <div className="col-4">
                <label className="form-label small fw-semibold">Bitiş</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={viewRange.endDate}
                  onChange={(e) => setViewRange({ ...viewRange, endDate: e.target.value })}
                />
              </div>
              <div className="col-2 d-flex align-items-end">
                <button className="btn btn-outline-brand btn-sm w-100" onClick={loadView}>
                  Getir
                </button>
              </div>
            </div>

            {viewError && <p className="text-danger small">{viewError}</p>}

            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tarih</th>
                    <th>Toplam</th>
                    <th>Dolu</th>
                    <th>Boş</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={4} className="text-center text-muted py-3">Yükleniyor...</td></tr>
                  )}
                  {!loading && days.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-muted py-3">Bu aralık için stok tanımlanmamış.</td></tr>
                  )}
                  {days.map((d) => (
                    <tr key={d.date}>
                      <td className="small">{formatDate(d.date)}</td>
                      <td>{d.totalRooms}</td>
                      <td>{d.bookedRooms}</td>
                      <td className={d.availableRooms === 0 ? "text-danger fw-semibold" : "fw-semibold"}>
                        {d.availableRooms}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
