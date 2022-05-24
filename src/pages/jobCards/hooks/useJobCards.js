import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useBooking } from '../../../providers/BookingProvider'
import { useLoader } from '../../../providers/LoaderProvider'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { CTAMap } from '../../../utils/ctaHelpers'
const SERVER_URL = getBackendUrl()
export const useJobCards = () => {
    const [reload, setReload] = useState(false)
    const [skillTypeSummary, setSkillTypeSummary] = useState()
    const [bookingSummary, setBookingSummary] = useState()
    const [sp, setSp] = useSearchParams()

    const { booking } = useBooking()
    const [selectedTab, setSelectedTab] = useState(sp.get('tab'))
    const allowedTabs = useMemo(() => CTAMap[booking?.status]?.tabs, [booking])

    const { showSnackbar } = useSnackbar()
    const { showLoader } = useLoader()
    useEffect(() => {
        if (allowedTabs) {
            setSelectedTab(sp.get('tab') ?? Object.keys(allowedTabs)[0])
        }
    }, [sp])

    const fetchJobCardsBasedOnStatus = useCallback(async () => {
        if (!selectedTab) return
        try {
            const { status, data } = await axios.get(
                `${SERVER_URL}/gateway/admin-api/bookings/${booking._id}/job-card/status/${selectedTab}?pageNumber=0&pageSize=1000`
            )
            setSkillTypeSummary(data.payload.skillTypeSummary)
            setBookingSummary(data.payload.overallSummary.bookingSummary)
            setReload(false)
        } catch (error) {
            const res = error.response
            if (res?.status === 400) {
                showSnackbar({
                    msg: res?.data.messageToUser,
                    sev: 'error',
                })
            } else {
                showSnackbar({
                    msg: 'Invalid BookingId or status',
                    sev: 'error',
                })
            }
            setSkillTypeSummary({})
        }
    }, [booking, selectedTab])

    useEffect(() => {
        if (!reload) return
        fetchJobCardsBasedOnStatus()
    }, [reload])

    const markJobCardAsAccepted = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/accept`)
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
            const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/rtd`)
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
            const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/cancel`, {
                churnType: churnType,
                reason: churnReason,
                details: other,
            })
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
    const deployWorkerJobCard = useCallback(async (workerCard) => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/deployed`)
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

    const handelTabChange = useCallback(
        (e, state) => {
            const nsp = new URLSearchParams(sp)
            nsp.set('tab', state)
            setSp(nsp)
        },
        [sp]
    )

    useEffect(() => {
        fetchJobCardsBasedOnStatus()
    }, [selectedTab])

    return useMemo(() => {
        return {
            skillTypeSummary: skillTypeSummary,
            selectedTab: selectedTab,
            showSnackbar: showSnackbar,
            bookingSummary: bookingSummary,
            handelTabChange: handelTabChange,
            markWorkerJobCardAsRTD: markWorkerJobCardAsRTD,
            cancelWorkerJobCard: cancelWorkerJobCard,
            deployWorkerJobCard: deployWorkerJobCard,
            setReload: setReload,
            markJobCardAsAccepted: markJobCardAsAccepted,
        }
    }, [
        skillTypeSummary,
        showSnackbar,
        bookingSummary,
        markWorkerJobCardAsRTD,
        cancelWorkerJobCard,
        deployWorkerJobCard,
        markJobCardAsAccepted,
    ])
}
