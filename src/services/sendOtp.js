import { SEND_OTP_API } from '../api'
import axios from 'axios'

export const sendOtp = async (phoneNumber, login = true) => {
    const ut = 'ops_admin'
    const payload = { phoneNumber, login, ut }
    return await axios.post(SEND_OTP_API, payload)
}
