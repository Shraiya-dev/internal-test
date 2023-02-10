import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { Router, useNavigate, useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { isPinCodeValid, validateRegex } from '../../../utils/formikValidate'
import { regexPatterns } from '../../Registration/utils/constants/regexPatterns'
const SERVER_URL = getBackendUrl()

export const useCreateProject = () => {
    const { customerId, organisationId } = useParams()
    const [isUploadingImages, setIsUploadingImages] = useState({
        site: false,
        accommodation: false,
        projectVideo: false,
    })
    const navigate = useNavigate()

    const { showSnackbar } = useSnackbar()
    const form = useFormik({
        initialValues: {
            projectName: '',
            siteAddress: '',
            state: 'none',
            city: 'none',
            pincode: '',
            phoneNumber: '',
            shiftTime: '',
            pf: '',
            esi: '',
            food: '',
            accommodation: '',
            joiningBonus: '',
            guaranteedSalary: '',
            weeklyKharchi: '',
            medicalSupport: '',
            otf: 'none',
            workerCount: '',
            geoLocation: '',
            projectVideo: [],
            siteImages: [],
            accommodationImages: [],
        },
        validate: (values) => {
            const errors = {}
            if (values.projectName === '') {
                errors.projectName = 'Required *'
            }
            if (values.state === 'none') {
                errors.state = 'Required *'
            }
            if (values.city === 'none') {
                errors.city = 'Required *'
            }
            return errors
        },
        onSubmit: async (values, fh) => {
            const payload = {
                name: values.projectName,
                customerId: customerId,
                siteAddress: values.siteAddress,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                // overTime: {
                //     rate: values.otf,
                // },
                benefits: [
                    values.pf ? 'PF' : '',
                    values.esi ? 'INSURANCE' : '',
                    values.accomodation ? 'ACCOMODATION' : '',
                    values.travelAllowance ? 'PAID_TRAVEL' : '',
                    values.food ? 'FOOD' : '',
                    values.joiningBonus ? 'JOINING_BONUS' : '',
                    values.guaranteedSalary ? 'GUARANTEED_SALARY' : '',
                    values.weeklyKharchi ? 'WEEKLY_KHARCHI' : '',
                    values.medicalSupport ? 'MEDICAL_SUPPORT' : '',
                ].filter((item) => item !== ''),
                images: {
                    accommodations: values.accommodationImages,
                    site: values.siteImages,
                },
                projectLocation: {
                    latitude: Number(values.geoLocation.split(', ')[0]),
                    longitude: Number(values.geoLocation.split(', ')[1]),
                },
                videos: values.projectVideo,
            }
            try {
                const res = await axios.post(`${SERVER_URL}/gateway/admin-api/projects/`, payload)
                showSnackbar({
                    msg: 'Project Created Successfully',
                    sev: 'success',
                })
                fh.resetForm()
                navigate(`/projects/${res?.data?.payload?.projectId}`)
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
        },
    })
    const uploadFiles = useCallback(
        async (type, files) => {
            setIsUploadingImages((old) => ({
                ...old,
                [type]: true,
            }))
            try {
                let fieldName = ''
                let fileType = ''
                switch (type) {
                    case 'projectVideo':
                        fieldName = 'projectVideo'
                        fileType = 'project_details'
                        break
                    case 'site':
                        fieldName = 'siteImages'
                        fileType = 'site'
                        break
                    case 'accommodation':
                        fieldName = 'accommodationImages'
                        fileType = 'accommodations'
                        break
                }
                const uploadableFile = files.filter((file) => {
                    if (fieldName === 'projectVideo') {
                        return ['video/mp4'].includes(file.type)
                    }
                    return ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
                })
                if (files.length !== uploadableFile.length) {
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
                    uploadableFile.map((file) => {
                        //uploading file
                        const formData = new FormData()
                        formData.set('type', fileType)
                        formData.set('file', file)
                        formData.set('entity', 'project')
                        formData.set('customerId', customerId)
                        return new Promise(async (res, rej) => {
                            try {
                                if (fieldName === 'projectVideo') {
                                    const response = await axios.post(
                                        `${SERVER_URL}/gateway/admin-api/videos`,
                                        formData
                                    )
                                    res(response)
                                } else {
                                    const response = await axios.post(
                                        `${SERVER_URL}/gateway/admin-api/images`,
                                        formData
                                    )
                                    res(response)
                                }
                            } catch (error) {
                                res(error)
                            }
                        })
                    })
                )

                const uploadSuccess = res.filter(({ status }) => status === 200)

                if (uploadSuccess.length === res.length) {
                    showSnackbar({
                        msg: 'All files Uploaded Successfully!',
                        sev: 'success',
                    })
                } else {
                    showSnackbar({
                        msg: 'Failed to upload Some or All files',
                        sev: 'error',
                    })
                }
                if (fieldName === 'projectVideo') {
                    form.setFieldValue(fieldName, [
                        ...form.values[fieldName],
                        ...uploadSuccess.map(({ data }) => {
                            return {
                                type: 'project_details',
                                url: data.payload.url,
                            }
                        }),
                    ])
                } else {
                    form.setFieldValue(fieldName, [
                        ...form.values[fieldName],
                        ...uploadSuccess.map(({ data }) => {
                            return data.payload.url
                        }),
                    ])
                }
            } catch (error) {}

            setIsUploadingImages((old) => ({
                ...old,
                [type]: false,
            }))
        },
        [form, showSnackbar, customerId]
    )
    return useMemo(
        () => ({
            form: form,
            isUploadingImages,
            uploadFiles,
        }),
        [form, isUploadingImages, uploadFiles]
    )
}
