import { useReducer, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { debounce } from '@mui/material'
import axios from 'axios'
import { getBackendUrl } from '../../../api'
const SERVER_URL = getBackendUrl()

export const useJobCards = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [response, setResponse] = useReducer((p, n) => ({ ...p, ...n }), {
        jobCards: [],
        hasMore: false,
    })
    const getJobCards = useCallback(
        debounce(async (searchParams) => {
            const nsp = new URLSearchParams(searchParams)
            Number(searchParams.get('pageNumber')) > 1
                ? nsp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                : nsp.delete('pageNumber')
            nsp.set('pageSize', 100)
            setIsLoading(true)
            try {
                const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/job-cards?${nsp.toString()}`)
                setResponse({
                    jobCards: [
                        ...data.payload.jobCards.map((item) => ({
                            ...item?.jobCard,
                            id: item.jobCard.jobCardId,
                            name: item.worker.name,
                            phoneNumber: item.worker.phoneNumber,
                        })),
                    ],
                    hasMore: data.payload.hasMore,
                })
            } catch (error) {}
            setIsLoading(false)
        }, 500),
        []
    )
    useEffect(() => {
        getJobCards(searchParams)
    }, [searchParams])

    return {
        isLoading: isLoading,
        jobCards: response?.jobCards,
        hasMore: response?.hasMore,
        getJobCards: getJobCards,
    }
}
