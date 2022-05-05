import axios from 'axios'
import {
    add,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    getUnixTime,
    sub,
} from 'date-fns'
import { differenceInYears } from 'date-fns/esm'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../api'
import { useLoader } from './LoaderProvider'
import { useSnackbar } from './SnackbarProvider'
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
    const { showSnackbar } = useSnackbar()
    const [timer, setTimer] = useState({})
    const [booking, setBooking] = useState()
    const [selectedTab, setSelectedTab] = useState()
    const handelTabChange = (e, value) => {
        setSelectedTab(value)
    }
    const { showLoader } = useLoader()
    const getBooking = useCallback(async () => {
        try {
            const { data, status } = await axios.get(`${SERVER_URL}/admin/bookings/${bookingId}`)
            if (status === 200) {
                setBooking(data.payload)
            }
        } catch (error) {
            showSnackbar({
                msg: 'Invalid booking Id',
                sev: 'error',
            })
        }
    }, [bookingId])
    useEffect(() => {
        //? note to myself Use react query to make request multiple times in future
        let interval
        let x
        setTimer({
            hours: 0,
            minutes: 0,
        })
        const lastTime = booking?.statusHistory?.filter((item) => item?.status === booking?.status)[0]?.timestamp
        const intervalFunc = (interval) => {
            const maxTime = add(new Date(lastTime), {
                hours: interval,
            })
            setTimer({
                hours: Math.floor(differenceInHours(maxTime, new Date())) ?? 0,
                minutes: Math.floor(differenceInMinutes(maxTime, new Date()) % 60) ?? 0,
            })
        }
        if (booking?.status === 'ALLOCATION_PENDING') {
            interval = setInterval(getBooking, 5000)
        } else if (booking?.status === 'ALLOCATION_IN_PROGRESS' && lastTime) {
            const interval = 72
            const maxTime = add(new Date(lastTime), {
                hours: interval,
            })
            setTimer({
                hours: Math.floor(differenceInHours(maxTime, new Date()) ?? 0),
                minutes: Math.floor(differenceInMinutes(maxTime, new Date()) % 60 ?? 0),
            })
            x = setInterval(() => {
                intervalFunc(interval)
            }, 60000)
        } else if (booking?.status === 'ALLOCATION_CLOSED' && lastTime) {
            const interval = 48
            const maxTime = add(new Date(lastTime), {
                hours: interval,
            })
            setTimer({
                hours: Math.floor(differenceInHours(maxTime, new Date()) ?? 0),
                minutes: Math.floor(differenceInMinutes(maxTime, new Date()) % 60 ?? 0),
            })
            x = setInterval(() => {
                intervalFunc(interval)
            }, 60000)
        }
        return () => {
            clearInterval(interval)
            clearInterval(x)
        }
    }, [booking])
    const cancelBooking = useCallback(async () => {
        try {
            const { status } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/cancel`)
            if (status === 200) {
                showSnackbar({
                    msg: 'Successfully Canceled booking',
                    sev: 'success',
                })
                navigate('/bookings')
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [])

    const confirmBooking = useCallback(async () => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/confirm`)

            if (status === 200) {
                showSnackbar({
                    msg: 'Successfully confirmed booking',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }

        getBooking()
        showLoader(false)
    }, [bookingId, getBooking])

    const startAllocation = useCallback(async () => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-pending`)
            if (status === 200) {
                showSnackbar({
                    msg: 'Starting Allocation For Booking',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        getBooking()

        showLoader(false)
    }, [bookingId, getBooking])
    const closeAllocation = useCallback(async () => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-closed`)
            if (status === 200) {
                showSnackbar({
                    msg: 'Closing Allocation for Booking',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        getBooking()
        showLoader(false)
    }, [bookingId, getBooking])
    const markAsRTD = useCallback(async () => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/mark-rtd`)
            if (status === 200) {
                showSnackbar({
                    msg: 'Marked Booking As Ready to Deploy',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        getBooking()
        showLoader(false)
    }, [bookingId, getBooking])
    const markAsDeployed = useCallback(async () => {
        showLoader(true)
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/deployed`)
            if (status === 200) {
                showSnackbar({
                    msg: 'Marked Booking As Deployed',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        getBooking()
        showLoader(false)
    }, [bookingId, getBooking])
    const startProject = useCallback(async () => {
        showLoader(true)
        if (!booking?.projectId || !bookingId) {
            return showSnackbar({
                msg: 'No Project Found for This booking',
            })
        }
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/project/start`, {
                projectId: booking?.projectId,
                bookingId: bookingId,
            })
            if (status === 200) {
                showSnackbar({
                    msg: 'Started Project Successfully',
                    sev: 'success',
                })
            }
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        getBooking()
        showLoader(false)
    }, [bookingId, getBooking, booking])

    useEffect(getBooking, [getBooking])
    useEffect(() => {
        if (bookingStates.includes(booking?.status)) {
            handelTabChange(undefined, 'allocation')
        } else {
            handelTabChange(undefined, 'info')
        }
    }, [booking])

    // const timer = useMemo(() => {
    // 	const lastTime = booking?.statusHistory?.filter((item) => item?.status === booking?.status)[0].timestamp
    // 	const t = add(new Date(lastTime), {
    // 		hours: 72,
    // 	})

    // 	return {
    // 		days: 0,
    // 		hours: t.getHours(),
    // 		minutes: 0,
    // 		seconds: t.getSeconds(),
    // 	}
    // }, [booking])

    const providerValue = useMemo(
        () => ({
            booking: booking,
            handelTabChange: handelTabChange,
            selectedTab: selectedTab,
            getBooking: getBooking,
            confirmBooking: confirmBooking,
            startAllocation: startAllocation,
            closeAllocation: closeAllocation,
            markAsRTD: markAsRTD,
            markAsDeployed: markAsDeployed,
            startProject: startProject,
            timer: timer,
            cancelBooking: cancelBooking,
        }),
        [
            booking,
            handelTabChange,
            selectedTab,
            getBooking,
            confirmBooking,
            startAllocation,
            closeAllocation,
            markAsRTD,
            markAsDeployed,
            startProject,
            cancelBooking,
            timer,
        ]
    )
    return <Provider value={providerValue}>{children}</Provider>
}
export const useBooking = () => useContext(BookingContext)

export { BookingProvider, Consumer as BookingConsumer, BookingContext }
