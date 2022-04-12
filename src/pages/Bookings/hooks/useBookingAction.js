import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
const SERVER_URL = getBackendUrl()
const useBookingAction = (booking) => {
    const bookingId = useMemo(() => booking.bookingId, [booking])
    const projectId = useMemo(() => booking.projectId, [booking])
    const [searchParams, setSearchParams] = useSearchParams()

    const [sncBar, setSncBar] = useState({})
    const refreshData = useCallback(
        (newState) => {
            const serachP = new URLSearchParams()
            serachP.set('status', newState)
            serachP.set('phoneNumber', searchParams.get('phoneNumber'))
            setSearchParams(serachP, {
                replace: true,
            })
        },
        [searchParams]
    )
    const setSnackBar = useCallback(
        (props) => {
            setSncBar({
                msg: '',
            })
            setSncBar(props)
        },
        [setSncBar]
    )

    const confirmBooking = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/confirm`)
            console.log('confirmbooking', status, data)

            if (status === 200) {
                setSnackBar({
                    msg: 'Successfully confirmed booking',
                    sev: 'success',
                })
                refreshData('CONFIRMED')
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId])

    const startAllocation = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-pending`)
            console.log('startAllocation', status, data)
            if (status === 200) {
                setSnackBar({
                    msg: 'Starting Allocation For Booking',
                    sev: 'success',
                })
                refreshData('ALLOCATION_IN_PROGRESS')
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId])
    const closeAllocation = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/allocation-closed`)
            if (status === 200) {
                setSnackBar({
                    msg: 'Closing Allocation for Booking',
                    sev: 'success',
                })
                refreshData('ALLOCATION_CLOSED')
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId])
    const markAsRTD = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/mark-rtd`)
            if (status === 200) {
                setSnackBar({
                    msg: 'Marked Booking As Ready to Deploy',
                    sev: 'success',
                })
                refreshData('READY_TO_DEPLOY')
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId])
    const markAsDeployed = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/bookings/${bookingId}/deployed`)
            if (status === 200) {
                setSnackBar({
                    msg: 'Marked Booking As Deployed',
                    sev: 'success',
                })
                refreshData('DEPLOYED')
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId])
    const startProject = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/project/start`, {
                projectId: projectId,
                bookingId: bookingId,
            })
            if (status === 200) {
                setSnackBar({
                    msg: 'Started Project Successfulyy',
                    sev: 'success',
                })
                refreshData()
            }
        } catch (error) {
            setSnackBar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [bookingId, projectId])

    return useMemo(
        () => ({
            confirmBooking: confirmBooking,
            startAllocation: startAllocation,
            sncBar: sncBar,
            closeAllocation: closeAllocation,
            markAsRTD: markAsRTD,
            markAsDeployed: markAsDeployed,
            startProject: startProject,
        }),
        [confirmBooking, startAllocation, sncBar, closeAllocation, markAsRTD, markAsDeployed, startProject]
    )
}

export default useBookingAction
