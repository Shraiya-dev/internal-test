import axios from 'axios'
import { useCallback } from 'react'
import { getBackendUrl } from '../../../api'
import { useLoader } from '../../../providers/LoaderProvider'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()

export const useEmployeeActions = () => {
    const { showSnackbar } = useSnackbar()
    const { showLoader } = useLoader()
    const addEmployeeToProject = useCallback(async (payload) => {
        try {
            const { status } = await axios.post(`${SERVER_URL}/gateway/admin-api/employees/lateral`, payload)
            showSnackbar({
                msg: 'Employee Added Successfully.',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
    }, [])
    const editEmployee = useCallback((payload) => {}, [])
    const terminateEmployee = useCallback(async (employeeId, payload) => {
        showLoader(true)
        try {
            const { status, data } = await axios.post(
                `${SERVER_URL}/gateway/admin-api/employees/${employeeId}/terminate`,
                {
                    jobCompletionCode: payload.completionCode,
                    partialCompletionReason:
                        payload.partialCompletionReason === 'none' ? undefined : payload.partialCompletionReason,
                    description: payload.description,
                }
            )
            showSnackbar({
                msg: 'Employment Terminated',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    const completeEmployment = useCallback(async (employeeId, payload) => {
        showLoader(true)
        try {
            const { status, data } = await axios.post(
                `${SERVER_URL}/gateway/admin-api/employees/${employeeId}/complete`,
                {
                    jobCompletionCode: 'TENURE_COMPLETE',
                }
            )
            showSnackbar({
                msg: 'Employment Completed',
                sev: 'success',
            })
        } catch (error) {
            showSnackbar({
                msg: error.response.data.developerInfo,
                sev: 'error',
            })
        }
        showLoader(false)
    }, [])
    return { addEmployeeToProject, terminateEmployee, completeEmployment }
}
