import { debounce } from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
export const useBookings = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [reload, setReload] = useState(false)
    const [response, setResponse] = useState({
        bookings: [],
        hasMore: false,
    })
    const { showSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(false)

    const getBookings = useCallback(
        debounce(async (searchParams) => {
            if (searchParams.get('customerPhone') && searchParams.get('customerPhone').length !== 10) return
            setIsLoading(true)
            try {
                const nsp = new URLSearchParams(searchParams)
                Number(searchParams.get('pageNumber')) > 1
                    ? nsp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                    : nsp.delete('pageNumber')
                nsp.set('pageSize', 20)
                nsp.get('customerPhone') && nsp.set('customerPhone', '+91' + nsp.get('customerPhone'))
                const { data, status } = await axios.get(`${SERVER_URL}/gateway/admin-api/bookings?${nsp.toString()}`)
                setResponse(data.payload)
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }, 500),
        []
    )
    useEffect(() => {
        if (searchParams.toString().length === 0) {
            setSearchParams({ status: 'RECEIVED' })
            return
        }
        getBookings(searchParams)
    }, [searchParams])

    return useMemo(
        () => ({
            bookings: response?.bookings ?? [],
            hasMore: response?.hasMore ?? false,
            isLoading: isLoading,
            getBookings: getBookings,
            reloadBookings: setReload,
        }),
        [response, setReload, isLoading, getBookings]
    )
}
