
import axiosClient from "./axiosClient";

export const signupUser = async (data) => {
  const res = await axiosClient.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  return res.data;
};
export const fetchUserProfile = async () => {
  const res = await axiosClient.get("/user/me");
  return res.data;
}
export const googleLogin = async (data) => {
  const res = await axiosClient.post("/auth/google-login", data);
  return res.data;
}
