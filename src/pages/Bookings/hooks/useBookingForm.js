import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { BookingDurations } from '../../../constant/booking'
import { useBooking } from '../../../providers/BookingProvider'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { checkError } from '../../../utils/formikValidate'
const SERVER_URL = getBackendUrl()
export const useBookingForm = () => {
    const { bookingId } = useParams()
    const { getBooking, booking, project, customer } = useBooking()

    const [formDisabled, setFormDisabled] = useState(true)
    const [siteImages, setSiteImages] = useState([])
    const [accomoImages, setAccomoImages] = useState([])

    const { showSnackbar } = useSnackbar()
    const [isUploadingImages, setIsUploadingImages] = useState({
        site: false,
        accomodation: false,
    })
    const editForm = useCallback((val) => {
        setFormDisabled(!val)
    }, [])
    const updateBooking = useCallback(
        async (values) => {
            const updateBookingData = {
                requirements: {
                    SUPERVISOR: {
                        count: Number(values.qtySupervisor),
                        wage: Number(values.wageSupervisor),
                    },
                    HELPER: {
                        count: Number(values.qtyHelper),
                        wage: Number(values.wageHelper),
                    },
                    TECHNICIAN: {
                        count: Number(values.qtyTechnician),
                        wage: Number(values.wageTechnician),
                    },
                },
                // benefits: [
                //     values.pf ? 'PF' : '',
                //     values.esi ? 'INSURANCE' : '',
                //     values.accomodation ? 'ACCOMODATION' : '',
                //     values.travelAllowance ? 'PAID_TRAVEL' : '',
                //     values.food ? 'FOOD' : '',
                //     values.joiningBonus ? 'JOINING_BONUS' : '',
                //     values.guaranteedSalary ? 'GUARANTEED_SALARY' : '',
                //     values.weeklyKharchi ? 'WEEKLY_KHARCHI' : '',
                //     values.medicalSupport ? 'MEDICAL_SUPPORT' : '',
                // ].filter((item) => item !== ''),
                // startDate: values.startDate,

                // shiftTime: `${values.shiftStartTime}-${values.shiftEndTime}`,
                // bookingDuration: values?.durationType,
                // overTime: {
                //     rate: values.overTimeRate,
                // },
                // dailyTarget: {
                //     HELPER:
                //         Number(values.dtHelper) !== 0 && values.pduHelper !== 'none'
                //             ? {
                //                   target: Number(values.dtHelper),
                //                   metric: values.pduHelper,
                //               }
                //             : undefined,
                //     TECHNICIAN:
                //         Number(values.dtTechnician) !== 0 && values.pduTechnician !== 'none'
                //             ? {
                //                   target: Number(values.dtTechnician),
                //                   metric: values.pduTechnician,
                //               }
                //             : undefined,
                //     SUPERVISOR:
                //         Number(values.dtSupervisor) !== 0 && values.pduSupervisor !== 'none'
                //             ? {
                //                   target: Number(values.dtSupervisor),
                //                   metric: values.pduSupervisor,
                //               }
                //             : undefined,
                // },
            }

            try {
                const { status, data } = await axios.put(
                    `${SERVER_URL}/gateway/admin-api/bookings/${booking?.bookingId}`,
                    updateBookingData
                )
                showSnackbar({
                    msg: 'Booking Updated Successfully',
                    sev: 'success',
                })
                editForm(false)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
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
            durationType: BookingDurations[0],
            state: 'none',
            city: 'none',
            shiftTime: 'none',
            shiftStartTime: 'none',
            shiftEndTime: 'none',
            wageHelper: '',
            wageSupervisor: '',
            wageTechnician: '',
            dtHelper: 0,
            dtSupervisor: 0,
            dtTechnician: 0,
            pduHelper: 'none',
            pduSupervisor: 'none',
            pduTechnician: 'none',
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
            joiningBonus: false,
            guaranteedSalary: false,
            weeklyKharchi: false,
            medicalSupport: false,
            siteImages: [],
            accomodationImages: [],
        },
        validate: (values) => {
            const errors = {}
            if (Number(values.qtyHelper) && values.wageHelper === '') {
                errors.wageHelper = true
            }

            if (values.qtyHelper == 0 && values.qtySupervisor == 0 && values.qtyTechnician == 0) {
                errors.qtyHelper = true
                errors.qtySupervisor = true
                errors.qtyTechnician = true
            }

            // if qtyHelper is not 0 that time wages can't be 0
            if (Number(values.qtyHelper && Number(values.wageHelper) === 0)) {
                errors.wageHelper = true
            }

            if (Number(values.qtySupervisor) && values.wageSupervisor === '') {
                errors.wageSupervisor = true
            }
            // if qtySupervisor is not 0 that time wages can't be 0
            if (Number(values.qtySupervisor && Number(values.wageSupervisor) === 0)) {
                errors.wageSupervisor = true
            }

            if (Number(values.qtyTechnician) && values.wageTechnician === '') {
                errors.wageTechnician = true
            }

            //if qtyTechnician is not 0 that time wages can't be 0
            if (Number(values.qtyTechnician && Number(values.wageTechnician) === 0)) {
                errors.wageTechnician = true
            }

            // if (values.overTimeRate === 'none') {
            //     errors.overTimeRate = true
            // }

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
        if (booking || customer || project) {
            form.setValues({
                jobType: booking?.jobType ?? '',
                tags: [...booking?.tags],
                otherJobType: booking?.otherJobType ?? '',
                startDate: booking?.schedule?.startDate ? new Date(booking?.schedule?.startDate) : new Date(),
                shiftTime: booking?.shiftTimings?.split('-')[0] ?? 'none',
                durationType: booking?.schedule?.bookingDuration ?? BookingDurations[0],
                state: project?.state ?? 'none',
                city: project?.city ?? 'none',
                siteAddress: project?.siteAddress ?? '',
                qtyHelper: booking?.peopleRequired.HELPER ?? 0,
                qtyTechnician: booking?.peopleRequired.TECHNICIAN ?? 0,
                qtySupervisor: booking?.peopleRequired.SUPERVISOR ?? 0,
                cmpName: customer?.companyName ?? '',
                name: customer?.name ?? '',
                email: customer?.email ?? '',
                phoneNumber: customer?.phoneNumber ?? '',
                wageSupervisor: booking?.rateCard?.SUPERVISOR ?? 0,
                wageTechnician: booking?.rateCard?.TECHNICIAN ?? 0,
                wageHelper: booking?.rateCard?.HELPER ?? 0,
                dtHelper: booking?.dailyTarget?.HELPER?.target ?? 0,
                dtSupervisor: booking?.dailyTarget?.SUPERVISOR?.target ?? 0,
                dtTechnician: booking?.dailyTarget?.TECHNICIAN?.target ?? 0,
                pduHelper: booking?.dailyTarget?.HELPER?.metric ?? 'none',
                pduSupervisor: booking?.dailyTarget?.SUPERVISOR?.metric ?? 'none',
                pduTechnician: booking?.dailyTarget?.TECHNICIAN?.metric ?? 'none',
                shiftStartTime: booking?.schedule?.shiftTime?.split('-')[0] ?? 'none',
                shiftEndTime: booking?.schedule?.shiftTime?.split('-')[1] ?? 'none',
                overTimeRate: booking?.overTime?.rate ?? 'none',
                overTimeBuffer: booking?.overTime?.buffer ?? 30,
                overTimeBufferType: booking?.overTime?.bufferType ?? 'minutes',
                holidayDays: booking?.holidayDays ?? [],
                siteImages: project?.images?.site ?? [],
                accomodationImages: project?.images?.accommodations ?? [],
                isHolidayPaid: booking?.isHolidayPaid ?? booking?.isHolidayPaid ?? false,
                accomodation: booking?.benefits?.includes('ACCOMODATION') ?? false,
                travelAllowance: booking?.benefits?.includes('PAID_TRAVEL') ?? false,
                joiningBonus: booking?.benefits?.includes('JOINING_BONUS') ?? false,
                guaranteedSalary: booking?.benefits?.includes('GUARANTEED_SALARY') ?? false,
                weeklyKharchi: booking?.benefits?.includes('WEEKLY_KHARCHI') ?? false,
                medicalSupport: booking?.benefits?.includes('MEDICAL_SUPPORT') ?? false,
                pf: booking?.benefits?.includes('PF') ?? false,
                esi: booking?.benefits?.includes('INSURANCE') ?? false,
                food: booking?.benefits?.includes('FOOD') ?? false,
            })
        }
    }, [booking, customer, project])

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
        [booking, project, customer, form, showSnackbar]
    )
    return useMemo(
        () => ({
            booking: booking,
            customer: customer,
            project: project,
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
            customer,
            project,
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
