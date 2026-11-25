import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservationFlow } from "../context/ReservationContext";
import { addDaysIso, todayIsoDate } from "../utils/format";



export default function SearchWidget() {
  const navigate = useNavigate();
  const { updateFlow, flow } = useReservationFlow();
  const popoverRef = useRef(null);

  const [checkIn, setCheckIn] = useState(flow.checkIn || todayIsoDate());
  const [checkOut, setCheckOut] = useState(flow.checkOut || addDaysIso(todayIsoDate(), 7));
  const [adultCount, setAdultCount] = useState(flow.adultCount ?? 2);
  const [childCount, setChildCount] = useState(flow.childCount ?? 0);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setGuestPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckInChange = (value) => {
    setCheckIn(value);
    // çıkış tarihi girişten önce/eşitse otomatik olarak 1 gün sonrasına çek.
    if (checkOut <= value) {
      setCheckOut(addDaysIso(value, 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Lutfen giris ve cikis tarihini secin.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Cikis tarihi giris tarihinden sonra olmalidir.");
      return;
    }
    if (adultCount < 1) {
      setError("En az 1 yetiskin secilmelidir.");
      return;
    }

    updateFlow({ checkIn, checkOut, adultCount, childCount });

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adultCount),
      children: String(childCount),
    });
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="search-widget">
      <form onSubmit={handleSubmit} className="row g-3 align-items-end">
        <div className="col-md-3">
          <label htmlFor="checkIn">Giris Tarihi</label>
          <input
            id="checkIn"
            type="date"
            className="form-control form-control-lg"
            value={checkIn}
            min={todayIsoDate()}
            onChange={(e) => handleCheckInChange(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="checkOut">Cikis Tarihi</label>
          <input
            id="checkOut"
            type="date"
            className="form-control form-control-lg"
            value={checkOut}
            min={addDaysIso(checkIn, 1)}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="col-md-4 position-relative" ref={popoverRef}>
          <label>Misafirler</label>
          <button
            type="button"
            className="form-control form-control-lg text-start"
            onClick={() => setGuestPopoverOpen((v) => !v)}
          >
            {adultCount} Yetiskin{childCount > 0 ? `, ${childCount} Cocuk` : ""}
          </button>

          {guestPopoverOpen && (
            <div className="guest-selector-popover">
              <GuestCounterRow
                label="Yetiskin"
                sublabel="13 yas ve uzeri"
                value={adultCount}
                min={1}
                max={10}
                onChange={setAdultCount}
              />
              <GuestCounterRow
                label="Cocuk"
                sublabel="0-12 yas"
                value={childCount}
                min={0}
                max={6}
                onChange={setChildCount}
              />
              <button
                type="button"
                className="btn btn-brand btn-sm w-100 mt-2"
                onClick={() => setGuestPopoverOpen(false)}
              >
                Tamam
              </button>
            </div>
          )}
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-brand btn-lg w-100">
            Rezervasyon
          </button>
        </div>

        {error && (
          <div className="col-12">
            <p className="text-danger small mb-0 mt-1">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}

function GuestCounterRow({ label, sublabel, value, min, max, onChange }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2">
      <div>
        <div className="fw-semibold small">{label}</div>
        <div className="text-muted" style={{ fontSize: "0.72rem" }}>
          {sublabel}
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="counter-btn"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </button>
        <span style={{ width: 20, textAlign: "center" }}>{value}</span>
        <button
          type="button"
          className="counter-btn"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
