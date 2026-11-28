import apiClient from "./client";

/* Auth (staff)*/

export const staffLogin = async (email, password) => {
  const { data } = await apiClient.post("/api/auth/login", { email, password });
  return data;
};



/* Resepsiyon: Rezervasyon Yonetimi */

export const fetchStaffReservations = async (status) => {
  const { data } = await apiClient.get("/api/staff/reservations", { params: { status } });
  return data;
};

export const cancelReservation = async (id) => {
  await apiClient.post(`/api/staff/reservations/${id}/cancel`);
};




/* Admin: Oda Tipi Yonetimi */

export const createRoomType = async (payload) => {
  const { data } = await apiClient.post("/api/admin/room-types", payload);
  return data;
};

export const updateRoomType = async (id, payload) => {
  const { data } = await apiClient.put(`/api/admin/room-types/${id}`, payload);
  return data;
};

export const deactivateRoomType = async (id) => {
  await apiClient.delete(`/api/admin/room-types/${id}`);
};




/* Admin: Fiyat Kuralları */

export const fetchPriceRules = async (roomTypeId) => {
  const { data } = await apiClient.get("/api/admin/price-rules", { params: { roomTypeId } });
  return data;
};

export const createPriceRule = async (payload) => {
  const { data } = await apiClient.post("/api/admin/price-rules", payload);
  return data;
};

export const updatePriceRule = async (id, payload) => {
  const { data } = await apiClient.put(`/api/admin/price-rules/${id}`, payload);
  return data;
};

export const deactivatePriceRule = async (id) => {
  await apiClient.delete(`/api/admin/price-rules/${id}`);
};




/* Admin: Müsaitlik / Stok */

export const bulkSetAvailability = async (payload) => {
  await apiClient.post("/api/admin/availability/bulk", payload);
};

export const fetchAvailabilityRange = async (roomTypeId, startDate, endDate) => {
  const { data } = await apiClient.get("/api/admin/availability", {
    params: { roomTypeId, startDate, endDate },
  });
  return data;
};




/* Admin: Personel Yönetimi  */

export const fetchStaffList = async () => {
  const { data } = await apiClient.get("/api/admin/staff");
  return data;
};

export const createStaff = async (payload) => {
  const { data } = await apiClient.post("/api/admin/staff", payload);
  return data;
};

export const deactivateStaff = async (id) => {
  await apiClient.delete(`/api/admin/staff/${id}`);
};
