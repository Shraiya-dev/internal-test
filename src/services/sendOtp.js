import axios from "axios";
import { SEND_OTP_API } from "../api";

export const sendOtp = async (phoneNumber, login = true) => {
  const payload = {
    phoneNumber,
    login,
  };
  return axios.post(SEND_OTP_API, payload);
};
