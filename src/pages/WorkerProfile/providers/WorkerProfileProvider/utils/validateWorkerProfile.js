import {
  isValidAadhar,
  isValidBankAccount,
  isValidPAN,
  isValidUAN,
} from "../../../../../utils";

export const validateWorkerProfile = (
  editWorkerState,
  setWorkerProfileError
) => {
  let isValid = true;

  if (!editWorkerState.name) {
    setWorkerProfileError((prev) => ({
      ...prev,
      name: "Name cannot be empty",
    }));
    isValid = false;
  }

  const accountNo = editWorkerState?.bankDetails?.accountNo;
  if (accountNo && !isValidBankAccount(accountNo)) {
    setWorkerProfileError((prev) => ({
      ...prev,
      accountNo: "Account number must be of 9 to 18 digits",
    }));
    isValid = false;
  }

  const aadhar = editWorkerState?.doc?.aadhar;
  if (aadhar && !isValidAadhar(aadhar)) {
    setWorkerProfileError((prev) => ({
      ...prev,
      aadhar: "Aadhar must be of 12 digits",
    }));
    isValid = false;
  }

  const uanNo = editWorkerState?.doc?.uanNo;
  if (uanNo && !isValidUAN(uanNo)) {
    setWorkerProfileError((prev) => ({
      ...prev,
      uanNo: "UAN must be of 12 digits",
    }));
    isValid = false;
  }

  const pan = editWorkerState?.doc?.pan;
  if (pan && !isValidPAN(pan)) {
    setWorkerProfileError((prev) => ({
      ...prev,
      pan: "Invalid PAN",
    }));
    isValid = false;
  }

  return isValid;
};
