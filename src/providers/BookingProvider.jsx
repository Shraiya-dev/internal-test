import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../api'
const SERVER_URL = getBackendUrl()
const BookingContext = createContext()
const { Provider, Consumer } = BookingContext
const bookingStates = [
	'ALLOCATION_PENDING',
	'ALLOCATION_IN_PROGRESS',
	'ALLOCATION_CLOSED',
	'READY_TO_DEPLOY',
	'DEPLOYED',
]
const BookingProvider = ({ children }) => {
	const { bookingId } = useParams()
	const navigate = useNavigate()

	const [sncBar, setSncBar] = useState({})

	const setSnackBar = useCallback(
		(props) => {
			setSncBar({
				msg: '',
			})
			setSncBar(props)
		},
		[setSncBar]
	)
	const [booking, setBooking] = useState()
	const [selectedTab, setSelectedTab] = useState()
	const handelTabChange = (e, value) => {
		setSelectedTab(value)
	}
	const getBooking = useCallback(async () => {
		try {
			const { data, status } = await axios.get(`${SERVER_URL}/admin/bookings/${bookingId}`)
			if (status === 200) {
				setBooking(data.payload)
			}
		} catch (error) {
			setSnckBar({
				msg: 'Invalid booking Id',
				sev: 'error',
			})
		}
	}, [bookingId])
	const confirmBooking = useCallback(async () => {
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/confirm`)
			console.log('confirmbooking', status, data)

			if (status === 200) {
				setSnackBar({
					msg: 'Successfully confirmed booking',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking])

	const startAllocation = useCallback(async () => {
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-pending`)
			console.log('startAllocation', status, data)
			if (status === 200) {
				setSnackBar({
					msg: 'Starting Allocation For Booking',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking])
	const closeAllocation = useCallback(async () => {
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-closed`)
			if (status === 200) {
				setSnackBar({
					msg: 'Closing Allocation for Booking',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking])
	const markAsRTD = useCallback(async () => {
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/mark-rtd`)
			if (status === 200) {
				setSnackBar({
					msg: 'Marked Booking As Ready to Deploy',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking])
	const markAsDeployed = useCallback(async () => {
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/deployed`)
			if (status === 200) {
				setSnackBar({
					msg: 'Marked Booking As Deployed',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking])
	const startProject = useCallback(async () => {
		if (!booking?.projectId || !bookingId) {
			return setSnackBar({
				msg: 'No Project Found for This booking',
			})
		}
		try {
			const { status, data } = await axios.put(`${SERVER_URL}/admin/project/start`, {
				projectId: booking?.projectId,
				bookingId: bookingId,
			})
			if (status === 200) {
				setSnackBar({
					msg: 'Started Project Successfulyy',
					sev: 'success',
				})
			}
		} catch (error) {
			setSnackBar({
				msg: error.response.data.developerInfo,
				sev: 'error',
			})
		}
		getBooking()
	}, [bookingId, getBooking, booking])

	useEffect(getBooking, [getBooking])
	useEffect(() => {
		if (bookingStates.includes(booking?.status)) {
			handelTabChange(undefined, 'allocation')
		} else {
			handelTabChange(undefined, 'info')
		}
	}, [booking])
	const providerValue = useMemo(
		() => ({
			booking: booking,
			handelTabChange: handelTabChange,
			selectedTab: selectedTab,
			getBooking: getBooking,
			confirmBooking: confirmBooking,
			startAllocation: startAllocation,
			sncBar: sncBar,
			closeAllocation: closeAllocation,
			markAsRTD: markAsRTD,
			markAsDeployed: markAsDeployed,
			startProject: startProject,
		}),
		[
			booking,
			handelTabChange,
			selectedTab,
			getBooking,
			confirmBooking,
			startAllocation,
			sncBar,
			closeAllocation,
			markAsRTD,
			markAsDeployed,
			startProject,
		]
	)
	return <Provider value={providerValue}>{children}</Provider>
}
export const useBooking = () => useContext(BookingContext)

export { BookingProvider, Consumer as BookingConsumer, BookingContext }
