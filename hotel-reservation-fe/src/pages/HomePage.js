import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchWidget from "../components/SearchWidget";
import { fetchRoomTypes } from "../api/hotelApi";
import { formatCurrency } from "../utils/format";

export default function HomePage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoomTypes()
      .then(setRoomTypes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container text-center">
          <p className="text-uppercase text-gold fw-semibold mb-2" style={{ letterSpacing: "0.2em" }}>
            Life is Live
          </p>
          <h1 className="hero-title mb-0">Denizle Buluşan Konfor</h1>
        </div>
      </section>

      <div className="container">
        <SearchWidget />
      </div>

      <section className="container py-5 mt-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Konseptlerimiz</h2>
          <p className="text-muted">
            Ailenizle veya sadece siz ve eşiniz icin, ihtiyacınıza en uygun konsepti seçin.
          </p>
        </div>

        {loading && <p className="text-center text-muted">Yükleniyor...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        <div className="row g-4">
          {roomTypes.map((rt) => (
            <div className="col-md-6" key={rt.id}>
              <div className="card card-soft h-100 overflow-hidden">
                <img
                  src={rt.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"}
                  alt={rt.name}
                  className="room-card-img w-100"
                />
                <div className="card-body p-4">
                  <h4 className="fw-bold">{rt.name}</h4>
                  <p className="text-muted small mb-3">{rt.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      {formatCurrency(rt.basePrice)} gecelikten başlayan fiyatlarla
                    </span>
                    <Link to="/rooms" className="btn btn-outline-brand btn-sm">
                      İncele
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="restaurant" className="bg-cream py-5">
        <div className="container row align-items-center g-4">
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80"
              alt="Gurme Restoran"
              className="rounded-4 w-100"
              style={{ height: 340, objectFit: "cover" }}
            />
          </div>
          <div className="col-lg-6">
            <p className="text-gold fw-semibold text-uppercase small">Lezzet Duraklari</p>
            <h2 className="fw-bold mb-3">Gurme Ana Restoran</h2>
            <p className="text-muted">
              Açık büfe konseptiyle dünya mutfaklarından seçme lezzetleri, günün her
              saatinde misafirlerimizin beğenisine sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      <section id="beach" className="py-5">
        <div className="container row align-items-center g-4 flex-lg-row-reverse">
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
              alt="Plaj ve Havuzlar"
              className="rounded-4 w-100"
              style={{ height: 340, objectFit: "cover" }}
            />
          </div>
          <div className="col-lg-6">
            <p className="text-gold fw-semibold text-uppercase small">Deniz &amp; Gunes</p>
            <h2 className="fw-bold mb-3">Plaj ve Havuzlarımız</h2>
            <p className="text-muted">
              Geniş plaj sezlongları, çocuk havuzu ve swim-up konseptli havuz barlarımızla
              günün her anı keyifli.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
