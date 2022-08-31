import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
import { useSnackbar } from '../../../providers/SnackbarProvider'
const SERVER_URL = getBackendUrl()
const ProjectContext = createContext()
const { Provider, Consumer } = ProjectContext

const ProjectProvider = ({ children }) => {
    const { projectId } = useParams()
    const [response, setResponse] = useState({
        customer: undefined,
        project: undefined,
        stats: undefined,
    })

    const { showSnackbar } = useSnackbar()

    const createProject = useCallback(async () => {
        //todo Create project api logic here
    }, [])
    const getProject = useCallback(async () => {
        try {
            const { status, data } = await axios.get(`${SERVER_URL}/gateway/admin-api/projects/${projectId}`)
            setResponse(data.payload)
        } catch (error) {
            showSnackbar({
                msg: error?.response?.data?.developerInfo,
                sev: 'error',
            })
        }
    }, [projectId])
    const updateProject = useCallback(
        async (payload) => {
            try {
                const { status, data } = await axios.put(
                    `${SERVER_URL}/gateway/admin-api/projects/${projectId}`,
                    payload
                )
                showSnackbar({
                    msg: 'Updated Project successfully!',
                    sev: 'success',
                })
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
            await getProject()
        },
        [projectId]
    )
    const createBookingInProject = useCallback(
        async (payload) => {
            try {
                // const { status, data } = await axios.put(
                //     `${SERVER_URL}/gateway/admin-api/projects/${projectId}`,
                //     payload
                // )
                showSnackbar({
                    msg: 'Updated Project successfully!',
                    sev: 'success',
                })
            } catch (error) {
                showSnackbar({
                    msg: error?.response?.data?.developerInfo,
                    sev: 'error',
                })
            }
            await getProject()
        },
        [projectId]
    )

    //get project details on provider load
    useEffect(getProject, [])

    const providerValue = useMemo(
        () => ({
            createProject: createProject,
            getProject: getProject,
            updateProject: updateProject,
            project: response?.project,
            createBookingInProject: createBookingInProject,
            customer: response?.customer,
        }),
        [getProject, updateProject, createProject, response]
    )
    return <Provider value={providerValue}>{children}</Provider>
}
export const useProjectDetails = () => useContext(ProjectContext)

export { ProjectProvider, Consumer as ProjectConsumer, ProjectContext }
