import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'

const SERVER_URL = getBackendUrl()
export const useEditOrgCustomer = (data, onClose) => {
    const { showSnackbar } = useSnackbar()
    const [roles, setRoles] = useState([])
    const onSubmit = useCallback(
        async (values, fh) => {
            try {
                await axios.put(
                    `${SERVER_URL}/gateway/admin-api/organisations/${data?.organisationId}/members/${data?.customerId}/membership`,
                    {
                        role: values?.role,
                        // designation: values?.designation,
                    }
                )
                showSnackbar({
                    msg: `Successfully Updated contractor`,
                    sev: 'success',
                })
                onClose()
                fh.resetForm()
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
        [data]
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
            if (values.designation === 'none') {
                errors.designation = true
            }
            return errors
        },
        onSubmit: onSubmit,
    })
    const deactivateMember = useCallback(async () => {
        try {
            await axios.put(
                `${SERVER_URL}/gateway/admin-api/organisations/${data?.organisationId}/members/${data?.customerId}/deactivate`
            )
            showSnackbar({
                msg: `Successfully Deactivated contractor`,
                sev: 'success',
            })
            onClose()
            form.handleReset()
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [data])
    const activateMember = useCallback(async () => {
        try {
            await axios.put(
                `${SERVER_URL}/gateway/admin-api/organisations/${data?.organisationId}/members/${data?.customerId}/activate`
            )
            showSnackbar({
                msg: `Successfully Activated contractor`,
                sev: 'success',
            })
            onClose()
            form.handleReset()
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [data])
    const getRoles = useCallback(async () => {
        try {
            const { data } = await axios.get(`${SERVER_URL}/gateway/metadata/customers/roles`)
            setRoles(data?.payload?.roles)
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [data])
    useEffect(() => {
        getRoles()
        form.setValues({
            // designation: data?.designation ?? 'none',
            role: data?.linkedOrganisation?.role ?? 'none',
        })
    }, [data])

    return { form, activateMember, deactivateMember, roles }
}
