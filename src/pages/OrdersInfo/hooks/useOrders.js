import { debounce } from '@mui/material'
import axios from 'axios'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SERVER_URL } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { useSearchCustomer } from '../../Customer/hooks/useSearchCustomer'
export const orderStatusOptions = [
    {
        label: 'Select Order Status',
        value: 'none',
    },
    {
        label: 'Pending',
        value: 'PENDING',
    },
    {
        label: 'Approved',
        value: 'APPROVED',
    },
    {
        label: 'Archived',
        value: 'ARCHIVED',
    },
]

export const useOrders = () => {
    const [orders, setOrders] = useState([])
    const [hasMore, setHasMore] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const { showSnackbar } = useSnackbar()
    const { form: customerSearchForm, result, resultNotFound } = useSearchCustomer()
    useEffect(() => {
        if (!result?.customer?.customerId) return
        const nsp = new URLSearchParams(searchParams)
        nsp.set('customerId', result?.customer?.customerId)
        setSearchParams(nsp)
    }, [result])

    const getOrders = useCallback(
        debounce(async (searchParams, customerSearchForm) => {
            customerSearchForm.setFieldValue('customerPhone', searchParams.get('customerNumber') ?? '')
            if (searchParams.get('customerNumber') && searchParams.get('customerNumber').length === 10) {
                customerSearchForm.handleSubmit()
            }
            if (searchParams.get('customerNumber') && searchParams.get('customerNumber').length < 10) {
                return
            }
            if (searchParams.get('customerNumber') && !searchParams.get('customerId')) {
                return
            }
            if (searchParams.get('orderId') && searchParams.get('orderId').length < 12) {
                return
            }
            setIsLoading(true)
            try {
                const sp = new URLSearchParams(searchParams)
                if (searchParams.get('pageNumber')) {
                    sp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                }
                if (searchParams.get('customerPhone')) {
                    sp.set('customerPhone', '+91' + searchParams.get('customerPhone'))
                }
                sp.set('pageSize', 20)
                const { status, data } = await axios.get(
                    `${SERVER_URL}/gateway/admin-api/contractor-orders?${sp.toString()}`
                )
                setOrders(data?.payload?.contractorOrders?.response)
                setHasMore(data?.payload?.contractorOrders?.hasMore)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
            setIsLoading(false)
        }, 500),
        []
    )
    useEffect(() => {
        if (searchParams.get('customerId') && searchParams.get('isCreatedByUser') !== 'true') {
            const nsp = new URLSearchParams(searchParams)
            nsp.set('isCreatedByUser', 'true')
            setSearchParams(nsp)
        }
        getOrders(searchParams, customerSearchForm)
    }, [searchParams])
    return useMemo(
        () => ({
            orders,
            hasMore,
            isLoading,
            getOrders,
            customerSearchForm,
        }),
        [orders, hasMore, isLoading, getOrders, customerSearchForm]
    )
}
