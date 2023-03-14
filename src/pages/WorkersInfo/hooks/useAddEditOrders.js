import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { ORDERS_INFO_ROUTE } from '../../../routes'
import { checkError } from '../../../utils/formikValidate'
import { useOrders } from '../../OrdersInfo/hooks/useOrders'

const BACKEND_URL = getBackendUrl()

export const useAddEditOrders = () => {
    const { showSnackbar } = useSnackbar()
    const { orderId } = useParams()
    const { orders, getOrders } = useOrders()
    const [disableForm, setDisableForm] = useState(orderId)

    const navigate = useNavigate()
    const orderDetail = useMemo(() => orders.find((item) => item.orderId === orderId), [orders])
    const form = useFormik({
        initialValues: {
            referenceId: '',
            city: 'none',
            state: 'none',
            materialSpecs: '',
            startDateLabel: '',
            orderType: 'none',
            jobDetails: '',
            orderValue: '',
            isActive: true,
            orderStatus: 'PENDING',
        },
        validate: (values) => {
            const errors = {}

            if (values.city === 'none') {
                errors.city = true
            }
            if (values.state === 'none') {
                errors.state = true
            }
            if (values.startDateLabel === '') {
                errors.startDateLabel = true
            }
            if (values.orderType === 'none') {
                errors.orderType = true
            }
            if (values.jobDetails === '') {
                errors.jobDetails = true
            }
            if (form.values.orderValue === '' || Number.isNaN(form.values.orderValue)) {
                errors.orderValue = true
            }
            return errors
        },
        onSubmit: async (values) => {
            const payload = {
                referenceId: values.referenceId,
                city: values.city,
                state: values.state,
                materialSpecs: values.materialSpecs,
                startDateLabel: values.startDateLabel,
                orderType: values.orderType,
                jobDetails: values.jobDetails,
                orderValue: values.orderValue,
                isActive: values.isActive,
                orderStatus: values.orderStatus,
            }
            if (orderId) {
                await editOrder(payload)
                return
            }
            await addOrder(payload)
        },
    })

    useEffect(() => {
        if (!orderDetail) return
        form.setValues({
            city: orderDetail?.city,
            state: orderDetail?.state,
            isActive: orderDetail?.isActive,
            jobDetails: orderDetail?.jobDetails,
            materialSpecs: orderDetail?.materialSpecs,
            orderType: orderDetail?.orderType,
            orderValue: orderDetail?.orderValue,
            referenceId: orderDetail?.referenceId,
            startDateLabel: orderDetail?.startDateLabel,
            orderStatus: orderDetail?.orderStatus ?? 'PENDING',
        })
    }, [orderDetail, disableForm])
    const editOrder = useCallback(async (payload) => {
        try {
            debugger
            const { status, data } = await axios.put(
                `${BACKEND_URL}/gateway/admin-api/contractor-orders/${orderId}/update`,
                payload
            )

            showSnackbar({
                msg: 'Updated Order successfully!',
                sev: 'success',
            })
            getOrders()
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [])
    const addOrder = useCallback(async (payload) => {
        try {
            const { status, data } = await axios.post(`${BACKEND_URL}/gateway/admin-api/contractor-orders`, payload)

            showSnackbar({
                msg: 'Added Order successfully!',
                sev: 'success',
            })
            navigate(ORDERS_INFO_ROUTE)
        } catch (error) {
            console.log(error)

            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [])

    const isError = useCallback(
        (key) => {
            return checkError(key, form)
        },
        [form]
    )

    return { form, isError, disableForm, setDisableForm, orderDetail, orders }
}
