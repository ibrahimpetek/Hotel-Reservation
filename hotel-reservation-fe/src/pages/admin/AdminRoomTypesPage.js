import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchRoomTypes } from "../../api/hotelApi";
import { createRoomType, updateRoomType, deactivateRoomType } from "../../api/adminApi";
import { formatCurrency } from "../../utils/format";

const EMPTY_FORM = {
  name: "",
  description: "",
  sizeM2: "",
  maxAdult: 2,
  maxChild: 0,
  basePrice: "",
  images: "",
  amenities: "",
};

export default function AdminRoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchRoomTypes()
      .then(setRoomTypes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (rt) => {
    setEditingId(rt.id);
    setForm({
      name: rt.name,
      description: rt.description || "",
      sizeM2: rt.sizeM2 || "",
      maxAdult: rt.maxAdult,
      maxChild: rt.maxChild,
      basePrice: rt.basePrice,
      images: (rt.images || []).join("\n"),
      amenities: (rt.amenities || []).join("\n"),
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      sizeM2: form.sizeM2 ? Number(form.sizeM2) : null,
      maxAdult: Number(form.maxAdult),
      maxChild: Number(form.maxChild),
      basePrice: Number(form.basePrice),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await updateRoomType(editingId, payload);
      } else {
        await createRoomType(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Bu oda tipini pasife almak istediğinize emin misiniz?")) return;
    try {
      await deactivateRoomType(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Oda Tipleri</h3>
        <button className="btn btn-brand" onClick={openCreateForm}>
          <i className="bi bi-plus-lg me-1" /> Yeni Oda Tipi
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card card-soft p-4 mb-4">
          <h5 className="fw-bold mb-3">{editingId ? "Oda Tipini Duzenle" : "Yeni Oda Tipi"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Ad</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Metrekare</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.sizeM2}
                  onChange={(e) => setForm({ ...form, sizeM2: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Liste Fiyatı (gecelik)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Maks. Yetişkin</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={form.maxAdult}
                  onChange={(e) => setForm({ ...form, maxAdult: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Maks. Çocuk</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  value={form.maxChild}
                  onChange={(e) => setForm({ ...form, maxChild: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Açıklama</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  Görsel URL'leri (her satıra bir tane)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  Özellikler (her satıra bir tane)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="Deniz manzarasi&#10;Minibar"
                />
              </div>
            </div>

            {formError && <p className="text-danger small mt-3">{formError}</p>}

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-brand" disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                className="btn btn-outline-brand"
                onClick={() => setShowForm(false)}
              >
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
              <th>Ad</th>
              <th>Kapasite</th>
              <th>m&sup2;</th>
              <th>Liste Fiyatı</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Yükleniyor...</td></tr>
            )}
            {!loading && roomTypes.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Henüz oda tipi eklenmemiş.</td></tr>
            )}
            {roomTypes.map((rt) => (
              <tr key={rt.id}>
                <td className="fw-semibold">{rt.name}</td>
                <td>{rt.maxAdult} Yetiskin{rt.maxChild > 0 ? ` + ${rt.maxChild} Çocuk` : ""}</td>
                <td>{rt.sizeM2 || "-"}</td>
                <td>{formatCurrency(rt.basePrice)}</td>
                <td><span className="badge bg-success-subtle text-success-emphasis">Aktif</span></td>
                <td className="d-flex gap-2">
                  <button className="btn btn-outline-brand btn-sm" onClick={() => openEditForm(rt)}>
                    Düzenle
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeactivate(rt.id)}>
                    Pasife Al
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
