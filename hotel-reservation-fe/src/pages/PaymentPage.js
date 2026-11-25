import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initPayment } from "../api/hotelApi";
import { useReservationFlow } from "../context/ReservationContext";
import { formatCurrency, formatDate, installmentOptions } from "../utils/format";

export default function PaymentPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { flow } = useReservationFlow();

  const reservation = flow.reservation;
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const options = useMemo(
    () => (reservation ? installmentOptions(reservation.totalPrice) : []),
    [reservation]
  );

  if (!reservation || String(reservation.id) !== String(reservationId)) {
    return (
      <div className="container py-5">
        <p className="text-danger">
          ödeme bilgisine ulaşılamadı. Lütfen rezervasyon adımından tekrar deneyin.
        </p>
        <button className="btn btn-outline-brand" onClick={() => navigate("/")}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const handleCardNumberChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await initPayment({
        reservationId: reservation.id,
        installmentCount,
        cardHolderName,
        cardNumber,
        expireMonth,
        expireYear,
        cvc,
      });
      navigate(`/confirmation/${reservation.reservationCode}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Ödeme</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card card-soft p-4">
            <div className="alert alert-warning small mb-4">
              <strong>Sandbox test karti (gelistirme ortami):</strong> Kart No: 5528790000000008
              &middot; SKT: 12/30 &middot; CVC: 123
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Kart Üzerindeki İsim</label>
                <input
                  className="form-control"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Kart Numarası</label>
                <input
                  className="form-control"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="16 haneli kart numarası"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-4">
                  <label className="form-label small fw-semibold">Ay</label>
                  <select
                    className="form-select"
                    value={expireMonth}
                    onChange={(e) => setExpireMonth(e.target.value)}
                    required
                  >
                    <option value="">AA</option>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(
                      (m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Yıl</label>
                  <select
                    className="form-select"
                    value={expireYear}
                    onChange={(e) => setExpireYear(e.target.value)}
                    required
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + i)).map(
                      (y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">CVC</label>
                  <input
                    className="form-control"
                    inputMode="numeric"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Taksit Seçeneği</label>
                <select
                  className="form-select"
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(Number(e.target.value))}
                >
                  {options.map((opt) => (
                    <option key={opt.count} value={opt.count}>
                      {opt.label} - {formatCurrency(opt.perInstallment)}
                      {opt.count > 1 ? " / ay" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-danger small">{error}</p>}

              <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
                {submitting ? "Ödeme İsleniyor..." : `Rezervasyonu Onayla ve Öde`}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card card-soft p-4 summary-box">
            <h5 className="fw-bold mb-3">Rezervasyon Özeti</h5>
            <p className="mb-1 small text-muted">Rezervasyon Kodu</p>
            <p className="fw-semibold">{reservation.reservationCode}</p>

            <p className="mb-1 small text-muted mt-2">Oda Tipi</p>
            <p className="fw-semibold">{reservation.roomTypeName}</p>

            <p className="mb-1 small text-muted mt-2">Tarihler</p>
            <p className="fw-semibold mb-0">
              {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
            </p>
            <p className="small text-muted">{reservation.nights} gece</p>

            <p className="mb-1 small text-muted mt-2">Pansiyon</p>
            <p className="fw-semibold">{reservation.boardTypeDisplayName}</p>

            <div className="summary-divider" />

            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Ödenecek Tutar</span>
              <span className="fs-4 fw-bold">{formatCurrency(reservation.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
