import apiClient from "./client";


/*  Oda tipleri  */

export const fetchRoomTypes = async () => {
  const { data } = await apiClient.get("/api/room-types");
  return data;
};

export const fetchRoomTypeById = async (id) => {
  const { data } = await apiClient.get(`/api/room-types/${id}`);
  return data;
};


/*   Müsaitlik-Fiyat Arama   */

export const searchAvailability = async ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  roomTypeId,
}) => {
  const { data } = await apiClient.post("/api/availability/search", {
    checkIn,
    checkOut,
    adultCount,
    childCount: childCount || 0,
    roomTypeId: roomTypeId || null,
  });
  return data;
};


/*  Rezervasyon   */
export const createReservation = async (payload) => {
  const { data } = await apiClient.post("/api/reservations", payload);
  return data;
};

export const fetchReservationByCode = async (code) => {
  const { data } = await apiClient.get(`/api/reservations/code/${code}`);
  return data;
};


/*   Ödeme  */ 
export const initPayment = async (payload) => {
  const { data } = await apiClient.post("/api/payments/init", payload);
  return data;
};