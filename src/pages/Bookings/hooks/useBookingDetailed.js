import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isError } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { bookingDurations } from '../BookingDetails'
const SERVER_URL = getBackendUrl()

export const useBookingDetailed = (bookingId) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [booking, setBooking] = useState()
    const [formDisabled, setformDisabled] = useState(true)
    const [siteImages, setSiteImages] = useState([])
    const [accomoImages, setAccomoImages] = useState([])
    useEffect(() => {
        if (searchParams.get('edit')) {
            setformDisabled(!(searchParams.get('edit') === 'true'))
        }
    }, [searchParams])

    const [sncBar, setSncBar] = useState({
        msg: '',
        sev: '',
    })
    const setSnckBar = useCallback(
        (props) => {
            setSncBar({
                msg: '',
            })
            setSncBar(props)
        },
        [setSncBar]
    )

    const form = useFormik({
        initialValues: {
            cmpName: '',
            name: '',
            email: '',
            phoneNumber: '',
            jobType: 'none',
            tags: [],
            otherJobType: '',
            siteAddress: '',
            qtyHelper: 0,
            qtyTechnician: 0,
            qtySupervisor: 0,
            startDate: new Date(),
            durationType: bookingDurations[0],
            state: 'none',
            city: 'none',
            shiftTime: 'none',
            wageHelper: '',
            wageSupervisor: '',
            wageTechnition: '',
            overTimeRate: '',
            overTimeBuffer: '',
            overTimeBufferType: '',
            holidayDays: [],
            isHolidayPaid: false,
            accomodation: false,
            travelAllowance: false,
            food: false,
            siteImages: [],
            accomodationImages: [],
        },
        validate: (values) => {
            const errors = {}
            console.log(values)
            return errors
        },
        onSubmit: async (values) => {},
    })

    const checkError = useCallback(
        (fieldName) => {
            return isError(fieldName, form)
        },
        [form, isError]
    )

    const editForm = useCallback(
        (val) => {
            navigate(`/bookings/${booking.bookingId}/detail?edit=${val}`)
        },
        [searchParams, navigate, booking]
    )

    const updateBooking = useCallback(async () => {
        const updateBookingData = {
            overTime: {
                rate: form.values.overTimeRate,
                buffer: form.values.overTimeBuffer,
                bufferType: form.values.overTimeBufferType,
            },
            earning: {
                earningMetaData: [
                    {
                        type: 'HELPER',
                        amount: form.values.wageHelper,
                    },
                    {
                        type: 'TECHNICIAN',
                        amount: form.values.wageTechnition,
                    },
                    {
                        type: 'SUPERVISOR',
                        amount: form.values.wageSupervisor,
                    },
                ],
            },
            holidayDays: form.values.holidayDays,
            isHolidayPaid: form.values.isHolidayPaid,
            images: {
                accomodations: form.values.accomodationImages,
                site: form.values.siteImages,
            },
            benefits: {
                ACCOMODATION: form.values.accomodation,
                TRAVEL_ALLOWANCE: form.values.travelAllowance,
                FOOD: form.values.food,
            },
        }

        try {
            const { status, data } = await axios.put(
                `${SERVER_URL}/admin/bookings/${booking.bookingId}`,
                updateBookingData
            )
            if (status === 200) {
                setSncBar({
                    msg: 'Booking Updated Successfully',
                    sev: 'success',
                })
            }
        } catch (error) {
            setSncBar({
                msg: 'Booking Updated Failed, Invalid Value for some or all fileds',
                sev: 'error',
            })
        }
        editForm(false)
    }, [editForm, form, booking, setSncBar])

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
    }, [bookingId, setSnckBar])

    useEffect(() => {
        if (booking) {
            form.setValues({
                jobType: booking.jobType,
                tags: [...booking.tags],
                otherJobType: booking.otherJobType,
                startDate: new Date(booking.schedule.startDate),
                shiftTime: booking.schedule.shiftTime,
                durationType: booking.schedule.bookingDuration,
                state: booking.state,
                city: booking.city,
                siteAddress: booking.siteAddress,
                qtyHelper: booking.peopleRequired.HELPER,
                qtyTechnician: booking.peopleRequired.TECHNICIAN,
                qtySupervisor: booking.peopleRequired.SUPERVISOR,
                cmpName: booking.cmpName,
                name: booking.userName,
                email: booking.email,
                phoneNumber: booking.phoneNumber,
                wageHelper: booking?.rateCard?.HELPER,
                wageSupervisor: booking?.rateCard?.SUPERVISOR,
                wageTechnition: booking?.rateCard?.TECHNICIAN,
                overTimeRate: booking.overTime?.rate,
                overTimeBuffer: booking.overTime?.buffer,
                overTimeBufferType: booking.overTime?.bufferType,
                holidayDays: booking.holidayDays ?? [],
                siteImages: booking.images?.site ?? [],
                accomodationImages: booking.images?.accomodations ?? [],
                isHolidayPaid: booking.isHolidayPaid,
                accomodation: booking.benefits?.includes('ACCOMODATION'),
                travelAllowance: booking.benefits?.includes('TRAVEL_ALLOWANCE'),
                food: booking.benefits?.includes('FOOD'),
            })
        }

        if (booking && booking.status !== 'RECEIVED') {
            editForm(false)
        }
    }, [booking, editForm])

    const uploadImages = useCallback(
        async (type) => {
            let files = []
            let fieldName = ''
            switch (type) {
                case 'site':
                    files = siteImages
                    fieldName = 'siteImages'
                    break
                case 'accomodation':
                    files = accomoImages
                    fieldName = 'accomodationImages'
                    break
            }

            const res = await Promise.all(
                files.map((img) => {
                    //uploading file
                    const formData = new FormData()
                    formData.set('file', img)
                    return axios.post(`${SERVER_URL}/admin/bookings/${booking.bookingId}/images`, formData)
                })
            )

            const uploadSuccess = res.filter(({ status }) => status === 200)

            if (uploadSuccess.length === res.length) {
                setSnckBar({
                    msg: 'All Images Uploaded Successfully!',
                    sev: 'success',
                })
            } else {
                setSnckBar({
                    msg: 'Falied to upload Some or All images',
                    sev: 'error',
                })
            }

            form.setFieldValue(fieldName, [
                ...form.values[fieldName],
                ...uploadSuccess.map(({ data }) => {
                    return data.payload.url
                }),
            ])
            switch (type) {
                case 'site':
                    setSiteImages([])
                    break
                case 'accomodation':
                    setAccomoImages([])
                    break
            }
        },
        [accomoImages, siteImages, booking, form, setSnckBar]
    )
    useEffect(() => {
        if (formDisabled) {
            getBooking()
        }
    }, [bookingId, formDisabled])

    return useMemo(
        () => ({
            booking: booking,
            updateBooking: updateBooking,
            form: form,
            formDisabled: formDisabled,
            editForm: editForm,
            checkError: checkError,
            getBooking: getBooking,
            sncBar: sncBar,
            setSncBar: setSnckBar,
            siteImages: siteImages,
            setSiteImages: setSiteImages,
            accomoImages: accomoImages,
            setAccomoImages: setAccomoImages,
            uploadImages: uploadImages,
        }),
        [
            booking,
            sncBar,
            setSnckBar,
            checkError,
            form,
            formDisabled,
            setformDisabled,
            updateBooking,
            editForm,
            getBooking,
            siteImages,
            setSiteImages,
            accomoImages,
            setAccomoImages,
            uploadImages,
        ]
    )
}
