// const SERVER_URL = "https://projecthero-backend.herokuapp.com";
// const SERVER_URL = "https://projecthero-backend-staging.herokuapp.com";
const SERVER_URL = "https://staging-api.projecthero.in";

export const GET_JOB_TYPES_API = `${SERVER_URL}/job-type/formatted`;
export const SEND_OTP_API = `${SERVER_URL}/send-otp`;
export const VALIDATE_OTP_API = `${SERVER_URL}/login`;
export const getCustomerBookingsAPI = (phoneNumber) =>
  `${SERVER_URL}/admin/bookings/phoneNumber/${phoneNumber}`;

export const getProfilesFromStatusAPI = (bookingId, status) =>
  `${SERVER_URL}/admin/bookings/${bookingId}/hiring-details/${status}`;

export const getWorkerProfileAPI = (workerId, bookingId) =>
  `${SERVER_URL}/admin/workers/${workerId}?bookingId=${bookingId}&status=home`;

export const getWorkProfileAPI = (workerId, bookingId) =>
  `${SERVER_URL}/admin/workers/${workerId}?status=work&bookingId=${bookingId}`;
