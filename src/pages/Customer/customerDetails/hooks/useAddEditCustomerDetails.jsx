import axios from 'axios'
import { useFormik } from 'formik'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    const navigate = useNavigate()

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
        if (customerId) {
            fetchUserDetails()
        } else {
            setDisableForm(false)
        }
    }, [refresh])

    const onSubmit = useCallback(
        async (values) => {
            if (!customerId) {
                onAddCustomer(values)
                return
            }
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
   
    const goldMembershipForm = useFormik({
        initialValues: {
            amount: null,
            membershipType: 'none',
            freeTrial: false,
            validity: null
        },
        validationSchema: Yup.object({
            amount: Yup.number().min(1),
            membershipType: Yup.string().required('required').notOneOf(['none'], 'required'),
            freeTrial: Yup.boolean().required('required'),
            validity: Yup.number(),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${SERVER_URL}/gateway/admin-api/customers/add-members`, {
                    customerIds: [customerId],
                    membershipType: values.membershipType,
                    amountOfMembership: values.amount,
                    isFreeTrial: values.freeTrial,
                    validity: values.validity,
                })

                if ( response?.data?.payload?.successCount === 0 ) {
                    showSnackbar({
                        msg: response?.data?.payload?.failedCustomers[0]?.message,
                        sev: 'error',
                    })
                    
                }

                else

                {
                    showSnackbar({
                        msg: 'Customer Marked as Member',
                        sev: 'success',
                    })
                }

                setRefresh(true)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
    })
    const onAddCustomer = useCallback(async (values) => {
        if (values.phoneNumber === '' || values.name === '') return
        try {
            const payload = {
                name: values.name?.trim().length > 0 ? values.name?.trim() : undefined,
                companyName: values.companyName?.trim().length > 0 ? values.companyName?.trim() : undefined,
                phoneNumber: values.phoneNumber ? values.phoneNumber : undefined,
            }
            const { data } = await axios.post(`${SERVER_URL}/gateway/admin-api/customers/`, payload)
            if (data) {
                navigate(`/customers/${data?.payload?.customerId}`)
                showSnackbar({
                    msg: 'Customer Added Successfully',
                    sev: 'success',
                })
            }
            setRefresh(true)
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [])

    const form = useFormik({
        initialValues: {
            name: '',
            email: '',
            companyName: '',
            gstin: '',
            designation: 'none',
            phoneNumber: '',
        },
        validationSchema: Yup.object({
            gstin: Yup.string().when({
                is: !!response?.organisation,
                then: Yup.string().matches(regexPatterns.gstin, 'Invalid gstin'),
            }),
            name: Yup.string().required(),
            phoneNumber: Yup.string().required(),
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
            phoneNumber: customer?.phoneNumber ?? '',
        })


        goldMembershipForm.setValues({
            membershipType: (response?.customer?.membershipType) ?? 'none',
            freeTrial: (response?.customer?.customerMembership?.isFreeTrial) ?? 'none',
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
            onAddCustomer,
            goldMembershipForm,
        }),
        [
            response,
            refresh,
            handleFormEditCancel,
            setRefresh,
            formikProps,
            disableForm,
            form,
            onBlacklist,
            onMarkVerified,
            onAddCustomer,
            goldMembershipForm,
        ]
    )
}
