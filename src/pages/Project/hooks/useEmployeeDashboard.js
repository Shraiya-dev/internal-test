import { debounce } from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getBackendUrl } from '../../../api'
const SERVER_URL = getBackendUrl()

export const useEmployeeDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [response, setResponse] = useState({
        employees: [],
        hasMore: false,
    })
    const { projectId } = useParams()
    const [isLoading, setIsLoading] = useState(false)

    const getEmployees = useCallback(
        debounce(async (searchParams) => {
            if (searchParams.get('phoneNumber') && searchParams.get('phoneNumber').length !== 10) return
            setIsLoading(true)
            try {
                const nsp = new URLSearchParams(searchParams)
                nsp.set('projectId', projectId)
                Number(searchParams.get('pageNumber')) > 1
                    ? nsp.set('pageNumber', Number(searchParams.get('pageNumber')) - 1)
                    : nsp.delete('pageNumber')
                nsp.set('pageSize', 20)
                const { data, status } = await axios.get(`${SERVER_URL}/gateway/admin-api/employees?${nsp.toString()}`)
                setResponse(data.payload)
            } catch (error) {}
            setIsLoading(false)
        }, 500),
        []
    )
    const refreshList = useCallback(() => {
        getEmployees(searchParams)
    }, [searchParams, getEmployees])
    useEffect(() => {
        getEmployees(searchParams)
    }, [searchParams])
    const { response: employees, hasMore } = response
    return useMemo(
        () => ({ hasMore, isLoading, employees, refreshList, getEmployees }),
        [hasMore, isLoading, employees, refreshList, getEmployees]
    )
}
