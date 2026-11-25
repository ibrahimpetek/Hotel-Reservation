import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAvailability } from "../api/hotelApi";
import { useReservationFlow } from "../context/ReservationContext";
import { formatCurrency, formatDate, nightsBetween } from "../utils/format";

export default function RoomTypesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateFlow } = useReservationFlow();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adultCount = Number(searchParams.get("adults") || 2);
  const childCount = Number(searchParams.get("children") || 0);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setError("Önce ana sayfadan tarih seçimi yapmalısınız.");
      setLoading(false);
      return;
    }

    setLoading(true);
    searchAvailability({ checkIn, checkOut, adultCount, childCount })
      .then(setResults)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    
  }, [checkIn, checkOut, adultCount, childCount]);

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

  const nights = nightsBetween(checkIn, checkOut);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Müsait Odalar</h2>
        {checkIn && checkOut && (
          <p className="text-muted mb-0">
            {formatDate(checkIn)} - {formatDate(checkOut)} ({nights} gece) &middot;{" "}
            {adultCount} Yetiskin{childCount > 0 ? `, ${childCount} Cocuk` : ""}
          </p>
        )}
      </div>

      {loading && <p className="text-muted">Müsaitlik kontrol ediliyor...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && results.length === 0 && (
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
              />
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h4 className="fw-bold mb-0">{item.roomType.name}</h4>
                  {!item.available && (
                    <span className="badge badge-not-available">Dolu</span>
                  )}
                </div>
                <p className="text-muted small mb-3">{item.roomType.description}</p>
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
