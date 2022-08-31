import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { useSearchCustomer } from './useSearchCustomer'

const SERVER_URL = getBackendUrl()
export const useAddOrgMember = (organisation, onClose) => {
    const { form: searchForm, result, resultNotFound } = useSearchCustomer()
    const { showSnackbar } = useSnackbar()
    const onSubmit = useCallback(
        async (values, fh) => {
            try {
                const { status, data } = await axios.post(
                    `${SERVER_URL}/gateway/admin-api/organisations/${organisation.organisationId}/members`,
                    {
                        customerId: result?.customer?.customerId,
                        roles: values?.role,
                    }
                )
                showSnackbar({
                    msg: `Successfully Added contractor to the Organisation ${organisation?.companyName}`,
                })
                onClose()
                fh.resetForm()
                searchForm.handleReset()
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
        [result, organisation]
    )

    const form = useFormik({
        initialValues: {
            role: 'none',
            // designation: 'none',
        },
        validate: (values) => {
            const errors = {}
            if (values.role === 'none') {
                errors.role = true
            }
            // if (values.designation === 'none') {
            //     errors.designation = true
            // }
            return errors
        },
        onSubmit: onSubmit,
    })
    return { form, searchForm, result, resultNotFound }
}
