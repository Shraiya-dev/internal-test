import axios from 'axios'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
const SERVER_URL = getBackendUrl()

const useBookingById = () => {
	const { bookingId } = useParams()
	const navigate = useNavigate()
	const [sncBar, setSncBar] = useState({})

	const setSnckBar = useCallback(
		(props) => {
			setSncBar({
				msg: '',
			})
			setSncBar(props)
		},
		[setSncBar]
	)
	const [booking, setBooking] = useState()
	const [selectedTab, setSelectedTab] = useState('info')
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
	useEffect(getBooking, [bookingId])

	return useMemo(
		() => ({
			selectedTab: selectedTab,
			handelTabChange: handelTabChange,
			booking: booking,
		}),
		[selectedTab, handelTabChange, booking]
	)
}

export default useBookingById
