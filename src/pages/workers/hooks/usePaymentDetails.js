import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const BACKEND_URL = getBackendUrl()

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
    const createPaymentDetails = useCallback(
        async (values) => {
            const payload = {
                workerId: workerId,
                type: values.type,
                details:
                    values.type === 'BANK_ACCOUNT'
                        ? {
                              name: values.name,
                              accountNumber: values.accountNumber,
                              ifsc: values.ifsc,
                          }
                        : { vpa: values.vpa },
            }
            try {
                const { status, data } = await axios.post(
                    BACKEND_URL + '/gateway/admin-api/payment-instruments',
                    payload
                )
                showSnackbar({ msg: values.type + ' Added successfully', sev: 'success' })
                setOpen(false)
            } catch (error) {
                showSnackbar({ msg: error.response.data.developerInfo, sev: 'error' })
            }
            getPaymentDetails()
        },
        [workerId]
    )
    const form = useFormik({
        initialValues: {
            type: 'BANK_ACCOUNT',
            name: '',
            accountNumber: '',
            ifsc: '',
            vpa: '',
        },
        validate: (values) => {
            console.log(values)
            const errors = {}
            if (values.type === 'none') {
                errors.type = 'Required('
            }
            if (values.type === 'BANK_ACCOUNT') {
                if (values.accountNumber === '') errors.accountNumber = 'Required*'
                if (values.ifsc === '') errors.ifsc = 'Required*'
                if (values.name === '') errors.name = 'Required*'
            }
            if (values.type === 'UPI') {
                if (values.vpa === '') errors.vpa = 'Required*'
            }
            return errors
        },
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
        refresh: getPaymentDetails,
        dialogOpen,
        closeDialog: () => {
            setOpen((p) => !p)
        },
    }
}
