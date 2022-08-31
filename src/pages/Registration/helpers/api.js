import http from '../utils/http'
import axios from 'axios'
import { BACKEND_URL, GET_STATES_URL } from '../utils/constants/text'
import { setToken, removeToken } from './common'
import { getStatesOrCityConfig } from '../utils/constants/configs'

export const getOtp = async (data, callback) => {
    try {
        const response = await http.post(`${BACKEND_URL}/send-otp`, data)
        if (response.data.success) {
            callback(true, response.data.data.msg)
        } else {
            callback(false, response.data.error || 'Something wrong occured!')
        }
    } catch (error) {
        callback(false, error.data.error || 'Something went wrong')
    }
}

export const resendOtp = async (data, callback, setTimerCallback) => {
    try {
        const response = await http.post(`${BACKEND_URL}/send-otp`, data)
        if (response.data.success) {
            callback(true, response.data.data.msg)
        } else {
            callback(false, 'Something Wrong' || response.data.error)
        }
        setTimerCallback()
    } catch (error) {
        callback(false, error.data.error || 'Something went wrong')
    }
}

export const sendOtp = async (data, callback) => {
    try {
        const response = await http.post(`${BACKEND_URL}/login`, {
            userData: data,
        })
        if (response.data.success) {
            setToken('accessToken', response.data.data.accessToken)
            callback(true, 'Logged in successfully')
        } else {
            callback(false, response.data.error || 'Invalid OTP')
        }
    } catch (error) {
        callback(false, error.data.error || 'Something went wrong')
    }
}

export const registerUser = async (data, callback) => {
    console.log('inner-data', data, callback)

    axios
        .post(`${BACKEND_URL}/admin/worker`, data)
        .then((res) => {
            console.log('jk', res)
            if (res?.status === 200) {
                callback(true, 'Details Submitted Successfully')
            } else {
                callback(false, 'Something went wrong')
            }
        })
        .catch((err) => {
            callback(false, 'Something went wrong')
        })
}

export const editUserInformation = async (id, data, callback) => {
    console.log('inner-data', data, callback)

    try {
        const response = await http.put(`${BACKEND_URL}/admin/worker/${id}`, data)

        if (response.data.success) {
            callback(true, 'Details Submitted Successfully')
        } else {
            callback(false, response?.data?.error || 'Something went wrong')
        }
    } catch (error) {
        callback(false, error?.data?.error || 'Something went wrong')
        console.log('error!!', error)
    }
}

export const getJobTypes = async (callback) => {
    try {
        const response = await http.get(`${BACKEND_URL}/job-type/formatted`)
        if (response.data.success) {
            callback(response.data.data)
        }
    } catch (error) {}
}

export const getStates = async (callback) => {
    try {
        const response = await axios.get(`${GET_STATES_URL}`, getStatesOrCityConfig)
        callback(response.data, 'state')
    } catch (error) {}
}

export const getCity = async (state = 'MP', callback) => {
    try {
        const response = await axios.get(`${GET_STATES_URL}/${state}/cities`, getStatesOrCityConfig)
        callback(response.data, 'city')
    } catch (error) {}
}

export const getWorkerInfoByID = async (workerId, callback) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/admin/workers/${workerId}`)
        if (response.data.success) {
            callback(response.data.data)
        }
    } catch (error) {}
}

export const logout = () => {
    removeToken('accessToken')
}
