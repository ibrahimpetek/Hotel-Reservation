import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchAvailability, createReservation } from "../api/hotelApi";
import { useReservationFlow } from "../context/ReservationContext";
import {
  formatCurrency,
  formatDate,
  installmentOptions,
  nightsBetween,
} from "../utils/format";

export default function ReservationPage() {
  const { roomTypeId } = useParams();
  const navigate = useNavigate();
  const { flow, updateFlow } = useReservationFlow();

  const checkIn = flow.checkIn;
  const checkOut = flow.checkOut;
  const adultCount = flow.adultCount ?? 2;
  const childCount = flow.childCount ?? 0;

  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedBoardType, setSelectedBoardType] = useState(null);
  const [leadGuest, setLeadGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    identityNumber: "",
    nationality: "Turkiye",
  });
  const [guests, setGuests] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");

  const totalGuestCount = adultCount + childCount;

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setError("Once ana sayfadan tarih secimi yapmalisiniz.");
      setLoading(false);
      return;
    }

    setLoading(true);
    searchAvailability({ checkIn, checkOut, adultCount, childCount, roomTypeId })
      .then((results) => {
        const match = results[0];
        if (!match || !match.available) {
          setError("Bu oda tipi secilen tarihlerde artik musait degil.");
          return;
        }
        setSearchResult(match);
        if (match.boardOptions?.length > 0) {
          setSelectedBoardType(match.boardOptions[0].boardType);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    
  }, [roomTypeId, checkIn, checkOut, adultCount, childCount]);

  
  useEffect(() => {
    setGuests((prev) => {
      const next = [...prev];
      while (next.length < totalGuestCount) {
        const isChildSlot = next.length >= adultCount;
        next.push({ firstName: "", lastName: "", age: isChildSlot ? 8 : 30, child: isChildSlot });
      }
      return next.slice(0, totalGuestCount);
    });
  }, [totalGuestCount, adultCount]);

  const selectedOption = useMemo(
    () => searchResult?.boardOptions?.find((b) => b.boardType === selectedBoardType),
    [searchResult, selectedBoardType]
  );

  const nights = nightsBetween(checkIn, checkOut);

  const updateGuestField = (index, field, value) => {
    setGuests((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedBoardType) {
      setError("Lutfen bir pansiyon tipi secin.");
      return;
    }
    if (!leadGuest.firstName || !leadGuest.lastName || !leadGuest.email || !leadGuest.phone) {
      setError("Lütfen rezervasyon sahibinin ad, soyad, e-posta ve telefon bilgilerini doldurun.");
      return;
    }
    if (guests.some((g) => !g.firstName || !g.lastName)) {
      setError("Lütfen odada kalacak tüm misafirlerin ad-soyad bilgisini girin.");
      return;
    }

    setSubmitting(true);
    try {
      const reservation = await createReservation({
        roomTypeId: Number(roomTypeId),
        checkIn,
        checkOut,
        boardType: selectedBoardType,
        adultCount,
        childCount,
        leadGuest,
        guests,
        specialRequests,
      });

      updateFlow({ reservation });
      navigate(`/payment/${reservation.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><p className="text-muted">Yükleniyor...</p></div>;
  }

  if (error && !searchResult) {
    return (
      <div className="container py-5">
        <p className="text-danger">{error}</p>
        <button className="btn btn-outline-brand" onClick={() => navigate("/")}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">{searchResult.roomType.name} - Rezervasyon</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Pansiyon secimi */}
            <h5 className="fw-bold mb-3">Pansiyon Seçimi</h5>
            <div className="row g-3 mb-5">
              {searchResult.boardOptions.map((option) => (
                <div className="col-md-6" key={option.boardType}>
                  <div
                    className={`board-option-card ${
                      selectedBoardType === option.boardType ? "selected" : ""
                    }`}
                    onClick={() => setSelectedBoardType(option.boardType)}
                  >
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={selectedBoardType === option.boardType}
                        onChange={() => setSelectedBoardType(option.boardType)}
                      />
                      <label className="form-check-label fw-semibold">
                        {option.displayName}
                      </label>
                    </div>
                    <div className="fs-5 fw-bold mt-2">{formatCurrency(option.totalPrice)}</div>
                    <div className="text-muted small">
                      {formatCurrency(option.pricePerNight)} / gece
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rezervasyon sahibi */}
            <h5 className="fw-bold mb-3">Rezervasyon Sahibi</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Ad</label>
                <input
                  className="form-control"
                  value={leadGuest.firstName}
                  onChange={(e) => setLeadGuest({ ...leadGuest, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Soyad</label>
                <input
                  className="form-control"
                  value={leadGuest.lastName}
                  onChange={(e) => setLeadGuest({ ...leadGuest, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">E-posta</label>
                <input
                  type="email"
                  className="form-control"
                  value={leadGuest.email}
                  onChange={(e) => setLeadGuest({ ...leadGuest, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Telefon</label>
                <input
                  className="form-control"
                  value={leadGuest.phone}
                  onChange={(e) => setLeadGuest({ ...leadGuest, phone: e.target.value })}
                  placeholder="+90 5xx xxx xx xx"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">TC Kimlik / Pasaport No</label>
                <input
                  className="form-control"
                  value={leadGuest.identityNumber}
                  onChange={(e) => setLeadGuest({ ...leadGuest, identityNumber: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Uyruk</label>
                <input
                  className="form-control"
                  value={leadGuest.nationality}
                  onChange={(e) => setLeadGuest({ ...leadGuest, nationality: e.target.value })}
                />
              </div>
            </div>

            {/* Odada kalacak misafirler */}
            <h5 className="fw-bold mb-3">Odada Kalacak Misafirler</h5>
            {guests.map((guest, index) => (
              <div className="row g-3 mb-2" key={index}>
                <div className="col-md-5">
                  <input
                    className="form-control"
                    placeholder={`${index + 1}. Misafir - Ad`}
                    value={guest.firstName}
                    onChange={(e) => updateGuestField(index, "firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <input
                    className="form-control"
                    placeholder="Soyad"
                    value={guest.lastName}
                    onChange={(e) => updateGuestField(index, "lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Yas"
                    min={0}
                    max={120}
                    value={guest.age}
                    onChange={(e) => updateGuestField(index, "age", Number(e.target.value))}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4">
              <label className="form-label small fw-semibold">Ozel Istekler (opsiyonel)</label>
              <textarea
                className="form-control"
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>

          {/* Ozet kutusu */}
          <div className="col-lg-4">
            <div className="card card-soft summary-box p-4">
              <h5 className="fw-bold mb-3">Rezervasyon Özeti</h5>
              <p className="mb-1 small text-muted">Oda Tipi</p>
              <p className="fw-semibold">{searchResult.roomType.name}</p>

              <p className="mb-1 small text-muted">Tarihler</p>
              <p className="fw-semibold mb-1">
                {formatDate(checkIn)} - {formatDate(checkOut)}
              </p>
              <p className="small text-muted">{nights} gece</p>

              <p className="mb-1 small text-muted mt-2">Misafirler</p>
              <p className="fw-semibold">
                {adultCount} Yetişkin{childCount > 0 ? `, ${childCount} Cocuk` : ""}
              </p>

              <div className="summary-divider" />

              <p className="mb-1 small text-muted">Pansiyon</p>
              <p className="fw-semibold">
                {selectedOption ? selectedOption.displayName : "-"}
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="fw-semibold">Toplam Tutar</span>
                <span className="fs-4 fw-bold">
                  {selectedOption ? formatCurrency(selectedOption.totalPrice) : "-"}
                </span>
              </div>

              {selectedOption && (
                <div className="mt-3">
                  <p className="small text-muted mb-2">Taksit Seçenekleri (bilgi amaclidir)</p>
                  <ul className="list-unstyled small mb-0">
                    {installmentOptions(selectedOption.totalPrice).map((opt) => (
                      <li key={opt.count} className="d-flex justify-content-between py-1">
                        <span>{opt.label}</span>
                        <span className="fw-semibold">{formatCurrency(opt.perInstallment)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && <p className="text-danger small mt-3 mb-0">{error}</p>}

              <button type="submit" className="btn btn-brand w-100 mt-4" disabled={submitting}>
                {submitting ? "İsleniyor..." : "Rezervasyon Yap"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
