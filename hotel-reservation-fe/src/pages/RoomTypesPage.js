import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAvailability } from "../api/hotelApi";
import { useReservationFlow } from "../context/ReservationContext";
import { formatCurrency, formatDate, nightsBetween } from "../utils/format";

function getDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const toIso = (d) => d.toISOString().split("T")[0];
  return {
    defaultCheckIn: toIso(today),
    defaultCheckOut: toIso(tomorrow),
  };
}

export default function RoomTypesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateFlow } = useReservationFlow();

  const { defaultCheckIn, defaultCheckOut } = getDefaultDates();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adultCount = Number(searchParams.get("adults") || 2);
  const childCount = Number(searchParams.get("children") || 0);

  const [formCheckIn, setFormCheckIn] = useState(checkIn || defaultCheckIn);
  const [formCheckOut, setFormCheckOut] = useState(checkOut || defaultCheckOut);
  const [formAdults, setFormAdults] = useState(adultCount);
  const [formChildren, setFormChildren] = useState(childCount);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormCheckIn(checkIn || defaultCheckIn);
    setFormCheckOut(checkOut || defaultCheckOut);
    setFormAdults(adultCount);
    setFormChildren(childCount);
  }, [checkIn, checkOut, adultCount, childCount, defaultCheckIn, defaultCheckOut]);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    if (checkOut <= checkIn) {
      setResults([]);
      setError("Çıkış tarihi giriş tarihinden sonra olmalıdır.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    searchAvailability({ checkIn, checkOut, adultCount, childCount })
      .then(setResults)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, adultCount, childCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!formCheckIn || !formCheckOut) {
      setError("Lütfen giriş ve çıkış tarihi seçin.");
      return;
    }
    if (formCheckOut <= formCheckIn) {
      setError("Çıkış tarihi giriş tarihinden sonra olmalıdır.");
      return;
    }

    setSearchParams({
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      adults: String(formAdults),
      children: String(formChildren),
    });
  };

  const handleSelect = (item) => {
    updateFlow({
      checkIn,
      checkOut,
      adultCount,
      childCount,
      roomTypeId: item.roomType.id,
    });
    navigate(`/reservation/${item.roomType.id}`);
  };

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  return (
    <div className="container py-4">
      <div className="mb-3">
        <h2 className="fw-bold mb-1">Müsait Odalar</h2>
        {checkIn && checkOut && nights > 0 ? (
          <p className="text-muted mb-0 small">
            {formatDate(checkIn)} - {formatDate(checkOut)} ({nights} gece) &middot;{" "}
            {adultCount} Yetiskin{childCount > 0 ? `, ${childCount} Cocuk` : ""}
          </p>
        ) : (
          <p className="text-muted mb-0 small">
            Müsait odaları ve fiyatları görmek için tarih aralığı seçin.
          </p>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="card card-soft p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-semibold mb-1">Giriş Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={formCheckIn}
              onChange={(e) => setFormCheckIn(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold mb-1">Çıkış Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={formCheckOut}
              onChange={(e) => setFormCheckOut(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold mb-1">Yetişkin</label>
            <input
              type="number"
              min={1}
              max={10}
              className="form-control"
              value={formAdults}
              onChange={(e) => setFormAdults(Number(e.target.value) || 1)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold mb-1">Çocuk</label>
            <input
              type="number"
              min={0}
              max={10}
              className="form-control"
              value={formChildren}
              onChange={(e) => setFormChildren(Number(e.target.value) || 0)}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button type="submit" className="btn btn-brand">
              Odaları Ara
            </button>
          </div>
        </div>
      </form>

      {loading && <p className="text-muted">Müsaitlik kontrol ediliyor...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && checkIn && checkOut && results.length === 0 && (
        <p className="text-muted">Bu kriterlere uygun oda bulunamadı.</p>
      )}

      <div className="row g-4">
        {results.map((item) => (
          <div className="col-md-6" key={item.roomType.id}>
            <div className="card card-soft h-100 overflow-hidden">
              <img
                src={
                  item.roomType.images?.[0] ||
                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80"
                }
                alt={item.roomType.name}
                className="room-card-img w-100"
                style={{ height: 210, objectFit: "cover" }}
              />
              <div className="card-body p-3 p-md-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h4 className="fw-bold mb-0">{item.roomType.name}</h4>
                  {!item.available && (
                    <span className="badge badge-not-available">Dolu</span>
                  )}
                </div>
                <p className="text-muted small mb-2">{item.roomType.description}</p>
                <p className="text-muted small mb-3">
                  <i className="bi bi-people me-1" />
                  {item.roomType.maxAdult} Yetişkin
                  {item.roomType.maxChild > 0 ? ` + ${item.roomType.maxChild} Çocuk` : ""} kapasiteli
                  {item.roomType.sizeM2 ? ` \u00b7 ${item.roomType.sizeM2} m\u00b2` : ""}
                </p>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div>
                    {item.available && item.boardOptions?.length > 0 ? (
                      <>
                        <div className="text-muted small">Başlangıç fiyatı</div>
                        <div className="fw-bold fs-5">
                          {formatCurrency(
                            Math.min(...item.boardOptions.map((b) => b.totalPrice))
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted small">Fiyat bilgisi yok</span>
                    )}
                  </div>
                  <button
                    className="btn btn-brand"
                    disabled={!item.available}
                    onClick={() => handleSelect(item)}
                  >
                    Seç
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}