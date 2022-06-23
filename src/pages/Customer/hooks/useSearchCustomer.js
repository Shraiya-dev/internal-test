import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
export const useSearchCustomer = () => {
    const [result, setResult] = useState()
    const [resultNotFound, setResultNotFound] = useState(false)
    const { showSnackbar } = useSnackbar()
    const form = useFormik({
        initialValues: {
            customerPhone: '',
        },
        onReset: () => {
            setResult()
        },
        onSubmit: async (values) => {
            try {
                setResultNotFound(false)
                const { status, data } = await axios.get(
                    `${SERVER_URL}/gateway/admin-api/customers/?customerPhone=${values.customerPhone}`
                )
                if (status === 200) {
                    if (!(data.payload.customers.length > 0)) {
                        setResultNotFound(true)
                    }
                    setResult(data.payload.customers[0])
                }
            } catch (error) {
                showSnackbar({
                    msg: 'failed to fetch worker',
                })
            }
        },
    })
    return { result, form, resultNotFound }
}
