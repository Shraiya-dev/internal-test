import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
import { isPinCodeValid } from '../../../utils/formikValidate'
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
            pf: '',
            esi: '',
            otf: 'none', // over time factor
            accommodation: '',
            food: '',
            siteImages: [],
            accommodationImages: [],
        },
        validate: (values) => {
            const errors = {}
            if (values.projectName === '') {
                errors.projectName = 'Required *'
            }
            if (values.siteAddress === '') {
                errors.siteAddress = 'Required *'
            }
            if (values.state === 'none') {
                errors.state = 'Required *'
            }
            if (values.city === 'none') {
                errors.city = 'Required *'
            }

            if (values.pincode === '') {
                errors.pincode = 'Required *'
            }
            if (values.pincode !== '' && !isPinCodeValid(values.pincode)) {
                errors.pincode = 'Invalid format *'
            }

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
                    values.esi ? 'ESI' : '',
                    values.accommodation ? 'ACCOMODATION' : '',
                    values.food ? 'FOOD' : '',
                ].filter((item) => item !== ''),
                images: {
                    accommodations: values.accommodationImages,
                    site: values.siteImages,
                },
            }
            await updateProject(payload)
            handleDisable()
        },
    })
    const uploadImages = useCallback(
        async (type, files) => {
            setIsUploadingImages((old) => ({
                ...old,
                [type]: true,
            }))
            try {
                let fieldName = ''
                let imgType = ''
                switch (type) {
                    case 'site':
                        fieldName = 'siteImages'
                        imgType = 'site'
                        break
                    case 'accommodation':
                        fieldName = 'accommodationImages'
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
                        formData.set('entity', 'project')
                        formData.set('customerId', customer?.customerId)
                        return axios.post(`${SERVER_URL}/gateway/admin-api/images`, formData)
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
            } catch (error) {}

            setIsUploadingImages((old) => ({
                ...old,
                [type]: false,
            }))
        },
        [form, showSnackbar, customer]
    )

    useEffect(() => {
        console.log(project)
        form.setValues({
            projectName: project?.name ?? '',
            siteAddress: project?.siteAddress ?? '',
            state: project?.state ?? 'none',
            city: project?.city ?? 'none',
            pincode: project?.pincode ?? '',
            pf: project?.benefits?.includes('PF') ?? '',
            esi: project?.benefits?.includes('ESI') ?? '',
            otf: project?.overTime?.rate ?? 'none',
            accommodation: project?.benefits?.includes('ACCOMMODATION') ?? '',
            food: project?.benefits?.includes('FOOD') ?? '',
            siteImages: project?.images?.site ?? [],
            accommodationImages: project?.images?.accommodations ?? [],
        })
    }, [project])

    return useMemo(
        () => ({
            form: form,
            disabled: disabled,
            handleDisable: handleDisable,
            isUploadingImages,
            uploadImages,
        }),
        [form, disabled, handleDisable, isUploadingImages, uploadImages]
    )
}
