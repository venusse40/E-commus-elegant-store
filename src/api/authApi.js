import axiosClient from "./axiosClient";

export const registerUser = async ({ email, password }) => {
  const { data } = await axiosClient.post("/api/auth/users/register", {
    email,
    password,
    role: "USER",
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosClient.post("/api/auth/users/login", {
    email,
    password,
  });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosClient.get("/api/auth/users/me");
  return data;
};