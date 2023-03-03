import { debounce } from '@mui/material'
import axios from 'axios'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SERVER_URL } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'

export const useOrders = () => {
    const [orders, setOrders] = useState([])
    const [hasMore, setHasMore] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const { showSnackbar } = useSnackbar()

    const getOrders = useCallback(
        debounce(async (searchParams) => {
            if (searchParams.get('customerPhone') && searchParams.get('customerPhone').length !== 10) return
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
        getOrders(searchParams)
    }, [searchParams])
    return useMemo(
        () => ({
            orders,
            hasMore,
            isLoading,
            getOrders,
        }),
        [orders, hasMore, isLoading, getOrders]
    )
}
