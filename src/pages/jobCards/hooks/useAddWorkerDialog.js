import axios from 'axios'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { getBackendUrl } from '../../../api'
const SERVER_URL = getBackendUrl()

const useAddWorkerDialog = (jobIdForSkillType) => {
    const [sncBar, setSncBar] = useState({})

    const setSnackBar = useCallback(
        (props) => {
            setSncBar({
                msg: '',
            })
            setSncBar(props)
        },
        [setSncBar]
    )
    const [workerDetail, setWorkerDetail] = useState()
    const form = useFormik({
        initialValues: {
            skillType: 'none',
            phoneNumber: '',
        },
        validate: (values) => {
            const errors = {}
            // if (values.phoneNumber.length < 10) {
            // 	errors.phoneNumber = 'Enter Valid phoneNumber'
            // }
            return errors
        },
        onSubmit: async (values) => {
            const urlParams = new URLSearchParams()
            urlParams.set('phoneNumber', values.phoneNumber)
            try {
                const { data, status } = await axios.get(`${SERVER_URL}/admin/workers?${urlParams.toString()}`)
                if (data.payload.response.length > 0) {
                    setWorkerDetail(data.payload.response[0])
                } else {
                    setSnackBar({
                        msg: 'No Worker found with given details',
                        sev: 'info',
                    })
                }
            } catch (error) {
                setSnackBar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
            }
        },
    })

    const addWorkerJobCardAsRTD = useCallback(async () => {
        try {
            const { status, data } = await axios.put(`${SERVER_URL}/admin/job-cards/assisted-rtd`, {
                jobId: jobIdForSkillType[workerDetail.skillType],
                workerId: workerDetail.id,
            })
            setSnackBar({
                msg: 'worker add as RTD successfully',
                sev: 'success',
            })
        } catch (error) {
            if (error.response.status === 400) {
                setSnackBar({
                    msg: error.response.data.developerInfo,
                    sev: 'error',
                })
                return
            }
            setSnackBar({
                msg: 'Something went wrong while adding worker as rtd ',
                sev: 'error',
            })
        }
    }, [jobIdForSkillType, workerDetail])

    return useMemo(
        () => ({
            form: form,
            workerDetail: workerDetail,
            setWorkerDetail: setWorkerDetail,
            addWorkerJobCardAsRTD: addWorkerJobCardAsRTD,
            sncBar: sncBar,
            setSnackBar: setSnackBar,
        }),
        [form, workerDetail, addWorkerJobCardAsRTD, sncBar, setSnackBar]
    )
}

export default useAddWorkerDialog
