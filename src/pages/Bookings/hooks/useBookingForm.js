import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useBooking } from '../../../providers/BookingProvider'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { checkError } from '../../../utils/formikValidate'
import { bookingDurations } from '../BookingDetails'
const SERVER_URL = getBackendUrl()
export const useBookingForm = () => {
    const { bookingId } = useParams()
    const { getBooking, booking } = useBooking()

    const [formDisabled, setformDisabled] = useState(true)
    const [siteImages, setSiteImages] = useState([])
    const [accomoImages, setAccomoImages] = useState([])

    const { showSnackbar } = useSnackbar()
    const [isUploadingImages, setIsUploadingImages] = useState({
        site: false,
        accomodation: false,
    })
    const editForm = useCallback((val) => {
        setformDisabled(!val)
    }, [])

    const updateBooking = useCallback(
        async (values) => {
            const updateBookingData = {
                city: values.city,
                state: values.state,
                cmpName: values.cmpName,
                email: values.email,
                name: values.name,
                phoneNumber: values.phoneNumber,
                siteAddress: values.siteAddress,
                userName: values.name,
                schedule: {
                    bookingDuration: values.durationType,
                    startDate: values.startDate,
                    shiftTime: values.shiftTime,
                    shiftStartTime: values.shiftStartTime,
                    shiftEndTime: values.shiftEndTime,
                },
                peopleRequired: {
                    SUPERVISOR: Number(values.qtySupervisor),
                    HELPER: Number(values.qtyHelper),
                    TECHNICIAN: Number(values.qtyTechnician),
                },
                overTime: {
                    rate: values.overTimeRate,
                    buffer: values.overTimeBuffer,
                    bufferType: values.overTimeBufferType,
                },
                earning: {
                    earningMetaData: [
                        {
                            type: 'HELPER',
                            amount: values.wageHelper,
                        },
                        {
                            type: 'TECHNICIAN',
                            amount: values.wageTechnition,
                        },
                        {
                            type: 'SUPERVISOR',
                            amount: values.wageSupervisor,
                        },
                    ],
                },
                holidayDays: values.holidayDays,
                isHolidayPaid: values.isHolidayPaid,
                images: {
                    accommodations: values.accomodationImages,
                    site: values.siteImages,
                },
                benefits: {
                    ACCOMODATION: values.accomodation,
                    PAID_TRAVEL: values.travelAllowance,
                    FOOD: values.food,
                    PF: values.pf,
                    INSURANCE: values.esi,
                },
            }

            try {
                const { status, data } = await axios.put(
                    `${SERVER_URL}/admin/bookings/${booking?.bookingId}`,
                    updateBookingData
                )
                if (status === 200) {
                    showSnackbar({
                        msg: 'Booking Updated Successfully',
                        sev: 'success',
                    })
                    editForm(false)
                }
            } catch (error) {
                showSnackbar({
                    msg: 'Booking Updated Failed, Invalid Value for some or all fields',
                    sev: 'error',
                })
            }
            getBooking()
        },
        [booking, getBooking, showSnackbar]
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
            shiftStartTime: 'none',
            shiftEndTime: 'none',
            wageHelper: '',
            wageSupervisor: '',
            wageTechnition: '',
            overTimeRate: 'none',
            overTimeBuffer: 30,
            pf: false,
            esi: false,
            overTimeBufferType: 'minutes',
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

            if (values.cmpName === '') {
                errors.cmpName = true
            }
            if (values.name === '') {
                errors.name = true
            }
            if (values.email === '' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = true
            }
            if (values.phoneNumber === '' || values.phoneNumber.length < 10) {
                errors.phoneNumber = true
            }

            if (values.siteAddress === '') {
                errors.siteAddress = true
            }
            if (values.state === 'none') {
                errors.state = true
            }
            if (values.city === 'none') {
                errors.city = true
            }

            if (Number(values.qtyHelper) !== 0 && values.wageHelper === '') {
                errors.wageHelper = true
            }

            if (values.qtyHelper == 0 && values.qtySupervisor == 0 && values.qtyTechnician == 0) {
                errors.qtyHelper = true
                errors.qtySupervisor = true
                errors.qtyTechnician = true
            }

            // if qtyHelper is not 0 that time wages can't be 0
            if (Number(values.qtyHelper !== 0 && Number(values.wageHelper) === 0)) {
                errors.wageHelper = true
            }

            if (Number(values.qtySupervisor) !== 0 && values.wageSupervisor === '') {
                errors.wageSupervisor = true
            }
            // if qtySupervisor is not 0 that time wages can't be 0
            if (Number(values.qtySupervisor !== 0 && Number(values.wageSupervisor) === 0)) {
                errors.wageSupervisor = true
            }

            if (Number(values.qtyTechnician) !== 0 && values.wageTechnition === '') {
                errors.wageTechnition = true
            }

            //if qtyTechnician is not 0 that time wages can't be 0
            if (Number(values.qtyTechnician !== 0 && Number(values.wageTechnition) === 0)) {
                errors.wageTechnition = true
            }

            if (values.overTimeRate === 'none') {
                errors.overTimeRate = true
            }
            // if (values.overTimeBuffer === '') {
            //     errors.overTimeBuffer = true
            // }
            if (values.overTimeBufferType === '') {
                errors.overTimeBufferType = true
            }
            if (values.overTimeRate === 'none') {
                errors.overTimeRate = true
            }
            return errors
        },
        onSubmit: updateBooking,
    })

    const isError = useCallback(
        (fieldName) => {
            getBooking
            return checkError(fieldName, form)
        },
        [form]
    )

    useEffect(() => {
        if (booking) {
            form.setValues({
                jobType: booking?.jobType ?? '',
                tags: [...booking?.tags] ?? '',
                otherJobType: booking?.otherJobType ?? '',
                startDate: new Date(booking?.schedule.startDate) ?? '',
                shiftTime: booking?.schedule.shiftTime ?? 'none',
                durationType: booking?.schedule.bookingDuration ?? [],
                state: booking?.state ?? '',
                city: booking?.city ?? '',
                siteAddress: booking?.siteAddress ?? 0,
                qtyHelper: booking?.peopleRequired.HELPER ?? 0,
                qtyTechnician: booking?.peopleRequired.TECHNICIAN ?? 0,
                qtySupervisor: booking?.peopleRequired.SUPERVISOR ?? new Date(),
                cmpName: booking?.cmpName ?? bookingDurations[0],
                name: booking?.userName ?? 'none',
                email: booking?.email ?? 'none',
                phoneNumber: booking?.phoneNumber ?? 'none',
                wageHelper: booking?.rateCard?.HELPER ?? '',
                wageSupervisor: booking?.rateCard?.SUPERVISOR ?? '',
                shiftStartTime: booking?.schedule?.shiftStartTime ?? 'none',
                shiftEndTime: booking?.schedule?.shiftEndTime ?? 'none',
                wageTechnition: booking?.rateCard?.TECHNICIAN ?? '',
                overTimeRate: booking?.overTime?.rate ?? 'none',
                overTimeBuffer: booking?.overTime?.buffer ?? 30,
                overTimeBufferType: booking?.overTime?.bufferType ?? 'minutes',
                holidayDays: booking?.holidayDays ?? [],
                siteImages: booking?.images?.site ?? [],
                accomodationImages: booking?.images?.accommodations ?? [],
                isHolidayPaid: booking?.isHolidayPaid ?? false,
                accomodation: booking?.benefits?.includes('ACCOMODATION') ?? false,
                travelAllowance: booking?.benefits?.includes('PAID_TRAVEL') ?? false,
                pf: booking?.benefits?.includes('PF') ?? false,
                esi: booking?.benefits?.includes('INSURANCE') ?? false,

                food: booking?.benefits?.includes('FOOD') ?? false,
            })
        }
    }, [booking])

    const uploadImages = useCallback(
        async (type, files) => {
            setIsUploadingImages((old) => ({
                ...old,
                [type]: true,
            }))
            let fieldName = ''
            let imgType = ''
            switch (type) {
                case 'site':
                    fieldName = 'siteImages'
                    imgType = 'site'
                    break
                case 'accomodation':
                    fieldName = 'accomodationImages'
                    imgType = 'accommodations'
                    break
            }
            const uploadableImages = files.filter((file) =>
                ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
            )
            if (files.length !== uploadableImages.length) {
                showSnackbar({
                    msg: 'Invalid file type found!',
                    sev: 'error',
                })
                setIsUploadingImages((old) => ({
                    ...old,
                    [type]: false,
                }))
                return
            }

            const res = await Promise.all(
                uploadableImages.map((img) => {
                    //uploading file
                    const formData = new FormData()
                    formData.set('type', imgType)
                    formData.set('file', img)
                    console.log(img.type)
                    return axios.post(`${SERVER_URL}/admin/bookings/${booking?.bookingId}/images`, formData)
                })
            )

            const uploadSuccess = res.filter(({ status }) => status === 200)

            if (uploadSuccess.length === res.length) {
                showSnackbar({
                    msg: 'All Images Uploaded Successfully!',
                    sev: 'success',
                })
            } else {
                showSnackbar({
                    msg: 'Failed to upload Some or All images',
                    sev: 'error',
                })
            }

            form.setFieldValue(fieldName, [
                ...form.values[fieldName],
                ...uploadSuccess.map(({ data }) => {
                    return data.payload.url
                }),
            ])
            setIsUploadingImages((old) => ({
                ...old,
                [type]: false,
            }))
        },
        [booking, form, showSnackbar]
    )
    return useMemo(
        () => ({
            booking: booking,
            updateBooking: updateBooking,
            form: form,
            formDisabled: formDisabled,
            checkError: isError,
            getBooking: getBooking,
            siteImages: siteImages,
            setSiteImages: setSiteImages,
            accomoImages: accomoImages,
            setAccomoImages: setAccomoImages,
            uploadImages: uploadImages,
            editForm: editForm,
            isUploadingImages: isUploadingImages,
        }),
        [
            booking,
            updateBooking,
            form,
            formDisabled,
            isError,
            siteImages,
            setSiteImages,
            accomoImages,
            setAccomoImages,
            getBooking,
            uploadImages,
            isUploadingImages,
            editForm,
        ]
    )
}
