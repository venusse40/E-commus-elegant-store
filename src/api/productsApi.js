import axiosClient from "./axiosClient";

// Get all products. Accepts optional query params object (e.g. { page, search })
export const getAllProducts = async (params = {}) => {
  const { data } = await axiosClient.get("/api/public/products", { params });
  return data;
};

export const getProductsByCategory = async (categoryId) => {
  const { data } = await axiosClient.get(
    `/api/public/products/category/${categoryId}`
  );
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axiosClient.get(`/api/public/products/${id}`);
  return data;
};

export const getAllCategories = async () => {
  const { data } = await axiosClient.get("/api/categories");
  return data;
};