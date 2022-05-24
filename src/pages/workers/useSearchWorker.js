import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { getBackendUrl } from '../../api'
import { isError } from '../../utils/formErrorsChecker'

const SERVER_URL = getBackendUrl()
export const useSearchWorker = () => {
    const [workers, setWorkers] = useState([])
    const [sncBar, setSncBar] = useState({
        msg: '',
        sev: '',
    })

    const setSnackBar = useCallback(
        (props) => {
            setSncBar({
                msg: '',
            })
            setSncBar(props)
        },
        [setSncBar]
    )
    const form = useFormik({
        initialValues: {
            phoneNumber: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.phoneNumber.length < 10) {
                errors.phoneNumber = 'Enter Valid Number'
            }
            return errors
        },
        onSubmit: async (values) => {
            try {
                const { status, data } = await axios.get(
                    `${SERVER_URL}/admin/workers?phoneNumber=${values.phoneNumber}`
                )
                if (status === 200) {
                    setWorkers(data.payload.response)
                }
            } catch (error) {
                setSnackBar({
                    msg: 'failed to fetch worker',
                })
            }
        },
    })
    const checkError = useCallback(
        (fieldName) => {
            return isError(fieldName, form)
        },
        [form, isError]
    )
    return useMemo(
        () => ({
            form: form,
            workers: workers,
            setSnackBar: setSnackBar,
            sncBar: sncBar,
            checkError: checkError,
            setWorkers: setWorkers,
        }),
        [form, setSnackBar, sncBar, checkError, workers, setWorkers]
    )
}
