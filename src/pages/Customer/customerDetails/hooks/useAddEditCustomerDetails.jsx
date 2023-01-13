import axios from 'axios'
import { useFormik } from 'formik'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { getBackendUrl } from '../../../../api'
import { useFormikProps } from '../../../../hooks/useFormikProps'
import { useSnackbar } from '../../../../providers/SnackbarProvider'
import { regexPatterns } from '../../../Registration/utils/constants/regexPatterns'
const SERVER_URL = getBackendUrl()

export const useAddEditCustomerDetails = () => {
    const [refresh, setRefresh] = useState(true)
    const [response, setResponse] = useState()
    const [disableForm, setDisableForm] = useState(true)
    const { customerId } = useParams()
    const { showSnackbar } = useSnackbar()
    const fetchUserDetails = useCallback(async () => {
        try {
            const { data } = await axios.get(`${SERVER_URL}/gateway/admin-api/customers/${customerId}`)
            setResponse(data?.payload)
        } catch (error) {
            console.log(error)
        } finally {
            setRefresh(false)
        }
    }, [customerId])
    const handleFormEditCancel = useCallback(async (cancel) => {
        setDisableForm(cancel)
        setRefresh(cancel)
    }, [])

    useEffect(() => {
        if (!refresh) return
        fetchUserDetails()
    }, [refresh])
    const onSubmit = useCallback(
        async (values) => {
            try {
                const gstin = !response?.organisation
                    ? values.gstin?.trim().length > 0
                        ? values.gstin?.trim()
                        : undefined
                    : undefined
                const payload = {
                    name: values.name?.trim().length > 0 ? values.name?.trim() : undefined,
                    email: values.email?.trim().length > 0 ? values.email?.trim() : undefined,
                    companyName: values.companyName?.trim().length > 0 ? values.companyName?.trim() : undefined,
                    GSTIN: gstin,
                    _removeFields: gstin
                        ? undefined
                        : {
                              gstin: '',
                          },
                    doesNotHaveGstin: !gstin,
                    designation: !response?.organisation
                        ? values.designation?.trim() !== 'none'
                            ? values.designation?.trim()
                            : undefined
                        : undefined,
                }
                const { data } = await axios.put(`${SERVER_URL}/gateway/admin-api/customers/${customerId}`, payload)
                showSnackbar({
                    msg: 'Customer Updated successfully',
                    sev: 'success',
                })
                setDisableForm(true)
                setRefresh(true)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
        [response]
    )

    const onBlacklist = useCallback(
        async (values) => {
            try {
                await axios.post(`${SERVER_URL}/gateway/admin-api/customers/${customerId}/blacklist`)
                showSnackbar({
                    msg: 'Customer Blacklisted',
                    sev: 'success',
                })
                setRefresh(true)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
        [customerId]
    )

    const onMarkVerified = useCallback(async () => {
        try {
            await axios.post(`${SERVER_URL}/gateway/admin-api/customers/${customerId}/mark-as-fully-verified`)
            showSnackbar({
                msg: 'Customer Marked as Verified',
                sev: 'success',
            })
            setRefresh(true)
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [customerId])

    const form = useFormik({
        initialValues: {
            name: '',
            email: '',
            companyName: '',
            gstin: '',
            designation: 'none',
        },
        validationSchema: Yup.object({
            gstin: Yup.string().when({
                is: !!response?.organisation,
                then: Yup.string().matches(regexPatterns.gstin, 'Invalid gstin'),
            }),
        }),
        onSubmit: onSubmit,
    })
    useEffect(() => {
        if (!response) return
        const { customer } = response
        form.setValues({
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            companyName: customer?.companyName ?? '',
            gstin: customer?.GSTIN ?? '',
            designation: customer?.designation ?? 'none',
        })
    }, [response])
    const formikProps = useFormikProps(form)

    return useMemo(
        () => ({
            customer: response?.customer,
            organisation: response?.organisation,
            refresh,
            setRefresh,
            formikProps,
            form,
            handleFormEditCancel,
            disableForm,
            onBlacklist,
            onMarkVerified,
        }),
        [
            response,
            refresh,
            handleFormEditCancel,
            setRefresh,
            formikProps,
            ,
            disableForm,
            form,
            onBlacklist,
            onMarkVerified,
        ]
    )
}
