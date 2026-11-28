import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchStaffList, createStaff, deactivateStaff } from "../../api/adminApi";

const EMPTY_FORM = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  role: "RECEPTIONIST",
};

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchStaffList()
      .then(setStaffList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await createStaff(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Bu personeli pasife almak istediğinize emin misiniz?")) return;
    try {
      await deactivateStaff(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Personel</h3>
        <button className="btn btn-brand" onClick={() => setShowForm((v) => !v)}>
          <i className="bi bi-plus-lg me-1" /> Yeni Personel
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card card-soft p-4 mb-4">
          <h5 className="fw-bold mb-3">Yeni Personel Ekle</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Ad Soyad</label>
                <input
                  className="form-control"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Telefon</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">E-posta</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Şifre (en az 8 karakter)</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={8}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Rol</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="RECEPTIONIST">Resepsiyonist</option>
                  <option value="ADMIN">Yönetici (Admin)</option>
                </select>
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
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Yükleniyor...</td></tr>
            )}
            {!loading && staffList.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-4">Henuz personel eklenmemiş.</td></tr>
            )}
            {staffList.map((s) => (
              <tr key={s.id}>
                <td className="fw-semibold">{s.fullName}</td>
                <td>{s.email}</td>
                <td>{s.phone || "-"}</td>
                <td>{s.role === "ADMIN" ? "Yonetici" : "Resepsiyonist"}</td>
                <td>
                  <span className={`badge ${s.active ? "bg-success-subtle text-success-emphasis" : "bg-secondary-subtle text-secondary-emphasis"}`}>
                    {s.active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td>
                  {s.active && (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeactivate(s.id)}>
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
