import { VALIDATE_OTP_API } from "../api";
import axios from "axios";

export const validateOtp = async (phoneNumber, otp) => {
  const payload = { phoneNumberRaw: phoneNumber, otp };
  try {
    const res = await axios.post(VALIDATE_OTP_API, payload);
    return res;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
