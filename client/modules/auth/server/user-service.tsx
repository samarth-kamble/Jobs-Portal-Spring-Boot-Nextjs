import axios from "axios";
import { LoginFormData, SignupFormData } from "../validations";

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export const registerUser = async (user: SignupFormData) => {
  const res = await axios.post(`${base_url}/register`, user);
  return res.data;
};

export const loginUser = async (login: LoginFormData) => {
  const res = await axios.post(`${base_url}/login`, login);
  return res.data;
};

export const sendOtp = async (email: string) => {
  const res = await axios.post(`${base_url}/send-otp/${email}`);
  return res.data;
};

export const verfiyOtp = async (email: string, otp: string) => {
  const res = await axios.get(`${base_url}/verify-otp/${email}/${otp}`);
  return res.data;
};

export const changePass = async (email: string, password: string) => {
  const res = await axios.post(`${base_url}/change-pass`, { email, password });
  return res.data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const res = await axios.post(`${base_url}/verify-email/${email}/${otp}`);
  return res.data;
};
