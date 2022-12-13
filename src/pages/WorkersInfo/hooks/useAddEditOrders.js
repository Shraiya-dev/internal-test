import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { checkError } from '../../../utils/formikValidate'

const BACKEND_URL = getBackendUrl()

const regexPatterns = {
    phoneNumber: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    aadhar: /^[2-9]\d{11}$/,
    bankAccount: /^\d{9,18}$/,
    pan: /^[A-Z]{5}\d{4}[A-Z]$/,
    uan: /^\d{12}$/,
    isNum: /^\d*$/,
    specialChar: /^[A-Za-z ]+$/,
}

export const useAddEditOrders = () => {
    const { showSnackbar } = useSnackbar()

    const form = useFormik({
        initialValues: {
            referenceId: '',
            city: 'none',
            state: 'none',
            materialSpecs: '',
            startDateLabel: '',
            orderType: 'none',
            jobDetails: '',
            orderValue: '',
            isActive: true,
        },
        validate: (values) => {
            const errors = {}
            if (values.referenceId === '') {
                errors.referenceId = true
            }
            if (values.city === 'none') {
                errors.city = true
            }
            if (values.state === 'none') {
                errors.state = true
            }
            if (values.startDateLabel === '') {
                errors.startDateLabel = true
            }
            if (values.orderType === 'none') {
                errors.orderType = true
            }
            if (values.jobDetails === '') {
                errors.jobDetails = true
            }
            if (form.values.orderValue !== '' && !regexPatterns.phoneNumber.test(values.orderValue)) {
                errors.panNumber = true
            }
            return errors
        },
        onSubmit: async () => {
            const payload = {
                referenceId: form.values.referenceId,
                city: form.values.city,
                state: form.values.state,
                materialSpecs: form.values.materialSpecs,
                startDateLabel: form.values.startDateLabel,
                orderType: form.values.orderType,
                jobDetails: form.values.jobDetails,
                orderValue: form.values.orderValue,
                isActive: form.values.isActive,
            }
            await addWorker(payload)
        },
    })

    const addWorker = useCallback(async (payload) => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/gateway/admin-api/contractor-orders`, payload)
            showSnackbar({
                msg: 'Added Order successfully!',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [])

    const isError = useCallback(
        (key) => {
            return checkError(key, form)
        },
        [form]
    )

    return { form, isError }
}
