import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReservationProvider } from "./context/ReservationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import RoomTypesPage from "./pages/RoomTypesPage";
import ReservationPage from "./pages/ReservationPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";


function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/rooms" element={<PublicLayout><RoomTypesPage /></PublicLayout>} />
          <Route
            path="/reservation/:roomTypeId"
            element={<PublicLayout><ReservationPage /></PublicLayout>}
          />
          <Route
            path="/payment/:reservationId"
            element={<PublicLayout><PaymentPage /></PublicLayout>}
          />
          <Route
            path="/confirmation/:code"
            element={<PublicLayout><ConfirmationPage /></PublicLayout>}
          />
        </Routes>
      </BrowserRouter>
    </ReservationProvider>
  );
}

export default App;