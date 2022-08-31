import axios from 'axios'
import { format } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { BookingDurations } from '../../../constant/booking'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { validateEmail } from '../../../utils/optionHelpers'
const SERVER_URL = getBackendUrl()

const useCreateBookings = () => {
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { customerId } = useParams()
    const form = useFormik({
        initialValues: {
            jobType: 'none',
            tags: [],
            otherJobType: '',
            qtyHelper: 0,
            qtyTechnician: 0,
            qtySupervisor: 0,
            shiftTime: 'none',
            date: new Date(),
            bookingDuration: BookingDurations[0].value,
            state: 'none',
            city: 'none',
            address: '',
            name: '',
            companyName: '',
            phoneNumber: '',
            email: '',
        },
        validate: (values) => {
            const errors = {}
            if (values.jobType === 'none') {
                errors.jobType = true
            }

            // if (values.otherJobType === '') {
            //     errors.otherJobType = true
            // }
            if (values.qtyHelper === 0 && values.qtySupervisor === 0 && values.qtyTechnician === 0) {
                errors.qtyHelper = true
                errors.qtySupervisor = true
                errors.qtyTechnician = true
            }

            if (values.shiftTime === 'none') {
                errors.shiftTime = true
            }
            if (values.state === 'none') {
                errors.state = true
            }
            if (values.city === 'none') {
                errors.city = true
            }
            if (values.address === '') {
                errors.address = true
            }
            if (values.name === '') {
                errors.name = true
            }
            if (values.companyName === '') {
                errors.companyName = true
            }
            if (values.phoneNumber.length < 10) {
                errors.phoneNumber = true
            }
            if (!validateEmail(values.email)) {
                errors.email = true
            }
            return errors
        },
        onSubmit: async (values) => {
            const payload = {
                userData: {
                    customerId: customerId,
                    jobType: values.jobType,
                    tags: values.tags,
                    cmpName: values.companyName,
                    name: values.name,
                    userName: values.name,
                    email: values.email,
                    phoneNumber: '+91' + values.phoneNumber,
                    jobType: values.jobType,
                    tags: values.tags,
                    otherJobType: values.otherJobType,
                    siteAddress: values.address,
                    numOfRequirements: {
                        supervisor: values.qtySupervisor,
                        helper: values.qtyHelper,
                        technician: values.qtyTechnician,
                    },
                    startDate: format(values.date, 'yyyy-MM-dd'),
                    durationType: values.bookingDuration,
                    state: values.state,
                    city: values.city,
                    shiftTime: values.shiftTime,
                    supCount: values?.qtySupervisor,
                    helpCount: values?.qtyHelper,
                    techCount: values?.qtyTechnician,
                },
            }
            try {
                const { data } = await axios.post(`${SERVER_URL}/admin/booking`, payload)
                if (data.success) {
                    showSnackbar({
                        msg: 'Booking created Successfully',
                        sev: 'success',
                    })
                    navigate('/bookings')
                } else {
                    showSnackbar({
                        msg: data?.error,
                        sev: 'error',
                    })
                }
            } catch (error) {
                showSnackbar({
                    msg: data?.error,
                    sev: 'error',
                })
            }
        },
    })

    const checkError = (name, form) => {
        const touched = form.touched
        const errors = form.errors
        return touched[name] && errors[name] ? errors[name] : null
    }

    const isError = useCallback(
        (fieldName) => {
            return checkError(fieldName, form)
        },
        [form]
    )

    return useMemo(
        () => ({
            form: form,
            checkError: isError,
        }),
        [form, isError]
    )
}

export default useCreateBookings
