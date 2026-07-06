import axiosClient from "./axiosClient";

export const getCart = async () => {
  const { data } = await axiosClient.get("/api/auth/cart");
  return data;
};

export const clearCart = async () => {
  const { data } = await axiosClient.delete("/api/auth/cart");
  return data;
};

// variantId = the specific product variant being added, quantity defaults to 1
export const addItemToCart = async ({ productId, variantId, quantity = 1 }) => {
  const { data } = await axiosClient.post("/api/auth/cart/items", {
    productId,
    variantId,
    quantity,
  });
  return data;
};
export const updateCartItem = async (itemId, quantity) => {
  const { data } = await axiosClient.patch(
    `/api/auth/cart/items/${itemId}`,
    { quantity }
  );
  return data;
};

export const removeCartItem = async (itemId) => {
  const { data } = await axiosClient.delete(`/api/auth/cart/items/${itemId}`);
  return data;
};