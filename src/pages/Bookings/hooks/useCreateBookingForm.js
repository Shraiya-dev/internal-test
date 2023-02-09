import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { BookingDurations } from '../../../constant/booking'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { checkError } from '../../../utils/formikValidate'
import { useProjectDetails } from '../../Project/provider/ProjectProvider'
const SERVER_URL = getBackendUrl()
export const useCreateBookingForm = () => {
    const { project, customer, createBookingInProject } = useProjectDetails()

    const [siteImages, setSiteImages] = useState([])
    const [accomoImages, setAccomoImages] = useState([])

    const { showSnackbar } = useSnackbar()
    const [isUploadingImages, setIsUploadingImages] = useState({
        site: false,
        accomodation: false,
    })
    const navigate = useNavigate()
    const updateBooking = useCallback(
        async (values) => {
            const createBookingData = {
                projectId: project?.id,
                customerId: customer?.customerId,
                jobType: values?.jobType,
                tags: [],
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
                startDate: values.startDate,

                // shiftTime: `${values.shiftStartTime}-${values.shiftEndTime}`,
                bookingDuration: values?.durationType,
                // overTime: {
                //     rate: values.overTimeRate,
                // },
                dailyTarget: {
                    HELPER:
                        Number(values.dtHelper) !== 0 || values.pduHelper !== 'none'
                            ? {
                                  target: Number(values.dtHelper),
                                  metric: values.pduHelper,
                              }
                            : undefined,
                    TECHNICIAN:
                        Number(values.dtTechnician) !== 0 || values.pduTechnician !== 'none'
                            ? {
                                  target: Number(values.dtTechnician),
                                  metric: values.pduTechnician,
                              }
                            : undefined,
                    SUPERVISOR:
                        Number(values.dtSupervisor) !== 0 || values.pduSupervisor !== 'none'
                            ? {
                                  target: Number(values.dtSupervisor),
                                  metric: values.pduSupervisor,
                              }
                            : undefined,
                },
            }

            try {
                const { status, data } = await axios.post(`${SERVER_URL}/gateway/admin-api/bookings`, createBookingData)
                showSnackbar({
                    msg: 'Booking Updated Successfully',
                    sev: 'success',
                })
                navigate(`/bookings/${data?.payload?.bookingId}`)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
        [showSnackbar, project, customer]
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
            qtyHelper: '',
            qtyTechnician: '',
            qtySupervisor: '',
            startDate: new Date(),
            durationType: BookingDurations[0],
            state: 'none',
            city: 'none',
            // shiftTime: 'none',
            // shiftStartTime: 'none',
            // shiftEndTime: 'none',
            wageHelper: '',
            wageSupervisor: '',
            wageTechnician: '',
            dtHelper: '',
            dtSupervisor: '',
            dtTechnician: '',
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
            if (values.jobType === 'none') {
                errors.jobType = true
            }
            // if (values.shiftStartTime === 'none') {
            //     errors.shiftStartTime = true
            // }
            // if (values.shiftEndTime === 'none') {
            //     errors.shiftEndTime = true
            // }
            if (Number(values.qtyHelper) && values.wageHelper === '') {
                errors.wageHelper = true
            }

            if (values.qtyHelper == 0 && values.qtySupervisor == 0 && values.qtyTechnician == 0) {
                errors.qtyHelper = true
                errors.qtySupervisor = true
                errors.qtyTechnician = true
            }

            // if qtyHelper is not 0 that time wages can't be 0
            if (Number(values.qtyHelper)) {
                if (Number(values.wageHelper) === 0) errors.wageHelper = true
                if (Number(values.dtHelper) === 0) errors.dtHelper = true
                if (values.pduHelper === 'none') errors.pduHelper = true
            }

            if (Number(values.qtySupervisor) && values.wageSupervisor === '') {
                errors.wageSupervisor = true
            }
            // if qtySupervisor is not 0 that time wages can't be 0
            if (Number(values.qtySupervisor)) {
                if (Number(values.wageSupervisor) === 0) errors.wageSupervisor = true
                if (Number(values.dtSupervisor) === 0) errors.dtSupervisor = true
                if (values.pduSupervisor === 'none') errors.pduSupervisor = true
            }

            if (Number(values.qtyTechnician) && values.wageTechnician === '') {
                errors.wageTechnician = true
            }

            // if qtySupervisor is not 0 that time wages can't be 0
            if (Number(values.qtyTechnician)) {
                if (Number(values.wageTechnician) === 0) errors.wageTechnician = true
                if (Number(values.dtTechnician) === 0) errors.dtTechnician = true
                if (values.pduTechnician === 'none') errors.pduTechnician = true
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
            return checkError(fieldName, form)
        },
        [form]
    )

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
        [project, customer, form, showSnackbar]
    )
    return useMemo(
        () => ({
            customer: customer,
            project: project,
            updateBooking: updateBooking,
            form: form,
            checkError: isError,
            siteImages: siteImages,
            setSiteImages: setSiteImages,
            accomoImages: accomoImages,
            setAccomoImages: setAccomoImages,
            uploadImages: uploadImages,
            isUploadingImages: isUploadingImages,
        }),
        [
            customer,
            project,
            updateBooking,
            form,
            isError,
            siteImages,
            setSiteImages,
            accomoImages,
            setAccomoImages,
            uploadImages,
            isUploadingImages,
        ]
    )
}
