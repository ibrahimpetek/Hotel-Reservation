import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link to="/" className="navbar-brand navbar-brand-text fs-4">
          GRAND&nbsp;PETEK RESORT
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="mainNav">
          <ul className="navbar-nav align-items-lg-center gap-lg-4">
            <li className="nav-item">
              <Link to="/rooms" className="nav-link fw-semibold">
                Odalar &amp; Konseptler
              </Link>
            </li>
            <li className="nav-item">
              <a href="#restaurant" className="nav-link fw-semibold">
                Restoran
              </a>
            </li>
            <li className="nav-item">
              <a href="#beach" className="nav-link fw-semibold">
                Plaj &amp; Havuzlar
              </a>
            </li>
            <li className="nav-item">
              <Link to="/rooms" className="btn btn-brand btn-sm ms-lg-2">
                Rezervasyon Yap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
