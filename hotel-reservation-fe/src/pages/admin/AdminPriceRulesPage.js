import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchRoomTypes } from "../../api/hotelApi";
import {
  fetchPriceRules,
  createPriceRule,
  updatePriceRule,
  deactivatePriceRule,
} from "../../api/adminApi";
import { formatCurrency, formatDate } from "../../utils/format";

const BOARD_TYPES = [
  { value: "ROOM_ONLY", label: "Sadece Oda" },
  { value: "BED_AND_BREAKFAST", label: "Kahvaltı Dahil" },
  { value: "HALF_BOARD", label: "Yarım Pansiyon" },
  { value: "FULL_BOARD", label: "Tam Pansiyon" },
  { value: "ULTRA_ALL_INCLUSIVE", label: "Ultra Her Şey Dahil" },
];

const EMPTY_FORM = {
  boardType: "ULTRA_ALL_INCLUSIVE",
  startDate: "",
  endDate: "",
  adultPrice: "",
  childPrice: "0",
  infantPrice: "0",
};

export default function AdminPriceRulesPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoomTypes().then((data) => {
      setRoomTypes(data);
      if (data.length > 0) setSelectedRoomTypeId(String(data[0].id));
    });
  }, []);

  const loadRules = () => {
    if (!selectedRoomTypeId) return;
    setLoading(true);
    fetchPriceRules(selectedRoomTypeId)
      .then(setRules)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setError("");
    loadRules();
  }, [selectedRoomTypeId]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (rule) => {
    setEditingId(rule.id);
    setForm({
      boardType: rule.boardType,
      startDate: rule.startDate,
      endDate: rule.endDate,
      adultPrice: rule.adultPrice,
      childPrice: rule.childPrice || 0,
      infantPrice: rule.infantPrice || 0,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      roomTypeId: Number(selectedRoomTypeId),
      boardType: form.boardType,
      startDate: form.startDate,
      endDate: form.endDate,
      adultPrice: Number(form.adultPrice),
      childPrice: Number(form.childPrice || 0),
      infantPrice: Number(form.infantPrice || 0),
    };

    try {
      if (editingId) {
        await updatePriceRule(editingId, payload);
      } else {
        await createPriceRule(payload);
      }
      setShowForm(false);
      loadRules();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Bu fiyat kuralını pasife almak istediğinize emin misiniz?")) return;
    try {
      await deactivatePriceRule(id);
      loadRules();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Fiyatlandırma</h3>
        <button className="btn btn-brand" onClick={openCreateForm} disabled={!selectedRoomTypeId}>
          <i className="bi bi-plus-lg me-1" /> Yeni Fiyat Kuralı
        </button>
      </div>

      <div className="mb-4" style={{ maxWidth: 320 }}>
        <label className="form-label small fw-semibold">Oda Tipi</label>
        <select
          className="form-select"
          value={selectedRoomTypeId}
          onChange={(e) => setSelectedRoomTypeId(e.target.value)}
        >
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card card-soft p-4 mb-4">
          <h5 className="fw-bold mb-3">{editingId ? "Fiyat Kuralinı Düzenle" : "Yeni Fiyat Kuralı"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Pansiyon Tipi</label>
                <select
                  className="form-select"
                  value={form.boardType}
                  onChange={(e) => setForm({ ...form, boardType: e.target.value })}
                >
                  {BOARD_TYPES.map((bt) => (
                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Baslangıç Tarihi</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Bitiş Tarihi</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Yetişkin Fiyatı (gecelik)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.adultPrice}
                  onChange={(e) => setForm({ ...form, adultPrice: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Çocuk Fiyatı (gecelik)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.childPrice}
                  onChange={(e) => setForm({ ...form, childPrice: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Bebek Fiyatı (gecelik)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.infantPrice}
                  onChange={(e) => setForm({ ...form, infantPrice: e.target.value })}
                />
              </div>
            </div>

            {formError && <p className="text-danger small mt-3">{formError}</p>}

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-brand" disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button type="button" className="btn btn-outline-brand" onClick={() => setShowForm(false)}>
                Vazgeç
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card card-soft p-0 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Pansiyon</th>
              <th>Tarih Aralığı</th>
              <th>Yetişkin</th>
              <th>Çocuk</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Yükleniyor...</td></tr>
            )}
            {!loading && rules.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Bu oda tipi için fiyat kuralı tanımlanmamış.</td></tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="fw-semibold">
                  {BOARD_TYPES.find((b) => b.value === rule.boardType)?.label || rule.boardType}
                </td>
                <td className="small">{formatDate(rule.startDate)} - {formatDate(rule.endDate)}</td>
                <td>{formatCurrency(rule.adultPrice)}</td>
                <td>{formatCurrency(rule.childPrice)}</td>
                <td>
                  <span className={`badge ${rule.active ? "bg-success-subtle text-success-emphasis" : "bg-secondary-subtle text-secondary-emphasis"}`}>
                    {rule.active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <button className="btn btn-outline-brand btn-sm" onClick={() => openEditForm(rule)}>
                    Düzenle
                  </button>
                  {rule.active && (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeactivate(rule.id)}>
                      Pasife Al
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
