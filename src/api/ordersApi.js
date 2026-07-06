import axiosClient from "./axiosClient";

// Place an order from the current cart
export const placeOrder = async () => {
  const { data } = await axiosClient.post("/api/auth/orders");
  return data;
};

// Buy a single variant immediately, skipping the cart
export const buyNow = async ({ variantId, quantity = 1 }) => {
  const { data } = await axiosClient.post("/api/auth/orders/buy", {
    variantId,
    quantity,
  });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axiosClient.get("/api/auth/orders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axiosClient.get(`/api/auth/orders/${id}`);
  return data;
};