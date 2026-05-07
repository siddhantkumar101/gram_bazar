import api from "./axios";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me")
};

export const listingApi = {
  getAll: (params) => api.get("/listings", { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (formData) => api.post("/listings", formData)
};

export const orderApi = {
  create: (payload) => api.post("/orders", payload),
  my: () => api.get("/orders/my"),
  sellerOrders: () => api.get("/orders/seller"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status })
};

export const deliveryApi = {
  pending: () => api.get("/delivery/pending"),
  accept: (id) => api.patch(`/delivery/${id}/accept`),
  complete: (id) => api.patch(`/delivery/${id}/complete`)
};
