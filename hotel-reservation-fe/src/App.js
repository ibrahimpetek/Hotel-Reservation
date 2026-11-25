import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReservationProvider } from "./context/ReservationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


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
          <Route
            path="/"
            element={
              <PublicLayout>
                <div className="container py-5">Ana sayfa (geçici)</div>
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ReservationProvider>
  );
}

export default App;