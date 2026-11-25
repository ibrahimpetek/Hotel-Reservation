export default function Footer() {
  return (
    <footer className="footer-dark pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="navbar-brand-text text-white mb-3">GRAND RESERVE</h5>
            <p className="small mb-0">
              Deniz kenarinda huzurlu bir kacamak icin tasarlanmis konseptleriyle
              Grand Reserve, ailenizle veya sevdiklerinizle unutulmaz bir konaklama sunar.
            </p>
          </div>
          <div className="col-lg-2 col-6">
            <h6 className="text-white mb-3">Kurumsal</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#!">Hakkimizda</a></li>
              <li><a href="#!">Iletisim</a></li>
              <li><a href="#!">Kariyer</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-6">
            <h6 className="text-white mb-3">Konseptler</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#!">Aile Konsepti</a></li>
              <li><a href="#!">Yetiskin Konsepti</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 className="text-white mb-3">Iletisim</h6>
            <p className="small mb-1">+90 242 000 00 00</p>
            <p className="small mb-1">info@grandreserve.com</p>
            <p className="small mb-0">Belek, Antalya, Turkiye</p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="small text-center mb-0">
          &copy; {new Date().getFullYear()} Grand Reserve Hotel. Tum haklari saklidir.
        </p>
      </div>
    </footer>
  );
}
