import { useReducer, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { debounce } from '@mui/material'
import axios from 'axios'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()

export const useJobCards = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const { showSnackbar } = useSnackbar()
    const [searchParams, setSearchParams] = useSearchParams()
    const [response, setResponse] = useReducer((p, n) => ({ ...p, ...n }), {
        jobCards: [],
        hasMore: false,
    })
    const getJobCards = useCallback(
        debounce(async (searchParams) => {
            if (searchParams.get('workerPhone') && searchParams.get('workerPhone').length !== 10) return

            const nsp = new URLSearchParams(searchParams)
            if (nsp.get('createdAtEndDate')) {
                const date = new Date(nsp.get('createdAtEndDate'))
                date.setDate(date.getDate() + 1)
                console.log(date.toISOString(), date.getDate())
                nsp.set('createdAtEndDate', date.toISOString())
            }
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
                            id: item?.jobCard?.jobCardId,
                            name: item?.worker?.name,
                            phoneNumber: item?.worker?.phoneNumber,
                        })),
                    ],
                    hasMore: data.payload.hasMore,
                })
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
            setIsLoading(false)
        }, 500),
        []
    )
    const downloadJcaWithFilters = useCallback(async () => {
        if (searchParams.get('workerPhone') && searchParams.get('workerPhone').length !== 10) return
        setIsDownloading(true)
        try {
            const nsp = new URLSearchParams(searchParams)
            if (nsp.get('createdAtEndDate')) {
                const date = new Date(nsp.get('createdAtEndDate'))
                date.setDate(date.getDate() + 1)
                console.log(date.toISOString(), date.getDate())
                nsp.set('createdAtEndDate', date.toISOString())
            }
            const res = await axios.get(`${SERVER_URL}/gateway/admin-api/job-cards/download?` + nsp.toString(), {
                responseType: 'blob',
            })

            const url = window.URL.createObjectURL(res.data)
            var a = document.createElement('a')
            a.href = url
            a.download = 'Job_cards_' + new Date().toLocaleDateString() + '.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
            showSnackbar({
                msg: 'Download Complete',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        setIsDownloading(false)
    }, [searchParams, showSnackbar])
    useEffect(() => {
        getJobCards(searchParams)
    }, [searchParams])

    return {
        isLoading: isLoading,
        isDownloading: isDownloading,
        jobCards: response?.jobCards,
        hasMore: response?.hasMore,
        getJobCards: getJobCards,
        downloadJcaWithFilters: downloadJcaWithFilters,
    }
}
