import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Assets
import ProjectHeroLogo from '../assets/images/projectHero_black_logo.svg'

// MUI Imports
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormHelperText from '@mui/material/FormHelperText'

// Components
import BackButtonWidget from '../components/BackButtonWidget/BackButtonWidget'
import ButtonWidget from '../components/ButtonWidget/ButtonWidget'
import Toast from '../components/Toast/Toast'
import OtpInput from '../components/OtpInput/OtpInput'

// Helpers
import { formatMobileNumber } from './helpers'
import { validateOTP } from '../helpers/validators'
import { sendOtp, resendOtp } from '../helpers/api'
import { getToken } from '../helpers/common'

// Constants
import { ERROR_TEXT } from '../utils/constants/text'

const useStyles = makeStyles({
    root: {
        margin: '0 2rem',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    imgDiv: {
        textAlign: 'center',
        marginTop: '7rem',
        backgroundColor: '#000',
        borderRadius: '20px',
    },
    imgWrapper: {
        maxHeight: '250px',
        maxWidth: '80%',
        width: 'auto',
        padding: '2.7rem 0',
    },
    mainHeading: {
        color: '#0d0c22',
        fontSize: '2rem',
        fontWeight: 900,
        marginBottom: '1.2rem',
    },
    paragraphText: {
        color: '#79797b',
        fontWeight: 500,
        marginBottom: '2.5rem',
    },
    noAccount: {
        marginTop: '3.9rem',
        textAlign: 'center',
        color: '#9c9c9d',
        '& span': {
            color: '#6967c4',
            fontWeight: 800,
            cursor: 'pointer',
        },
    },
    gridContainer: {
        justifyContent: 'center',
    },
    otpHelperText: {
        position: 'relative',
        top: -30,
    },
})

const OtpVerify = (props) => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [showComponent, setShowComponent] = useState(false)
    const location = useLocation()
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastStatus, setToastStatus] = useState('success')
    const [resendButtonDisabled, setResendButtonDisabled] = useState(false)
    const [resendButtonDisabledTimer, setResendButtonDisabledTimer] = useState(30)

    const [isLoading, setIsLoading] = useState(false)

    let myInterval

    useEffect(() => {
        if (getToken('accessToken')) {
            navigate('/registration')
        }
        setShowComponent(true)
        return () => clearInterval(myInterval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleOpenToast = (message, status) => {
        setToastMessage(message)
        setToastStatus(status)
        setShowToast(true)
    }

    const handleCloseToast = () => {
        setShowToast(false)
        setToastMessage('')
    }
    const handleOtpChange = (val) => {
        setOtp(val)
        setOtpError(false)
    }

    const prepareOtpData = () => ({
        otp: String(otp),
        phoneNumberRaw: `+91${'' || location.state.mobileNumber}`,
        ult: 'otp',
        ut: 'partner',
    })

    const prepareData = () => ({
        phoneNumber: `+91${'' || location.state.mobileNumber}`,
        login: true,
        ut: 'partner',
    })

    const mobileNumberSubmitCallback = (success, message) => {
        handleOpenToast(message, success ? 'success' : 'error')
    }

    const setTimerCallback = () => {
        setResendButtonDisabled(true)

        myInterval = setInterval(() => {
            return setResendButtonDisabledTimer((prev) => prev - 1)
        }, 1000)

        setTimeout(() => {
            setResendButtonDisabled(false)
            setResendButtonDisabledTimer(30000 / 1000)

            clearInterval(myInterval)
        }, 30000)
    }

    const resendOtpClick = () => {
        resendOtp(prepareData(), mobileNumberSubmitCallback, setTimerCallback)
    }

    const otpSubmitCallback = (success, message) => {
        setIsLoading(false)
        if (success) {
            navigate('/registration', {
                state: { showToast: true, toastMessage: message },
            })
        } else {
            handleOpenToast(message, 'error')
        }
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault()
        if (!validateOTP(otp)) {
            setOtpError(true)
            return
        }
        setIsLoading(true)
        sendOtp(prepareOtpData(), otpSubmitCallback)
    }

    return showComponent ? (
        <>
            <div className={classes.root}>
                <BackButtonWidget />
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} className={classes.gridContainer}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <div className={classes.imgDiv}>
                                <img src={ProjectHeroLogo} alt="mailbox" className={classes.imgWrapper} />
                            </div>
                            <div>
                                <p className={classes.mainHeading}>OTP Verification</p>
                                <p className={classes.paragraphText}>
                                    Enter the OTP sent to{' '}
                                    {formatMobileNumber(String('' || (location.state && location.state.mobileNumber)))}
                                </p>
                            </div>
                            <>
                                <OtpInput
                                    value={otp}
                                    onChange={handleOtpChange}
                                    numInputs={6}
                                    isInputNum
                                    shouldAutoFocus
                                />
                                {otpError && (
                                    <FormHelperText
                                        error={otpError}
                                        id="outlined-weight-helper-text"
                                        className={classes.otpHelperText}
                                    >
                                        {ERROR_TEXT.INVALID_OTP}
                                    </FormHelperText>
                                )}
                                <ButtonWidget
                                    label="Submit"
                                    handleClick={handleOtpSubmit}
                                    extraStyle={{ width: '100%' }}
                                    disabled={isLoading}
                                />
                            </>
                            <div>
                                <p className={classes.noAccount}>
                                    Didn't receive the OTP?{' '}
                                    <span
                                        onClick={resendOtpClick}
                                        style={{
                                            pointerEvents: resendButtonDisabled ? 'none' : 'auto',
                                            opacity: resendButtonDisabled ? 0.6 : 1,
                                        }}
                                    >
                                        Resend{' '}
                                        {resendButtonDisabled &&
                                            resendButtonDisabledTimer &&
                                            `in ${resendButtonDisabledTimer}s`}
                                    </span>
                                </p>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <Toast open={showToast} handleClose={handleCloseToast} message={toastMessage} status={toastStatus} />
        </>
    ) : null
}

export default OtpVerify
