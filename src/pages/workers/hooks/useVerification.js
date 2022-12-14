import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useState } from 'react'
import * as Yup from 'yup'
import { getBackendUrl } from '../../../api'
import { useFormikProps } from '../../../hooks/useFormikProps'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const BACKEND_URL = getBackendUrl()

export const useVerification = (uid, userType, fetchWorker, setCertificationDialogProps) => {
    const [verificationDetails, setVerificationDetails] = useState()
    const { showSnackbar } = useSnackbar()

    const updateVerification = useCallback(
        async (key, values, fh) => {
            if (key === 'VERIFICATION') {
                try {
                    const payload = {
                        verificationStatus: 'VERIFIED',
                    }
                    const { data, status } = await axios.post(
                        `${BACKEND_URL}/gateway/admin-api/workers/${uid}/verification-status`,
                        payload
                    )
                    showSnackbar({
                        msg: `Verification Status Updated`,
                        sev: 'success',
                    })
                } catch (error) {
                    const { developerInfo } = error?.response?.data
                    showSnackbar({
                        msg: `Marking Worker as available failed:!${developerInfo}`,
                        sev: 'error',
                    })
                }
            }
            if (key === 'CERTIFICATION') {
                try {
                    const payload = {
                        verificationStatus: 'CERTIFIED',
                        details: {
                            siteName: values.siteName,
                            city: values.city,
                            state: values.state,
                        },
                    }
                    const { data, status } = await axios.post(
                        `${BACKEND_URL}/gateway/admin-api/workers/${uid}/verification-status`,
                        payload
                    )
                    showSnackbar({
                        msg: `Verification Status Updated`,
                        sev: 'success',
                    })
                } catch (error) {
                    console.log(error)

                    const { developerInfo } = error.response.data
                    showSnackbar({
                        msg: `Marking Worker as available failed:!${developerInfo}`,
                        sev: 'error',
                    })
                }
            }
            fh?.resetForm()
            setCertificationDialogProps({ open: false })
            fetchWorker()
        },
        [fetchWorker, setCertificationDialogProps, uid]
    )

    const form = useFormik({
        initialValues: {
            siteName: '',
            state: 'none',
            city: 'none',
        },
        validate: (values) => {
            console.log(values)
        },
        validationSchema: Yup.object().shape({
            siteName: Yup.string().required('*required').min(3, 'Site name is Too short'),
            state: Yup.string().required('*required').not(['none'], '*required'),
            city: Yup.string().required('*required').not(['none'], '*required'),
        }),
        onSubmit: async (values, fh) => {
            await updateVerification('CERTIFICATION', values, fh)
        },
    })
    const formikProps = useFormikProps(form)
    return {
        form,
        formikProps,
        updateVerification,
    }
}
