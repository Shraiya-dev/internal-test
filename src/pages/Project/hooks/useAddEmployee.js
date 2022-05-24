import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo } from 'react'
import { getBackendUrl } from '../../../api'
import { useFormikProps } from '../../../hooks/useFormikProps'
import { useSearchWorker } from '../../workers/useSearchWorker'
import { useProjectDetails } from '../provider/ProjectProvider'
const SERVER_URL = getBackendUrl()
const useAddEmployee = (onConfirm, handelClose) => {
    const { form: searchForm, workers, setWorkers } = useSearchWorker()
    const { project } = useProjectDetails()
    const workerDetails = useMemo(() => (workers?.length ? workers[0] : undefined), [workers])

    const createEmployee = useCallback(
        async (values, fh) => {
            const payload = {
                workerId: workerDetails?.workerId,
                jobType: workerDetails?.jobType,
                skillType: workerDetails?.skillType,
                hasESI: values.hasESI,
                hasPF: values.hasPF,
                wage: values.wage,
                otFactor: values.otFactor,
                shiftStartTime: values.shiftStartTime,
                shiftEndTime: values.shiftEndTime,
                projectId: project?._id,
                lateralType: values.lateralType,
            }

            await onConfirm(payload)
            handelClose()
            fh.resetForm()
            searchForm.resetForm()
        },
        [workerDetails, project, onConfirm]
    )

    const form = useFormik({
        initialValues: {
            jobType: 'none',
            skillType: 'none',
            wage: '',
            lateralType: 'none',
            hasESI: '',
            hasPF: '',
            otFactor: 'none',
            shiftStartTime: 'none',
            shiftEndTime: 'none',
        },
        validate: (values) => {
            const errors = {}

            if (values.wage === '') {
                errors.wage = 'wage is required'
            }
            if (values.wage !== '' && isNaN(Number(values.wage))) {
                errors.wage = 'wage can only be number'
            }
            if (values.wage !== '' && Number(values.wage) < 0) {
                errors.wage = 'wage should be between 0 to 2000'
            }
            if (values.wage !== '' && Number(values.wage) > 2000) {
                errors.wage = 'wage should be between 0 to 2000'
            }
            if (values.lateralType === 'none') {
                errors.lateralType = 'Lateral Type of hiring is required'
            }
            if (values.hasESI === '') {
                errors.hasESI = 'Please select yes or no'
            }
            if (values.hasPF === '') {
                errors.hasPF = 'Please select yes or no'
            }
            if (values.shiftStartTime === 'none') {
                errors.shiftStartTime = 'required *'
            }
            if (values.shiftEndTime === 'none') {
                errors.shiftEndTime = 'required *'
            }
            if (values.otFactor === 'none') {
                errors.otFactor = 'required *'
            }
            return errors
        },
        onSubmit: createEmployee,
    })
    const formikProps = useFormikProps(form)
    const searchFormikProps = useFormikProps(searchForm)
    const resetForms = useCallback(() => {
        form.resetForm()
        searchForm.resetForm()
        setWorkers()
    }, [form, searchForm])
    useEffect(() => {
        form.setValues((prev) => ({
            ...prev,
            jobType: workerDetails?.jobType ?? 'none',
            skillType: workerDetails?.skillType ?? 'none',
            otFactor: project?.overTime?.rate,
            hasPF: project?.benefits?.includes('PF'),
            hasESI: project?.benefits?.includes('ESI'),
        }))
    }, [project, workerDetails])

    return {
        form,
        formikProps,
        searchFormikProps,
        searchForm,
        workerDetails,
        resetForms,
    }
}

export default useAddEmployee
