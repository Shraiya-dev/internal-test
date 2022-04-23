import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getBackendUrl } from '../../../api'
import { checkError } from '../../../utils/formikValidate'

const BACKEND_URL = getBackendUrl()
const parseBodyPayload = (values) => {
    return {
        name: values.name,
        state: values.state,
        city: values.city,
        phoneNumber: '+91' + values.phoneNumber,
        lp: values.lp,
        gender: values.gender,
        phoneType: values.phoneType,
        workDetails: {
            jobType: values.jobType,
            workerType: values.workerType,
            optOutOfCity: values.optOutOfCity,
            experience: values.experience,
        },
        vaccination: {
            status: values.vaccination,
        },
        kycDetails: {
            aadhar: {
                docNo: values.aadhaarNumber,
            },
            pan: {
                docNo: values.panNumber,
            },
        },
        uanNo: values.uanNo,
        bankDetails: values.bankAccount
            ? {
                  accountNumber: values.accountNumber,
                  ifscCode: values.ifscCode,
              }
            : undefined,
    }
}
const regexPatterns = {
    phoneNumber: /^[0-9]{10}$/,
    pinCode: /^[0-9]{6}$/,
    aadhar: /^[2-9]\d{11}$/,
    bankAccount: /^\d{9,18}$/,
    pan: /^[A-Z]{5}\d{4}[A-Z]$/,
    uan: /^\d{12}$/,
    isNum: /^\d*$/,
}
export const useAddEditWorkerProfile = (workerId) => {
    const [stateOptions, setStateOptions] = useState([{ label: 'Select State', value: 'none' }])
    const [cityOptions, setCityOptions] = useState([{ label: 'Select City', value: 'none' }])
    const [stateToCodeMap, setStateToCodeMap] = useState({})
    const [snackbarProps, setSnackbarProps] = useState()
    const [disableForm, setDisableForm] = useState(!!workerId)
    const showSnackbar = useCallback((props) => {
        setSnackbarProps()
        setSnackbarProps({
            ...props,
        })
    }, [])

    const [worker, setWorker] = useState()
    const getStates = useCallback(async () => {
        setStateOptions([{ label: 'Select State', value: 'none' }])
        const res = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
            headers: {
                'x-cscapi-key': 'QkQzdDlBOXBwNHhjWjczR1lKTmpEWXZSUXhaZ3hYaDN4OHNaYmtodQ==',
            },
        }).then((res) => res.json())
        const stateToCode = {}

        setStateOptions((stateOptions) => [
            ...stateOptions,
            ...res.map((stateInfo) => {
                const { iso2, name } = stateInfo
                stateToCode[name.toLowerCase()] = iso2
                return { label: name, value: name.toLowerCase() }
            }),
        ])
        setStateToCodeMap(stateToCode)
    })

    const getCities = useCallback(async (state) => {
        setCityOptions([{ label: 'Select City', value: 'none' }])
        const res = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${state}/cities`, {
            headers: {
                'x-cscapi-key': 'QkQzdDlBOXBwNHhjWjczR1lKTmpEWXZSUXhaZ3hYaDN4OHNaYmtodQ==',
            },
        }).then((res) => res.json())
        setCityOptions((cityOptions) => [
            ...cityOptions,
            ...res.map((city) => ({
                label: city.name,
                value: city.name.toLowerCase(),
            })),
        ])
    }, [])
    const fetchWorker = useCallback(async () => {
        if (workerId) {
            try {
                const response = await axios.get(`${BACKEND_URL}/admin/worker/${workerId}`)
                setWorker(response.data.payload)
            } catch (error) {
                showSnackbar({
                    msg: response.data.error,
                    sev: 'error',
                })
            }
        }
    }, [workerId])

    useEffect(fetchWorker, [workerId])
    const createWorker = useCallback(
        async (values, fh) => {
            const payload = parseBodyPayload(values)
            try {
                const { data, status } = await axios.post(`${BACKEND_URL}/admin/worker`, payload)
                showSnackbar({
                    msg: 'Worker Created!',
                    sev: 'success',
                })
                setDisableForm(true)
            } catch (error) {
                const { developerInfo } = error.response.data
                showSnackbar({
                    msg: `Worker Creation Failed!${developerInfo}`,
                    sev: 'error',
                })
            }
        },
        [parseBodyPayload]
    )
    const updateWorker = useCallback(
        async (values, formHelpers) => {
            const payload = parseBodyPayload(values)
            try {
                const { data, status } = await axios.put(`${BACKEND_URL}/admin/worker/${workerId}`, payload)
                showSnackbar({
                    msg: 'Worker Updated!',
                    sev: 'success',
                })
                setDisableForm(true)
                fetchWorker()
            } catch (error) {
                const { developerInfo } = error.response.data
                showSnackbar({
                    msg: `Worker Update Failed!${developerInfo}`,
                    sev: 'error',
                })
            }
        },
        [parseBodyPayload, workerId]
    )
    const markWorkerAsAvailable = useCallback(async () => {
        try {
            const { data, status } = await axios.put(`${BACKEND_URL}/admin/worker/${workerId}/available`)
            showSnackbar({
                msg: 'Marked Worker As available!',
                sev: 'success',
            })
            fetchWorker()
            setDisableForm(true)
        } catch (error) {
            const { developerInfo } = error.response.data
            showSnackbar({
                msg: `Marking Worker as available failed:!${developerInfo}`,
                sev: 'error',
            })
        }
    }, [workerId])

    const form = useFormik({
        initialValues: {
            name: '',
            state: 'none',
            city: 'none',
            phoneNumber: '',
            lp: 'none',
            gender: '',
            phoneType: '',
            jobType: 'none',
            workerType: '',
            optOutOfCity: false,
            experience: 'none',
            vaccination: '',
            aadhaarNumber: '',
            panNumber: '',
            uanNo: '',
            bankAccount: false,
            accountNumber: '',
            ifscCode: '',
            accHolderName: '',
        },
        validate: (values) => {
            console.log(values)
            const errors = {}
            if (values.name === '') {
                errors.name = true
            }
            if (values.state === 'none') {
                errors.state = true
            }
            if (values.city === 'none') {
                errors.city = true
            }
            if (!regexPatterns.phoneNumber.test(values.phoneNumber)) {
                errors.phoneNumber = true
            }
            if (values.lp === 'none') {
                errors.lp = true
            }
            if (values.gender === '') {
                errors.gender = true
            }
            if (values.phoneType === '') {
                errors.phoneType = true
            }
            if (values.jobType === 'none') {
                errors.jobType = true
            }
            if (values.workerType === '') {
                errors.workerType = true
            }

            if (values.experience === 'none') {
                errors.experience = true
            }
            if (values.vaccination === '') {
                errors.vaccination = true
            }
            if (form.values.aadhaarNumber !== '' && !regexPatterns.aadhar.test(values.aadhaarNumber)) {
                errors.aadhaarNumber = true
            }
            if (form.values.panNumber !== '' && !regexPatterns.pan.test(values.panNumber)) {
                errors.panNumber = true
            }
            if (form.values.uanNo !== '' && !regexPatterns.uan.test(values.uanNo)) {
                errors.uanNo = true
            }
            if (values.bankAccount) {
                if (!regexPatterns.bankAccount.test(values.accountNumber)) {
                    errors.accountNumber = true
                }
                if (values.ifscCode === '') {
                    errors.ifscCode = true
                }
                if (values.accHolderName === '') {
                    errors.accHolderName = true
                }
            }
            return errors
        },
        onSubmit: (v, fh) => {
            if (workerId) {
                updateWorker(v, fh)
            } else {
                createWorker(v, fh)
            }
        },
    })

    const isError = useCallback(
        (key) => {
            return checkError(key, form)
        },
        [form]
    )

    useEffect(() => {
        if (worker) {
            form.setValues({
                name: worker?.name ?? '',
                state: worker?.state ?? 'none',
                city: worker?.city ?? 'none',
                phoneNumber: worker?.phoneNumber?.replace('+91', '') ?? '',
                lp: worker?.lp ?? 'none',
                gender: worker?.gender ?? '',
                phoneType: worker?.phoneType ?? '',
                jobType: worker?.workDetails?.jobType ?? 'none',
                workerType: worker?.workDetails?.workerType ?? '',
                optOutOfCity: worker?.workDetails?.optOutOfCity ?? false,
                experience: worker?.workDetails?.experience ?? 'none',
                vaccination: worker?.vaccination?.status?.split(' ')?.join('_')?.toUpperCase() ?? '',
                aadhaarNumber: worker?.kycDetails?.aadhar?.docNo ?? '',
                panNumber: worker?.kycDetails?.pan?.docNo ?? '',
                uanNo: worker?.uanNo ?? '',
                bankAccount: !!worker?.bankDetails,
                accountNumber: worker?.bankDetails?.accountNumber ?? '',
                ifscCode: worker?.bankDetails?.ifsc ?? '',
                accHolderName: worker?.name ?? '',
            })
        }
    }, [worker])

    // useEffect(getStates, [])
    // useEffect(() => {
    //     if (stateToCodeMap[form.values.state]) {
    //         getCities(stateToCodeMap[form.values.state])
    //     }
    // }, [form.values.state, stateToCodeMap])

    return useMemo(
        () => ({
            form: form,
            stateOptions: stateOptions,
            cityOptions: cityOptions,
            snackbarProps: snackbarProps,
            showSnackbar: showSnackbar,
            isError: isError,
            worker: worker,
            disableForm: disableForm,
            setDisableForm: setDisableForm,
            markWorkerAsAvailable: markWorkerAsAvailable,
            fetchWorker: fetchWorker,
        }),
        [
            stateOptions,
            cityOptions,
            form,
            snackbarProps,
            worker,
            showSnackbar,
            markWorkerAsAvailable,
            isError,
            disableForm,
            fetchWorker,
            setDisableForm,
        ]
    )
}

export default useAddEditWorkerProfile
