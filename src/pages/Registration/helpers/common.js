import jwtDecode from "jwt-decode";

export const getToken = (name) => {
  return localStorage.getItem(name);
};

export const removeToken = (name) => {
  localStorage.removeItem(name);
};

export const setToken = (name = "token", token) => {
  localStorage.setItem(name, token);
};

export const setSessionToken = (name = "token", token) => {
  window.sessionStorage.setItem(name, token);
};

export const getSessionToken = (name) => {
  window.sessionStorage.getItem(name);
};

export const removeSessionToken = (name) => {
  window.sessionStorage.removeItem(name);
};

export const prepareRegistrationData = (data) => {
  const registrationData = {
    name: data.fullName,
    state: data.state,
    city: data.nativeCity,
    phoneNumber: `+91${data.phoneNumber}`,
    lp: data.languagePreference,
    gender: data.gender,
    phoneType: data.phoneType,
    workDetails: {
      jobType: data.jobType,
      workerType: data.workerProfile,
      lastWage: data.lastWageEarned,
      optOutOfCity: data.openToWorkingOut,
     
    },
    trainingInfo: data.formalTraining,
    experience: data.yoe,
    
    otherFormalTraining: data.otherFormalTraining,
    vaccination: {
      status: data.vaccinationType,
    },
    kycDetails: {
      aadhar: {
        docNo: String(data.aadharNumber),
      },
      pan: {
        docNo: String(data.panNumber),
      },
    },
    uanNo: String(data.uanNumber),
    formalTraining: data.formalTraining,
    workDays: data.workDays,
  };
  if (data.accountNumber) {
    registrationData.bankDetails = {
      accountNumber: String(data.accountNumber),
      ifscCode: String(data.ifscCode),
      useUPI: data.useUPI,
      accHolderName: data.holderName,
    };
  }
  return registrationData;
};

export const checkTokenValid = () => {
  let token = getToken("accessToken");
  if (token) {
    const { exp } = jwtDecode(token);
    const currentTime = Date.now();

    // to solve latency issue
    const expirationTime = exp * 1000 - 60000;
    return currentTime >= expirationTime;
  }

  return false;
};
