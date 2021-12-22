import { VALIDATE_OTP_API } from "../api";
import axios from "axios";

export const validateOtp = async (phoneNumber, otp) => {
  const ult = "otp";
  const ut = "ops_admin";
  const payload = { ult, ut, phoneNumberRaw: phoneNumber, otp };
  console.log(payload);
  try {
    const res = await axios.post(VALIDATE_OTP_API, { userData: payload });
    console.log(res);
    return res;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
