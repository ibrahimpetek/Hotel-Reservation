import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/reservations" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin/reservations");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--brand-cream)" }}
    >
      <div className="card card-soft p-5" style={{ width: 400 }}>
        <div className="text-center mb-4">
          <span className="navbar-brand-text fs-4">GRAND RESERVE</span>
          <p className="text-muted small mt-1 mb-0">Yönetim Paneli Girişi</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">E-posta</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger small">{error}</p>}

          <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
            {submitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-muted small text-center mt-4 mb-0">
          İlk kurulumda otomatik oluşturulan varsayılan admin hesabi için
          backend README'sine bakın.
        </p>
      </div>
    </div>
  );
}
