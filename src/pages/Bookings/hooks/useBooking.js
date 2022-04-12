import axios from 'axios'
import { useFormik } from 'formik'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { setupAuthHeaders } from '../../../providers/utils/setupAuthHeaders'
import { isError } from '../../../utils/formErrorsChecker'
const SERVER_URL = getBackendUrl()
export const useBooking = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [reload, setReload] = useState(false)
    const [bookings, setBookings] = useState([])
    const [sncBar, setSncBar] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    reload
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
        if (!searchParams.get('status')) {
            const serachP = new URLSearchParams(searchParams.toString())
            serachP.set('status', 'RECEIVED')
            setSearchParams(serachP, {
                // replace: true,
            })
        }
    }, [searchParams])

    const form = useFormik({
        initialValues: {
            bookingStatus: 'none',
            customerNumber: '',
            bookingId: '',
        },
        validate: (values) => {
            const errors = {}
            return errors
        },
        onSubmit: async (values) => {
            const serachP = new URLSearchParams()
            values.customerNumber
                ? serachP.set('phoneNumber', values.customerNumber)
                : searchParams.delete('phoneNumber')
            values.bookingStatus !== 'none'
                ? serachP.set('status', values.bookingStatus)
                : searchParams.delete('status')
            values.bookingId ? serachP.set('bookingId', values.bookingId) : searchParams.delete('bookingId')

            setSearchParams(serachP, {
                replace: true,
            })
            fetchBookingForPhoneNumber(
                serachP.get('phoneNumber'),
                serachP.get('status'),
                serachP.get('bookingId')
            )
            
        },
    })
    useEffect(() => {
        if (searchParams.get('phoneNumber') || searchParams.get('status') || searchParams.get('bookingId') || reload) {
            form.setValues({
                bookingStatus: searchParams.get('status') || 'none',
                customerNumber: searchParams.get('phoneNumber') || '',
                bookingId: searchParams.get('bookingId') || '',
            })
            fetchBookingForPhoneNumber(
                searchParams.get('phoneNumber'),
                searchParams.get('status'),
                searchParams.get('bookingId')
            )
        }
    }, [searchParams, reload])

    const fetchBookingForPhoneNumber = useCallback(async (phoneNumber, bookingStatus, bookingId) => {
        setIsLoading(true)
        try {
            const serachP = new URLSearchParams()
            phoneNumber && serachP.set('phoneNumber', '+91' + phoneNumber)
            bookingStatus && serachP.set('status', bookingStatus)
            bookingId && serachP.set('bookingId', bookingId)

            const { data, status } = await axios.get(`${SERVER_URL}/admin/bookings?${serachP.toString()}`)
            setBookings(data?.payload?.response?.bookings)
        } catch (error) {
            setSnackBar({
                msg: data.error,
                sev: 'error',
            })
        }
        setIsLoading(false)
    }, [])

    const checkError = useCallback(
        (fieldName) => {
            return isError(fieldName, form)
        },
        [form, isError]
    )

    return useMemo(
        () => ({
            form: form,
            checkError: checkError,
            bookings: bookings,
            setSncBar: setSnackBar,
            sncBar: sncBar,
            isLoading: isLoading,
            reloadBookings: setReload,
        }),
        [form, checkError, bookings, setSnackBar, sncBar, setReload]
    )
}
