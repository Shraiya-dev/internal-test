import { useState } from "react";
import { useMutation } from "react-query";
import { sendOtp } from "../../services/sendOtp";
import { isANumber } from "../../utils";
import { useAuth } from "../../providers/AuthProvider";

const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber.length === 0) {
    return "Phone number is required.";
  }

  if (phoneNumber.length < 10) {
    return "Phone number must be 10 digit long.";
  }
  return "valid";
};

export const useLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState({ otp: "" });
  const { loginByOtp } = useAuth();

  const mutation = useMutation(sendOtp);

  const handlePhoneNumber = (e) => {
    const value = e.target.value;
    if (isANumber(value)) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (otp) => setOtp({ otp });

  const onPhoneNumberSubmit = () => {
    setError(null);
    const result = validatePhoneNumber(phoneNumber);
    if (result !== "valid") {
      return setError((prev) => ({ ...prev, phoneNumber: result }));
    }
    if (result === "valid") {
      mutation.mutate(`+91${phoneNumber}`);
    }
  };

  const onOtpSubmit = async () => {
    setError(null);
    if (otp.otp.length < 6) {
      return setError((prev) => ({
        ...prev,
        otp: "OTP must be 6 digits long",
      }));
    }
    const res = await loginByOtp(`+91${phoneNumber}`, otp.otp);
    return res;
  };

  return {
    phoneNumber,
    otp: otp.otp,
    handleOtpChange,
    handlePhoneNumber,
    onPhoneNumberSubmit,
    onOtpSubmit,
    mutation,
    error,
  };
};
