import Login from '../../pages/Login'
import Registration from '../../Registration'
import OtpVerify from '../../pages/OtpVerify'

export default Object.freeze({
    HOME: {
        name: 'Home',
        path: '/',
        element: <Login />,
        access: 'public',
    },
    LOGIN: {
        name: 'Login',
        path: '/login',
        element: <Login />,
        access: 'public',
    },
    OTP: {
        name: 'OtpVerify',
        path: '/otp-verify',
        element: <OtpVerify />,
        access: 'public',
    },
    REGISTRATION: {
        name: 'Registration',
        path: '/registration',
        element: <Registration />,
        access: 'private',
    },
})
