import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchReservationByCode } from "../api/hotelApi";
import { useReservationFlow } from "../context/ReservationContext";
import { formatCurrency, formatDate } from "../utils/format";

export default function ConfirmationPage() {
  const { code } = useParams();
  const { clearFlow } = useReservationFlow();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservationByCode(code)
      .then(setReservation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    
    return () => clearFlow();
    
  }, [code]);

  if (loading) {
    return <div className="container py-5"><p className="text-muted">Yükleniyor...</p></div>;
  }

  if (error || !reservation) {
    return (
      <div className="container py-5">
        <p className="text-danger">{error || "Rezervasyon bulunamadı."}</p>
        <Link to="/" className="btn btn-outline-brand">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="confirmation-check mb-3">
          <i className="bi bi-check-lg" />
        </div>
        <h2 className="fw-bold mb-2">Rezervasyonunuz Onaylandı!</h2>
        <p className="text-muted">
          Rezervasyon detayları <strong>{reservation.leadGuestEmail}</strong> adresine gönderildi.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card card-soft p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
              <div>
                <p className="text-muted small mb-1">Rezervasyon Kodu</p>
                <h4 className="fw-bold mb-0">{reservation.reservationCode}</h4>
              </div>
              <span className="badge bg-success-subtle text-success-emphasis fs-6 px-3 py-2">
                {reservation.status === "CONFIRMED" ? "Onaylandi" : reservation.status}
              </span>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <p className="text-muted small mb-1">Oda Tipi</p>
                <p className="fw-semibold">{reservation.roomTypeName}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Pansiyon</p>
                <p className="fw-semibold">{reservation.boardTypeDisplayName}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Giriş</p>
                <p className="fw-semibold">{formatDate(reservation.checkIn)}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Çıkış</p>
                <p className="fw-semibold">{formatDate(reservation.checkOut)}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Misafirler</p>
                <p className="fw-semibold">
                  {reservation.adultCount} Yetişkin
                  {reservation.childCount > 0 ? `, ${reservation.childCount} Cocuk` : ""}
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">Rezervasyon Sahibi</p>
                <p className="fw-semibold">{reservation.leadGuestFullName}</p>
              </div>
            </div>

            {reservation.guests?.length > 0 && (
              <>
                <hr className="my-4" />
                <p className="text-muted small mb-2">Odada Kalacak Misafirler</p>
                <ul className="list-unstyled mb-0">
                  {reservation.guests.map((g, i) => (
                    <li key={i} className="small py-1">
                      {g.firstName} {g.lastName} {g.age ? `(${g.age} yas)` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold fs-5">Toplam Ödenen Tutar</span>
              <span className="fs-3 fw-bold">{formatCurrency(reservation.totalPrice)}</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-brand">Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
