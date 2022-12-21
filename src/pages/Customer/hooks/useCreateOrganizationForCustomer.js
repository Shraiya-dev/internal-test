import { useFormik } from 'formik'
import { getBackendUrl } from '../../../api'
import axios from 'axios'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
export const useCreateOrganizationForCustomer = (onClose) => {
    const { showSnackbar } = useSnackbar()
    const form = useFormik({
        initialValues: {
            customerId: '',
            orgName: '',
            gstin: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.customerId === '') {
                errors.customerId = 'required*'
            }
            if (values.orgName === '') {
                errors.orgName = 'required*'
            }
            if (values.gstin === '') {
                errors.gstin = 'required*'
            }
            return errors
        },
        onSubmit: async (values, fh) => {
            const payload = {
                customerId: values?.customerId,
                GSTIN: values?.gstin?.toUpperCase(),
                companyName: values?.orgName,
            }
            try {
                const res = await axios.post(`${SERVER_URL}/gateway/admin-api/organisations`, payload)
                showSnackbar({
                    sev: 'success',
                    msg: 'Organisation created successfully',
                })
                fh.resetForm()
                onClose()
            } catch (error) {
                console.log(error)
                showSnackbar({
                    sev: 'error',
                    msg: error?.response?.data?.developerInfo,
                })
            }
        },
    })
    return { form }
}
