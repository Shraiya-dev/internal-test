import { SEND_OTP_API } from '../api'
import axios from 'axios'

export const sendOtp = async (phoneNumber, login = true) => {
    try {
        const ut = 'ops_admin'
        const payload = { phoneNumber, login, ut }
        return await axios.post(SEND_OTP_API, payload)
    } catch (error) {
        return { success: false, error: error.message }
    }
}
