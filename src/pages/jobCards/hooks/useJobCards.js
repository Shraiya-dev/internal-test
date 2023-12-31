import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useBooking } from '../../../providers/BookingProvider'
import { useLoader } from '../../../providers/LoaderProvider'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
export const useJobCards = () => {
    const [reload, setReload] = useState(false)
    const [sp, setSp] = useSearchParams()
    const [bulkSelectionOn, setBulkSelectionOn] = useState(false)
    const [bulkOperationList, setBulkOperationList] = useState([])
    const { booking, getBooking } = useBooking()
    const { bookingId } = useParams()
    const { showSnackbar } = useSnackbar()
    const { showLoader } = useLoader()
    const [response, setResponse] = useState({ jobCards: [], hasMore: false })

    const fetchJobCards = useCallback(
        async (searchParams) => {
            try {
                const nsp = new URLSearchParams(searchParams)
                nsp.set('bookingId', bookingId)
                nsp.set('pageNumber', Number(nsp.get('pageNumber') ?? 1) - 1)
                nsp.set('pageSize', 50)

                if (!(nsp.get('skillType') || nsp.get('jobCardStates'))) return
                const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/job-cards?${nsp.toString()}`)
                setResponse({
                    jobCards: data.payload.jobCards,
                    hasMore: data.payload.hasMore,
                })
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
            setReload(false)
        },
        [sp, bookingId]
    )
    useEffect(() => {
        setReload(true)
    }, [sp])
    useEffect(() => {
        if (!reload) return
        getBooking()
        fetchJobCards(sp)
    }, [reload])

    const markJobCardAsAccepted = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/accept`
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker marked as RTD',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    const markWorkerJobCardAsRTD = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/rtd`
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker marked as RTD',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])

    const cancelWorkerJobCard = useCallback(async (workerCard, churnType, churnReason, other) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/cancel`,
                {
                    churnType: churnType,
                    reason: churnReason,
                    details: other,
                }
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker Cancelled ',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    useEffect(() => {
        setBulkOperationList([])
    }, [bulkSelectionOn])

    const bulkCancelWorkerJobCard = useCallback(
        async (churnType, churnReason, other) => {
            showLoader(true)

            try {
                const bulkResponse = await Promise.all(
                    bulkOperationList.map((jobCardId) => {
                        return new Promise(async (res, rej) => {
                            try {
                                const { status } = await axios.put(
                                    `${SERVER_URL}/admin/job-cards/${jobCardId}/cancel`,
                                    {
                                        churnType: churnType,
                                        reason: churnReason,
                                        details: other,
                                    }
                                )
                                res(status)
                            } catch (error) {
                                rej(error?.response?.status)
                            }
                        })
                    })
                )
                let errorString = ''
                let successCount = 0
                let FailureCount = 0

                bulkResponse.map((responseStatus, index) => {
                    if (responseStatus !== 204) {
                        errorString += bulkOperationList[index] + ', '
                        FailureCount++
                    }
                    successCount++
                })
                if (errorString.length > 0) {
                    errorString = `, Failed to Cancel ${FailureCount} job Cards with jobCard Id:` + errorString
                }

                showSnackbar({
                    msg: `Successfully Cancelled ${successCount} Workers ${errorString}`,
                    sev: 'success',
                })
                setReload(true)
            } catch (error) {
                showSnackbar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
            showLoader(false)
        },
        [bulkOperationList]
    )
    const deployWorkerJobCard = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/deployed`
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker Marked as deployed',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    const markDRCDoneForJobCard = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/drc`
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker Marked as DRC done',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    const markPDRCDoneForJobCard = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/job-cards/${workerCard.jobCard.jobCardId}/pdrc`
            )
            setReload(true)
            showSnackbar({
                msg: 'Worker Marked as PDRC DONE',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    const updateWorkerHiringStatus = useCallback(async (workerCard, status) => {
        showLoader(true)
        try {
            await axios.post(
                `${SERVER_URL}/gateway/admin-api/job-cards/${workerCard?.jobCard?.jobCardId}/job-card-status`,
                {
                    code: status,
                    details: 'Updated by Admin',
                }
            )
            setReload(true)
            showSnackbar({
                msg: `Worker Marked as ${status}`,
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])

    return useMemo(() => {
        return {
            ...response,
            reload: reload,
            showSnackbar: showSnackbar,
            markWorkerJobCardAsRTD: markWorkerJobCardAsRTD,
            cancelWorkerJobCard: cancelWorkerJobCard,
            deployWorkerJobCard: deployWorkerJobCard,
            setReload: setReload,
            markJobCardAsAccepted: markJobCardAsAccepted,
            bulkOperationList,
            setBulkSelectionOn,
            bulkSelectionOn,
            setBulkOperationList,
            bulkCancelWorkerJobCard,
            markDRCDoneForJobCard,
            markPDRCDoneForJobCard,
            updateWorkerHiringStatus,
        }
    }, [
        response,
        reload,
        setBulkSelectionOn,
        bulkSelectionOn,
        showSnackbar,
        bulkOperationList,
        setBulkOperationList,
        bulkCancelWorkerJobCard,
        markWorkerJobCardAsRTD,
        cancelWorkerJobCard,
        deployWorkerJobCard,
        markJobCardAsAccepted,
        markDRCDoneForJobCard,
        markPDRCDoneForJobCard,
        updateWorkerHiringStatus,
    ])
}
