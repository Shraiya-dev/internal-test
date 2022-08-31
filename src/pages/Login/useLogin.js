import { useState } from 'react'
import { useMutation } from 'react-query'
import { sendOtp } from '../../services/sendOtp'
import { isANumber } from '../../utils'
import { useAuth } from '../../providers/AuthProvider'
import { useSnackbar } from '../../providers/SnackbarProvider'

const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 0) {
        return 'Phone number is required.'
    }

    if (phoneNumber.length < 10) {
        return 'Phone number must be 10 digit long.'
    }
    return 'valid'
}

export const useLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState(null)
    const [otp, setOtp] = useState({ otp: '' })
    const { loginByOtp } = useAuth()
    const { showSnackbar } = useSnackbar()
    const [snackBarValue, setSnackBarValue] = useState(false)
    const [mut, setMut] = useState({
        isSuccess: false,
        isLoading: false,
    })
    const mutation = useMutation(sendOtp)

    const handlePhoneNumber = (e) => {
        const value = e.target.value
        if (isANumber(value)) {
            setPhoneNumber(value)
        }
    }

    const handleOtpChange = (otp) => setOtp({ otp })

    const onPhoneNumberSubmit = async () => {
        setError(null)
        const result = validatePhoneNumber(phoneNumber)
        if (result !== 'valid') {
            return setError((prev) => ({ ...prev, phoneNumber: result }))
        }
        // if (result === 'valid') {
        //     mutation.mutate(`+91${phoneNumber}`)
        // }

        setMut((prev) => ({ ...prev, isLoading: true }))

        const value = await sendOtp(`+91${phoneNumber}`)
        setMut((prev) => ({ ...prev, isLoading: false }))
        if (!value.data.success) {
            setMut((prev) => ({ ...prev, isSuccess: false }))

            showSnackbar({
                msg: 'No account found with this phone Number. Please contact admin',
                sev: 'error',
            })
            setSnackBarValue(true)
        } else {
            setMut((prev) => ({ ...prev, isSuccess: true }))
        }
    }

    const onOtpSubmit = async () => {
        setError(null)
        if (otp.otp.length < 6) {
            return setError((prev) => ({
                ...prev,
                otp: 'OTP must be 6 digits long',
            }))
        }
        setMut((prev) => ({ ...prev, isLoading: true }))
        const res = await loginByOtp(`+91${phoneNumber}`, otp.otp)
        if (!res.data.success) {
            setOtp({
                otp: '',
            })

            showSnackbar({
                msg: res.data.error,
                sev: 'error',
            })
        }
        setMut((prev) => ({ ...prev, isLoading: false }))

        return res
    }

    return {
        phoneNumber,
        otp: otp.otp,
        handleOtpChange,
        handlePhoneNumber,
        onPhoneNumberSubmit,
        onOtpSubmit,
        mutation: mut,
        error,
        snackBarValue,
    }
}
