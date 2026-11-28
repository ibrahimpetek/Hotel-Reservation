import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import HomePage from "./pages/HomePage";
import RoomTypesPage from "./pages/RoomTypesPage";
import ReservationPage from "./pages/ReservationPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRoomTypesPage from "./pages/admin/AdminRoomTypesPage";
import AdminPriceRulesPage from "./pages/admin/AdminPriceRulesPage";
import AdminAvailabilityPage from "./pages/admin/AdminAvailabilityPage";
import AdminStaffPage from "./pages/admin/AdminStaffPage";

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
    <AuthProvider>
      <ReservationProvider>
        <BrowserRouter>
          <Routes>
            {/* ---- Musteri tarafi (login gerekmez) ---- */}
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

            {/* ---- Admin / Resepsiyon paneli (login gerekir) ---- */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/room-types"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminRoomTypesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/price-rules"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPriceRulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/availability"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAvailabilityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminStaffPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
