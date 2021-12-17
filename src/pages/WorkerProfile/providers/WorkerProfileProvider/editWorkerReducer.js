import { isANumber } from "../../../../utils";

export const editWorkerReducer = (state, action) => {
  const actions = {
    SET_WORKER_PROFILE: (payload) => ({ ...payload }),
    SET_NAME: (payload) => ({ ...state, name: payload }),
    SET_GENDER: (payload) => ({ ...state, gender: payload }),
    SET_DOB: (payload) => ({ ...state, dob: payload }),
    SET_EXPERIENCE: (payload) => ({ ...state, experience: [...payload] }),
    SET_WORKER_TYPE: (payload) => ({ ...state, workerType: payload }),
    SET_VACCINATION_STATUS: (payload) => ({
      ...state,
      vaccination: { ...state.vaccination, status: payload },
    }),
    SET_ACCOUNT_NO: (payload) => {
      if (isANumber(payload)) {
        return {
          ...state,
          bankDetails: { ...state.bankDetails, accountNo: payload },
        };
      }
      return state;
    },
    SET_IFSC: (payload) => ({
      ...state,
      bankDetails: { ...state.bankDetails, ifsc: payload },
    }),
    SET_BANK: (payload) => ({
      ...state,
      bankDetails: { ...state.bankDetails, bank: payload },
    }),
    SET_PAN: (payload) => ({
      ...state,
      doc: { ...state.doc, pan: payload },
    }),
    SET_UAN_NO: (payload) => {
      if (isANumber(payload)) {
        return {
          ...state,
          doc: { ...state.doc, uanNo: payload },
        };
      }
      return state;
    },
    SET_AADHAR: (payload) => {
      if (isANumber(payload)) {
        return {
          ...state,
          doc: { ...state.doc, aadhar: payload },
        };
      }
      return state;
    },
  };

  return actions[action.type](action.payload);
};
