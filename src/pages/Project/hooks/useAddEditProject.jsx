import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { isPinCodeValid, validateRegex } from '../../../utils/formikValidate'
import { regexPatterns } from '../../Registration/utils/constants/regexPatterns'
import { useProjectDetails } from '../provider/ProjectProvider'
const SERVER_URL = getBackendUrl()

export const useAddEditProject = () => {
    const { projectId } = useParams()
    const [disabled, setDisabled] = useState(projectId && true)
    const { project, customer, updateProject } = useProjectDetails()
    const [isUploadingImages, setIsUploadingImages] = useState({
        site: false,
        accommodation: false,
    })
    const handleDisable = () => {
        setDisabled(!disabled)
    }
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
            otf: 'none', // over time factor
            workerCount: '',
            geoLocation: '',
            projectVideo: [],
            accommodation: '',
            pf: '',
            esi: '',
            food: '',
            joiningBonus: '',
            guaranteedSalary: '',
            weeklyKharchi: '',
            medicalSupport: '',
            siteImages: [],
            accommodationImages: [],
        },
        validate: (values) => {
            const errors = {}
            // if (values.projectName === '') {
            //     errors.projectName = 'Required *'
            // }
            // if (values.siteAddress === '') {
            //     errors.siteAddress = 'Required *'
            // }
            if (values.state === 'none') {
                errors.state = 'Required *'
            }
            if (values.city === 'none') {
                errors.city = 'Required *'
            }

            // if (values.pincode === '') {
            //     errors.pincode = 'Required *'
            // }
            // if (values.pincode !== '' && !isPinCodeValid(values.pincode)) {
            //     errors.pincode = 'Invalid format *'
            // }
            // if (values.geoLocation === '') {
            //     errors.geoLocation = 'Required *'
            // }
            // if (values.geoLocation !== '' && !validateRegex(regexPatterns.geoLocation, values.geoLocation)) {
            //     errors.geoLocation = 'Invalid format *'
            // }

            if (values.pf === '') {
                errors.pf = 'Required *'
            }
            if (values.esi === '') {
                errors.esi = 'Required *'
            }
            if (values.otf === 'none') {
                errors.otf = 'Required *'
            }
            if (values.accommodation === '') {
                errors.accommodation = 'Required *'
            }
            if (values.food === '') {
                errors.food = 'Required *'
            }
            if (values.joiningBonus === '') {
                errors.joiningBonus = 'Required *'
            }
            if (values.guaranteedSalary === '') {
                errors.guaranteedSalary = 'Required *'
            }
            if (values.weeklyKharchi === '') {
                errors.weeklyKharchi = 'Required *'
            }
            if (values.medicalSupport === '') {
                errors.medicalSupport = 'Required *'
            }
            return errors
        },
        onSubmit: async (values) => {
            const payload = {
                name: values.projectName,
                siteAddress: values.siteAddress,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                overTime: {
                    rate: values.otf,
                },
                benefits: [
                    values.pf ? 'PF' : '',
                    values.esi ? 'INSURANCE' : '',
                    values.accommodation ? 'ACCOMODATION' : '',
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
            await updateProject(payload)
            handleDisable()
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
                        formData.set('customerId', customer?.customerId)
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
        [form, showSnackbar, customer]
    )

    useEffect(() => {
        form.setValues({
            projectName: project?.name ?? '',
            siteAddress: project?.siteAddress ?? '',
            state: project?.state ?? 'none',
            city: project?.city ?? 'none',
            pincode: project?.pincode ?? '',
            pf: project?.benefits?.includes('PF') ?? '',
            esi: project?.benefits?.includes('INSURANCE') ?? '',
            otf: project?.overTime?.rate ?? 'none',
            accommodation: project?.benefits?.includes('ACCOMODATION') ?? '',
            joiningBonus: project?.benefits?.includes('JOINING_BONUS') ?? '',
            guaranteedSalary: project?.benefits?.includes('GUARANTEED_SALARY') ?? '',
            weeklyKharchi: project?.benefits?.includes('WEEKLY_KHARCHI') ?? '',
            medicalSupport: project?.benefits?.includes('MEDICAL_SUPPORT') ?? '',
            food: project?.benefits?.includes('FOOD') ?? '',
            siteImages: project?.images?.site ?? [],
            accommodationImages: project?.images?.accommodations ?? [],
            geoLocation: `${project?.projectLocation?.latitude ?? ''}, ${project?.projectLocation?.longitude ?? ''}`,
            projectVideo: project?.videos ?? [],
        })
    }, [project])

    return useMemo(
        () => ({
            form: form,
            disabled: disabled,
            handleDisable: handleDisable,
            isUploadingImages,
            uploadFiles,
        }),
        [form, disabled, handleDisable, isUploadingImages, uploadFiles]
    )
}
