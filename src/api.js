import { envs } from './env'

// export const getBackendUrl = () => {
//     return envs.SERVER_URL
// }

// !old env arch bellow
export const getBackendUrl = () => {
    if (import.meta.env.MODE === 'development' || !import.meta.env.MODE) {
        return import.meta.env.VITE_SERVER_URL_STAGING
    }
    return import.meta.env.VITE_SERVER_URL
}
const SERVER_URL = getBackendUrl()

export const GET_JOB_TYPES_API = `${SERVER_URL}/job-type/formatted`
export const SEND_OTP_API = `${SERVER_URL}/send-otp`
export const VALIDATE_OTP_API = `${SERVER_URL}/login`
export const getCustomerBookingsAPI = (phoneNumber) => `${SERVER_URL}/admin/bookings/phoneNumber/${phoneNumber}`

export const getProfilesFromStatusAPI = (bookingId, status) =>
    `${SERVER_URL}/admin/bookings/${bookingId}/hiring-details/${status}`

export const getWorkerProfileAPI = (workerId, bookingId) =>
    `${SERVER_URL}/admin/workers/${workerId}?bookingId=${bookingId}&status=home`

export const getWorkProfileAPI = (workerId, bookingId) =>
    `${SERVER_URL}/admin/workers/${workerId}?status=work&bookingId=${bookingId}`
