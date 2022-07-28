import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const BACKEND_URL = getBackendUrl()
import * as Yup from 'yup'
import { regexPatterns } from '../../Registration/utils/constants/regexPatterns'

export const usePaymentDetails = (workerId) => {
    const [paymentDetails, setPaymentDetails] = useState()
    const { showSnackbar } = useSnackbar()
    const [dialogOpen, setOpen] = useState(false)

    const getPaymentDetails = useCallback(async () => {
        try {
            const { status, data } = await axios.get(
                BACKEND_URL + '/gateway/admin-api/payment-instruments?' + new URLSearchParams({ workerId: workerId })
            )
            setPaymentDetails(data?.payload?.paymentInstruments[0])
        } catch (error) {
            // showSnackbar({ msg: error.response.data.developerInfo, sev: 'error' })
        }
    }, [workerId])
    const closeDialog = useCallback(() => {
        setOpen((open) => !open)
        getPaymentDetails()
    })
    const createPaymentDetails = useCallback(
        async (values) => {
            const payload = {
                workerId: workerId,
                type: values.type,
                details:
                    values.type === 'BANK_ACCOUNT'
                        ? {
                              name: values.name.trim(),
                              accountNumber: values.accountNumber.trim().trim(),
                              ifsc: values.ifsc.trim(),
                          }
                        : { vpa: values.vpa.trim() },
            }
            try {
                const { status, data } = await axios.post(
                    BACKEND_URL + '/gateway/admin-api/payment-instruments',
                    payload
                )
                showSnackbar({ msg: values.type + ' Added successfully', sev: 'success' })
                closeDialog()
            } catch (error) {
                showSnackbar({ msg: error.response.data.developerInfo, sev: 'error' })
            }
        },
        [workerId, closeDialog]
    )

    const form = useFormik({
        initialValues: {
            type: 'BANK_ACCOUNT',
            name: '',
            accountNumber: '',
            ifsc: '',
            vpa: '',
        },
        validationSchema: Yup.object().shape({
            type: Yup.string().required(),
            name: Yup.string().when('type', {
                is: 'BANK_ACCOUNT',
                then: Yup.string().required('required*').matches(regexPatterns.alphabetsOrSpace, 'Invalid Name'),
            }),
            accountNumber: Yup.string().when('type', {
                is: 'BANK_ACCOUNT',
                then: Yup.string().required('required*').matches(regexPatterns.bankAccount, 'Invalid Account Number'),
            }),
            ifsc: Yup.string().when('type', {
                is: 'BANK_ACCOUNT',
                then: Yup.string().required('required*').matches(regexPatterns.ifsc, 'Invalid IFSC Code'),
            }),
            vpa: Yup.string().when('type', {
                is: 'UPI',
                then: Yup.string().required('required*').matches(regexPatterns.upiVpa, 'Invalid Upi Id Code'),
            }),
        }),
        onSubmit: createPaymentDetails,
    })
    useEffect(() => {
        form.setValues({
            type: paymentDetails?.type ?? 'BANK_ACCOUNT',
            name: paymentDetails?.details?.name ?? '',
            accountNumber: paymentDetails?.details?.accountNumber ?? '',
            ifsc: paymentDetails?.details?.ifsc ?? '',
            vpa: paymentDetails?.details?.vpa ?? '',
        })
    }, [paymentDetails])

    useEffect(() => {
        if (!workerId) return
        getPaymentDetails()
    }, [workerId])
    return {
        paymentDetails,
        form,
        dialogOpen,
        closeDialog: closeDialog,
    }
}
