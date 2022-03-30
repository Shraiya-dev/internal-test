import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getBackendUrl } from '../../../api'
import { useBooking } from '../../../providers/BookingProvider'
import { CTAMap } from '../../../utils/ctaHelpers'
const SERVER_URL = getBackendUrl()
export const useJobCards = () => {
	const [reload, setReload] = useState(false)
	const [skillTypeSummary, setSkillTypeSummary] = useState()
	const [bookingSummary, setBookingSummary] = useState()
	const { booking } = useBooking()
	const [selectedTab, setSelectedTab] = useState()
	const [sncBar, setSncBar] = useState({})
	const allowedTabs = useMemo(() => CTAMap[booking?.status]?.tabs, [booking])

	const setSnackBar = useCallback(
		(props) => {
			setSncBar({
				msg: '',
			})
			setSncBar(props)
		},
		[setSncBar]
	)

	useEffect(() => {
		if (allowedTabs) {
			setSelectedTab(Object.keys(allowedTabs)[0])
		}
	}, [booking])

	const fetchJobCardsBasedOnStatus = useCallback(async () => {
		if (!selectedTab) return
		try {
			const { status, data } = await axios.get(
				//todo remove hardcoded page size and add proper pagination
				`${SERVER_URL}/admin/bookings/${booking.bookingId}/job-card/status/${selectedTab}?pageNumber=0&pageSize=1000`
			)
			setSkillTypeSummary(data.payload.skillTypeSummary)
			setBookingSummary(data.payload.overallSummary.bookingSummary)
		} catch (error) {
			const res = error.response
			if (res?.status === 400) {
				setSnackBar({
					msg: res?.data.messageToUser,
					sev: 'error',
				})
			} else {
				setSnackBar({
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

	const markJobCardAsAccepted = useCallback(
		async (workerCard) => {
			try {
				const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/accept`)
				fetchJobCardsBasedOnStatus()
				setSnackBar({
					msg: 'Worker marked as RTD',
					sev: 'success',
				})
			} catch (error) {
				setSnackBar({
					msg: error.response.data.developerInfo,
					sev: 'error',
				})
			}
		},
		[fetchJobCardsBasedOnStatus]
	)
	const markWorkerJobCardAsRTD = useCallback(
		async (workerCard) => {
			try {
				const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/rtd`)
				fetchJobCardsBasedOnStatus()
				setSnackBar({
					msg: 'Worker marked as RTD',
					sev: 'success',
				})
			} catch (error) {
				setSnackBar({
					msg: error.response.data.developerInfo,
					sev: 'error',
				})
			}
		},
		[fetchJobCardsBasedOnStatus]
	)

	const cancelWorkerJobCard = useCallback(
		async (workerCard) => {
			try {
				const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/cancel`, {
					//todo remove harcoded reasons
					reason: 'OTHERS',
				})
				fetchJobCardsBasedOnStatus()
				setSnackBar({
					msg: 'Worker Cancelled ',
					sev: 'success',
				})
			} catch (error) {
				setSnackBar({
					msg: error.response.data.developerInfo,
					sev: 'error',
				})
			}
		},
		[fetchJobCardsBasedOnStatus]
	)
	const deployWorkerJobCard = useCallback(
		async (workerCard) => {
			try {
				const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/${workerCard.jobCardId}/deployed`)
				fetchJobCardsBasedOnStatus()
				setSnackBar({
					msg: 'Worker Marked as deployed',
					sev: 'success',
				})
			} catch (error) {
				setSnackBar({
					msg: error.response.data.developerInfo,
					sev: 'error',
				})
			}
		},
		[fetchJobCardsBasedOnStatus]
	)

	const handelTabChange = useCallback((e, state) => {
		setSelectedTab(state)
	}, [])

	useEffect(() => {
		fetchJobCardsBasedOnStatus()
	}, [selectedTab])

	return useMemo(() => {
		return {
			skillTypeSummary: skillTypeSummary,
			sncBar: sncBar,
			selectedTab: selectedTab,
			setSnackBar: setSnackBar,
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
		sncBar,
		setSnackBar,
		bookingSummary,
		markWorkerJobCardAsRTD,
		cancelWorkerJobCard,
		deployWorkerJobCard,
		markJobCardAsAccepted,
	])
}
