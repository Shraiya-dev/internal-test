/* eslint-disable no-useless-computed-key */
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// MUI Imports
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import RadioGroup from '@mui/material/RadioGroup'
import FormHelperText from '@mui/material/FormHelperText'

// components
// import {
//   RadioInputField,
//   RadioInputFieldWithBorder,
// } from "../../components/RadioInput/RadioInput";

import { RadioInputField, RadioInputFieldWithBorder } from './components/RadioInput/RadioInput'

import Navbar from './components/Navbar/Navbar'
import SelectInput from './components/SelectInput/SelectInput'
// import FileInput from "./components/FileInput/FileInput";
import SuccessModal from './components/SuccessModal/SuccessModal'
import Toast from './components/Toast/Toast'
import ButtonWidget from './components/ButtonWidget/ButtonWidget'

// helpers
import {
    validatePhoneNumber,
    validateAadhar,
    validatePan,
    validateUan,
    validateBankAccountNumber,
    validateIsNum,
} from './helpers/validators'
import { checkKeys, prepareJobTypesData, modifyOptions, findIso } from './helpers'
import { prepareRegistrationData, getToken } from './helpers/common'
import { registerUser, getJobTypes, getStates, getCity, getWorkerInfoByID, editUserInformation } from './helpers/api'

// constants
import {
    yoeOptions,
    genderOptions,
    // workingDaysOptions,
    workerProfileOptions,
    phoneTypeOptions,
    yesOrNoOptions,
    // yesOrNoOtherOptions,
    yesOrNoBooleanOptions,
    vaccinatedOptions,
    languageOptions,
    // wageEarnedOptions,
} from './utils/constants/radioOptions'
import { ERROR_TEXT } from './utils/constants/text'
import { cities, states } from '../../utils/data'
import axios from 'axios'

const JobTypeOptions = [
    { label: 'Select Job Type', value: 'none' },
    { label: 'Mason', value: 'MASON' },
    { label: 'carpenter', value: 'CARPENTER' },

    { label: 'Painter', value: 'PAINTER' },
    { label: 'Bar Bender', value: 'BAR_BENDER' },
    { label: 'Shuttring Carpenter', value: 'SHUTTRING_CARPENTER' },
    { label: 'Stone Tile Marble Layer', value: 'STONE_TILE_MARBLE_LAYER' },
    { label: 'Electrical', value: 'ELECTRICAL' },
    { label: 'Welder Fitter', value: 'WELDER_FITTER' },
    { label: 'Gypsum', value: 'GYPSUM' },
    { label: 'General Helper', value: 'GENERAL_HELPER' },
    { label: 'Hvac', value: 'HVAC' },
    { label: 'Plumbing', value: 'PLUMBING' },
    { label: 'Shuttering Carpenter', value: 'SHUTTERING_CARPENTER' },
]

const useStyles = makeStyles({
    root: {
        padding: '2rem 0 0.3rem 0',
        backgroundColor: '#ebecf0',
    },
    mainHeading: {
        color: '#0d0c22',
        fontSize: '1.7rem',
        fontWeight: 900,
        margin: 0,
    },
    subHeading: {
        fontSize: '1.2rem',
        marginTop: 30,
    },
    subText: {
        color: 'rgba(0, 0, 0, 0.6)',
        margin: '0.4rem 0',
        fontSize: '0.9rem',
    },
    logoutButton: {
        position: 'fixed !important',
        right: 20,
        top: 40,
        textTransform: 'none !important',
    },
})

const boxStyles = {
    borderRadius: '1rem',
    height: 'fit-content',
    backgroundColor: '#fff',
    padding: '1.5rem 1.7rem',
    margin: '0 4rem 3.5rem 4rem',
    ['@media (max-width: 450px)']: {
        margin: '0 1rem 3.5rem 1rem',
    },
}

const InputTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} onWheel={(e) => e.target.blur()} />
))(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 600,
        '&.Mui-focused': {
            color: 'rgba(0, 0, 0, 0.7)',
        },
    },
    '& .MuiFilledInput-root': {
        border: '1px solid #e2e2e1',
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
        },
        '&.Mui-error': {
            borderColor: '#d32f2f',
        },
    },
}))

const dataInfo = {
    jobType: 'CARPENTER',
    yoe: '232',
    gender: 'MALE',
    workDays: '1233',
    openToWorkingOut: '',
    phoneType: '',
    workerProfile: '',
    lastWageEarned: '',
    formalTraining: '',
    otherFormalTraining: '',
    fullName: 'Deepak',
    phoneNumber: '',
    nativeCity: 'Barwala',
    state: 'Haryana',
    languagePreference: '',
    haveBank: '',
    useUPI: '',
    aadharCard: null,
    aadharNumber: '',
    panNumber: '',
    uanNumber: '',
    holderName: '',
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    vaccinationType: '',
    vaccinationCertificate: null,
}

const Registration = (props) => {
    const classes = useStyles()
    const navigate = useNavigate()

    const { workerId } = useParams()

    console.log('workerId', workerId)
    const [data, setData] = useState({
        jobType: '',
        yoe: '',
        gender: '',
        workDays: '',
        openToWorkingOut: '',
        phoneType: '',
        workerProfile: '',
        lastWageEarned: '',
        formalTraining: '',
        otherFormalTraining: '',
        fullName: '',
        phoneNumber: '',
        nativeCity: '',
        state: '',
        languagePreference: '',
        haveBank: '',
        useUPI: '',
        aadharCard: null,
        aadharNumber: '',
        panNumber: '',
        uanNumber: '',
        holderName: '',
        bankName: '',
        ifscCode: '',
        accountNumber: '',
        vaccinationType: '',
        vaccinationCertificate: null,
    })
    const [stateCityOptions, setStateCityOptions] = useState({
        state: [],
        city: [],
    })
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastStatus, setToastStatus] = useState('success')
    const [isLoading, setIsLoading] = useState(false)
    // const [jobTypeOptions, setJobTypeOptions] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [workerInfoById, setWorkerInfoById] = useState([])
    // TODO: Can be removed
    const [loading, setLoading] = useState(false)

    const [isEditable, setIsEditable] = useState(false)
    const [notRequiredFields, setNotRequiredFields] = useState([
        'lastWageEarned',
        'workDays',
        'aadharCard',
        'aadharNumber',
        'panNumber',
        'uanNumber',
        'vaccinationCertificate',
        'formalTraining',
        'otherFormalTraining',
        'useUPI',
    ])

    useEffect(() => {
        if (!workerId) {
            setIsEditable(true)
        }
    }, [workerId])

    const [errors, setErrors] = useState({
        jobType: '',
        yoe: '',
        workDays: '',
        gender: '',
        openToWorkingOut: '',
        phoneType: '',
        state: '',
        languagePreference: '',
        workerProfile: '',
        lastWageEarned: '',
        formalTraining: '',
        otherFormalTraining: '',
        fullName: '',
        phoneNumber: '',
        nativeCity: '',
        aadharNumber: '',
        haveBank: '',
        useUPI: '',
        vaccinationType: '',
        bankName: '',
        ifscCode: '',
        accountNumber: '',
    })

    //const redirectToHomepage = () => navigate("/");

    const resetForm = () => {
        setData({
            jobType: '',
            yoe: '',
            workDays: '',
            gender: '',
            openToWorkingOut: '',
            phoneType: '',
            workerProfile: '',
            lastWageEarned: '',
            formalTraining: '',
            otherFormalTraining: '',
            fullName: '',
            phoneNumber: '',
            nativeCity: '',
            state: '',
            languagePreference: '',
            haveBank: '',
            useUPI: '',
            aadharCard: null,
            aadharNumber: '',
            panNumber: '',
            uanNumber: '',
            holderName: '',
            bankName: '',
            ifscCode: '',
            accountNumber: '',
            vaccinationType: '',
            vaccinationCertificate: null,
        })
    }

    const setJobTypes = (response) => {
        const data = prepareJobTypesData(response)
        //setJobTypeOptions(data);
    }

    const handleModifyOptions = (data, name) => {
        console.log('State-data', data, name)
        //modifyOptions(data, name, setStateCityOptions, stateCityOptions);
    }

    useEffect(() => {
        // if (!getToken("accessToken")) {
        //   redirectToHomepage();
        // }
        // setData(dataInfo);
        //  getJobTypes(setJobTypes);
        getStates(handleModifyOptions)

        /*TODO: Need to be moved to api file*/

        if (workerId) {
            setLoading(true)
            axios.get(`https://staging-api.projecthero.in/admin/worker/${workerId}`).then((res) => {
                console.log('workerInfo', res)
                setData(res?.data?.payload)
            })
            setLoading(false)
        }
    }, [isEditable])

    console.log('--data', data)

    // useEffect(()=>{

    //   //getWorkerInfoByID(setWorkerInfoById,workerId);

    // },[workerId])

    console.log('workerInfoById', workerInfoById)

    const handleOpenToast = (message, status) => {
        setToastMessage(message)
        setToastStatus(status)
        setShowToast(true)
    }

    const handleCloseToast = () => {
        setShowToast(false)
        setToastMessage('')
    }

    const handleShowSuccessModal = () => setShowModal(true)

    const handleCloseSuccessModal = () => setShowModal(false)

    const checkForErrors = () => {
        let error = false
        for (const key in data) {
            if (key === 'phoneNumber') {
                if (!validatePhoneNumber(data[key])) {
                    setErrors((prevState) => ({
                        ...prevState,
                        [key]: ERROR_TEXT.INVALID_MOBILE_NUMBER,
                    }))
                    error = true
                }
            } else if (key === 'aadharNumber' && (!checkKeys(notRequiredFields, key) || data[key])) {
                if (!validateAadhar(data[key])) {
                    setErrors((prevState) => ({
                        ...prevState,
                        [key]: ERROR_TEXT.INVALID_AADHAR,
                    }))
                    error = true
                }
            } else if (key === 'panNumber' && (!checkKeys(notRequiredFields, key) || data[key])) {
                if (!validatePan(data[key])) {
                    setErrors((prevState) => ({
                        ...prevState,
                        [key]: ERROR_TEXT.INVALID_PAN,
                    }))
                    error = true
                }
            } else if (key === 'uanNumber' && (!checkKeys(notRequiredFields, key) || data[key])) {
                if (!validateUan(data[key])) {
                    setErrors((prevState) => ({
                        ...prevState,
                        [key]: ERROR_TEXT.INVALID_UAN,
                    }))
                    error = true
                }
            } else if (key === 'accountNumber' && (!checkKeys(notRequiredFields, key) || data[key])) {
                if (!validateBankAccountNumber(data[key])) {
                    setErrors((prevState) => ({
                        ...prevState,
                        [key]: ERROR_TEXT.INVALID_BANK_ACCOUNT,
                    }))
                    error = true
                }
            } else if (
                (data[key] === '' || data[key] === undefined || data[key] === null) &&
                !checkKeys(notRequiredFields, key)
            ) {
                setErrors((prevState) => ({
                    ...prevState,
                    [key]: ERROR_TEXT.FIELD_REQUIRED,
                }))
                error = true
            } else {
                continue
            }
        }
        return error
    }

    const handleSubmitCallback = (success, message) => {
        console.log({ message })
        setIsLoading(false)
        if (success) {
            handleShowSuccessModal()
            setTimeout(() => {
                handleCloseSuccessModal()
            }, 3000)
            resetForm()
        } else {
            handleOpenToast(message, 'error')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (checkForErrors()) {
            console.log(errors)
            handleOpenToast(ERROR_TEXT.CHECK_ERRORS, 'error')
            return
        }
        setIsLoading(true)

        //  console.log("data",data)
        if (workerId) {
            editUserInformation(workerId, prepareRegistrationData(data), handleSubmitCallback)
        } else {
            registerUser(prepareRegistrationData(data), handleSubmitCallback)
        }

        // registerUser(prepareRegistrationData(data))
    }

    const handleChange = (e, iso = '') => {
        const { name, value, type } = e.target
        if (type === 'file') {
            setData({ ...data, [name]: e.target.files[0] })
        } else {
            setData({ ...data, [name]: value })
        }
        setErrors((prevState) => ({ ...prevState, [name]: '' }))
        if (name === 'haveBank') {
            const bankDetailFields = ['bankName', 'ifscCode', 'accountNumber', 'holderName']
            let newNotRequiredFields = []
            if (value === 'YES') {
                newNotRequiredFields = notRequiredFields.filter((x) => !bankDetailFields.includes(x))
            } else {
                newNotRequiredFields = [...notRequiredFields, ...bankDetailFields]
            }
            setNotRequiredFields(newNotRequiredFields)
        }
        if (name === 'state') {
            setStateCityOptions({ ...stateCityOptions, city: [] })
            getCity(findIso(stateCityOptions.state, value), handleModifyOptions)
        }

        if (name === 'formalTraining') {
            let newNotRequiredFields = notRequiredFields
            if (value !== 'OTHER') {
                newNotRequiredFields.push('otherFormalTraining')
            } else {
                newNotRequiredFields = notRequiredFields.filter((x) => x !== 'otherFormalTraining')
            }
            setNotRequiredFields(newNotRequiredFields)
        }
    }

    const handleNumericFieldChange = (e) => {
        const value = e.target.value
        if (validateIsNum(value) || value === '') {
            handleChange(e)
        }
    }

    const checkIfBankFieldsAreRequired = () => data.haveBank === 'YES'

    // Will be used when fileupload is enabled for Aadhar & Pan card
    // const generateImgUrl = (name) => {
    //   return data[name] ? URL.createObjectURL(data[name]) : null;
    // };

    const renderPersonalInformationForm = useCallback(
        (isEditable) => (
            <Box sx={boxStyles}>
                <p className={classes.mainHeading}>Worker Information</p>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Personal Details</p>
                <Grid container spacing={3} style={{ marginTop: 0 }}>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        {console.log(isEditable)}
                        <InputTextField
                            label="Full Name"
                            onChange={handleChange}
                            name="fullName"
                            value={data?.fullName || data?.name}
                            variant="filled"
                            style={{ width: '95%' }}
                            helperText={errors.fullName ? errors.fullName : ''}
                            error={errors.fullName}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <SelectInput
                            name="state"
                            value={data.state || data?.contactDetails?.state}
                            label="Select State"
                            handleChange={handleChange}
                            options={states}
                            // options={stateCityOptions.state}
                            // disabled={stateCityOptions.state.length === 0}
                            extraStyle={{ width: '95%' }}
                            helperText={errors.state ? errors.state : ''}
                            error={errors.state}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <SelectInput
                            name="nativeCity"
                            value={data.nativeCity || data?.contactDetails?.city}
                            label="Select City"
                            handleChange={handleChange}
                            options={cities[data.state || data?.contactDetails?.state]}
                            //  options={stateCityOptions.city}
                            // disabled={data.state === "" && stateCityOptions.city.length === 0}
                            extraStyle={{ width: '95%' }}
                            helperText={errors.nativeCity ? errors.nativeCity : ''}
                            error={errors.nativeCity}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <InputTextField
                            label="Phone Number"
                            inputProps={{ maxLength: 10 }}
                            onChange={handleNumericFieldChange}
                            name="phoneNumber"
                            value={data.phoneNumber}
                            variant="filled"
                            style={{ width: '95%' }}
                            helperText={errors.phoneNumber ? errors.phoneNumber : ''}
                            error={errors.phoneNumber}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <SelectInput
                            name="languagePreference"
                            value={data.languagePreference || data?.lp}
                            label="Language Preference"
                            handleChange={handleChange}
                            options={languageOptions}
                            extraStyle={{ width: '95%' }}
                            helperText={errors.languagePreference ? errors.languagePreference : ''}
                            error={errors.languagePreference}
                            disabled={!isEditable}
                        />
                    </Grid>
                </Grid>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Gender</p>
                <RadioGroup
                    // defaultValue=""
                    aria-label="What is your gender?"
                    name="gender"
                    onChange={handleChange}
                    value={data?.gender?.toUpperCase()}
                >
                    <Grid container spacing={3} style={{ marginTop: 0 }}>
                        {genderOptions.map((option) => (
                            <Grid item key={option.value}>
                                <RadioInputField value={option.value} label={option.label} disabled={!isEditable} />
                            </Grid>
                        ))}
                    </Grid>
                    {errors.gender && (
                        <FormHelperText error={errors.gender} id="outlined-weight-helper-text">
                            {ERROR_TEXT.FIELD_REQUIRED}
                        </FormHelperText>
                    )}
                </RadioGroup>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Phone Type</p>
                <RadioGroup
                    defaultValue=""
                    aria-label="Select Phone Type"
                    name="phoneType"
                    onChange={handleChange}
                    value={data.phoneType}
                >
                    <Grid container spacing={3} style={{ marginTop: 0 }}>
                        {phoneTypeOptions.map((option) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={option.value}>
                                <RadioInputFieldWithBorder
                                    value={option.value}
                                    label={option.label}
                                    selected={data.phoneType}
                                    disabled={!isEditable}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {errors.phoneType && (
                        <FormHelperText error={errors.phoneType} id="outlined-weight-helper-text">
                            {ERROR_TEXT.FIELD_REQUIRED}
                        </FormHelperText>
                    )}
                </RadioGroup>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Open to working out of native city?</p>
                <p className={classes.subText}>
                    Is the worker okay to be placed out of the native city if a good opportunity comes
                </p>
                <RadioGroup
                    defaultValue=""
                    aria-label="Are your Open to Working out of city"
                    name="openToWorkingOut"
                    onChange={handleChange}
                    value={data.openToWorkingOut}
                >
                    <Grid container spacing={3} style={{ marginTop: 0 }}>
                        {yesOrNoBooleanOptions.map((option) => (
                            <Grid item key={option.value}>
                                <RadioInputField value={option.value} label={option.label} disabled={!isEditable} />
                            </Grid>
                        ))}
                    </Grid>
                    {errors.openToWorkingOut && (
                        <FormHelperText error={errors.openToWorkingOut} id="outlined-weight-helper-text">
                            {ERROR_TEXT.FIELD_REQUIRED}
                        </FormHelperText>
                    )}
                </RadioGroup>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Are You Vaccinated?</p>
                <RadioGroup
                    defaultValue=""
                    aria-label="Are You Vaccinated?"
                    name="vaccinationType"
                    onChange={handleChange}
                    value={data.vaccinationType}
                >
                    <Grid container spacing={3} style={{ marginTop: 0 }}>
                        {vaccinatedOptions.map((option) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={option.value}>
                                <RadioInputFieldWithBorder
                                    value={option.value}
                                    label={option.label}
                                    selected={data.vaccinationType}
                                    disabled={!isEditable}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {errors.vaccinationType && (
                        <FormHelperText error={errors.vaccinationType} id="outlined-weight-helper-text">
                            {ERROR_TEXT.FIELD_REQUIRED}
                        </FormHelperText>
                    )}
                </RadioGroup>
                <p className={`${classes.mainHeading} ${classes.subHeading}`}>Aadhar and PAN Details</p>
                <Grid container spacing={3} style={{ marginTop: 0 }}>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <InputTextField
                            label="Aadhar Number"
                            onChange={handleNumericFieldChange}
                            inputProps={{ maxLength: 12 }}
                            name="aadharNumber"
                            value={data.aadharNumber || data?.doc?.aadhar}
                            variant="filled"
                            style={{ width: '95%', marginTop: '-1rem' }}
                            helperText={errors.aadharNumber ? errors.aadharNumber : ''}
                            error={errors.aadharNumber}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <InputTextField
                            label="PAN Number"
                            onChange={handleChange}
                            inputProps={{ maxLength: 10 }}
                            name="panNumber"
                            value={data.panNumber || data?.doc?.pan}
                            variant="filled"
                            style={{ width: '95%', marginTop: '-1rem' }}
                            helperText={errors.panNumber ? errors.panNumber : ''}
                            error={errors.panNumber}
                            disabled={!isEditable}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <InputTextField
                            label="UAN Number"
                            onChange={handleNumericFieldChange}
                            inputProps={{ maxLength: 12 }}
                            name="uanNumber"
                            value={data.uanNumber || data?.doc?.uanNo}
                            variant="filled"
                            style={{ width: '95%', marginTop: '-1rem' }}
                            helperText={errors.uanNumber ? errors.uanNumber : ''}
                            error={errors.uanNumber}
                            disabled={!isEditable}
                        />
                    </Grid>
                </Grid>
                {/* <Grid container spacing={3} style={{ marginTop: 0 }}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FileInput
              heading="Upload Aadhar Card"
              name="aadharCard"
              value={data.aadharCard}
              src={generateImgUrl("aadharCard")}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FileInput
              heading="Upload Vaccination Certificate"
              name="vaccinationCertificate"
              value={data.vaccinationCertificate}
              src={generateImgUrl("vaccinationCertificate")}
              onChange={handleChange}
            />
          </Grid>
        </Grid> */}
            </Box>
        ),
        [data]
    )

    const renderJobInformationForm = (isEditable) => (
        <Box sx={boxStyles}>
            <p className={classes.mainHeading}>Job Information</p>
            <Grid container spacing={3} style={{ marginTop: 0 }}>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <SelectInput
                        name="jobType"
                        value={data.jobType || data?.jobType?.toUpperCase()}
                        label="Job Type"
                        handleChange={handleChange}
                        options={JobTypeOptions}
                        extraStyle={{ width: '95%' }}
                        helperText={errors.jobType ? errors.jobType : ''}
                        error={errors.jobType}
                        disabled={!isEditable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <SelectInput
                        value={data.yoe}
                        name="yoe"
                        label="Years of Experience"
                        handleChange={handleChange}
                        options={yoeOptions}
                        extraStyle={{ width: '95%' }}
                        helperText={errors.yoe ? errors.yoe : ''}
                        error={errors.yoe}
                        disabled={!isEditable}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <SelectInput
            value={data.workDays}
            name="workDays"
            label="How much do you work in a month?"
            handleChange={handleChange}
            options={workingDaysOptions}
            extraStyle={{ width: "95%" }}
            helperText={errors.workDays ? errors.workDays : ""}
            error={errors.workDays}
          />
        </Grid> */}
            </Grid>
            <p className={`${classes.mainHeading} ${classes.subHeading}`}>Worker Profile</p>
            <RadioGroup
                defaultValue=""
                aria-label="Select Worker Profile"
                name="workerProfile"
                onChange={handleChange}
                value={data?.workerProfile}
            >
                <Grid container spacing={3} style={{ marginTop: 0 }}>
                    {workerProfileOptions.map((option) => (
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={option.value}>
                            <RadioInputFieldWithBorder
                                value={option.value}
                                label={option.label}
                                selected={data.workerProfile}
                                disabled={!isEditable}
                            />
                        </Grid>
                    ))}
                </Grid>
                {errors.workerProfile && (
                    <FormHelperText error={errors.workerProfile} id="outlined-weight-helper-text">
                        {ERROR_TEXT.FIELD_REQUIRED}
                    </FormHelperText>
                )}
            </RadioGroup>
            {/* <p className={`${classes.mainHeading} ${classes.subHeading}`}>
        Last wage earned
      </p>
      <p className={classes.subText}>
        What is the daily wage earning expectation. Ask the worker - "aap ki
        dihadi ka rate kitna hai per din"
      </p> */}
            {/* <Grid container spacing={3} style={{ marginTop: 0 }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <SelectInput
            label="Wage Earned"
            type="number"
            name="lastWageEarned"
            value={data.lastWageEarned}
            handleChange={handleChange}
            options={wageEarnedOptions}
            extraStyle={{ width: "95%", marginTop: "-1rem" }}
            helperText={errors.lastWageEarned ? errors.lastWageEarned : ""}
            error={errors.lastWageEarned}
          />
        </Grid>
      </Grid> */}
            {/* <p className={`${classes.mainHeading} ${classes.subHeading}`}>
        Any formal training received
      </p>
      <p className={classes.subText}>
        Ask the workers - "aapne kaam kisi formal institute se sikha like ITI
        etc" mention the source in Other option if they say - "kaam kar kar ke
        aa gaya ya kisi senior ne sikha diya etc
      </p> */}
            {/* <RadioGroup
        defaultValue=""
        aria-label="Any formal training received"
        name="formalTraining"
        onChange={handleChange}
        value={data.formalTraining}
      >
        <Grid container spacing={3} style={{ marginTop: 0 }}>
          {yesOrNoOtherOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={option.value}>
              <RadioInputFieldWithBorder
                value={option.value}
                label={option.label}
                selected={data.formalTraining}
              />
            </Grid>
          ))}

          {data.formalTraining === "OTHER" && (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <InputTextField
                label="Write here"
                onChange={handleChange}
                name="otherFormalTraining"
                value={data.otherFormalTraining}
                variant="filled"
                style={{ width: "95%", marginTop: "-1rem" }}
                helperText={
                  errors.otherFormalTraining ? errors.otherFormalTraining : ""
                }
                error={errors.otherFormalTraining}
              />
            </Grid>
          )}
        </Grid> */}
            {/* {errors.formalTraining && (
          <FormHelperText
            error={errors.formalTraining}
            id="outlined-weight-helper-text"
          >
            {ERROR_TEXT.FIELD_REQUIRED}
          </FormHelperText>
        )}
      </RadioGroup> */}
        </Box>
    )

    const renderBankInformationForm = (isEditable) => (
        <Box sx={boxStyles}>
            <p className={classes.mainHeading}>Bank Information</p>
            <p className={`${classes.mainHeading} ${classes.subHeading}`}>Do they have bank account</p>
            <RadioGroup
                defaultValue=""
                aria-label="Do they have bank account"
                name="haveBank"
                onChange={handleChange}
                value={data.haveBank}
            >
                <Grid container spacing={3} style={{ marginTop: 0 }}>
                    {yesOrNoOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={option.value}>
                            <RadioInputFieldWithBorder
                                value={option.value}
                                label={option.label}
                                selected={data.haveBank}
                                disabled={!isEditable}
                            />
                        </Grid>
                    ))}
                </Grid>
                {errors.haveBank && (
                    <FormHelperText error={errors.haveBank} id="outlined-weight-helper-text">
                        {ERROR_TEXT.FIELD_REQUIRED}
                    </FormHelperText>
                )}
            </RadioGroup>

            {checkIfBankFieldsAreRequired() && (
                <>
                    {/* <p className={`${classes.mainHeading} ${classes.subHeading}`}>
            Do they use UPI payment
          </p>
          <RadioGroup
            defaultValue=""
            aria-label="Do they use UPI payment"
            name="useUPI"
            onChange={handleChange}
            value={data.useUPI}
          > */}
                    {/* <Grid container spacing={3} style={{ marginTop: 0 }}>
              {yesOrNoOptions.map((option) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  lg={3}
                  xl={3}
                  key={option.value}
                >
                  <RadioInputField value={option.value} label={option.label} />
                </Grid>
              ))}
            </Grid> */}
                    {/* {errors.useUPI && (
              <FormHelperText
                error={errors.useUPI}
                id="outlined-weight-helper-text"
              >
                {ERROR_TEXT.FIELD_REQUIRED}
              </FormHelperText>
            )}
          </RadioGroup> */}
                    <p className={`${classes.mainHeading} ${classes.subHeading}`}>Bank Information</p>
                    <Grid container spacing={3} style={{ marginTop: 0 }}>
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <InputTextField
                                label="Account Holder's Name"
                                onChange={handleChange}
                                name="holderName"
                                value={data.holderName}
                                variant="filled"
                                style={{ width: '95%', marginTop: '-1rem' }}
                                helperText={errors.holderName ? errors.holderName : ''}
                                error={errors.holderName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <InputTextField
                                label="Name of the Bank"
                                onChange={handleChange}
                                name="bankName"
                                value={data.bankName}
                                variant="filled"
                                style={{ width: '95%', marginTop: '-1rem' }}
                                helperText={errors.bankName ? errors.bankName : ''}
                                error={errors.bankName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <InputTextField
                                label="Account Number"
                                inputProps={{ maxLength: 18 }}
                                onChange={handleNumericFieldChange}
                                name="accountNumber"
                                value={data.accountNumber || data?.bankDetails?.accountNo}
                                variant="filled"
                                style={{ width: '95%', marginTop: '-1rem' }}
                                helperText={errors.accountNumber ? errors.accountNumber : ''}
                                error={errors.accountNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <InputTextField
                                label="IFSC Code"
                                onChange={handleChange}
                                name="ifscCode"
                                value={data.ifscCode || data?.bankDetails?.ifsc}
                                variant="filled"
                                style={{ width: '95%', marginTop: '-1rem' }}
                                helperText={errors.ifscCode ? errors.ifscCode : ''}
                                error={errors.ifscCode}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    )

    return (
        <>
            {/* <Navbar /> */}
            <div className={classes.root}>
                <Container maxWidth="lg" style={{ padding: 0 }} disabled={loading}>
                    {/* {workerId && (
            <div
              style={{
                width: "10%",
                float: "right",
                marginBottom: 30,
                marginRight: 160,
                marginTop: 30,
              }}
            >
              <ButtonWidget
                label={"Edit Details"}
                handleClick={() => setIsEditable((state) => !state)}
                extraStyle={{
                  width: "90%",
                  backgroundColor: "#007FFF",
                }}
                disabled={isLoading}
              />
            </div>
          )} */}
                    {isEditable === false ? (
                        <div
                            style={{
                                width: '10%',
                                float: 'right',
                                marginBottom: 30,
                                marginRight: 160,
                                marginTop: 30,
                            }}
                        >
                            <ButtonWidget
                                label={'Edit Details'}
                                handleClick={() => setIsEditable((state) => !state)}
                                extraStyle={{
                                    width: '90%',
                                    backgroundColor: '#007FFF',
                                }}
                                disabled={isLoading}
                            />
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    width: '10%',
                                    float: 'right',
                                    marginBottom: 30,
                                    marginRight: 160,
                                    marginTop: 30,
                                }}
                            >
                                <ButtonWidget
                                    label={'Submit'}
                                    extraStyle={{
                                        width: '90%',
                                        backgroundColor: 'green',
                                    }}
                                    onClick={() => {
                                        console.log(hello)
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                            <div
                                style={{
                                    width: '10%',
                                    float: 'right',
                                    marginBottom: 30,
                                    marginRight: 160,
                                    marginTop: 30,
                                }}
                            >
                                <ButtonWidget
                                    label={'Cancel'}
                                    handleClick={() => setIsEditable((state) => !state)}
                                    extraStyle={{
                                        width: '90%',
                                        backgroundColor: '#f44336',
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    )}

                    {renderPersonalInformationForm(isEditable)}
                    {renderJobInformationForm(isEditable)}
                    {renderBankInformationForm(isEditable)}
                    {/* Submit button at the bottom */}

                    {/* <div style={{ width: "100%", textAlign: "center", marginBottom: 30 }}>
            <ButtonWidget
              label={workerId ? "Submit Edited Information" : "Submit"}
              handleClick={handleSubmit}
              extraStyle={{
                width: "90%",
                backgroundColor: "#007FFF",
              }}
              disabled={workerId ? isLoading || !isEditable : isLoading}
            />
          </div> */}
                </Container>
            </div>
            <Toast open={showToast} handleClose={handleCloseToast} message={toastMessage} status={toastStatus} />
            <SuccessModal
                success
                message="Worker details submitted successfully!"
                showModal={showModal}
                closeModal={handleCloseSuccessModal}
            />
        </>
    )
}

export default Registration
