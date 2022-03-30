import { regexPatterns } from "../utils/constants/regexPatterns";

export const validatePhoneNumber = (number) => {
  if (number) {
    return regexPatterns.phoneNumber.test(number) ? true : false;
  }
  return false;
};

export const validatePinCode = (pincode) => {
  if (pincode) {
    return regexPatterns.pinCode.test(pincode) ? true : false;
  }
  return false;
};

export const validateOTP = (otp) => {
  if (otp) {
    return regexPatterns.pinCode.test(otp) ? true : false;
  }
  return false;
};

export const validateAadhar = (aadhar) => {
  if (aadhar) {
    return regexPatterns.aadhar.test(aadhar) ? true : false;
  }
  return false;
};

export const validateBankAccountNumber = (accountNumber) => {
  if (accountNumber) {
    return regexPatterns.bankAccount.test(accountNumber) ? true : false;
  }
  return false;
};

export const validatePan = (panNumber) => {
  if (panNumber) {
    return regexPatterns.pan.test(panNumber) ? true : false;
  }
  return false;
};

export const validateUan = (uanNumber) => {
  if (uanNumber) {
    return regexPatterns.uan.test(uanNumber) ? true : false;
  }
  return false;
};

export const isEmpty = (value) => {
  if (value === undefined || value === "" || value === null) {
    return true;
  }
  return false;
};

export const validateIsNum = (value) => {
  if (value) {
    return regexPatterns.isNum.test(value) ? true : false;
  }
  return false;
};
